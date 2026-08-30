import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/projects
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, [mockStore.project]);
});

// GET /api/v1/projects/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, {
    ...mockStore.project,
    team: mockStore.members,
    workstreams: mockStore.workstreams,
    milestones: mockStore.milestones,
    tasks: mockStore.tasks,
  });
});

// PATCH /api/v1/projects/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, description, objective, status, progress, targetDate, startDate, repositoryUrl } = req.body;
  if (name) mockStore.project.name = name;
  if (description) mockStore.project.description = description;
  if (objective) mockStore.project.objective = objective;
  if (status) mockStore.project.status = status;
  if (progress !== undefined) mockStore.project.progress = progress;
  if (targetDate) mockStore.project.targetDate = targetDate;
  if (startDate) mockStore.project.startDate = startDate;
  if (repositoryUrl) mockStore.project.repositoryUrl = repositoryUrl;

  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${req.user?.name || 'Team Lead'} updated AcadShield project settings`,
    eventType: 'PROJECT_UPDATED',
    user: { name: req.user?.name || 'Team Lead', teamRole: req.user?.teamRole || 'Team Lead' },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, mockStore.project);
});

export const projectRoutes = router;
