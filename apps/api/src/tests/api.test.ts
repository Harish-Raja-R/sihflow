import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('SihFlow ERP Full-Stack Integration Test Suite', () => {
  let authToken = '';

  // 1. Health Check Test
  it('GET /api/v1/health -> returns healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  // 2. Authentication Test (Login)
  it('POST /api/v1/auth/login -> authenticates valid credentials and returns JWT token', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'lead@sihflow.io',
      password: 'Demo@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('lead@sihflow.io');
    expect(res.body.data.user.role).toBe('TEAM_LEAD');

    authToken = res.body.data.token;
  });

  // 3. Authentication Test (Invalid Credentials)
  it('POST /api/v1/auth/login -> rejects invalid password with 401', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'lead@sihflow.io',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  // 4. Unauthorized Access Test
  it('GET /api/v1/auth/me -> rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  // 5. Authorized Access Test
  it('GET /api/v1/auth/me -> returns authenticated user profile with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('lead@sihflow.io');
  });

  // 6. Project Retrieval Test
  it('GET /api/v1/projects -> returns AcadShield project (#1422)', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe('AcadShield');
  });

  // 7. Team Roster Test
  it('GET /api/v1/team -> returns all 6 team members with roles', async () => {
    const res = await request(app).get('/api/v1/team');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(6);
    expect(res.body.data.some((m: any) => m.teamRole === 'Team Lead')).toBe(true);
  });

  // 8. Task Creation & Status Progression Test
  it('POST /api/v1/tasks -> creates a new task and returns taskId', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Implement Multi-Party Endorsement Test',
        description: 'Verify signature collection from multiple peer nodes.',
        priority: 'HIGH',
        status: 'TODO',
        estimatedHours: 12,
        projectId: 'proj-acadshield-001',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.taskId).toMatch(/^TASK-\d+$/);

    const createdTaskId = res.body.data.id;

    // Status update test
    const patchRes = await request(app)
      .patch(`/api/v1/tasks/${createdTaskId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'IN_PROGRESS' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('IN_PROGRESS');
  });

  // 9. Milestones Test
  it('GET /api/v1/milestones -> returns M1 to M11 roadmap gates', async () => {
    const res = await request(app).get('/api/v1/milestones');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(11);
    expect(res.body.data[0].milestoneCode).toBe('M1');
  });

  // 10. Blocker Reporting Test
  it('POST /api/v1/blockers -> creates a blocker record', async () => {
    const res = await request(app)
      .post('/api/v1/blockers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'IPFS Storage Provider Connection Timeout',
        description: 'Pinning service latency exceeds 5000ms threshold.',
        priority: 'MEDIUM',
        impact: 'Backup certificate storage fallback delay',
        projectId: 'proj-acadshield-001',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.blockerId).toMatch(/^BLK-\d+$/);
  });

  // 11. SIH Readiness Evaluation Test
  it('GET /api/v1/readiness/sih -> computes overall readiness score', async () => {
    const res = await request(app).get('/api/v1/readiness/sih');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overallScore).toBeGreaterThanOrEqual(50);
  });

  // 12. Mission Control Dashboard Aggregation Test
  it('GET /api/v1/analytics/dashboard -> returns holistic KPI dataset', async () => {
    const res = await request(app).get('/api/v1/analytics/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.health.totalTasks).toBeGreaterThan(0);
    expect(res.body.data.teamStatus.length).toBe(6);
  });
});
