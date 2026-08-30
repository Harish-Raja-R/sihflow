import { Request, Response } from 'express';
import { TeamService } from '../services/team.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class TeamController {
  static async getTeamMembers(req: Request, res: Response) {
    try {
      const { projectId } = req.query;
      const members = await TeamService.getTeamMembers(projectId as string);
      return sendSuccess(res, members);
    } catch (error: any) {
      return sendError(res, 'FETCH_TEAM_FAILED', error.message, 500);
    }
  }

  static async getMemberProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const profile = await TeamService.getMemberProfile(id);
      return sendSuccess(res, profile);
    } catch (error: any) {
      return sendError(res, 'MEMBER_NOT_FOUND', 'Team member not found', 404);
    }
  }

  static async updateMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await TeamService.updateMember(id, req.body, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_FAILED', error.message, 500);
    }
  }
}
