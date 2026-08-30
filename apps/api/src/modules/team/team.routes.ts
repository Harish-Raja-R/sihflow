import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/team
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.members);
});

// GET /api/v1/team/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const member = mockStore.members.find((m) => m.id === id || m.email === id || m.name === id) || mockStore.members[0];

  const assignedTasks = mockStore.tasks.filter((t) => t.assignee?.id === member.id || t.assignee?.name === member.name);
  const completedTasks = assignedTasks.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED');
  const currentTasks = assignedTasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW');
  const blockedTasks = assignedTasks.filter((t) => t.status === 'BLOCKED');
  const memberActivities = mockStore.activities.filter((a) => a.user?.name === member.name);

  return sendSuccess(res, {
    ...member,
    assignedTasks,
    completedTasks,
    currentTasks,
    blockedTasks,
    activities: memberActivities,
  });
});

// PATCH /api/v1/team/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, phone, responsibilities, githubUsername } = req.body;

  const member = mockStore.members.find((m) => m.id === id || m.email === id);
  if (member) {
    if (name) member.name = name;
    if (phone) member.phone = phone;
    if (responsibilities) member.responsibilities = responsibilities;
    if (githubUsername) member.githubUsername = githubUsername;
    return sendSuccess(res, member);
  }

  return sendSuccess(res, { id, ...req.body });
});

export const teamRoutes = router;
