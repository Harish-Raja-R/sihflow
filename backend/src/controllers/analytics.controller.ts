import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const data = await AnalyticsService.getDashboardMetrics(projectId as string);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, 'FETCH_DASHBOARD_FAILED', error.message, 500);
    }
  }
}
