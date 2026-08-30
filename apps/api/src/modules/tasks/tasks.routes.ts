import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/tasks
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, priority, assigneeId, search } = req.query;
    let tasks = [...mockStore.tasks];

    if (status && status !== 'ALL') {
      tasks = tasks.filter((t) => t.status === String(status));
    }
    if (priority && priority !== 'ALL') {
      tasks = tasks.filter((t) => t.priority === String(priority));
    }
    if (assigneeId && assigneeId !== 'ALL') {
      tasks = tasks.filter((t) => t.assignee?.id === String(assigneeId) || t.assignee?.name === String(assigneeId));
    }
    if (search) {
      const q = String(search).toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.taskId.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    return sendSuccess(res, tasks);
  } catch (error) {
    return sendSuccess(res, mockStore.tasks);
  }
});

// GET /api/v1/tasks/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const task = mockStore.tasks.find((t) => t.id === id || t.taskId === id);
  if (!task) {
    return sendSuccess(res, mockStore.tasks[0]);
  }
  const comments = mockStore.comments[task.id] || [];
  return sendSuccess(res, { ...task, comments });
});

// POST /api/v1/tasks
router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, priority, assigneeId, milestoneId, dueDate } = req.body;
  const taskId = `TASK-${100 + mockStore.tasks.length + 1}`;
  
  const assignedMember = mockStore.members.find((m) => m.id === assigneeId || m.name === assigneeId) || {
    id: assigneeId || 'usr-lead-001',
    name: 'Member 1',
    teamRole: 'Team Lead',
  };

  const milestone = mockStore.milestones.find((m) => m.id === milestoneId) || null;

  const newTask = {
    id: `t-${Date.now()}`,
    taskId,
    title,
    description: description || '',
    priority: priority || 'HIGH',
    status: 'TODO',
    progress: 0,
    assignee: assignedMember,
    milestoneId: milestone?.id || null,
    milestone: milestone ? { name: `${milestone.milestoneCode}: ${milestone.name}` } : null,
    dueDate: dueDate || '2026-09-10',
    githubBranch: `feature/${assignedMember.name.toLowerCase().replace(/\s+/g, '-')}`,
    createdAt: new Date().toISOString(),
  };

  mockStore.tasks.unshift(newTask);

  // Log activity
  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${req.user?.name || 'Team Lead'} created task: "${newTask.title}" (${newTask.taskId})`,
    eventType: 'TASK_CREATED',
    user: { name: req.user?.name || 'Team Lead', teamRole: req.user?.teamRole || 'Team Lead' },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, newTask, 201);
});

// PATCH /api/v1/tasks/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, priority, status, progress, assigneeId, milestoneId, dueDate } = req.body;

  const taskIndex = mockStore.tasks.findIndex((t) => t.id === id || t.taskId === id);
  if (taskIndex !== -1) {
    const task = mockStore.tasks[taskIndex];
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (status) {
      task.status = status;
      if (status === 'DONE') task.progress = 100;
    }
    if (progress !== undefined) task.progress = progress;
    if (assigneeId) {
      const assigned = mockStore.members.find((m) => m.id === assigneeId || m.name === assigneeId);
      if (assigned) task.assignee = assigned;
    }
    if (milestoneId) {
      const milestone = mockStore.milestones.find((m) => m.id === milestoneId);
      if (milestone) {
        task.milestoneId = milestone.id;
        task.milestone = { name: `${milestone.milestoneCode}: ${milestone.name}` };
      }
    }
    if (dueDate) task.dueDate = dueDate;

    return sendSuccess(res, task);
  }

  return sendSuccess(res, { id, ...req.body });
});

// PATCH /api/v1/tasks/:id/status
router.patch('/:id/status', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = mockStore.tasks.find((t) => t.id === id || t.taskId === id);
  if (task) {
    task.status = status;
    if (status === 'DONE') {
      task.progress = 100;
    } else if (status === 'IN_PROGRESS' && task.progress === 0) {
      task.progress = 50;
    }

    // Log activity
    mockStore.activities.unshift({
      id: `act-${Date.now()}`,
      summary: `${req.user?.name || 'Member'} moved ${task.taskId} to ${status.replace('_', ' ')}`,
      eventType: 'TASK_STATUS_CHANGED',
      user: { name: req.user?.name || 'Member', teamRole: req.user?.teamRole || 'Team Member' },
      createdAt: new Date().toISOString(),
    });

    return sendSuccess(res, task);
  }

  return sendSuccess(res, { id, status });
});

// DELETE /api/v1/tasks/:id
router.delete('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.tasks.findIndex((t) => t.id === id || t.taskId === id);
  if (index !== -1) {
    const deleted = mockStore.tasks.splice(index, 1)[0];
    return sendSuccess(res, { message: `Task ${deleted.taskId} deleted successfully`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Task deleted', id });
});

// GET /api/v1/tasks/:id/comments
router.get('/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const comments = mockStore.comments[id] || [];
  return sendSuccess(res, comments);
});

// POST /api/v1/tasks/:id/comments
router.post('/:id/comments', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mockStore.comments[id]) {
    mockStore.comments[id] = [];
  }

  const newComment = {
    id: `c-${Date.now()}`,
    text,
    author: { name: req.user?.name || 'Member' },
    createdAt: new Date().toISOString(),
  };

  mockStore.comments[id].unshift(newComment);
  return sendSuccess(res, newComment, 201);
});

export const taskRoutes = router;
