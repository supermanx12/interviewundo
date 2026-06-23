import fs from 'fs';
import path from 'path';
import os from 'os';
import { Writable } from 'stream';
import Docker from 'dockerode';
import * as tar from 'tar';
import { logger } from '../config/logger';
import { IExecutor, TestCaseInput, TestCaseResult, ExecutionResult } from './IExecutor';

const docker = new Docker();

export class ReactExecutor implements IExecutor {
  /**
   * Generates the runner script that will run inside the container
   */
  private generateRunnerCode(): string {
    return `
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');

try {
  // 1. Read files map
  const files = JSON.parse(fs.readFileSync(path.join(__dirname, 'files.json'), 'utf8'));
  const testCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'testcases.json'), 'utf8'));

  // 2. Separate CSS and JS files
  let cssContent = '';
  let jsContent = '';

  for (const [filename, content] of Object.entries(files)) {
    if (filename.endsWith('.css')) {
      cssContent += content + '\\n';
    } else if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
      // Clean up imports and exports so it runs cleanly in JSDOM global context
      const cleaned = content
        .replace(/import\\s+.*?\\s+from\\s+['"]react['"];?/g, '')
        .replace(/import\\s+.*?\\s+from\\s+['"]react-dom\\/client['"];?/g, '')
        .replace(/import\\s+.*?\\s+from\\s+['"]react-dom['"];?/g, '')
        .replace(/import\\s+.*?\\s+from\\s+['"]\\.\\/.+?['"];?/g, '')
        .replace(/export\\s+default\\s+/g, '')
        .replace(/export\\s+const\\s+/g, 'const ')
        .replace(/export\\s+function\\s+/g, 'function ');
      
      jsContent += cleaned + '\\n';
    }
  }

  // 3. Transpile JS/JSX using esbuild
  const transpileResult = esbuild.transformSync(jsContent, {
    loader: 'jsx',
    target: 'es2022',
  });

  const compiledCode = transpileResult.code;

  // 4. Initialize JSDOM
  const dom = new JSDOM('<!DOCTYPE html><html><head><style id="inline-styles"></style></head><body><div id="root"></div></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable'
  });

  // Setup JSDOM globals
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.self = dom.window;

  // Mock viewport and matchMedia
  dom.window.matchMedia = dom.window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };

  // Inject CSS
  dom.window.document.getElementById('inline-styles').textContent = cssContent;

  // Expose React globally to JSDOM window
  const React = require('react');
  const ReactDOMClient = require('react-dom/client');
  dom.window.React = React;
  dom.window.ReactDOM = ReactDOMClient;

  // Mock global fetch for API call challenges
  dom.window.fetch = async (url) => {
    if (dom.window.__mockFetchError) {
      throw new Error(dom.window.__mockFetchError);
    }
    return {
      ok: true,
      status: 200,
      json: async () => dom.window.__mockFetchData || [],
    };
  };

  // 5. Evaluate the user code in the context of the window
  dom.window.eval(compiledCode);

  // Find the App or component to render
  const App = dom.window.App || dom.window.Counter || dom.window.Toggle || dom.window.PasswordToggle || dom.window.TodoApp || dom.window.FetchUsers;
  if (!App) {
    console.log(JSON.stringify({
      error: 'Could not find App, Counter, Toggle, PasswordToggle, TodoApp, or FetchUsers component in the code.'
    }));
    process.exit(1);
  }

  // Helper to wait for React rendering updates
  const flushPromises = () => new Promise(resolve => setTimeout(resolve, 50));

  const results = [];

  async function runTests() {
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const start = process.hrtime.bigint();
      let error = null;

      try {
        // Clear root div
        const rootDiv = dom.window.document.getElementById('root');
        rootDiv.innerHTML = '';

        // Parse test case input
        const parsedInput = JSON.parse(tc.input);

        // Inject fetch mocks for this test case
        dom.window.__mockFetchData = parsedInput.mockUsers || null;
        dom.window.__mockFetchError = parsedInput.mockError || null;

        // Render App
        const root = ReactDOMClient.createRoot(rootDiv);
        root.render(React.createElement(App));
        await flushPromises();

        const steps = parsedInput.steps || [];
        const assertions = parsedInput.assertions || [];

        // Execute steps
        for (const step of steps) {
          const element = rootDiv.querySelector(\`[data-testid="\${step.testId}"]\`);
          if (!element) {
            throw new Error(\`Element with data-testid="\${step.testId}" not found during step execution.\`);
          }

          if (step.action === 'click') {
            element.click();
          } else if (step.action === 'type' || step.action === 'change') {
            element.value = step.text || '';
            element.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
            element.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
          }
          await flushPromises();
        }

        // Verify assertions
        for (const assertion of assertions) {
          const element = rootDiv.querySelector(\`[data-testid="\${assertion.testId}"]\`);
          if (!element) {
            throw new Error(\`Element with data-testid="\${assertion.testId}" not found during assertion check.\`);
          }

          if (assertion.text !== undefined) {
            const actualText = element.textContent || element.value || '';
            if (actualText.trim() !== assertion.text.trim()) {
              throw new Error(\`Expected element "\${assertion.testId}" to have text "\${assertion.text}", but got "\${actualText}"\`);
            }
          }

          if (assertion.attribute !== undefined && assertion.value !== undefined) {
            const actualVal = element.getAttribute(assertion.attribute);
            if (actualVal !== assertion.value) {
              throw new Error(\`Expected element "\${assertion.testId}" attribute "\${assertion.attribute}" to be "\${assertion.value}", but got "\${actualVal}"\`);
            }
          }
        }
      } catch (e) {
        error = e.message || String(e);
      }

      const end = process.hrtime.bigint();
      const runtimeMs = Number(end - start) / 1e6;

      results.push({
        id: tc.id,
        passed: error === null,
        actual: error === null ? 'passed' : error,
        expected: 'passed',
        runtime: Number(runtimeMs.toFixed(2)),
        error
      });
    }

    console.log(JSON.stringify({ results }));
  }

  runTests();

} catch (globalErr) {
  console.log(JSON.stringify({
    error: globalErr.message || String(globalErr)
  }));
  process.exit(1);
}
`;
  }

