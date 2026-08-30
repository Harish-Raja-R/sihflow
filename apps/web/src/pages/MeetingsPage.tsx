import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Users,
  X,
  FileText,
} from 'lucide-react';

export const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: '',
    date: '2026-08-30',
    time: '10:00 AM',
    participants: 'All 6 Team Members',
    durationMinutes: 30,
    agenda: '',
    notes: '',
  });

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/meetings');
      if (res.data?.success) {
        setMeetings(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleOpenCreate = () => {
    setEditingMeeting(null);
    setForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      participants: 'All 6 Team Members',
      durationMinutes: 30,
      agenda: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingMeeting(m);
    setForm({
      title: m.title,
      date: m.date || new Date().toISOString().split('T')[0],
      time: m.time || '10:00 AM',
      participants: m.participants || 'All 6 Team Members',
      durationMinutes: m.durationMinutes || 30,
      agenda: m.agenda || '',
      notes: m.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMeeting) {
        const res = await api.patch(`/meetings/${editingMeeting.id}`, form);
        if (res.data?.success) {
          setMeetings((prev) =>
            prev.map((m) => (m.id === editingMeeting.id ? { ...m, ...res.data.data } : m))
          );
        }
      } else {
        const res = await api.post('/meetings', form);
        if (res.data?.success) {
          setMeetings((prev) => [res.data.data, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save meeting');
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    if (!window.confirm('Delete this meeting?')) return;
    try {
      const res = await api.delete(`/meetings/${id}`);
      if (res.data?.success) {
        setMeetings((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete meeting');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Team Standups & Meetings</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Schedule and log daily standups, architectural syncs, and demo rehearsals.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.length > 0 ? (
          meetings.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-base text-slate-900">{m.title}</h3>
                  <Badge variant="info">{m.durationMinutes || 30} mins</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {m.date || '2026-08-30'}
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {m.time || '10:00 AM'}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded ml-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(m.id)}
                    className="p-1 text-red-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Participants:</span>
                <strong className="text-slate-700">{m.participants || 'All 6 Members'}</strong>
              </div>

              {m.agenda && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs">
                  <strong className="text-slate-700 block mb-1">AGENDA:</strong>
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed">{m.agenda}</p>
                </div>
              )}

              {m.notes && (
                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 text-xs">
                  <strong className="text-emerald-800 block mb-1">MEETING NOTES / DECISIONS:</strong>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{m.notes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-500">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium">No meetings scheduled.</p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Daily Standup #15"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DATE</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">TIME</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">PARTICIPANTS</label>
                <input
                  type="text"
                  value={form.participants}
                  onChange={(e) => setForm({ ...form, participants: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">AGENDA</label>
                <textarea
                  rows={2}
                  placeholder="Items to discuss..."
                  value={form.agenda}
                  onChange={(e) => setForm({ ...form, agenda: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">NOTES & DECISIONS</label>
                <textarea
                  rows={2}
                  placeholder="Decisions made during meeting..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
