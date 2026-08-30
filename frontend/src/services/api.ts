import axios from 'axios';
import {
  DashboardMetrics,
  Task,
  User,
  Project,
  Milestone,
  Sprint,
  Blocker,
  ActivityLog,
  Meeting,
  Document,
  Risk,
  Bug,
  TestCase,
  ReadinessItem,
  DemoChecklistItem,
  NotificationItem,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sihflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Token expired or invalid
      // localStorage.removeItem('sihflow_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  // Auth
  login: async (email: string, password?: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  // Projects & Analytics
  getDashboard: async (projectId = 'proj-acadshield-001'): Promise<DashboardMetrics> => {
    const res = await api.get(`/analytics/dashboard?projectId=${projectId}`);
    return res.data.data;
  },
  getProjects: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data.data;
  },
  getProjectById: async (id: string): Promise<Project> => {
    const res = await api.get(`/projects/${id}`);
    return res.data.data;
  },
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await api.patch(`/projects/${id}`, data);
    return res.data.data;
  },

  // Team
  getTeamMembers: async (projectId = 'proj-acadshield-001'): Promise<User[]> => {
    const res = await api.get(`/team?projectId=${projectId}`);
    return res.data.data;
  },
  getMemberProfile: async (id: string): Promise<User> => {
    const res = await api.get(`/team/${id}`);
    return res.data.data;
  },
  updateMember: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await api.patch(`/team/${id}`, data);
    return res.data.data;
  },

  // Tasks
  getTasks: async (filters?: Record<string, string>): Promise<Task[]> => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/tasks?${params}`);
    return res.data.data;
  },
  getTaskById: async (id: string): Promise<Task> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data;
  },
  createTask: async (data: Partial<Task>): Promise<Task> => {
    const res = await api.post('/tasks', data);
    return res.data.data;
  },
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data.data;
  },
  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data.data;
  },
  addSubtask: async (taskId: string, title: string) => {
    const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return res.data.data;
  },
  toggleSubtask: async (subtaskId: string, completed: boolean) => {
    const res = await api.patch(`/subtasks/${subtaskId}/toggle`, { completed });
    return res.data.data;
  },
  addTaskComment: async (taskId: string, comment: string) => {
    const res = await api.post(`/tasks/${taskId}/comments`, { comment });
    return res.data.data;
  },

  // Milestones & Sprints
  getMilestones: async (projectId = 'proj-acadshield-001'): Promise<Milestone[]> => {
    const res = await api.get(`/milestones?projectId=${projectId}`);
    return res.data.data;
  },
  updateMilestone: async (id: string, data: Partial<Milestone>): Promise<Milestone> => {
    const res = await api.patch(`/milestones/${id}`, data);
    return res.data.data;
  },
  getSprints: async (projectId = 'proj-acadshield-001'): Promise<Sprint[]> => {
    const res = await api.get(`/sprints?projectId=${projectId}`);
    return res.data.data;
  },

  // Blockers
  getBlockers: async (projectId = 'proj-acadshield-001'): Promise<Blocker[]> => {
    const res = await api.get(`/blockers?projectId=${projectId}`);
    return res.data.data;
  },
  reportBlocker: async (data: Partial<Blocker>): Promise<Blocker> => {
    const res = await api.post('/blockers', data);
    return res.data.data;
  },
  resolveBlocker: async (id: string, resolutionNotes: string): Promise<Blocker> => {
    const res = await api.patch(`/blockers/${id}/resolve`, { resolutionNotes });
    return res.data.data;
  },

  // Activity
  getActivities: async (projectId = 'proj-acadshield-001'): Promise<ActivityLog[]> => {
    const res = await api.get(`/activity?projectId=${projectId}`);
    return res.data.data;
  },

  // GitHub
  getGitHubOverview: async (projectId = 'proj-acadshield-001') => {
    const res = await api.get(`/github/overview?projectId=${projectId}`);
    return res.data.data;
  },
  getGitHubCommits: async (projectId = 'proj-acadshield-001') => {
    const res = await api.get(`/github/commits?projectId=${projectId}`);
    return res.data.data;
  },
  getGitHubPullRequests: async (projectId = 'proj-acadshield-001') => {
    const res = await api.get(`/github/pull-requests?projectId=${projectId}`);
    return res.data.data;
  },
  getGitHubIssues: async (projectId = 'proj-acadshield-001') => {
    const res = await api.get(`/github/issues?projectId=${projectId}`);
    return res.data.data;
  },

  // Meetings
  getMeetings: async (projectId = 'proj-acadshield-001'): Promise<Meeting[]> => {
    const res = await api.get(`/meetings?projectId=${projectId}`);
    return res.data.data;
  },
  createMeeting: async (data: any): Promise<Meeting> => {
    const res = await api.post('/meetings', data);
    return res.data.data;
  },
  convertActionItem: async (actionItemId: string) => {
    const res = await api.post(`/meetings/action-items/${actionItemId}/convert`);
    return res.data.data;
  },

  // Documents
  getDocuments: async (projectId = 'proj-acadshield-001'): Promise<Document[]> => {
    const res = await api.get(`/documents?projectId=${projectId}`);
    return res.data.data;
  },
  createDocument: async (data: any): Promise<Document> => {
    const res = await api.post('/documents', data);
    return res.data.data;
  },
  updateDocumentStatus: async (id: string, reviewStatus: string, reviewNotes?: string) => {
    const res = await api.patch(`/documents/${id}/status`, { reviewStatus, reviewNotes });
    return res.data.data;
  },

  // Risks & Bugs
  getRisks: async (projectId = 'proj-acadshield-001'): Promise<Risk[]> => {
    const res = await api.get(`/risks?projectId=${projectId}`);
    return res.data.data;
  },
  createRisk: async (data: any): Promise<Risk> => {
    const res = await api.post('/risks', data);
    return res.data.data;
  },
  getBugs: async (projectId = 'proj-acadshield-001'): Promise<Bug[]> => {
    const res = await api.get(`/bugs?projectId=${projectId}`);
    return res.data.data;
  },
  createBug: async (data: any): Promise<Bug> => {
    const res = await api.post('/bugs', data);
    return res.data.data;
  },
  updateBugStatus: async (id: string, status: string): Promise<Bug> => {
    const res = await api.patch(`/bugs/${id}/status`, { status });
    return res.data.data;
  },

  // Testing
  getTestCases: async (projectId = 'proj-acadshield-001'): Promise<TestCase[]> => {
    const res = await api.get(`/testing/test-cases?projectId=${projectId}`);
    return res.data.data;
  },
  updateTestCase: async (id: string, data: Partial<TestCase>): Promise<TestCase> => {
    const res = await api.patch(`/testing/test-cases/${id}`, data);
    return res.data.data;
  },
  getTestMetrics: async (projectId = 'proj-acadshield-001') => {
    const res = await api.get(`/testing/metrics?projectId=${projectId}`);
    return res.data.data;
  },

  // Readiness & Demo Checklist
  getSihReadiness: async (projectId = 'proj-acadshield-001'): Promise<{
    overallScore: number;
    statusLabel: string;
    items: ReadinessItem[];
  }> => {
    const res = await api.get(`/readiness/sih?projectId=${projectId}`);
    return res.data.data;
  },
  updateReadinessItem: async (id: string, data: { progress?: number; evidence?: string; status?: string }) => {
    const res = await api.patch(`/readiness/sih/${id}`, data);
    return res.data.data;
  },
  getDemoChecklist: async (projectId = 'proj-acadshield-001'): Promise<{
    items: DemoChecklistItem[];
    stats: {
      total: number;
      passed: number;
      failed: number;
      notTested: number;
      readyPercentage: number;
    };
  }> => {
    const res = await api.get(`/readiness/demo-checklist?projectId=${projectId}`);
    return res.data.data;
  },
  updateDemoChecklistItem: async (id: string, status: string, evidence?: string) => {
    const res = await api.patch(`/readiness/demo-checklist/${id}`, { status, evidence });
    return res.data.data;
  },

  // AI Assistant
  queryAiAssistant: async (query: string, projectId = 'proj-acadshield-001') => {
    const res = await api.post('/ai/query', { query, projectId });
    return res.data.data;
  },

  // Reports
  getReports: async (projectId = 'proj-acadshield-001') => {
    const res = await api.get(`/reports?projectId=${projectId}`);
    return res.data.data;
  },
  generateReport: async (reportType: string, projectId = 'proj-acadshield-001') => {
    const res = await api.post('/reports/generate', { reportType, projectId });
    return res.data.data;
  },

  // Notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await api.get('/notifications');
    return res.data.data;
  },
  markNotificationRead: async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data.data;
  },
  markAllNotificationsRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data.data;
  },
};
