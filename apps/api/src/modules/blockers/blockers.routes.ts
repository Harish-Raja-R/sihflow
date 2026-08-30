import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/blockers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.blockers);
});

// POST /api/v1/blockers
router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, impact, priority, taskId, blockedUserId } = req.body;
  const blockerId = `BLK-${String(mockStore.blockers.length + 1).padStart(3, '0')}`;

  const reporter = req.user
    ? { id: req.user.id, name: req.user.name, teamRole: req.user.teamRole }
    : { name: 'Member 4 (Backend)', teamRole: 'Backend / Database' };

  const blockedUser = mockStore.members.find((m) => m.id === blockedUserId) || { name: 'Member 2 (GitHub / Activity)' };
  const relatedTask = mockStore.tasks.find((t) => t.id === taskId || t.taskId === taskId) || null;

  const newBlocker = {
    id: `blk-${Date.now()}`,
    blockerId,
    title,
    description: description || '',
    impact: impact || '',
    priority: priority || 'HIGH',
    status: 'OPEN',
    reporter,
    blockedUser,
    relatedTask: relatedTask ? { taskId: relatedTask.taskId, title: relatedTask.title } : null,
    createdAt: new Date().toISOString(),
  };

  mockStore.blockers.unshift(newBlocker);

  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${reporter.name} raised critical blocker: "${newBlocker.title}" (${newBlocker.blockerId})`,
    eventType: 'BLOCKER_RAISED',
    user: { name: reporter.name, teamRole: reporter.teamRole },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, newBlocker, 201);
});

// PATCH /api/v1/blockers/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, impact, priority, status, resolutionNotes } = req.body;

  const blocker = mockStore.blockers.find((b) => b.id === id || b.blockerId === id);
  if (blocker) {
    if (title) blocker.title = title;
    if (description !== undefined) blocker.description = description;
    if (impact !== undefined) blocker.impact = impact;
    if (priority) blocker.priority = priority;
    if (status) blocker.status = status;
    if (resolutionNotes) blocker.resolutionNotes = resolutionNotes;
    return sendSuccess(res, blocker);
  }

  return sendSuccess(res, { id, ...req.body });
});

// PATCH /api/v1/blockers/:id/resolve
router.patch('/:id/resolve', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { resolutionNotes } = req.body;

  const blocker = mockStore.blockers.find((b) => b.id === id || b.blockerId === id);
  if (blocker) {
    blocker.status = 'RESOLVED';
    blocker.resolutionNotes = resolutionNotes || 'Resolved during architectural sync';
    blocker.resolvedAt = new Date().toISOString();

    mockStore.activities.unshift({
      id: `act-${Date.now()}`,
      summary: `${req.user?.name || 'Team Lead'} resolved blocker ${blocker.blockerId}: "${blocker.title}"`,
      eventType: 'BLOCKER_RESOLVED',
      user: { name: req.user?.name || 'Team Lead', teamRole: req.user?.teamRole || 'Team Lead' },
      createdAt: new Date().toISOString(),
    });

    return sendSuccess(res, blocker);
  }

  return sendSuccess(res, { id, status: 'RESOLVED' });
});

// DELETE /api/v1/blockers/:id
router.delete('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.blockers.findIndex((b) => b.id === id || b.blockerId === id);
  if (index !== -1) {
    const deleted = mockStore.blockers.splice(index, 1)[0];
    return sendSuccess(res, { message: `Blocker ${deleted.blockerId} deleted`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Blocker deleted', id });
});

export const blockerRoutes = router;
