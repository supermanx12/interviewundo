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
});
