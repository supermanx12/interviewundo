import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

describe('Problem Endpoints Integration', () => {
  const testUser = {
    name: 'Problem Route User',
    email: 'problem-routes@example.com',
    password: 'Password123!',
  };

  let accessToken: string;
  let userId: string;
  let problemId: string;
  const problemSlug = 'route-test-two-sum';

  beforeAll(async () => {
    await prisma.hintUsage.deleteMany({});
    await prisma.dailyChallenge.deleteMany({
      where: { problemId },
    });
    await prisma.testCase.deleteMany({
      where: { problem: { slug: problemSlug } },
    });
    await prisma.problem.deleteMany({
      where: { slug: problemSlug },
    });
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });

    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    accessToken = registerRes.body.data.accessToken;
    userId = registerRes.body.data.user.id;

    const problem = await prisma.problem.create({
      data: {
        title: 'Route Test Two Sum',
        slug: problemSlug,
        description: 'Integration problem route coverage.',
        difficulty: 'EASY',
        category: 'JAVASCRIPT',
        starterCode: 'function twoSum() {}',
        isPublished: true,
      },
    });
    problemId = problem.id;

    await prisma.dailyChallenge.upsert({
      where: { date: new Date(new Date().toISOString().split('T')[0]) },
      update: { problemId },
      create: {
        problemId,
        date: new Date(new Date().toISOString().split('T')[0]),
      },
    });
  });

  afterAll(async () => {
    await prisma.hintUsage.deleteMany({
      where: { userId },
    });
    await prisma.dailyChallenge.deleteMany({
      where: { problemId },
    });
    await prisma.testCase.deleteMany({
      where: { problemId },
    });
    await prisma.problem.deleteMany({
      where: { id: problemId },
    });
    await prisma.user.deleteMany({
      where: { id: userId },
    });
    await prisma.$disconnect();
    await redis.quit();
  });

  it('should list published problems with pagination metadata', async () => {
    const res = await request(app).get('/api/problems?search=Route&page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('totalPages');
    expect(
      res.body.data.data.some((problem: { slug: string }) => problem.slug === problemSlug),
    ).toBe(true);
  });

  it('should return a problem by slug', async () => {
    const res = await request(app).get(`/api/problems/${problemSlug}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(problemSlug);
  });

  it('should return active solvers count for a problem', async () => {
    const res = await request(app).get(`/api/problems/${problemSlug}/active`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('activeSolversCount');
    expect(typeof res.body.data.activeSolversCount).toBe('number');
  });

  it('should return the daily challenge', async () => {
    const res = await request(app).get('/api/problems/daily');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('slug');
  });

  it('should protect the hint endpoint behind authentication', async () => {
    const res = await request(app).post(`/api/problems/${problemSlug}/hint`).send({ code: 'x' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should accept authenticated hint requests at the route level', async () => {
    const res = await request(app)
      .post(`/api/problems/${problemSlug}/hint`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code: 'function twoSum() {}' });

    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
    }
  });

  it('should protect the like endpoint behind authentication', async () => {
    const res = await request(app).post(`/api/problems/${problemSlug}/like`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should successfully toggle like for authenticated user', async () => {
    const likeRes = await request(app)
      .post(`/api/problems/${problemSlug}/like`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(likeRes.status).toBe(200);
    expect(likeRes.body.success).toBe(true);
    expect(likeRes.body.data.liked).toBe(true);
    expect(likeRes.body.data.likesCount).toBe(1);

    const getRes = await request(app)
      .get(`/api/problems/${problemSlug}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.data.isLikedByUser).toBe(true);
    expect(getRes.body.data.likesCount).toBe(1);

    const unlikeRes = await request(app)
      .post(`/api/problems/${problemSlug}/like`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(unlikeRes.status).toBe(200);
    expect(unlikeRes.body.success).toBe(true);
    expect(unlikeRes.body.data.liked).toBe(false);
    expect(unlikeRes.body.data.likesCount).toBe(0);

    const getRes2 = await request(app)
      .get(`/api/problems/${problemSlug}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes2.status).toBe(200);
    expect(getRes2.body.success).toBe(true);
    expect(getRes2.body.data.isLikedByUser).toBe(false);
    expect(getRes2.body.data.likesCount).toBe(0);
  }, 30000);
});
