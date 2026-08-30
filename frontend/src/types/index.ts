export interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEAM_LEAD' | 'TEAM_MEMBER' | 'REVIEWER';
  teamRole: string;
  avatarUrl?: string;
  phone?: string;
  githubUsername?: string;
  responsibilities?: string;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    overdueTasks: number;
    completionRate: number;
    contributionScore?: number;
    activeBlockers?: number;
    testCasesCount?: number;
    documentsCount?: number;
    bugsReportedCount?: number;
  };
  currentTask?: {
    id?: string;
    taskId: string;
    title: string;
    status: string;
    priority?: string;
    progress: number;
  } | null;
  lastActivity?: {
    summary: string;
    createdAt: string;
  } | null;
  assignedTasks?: Task[];
  ownedWorkstreams?: Workstream[];
  ownedMilestones?: Milestone[];
  activities?: ActivityLog[];
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  sihProblemStatement: string;
  problemStatementNumber?: string;
  description: string;
  objective: string;
  startDate: string;
  targetCompletionDate: string;
  currentPhase: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  progress: number;
  repositoryUrl: string;
  demoUrl?: string;
  deploymentUrl?: string;
  members?: ProjectMember[];
  workstreams?: Workstream[];
  milestones?: Milestone[];
  sprints?: Sprint[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  roleInProject: string;
  responsibilities?: string;
  isLead: boolean;
  user: User;
}

export interface Workstream {
  id: string;
  projectId: string;
  code: string;
  name: string;
  description: string;
  ownerId?: string;
  owner?: User;
  status: string;
  progress: number;
  deadline?: string;
  orderIndex: number;
  _count?: { tasks: number };
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  orderIndex: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    teamRole: string;
  };
}

export interface Task {
  id: string;
  taskId: string;
  projectId: string;
  workstreamId?: string;
  workstream?: Workstream;
  milestoneId?: string;
  milestone?: Milestone;
  sprintId?: string;
  sprint?: Sprint;
  title: string;
  description: string;
  assigneeId?: string;
  assignee?: User;
  reporterId?: string;
  reporter?: User;
  reviewerId?: string;
  reviewer?: User;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  dueDate?: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  dependencies?: string;
  labels?: string;
  githubIssueNumber?: number;
  githubPrNumber?: number;
  githubBranch?: string;
  reviewStatus?: string;
  reviewComments?: string;
  subtasks?: Subtask[];
  comments?: TaskComment[];
  _count?: {
    subtasks: number;
    comments: number;
    attachments: number;
    blockers: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  code?: string;
  milestoneCode: string;
  projectId: string;
  name: string;
  description: string;
  deadline?: string;
  startDate: string;
  endDate: string;
  ownerId?: string;
  owner?: User;
  progress: number;
  status: 'NOT_STARTED' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED' | 'PLANNED' | 'IN_PROGRESS' | 'BLOCKED';
  risks?: string;
  tasks?: Task[];
}

export interface Sprint {
  id: string;
  projectId: string;
  number?: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  progress: number;
  velocity: number;
  burndownData?: string;
  tasks?: Task[];
  totalTasks?: number;
  completedTasks?: number;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    velocity: number;
  };
}

export interface Blocker {
  id: string;
  blockerId: string;
  projectId: string;
  taskId?: string;
  task?: {
    id: string;
    taskId: string;
    title: string;
    status: string;
  };
  title: string;
  description: string;
  impact?: string;
  reportedById: string;
  reporter: User;
  blockingUserId?: string;
  blockedUserId?: string;
  blockingUser?: User;
  blockedUser?: User;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'WONT_FIX';
  expectedResolution?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  userId?: string;
  user?: User;
  action?: string;
  eventType: string;
  entityType: string;
  entityId?: string;
  summary: string;
  details?: string;
  createdAt: string;
}

export interface GitHubCommit {
  id: string;
  sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  commitDate: string;
  branch: string;
  url: string;
  stats?: string;
}

export interface GitHubPullRequest {
  id: string;
  prNumber: number;
  title: string;
  body?: string;
  state: 'OPEN' | 'MERGED' | 'CLOSED';
  authorName: string;
  headBranch: string;
  baseBranch: string;
  url: string;
  reviewsCount: number;
  reviews?: Array<{
    id: string;
    reviewerName: string;
    state: string;
    body?: string;
  }>;
  createdAt: string;
}

