import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/milestones
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  // Compute progress based on associated tasks dynamically if tasks exist
  const milestonesWithTaskProgress = mockStore.milestones.map((m) => {
    const linkedTasks = mockStore.tasks.filter((t) => t.milestoneId === m.id || t.milestone?.name?.includes(m.milestoneCode));
    let progress = m.progress;
    if (linkedTasks.length > 0) {
      const completedCount = linkedTasks.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED').length;
      progress = Math.round((completedCount / linkedTasks.length) * 100);
    }
    return {
      ...m,
      tasksCount: linkedTasks.length,
      progress,
    };
  });

  return sendSuccess(res, milestonesWithTaskProgress);
});

// POST /api/v1/milestones
router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, description, deadline, status } = req.body;
  const milestoneCode = `M${mockStore.milestones.length + 1}`;

  const newMilestone = {
    id: `m-${Date.now()}`,
    milestoneCode,
    name,
    description: description || '',
    deadline: deadline || '2026-09-15',
    status: status || 'Planned',
    progress: 0,
  };

  mockStore.milestones.push(newMilestone);

  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${req.user?.name || 'Team Lead'} added new roadmap milestone: "${newMilestone.name}" (${newMilestone.milestoneCode})`,
    eventType: 'MILESTONE_CREATED',
    user: { name: req.user?.name || 'Team Lead', teamRole: req.user?.teamRole || 'Team Lead' },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, newMilestone, 201);
});

// PATCH /api/v1/milestones/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, description, deadline, status, progress } = req.body;

  const milestone = mockStore.milestones.find((m) => m.id === id || m.milestoneCode === id);
  if (milestone) {
    if (name) milestone.name = name;
    if (description !== undefined) milestone.description = description;
    if (deadline) milestone.deadline = deadline;
    if (status) milestone.status = status;
    if (progress !== undefined) milestone.progress = progress;

    return sendSuccess(res, milestone);
  }

  return sendSuccess(res, { id, ...req.body });
});

// DELETE /api/v1/milestones/:id
router.delete('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.milestones.findIndex((m) => m.id === id || m.milestoneCode === id);
  if (index !== -1) {
    const deleted = mockStore.milestones.splice(index, 1)[0];
    return sendSuccess(res, { message: `Milestone ${deleted.milestoneCode} removed`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Milestone removed', id });
});

export const milestoneRoutes = router;
