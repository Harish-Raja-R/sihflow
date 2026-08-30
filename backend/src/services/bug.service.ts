import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class BugService {
  static async getBugs(projectId: string) {
    return prisma.bug.findMany({
      where: { projectId },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            teamRole: true,
            avatarUrl: true,
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            teamRole: true,
            avatarUrl: true,
          }
        },
        task: {
          select: {
            id: true,
            taskId: true,
            title: true,
          }
        }
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  static async createBug(data: any, userId?: string) {
    const count = await prisma.bug.count();
    const bugId = `BUG-${String(count + 1).padStart(3, '0')}`;

    const bug = await prisma.bug.create({
      data: {
        ...data,
        bugId,
      },
      include: {
        reporter: true,
        assignee: true,
      }
    });

    await ActivityService.logEvent({
      projectId: bug.projectId,
      userId,
      eventType: 'BUG_REPORTED',
      entityType: 'BUG',
      entityId: bug.id,
      summary: `🐛 Reported bug ${bug.bugId}: "${bug.title}" (${bug.severity})`,
      details: { environment: bug.environment, severity: bug.severity },
    });

    return bug;
  }

  static async updateBugStatus(id: string, status: string, userId?: string) {
    const bug = await prisma.bug.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : undefined
      }
    });

    await ActivityService.logEvent({
      projectId: bug.projectId,
      userId,
      eventType: 'BUG_STATUS_CHANGED',
      entityType: 'BUG',
      entityId: id,
      summary: `Updated bug ${bug.bugId} status to ${status}`,
    });

    return bug;
  }
}
