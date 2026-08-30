import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class ProjectService {
  static async resolveProjectId(idOrCode: string): Promise<string> {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrCode }, { projectId: idOrCode }],
      },
      select: { id: true }
    });
    return project ? project.id : idOrCode;
  }

  static async getProjects() {
    return prisma.project.findMany({
      include: {
        members: {
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
        },
        _count: {
          select: {
            tasks: true,
            milestones: true,
            blockers: true,
            documents: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getProjectById(idOrCode: string) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrCode }, { projectId: idOrCode }],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                teamRole: true,
                avatarUrl: true,
                githubUsername: true,
                responsibilities: true,
              }
            }
          }
        },
        workstreams: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                teamRole: true,
              }
            },
            _count: {
              select: { tasks: true }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        milestones: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                teamRole: true,
              }
            },
            _count: {
              select: { tasks: true }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        sprints: {
          orderBy: { startDate: 'desc' }
        },
        _count: {
          select: {
            tasks: true,
            blockers: true,
            bugs: true,
            documents: true,
            meetings: true,
          }
        }
      }
    });

    if (!project) {
      throw new Error('PROJECT_NOT_FOUND');
    }

    return project;
  }

  static async updateProject(id: string, data: any, userId?: string) {
    const resolvedId = await this.resolveProjectId(id);
    const updated = await prisma.project.update({
      where: { id: resolvedId },
      data,
    });

    await ActivityService.logEvent({
      projectId: updated.id,
      userId,
      eventType: 'PROJECT_UPDATED',
      entityType: 'PROJECT',
      entityId: updated.id,
      summary: `Updated project metadata for '${updated.name}'`,
      details: data,
    });

    return updated;
  }
}
