import { Router } from 'express';
import { authRoutes } from '../../modules/auth/auth.routes';
import { projectRoutes } from '../../modules/projects/projects.routes';
import { teamRoutes } from '../../modules/team/team.routes';
import { taskRoutes } from '../../modules/tasks/tasks.routes';
import { milestoneRoutes } from '../../modules/milestones/milestones.routes';
import { sprintRoutes } from '../../modules/sprints/sprints.routes';
import { blockerRoutes } from '../../modules/blockers/blockers.routes';
import { activityRoutes } from '../../modules/activity/activity.routes';
import { githubRoutes } from '../../modules/github/github.routes';
import { meetingRoutes } from '../../modules/meetings/meetings.routes';
import { documentRoutes } from '../../modules/documents/documents.routes';
import { riskRoutes } from '../../modules/risks/risks.routes';
import { bugRoutes } from '../../modules/bugs/bugs.routes';
import { testingRoutes } from '../../modules/testing/testing.routes';
import { readinessRoutes } from '../../modules/readiness/readiness.routes';
import { analyticsRoutes } from '../../modules/analytics/analytics.routes';
import { notificationRoutes } from '../../modules/notifications/notifications.routes';
import { reportRoutes } from '../../modules/reports/reports.routes';
import { aiRoutes } from '../../modules/ai/ai.routes';
import { sendSuccess } from '../../utils/response';

const router = Router();

// Health Check: GET /api/v1/health
router.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SihFlow ERP API v1',
    uptime: process.uptime(),
  });
});

// Mount Versioned Modules
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/team', teamRoutes);
router.use('/tasks', taskRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/sprints', sprintRoutes);
router.use('/blockers', blockerRoutes);
router.use('/activity', activityRoutes);
router.use('/github', githubRoutes);
router.use('/meetings', meetingRoutes);
router.use('/documents', documentRoutes);
router.use('/risks', riskRoutes);
router.use('/bugs', bugRoutes);
router.use('/testing', testingRoutes);
router.use('/readiness', readinessRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/ai', aiRoutes);

export const v1Router = router;
