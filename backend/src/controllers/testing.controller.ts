import { Request, Response } from 'express';
import { TestingService } from '../services/testing.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class TestingController {
  static async getTestCases(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const cases = await TestingService.getTestCases(projectId as string);
      return sendSuccess(res, cases);
    } catch (error: any) {
      return sendError(res, 'FETCH_TESTS_FAILED', error.message, 500);
    }
  }

  static async getTestRuns(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const runs = await TestingService.getTestRuns(projectId as string);
      return sendSuccess(res, runs);
    } catch (error: any) {
      return sendError(res, 'FETCH_RUNS_FAILED', error.message, 500);
    }
  }

  static async updateTestCase(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await TestingService.updateTestCase(id, req.body, req.user?.userId);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'UPDATE_TEST_FAILED', error.message, 500);
    }
  }

  static async getMetrics(req: Request, res: Response) {
    try {
      const { projectId = 'PROJ-ACADSHIELD' } = req.query;
      const metrics = await TestingService.getTestMetrics(projectId as string);
      return sendSuccess(res, metrics);
    } catch (error: any) {
      return sendError(res, 'FETCH_METRICS_FAILED', error.message, 500);
    }
  }
}
