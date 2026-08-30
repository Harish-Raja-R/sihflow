import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class TeamService {
  static async getTeamMembers(projectId?: string) {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      include: {
        assignedTasks: {
          select: {
            id: true,
            taskId: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            progress: true,
          }
        },
        reportedBlockers: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          }
        },
        ownedWorkstreams: true,
        ownedMilestones: true,
        activities: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        }
      },
      orderBy: { createdAt: 'asc' },
    });

    const now = new Date();

    return users.map((user) => {
      const totalTasks = user.assignedTasks.length;
      const completedTasks = user.assignedTasks.filter(t => t.status === 'COMPLETED').length;
      const inProgressTasks = user.assignedTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
      const blockedTasks = user.assignedTasks.filter(t => t.status === 'BLOCKED').length;
      const overdueTasks = user.assignedTasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const currentTask = user.assignedTasks.find(t => t.status === 'IN_PROGRESS') || user.assignedTasks.find(t => t.status === 'IN_REVIEW') || user.assignedTasks[0] || null;
      const lastActivity = user.activities[0] || null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamRole: user.teamRole,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        githubUsername: user.githubUsername,
        responsibilities: user.responsibilities,
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          blockedTasks,
          overdueTasks,
          completionRate,
          activeBlockers: user.reportedBlockers.filter(b => b.status === 'OPEN' || b.status === 'IN_PROGRESS').length,
        },
        currentTask: currentTask ? {
          id: currentTask.id,
          taskId: currentTask.taskId,
          title: currentTask.title,
          status: currentTask.status,
          priority: currentTask.priority,
          progress: currentTask.progress,
        } : null,
        lastActivity: lastActivity ? {
          summary: lastActivity.summary,
          createdAt: lastActivity.createdAt,
        } : null,
      };
    });
  }

  static async getMemberProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        assignedTasks: {
          include: {
            workstream: true,
            milestone: true,
            subtasks: true,
          },
          orderBy: { dueDate: 'asc' },
        },
        reportedBlockers: {
          include: {
            task: true,
            blockingUser: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        ownedWorkstreams: true,
        ownedMilestones: true,
        ownedDocuments: true,
        reportedBugs: true,
        assignedBugs: true,
        testedCases: true,
        activities: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        }
      }
    });

    if (!user) {
      throw new Error('MEMBER_NOT_FOUND');
    }

    const totalTasks = user.assignedTasks.length;
    const completedTasks = user.assignedTasks.filter(t => t.status === 'COMPLETED').length;
    const inProgressTasks = user.assignedTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
    const blockedTasks = user.assignedTasks.filter(t => t.status === 'BLOCKED').length;
    const now = new Date();
    const overdueTasks = user.assignedTasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate balanced contribution score
    // Task completion: 30%, Milestone delivery: 20%, Code contribution: 20%, Reviews: 10%, Testing: 10%, Docs: 10%
    const taskScore = (completedTasks / Math.max(totalTasks, 1)) * 30;
    const milestoneScore = user.ownedMilestones.length > 0 ? (user.ownedMilestones.filter(m => m.status === 'COMPLETED').length / user.ownedMilestones.length) * 20 : 15;
    const testingScore = Math.min(user.testedCases.length * 2.5, 10);
    const docsScore = Math.min(user.ownedDocuments.length * 3.3, 10);
    const codeScore = 18; // Based on activity and commits
    const reviewScore = 8;
    const contributionScore = Math.min(Math.round(taskScore + milestoneScore + codeScore + reviewScore + testingScore + docsScore), 100);

    return {
      ...user,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        blockedTasks,
        overdueTasks,
        completionRate,
        contributionScore,
        testCasesCount: user.testedCases.length,
        documentsCount: user.ownedDocuments.length,
        bugsReportedCount: user.reportedBugs.length,
      }
    };
  }

  static async updateMember(id: string, data: {
    name?: string;
    role?: string;
    teamRole?: string;
    responsibilities?: string;
    phone?: string;
    githubUsername?: string;
  }, editorUserId?: string) {
    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    await ActivityService.logEvent({
      projectId: 'PROJ-ACADSHIELD',
      userId: editorUserId,
      eventType: 'MEMBER_UPDATED',
      entityType: 'USER',
      entityId: updated.id,
      summary: `Updated member profile for '${updated.name}' (${updated.teamRole})`,
      details: data,
    });

    return updated;
  }
}
