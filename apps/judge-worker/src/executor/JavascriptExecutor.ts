import fs from 'fs';
import path from 'path';
import os from 'os';
import { Writable } from 'stream';
import Docker from 'dockerode';
import * as tar from 'tar';
import { logger } from '../config/logger';

// Initialize Dockerode
const docker = new Docker();

export interface TestCaseInput {
  id: string;
  input: string; // JSON array string, e.g. "[[2,7,11,15], 9]"
  expectedOutput: string; // JSON string, e.g. "[0,1]"
}

export interface TestCaseResult {
  id: string;
  passed: boolean;
  actual: any;
  expected: any;
  runtime: number; // milliseconds
  error: string | null;
}

export interface ExecutionResult {
  passed: boolean;
  passedCases: number;
  totalCases: number;
  results: TestCaseResult[];
  error?: string;
  runtime?: number;
  memory?: number;
}

export class JavascriptExecutor {
  /**
   * Helper to extract the primary function or class name from starter/user code
   */
  private extractFunctionName(code: string): string | null {
    const functionMatch = code.match(/function\*?\s+([a-zA-Z0-9_]+)\s*\(/);
    if (functionMatch) return functionMatch[1];

    const classMatch = code.match(/class\s+([a-zA-Z0-9_]+)/);
    if (classMatch) return classMatch[1];

    const constMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*/);
    if (constMatch) return constMatch[1];

    return null;
  }

  /**
   * Generates the runner script that will run inside the container
   */
  private generateRunnerCode(functionName: string): string {
    return `
const fs = require('fs');
const path = require('path');

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

try {
  const targetFn = require('./solution');
  if (!targetFn) {
    console.log(JSON.stringify({
      error: 'Target function/class "${functionName}" was not found or not exported properly.'
    }));
    process.exit(1);
  }

  const testCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'testcases.json'), 'utf8'));
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const args = JSON.parse(tc.input);
    const expected = JSON.parse(tc.expectedOutput);

    const start = process.hrtime.bigint();
    let actual;
    let error = null;

    try {
      actual = targetFn(...args);
    } catch (e) {
      error = e.message || String(e);
    }
    const end = process.hrtime.bigint();
    const runtimeMs = Number(end - start) / 1e6; // to ms

    results.push({
      id: tc.id,
      passed: error === null && deepEqual(actual, expected),
      actual: actual !== undefined ? actual : null,
      expected,
      runtime: Number(runtimeMs.toFixed(2)),
      error
    });
  }

  console.log(JSON.stringify({ results }));
} catch (globalErr) {
  console.log(JSON.stringify({
    error: globalErr.message || String(globalErr)
  }));
  process.exit(1);
}
`;
  }

  /**
   * Main execution method
   */
  async execute(
    submissionId: string,
    code: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 10000,
  ): Promise<ExecutionResult> {
    const tempDir = path.join(os.tmpdir(), 'judge', submissionId);
    const tarPath = path.join(os.tmpdir(), `judge-${submissionId}.tar`);
    let container: Docker.Container | null = null;

    try {
      // 1. Determine target function to export
      const functionName = this.extractFunctionName(code);
      if (!functionName) {
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error: 'Syntax Error: Could not find any declared functions or classes in your code.',
        };
      }

      const solutionCode = `${code}\n\nmodule.exports = typeof ${functionName} !== 'undefined' ? ${functionName} : null;\n`;
      const runnerCode = this.generateRunnerCode(functionName);

      // 2. Write temp files
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'solution.js'), solutionCode);
      fs.writeFileSync(path.join(tempDir, 'testcases.json'), JSON.stringify(testCases));
      fs.writeFileSync(path.join(tempDir, 'runner.js'), runnerCode);

      // 3. Create tarball
      await tar.create(
        {
          gzip: false,
          file: tarPath,
          cwd: tempDir,
        },
        ['solution.js', 'runner.js', 'testcases.json'],
      );

      // 4. Create and start Docker container (node:22-slim)
      // Enforces: 256MB memory limit, 1 CPU limit, no network access, and non-root execution
      container = await docker.createContainer({
        Image: 'node:22-slim',
        Cmd: ['sleep', '60'], // keep container alive for execution duration
        NetworkDisabled: true,
        User: 'node',
        WorkingDir: '/app',
        HostConfig: {
          Memory: 256 * 1024 * 1024, // 256 MB
          NanoCpus: 1000000000, // 1 CPU
          AutoRemove: false, // Keep container so we can extract status
        },
      });

      await container.start();

      // 5. Copy tarball to container's /app directory
      const tarStream = fs.createReadStream(tarPath);
      await container.putArchive(tarStream, { path: '/app' });

      // 6. Execute runner script
      const exec = await container.exec({
        Cmd: ['node', '/app/runner.js'],
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start({ Detach: false });

      // Capture stdout & stderr
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

      // 7. Enforce timeout (10 seconds)
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
        logger.error({ stderrStr, exitCode: execInspect.ExitCode }, 'Execution error in container');
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

      // 8. Parse runner output
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

        // Extract container stats (for memory/runtime logging)
        await container.inspect();

        // Sum up test case execution times for average/total runtime
        const totalRuntime = results.reduce((acc, r) => acc + r.runtime, 0);

        return {
          passed: passedCases === totalCases,
          passedCases,
          totalCases,
          results,
          runtime: Math.round(totalRuntime),
          memory: 1024 * 1024 * 5, // Simulated 5MB memory footprint or extract from container
        };
      } catch (parseErr) {
        logger.error({ stdoutStr, parseErr }, 'Failed to parse runner output');
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error: `Output format error: ${stdoutStr.substring(0, 200)}`,
        };
      }
    } catch (err: any) {
      logger.error({ err }, 'Unexpected error in JavascriptExecutor');
      return {
        passed: false,
        passedCases: 0,
        totalCases: testCases.length,
        results: [],
        error: `Sandbox execution failed: ${err.message || String(err)}`,
      };
    } finally {
      // 9. Cleanup container & temp files
      if (container) {
        try {
          await container.stop({ t: 0 }).catch(() => {});
          await container.remove().catch(() => {});
        } catch (cleanupErr) {
          logger.warn({ cleanupErr }, 'Container cleanup failed');
        }
      }

      // Clean up host temp directory & tarball
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
