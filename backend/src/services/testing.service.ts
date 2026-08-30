import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class TestingService {
  static async getTestCases(projectId: string) {
    return prisma.testCase.findMany({
      where: { projectId },
      include: {
        tester: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        },
        workstream: {
          select: {
            id: true,
            code: true,
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getTestRuns(projectId: string) {
    return prisma.testRun.findMany({
      where: { projectId },
      orderBy: { executedAt: 'desc' }
    });
  }

  static async updateTestCase(id: string, data: any, userId?: string) {
    const updated = await prisma.testCase.update({
      where: { id },
      data: {
        ...data,
        executionDate: data.status ? new Date() : undefined,
      }
    });

    if (data.status) {
      await ActivityService.logEvent({
        projectId: updated.projectId,
        userId,
        eventType: 'TEST_CASE_EXECUTED',
        entityType: 'TEST_CASE',
        entityId: updated.id,
        summary: `Executed test case ${updated.testCaseId} (${updated.feature}): ${updated.status}`,
        details: { result: updated.actualResult, status: updated.status },
      });
    }

    return updated;
  }

  static async getTestMetrics(projectId: string) {
    const cases = await prisma.testCase.findMany({ where: { projectId } });
    const total = cases.length;
    const passed = cases.filter(c => c.status === 'PASS').length;
    const failed = cases.filter(c => c.status === 'FAIL').length;
    const blocked = cases.filter(c => c.status === 'BLOCKED').length;
    const notTested = cases.filter(c => c.status === 'NOT_TESTED').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return {
      total,
      passed,
      failed,
      blocked,
      notTested,
      passRate,
    };
  }
}
