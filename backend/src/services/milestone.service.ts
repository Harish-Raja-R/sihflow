import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class MilestoneService {
  static async getMilestones(projectId: string) {
    return prisma.milestone.findMany({
      where: { projectId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            teamRole: true,
            avatarUrl: true,
          }
        },
        tasks: {
          select: {
            id: true,
            taskId: true,
            title: true,
            status: true,
            priority: true,
            progress: true,
            assignee: {
              select: {
                id: true,
                name: true,
                teamRole: true,
              }
            }
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  static async updateMilestone(id: string, data: any, userId?: string) {
    const existing = await prisma.milestone.findUnique({ where: { id } });
    if (!existing) throw new Error('MILESTONE_NOT_FOUND');

    const updated = await prisma.milestone.update({
      where: { id },
      data,
    });

    if (data.status && data.status !== existing.status) {
      await ActivityService.logEvent({
        projectId: updated.projectId,
        userId,
        eventType: 'MILESTONE_STATUS_CHANGED',
        entityType: 'MILESTONE',
        entityId: updated.id,
        summary: `Changed ${updated.milestoneCode} (${updated.name}) status to ${updated.status}`,
        details: { from: existing.status, to: updated.status },
      });
    }

    return updated;
  }
}
