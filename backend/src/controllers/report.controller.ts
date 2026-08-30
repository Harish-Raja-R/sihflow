import { Request, Response } from 'express';
import { ReportService } from '../services/report.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ReportController {
  static async getReports(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const reports = await ReportService.getReports(projectId as string);
      return sendSuccess(res, reports);
    } catch (error: any) {
      return sendError(res, 'FETCH_REPORTS_FAILED', error.message, 500);
    }
  }

  static async generateReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD', reportType = 'WEEKLY_PROJECT' } = req.body;
      const report = await ReportService.generateReport(projectId, reportType, req.user?.userId || 'lead-user');
      return sendSuccess(res, report, 201);
    } catch (error: any) {
      return sendError(res, 'GENERATE_REPORT_FAILED', error.message, 500);
    }
  }
}
