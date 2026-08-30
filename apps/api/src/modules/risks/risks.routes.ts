import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { NotFoundError } from '../../utils/errors';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { createRiskSchema } from '@sihflow/validation';
import { activityService } from '../../services/activity.service';

const router = Router();

// GET /api/v1/risks
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId = 'proj-acadshield-001' } = req.query;

    const risks = await prisma.risk.findMany({
      where: {
        project: {
          OR: [{ id: String(projectId) }, { projectId: String(projectId) }],
        },
      },
      orderBy: [{ impact: 'desc' }, { createdAt: 'desc' }],
      include: {
        owner: { select: { id: true, name: true, teamRole: true } },
      },
    });

    return sendSuccess(res, risks);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/risks
router.post(
  '/',
  optionalAuthMiddleware,
  validateBody(createRiskSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, category, likelihood, impact, mitigationPlan, projectId } = req.body;

      const project = await prisma.project.findFirst({
        where: { OR: [{ id: projectId }, { projectId }] },
      });

      if (!project) {
        throw new NotFoundError('Project', projectId);
      }

      const risk = await prisma.risk.create({
        data: {
          projectId: project.id,
          title,
          description: description || '',
          category: category || 'TECHNICAL',
          likelihood: likelihood || 'MEDIUM',
          impact: impact || 'HIGH',
          mitigationPlan,
          ownerId: req.user?.id || null,
        },
      });

      await activityService.logActivity({
        projectId: project.id,
        userId: req.user?.id,
        eventType: 'RISK_LOGGED',
        entityType: 'RISK',
        entityId: risk.id,
        summary: `Identified ${risk.category} risk: "${risk.title}" (Impact: ${risk.impact})`,
      });

      return sendSuccess(res, risk, 201);
    } catch (error) {
      next(error);
    }
  }
);

export const riskRoutes = router;
