import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ProjectController {
  static async getProjects(req: Request, res: Response) {
    try {
      const projects = await ProjectService.getProjects();
      return sendSuccess(res, projects);
    } catch (error: any) {
      return sendError(res, 'FETCH_PROJECTS_FAILED', error.message, 500);
    }
  }

  static async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);
      return sendSuccess(res, project);
    } catch (error: any) {
      return sendError(res, 'PROJECT_NOT_FOUND', 'Project was not found', 404);
    }
  }

  static async updateProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await ProjectService.updateProject(id, req.body, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_FAILED', error.message, 500);
    }
  }
}