  async execute(
    submissionId: string,
    code: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 10000,
    files?: Record<string, string>,
  ): Promise<ExecutionResult> {
    const tempDir = path.join(os.tmpdir(), 'judge', submissionId);
    const tarPath = path.join(os.tmpdir(), `judge-${submissionId}.tar`);
    let container: Docker.Container | null = null;

    try {
      // 1. Prepare files map
      // If files is not provided, build a default one using the user code
      const workspaceFiles = files || {
        'Counter.js': code,
        'App.js': `function App() { return <Counter />; }`,
        'styles.css': '',
      };

      const runnerCode = this.generateRunnerCode();

      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'files.json'), JSON.stringify(workspaceFiles));
      fs.writeFileSync(path.join(tempDir, 'testcases.json'), JSON.stringify(testCases));
      fs.writeFileSync(path.join(tempDir, 'runner.js'), runnerCode);

      // Create tarball
      await tar.create(
        {
          gzip: false,
          file: tarPath,
          cwd: tempDir,
        },
        ['files.json', 'runner.js', 'testcases.json'],
      );

      // Create and start Docker container (node-react-runner)
      container = await docker.createContainer({
        Image: 'node-react-runner',
        Cmd: ['sleep', '60'],
        NetworkDisabled: true,
        User: 'node',
        WorkingDir: '/app',
        HostConfig: {
          Memory: 256 * 1024 * 1024, // 256 MB
          NanoCpus: 1000000000, // 1 CPU
          AutoRemove: false,
        },
      });

      await container.start();

      // Copy tarball to container's /app directory
      const tarStream = fs.createReadStream(tarPath);
      await container.putArchive(tarStream, { path: '/app' });

      // Execute runner script
      const exec = await container.exec({
        Cmd: ['node', '/app/runner.js'],
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start({ Detach: false });

      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];

      const stdoutStream = new Writable({
        write(chunk, _encoding, callback) {
          stdoutChunks.push(chunk);
          callback();
        },
      });

      const stderrStream = new Writable({
        write(chunk, _encoding, callback) {
          stderrChunks.push(chunk);
          callback();
        },
      });

      container.modem.demuxStream(execStream, stdoutStream, stderrStream);

      // Enforce timeout
      const executionPromise = new Promise<void>((resolve, reject) => {
        execStream.on('end', resolve);
        execStream.on('error', reject);
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs),
      );

      try {
        await Promise.race([executionPromise, timeoutPromise]);
      } catch (err: any) {
        if (err.message === 'TIMEOUT') {
          logger.warn(`Submission ${submissionId} timed out`);
          return {
            passed: false,
            passedCases: 0,
            totalCases: testCases.length,
            results: [],
            error: 'Time Limit Exceeded: Your solution exceeded the 10-second limit.',
          };
        }
        throw err;
      }

      // Check exit code and inspect execution
      const execInspect = await exec.inspect();
      const stdoutStr = Buffer.concat(stdoutChunks).toString('utf8').trim();
      const stderrStr = Buffer.concat(stderrChunks).toString('utf8').trim();

      if (execInspect.ExitCode !== 0) {
        logger.error(
          { stderrStr, exitCode: execInspect.ExitCode },
          'Execution error in React container',
        );
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error:
            stderrStr ||
            stdoutStr ||
            `Runtime error: process exited with code ${execInspect.ExitCode}`,
        };
      }

      // Parse runner output
      try {
        const output = JSON.parse(stdoutStr);
        if (output.error) {
          return {
            passed: false,
            passedCases: 0,
            totalCases: testCases.length,
            results: [],
            error: output.error,
          };
        }

        const results = output.results as TestCaseResult[];
        const passedCases = results.filter((r) => r.passed).length;
        const totalCases = testCases.length;
        const totalRuntime = results.reduce((acc, r) => acc + r.runtime, 0);

        return {
          passed: passedCases === totalCases,
          passedCases,
          totalCases,
          results,
          runtime: Math.round(totalRuntime),
          memory: 1024 * 1024 * 8, // Simulated 8MB React memory footprint
        };
      } catch (parseErr) {
        logger.error({ stdoutStr, parseErr }, 'Failed to parse React runner output');
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error: `Output format error: ${stdoutStr.substring(0, 200)}`,
        };
      }
    } catch (err: any) {
      logger.error({ err }, 'Unexpected error in ReactExecutor');
      return {
        passed: false,
        passedCases: 0,
        totalCases: testCases.length,
        results: [],
        error: `Sandbox execution failed: ${err.message || String(err)}`,
      };
    } finally {
      // Cleanup container & temp files
      if (container) {
        try {
          await container.stop({ t: 0 }).catch(() => {});
          await container.remove().catch(() => {});
        } catch (cleanupErr) {
          logger.warn({ cleanupErr }, 'Container cleanup failed');
        }
      }

      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
        if (fs.existsSync(tarPath)) {
          fs.unlinkSync(tarPath);
        }
      } catch (fsCleanupErr) {
        logger.warn({ fsCleanupErr }, 'FS cleanup failed');
      }
    }
  }
}
