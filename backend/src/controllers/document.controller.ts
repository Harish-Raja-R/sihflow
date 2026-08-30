import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class DocumentController {
  static async getDocuments(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const docs = await DocumentService.getDocuments(projectId as string);
      return sendSuccess(res, docs);
    } catch (error: any) {
      return sendError(res, 'FETCH_DOCS_FAILED', error.message, 500);
    }
  }

  static async createDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const doc = await DocumentService.createDocument({
        ...req.body,
        ownerId: req.user?.userId || req.body.ownerId,
      }, req.user?.userId);
      return sendSuccess(res, doc, 201);
    } catch (error: any) {
      return sendError(res, 'CREATE_DOC_FAILED', error.message, 500);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { reviewStatus, reviewNotes } = req.body;
      const updated = await DocumentService.updateDocumentStatus(id, reviewStatus, reviewNotes, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_STATUS_FAILED', error.message, 500);
    }
  }
}
