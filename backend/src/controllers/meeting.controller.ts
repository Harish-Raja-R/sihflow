import { Request, Response } from 'express';
import { MeetingService } from '../services/meeting.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class MeetingController {
  static async getMeetings(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const meetings = await MeetingService.getMeetings(projectId as string);
      return sendSuccess(res, meetings);
    } catch (error: any) {
      return sendError(res, 'FETCH_MEETINGS_FAILED', error.message, 500);
    }
  }

  static async createMeeting(req: AuthenticatedRequest, res: Response) {
    try {
      const meeting = await MeetingService.createMeeting(req.body, req.user?.userId);
      return sendSuccess(res, meeting, 201);
    } catch (error: any) {
      return sendError(res, 'CREATE_MEETING_FAILED', error.message, 500);
    }
  }

  static async convertActionItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { actionItemId } = req.params;
      const task = await MeetingService.convertActionItemToTask(actionItemId, req.user?.userId);
      return sendSuccess(res, task, 201);
    } catch (error: any) {
      return sendError(res, 'CONVERT_FAILED', error.message, 500);
    }
  }
}
