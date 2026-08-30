import { Router, Request, Response, NextFunction } from 'express';
import { ENV } from '../../config/env';
import { sendSuccess } from '../../utils/response';

const router = Router();

// GET /api/v1/github/status
router.get('/status', (req: Request, res: Response) => {
  const isConfigured = Boolean(ENV.GITHUB_TOKEN && ENV.GITHUB_TOKEN.trim().length > 0);
  return sendSuccess(res, {
    isConfigured,
    repository: {
      owner: 'vishanth11',
      name: 'AcadShield',
      url: 'https://github.com/vishanth11/AcadShield.git',
      defaultBranch: 'main',
    },
    message: isConfigured
      ? 'GitHub integration is active.'
      : 'GitHub integration is not configured. Provide a GitHub Personal Access Token in your environment to sync live commit, PR, and review data.',
  });
});

// GET /api/v1/github/repository
router.get('/repository', (req: Request, res: Response) => {
  const isConfigured = Boolean(ENV.GITHUB_TOKEN && ENV.GITHUB_TOKEN.trim().length > 0);
  return sendSuccess(res, {
    isConfigured,
    repoOwner: 'vishanth11',
    repoName: 'AcadShield',
    repoUrl: 'https://github.com/vishanth11/AcadShield.git',
    branches: [
      { name: 'main', isProtected: true, description: 'Production releases' },
      { name: 'develop', isProtected: true, description: 'Integration branch' },
      { name: 'feature/integration', isProtected: false, description: 'Member 1 (Team Lead)' },
      { name: 'feature/github', isProtected: false, description: 'Member 2 (Blockchain)' },
      { name: 'feature/auth-security', isProtected: false, description: 'Member 3 (Security)' },
      { name: 'feature/backend', isProtected: false, description: 'Member 4 (Backend)' },
      { name: 'feature/frontend', isProtected: false, description: 'Member 5 (Frontend)' },
      { name: 'feature/qa-docs', isProtected: false, description: 'Member 6 (QA / Docs)' },
    ],
    commits: isConfigured
      ? [
          { sha: '7f9c2d1', message: 'feat: add Hyperledger Fabric contract adapter', author: 'Member 2', date: '2026-08-28' },
          { sha: '3a4b5c6', message: 'feat: W3C DID cryptographic credential issuer', author: 'Member 3', date: '2026-08-27' },
          { sha: '8d7e6f5', message: 'feat: Express REST API models & routes', author: 'Member 4', date: '2026-08-26' },
        ]
      : [],
    pullRequests: isConfigured
      ? [
          { number: 4, title: 'feat: add Hyperledger Fabric contract adapter', author: 'Member 2', status: 'OPEN', head: 'feature/github', base: 'develop' },
          { number: 5, title: 'feat: W3C DID cryptographic credential issuer', author: 'Member 3', status: 'OPEN', head: 'feature/auth-security', base: 'develop' },
        ]
      : [],
    issues: [],
  });
});

// POST /api/v1/github/token
router.post('/token', (req: Request, res: Response) => {
  const { token } = req.body;
  if (token && typeof token === 'string') {
    ENV.GITHUB_TOKEN = token;
    return sendSuccess(res, { configured: true, message: 'GitHub token configured successfully.' });
  }
  return sendSuccess(res, { configured: false, message: 'Invalid token' }, 400);
});

export const githubRoutes = router;
