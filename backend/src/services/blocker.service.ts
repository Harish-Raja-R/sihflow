import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';
import { NotificationService } from './notification.service.js';

export class BlockerService {
  static async getBlockers(projectId: string) {
    return prisma.blocker.findMany({
      where: { projectId },
      include: {
        task: {
          select: {
            id: true,
            taskId: true,
            title: true,
            status: true,
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            teamRole: true,
            avatarUrl: true,
          }
        },
        blockingUser: {
          select: {
            id: true,
            name: true,
            teamRole: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  static async reportBlocker(data: {
    projectId: string;
    taskId?: string;
    title: string;
    description: string;
    reportedById: string;
    blockingUserId?: string;
    priority?: string;
    expectedResolution?: string;
  }) {
    const count = await prisma.blocker.count();
    const blockerId = `BLK-${String(count + 1).padStart(3, '0')}`;

    const blocker = await prisma.blocker.create({
      data: {
        ...data,
        blockerId,
        priority: data.priority || 'HIGH',
        status: 'OPEN',
      },
      include: {
        reporter: true,
        blockingUser: true,
        task: true,
      }
    });

    // If related to a task, mark the task as BLOCKED
    if (data.taskId) {
      await prisma.task.update({
        where: { id: data.taskId },
        data: { status: 'BLOCKED' }
      });
    }

    // Log activity
    await ActivityService.logEvent({
      projectId: data.projectId,
      userId: data.reportedById,
      eventType: 'BLOCKER_REPORTED',
      entityType: 'BLOCKER',
      entityId: blocker.id,
      summary: `🚨 ${blocker.reporter.name} reported blocker ${blocker.blockerId}: "${blocker.title}"`,
      details: {
        priority: blocker.priority,
        blockingUser: blocker.blockingUser?.name,
        task: blocker.task?.taskId,
      }
    });

    // Notify Team Lead
    await NotificationService.notifyTeamLead(
      data.projectId,
      `🚨 Critical Blocker Reported: ${blocker.blockerId}`,
      `${blocker.reporter.name} reported: "${blocker.title}" (Priority: ${blocker.priority})`,
      'BLOCKER',
      `/blockers`
    );

    return blocker;
  }

  static async resolveBlocker(id: string, resolutionNotes: string, userId?: string) {
    const blocker = await prisma.blocker.findUnique({
      where: { id },
      include: { task: true, reporter: true }
    });

    if (!blocker) throw new Error('BLOCKER_NOT_FOUND');

    const updated = await prisma.blocker.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolutionNotes,
      }
    });

    // If the task was blocked and has no other open blockers, move it back to IN_PROGRESS
    if (blocker.taskId) {
      const otherOpenBlockers = await prisma.blocker.count({
        where: {
          taskId: blocker.taskId,
          id: { not: id },
          status: { in: ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS'] }
        }
      });

      if (otherOpenBlockers === 0) {
        await prisma.task.update({
          where: { id: blocker.taskId },
          data: { status: 'IN_PROGRESS' }
        });
      }
    }

    await ActivityService.logEvent({
      projectId: blocker.projectId,
      userId,
      eventType: 'BLOCKER_RESOLVED',
      entityType: 'BLOCKER',
      entityId: id,
      summary: `✅ Resolved blocker ${blocker.blockerId}: "${blocker.title}"`,
      details: { resolutionNotes },
    });

    // Notify original reporter
    await NotificationService.createNotification(
      blocker.reportedById,
      `Blocker Resolved: ${blocker.blockerId}`,
      `Your blocker "${blocker.title}" has been resolved: ${resolutionNotes}`,
      'BLOCKER',
      `/blockers`
    );

    return updated;
  }
}
