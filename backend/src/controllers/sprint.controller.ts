import { Request, Response } from 'express';
import { SprintService } from '../services/sprint.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class SprintController {
  static async getSprints(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const sprints = await SprintService.getSprints(projectId as string);
      return sendSuccess(res, sprints);
    } catch (error: any) {
      return sendError(res, 'FETCH_SPRINTS_FAILED', error.message, 500);
    }
  }

  static async getActiveSprint(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const activeSprint = await SprintService.getActiveSprint(projectId as string);
      return sendSuccess(res, activeSprint);
    } catch (error: any) {
      return sendError(res, 'FETCH_ACTIVE_SPRINT_FAILED', error.message, 500);
    }
  }
}
