import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/bugs
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.bugs);
});

// POST /api/v1/bugs
router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, severity, assigneeId } = req.body;
  const bugId = `BUG-${String(mockStore.bugs.length + 1).padStart(3, '0')}`;

  const reporter = req.user
    ? { id: req.user.id, name: req.user.name, teamRole: req.user.teamRole }
    : { id: 'usr-qa-006', name: 'Member 6 (QA)', teamRole: 'QA / UI-UX / Documentation' };

  const assignee = mockStore.members.find((m) => m.id === assigneeId || m.name === assigneeId) || {
    id: 'usr-front-005',
    name: 'Member 5 (Frontend)',
  };

  const newBug = {
    id: `bug-${Date.now()}`,
    bugId,
    title,
    description: description || '',
    severity: severity || 'HIGH',
    status: 'OPEN',
    reporter,
    assignee,
    createdAt: new Date().toISOString(),
  };

  mockStore.bugs.unshift(newBug);

  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${reporter.name} filed defect ${newBug.bugId}: "${newBug.title}" (${newBug.severity})`,
    eventType: 'BUG_REPORTED',
    user: { name: reporter.name, teamRole: reporter.teamRole },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, newBug, 201);
});

// PATCH /api/v1/bugs/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, severity, status, assigneeId } = req.body;

  const bug = mockStore.bugs.find((b) => b.id === id || b.bugId === id);
  if (bug) {
    if (title) bug.title = title;
    if (description !== undefined) bug.description = description;
    if (severity) bug.severity = severity;
    if (status) bug.status = status;
    if (assigneeId) {
      const assigned = mockStore.members.find((m) => m.id === assigneeId || m.name === assigneeId);
      if (assigned) bug.assignee = assigned;
    }
    return sendSuccess(res, bug);
  }

  return sendSuccess(res, { id, ...req.body });
});

// DELETE /api/v1/bugs/:id
router.delete('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.bugs.findIndex((b) => b.id === id || b.bugId === id);
  if (index !== -1) {
    const deleted = mockStore.bugs.splice(index, 1)[0];
    return sendSuccess(res, { message: `Bug ${deleted.bugId} deleted`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Bug deleted', id });
});

export const bugRoutes = router;
