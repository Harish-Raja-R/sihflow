import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckSquare } from 'lucide-react';
import { apiClient } from '../services/api';
import { Meeting } from '../types';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';

export const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // New Meeting Modal
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [newMeetingData, setNewMeetingData] = useState({
    title: '',
    type: 'DAILY_STANDUP',
    scheduledAt: '2026-09-02T18:00:00.000Z',
    durationMinutes: 30,
    agenda: '',
    decisions: '',
  });

  const loadMeetings = async () => {
    try {
      const data = await apiClient.getMeetings();
      setMeetings(data);
    } catch (e) {
      console.error('Failed to load meetings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createMeeting({
        ...newMeetingData,
        projectId: 'proj-acadshield-001',
      });
      setIsNewMeetingOpen(false);
      loadMeetings();
    } catch (e) {
      console.error('Failed to create meeting:', e);
    }
  };

  const handleConvertActionItem = async (actionItemId: string) => {
    try {
      await apiClient.convertActionItem(actionItemId);
      loadMeetings();
    } catch (e) {
      console.error('Failed to convert action item:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading team meetings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <span>Team Meetings & Standups</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Log daily standups, architectural sprint reviews, decisions made, and convert action items into tasks.
          </p>
        </div>

        <button
          onClick={() => setIsNewMeetingOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((m) => (
          <Card key={m.id} className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {(m.type || 'MEETING').replace(/_/g, ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{m.title}</h3>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{m.durationMinutes} mins</span>
                </div>
                <span>•</span>
                <span className="font-mono text-slate-800 font-bold">
                  {new Date(m.scheduledAt || m.date || new Date().toISOString()).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Agenda & Decisions */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Agenda</span>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{m.agenda}</p>
                </div>

                {m.decisions && (
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-mono font-bold block mb-1">
                      Key Architectural Decisions
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">{m.decisions}</p>
                  </div>
                )}
              </div>

              {/* Action Items */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Action Items ({m.actionItems?.length || 0})
                  </span>
                </div>

                <div className="space-y-2">
                  {m.actionItems?.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div>
                        <p className="text-slate-800 font-semibold">{item.title}</p>
                        <span className="text-[10px] text-slate-500">
                          Owner: {item.assignee?.name || 'Team'}
                        </span>
                      </div>

                      {item.isConverted || item.convertedToTaskId ? (
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          Converted to Task
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConvertActionItem(item.id)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] text-slate-700 border border-slate-200 transition-colors font-semibold"
                        >
                          → Convert to Task
                        </button>
                      )}
                    </div>
                  ))}
                  {(!m.actionItems || m.actionItems.length === 0) && (
                    <span className="text-slate-400 text-xs italic">No open action items.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      <Modal isOpen={isNewMeetingOpen} onClose={() => setIsNewMeetingOpen(false)} title="Schedule Team Sync">
        <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Meeting Title *</label>
            <input
              type="text"
              required
              value={newMeetingData.title}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, title: e.target.value })}
              placeholder="e.g. Daily Standup: Fabric Adapter Integration"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Type</label>
              <select
                value={newMeetingData.type}
                onChange={(e) => setNewMeetingData({ ...newMeetingData, type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="DAILY_STANDUP">Daily Standup</option>
                <option value="SPRINT_PLANNING">Sprint Planning</option>
                <option value="SPRINT_REVIEW">Sprint Review</option>
                <option value="ARCHITECTURE_SYNC">Architecture Sync</option>
                <option value="DEMO_REHEARSAL">Demo Rehearsal</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={newMeetingData.durationMinutes}
                onChange={(e) => setNewMeetingData({ ...newMeetingData, durationMinutes: parseInt(e.target.value) || 30 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Agenda *</label>
            <textarea
              rows={3}
              required
              value={newMeetingData.agenda}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, agenda: e.target.value })}
              placeholder="Key talking points..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewMeetingOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
            >
              Save Meeting
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
