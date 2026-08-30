import { prisma } from '../database/prisma.js';
import { ReadinessService } from './readiness.service.js';
import { ProjectService } from './project.service.js';

export class AnalyticsService {
  static async getDashboardMetrics(projectId: string) {
    const resolvedId = await ProjectService.resolveProjectId(projectId);
    const now = new Date();

    const [
      project,
      tasks,
      members,
      milestones,
      blockers,
      bugs,
      readiness,
      demoChecklist,
      recentActivities,
      githubRepo,
    ] = await Promise.all([
      prisma.project.findFirst({ where: { OR: [{ id: resolvedId }, { projectId: resolvedId }] } }),
      prisma.task.findMany({
        where: { projectId: resolvedId },
        include: {
          assignee: { select: { id: true, name: true, teamRole: true, avatarUrl: true } },
          workstream: { select: { id: true, code: true, name: true } },
          milestone: { select: { id: true, milestoneCode: true, name: true } },
        }
      }),
      prisma.user.findMany({
        where: { isActive: true },
        include: {
          assignedTasks: {
            select: { id: true, taskId: true, title: true, status: true, priority: true, progress: true }
          },
          activities: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.milestone.findMany({
        where: { projectId: resolvedId },
        include: { owner: { select: { name: true, teamRole: true } } },
        orderBy: { orderIndex: 'asc' }
      }),
      prisma.blocker.findMany({
        where: { projectId: resolvedId, status: { in: ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS'] } },
        include: { reporter: true, blockingUser: true, task: true },
        orderBy: { priority: 'desc' }
      }),
      prisma.bug.findMany({
        where: { projectId: resolvedId, status: { notIn: ['RESOLVED', 'CLOSED'] } },
      }),
      ReadinessService.getSihReadiness(resolvedId),
      ReadinessService.getDemoChecklist(resolvedId),
      prisma.activityLog.findMany({
        where: { projectId: resolvedId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, teamRole: true, avatarUrl: true } } }
      }),
      prisma.gitHubRepo.findFirst({
        where: { projectId: resolvedId },
        include: {
          commits: { take: 5, orderBy: { commitDate: 'desc' } },
          pullRequests: { where: { state: 'OPEN' }, include: { reviews: true } }
        }
      })
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
    const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length;
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED').length;
    const pendingReviews = tasks.filter(t => t.status === 'IN_REVIEW').length;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const teamStatus = members.map(m => {
      const activeTask = m.assignedTasks.find(t => t.status === 'IN_PROGRESS') || m.assignedTasks.find(t => t.status === 'IN_REVIEW') || m.assignedTasks[0] || null;
      const lastAct = m.activities[0] || null;
      return {
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        teamRole: m.teamRole,
        avatarUrl: m.avatarUrl,
        currentTask: activeTask ? {
          taskId: activeTask.taskId,
          title: activeTask.title,
          status: activeTask.status,
          progress: activeTask.progress,
        } : null,
        lastActivity: lastAct ? lastAct.summary : 'No recent activity',
        lastActivityAt: lastAct ? lastAct.createdAt : null,
      };
    });

    // Urgent items for Team Lead
    const urgent = {
      overdueTasksCount: overdueTasks,
      criticalBlockersCount: blockers.filter(b => b.priority === 'CRITICAL' || b.priority === 'HIGH').length,
      pendingReviewsCount: pendingReviews,
      openBugsCount: bugs.length,
    };

    // Recommended Actions for Team Lead based on actual state
    const recommendedActions: string[] = [];
    if (blockers.length > 0) {
      recommendedActions.push(`Resolve blocker ${blockers[0].blockerId}: "${blockers[0].title}" reported by ${blockers[0].reporter.name}`);
    }
    if (pendingReviews > 0) {
      const reviewTask = tasks.find(t => t.status === 'IN_REVIEW');
      if (reviewTask) {
        recommendedActions.push(`Perform technical review on ${reviewTask.taskId}: "${reviewTask.title}"`);
      }
    }
    if (overdueTasks > 0) {
      const overdue = tasks.find(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED');
      if (overdue) {
        recommendedActions.push(`Address overdue task ${overdue.taskId}: "${overdue.title}" (${overdue.assignee?.name || 'Unassigned'})`);
      }
    }
    if (demoChecklist.stats.failed > 0) {
      recommendedActions.push(`Re-test and fix ${demoChecklist.stats.failed} failing live demo checklist item(s)`);
    }
    if (readiness.overallScore < 80) {
      recommendedActions.push(`Elevate SIH Readiness from ${readiness.overallScore}% (${readiness.statusLabel}) to 90%+`);
    }

    return {
      project: {
        id: project?.id,
        projectId: project?.projectId,
        name: project?.name || 'AcadShield',
        sihProblemStatement: project?.sihProblemStatement,
        currentSprint: 'Sprint 2 (Core Integration)',
        overallProgress,
      },
      health: {
        overallProgress,
        totalTasks,
        completedTasks,
        inProgressTasks,
        blockedTasks,
        overdueTasks,
        openBugs: bugs.length,
        openPrs: githubRepo?.pullRequests.length || 0,
        pendingReviews,
      },
      teamStatus,
      milestones: milestones.map(m => ({
        id: m.id,
        code: m.milestoneCode,
        name: m.name,
        progress: m.progress,
        status: m.status,
        deadline: m.endDate,
        owner: m.owner?.name,
      })),
      activeBlockers: blockers.map(b => ({
        id: b.id,
        blockerId: b.blockerId,
        title: b.title,
        reporter: b.reporter.name,
        blockingUser: b.blockingUser?.name || 'External / System',
        priority: b.priority,
        status: b.status,
        createdAt: b.createdAt,
      })),
      github: {
        commitsCount: 34,
        openPrsCount: githubRepo?.pullRequests.length || 2,
        openIssuesCount: 4,
        waitingReviewsCount: 2,
        recentCommits: githubRepo?.commits || [],
      },
      sihReadiness: {
        score: readiness.overallScore,
        statusLabel: readiness.statusLabel,
      },
      demoReadiness: {
        score: demoChecklist.stats.readyPercentage,
        passedCount: demoChecklist.stats.passed,
        totalCount: demoChecklist.stats.total,
      },
      recentActivities,
      urgent,
      recommendedActions,
    };
  }
}
