import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ProjectController } from '../controllers/project.controller.js';
import { TeamController } from '../controllers/team.controller.js';
import { TaskController } from '../controllers/task.controller.js';
import { MilestoneController } from '../controllers/milestone.controller.js';
import { SprintController } from '../controllers/sprint.controller.js';
import { BlockerController } from '../controllers/blocker.controller.js';
import { ActivityController } from '../controllers/activity.controller.js';
import { GitHubController } from '../controllers/github.controller.js';
import { MeetingController } from '../controllers/meeting.controller.js';
import { DocumentController } from '../controllers/document.controller.js';
import { RiskController } from '../controllers/risk.controller.js';
import { BugController } from '../controllers/bug.controller.js';
import { TestingController } from '../controllers/testing.controller.js';
import { ReadinessController } from '../controllers/readiness.controller.js';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { AiController } from '../controllers/ai.controller.js';
import { ReportController } from '../controllers/report.controller.js';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticate, requireTeamLead, requireReviewer } from '../middleware/auth.middleware.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'SihFlow ERP',
    targetProject: 'AcadShield',
    mode: process.env.DEMO_MODE !== 'false' ? 'demo' : 'production',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/me', authenticate as any, AuthController.getMe as any);

// Projects
router.get('/projects', ProjectController.getProjects);
router.get('/projects/:id', ProjectController.getProjectById);
router.patch('/projects/:id', authenticate as any, requireTeamLead as any, ProjectController.updateProject as any);

// Team Members
router.get('/team', TeamController.getTeamMembers);
router.get('/team/:id', TeamController.getMemberProfile);
router.patch('/team/:id', authenticate as any, requireTeamLead as any, TeamController.updateMember as any);

// Tasks
router.get('/tasks', TaskController.getTasks);
router.get('/tasks/:id', TaskController.getTaskById);
router.post('/tasks', authenticate as any, TaskController.createTask as any);
router.patch('/tasks/:id', authenticate as any, TaskController.updateTask as any);
router.patch('/tasks/:id/status', authenticate as any, TaskController.updateStatus as any);
router.post('/tasks/:id/subtasks', authenticate as any, TaskController.addSubtask as any);
router.patch('/subtasks/:subtaskId/toggle', authenticate as any, TaskController.toggleSubtask as any);
router.post('/tasks/:id/comments', authenticate as any, TaskController.addComment as any);

// Milestones
router.get('/milestones', MilestoneController.getMilestones);
router.patch('/milestones/:id', authenticate as any, requireTeamLead as any, MilestoneController.updateMilestone as any);

// Sprints
router.get('/sprints', SprintController.getSprints);
router.get('/sprints/active', SprintController.getActiveSprint);

// Blockers
router.get('/blockers', BlockerController.getBlockers);
router.post('/blockers', authenticate as any, BlockerController.reportBlocker as any);
router.patch('/blockers/:id/resolve', authenticate as any, BlockerController.resolveBlocker as any);

// Activity
router.get('/activity', ActivityController.getActivities);

// GitHub
router.get('/github/overview', GitHubController.getOverview);
router.get('/github/commits', GitHubController.getCommits);
router.get('/github/pull-requests', GitHubController.getPullRequests);
router.get('/github/issues', GitHubController.getIssues);

// Meetings
router.get('/meetings', MeetingController.getMeetings);
router.post('/meetings', authenticate as any, MeetingController.createMeeting as any);
router.post('/meetings/action-items/:actionItemId/convert', authenticate as any, MeetingController.convertActionItem as any);

// Documents
router.get('/documents', DocumentController.getDocuments);
router.post('/documents', authenticate as any, DocumentController.createDocument as any);
router.patch('/documents/:id/status', authenticate as any, requireReviewer as any, DocumentController.updateStatus as any);

// Risks
router.get('/risks', RiskController.getRisks);
router.post('/risks', authenticate as any, RiskController.createRisk as any);
router.patch('/risks/:id', authenticate as any, RiskController.updateRisk as any);

// Bugs
router.get('/bugs', BugController.getBugs);
router.post('/bugs', authenticate as any, BugController.createBug as any);
router.patch('/bugs/:id/status', authenticate as any, BugController.updateStatus as any);

// Testing
router.get('/testing/test-cases', TestingController.getTestCases);
router.get('/testing/test-runs', TestingController.getTestRuns);
router.patch('/testing/test-cases/:id', authenticate as any, TestingController.updateTestCase as any);
router.get('/testing/metrics', TestingController.getMetrics);

// Readiness & Demo Checklist
router.get('/readiness/sih', ReadinessController.getSihReadiness);
router.patch('/readiness/sih/:id', authenticate as any, ReadinessController.updateReadinessItem as any);
router.get('/readiness/demo-checklist', ReadinessController.getDemoChecklist);
router.patch('/readiness/demo-checklist/:id', authenticate as any, ReadinessController.updateDemoChecklistItem as any);

// Analytics
router.get('/analytics/dashboard', AnalyticsController.getDashboard);

// AI Assistant
router.post('/ai/query', authenticate as any, AiController.query as any);

// Reports
router.get('/reports', ReportController.getReports);
router.post('/reports/generate', authenticate as any, ReportController.generateReport as any);

// Notifications
router.get('/notifications', authenticate as any, NotificationController.getNotifications as any);
router.patch('/notifications/:id/read', authenticate as any, NotificationController.markAsRead as any);
router.patch('/notifications/read-all', authenticate as any, NotificationController.markAllAsRead as any);

export default router;
