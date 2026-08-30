import { prisma } from '../database/prisma.js';

export interface ActivityEventInput {
  projectId: string;
  userId?: string;
  eventType: string;
  entityType: string;
  entityId?: string;
  summary: string;
  details?: Record<string, any>;
}

export class ActivityService {
  static async logEvent(input: ActivityEventInput) {
    try {
      const activity = await prisma.activityLog.create({
        data: {
          projectId: input.projectId,
          userId: input.userId,
          eventType: input.eventType,
          entityType: input.entityType,
          entityId: input.entityId,
          summary: input.summary,
          details: input.details ? JSON.stringify(input.details) : null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              teamRole: true,
              avatarUrl: true,
            }
          }
        }
      });
      return activity;
    } catch (error) {
      console.error('Failed to log activity event:', error);
      return null;
    }
  }

  static async getActivities(projectId: string, limit = 50, offset = 0) {
    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              teamRole: true,
              avatarUrl: true,
            }
          }
        }
      }),
      prisma.activityLog.count({ where: { projectId } })
    ]);

    return { activities, total };
  }
}
