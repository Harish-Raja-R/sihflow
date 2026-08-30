import { prisma } from '../database/prisma.js';
import { ActivityService } from './activity.service.js';

export class DocumentService {
  static async getDocuments(projectId: string) {
    return prisma.document.findMany({
      where: { projectId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            teamRole: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async createDocument(data: any, userId?: string) {
    const document = await prisma.document.create({
      data,
      include: { owner: true }
    });

    await ActivityService.logEvent({
      projectId: document.projectId,
      userId,
      eventType: 'DOCUMENT_UPLOADED',
      entityType: 'DOCUMENT',
      entityId: document.id,
      summary: `Uploaded document "${document.name}" (${document.category})`,
      details: { category: document.category, version: document.version },
    });

    return document;
  }

  static async updateDocumentStatus(id: string, reviewStatus: string, reviewNotes?: string, reviewerId?: string) {
    const doc = await prisma.document.update({
      where: { id },
      data: {
        reviewStatus,
        reviewNotes,
        reviewerId,
        status: reviewStatus === 'APPROVED' ? 'APPROVED' : 'IN_REVIEW'
      }
    });

    await ActivityService.logEvent({
      projectId: doc.projectId,
      userId: reviewerId,
      eventType: 'DOCUMENT_REVIEWED',
      entityType: 'DOCUMENT',
      entityId: doc.id,
      summary: `Reviewed document "${doc.name}": ${reviewStatus}`,
      details: { reviewStatus, reviewNotes },
    });

    return doc;
  }
}
