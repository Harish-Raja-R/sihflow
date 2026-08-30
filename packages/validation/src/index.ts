import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  teamRole: z.string().min(2, 'Team role is required'),
  role: z.enum(['TEAM_LEAD', 'TEAM_MEMBER', 'REVIEWER']).default('TEAM_MEMBER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional().default(''),
  projectId: z.string().default('proj-acadshield-001'),
  workstreamId: z.string().optional(),
  milestoneId: z.string().optional(),
  sprintId: z.string().optional(),
  assigneeId: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']).default('TODO'),
  estimatedHours: z.number().nonnegative().default(8),
  dueDate: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']),
  reviewComments: z.string().optional(),
});

export const createBlockerSchema = z.object({
  title: z.string().min(3, 'Blocker title is required'),
  description: z.string().min(5, 'Blocker description is required'),
  projectId: z.string().default('proj-acadshield-001'),
  taskId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
  impact: z.string().optional(),
  blockedUserId: z.string().optional().nullable(),
});

export const resolveBlockerSchema = z.object({
  resolutionNotes: z.string().min(5, 'Resolution notes are required to close blocker'),
});

export const createMeetingSchema = z.object({
  title: z.string().min(3, 'Meeting title is required'),
  projectId: z.string().default('proj-acadshield-001'),
  type: z.string().default('DAILY_STANDUP'),
  scheduledAt: z.string().optional(),
  durationMinutes: z.number().int().positive().default(30),
  agenda: z.string().min(5, 'Meeting agenda is required'),
  decisions: z.string().optional(),
});

export const createDocumentSchema = z.object({
  title: z.string().min(3, 'Document title is required'),
  type: z.string().default('SRS'),
  category: z.string().default('SPECIFICATION'),
  version: z.string().default('1.0.0'),
  content: z.string().min(10, 'Document content is required'),
  projectId: z.string().default('proj-acadshield-001'),
});

export const createRiskSchema = z.object({
  title: z.string().min(3, 'Risk title is required'),
  description: z.string().optional().default(''),
  category: z.string().default('TECHNICAL'),
  likelihood: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
  mitigationPlan: z.string().min(5, 'Mitigation plan is required'),
  projectId: z.string().default('proj-acadshield-001'),
});

export const createBugSchema = z.object({
  title: z.string().min(3, 'Bug title is required'),
  description: z.string().min(5, 'Bug description is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
  stepsToReproduce: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string().default('proj-acadshield-001'),
});
