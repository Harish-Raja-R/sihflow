import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('SihFlow ERP Backend API Integration Tests', () => {
  let leadToken = '';
  let memberToken = '';

  beforeAll(async () => {
    // Login as Team Lead
    const leadRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lead@sihflow.io', password: 'Demo@123' });
    expect(leadRes.status).toBe(200);
    expect(leadRes.body.success).toBe(true);
    leadToken = leadRes.body.data.token;

    // Login as Team Member
    const memberRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'frontend@sihflow.io', password: 'Demo@123' });
    expect(memberRes.status).toBe(200);
    memberToken = memberRes.body.data.token;
  });

  it('GET /api/health should return system health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.system).toBe('SihFlow ERP');
    expect(res.body.targetProject).toBe('AcadShield');
  });

  it('GET /api/projects should return project list with AcadShield', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].name).toBe('AcadShield');
  });

  it('GET /api/team should return all 6 SIH team members with stats', async () => {
    const res = await request(app).get('/api/team');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(6);
    const roles = res.body.data.map((m: any) => m.teamRole);
    expect(roles).toContain('TEAM LEAD');
    expect(roles).toContain('BLOCKCHAIN ENGINEER');
    expect(roles).toContain('IDENTITY + SECURITY ENGINEER');
    expect(roles).toContain('BACKEND ENGINEER');
    expect(roles).toContain('FRONTEND ENGINEER');
    expect(roles).toContain('QA + UI/UX + DOCUMENTATION');
  });

  it('GET /api/analytics/dashboard should return complete mission control metrics', async () => {
    const res = await request(app).get('/api/analytics/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.health).toBeDefined();
    expect(res.body.data.health.totalTasks).toBeGreaterThan(0);
    expect(res.body.data.sihReadiness).toBeDefined();
    expect(res.body.data.demoReadiness).toBeDefined();
    expect(res.body.data.recommendedActions.length).toBeGreaterThan(0);
  });

  it('GET /api/tasks should return list of tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/tasks should create a new task when authenticated', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${leadToken}`)
      .send({
        projectId: 'proj-acadshield-001',
        title: 'Conduct Final Security Penetration Test',
        description: 'Audit smart contract inputs and verify SHA-256 collision resistance.',
        priority: 'CRITICAL',
        status: 'TODO',
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.taskId).toMatch(/^TASK-/);
  });

  it('POST /api/blockers should report a new blocker and trigger alert', async () => {
    const res = await request(app)
      .post('/api/blockers')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        projectId: 'proj-acadshield-001',
        title: 'IPFS gateway timeout during certificate pinning',
        description: 'Public IPFS test gateway returns 504 on large certificate uploads.',
        priority: 'HIGH',
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.blockerId).toMatch(/^BLK-/);
  });

  it('GET /api/readiness/sih should return 14-category SIH Readiness score', async () => {
    const res = await request(app).get('/api/readiness/sih');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overallScore).toBeGreaterThan(0);
    expect(res.body.data.items.length).toBe(14);
  });

  it('GET /api/readiness/demo-checklist should return 14 demo scenarios', async () => {
    const res = await request(app).get('/api/readiness/demo-checklist');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(14);
  });

  it('POST /api/ai/query should answer project questions using actual database state', async () => {
    const res = await request(app)
      .post('/api/ai/query')
      .set('Authorization', `Bearer ${leadToken}`)
      .send({ query: 'What is delaying us and who is blocked?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.answer).toContain('Blocker');
  });

  it('Security: unauthenticated request to protected route should return 401', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Unauthorized Task' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('Security: non-lead member attempting project update should return 403', async () => {
    const res = await request(app)
      .patch('/api/projects/proj-acadshield-001')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ name: 'Hacked Project Name' });
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
