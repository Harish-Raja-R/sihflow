import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/testing/test-cases
router.get('/test-cases', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.testCases);
});

// POST /api/v1/testing/test-cases
router.post('/test-cases', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { feature, description, steps, expectedResult, status } = req.body;
  const testCaseId = `TC-${String(mockStore.testCases.length + 1).padStart(2, '0')}`;

  const newTestCase = {
    id: `tc-${Date.now()}`,
    testCaseId,
    feature,
    description: description || '',
    steps: steps || '',
    expectedResult: expectedResult || '',
    status: status || 'NOT_TESTED',
    executionTimeMs: 35,
    lastRunAt: new Date().toISOString(),
  };

  mockStore.testCases.push(newTestCase);
  return sendSuccess(res, newTestCase, 201);
});

// PATCH /api/v1/testing/test-cases/:id
router.patch('/test-cases/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { feature, description, steps, expectedResult, status } = req.body;

  const tc = mockStore.testCases.find((t) => t.id === id || t.testCaseId === id);
  if (tc) {
    if (feature) tc.feature = feature;
    if (description !== undefined) tc.description = description;
    if (steps !== undefined) tc.steps = steps;
    if (expectedResult !== undefined) tc.expectedResult = expectedResult;
    if (status) {
      tc.status = status;
      tc.lastRunAt = new Date().toISOString();
    }
    return sendSuccess(res, tc);
  }

  return sendSuccess(res, { id, ...req.body });
});

// DELETE /api/v1/testing/test-cases/:id
router.delete('/test-cases/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.testCases.findIndex((t) => t.id === id || t.testCaseId === id);
  if (index !== -1) {
    const deleted = mockStore.testCases.splice(index, 1)[0];
    return sendSuccess(res, { message: `Test case ${deleted.testCaseId} deleted`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Test case deleted', id });
});

// GET /api/v1/testing/metrics
router.get('/metrics', async (req: Request, res: Response, next: NextFunction) => {
  const total = mockStore.testCases.length;
  const passed = mockStore.testCases.filter((t) => t.status === 'PASS').length;
  const failed = mockStore.testCases.filter((t) => t.status === 'FAIL').length;
  const blocked = mockStore.testCases.filter((t) => t.status === 'BLOCKED').length;
  const notTested = mockStore.testCases.filter((t) => t.status === 'NOT_TESTED').length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return sendSuccess(res, {
    total,
    passed,
    failed,
    blocked,
    notTested,
    passRate,
  });
});

export const testingRoutes = router;
