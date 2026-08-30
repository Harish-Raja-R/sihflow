import { prisma } from '../database/prisma.js';
import { AnalyticsService } from './analytics.service.js';
import { ProjectService } from './project.service.js';

export class AiAssistantService {
  static async queryAssistant(projectId: string, userQuery: string, userId?: string) {
    const resolvedId = await ProjectService.resolveProjectId(projectId);
    const q = userQuery.toLowerCase().trim();
    const metrics = await AnalyticsService.getDashboardMetrics(resolvedId);
    const blockers = await prisma.blocker.findMany({
      where: { projectId: resolvedId, status: { in: ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS'] } },
      include: { reporter: true, blockingUser: true, task: true }
    });
    const overdueTasks = await prisma.task.findMany({
      where: {
        projectId: resolvedId,
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() }
      },
      include: { assignee: true, workstream: true }
    });
    const inProgressTasks = await prisma.task.findMany({
      where: { projectId: resolvedId, status: 'IN_PROGRESS' },
      include: { assignee: true, workstream: true }
    });
    const milestones = await prisma.milestone.findMany({
      where: { projectId: resolvedId },
      include: { owner: true }
    });

    let answer = '';
    const suggestedActions: string[] = [];

    if (q.includes('delay') || q.includes('bottleneck') || q.includes('what is delaying') || q.includes('blocked')) {
      if (blockers.length === 0 && overdueTasks.length === 0) {
        answer = `Great news! There are currently no active blockers or overdue tasks in ${metrics.project.name}. All milestones are progressing on schedule.`;
      } else {
        answer = `### 🚨 Current Project Delay & Blocker Analysis\n\n`;
        if (blockers.length > 0) {
          answer += `**Active Blockers (${blockers.length}):**\n`;
          blockers.forEach(b => {
            answer += `- **${b.blockerId}**: "${b.title}" reported by **${b.reporter.name}** (Priority: ${b.priority}). Blocked by: ${b.blockingUser ? b.blockingUser.name : 'System/External dependency'}.\n`;
          });
          answer += `\n`;
        }
        if (overdueTasks.length > 0) {
          answer += `**Overdue Tasks (${overdueTasks.length}):**\n`;
          overdueTasks.forEach(t => {
            answer += `- **${t.taskId}**: "${t.title}" (${t.assignee?.name || 'Unassigned'}) — Due on ${t.dueDate?.toISOString().split('T')[0]}.\n`;
          });
        }
        suggestedActions.push('Resolve highest priority blocker first');
        suggestedActions.push('Reassign overdue task resources');
      }
    } else if (q.includes('today') || q.includes('complete today') || q.includes('priority')) {
      answer = `### 🎯 Recommended Priorities for Today\n\n`;
      answer += `Based on current sprint objectives and the critical path to SIH readiness:\n\n`;
      if (blockers.length > 0) {
        answer += `1. **Immediate Unblocking**: Resolve blocker ${blockers[0].blockerId} (${blockers[0].title}).\n`;
      }
      if (inProgressTasks.length > 0) {
        answer += `2. **In-Progress Tasks to Drive to Review**:\n`;
        inProgressTasks.slice(0, 4).forEach(t => {
          answer += `   - **${t.taskId}** (${t.assignee?.name}): ${t.title} [${t.progress}%]\n`;
        });
      }
      answer += `3. **Live Demo Verification**: Maintain the 14-item Demo Checklist pass rate (currently at ${metrics.demoReadiness.score}%).\n`;
      suggestedActions.push('Review pending PRs in GitHub Hub');
      suggestedActions.push('Run verification test suite');
    } else if (q.includes('milestone') || q.includes('at risk')) {
      const atRisk = milestones.filter(m => m.status === 'AT_RISK' || m.status === 'DELAYED');
      if (atRisk.length === 0) {
        answer = `### 📊 Milestone Health Summary\n\nAll ${milestones.length} milestones are currently **ON TRACK** or **COMPLETED**!\n\n`;
        milestones.forEach(m => {
          answer += `- **${m.milestoneCode}**: ${m.name} — Progress: **${m.progress}%** (${m.status})\n`;
        });
      } else {
        answer = `### ⚠️ Milestones Requiring Attention\n\n`;
        atRisk.forEach(m => {
          answer += `- **${m.milestoneCode}**: ${m.name} is **${m.status}** with ${m.progress}% progress (Owner: ${m.owner?.name || 'Unassigned'}).\n`;
        });
      }
    } else if (q.includes('summarize') || q.includes('progress') || q.includes('report') || q.includes('weekly')) {
      answer = `### 📋 Weekly SIH Progress Summary: ${metrics.project.name}\n\n`;
      answer += `- **Overall Project Progress**: ${metrics.health.overallProgress}%\n`;
      answer += `- **SIH Readiness Score**: ${metrics.sihReadiness.score}% (${metrics.sihReadiness.statusLabel})\n`;
      answer += `- **Demo Readiness**: ${metrics.demoReadiness.score}% (${metrics.demoReadiness.passedCount}/${metrics.demoReadiness.totalCount} items passed)\n`;
      answer += `- **Task Velocity**: ${metrics.health.completedTasks} completed, ${metrics.health.inProgressTasks} active, ${metrics.health.blockedTasks} blocked\n`;
      answer += `- **GitHub Activity**: ${metrics.github.commitsCount} commits, ${metrics.github.openPrsCount} open PRs, ${metrics.github.openIssuesCount} issues\n\n`;
      answer += `**Key Highlights**:\n- Core backend and database infrastructure established.\n- Hyperledger Fabric smart contract prototype operational.\n- Public verification and student wallet workflows integrated.\n`;
    } else {
      answer = `### 💡 SIH Assistant Project Status\n\n`;
      answer += `Project **${metrics.project.name}** is currently at **${metrics.health.overallProgress}% overall completion** with an SIH Readiness score of **${metrics.sihReadiness.score}% (${metrics.sihReadiness.statusLabel})**.\n\n`;
      answer += `Team Status:\n`;
      metrics.teamStatus.forEach(m => {
        answer += `- **${m.name}** (${m.teamRole}): ${m.currentTask ? `Working on ${m.currentTask.taskId} (${m.currentTask.title})` : 'Available'}\n`;
      });
      answer += `\n*Ask me about project delays, blockers, today's priorities, milestones, or report generation.*`;
    }

    return {
      query: userQuery,
      answer,
      suggestedActions,
      contextMetrics: {
        overallProgress: metrics.health.overallProgress,
        sihReadiness: metrics.sihReadiness.score,
        activeBlockersCount: blockers.length,
        overdueTasksCount: overdueTasks.length,
      }
    };
  }
}
