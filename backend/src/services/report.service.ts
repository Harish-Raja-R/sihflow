import { prisma } from '../database/prisma.js';
import { AnalyticsService } from './analytics.service.js';
import { ActivityService } from './activity.service.js';

export class ReportService {
  static async getReports(projectId: string) {
    return prisma.report.findMany({
      where: { projectId },
      orderBy: { generatedAt: 'desc' }
    });
  }

  static async generateReport(projectId: string, reportType: string, generatedById: string) {
    const metrics = await AnalyticsService.getDashboardMetrics(projectId);
    const dateStr = new Date().toISOString().split('T')[0];

    let title = '';
    let summary = '';
    let reportData: any = {};

    switch (reportType) {
      case 'WEEKLY_PROJECT':
        title = `Weekly SIH Project Report - ${dateStr}`;
        summary = `Project ${metrics.project.name} is at ${metrics.health.overallProgress}% progress with SIH Readiness at ${metrics.sihReadiness.score}%. Active tasks: ${metrics.health.inProgressTasks}, Blockers: ${metrics.activeBlockers.length}.`;
        reportData = {
          metrics: metrics.health,
          sihReadiness: metrics.sihReadiness,
          teamStatus: metrics.teamStatus,
          milestones: metrics.milestones,
          blockers: metrics.activeBlockers,
        };
        break;

      case 'TEAM_CONTRIBUTION':
        title = `Team Contribution & Velocity Audit - ${dateStr}`;
        summary = `Comprehensive contribution analytics across all 6 members of the AcadShield SIH team.`;
        reportData = {
          teamStatus: metrics.teamStatus,
          totalCommits: metrics.github.commitsCount,
        };
        break;

      case 'SIH_READINESS':
        title = `SIH Grand Finale Readiness Evaluation - ${dateStr}`;
        summary = `Formal 14-category evaluation resulting in an overall index of ${metrics.sihReadiness.score}% (${metrics.sihReadiness.statusLabel}).`;
        reportData = {
          sihReadiness: metrics.sihReadiness,
          demoReadiness: metrics.demoReadiness,
        };
        break;

      case 'DEMO_READINESS':
        title = `Live Demo Script & Systems Checklist - ${dateStr}`;
        summary = `Demo pass rate: ${metrics.demoReadiness.score}% (${metrics.demoReadiness.passedCount}/${metrics.demoReadiness.totalCount} scenarios tested).`;
        reportData = metrics.demoReadiness;
        break;

      default:
        title = `General Status Report - ${dateStr}`;
        summary = `Status report for ${metrics.project.name}.`;
        reportData = metrics;
    }

    const report = await prisma.report.create({
      data: {
        projectId,
        reportType,
        title,
        summary,
        data: JSON.stringify(reportData),
        generatedById,
      }
    });

    await ActivityService.logEvent({
      projectId,
      userId: generatedById,
      eventType: 'REPORT_GENERATED',
      entityType: 'REPORT',
      entityId: report.id,
      summary: `Generated report: "${report.title}"`,
      details: { reportType },
    });

    return report;
  }
}
