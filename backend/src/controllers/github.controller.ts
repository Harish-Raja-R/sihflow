import { Request, Response } from 'express';
import { GitHubService } from '../services/github.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class GitHubController {
  static async getOverview(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const overview = await GitHubService.getOverview(projectId as string);
      return sendSuccess(res, overview);
    } catch (error: any) {
      return sendError(res, 'FETCH_GITHUB_FAILED', error.message, 500);
    }
  }

  static async getCommits(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD', limit = '50' } = req.query;
      const commits = await GitHubService.getCommits(projectId as string, parseInt(limit as string, 10));
      return sendSuccess(res, commits);
    } catch (error: any) {
      return sendError(res, 'FETCH_COMMITS_FAILED', error.message, 500);
    }
  }

  static async getPullRequests(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const prs = await GitHubService.getPullRequests(projectId as string);
      return sendSuccess(res, prs);
    } catch (error: any) {
      return sendError(res, 'FETCH_PRS_FAILED', error.message, 500);
    }
  }

  static async getIssues(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const issues = await GitHubService.getIssues(projectId as string);
      return sendSuccess(res, issues);
    } catch (error: any) {
      return sendError(res, 'FETCH_ISSUES_FAILED', error.message, 500);
    }
  }
}
