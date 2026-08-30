import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';
import { NotificationService } from './notification.service.js';

export class TaskService {
  static async getTasks(filter: {
    projectId?: string;
    workstreamId?: string;
    milestoneId?: string;
    sprintId?: string;
    assigneeId?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) {
    const where: any = {};
    if (filter.projectId) where.projectId = filter.projectId;
    if (filter.workstreamId) where.workstreamId = filter.workstreamId;
    if (filter.milestoneId) where.milestoneId = filter.milestoneId;
    if (filter.sprintId) where.sprintId = filter.sprintId;
    if (filter.assigneeId) where.assigneeId = filter.assigneeId;
    if (filter.status) where.status = filter.status;
    if (filter.priority) where.priority = filter.priority;
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search } },
        { taskId: { contains: filter.search } },
        { description: { contains: filter.search } },
      ];
    }

    return prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            teamRole: true,
            avatarUrl: true,
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        },
        workstream: {
          select: {
            id: true,
            code: true,
            name: true,
          }
        },
        milestone: {
          select: {
            id: true,
            milestoneCode: true,
            name: true,
            status: true,
          }
        },
        subtasks: {
          orderBy: { orderIndex: 'asc' }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                teamRole: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            subtasks: true,
            comments: true,
            attachments: true,
            blockers: true,
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });
  }

  static async getTaskById(idOrTaskId: string) {
    const task = await prisma.task.findFirst({
      where: {
        OR: [{ id: idOrTaskId }, { taskId: idOrTaskId }],
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            teamRole: true,
            avatarUrl: true,
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        },
        workstream: true,
        milestone: true,
        sprint: true,
        subtasks: {
          orderBy: { orderIndex: 'asc' }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                teamRole: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: true,
        blockers: {
          include: {
            reporter: true,
            blockingUser: true,
          }
        }
      }
    });

    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    return task;
  }

  static async createTask(data: any, userId?: string) {
    // Generate next Task ID e.g. TASK-045
    const count = await prisma.task.count();
    const taskId = `TASK-${String(count + 1).padStart(3, '0')}`;

    const task = await prisma.task.create({
      data: {
        ...data,
        taskId,
        progress: data.progress || 0,
      },
      include: {
        assignee: true,
        workstream: true,
      }
    });

    await ActivityService.logEvent({
      projectId: task.projectId,
      userId,
      eventType: 'TASK_CREATED',
      entityType: 'TASK',
      entityId: task.id,
      summary: `Created task ${task.taskId}: "${task.title}"`,
      details: { taskId: task.taskId, priority: task.priority, assignee: task.assignee?.name },
    });

    if (task.assigneeId && task.assigneeId !== userId) {
      await NotificationService.createNotification(
        task.assigneeId,
        'New Task Assigned',
        `You have been assigned to ${task.taskId}: "${task.title}"`,
        'TASK',
        `/tasks/${task.id}`
      );
    }

    return task;
  }

  static async updateTask(id: string, data: any, userId?: string) {
    const existing = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true, reviewer: true }
    });

    if (!existing) {
      throw new Error('TASK_NOT_FOUND');
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: true,
        reviewer: true,
        subtasks: true,
      }
    });

    // Check status transition events
    if (data.status && data.status !== existing.status) {
      await ActivityService.logEvent({
        projectId: updated.projectId,
        userId,
        eventType: 'TASK_STATUS_CHANGED',
        entityType: 'TASK',
        entityId: updated.id,
        summary: `Moved ${updated.taskId} from ${existing.status} → ${updated.status}`,
        details: { from: existing.status, to: updated.status },
      });

      if (updated.status === 'IN_REVIEW' && updated.reviewerId) {
        await NotificationService.createNotification(
          updated.reviewerId,
          'Task Ready for Review',
          `${updated.taskId}: "${updated.title}" is ready for code/technical review`,
          'TASK',
          `/tasks/${updated.id}`
        );
      }

      if (updated.status === 'COMPLETED') {
        // Automatically check if milestone or project progress should recalculate
        await this.recalculateMilestoneProgress(updated.milestoneId);
      }
    }

    return updated;
  }

  static async updateTaskStatus(id: string, status: string, userId?: string) {
    return this.updateTask(id, { status }, userId);
  }

  static async addSubtask(taskId: string, title: string, userId?: string) {
    const subtaskCount = await prisma.subtask.count({ where: { taskId } });
    const subtask = await prisma.subtask.create({
      data: {
        taskId,
        title,
        orderIndex: subtaskCount,
      }
    });

    await this.syncTaskProgressFromSubtasks(taskId);
    return subtask;
  }

  static async toggleSubtask(subtaskId: string, completed: boolean, userId?: string) {
    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      }
    });

    await this.syncTaskProgressFromSubtasks(subtask.taskId);
    return subtask;
  }

  static async syncTaskProgressFromSubtasks(taskId: string) {
    const subtasks = await prisma.subtask.findMany({ where: { taskId } });
    if (subtasks.length === 0) return;

    const completed = subtasks.filter(s => s.completed).length;
    const progress = Math.round((completed / subtasks.length) * 100);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        progress,
        status: progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : undefined
      }
    });

    if (task.milestoneId) {
      await this.recalculateMilestoneProgress(task.milestoneId);
    }
  }

  static async addComment(taskId: string, userId: string, comment: string) {
    const newComment = await prisma.taskComment.create({
      data: {
        taskId,
        userId,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            teamRole: true,
          }
        },
        task: true,
      }
    });

    await ActivityService.logEvent({
      projectId: newComment.task.projectId,
      userId,
      eventType: 'TASK_COMMENT',
      entityType: 'TASK',
      entityId: taskId,
      summary: `Commented on ${newComment.task.taskId}: "${comment.substring(0, 50)}..."`,
    });

    return newComment;
  }

  static async recalculateMilestoneProgress(milestoneId?: string | null) {
    if (!milestoneId) return;
    try {
      const tasks = await prisma.task.findMany({ where: { milestoneId } });
      if (tasks.length === 0) return;

      const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
      const progress = Math.round((completedCount / tasks.length) * 100);

      await prisma.milestone.update({
        where: { id: milestoneId },
        data: {
          progress,
          status: progress === 100 ? 'COMPLETED' : progress > 0 ? 'ON_TRACK' : 'NOT_STARTED'
        }
      });
    } catch (e) {
      console.error('Error recalculating milestone progress:', e);
    }
  }
}
