import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

describe('Admin Endpoints Integration', () => {
  const adminUser = {
    name: 'Admin Route User',
    email: 'admin-routes@example.com',
    password: 'Password123!',
  };
  const studentUser = {
    name: 'Student Route User',
    email: 'student-routes@example.com',
    password: 'Password123!',
  };

  let adminAccessToken: string;
  let adminUserId: string;
  let studentAccessToken: string;
  let studentUserId: string;
  let problemId: string;
  let testCaseId: string;

  beforeAll(async () => {
    await prisma.submissionResult.deleteMany({});
    await prisma.submission.deleteMany({});
    await prisma.testCase.deleteMany({});
    await prisma.problem.deleteMany({
      where: { slug: { startsWith: 'admin-route-problem' } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [adminUser.email, studentUser.email] } },
    });

    const adminRegisterRes = await request(app).post('/api/auth/register').send(adminUser);
    adminAccessToken = adminRegisterRes.body.data.accessToken;
    adminUserId = adminRegisterRes.body.data.user.id;

    await prisma.user.update({
      where: { id: adminUserId },
      data: { role: 'ADMIN' },
    });

    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminAccessToken = adminLoginRes.body.data.accessToken;

    const studentRegisterRes = await request(app).post('/api/auth/register').send(studentUser);
    studentAccessToken = studentRegisterRes.body.data.accessToken;
    studentUserId = studentRegisterRes.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.testCase.deleteMany({});
    await prisma.problem.deleteMany({
      where: { id: problemId },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [adminUserId, studentUserId] } },
    });
    await prisma.$disconnect();
    await redis.quit();
  });

  it('should reject non-admin access', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${studentAccessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return admin stats for admins', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalUsers');
  });

  it('should create, list, update, and delete problems and test cases', async () => {
    const createProblemRes = await request(app)
      .post('/api/admin/problems')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        title: 'Admin Route Problem',
        slug: 'admin-route-problem',
        description: 'Admin integration coverage.',
        difficulty: 'EASY',
        category: 'JAVASCRIPT',
        starterCode: 'function solve() {}',
        solutionCode: 'function solve() { return true; }',
        tags: ['array'],
        isPublished: true,
      });

    expect(createProblemRes.status).toBe(201);
    problemId = createProblemRes.body.data.id;

    const listProblemsRes = await request(app)
      .get('/api/admin/problems?page=1&limit=10')
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(listProblemsRes.status).toBe(200);
    expect(
      listProblemsRes.body.data.data.some((problem: { id: string }) => problem.id === problemId),
    ).toBe(true);

    const updateProblemRes = await request(app)
      .put(`/api/admin/problems/${problemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        title: 'Admin Route Problem Updated',
        slug: 'admin-route-problem',
        description: 'Admin integration coverage updated.',
        difficulty: 'MEDIUM',
        category: 'TYPESCRIPT',
        starterCode: 'function solve() {}',
        solutionCode: 'function solve() { return true; }',
        tags: ['array', 'map'],
        isPublished: true,
      });

    expect(updateProblemRes.status).toBe(200);
    expect(updateProblemRes.body.data.title).toBe('Admin Route Problem Updated');

    const createTestCaseRes = await request(app)
      .post('/api/admin/test-cases')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        problemId,
        input: '[1,2,3]',
        expectedOutput: '6',
        isHidden: false,
        order: 1,
      });

    expect(createTestCaseRes.status).toBe(201);
    testCaseId = createTestCaseRes.body.data.id;

    const listTestCasesRes = await request(app)
      .get(`/api/admin/problems/${problemId}/test-cases`)
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(listTestCasesRes.status).toBe(200);
    expect(
      listTestCasesRes.body.data.some((testCase: { id: string }) => testCase.id === testCaseId),
    ).toBe(true);

    const updateTestCaseRes = await request(app)
      .put(`/api/admin/test-cases/${testCaseId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        input: '[1,2,3,4]',
        expectedOutput: '10',
        isHidden: true,
        order: 2,
      });

    expect(updateTestCaseRes.status).toBe(200);
    expect(updateTestCaseRes.body.data.isHidden).toBe(true);

    const deleteTestCaseRes = await request(app)
      .delete(`/api/admin/test-cases/${testCaseId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(deleteTestCaseRes.status).toBe(200);

    const deleteProblemRes = await request(app)
      .delete(`/api/admin/problems/${problemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(deleteProblemRes.status).toBe(200);
  });
});
