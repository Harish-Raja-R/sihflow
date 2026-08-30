import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';

const router = Router();

// GET /api/v1/activity
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.activities);
});

export const activityRoutes = router;
