import { Request, Response } from 'express';
import { ActivityService } from '../services/activity.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class ActivityController {
  static async getActivities(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD', limit = '50', offset = '0' } = req.query;
      const result = await ActivityService.getActivities(
        projectId as string,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );
      return sendSuccess(res, result.activities, 200, { total: result.total });
    } catch (error: any) {
      return sendError(res, 'FETCH_ACTIVITIES_FAILED', error.message, 500);
    }
  }
}
