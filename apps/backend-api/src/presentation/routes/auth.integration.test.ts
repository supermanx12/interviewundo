import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

describe('Auth Flow End-to-End Integration', () => {
  const testUser = {
    name: 'E2E Test User',
    email: 'e2e-test-auth@example.com',
    password: 'Password123!',
  };

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    // Close connections
    await prisma.$disconnect();
    await redis.quit();
  });

  it('should run the full auth flow successfully', async () => {
    // 1. Register User
    const registerRes = await request(app).post('/api/auth/register').send(testUser);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data).toHaveProperty('accessToken');
    expect(registerRes.body.data).toHaveProperty('refreshToken');
    expect(registerRes.body.data.user.email).toBe(testUser.email);

    const { refreshToken } = registerRes.body.data;

    // 2. Login User
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data).toHaveProperty('accessToken');
    expect(loginRes.body.data).toHaveProperty('refreshToken');

    // 3. Refresh Token
    const refreshRes = await request(app).post('/api/auth/refreshToken').send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data).toHaveProperty('accessToken');
    expect(refreshRes.body.data).toHaveProperty('refreshToken');
  });

  it('should fail login with incorrect password', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrong-password',
    });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.success).toBe(false);
    expect(loginRes.body.error.message).toBe('Invalid email or password');
  });

  describe('OAuth endpoints verification', () => {
    const oauthEmail = 'oauth-test@example.com';

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: { email: oauthEmail },
      });
    });

    it('should fail with 401 when x-auth-shared-secret is missing', async () => {
      const res = await request(app).post('/api/auth/github').send({
        githubId: 'git-123',
        email: oauthEmail,
        name: 'OAuth User',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Shared secret invalid or missing');
    });

    it('should fail with 401 when x-auth-shared-secret is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/github')
        .set('x-auth-shared-secret', 'wrong-secret-key-123')
        .send({
          githubId: 'git-123',
          email: oauthEmail,
          name: 'OAuth User',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Shared secret invalid or missing');
    });

    it('should register a new user when x-auth-shared-secret is correct', async () => {
      const res = await request(app)
        .post('/api/auth/github')
        .set(
          'x-auth-shared-secret',
          process.env.AUTH_SHARED_SECRET || 'super-secret-shared-key-for-oauth-sync-1234567890',
        )
        .send({
          githubId: 'git-123',
          email: oauthEmail,
          name: 'OAuth User',
          image: 'https://avatar.com/u',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user.email).toBe(oauthEmail);
      expect(res.body.data.user.image).toBe('https://avatar.com/u');
    });
  });
});
