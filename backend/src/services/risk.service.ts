import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class RiskService {
  static async getRisks(projectId: string) {
    return prisma.risk.findMany({
      where: { projectId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        }
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  static async createRisk(data: any, userId?: string) {
    const risk = await prisma.risk.create({
      data,
      include: { owner: true }
    });

    await ActivityService.logEvent({
      projectId: risk.projectId,
      userId,
      eventType: 'RISK_IDENTIFIED',
      entityType: 'RISK',
      entityId: risk.id,
      summary: `⚠️ Identified project risk: "${risk.title}" (Severity: ${risk.severity})`,
      details: { probability: risk.probability, impact: risk.impact, mitigation: risk.mitigation },
    });

    return risk;
  }

  static async updateRisk(id: string, data: any) {
    return prisma.risk.update({
      where: { id },
      data,
    });
  }
}
