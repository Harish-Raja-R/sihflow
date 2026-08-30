import { Router, Request, Response, NextFunction } from 'express';
import { mockStore } from '../../config/mockStore';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/meetings
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockStore.meetings);
});

// POST /api/v1/meetings
router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, date, time, type, participants, durationMinutes, agenda, notes } = req.body;

  const newMeeting = {
    id: `mtg-${Date.now()}`,
    title,
    date: date || new Date().toISOString().split('T')[0],
    time: time || '10:00 AM',
    type: type || 'DAILY_STANDUP',
    participants: participants || 'All 6 Team Members',
    durationMinutes: durationMinutes || 30,
    agenda: agenda || '',
    notes: notes || '',
    scheduledAt: `${date || '2026-08-30'}T${time || '10:00:00'}Z`,
  };

  mockStore.meetings.unshift(newMeeting);

  mockStore.activities.unshift({
    id: `act-${Date.now()}`,
    summary: `${req.user?.name || 'Team Lead'} scheduled meeting: "${newMeeting.title}"`,
    eventType: 'MEETING_SCHEDULED',
    user: { name: req.user?.name || 'Team Lead', teamRole: req.user?.teamRole || 'Team Lead' },
    createdAt: new Date().toISOString(),
  });

  return sendSuccess(res, newMeeting, 201);
});

// PATCH /api/v1/meetings/:id
router.patch('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, date, time, type, participants, durationMinutes, agenda, notes } = req.body;

  const meeting = mockStore.meetings.find((m) => m.id === id);
  if (meeting) {
    if (title) meeting.title = title;
    if (date) meeting.date = date;
    if (time) meeting.time = time;
    if (type) meeting.type = type;
    if (participants) meeting.participants = participants;
    if (durationMinutes) meeting.durationMinutes = durationMinutes;
    if (agenda !== undefined) meeting.agenda = agenda;
    if (notes !== undefined) meeting.notes = notes;
    return sendSuccess(res, meeting);
  }

  return sendSuccess(res, { id, ...req.body });
});

// DELETE /api/v1/meetings/:id
router.delete('/:id', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const index = mockStore.meetings.findIndex((m) => m.id === id);
  if (index !== -1) {
    const deleted = mockStore.meetings.splice(index, 1)[0];
    return sendSuccess(res, { message: `Meeting "${deleted.title}" deleted`, id: deleted.id });
  }
  return sendSuccess(res, { message: 'Meeting deleted', id });
});

export const meetingRoutes = router;
