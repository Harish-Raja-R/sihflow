import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';

const router = Router();

// POST /api/v1/ai/query
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query = '', projectId = 'proj-acadshield-001' } = req.body;
    const lowerQuery = query.toLowerCase();

    // Fetch live project state for grounding
    const project = await prisma.project.findFirst({
      where: { OR: [{ id: projectId }, { projectId }] },
    });

    const activeBlockers = await prisma.blocker.findMany({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
      include: { reporter: true, blockedUser: true },
    });

    const inProgressTasks = await prisma.task.findMany({
      where: { status: 'IN_PROGRESS' },
      include: { assignee: true },
    });

    let answer = '';
    const suggestedActions: string[] = [];

    if (lowerQuery.includes('block') || lowerQuery.includes('delay') || lowerQuery.includes('stuck')) {
      if (activeBlockers.length > 0) {
        answer = `🚨 There is currently **${activeBlockers.length} active blocker** in the project:\n\n` +
          activeBlockers
            .map(
              (b) =>
                `• **${b.blockerId}**: ${b.title}\n  - Reported by: **${b.reporter.name}**\n  - Blocking: **${b.blockedUser?.name || 'External'}**\n  - Impact: ${b.impact || 'Delays pipeline'}`
            )
            .join('\n\n') +
          `\n\n**Recommendation**: Contact the blocking engineer immediately to clear the dependency.`;
        suggestedActions.push('Open Blocker Registry', 'Review Open PRs', 'Check Milestones');
      } else {
        answer = '✅ There are currently **0 active blockers** in the AcadShield development pipeline. Team is running smoothly!';
        suggestedActions.push("Today's recommended priorities", 'Summarize this week\'s progress');
      }
    } else if (lowerQuery.includes('who') || lowerQuery.includes('team') || lowerQuery.includes('member')) {
      answer = `👥 **Current In-Progress Deliverables Across Team Members**:\n\n` +
        inProgressTasks
          .map((t) => `• **${t.assignee?.name || 'Unassigned'}** (${t.assignee?.teamRole || 'Developer'}): ${t.taskId} - ${t.title} (${t.progress}%)`)
          .join('\n') +
        `\n\nAll 6 members are actively executing Sprint 2 deliverables.`;
      suggestedActions.push('View 6-Member Team Roster', 'Open Kanban Board');
    } else if (lowerQuery.includes('priority') || lowerQuery.includes('today') || lowerQuery.includes('do now')) {
      answer = `🎯 **Team Lead Top Priorities for Today**:\n\n` +
        `1. **Resolve Blocker BLK-001**: Mount TLS client certs for Fabric peer gateway endorsement.\n` +
        `2. **Review PR #4**: Approve Hyperledger Fabric contract adapter code.\n` +
        `3. **Rehearse SIH Demo**: Run tamper-detection scenario check on public verification portal.\n` +
        `4. **Sync with Member 6**: Finalize Software Requirements Specification (SRS v1.0).`;
      suggestedActions.push('Resolve Blocker BLK-001', 'Open Code Reviews', 'Open Demo Checklist');
    } else {
      answer = `📊 **AcadShield Project Summary**:\n\n` +
        `• **SIH Problem Statement**: #1422 (Tamper-Proof Academic Credential Verification)\n` +
        `• **Current Sprint**: Sprint 2 (Blockchain & UI Integration)\n` +
        `• **SIH Readiness Index**: 88% (Grand Finale Ready)\n` +
        `• **Demo Verification**: 4/5 scenarios validated\n` +
        `• **Active Blockers**: ${activeBlockers.length}\n` +
        `• **Active In-Progress Tasks**: ${inProgressTasks.length}`;
      suggestedActions.push('What is delaying us?', 'Who is blocked right now?', 'Today\'s recommended priorities');
    }

    return sendSuccess(res, {
      query,
      answer,
      suggestedActions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export const aiRoutes = router;
