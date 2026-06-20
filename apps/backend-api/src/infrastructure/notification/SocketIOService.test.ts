import { vi, describe, it, expect, beforeEach } from 'vitest';
import { socketIOService } from './SocketIOService';
import { redisSubscriber } from '../../config/redis';
import type { IAuthTokenService } from '../../domain/ports/services/IAuthTokenService';

vi.mock('../../config/redis', () => {
  return {
    redis: {
      on: vi.fn(),
      disconnect: vi.fn(),
    },
    redisSubscriber: {
      subscribe: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      disconnect: vi.fn(),
    },
  };
});

describe('SocketIOService', () => {
  let mockIo: any;
  let mockAuthTokenService: IAuthTokenService;
  let middlewareFn: any;
  let connectionCallback: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockIo = {
      use: vi.fn().mockImplementation((fn) => {
        middlewareFn = fn;
      }),
      on: vi.fn().mockImplementation((event, callback) => {
        if (event === 'connection') {
          connectionCallback = callback;
        }
      }),
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
      emit: vi.fn(),
    };

    mockAuthTokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn().mockResolvedValue({ userId: 'user-123', role: 'STUDENT' }),
      verifyRefreshToken: vi.fn(),
    };
  });

  it('should initialize correctly and subscribe to Redis pub/sub', async () => {
    socketIOService.initialize(mockIo, mockAuthTokenService);

    expect(mockIo.use).toHaveBeenCalled();
    expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
    expect(redisSubscriber.subscribe).toHaveBeenCalledWith('submission:updates');
    expect(redisSubscriber.on).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should authenticate connection using handshake token', async () => {
    socketIOService.initialize(mockIo, mockAuthTokenService);

    const mockSocket = {
      handshake: {
        auth: { token: 'Bearer valid-token' },
      },
      data: {},
    };
    const next = vi.fn();

    await middlewareFn(mockSocket, next);

    expect(mockAuthTokenService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect(mockSocket.data.user).toEqual({ id: 'user-123', role: 'STUDENT' });
    expect(next).toHaveBeenCalledWith();
  });

  it('should reject connection if token is missing', async () => {
    socketIOService.initialize(mockIo, mockAuthTokenService);

    const mockSocket = {
      handshake: { auth: {} },
      data: {},
    };
    const next = vi.fn();

    await middlewareFn(mockSocket, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('Token missing');
  });

  it('should reject connection if token is invalid', async () => {
    mockAuthTokenService.verifyAccessToken = vi.fn().mockRejectedValue(new Error('Invalid token'));
    socketIOService.initialize(mockIo, mockAuthTokenService);

    const mockSocket = {
      handshake: { auth: { token: 'Bearer bad-token' } },
      data: {},
    };
    const next = vi.fn();

    await middlewareFn(mockSocket, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('Invalid token');
  });

  it('should handle client connections and room joining', () => {
    socketIOService.initialize(mockIo, mockAuthTokenService);

    const mockSocket = {
      id: 'socket-abc',
      data: { user: { id: 'user-456' } },
      join: vi.fn(),
      on: vi.fn(),
    };

    connectionCallback(mockSocket);

    expect(mockSocket.join).toHaveBeenCalledWith('user:user-456');
  });

  it('should notify a specific user', () => {
    const mockEmit = vi.fn();
    mockIo.to.mockReturnValue({ emit: mockEmit });
    socketIOService.initialize(mockIo, mockAuthTokenService);

    socketIOService.notifyUser('user-123', 'test-event', { foo: 'bar' });

    expect(mockIo.to).toHaveBeenCalledWith('user:user-123');
    expect(mockEmit).toHaveBeenCalledWith('test-event', { foo: 'bar' });
  });

  it('should broadcast notification to all', () => {
    socketIOService.initialize(mockIo, mockAuthTokenService);

    socketIOService.notifyAll('test-event', { foo: 'bar' });

    expect(mockIo.emit).toHaveBeenCalledWith('test-event', { foo: 'bar' });
  });
});
