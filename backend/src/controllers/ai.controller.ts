import { Request, Response } from 'express';
import { AiAssistantService } from '../services/ai-assistant.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AiController {
  static async query(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD', query } = req.body;
      if (!query) {
        return sendError(res, 'VALIDATION_ERROR', 'Query is required', 400);
      }

      const result = await AiAssistantService.queryAssistant(projectId, query, req.user?.userId);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, 'AI_QUERY_FAILED', error.message, 500);
    }
  }
}
