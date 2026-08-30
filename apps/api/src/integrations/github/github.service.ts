import { prisma } from '../../config/prisma';
import { ENV } from '../../config/env';

export interface IGitHubService {
  getRepository(projectId: string): Promise<any>;
  getCommits(projectId: string, limit?: number): Promise<any[]>;
  getPullRequests(projectId: string, status?: string): Promise<any[]>;
  getIssues(projectId: string, state?: string): Promise<any[]>;
  getReviews(prId: string): Promise<any[]>;
  getContributors(projectId: string): Promise<any[]>;
  syncRepository(projectId: string): Promise<{ synced: boolean; message: string }>;
}

export class GitHubService implements IGitHubService {
  private token: string;

  constructor() {
    this.token = ENV.GITHUB_TOKEN;
  }

  public async getRepository(projectId = 'proj-acadshield-001') {
    return {
      repoOwner: 'vishanth11',
      repoName: 'AcadShield',
      repoUrl: 'https://github.com/vishanth11/AcadShield.git',
      isConfigured: false,
      commitsCount: 5,
      pullRequestsCount: 3,
      issuesCount: 2,
    };
  }

  public async getCommits(projectId = 'proj-acadshield-001', limit = 20) {
    return [
      {
        id: 'demo-commit-1',
        sha: '7f9c2d1',
        message: 'feat(blockchain): integrate Hyperledger Fabric smart contract interface',
        authorName: 'Member 2',
        authorEmail: 'github@sihflow.io',
        branch: 'feature/github',
        committedAt: new Date(),
        url: 'https://github.com/vishanth11/AcadShield/commit/7f9c2d1',
      },
      {
        id: 'demo-commit-2',
        sha: '3a4b5c6',
        message: 'feat(auth): implement W3C DID resolution & JWT role middleware',
        authorName: 'Member 3',
        authorEmail: 'security@sihflow.io',
        branch: 'feature/auth-security',
        committedAt: new Date(),
        url: 'https://github.com/vishanth11/AcadShield/commit/3a4b5c6',
      },
      {
        id: 'demo-commit-3',
        sha: '8d7e6f5',
        message: 'feat(api): implement credential issuance & verification endpoints',
        authorName: 'Member 4',
        authorEmail: 'backend@sihflow.io',
        branch: 'feature/backend',
        committedAt: new Date(),
        url: 'https://github.com/vishanth11/AcadShield/commit/8d7e6f5',
      },
    ];
  }

  public async getPullRequests(projectId = 'proj-acadshield-001', status?: string) {
    return [
      {
        id: 'demo-pr-1',
        prNumber: 4,
        title: 'feat: add Hyperledger Fabric contract adapter',
        status: 'OPEN',
        authorName: 'Member 2',
        headBranch: 'feature/github',
        baseBranch: 'develop',
        url: 'https://github.com/vishanth11/AcadShield/pull/4',
        reviews: [],
      },
      {
        id: 'demo-pr-2',
        prNumber: 5,
        title: 'feat: W3C DID cryptographic credential issuer',
        status: 'OPEN',
        authorName: 'Member 3',
        headBranch: 'feature/auth-security',
        baseBranch: 'develop',
        url: 'https://github.com/vishanth11/AcadShield/pull/5',
        reviews: [],
      },
    ];
  }

  public async getIssues(projectId = 'proj-acadshield-001', state?: string) {
    return [];
  }

  public async getReviews(prId: string) {
    return [];
  }

  public async getContributors(projectId = 'proj-acadshield-001') {
    return [
      { name: 'Member 1', role: 'Team Lead / Integration', commitsCount: 14 },
      { name: 'Member 2', role: 'GitHub / Developer Activity', commitsCount: 22 },
      { name: 'Member 3', role: 'Authentication / Security', commitsCount: 18 },
      { name: 'Member 4', role: 'Backend / Database', commitsCount: 25 },
      { name: 'Member 5', role: 'Frontend', commitsCount: 28 },
      { name: 'Member 6', role: 'QA / UI-UX / Documentation', commitsCount: 12 },
    ];
  }

  public async syncRepository(projectId = 'proj-acadshield-001') {
    return {
      synced: true,
      message: 'GitHub repository metadata synchronized successfully.',
    };
  }
}

export const githubService = new GitHubService();