export interface GitHubIssue {
  id: string;
  issueNumber: number;
  title: string;
  body?: string;
  state: 'OPEN' | 'CLOSED';
  authorName: string;
  url: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  type?: string;
  date?: string;
  scheduledAt?: string;
  time?: string;
  durationMinutes: number;
  agenda: string;
  notes?: string;
  decisions?: string;
  meetingLink?: string;
  actionItems?: Array<{
    id: string;
    title: string;
    dueDate?: string;
    isCompleted: boolean;
    isConverted?: boolean;
    convertedToTaskId?: string;
    assignee?: User;
  }>;
}

export interface Document {
  id: string;
  name: string;
  title?: string;
  type?: string;
  content?: string;
  category: string;
  version: string;
  fileUrl: string;
  fileSize: number;
  ownerId: string;
  owner?: User;
  author?: User;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'ARCHIVED';
  reviewerId?: string;
  reviewer?: User;
  reviewNotes?: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category?: string;
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  likelihood?: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ownerId?: string;
  owner?: User;
  mitigation: string;
  mitigationPlan?: string;
  status: 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED';
}

export interface Bug {
  id: string;
  bugId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reporterId: string;
  reporter?: User;
  assigneeId?: string;
  assignee?: User;
  environment: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  status: 'OPEN' | 'TRIAGED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
  createdAt: string;
}

export interface TestCase {
  id: string;
  testCaseId: string;
  code?: string;
  title?: string;
  type?: string;
  feature: string;
  description: string;
  steps: string;
  expectedResult: string;
  actualResult?: string;
  status: 'NOT_TESTED' | 'PASS' | 'FAIL' | 'BLOCKED';
  tester?: User;
  executionDate?: string;
  executionTimeMs?: number;
  lastRunAt?: string;
}

export interface ReadinessItem {
  id: string;
  category: string;
  categoryNumber?: number;
  name: string;
  description: string;
  weight: number;
  progress: number;
  ownerId?: string;
  owner?: User;
  status: string;
  evidence?: string;
  gaps?: string;
  orderIndex: number;
}

export interface DemoChecklistItem {
  id: string;
  stepNumber?: number;
  category: string;
  itemCode: string;
  title: string;
  name?: string;
  description: string;
  ownerId?: string;
  owner?: User;
  expectedResult?: string;
  status: 'PASS' | 'FAIL' | 'NOT_TESTED';
  evidence?: string;
  lastTestedAt?: string;
  orderIndex: number;
}

export interface DashboardMetrics {
  project: {
    id: string;
    projectId: string;
    name: string;
    sihProblemStatement: string;
    currentSprint: string;
    overallProgress: number;
  };
  health: {
    overallProgress: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    overdueTasks: number;
    openBugs: number;
    openPrs: number;
    pendingReviews: number;
  };
  teamStatus: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    teamRole: string;
    avatarUrl?: string;
    currentTask: {
      taskId: string;
      title: string;
      status: string;
      progress: number;
    } | null;
    lastActivity: string;
    lastActivityAt?: string;
  }>;
  milestones: Array<{
    id: string;
    code: string;
    name: string;
    progress: number;
    status: string;
    deadline: string;
    owner?: string;
  }>;
  activeBlockers: Array<{
    id: string;
    blockerId: string;
    title: string;
    reporter: string;
    blockingUser: string;
    priority: string;
    status: string;
    createdAt: string;
  }>;
  github: {
    commitsCount: number;
    openPrsCount: number;
    openIssuesCount: number;
    waitingReviewsCount: number;
    recentCommits: GitHubCommit[];
  };
  sihReadiness: {
    score: number;
    statusLabel: string;
  };
  demoReadiness: {
    score: number;
    passedCount: number;
    totalCount: number;
  };
  recentActivities: ActivityLog[];
  urgent: {
    overdueTasksCount: number;
    criticalBlockersCount: number;
    pendingReviewsCount: number;
    openBugsCount: number;
  };
  recommendedActions: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
