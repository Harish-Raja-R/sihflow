import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';
import { ProjectService } from './project.service.js';

export class ReadinessService {
  static async getSihReadiness(projectId: string) {
    const resolvedId = await ProjectService.resolveProjectId(projectId);
    const items = await prisma.readinessItem.findMany({
      where: { projectId: resolvedId },
      orderBy: { orderIndex: 'asc' }
    });

    if (items.length === 0) {
      return {
        overallScore: 0,
        statusLabel: 'NOT READY',
        categories: [],
        items: [],
      };
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const weightedSum = items.reduce((sum, item) => sum + (item.progress * item.weight), 0);
    const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    let statusLabel = 'NOT READY';
    if (overallScore >= 90) statusLabel = 'SIH READY';
    else if (overallScore >= 75) statusLabel = 'NEAR READY';
    else if (overallScore >= 60) statusLabel = 'DEVELOPING';
    else if (overallScore >= 40) statusLabel = 'EARLY';

    return {
      overallScore,
      statusLabel,
      totalCategories: items.length,
      completedCategories: items.filter(i => i.progress === 100).length,
      items,
    };
  }

  static async updateReadinessItem(id: string, data: { progress?: number; evidence?: string; status?: string }, userId?: string) {
    const updated = await prisma.readinessItem.update({
      where: { id },
      data,
    });

    await ActivityService.logEvent({
      projectId: updated.projectId,
      userId,
      eventType: 'READINESS_UPDATED',
      entityType: 'READINESS',
      entityId: id,
      summary: `Updated SIH readiness for "${updated.category}": ${updated.progress}%`,
      details: data,
    });

    return updated;
  }

  static async getDemoChecklist(projectId: string) {
    const resolvedId = await ProjectService.resolveProjectId(projectId);
    const items = await prisma.demoChecklistItem.findMany({
      where: { projectId: resolvedId },
      orderBy: { orderIndex: 'asc' }
    });

    const total = items.length;
    const passed = items.filter(i => i.status === 'PASS').length;
    const failed = items.filter(i => i.status === 'FAIL').length;
    const notTested = items.filter(i => i.status === 'NOT_TESTED').length;
    const readyPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    return {
      items,
      stats: {
        total,
        passed,
        failed,
        notTested,
        readyPercentage,
      }
    };
  }

  static async updateDemoChecklistItem(id: string, status: string, evidence?: string, userId?: string) {
    const updated = await prisma.demoChecklistItem.update({
      where: { id },
      data: {
        status,
        evidence,
        lastTestedAt: new Date(),
      }
    });

    await ActivityService.logEvent({
      projectId: updated.projectId,
      userId,
      eventType: 'DEMO_ITEM_CHECKED',
      entityType: 'DEMO_CHECKLIST',
      entityId: id,
      summary: `Demo item ${updated.itemCode} ("${updated.title}") marked as ${status}`,
      details: { status, evidence },
    });

    return updated;
  }
}
