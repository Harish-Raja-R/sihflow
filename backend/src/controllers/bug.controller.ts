import { Request, Response } from 'express';
import { BugService } from '../services/bug.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class BugController {
  static async getBugs(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const bugs = await BugService.getBugs(projectId as string);
      return sendSuccess(res, bugs);
    } catch (error: any) {
      return sendError(res, 'FETCH_BUGS_FAILED', error.message, 500);
    }
  }

  static async createBug(req: AuthenticatedRequest, res: Response) {
    try {
      const bug = await BugService.createBug({
        ...req.body,
        reporterId: req.user?.userId || req.body.reporterId,
      }, req.user?.userId);
      return sendSuccess(res, bug, 201);
    } catch (error: any) {
      return sendError(res, 'CREATE_BUG_FAILED', error.message, 500);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await BugService.updateBugStatus(id, status, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_BUG_FAILED', error.message, 500);
    }
  }
}
