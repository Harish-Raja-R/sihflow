import { prisma } from '../database/prisma.js';
import { config } from '../config/index.js';

export class GitHubService {
  static async getOverview(projectId: string) {
    const repo = await prisma.gitHubRepo.findFirst({
      where: { projectId },
      include: {
        commits: {
          take: 10,
          orderBy: { commitDate: 'desc' }
        },
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          include: { reviews: true }
        },
        issues: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!repo) {
      return {
        repoName: 'vishanth11/AcadShield',
        repoUrl: config.githubRepoUrl,
        stats: {
          commitsCount: 0,
          openPrsCount: 0,
          mergedPrsCount: 0,
          waitingReviewsCount: 0,
          openIssuesCount: 0,
          closedIssuesCount: 0,
        },
        commits: [],
        pullRequests: [],
        issues: [],
      };
    }

    const totalCommits = await prisma.gitHubCommit.count({ where: { repoId: repo.id } });
    const openPrs = repo.pullRequests.filter(pr => pr.state === 'OPEN');
    const mergedPrs = repo.pullRequests.filter(pr => pr.state === 'MERGED');
    const waitingReviews = openPrs.filter(pr => pr.reviewsCount === 0 || pr.reviews.some(r => r.state === 'CHANGES_REQUESTED'));
    const openIssues = repo.issues.filter(i => i.state === 'OPEN');
    const closedIssues = repo.issues.filter(i => i.state === 'CLOSED');

    return {
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
      defaultBranch: repo.defaultBranch,
      lastSyncedAt: repo.lastSyncedAt,
      stats: {
        commitsCount: totalCommits,
        openPrsCount: openPrs.length,
        mergedPrsCount: mergedPrs.length,
        waitingReviewsCount: waitingReviews.length,
        openIssuesCount: openIssues.length,
        closedIssuesCount: closedIssues.length,
      },
      commits: repo.commits,
      pullRequests: repo.pullRequests,
      issues: repo.issues,
    };
  }

  static async getCommits(projectId: string, limit = 50) {
    const repo = await prisma.gitHubRepo.findFirst({ where: { projectId } });
    if (!repo) return [];

    return prisma.gitHubCommit.findMany({
      where: { repoId: repo.id },
      orderBy: { commitDate: 'desc' },
      take: limit,
    });
  }

  static async getPullRequests(projectId: string) {
    const repo = await prisma.gitHubRepo.findFirst({ where: { projectId } });
    if (!repo) return [];

    return prisma.gitHubPullRequest.findMany({
      where: { repoId: repo.id },
      include: { reviews: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getIssues(projectId: string) {
    const repo = await prisma.gitHubRepo.findFirst({ where: { projectId } });
    if (!repo) return [];

    return prisma.gitHubIssue.findMany({
      where: { repoId: repo.id },
      orderBy: { createdAt: 'desc' }
    });
  }
}
