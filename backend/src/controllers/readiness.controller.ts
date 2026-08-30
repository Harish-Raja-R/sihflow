import { Request, Response } from 'express';
import { ReadinessService } from '../services/readiness.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ReadinessController {
  static async getSihReadiness(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const readiness = await ReadinessService.getSihReadiness(projectId as string);
      return sendSuccess(res, readiness);
    } catch (error: any) {
      return sendError(res, 'FETCH_READINESS_FAILED', error.message, 500);
    }
  }

  static async updateReadinessItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await ReadinessService.updateReadinessItem(id, req.body, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_READINESS_FAILED', error.message, 500);
    }
  }

  static async getDemoChecklist(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const checklist = await ReadinessService.getDemoChecklist(projectId as string);
      return sendSuccess(res, checklist);
    } catch (error: any) {
      return sendError(res, 'FETCH_CHECKLIST_FAILED', error.message, 500);
    }
  }

  static async updateDemoChecklistItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, evidence } = req.body;
      const updated = await ReadinessService.updateDemoChecklistItem(id, status, evidence, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_CHECKLIST_ITEM_FAILED', error.message, 500);
    }
  }
}
