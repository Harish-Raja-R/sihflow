import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { githubService } from '../../integrations/github/github.service';

const router = Router();

// GET /api/v1/analytics/dashboard
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalTasks = mockStore.tasks.length;
    const completedTasks = mockStore.tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = mockStore.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const blockedTasks = mockStore.tasks.filter((t) => t.status === 'BLOCKED').length;
    const pendingReviews = mockStore.tasks.filter((t) => t.status === 'IN_REVIEW').length;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 72;

    const teamStatus = mockStore.members.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      teamRole: m.teamRole,
      currentTask: m.currentTask,
      lastActivity: 'Active in Sprint 2',
      lastActivityAt: new Date().toISOString(),
    }));

    const formattedMilestones = mockStore.milestones.map((m) => ({
      id: m.id,
      code: m.milestoneCode,
      name: m.name,
      progress: m.progress,
      status: m.status,
      deadline: m.deadline,
    }));

    const activeBlockers = mockStore.blockers.filter((b) => b.status === 'OPEN').map((b) => ({
      id: b.id,
      blockerId: b.blockerId,
      title: b.title,
      reporter: b.reporter?.name || 'Member',
      blockingUser: b.blockedUser?.name || 'External Dependency',
      priority: b.priority,
      status: b.status,
      createdAt: b.createdAt,
    }));

    const recentCommits = await githubService.getCommits('proj-acadshield-001', 5);
    const prs = await githubService.getPullRequests('proj-acadshield-001');
    const issues = await githubService.getIssues('proj-acadshield-001');

    const recommendedActions = [
      activeBlockers.length > 0 ? `Resolve critical blocker: ${activeBlockers[0].title}` : 'Team is unblocked',
      'Review open pull requests (#4 & #5) awaiting architectural sign-off',
      'Run full tamper-detection QA rehearsal for SIH Live Demo scenario',
      'Confirm W3C DID key resolver parity on hyperledger testnet',
    ];

    return sendSuccess(res, {
      project: {
        id: mockStore.project.id,
        projectId: mockStore.project.projectId,
        name: mockStore.project.name,
        sihProblemStatement: mockStore.project.sihProblemStatement,
        currentSprint: 'Sprint 2 (Blockchain & UI)',
        overallProgress,
      },
      health: {
        overallProgress,
        totalTasks,
        completedTasks,
        inProgressTasks,
        blockedTasks,
        overdueTasks: 0,
        openBugs: 0,
        openPrs: prs.length,
        pendingReviews,
      },
      teamStatus,
      milestones: formattedMilestones,
      activeBlockers,
      github: {
        commitsCount: recentCommits.length,
        openPrsCount: prs.length,
        openIssuesCount: issues.length,
        waitingReviewsCount: pendingReviews,
        recentCommits,
      },
      sihReadiness: {
        score: 88,
        statusLabel: 'Grand Finale Ready',
      },
      demoReadiness: {
        score: 80,
        passedCount: 4,
        totalCount: 5,
      },
      recentActivities: mockStore.activities,
      urgent: {
        overdueTasksCount: 0,
        criticalBlockersCount: activeBlockers.length,
        pendingReviewsCount: pendingReviews,
        openBugsCount: 0,
      },
      recommendedActions,
    });
  } catch (error) {
    next(error);
  }
});

export const analyticsRoutes = router;
