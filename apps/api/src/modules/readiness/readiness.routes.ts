import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/readiness/sih
router.get('/sih', async (req: Request, res: Response, next: NextFunction) => {
  const items = mockStore.sihReadinessItems;
  const completedCount = items.filter((i) => i.status === 'Completed').length;
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length;
  const notStartedCount = items.filter((i) => i.status === 'Not Started').length;

  const totalProgress = items.reduce((acc, i) => acc + (i.progress || (i.status === 'Completed' ? 100 : i.status === 'In Progress' ? 50 : 0)), 0);
  const overallScore = items.length > 0 ? Math.round(totalProgress / items.length) : 0;

  return sendSuccess(res, {
    overallScore,
    statusLabel: overallScore >= 85 ? 'Grand Finale Ready' : 'Evaluation Ready',
    stats: {
      total: items.length,
      completed: completedCount,
      inProgress: inProgressCount,
      notStarted: notStartedCount,
    },
    items,
  });
});

// PATCH /api/v1/readiness/sih/:id
router.patch('/sih/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, progress } = req.body;

  const item = mockStore.sihReadinessItems.find((i) => i.id === id);
  if (item) {
    if (status) {
      item.status = status;
      item.progress = status === 'Completed' ? 100 : status === 'In Progress' ? (item.progress || 60) : 0;
    }
    if (progress !== undefined) item.progress = progress;
    return sendSuccess(res, item);
  }

  return sendSuccess(res, { id, status, progress });
});

// GET /api/v1/readiness/demo-checklist
router.get('/demo-checklist', async (req: Request, res: Response, next: NextFunction) => {
  const items = mockStore.demoChecklistItems;
  const total = items.length;
  const passed = items.filter((i) => i.status === 'PASS').length;
  const failed = items.filter((i) => i.status === 'FAIL').length;
  const notTested = items.filter((i) => i.status === 'NOT_TESTED').length;
  const readyPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  return sendSuccess(res, {
    items,
    stats: { total, passed, failed, notTested, readyPercentage },
  });
});

// PATCH /api/v1/readiness/demo-checklist/:id
router.patch('/demo-checklist/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  const item = mockStore.demoChecklistItems.find((i) => i.id === id);
  if (item && status) {
    item.status = status;
    return sendSuccess(res, item);
  }

  return sendSuccess(res, { id, status });
});

export const readinessRoutes = router;
