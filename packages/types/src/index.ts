export type UserRole = 'TEAM_LEAD' | 'TEAM_MEMBER' | 'REVIEWER';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';

export type MilestoneStatus = 'PLANNED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED' | 'BLOCKED';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

export type BlockerPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type BlockerStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'WONT_FIX';

export type RiskImpact = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskProbability = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskStatus = 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED';

export type BugSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type BugStatus = 'OPEN' | 'TRIAGED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'REOPENED';

export type TestStatus = 'NOT_TESTED' | 'PASS' | 'FAIL' | 'BLOCKED';
export type DocumentReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamRole: string;
  avatarUrl?: string;
  phone?: string;
  githubUsername?: string;
  responsibilities?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: UserDTO;
  token: string;
}

export interface ProjectDTO {
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
  status: string;
  progress: number;
  repositoryUrl: string;
  demoUrl?: string;
  deploymentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkstreamDTO {
  id: string;
  projectId: string;
  code: string;
  name: string;
  description: string;
  ownerId?: string;
  status: string;
  progress: number;
  orderIndex: number;
}

export interface TaskDTO {
  id: string;
  taskId: string;
  projectId: string;
  workstreamId?: string;
  milestoneId?: string;
  sprintId?: string;
  title: string;
  description: string;
  assigneeId?: string;
  reporterId?: string;
  reviewerId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate?: string;
  dueDate?: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  githubIssueNumber?: number;
  githubPrNumber?: number;
  githubBranch?: string;
  reviewStatus?: string;
  reviewComments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubtaskDTO {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  orderIndex: number;
}

export interface MilestoneDTO {
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
  progress: number;
  status: MilestoneStatus;
  risks?: string;
}

export interface SprintDTO {
  id: string;
  projectId: string;
  number?: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  progress: number;
  velocity: number;
}

export interface BlockerDTO {
  id: string;
  blockerId: string;
  projectId: string;
  taskId?: string;
  title: string;
  description: string;
  impact?: string;
  reportedById: string;
  blockingUserId?: string;
  blockedUserId?: string;
  priority: BlockerPriority;
  status: BlockerStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt?: string;
}

export interface ActivityDTO {
  id: string;
  projectId: string;
  userId?: string;
  eventType: string;
  entityType: string;
  entityId?: string;
  summary: string;
  details?: string;
  createdAt: string;
}

export interface GitHubCommitDTO {
  id: string;
  sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  commitDate: string;
  branch: string;
  url: string;
}

export interface GitHubPullRequestDTO {
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
  createdAt: string;
}

export interface GitHubIssueDTO {
  id: string;
  issueNumber: number;
  title: string;
  body?: string;
  state: 'OPEN' | 'CLOSED';
  authorName: string;
  url: string;
  createdAt: string;
}

export interface MeetingDTO {
  id: string;
  projectId: string;
  title: string;
  type?: string;
  scheduledAt?: string;
  durationMinutes: number;
  agenda: string;
  notes?: string;
  decisions?: string;
  actionItems?: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    isConverted?: boolean;
    convertedToTaskId?: string;
  }>;
}

export interface DocumentDTO {
  id: string;
  title: string;
  type: string;
  category: string;
  version: string;
  content?: string;
  fileUrl?: string;
  ownerId: string;
  status: string;
  reviewStatus: DocumentReviewStatus;
  reviewNotes?: string;
  updatedAt: string;
}

export interface RiskDTO {
  id: string;
  title: string;
  description: string;
  category?: string;
  likelihood: RiskProbability;
  impact: RiskImpact;
  mitigationPlan: string;
  status: RiskStatus;
}

export interface BugDTO {
  id: string;
  bugId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  reporterId: string;
  assigneeId?: string;
  createdAt: string;
}

export interface TestCaseDTO {
  id: string;
  testCaseId: string;
  code?: string;
  title?: string;
  feature: string;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status: TestStatus;
  executionTimeMs?: number;
}

export interface ReadinessItemDTO {
  id: string;
  category: string;
  name: string;
  description: string;
  weight: number;
  progress: number;
  status: string;
  evidence?: string;
}

export interface DemoChecklistItemDTO {
  id: string;
  itemCode: string;
  category: string;
  title: string;
  description: string;
  expectedResult?: string;
  status: 'PASS' | 'FAIL' | 'NOT_TESTED';
  evidence?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
