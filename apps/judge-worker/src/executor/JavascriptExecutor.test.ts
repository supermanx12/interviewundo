import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';

// Setup dynamic mock registry on globalThis before vi.mock and before importing JavascriptExecutor
(globalThis as any).mockCreateContainer = vi.fn();

vi.mock('dockerode', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createContainer: (...args: any[]) => (globalThis as any).mockCreateContainer(...args),
    })),
  };
});

// Declare a type placeholder for the executor class
let JavascriptExecutorClass: any;

describe('JavascriptExecutor Unit Tests', () => {
  let executor: any;

  // Define mutable mock references inside the describe block
  const mockStart = vi.fn();
  const mockPutArchive = vi.fn();
  const mockStop = vi.fn();
  const mockRemove = vi.fn();
  const mockInspect = vi.fn();
  const mockExecStart = vi.fn();
  const mockExecInspect = vi.fn();

  const mockExec = vi.fn().mockResolvedValue({
    start: mockExecStart,
    inspect: mockExecInspect,
  });

  const mockContainer = {
    start: mockStart,
    putArchive: mockPutArchive,
    exec: mockExec,
    stop: mockStop,
    remove: mockRemove,
    inspect: mockInspect,
    modem: {
      demuxStream: vi.fn((_stream, _stdout, _stderr) => {
        // Mock default behavior does nothing
      }),
    },
  };

  const testCases = [
    { id: '1', input: '[[2, 7], 9]', expectedOutput: '[0, 1]' },
    { id: '2', input: '[[3, 2], 5]', expectedOutput: '[0, 1]' },
  ];

  beforeAll(async () => {
    // Dynamically import JavascriptExecutor only after globalThis is set up
    const mod = await import('./JavascriptExecutor.js');
    JavascriptExecutorClass = mod.JavascriptExecutor;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    executor = new JavascriptExecutorClass();

    // Setup default mock behaviors
    mockInspect.mockResolvedValue({
      State: { ExitCode: 0 },
    });

    mockExecInspect.mockResolvedValue({
      ExitCode: 0,
    });

    // Reset default demux behavior
    mockContainer.modem.demuxStream = vi.fn();

    // Configure the global mocked createContainer to resolve to our mockContainer
    (globalThis as any).mockCreateContainer.mockResolvedValue(mockContainer);
  });

  // Regex Function Name Extraction Scenarios
  describe('Function Name Extraction', () => {
    it('Scenario 1: should extract standard function names', () => {
      const code = 'function twoSum(nums, target) {}';
      const name = executor['extractFunctionName'](code);
      expect(name).toBe('twoSum');
    });

    it('Scenario 2: should extract generator function names', () => {
      const code = 'function* fibonacci() {}';
      const name = executor['extractFunctionName'](code);
      expect(name).toBe('fibonacci');
    });

    it('Scenario 3: should extract class names', () => {
      const code = 'class EventEmitter {}';
      const name = executor['extractFunctionName'](code);
      expect(name).toBe('EventEmitter');
    });

    it('Scenario 4: should extract arrow function names assigned to variables', () => {
      const code = 'const reverseString = (s) => {}';
      const name = executor['extractFunctionName'](code);
      expect(name).toBe('reverseString');
    });

    it('Scenario 5: should return null if no function or class is declared', () => {
      const code = 'console.log("hello");';
      const name = executor['extractFunctionName'](code);
      expect(name).toBeNull();
    });
  });

  // Sandbox Execution Scenarios
  describe('Sandbox Execution', () => {
    it('Scenario 6: should fail execution if function name cannot be extracted', async () => {
      const result = await executor.execute('sub-123', 'console.log("hello");', testCases);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Syntax Error');
      expect(mockStart).not.toHaveBeenCalled();
    });

    it('Scenario 7: should return success when runner output returns all passed', async () => {
      const mockRunnerOutput = JSON.stringify({
        results: [
          { id: '1', passed: true, actual: [0, 1], expected: [0, 1], runtime: 1.2, error: null },
          { id: '2', passed: true, actual: [0, 1], expected: [0, 1], runtime: 2.1, error: null },
        ],
      });

      // Mock Stream output
      const mockStream = {
        on: vi.fn((event, cb) => {
          if (event === 'end') {
            setTimeout(cb, 10);
          }
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      // Customize demuxStream for this test to pipe stdout
      mockContainer.modem.demuxStream = vi.fn((_stream, stdout, _stderr) => {
        stdout.write(Buffer.from(mockRunnerOutput));
      });

      const result = await executor.execute('sub-123', 'function twoSum() {}', testCases);
      expect(result.totalCases).toBe(2);
      expect(result.passed).toBe(true);
      expect(result.results[0].passed).toBe(true);
    });

    it('Scenario 8: should report runtime error if runner script exits with non-zero exit code', async () => {
      mockExecInspect.mockResolvedValue({ ExitCode: 1 }); // Exited with error!

      const mockStream = {
        on: vi.fn((event, cb) => {
          if (event === 'end') setTimeout(cb, 10);
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      const result = await executor.execute('sub-123', 'function twoSum() {}', testCases);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Runtime error');
    });

    it('Scenario 9: should timeout if container execution hangs', async () => {
      // Mock stream that never calls 'end' to simulate hang
      const mockStream = {
        on: vi.fn((_event, _cb) => {
          // Never calls end
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      // Pass 50ms as timeoutMs limit to force immediate timeout
      const result = await executor.execute('sub-123', 'function twoSum() {}', testCases, 50);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Time Limit Exceeded');
    });

    it('Scenario 10: should handle malformed runner output gracefully', async () => {
      // Mock stream that ends immediately without writing valid JSON
      const mockStream = {
        on: vi.fn((event, cb) => {
          if (event === 'end') setTimeout(cb, 10);
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      mockContainer.modem.demuxStream = vi.fn((_stream, stdout, _stderr) => {
        stdout.write(Buffer.from('Not a JSON output'));
      });

      const result = await executor.execute('sub-123', 'function twoSum() {}', testCases);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Output format error');
    });
  });
});
