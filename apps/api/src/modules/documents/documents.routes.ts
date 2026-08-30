import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/documents
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.documents);
});

// POST /api/v1/documents
router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, type, category, version, content } = req.body;

  const authorName = req.user?.name || 'Member 6 (QA / UI-UX / Docs)';

  const newDoc = {
    id: `doc-${Date.now()}`,
    title,
    type: type || 'SRS',
    category: category || 'SPECIFICATION',
    version: version || '1.0.0',
    owner: { name: authorName },
    author: { name: authorName, teamRole: req.user?.teamRole || 'QA / UI-UX / Documentation' },
    date: new Date().toISOString().split('T')[0],
    status: 'APPROVED',
    reviewStatus: 'APPROVED',
    content: content || 'Document content created via SIHFlow documentation engine.',
    updatedAt: new Date().toISOString().split('T')[0],
  };

  mockStore.documents.unshift(newDoc);

  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${authorName} uploaded specification document: "${newDoc.title}" (v${newDoc.version})`,
    eventType: 'DOCUMENT_UPLOADED',
    user: { name: authorName, teamRole: req.user?.teamRole || 'QA / UI-UX / Documentation' },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, newDoc, 201);
});

// PATCH /api/v1/documents/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, type, category, version, content, reviewStatus } = req.body;

  const doc = mockStore.documents.find((d) => d.id === id);
  if (doc) {
    if (title) doc.title = title;
    if (type) doc.type = type;
    if (category) doc.category = category;
    if (version) doc.version = version;
    if (content !== undefined) doc.content = content;
    if (reviewStatus) doc.reviewStatus = reviewStatus;
    doc.updatedAt = new Date().toISOString().split('T')[0];
    return sendSuccess(res, doc);
  }

  return sendSuccess(res, { id, ...req.body });
});

// DELETE /api/v1/documents/:id
router.delete('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.documents.findIndex((d) => d.id === id);
  if (index !== -1) {
    const deleted = mockStore.documents.splice(index, 1)[0];
    return sendSuccess(res, { message: `Document "${deleted.title}" deleted`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Document deleted', id });
});

export const documentRoutes = router;
