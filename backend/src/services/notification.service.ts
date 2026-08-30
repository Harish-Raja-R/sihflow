import { prisma } from '../database/prisma.js';

export class NotificationService {
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'TASK' | 'BLOCKER' | 'PR' | 'MILESTONE' | 'MEETING' | 'SYSTEM',
    link?: string
  ) {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          link,
        },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }

  static async notifyTeamLead(
    projectId: string,
    title: string,
    message: string,
    type: 'TASK' | 'BLOCKER' | 'PR' | 'MILESTONE' | 'MEETING' | 'SYSTEM',
    link?: string
  ) {
    try {
      const teamLeadMember = await prisma.projectMember.findFirst({
        where: { projectId, isLead: true },
        include: { user: true },
      });

      if (teamLeadMember) {
        return await this.createNotification(teamLeadMember.userId, title, message, type, link);
      }
    } catch (error) {
      console.error('Failed to notify team lead:', error);
    }
  }

  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
