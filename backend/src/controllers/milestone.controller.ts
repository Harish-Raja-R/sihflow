import { Request, Response } from 'express';
import { MilestoneService } from '../services/milestone.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class MilestoneController {
  static async getMilestones(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const milestones = await MilestoneService.getMilestones(projectId as string);
      return sendSuccess(res, milestones);
    } catch (error: any) {
      return sendError(res, 'FETCH_MILESTONES_FAILED', error.message, 500);
    }
  }

  static async updateMilestone(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await MilestoneService.updateMilestone(id, req.body, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_MILESTONE_FAILED', error.message, 500);
    }
  }
}
