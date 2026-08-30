import { prisma } from '../database/prisma.js';

export class SprintService {
  static async getSprints(projectId: string) {
    const sprints = await prisma.sprint.findMany({
      where: { projectId },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                teamRole: true,
                avatarUrl: true,
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    return sprints.map(sprint => {
      const totalTasks = sprint.tasks.length;
      const completedTasks = sprint.tasks.filter(t => t.status === 'COMPLETED').length;
      const inProgressTasks = sprint.tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
      const blockedTasks = sprint.tasks.filter(t => t.status === 'BLOCKED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...sprint,
        progress,
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          blockedTasks,
          velocity: completedTasks * 5, // story points estimation
        }
      };
    });
  }

  static async getActiveSprint(projectId: string) {
    const sprints = await this.getSprints(projectId);
    return sprints.find(s => s.status === 'ACTIVE') || sprints[0] || null;
  }
}
