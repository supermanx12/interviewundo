import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

describe('Dashboard Endpoints Integration', () => {
  const testUser = {
    name: 'Dashboard Route User',
    email: 'dashboard-routes@example.com',
    password: 'Password123!',
  };

  let accessToken: string;
  let userId: string;
  let problemId: string;

  beforeAll(async () => {
    await prisma.submissionResult.deleteMany({});
    await prisma.submission.deleteMany({});
    await prisma.problem.deleteMany({
      where: { slug: 'dashboard-route-problem' },
    });
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });

    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    accessToken = registerRes.body.data.accessToken;
    userId = registerRes.body.data.user.id;

    const problem = await prisma.problem.create({
      data: {
        title: 'Dashboard Route Problem',
        slug: 'dashboard-route-problem',
        description: 'Dashboard route integration problem.',
        difficulty: 'EASY',
        category: 'JAVASCRIPT',
        starterCode: 'function solve() {}',
        isPublished: true,
      },
    });
    problemId = problem.id;

    await prisma.submission.create({
      data: {
        userId,
        problemId,
        code: 'function solve() { return true; }',
        language: 'javascript',
        status: 'ACCEPTED',
      },
    });
  });

  afterAll(async () => {
    await prisma.submissionResult.deleteMany({});
    await prisma.submission.deleteMany({});
    await prisma.problem.deleteMany({
      where: { id: problemId },
    });
    await prisma.user.deleteMany({
      where: { id: userId },
    });
    await prisma.$disconnect();
    await redis.quit();
  });

  it('should require authentication for dashboard endpoints', async () => {
    const res = await request(app).get('/api/dashboard/stats');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return dashboard stats for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalSolved');
    expect(res.body.data).toHaveProperty('streak');
  });

  it('should return dashboard summary for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('stats');
    expect(res.body.data).toHaveProperty('progress');
    expect(res.body.data).toHaveProperty('activity');
    expect(res.body.data).toHaveProperty('recent');
  });

  it('should return recent activity and heatmap data', async () => {
    const [recentRes, heatmapRes] = await Promise.all([
      request(app).get('/api/dashboard/recent').set('Authorization', `Bearer ${accessToken}`),
      request(app).get('/api/dashboard/heatmap').set('Authorization', `Bearer ${accessToken}`),
    ]);

    expect(recentRes.status).toBe(200);
    expect(Array.isArray(recentRes.body.data)).toBe(true);
    expect(heatmapRes.status).toBe(200);
    expect(Array.isArray(heatmapRes.body.data)).toBe(true);
  });
});
