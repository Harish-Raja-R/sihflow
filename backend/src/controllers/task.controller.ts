import { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class TaskController {
  static async getTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getTasks(req.query);
      return sendSuccess(res, tasks);
    } catch (error: any) {
      return sendError(res, 'FETCH_TASKS_FAILED', error.message, 500);
    }
  }

  static async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await TaskService.getTaskById(id);
      return sendSuccess(res, task);
    } catch (error: any) {
      return sendError(res, 'TASK_NOT_FOUND', 'Task not found', 404);
    }
  }

  static async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const task = await TaskService.createTask(req.body, req.user?.userId);
      return sendSuccess(res, task, 201);
    } catch (error: any) {
      return sendError(res, 'CREATE_TASK_FAILED', error.message, 500);
    }
  }

  static async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await TaskService.updateTask(id, req.body, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_TASK_FAILED', error.message, 500);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await TaskService.updateTaskStatus(id, status, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_STATUS_FAILED', error.message, 500);
    }
  }

  static async addSubtask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const subtask = await TaskService.addSubtask(id, title, req.user?.userId);
      return sendSuccess(res, subtask, 201);
    } catch (error: any) {
      return sendError(res, 'ADD_SUBTASK_FAILED', error.message, 500);
    }
  }

  static async toggleSubtask(req: AuthenticatedRequest, res: Response) {
    try {
      const { subtaskId } = req.params;
      const { completed } = req.body;
      const subtask = await TaskService.toggleSubtask(subtaskId, completed, req.user?.userId);
      return sendSuccess(res, subtask);
    } catch (error: any) {
      return sendError(res, 'TOGGLE_SUBTASK_FAILED', error.message, 500);
    }
  }

  static async addComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Auth required', 401);
      }
      const newComment = await TaskService.addComment(id, req.user.userId, comment);
      return sendSuccess(res, newComment, 201);
    } catch (error: any) {
      return sendError(res, 'ADD_COMMENT_FAILED', error.message, 500);
    }
  }
}
