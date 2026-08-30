import { Request, Response } from 'express';
import { RiskService } from '../services/risk.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class RiskController {
  static async getRisks(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const risks = await RiskService.getRisks(projectId as string);
      return sendSuccess(res, risks);
    } catch (error: any) {
      return sendError(res, 'FETCH_RISKS_FAILED', error.message, 500);
    }
  }

  static async createRisk(req: AuthenticatedRequest, res: Response) {
    try {
      const risk = await RiskService.createRisk(req.body, req.user?.userId);
      return sendSuccess(res, risk, 201);
    } catch (error: any) {
      return sendError(res, 'CREATE_RISK_FAILED', error.message, 500);
    }
  }

  static async updateRisk(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await RiskService.updateRisk(id, req.body);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_RISK_FAILED', error.message, 500);
    }
  }
}
