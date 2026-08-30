import { prisma } from '../database/prisma.js';
import { TaskService } from './task.service.js';
import { ActivityService } from './activity.service.js';

export class MeetingService {
  static async getMeetings(projectId: string) {
    return prisma.meeting.findMany({
      where: { projectId },
      include: {
        actionItems: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                teamRole: true,
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  static async createMeeting(data: {
    projectId: string;
    title: string;
    date: Date | string;
    time: string;
    durationMinutes?: number;
    agenda: string;
    notes?: string;
    decisions?: string;
    meetingLink?: string;
    actionItems?: Array<{ assigneeId?: string; title: string; dueDate?: string }>;
  }, userId?: string) {
    const meeting = await prisma.meeting.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        date: new Date(data.date),
        time: data.time,
        durationMinutes: data.durationMinutes || 45,
        agenda: data.agenda,
        notes: data.notes,
        decisions: data.decisions,
        meetingLink: data.meetingLink,
        actionItems: data.actionItems ? {
          create: data.actionItems.map(item => ({
            title: item.title,
            assigneeId: item.assigneeId,
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
          }))
        } : undefined
      },
      include: { actionItems: true }
    });

    await ActivityService.logEvent({
      projectId: data.projectId,
      userId,
      eventType: 'MEETING_LOGGED',
      entityType: 'MEETING',
      entityId: meeting.id,
      summary: `Logged team meeting: "${meeting.title}"`,
      details: { decisions: data.decisions, actionItemsCount: data.actionItems?.length || 0 },
    });

    return meeting;
  }

  static async convertActionItemToTask(actionItemId: string, userId?: string) {
    const item = await prisma.meetingActionItem.findUnique({
      where: { id: actionItemId },
      include: { meeting: true }
    });

    if (!item) throw new Error('ACTION_ITEM_NOT_FOUND');

    const task = await TaskService.createTask({
      projectId: item.meeting.projectId,
      title: item.title,
      description: `Action item generated from meeting: "${item.meeting.title}"`,
      assigneeId: item.assigneeId,
      dueDate: item.dueDate,
      priority: 'HIGH',
      status: 'TODO',
    }, userId);

    await prisma.meetingActionItem.update({
      where: { id: actionItemId },
      data: {
        convertedToTaskId: task.id,
        isCompleted: true,
      }
    });

    return task;
  }
}
