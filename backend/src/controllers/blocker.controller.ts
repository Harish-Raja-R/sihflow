import { Request, Response } from 'express';
import { BlockerService } from '../services/blocker.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class BlockerController {
  static async getBlockers(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const blockers = await BlockerService.getBlockers(projectId as string);
      return sendSuccess(res, blockers);
    } catch (error: any) {
      return sendError(res, 'FETCH_BLOCKERS_FAILED', error.message, 500);
    }
  }

  static async reportBlocker(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD', taskId, title, description, blockingUserId, priority, expectedResolution } = req.body;
      if (!title || !description) {
        return sendError(res, 'VALIDATION_ERROR', 'Title and description are required', 400);
      }

      const blocker = await BlockerService.reportBlocker({
        projectId,
        taskId,
        title,
        description,
        reportedById: req.user!.userId,
        blockingUserId,
        priority,
        expectedResolution,
      });

      return sendSuccess(res, blocker, 201);
    } catch (error: any) {
      return sendError(res, 'REPORT_BLOCKER_FAILED', error.message, 500);
    }
  }

  static async resolveBlocker(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { resolutionNotes } = req.body;
      const resolved = await BlockerService.resolveBlocker(id, resolutionNotes || 'Resolved by lead/team', req.user?.userId);
      return sendSuccess(res, resolved);
    } catch (error: any) {
      return sendError(res, 'RESOLVE_BLOCKER_FAILED', error.message, 500);
    }
  }
}
