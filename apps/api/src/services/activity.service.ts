import { prisma } from '../config/prisma';

export type ActivityEventType =
  | 'TASK_CREATED'
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'TASK_STATUS_CHANGED'
  | 'TASK_COMPLETED'
  | 'BLOCKER_CREATED'
  | 'BLOCKER_RESOLVED'
  | 'MILESTONE_UPDATED'
  | 'COMMENT_ADDED'
  | 'DOCUMENT_UPLOADED'
  | 'REVIEW_REQUESTED'
  | 'TEST_EXECUTED'
  | 'PROJECT_INITIALIZED'
  | 'SECURITY_ALERT';

export class ActivityService {
  public async logActivity(params: {
    projectId?: string;
    userId?: string;
    eventType: ActivityEventType | string;
    entityType: string;
    entityId?: string;
    summary: string;
    details?: string;
  }) {
    try {
      const projectId = params.projectId || 'proj-acadshield-001';

      // Find real project internal UUID
      const project = await prisma.project.findFirst({
        where: {
          OR: [{ id: projectId }, { projectId: projectId }],
        },
        select: { id: true },
      });

      if (!project) return null;

      return await prisma.activity.create({
        data: {
          projectId: project.id,
          userId: params.userId || null,
          eventType: params.eventType,
          entityType: params.entityType,
          entityId: params.entityId || null,
          summary: params.summary,
          details: params.details || null,
        },
      });
    } catch (error) {
      console.error('Failed to record activity log:', error);
      return null;
    }
  }

  public async getActivities(projectId = 'proj-acadshield-001', limit = 50) {
    return prisma.activity.findMany({
      where: {
        project: {
          OR: [{ id: projectId }, { projectId: projectId }],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            teamRole: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}

export const activityService = new ActivityService();
