import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  Milestone as MilestoneIcon,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  Clock,
  CheckCircle,
} from 'lucide-react';

export const MilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    deadline: '2026-09-15',
    status: 'On Track',
  });

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/milestones');
      if (res.data?.success) {
        setMilestones(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load milestone roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleOpenCreate = () => {
    setEditingMilestone(null);
    setForm({
      name: '',
      description: '',
      deadline: '2026-09-15',
      status: 'On Track',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingMilestone(m);
    setForm({
      name: m.name,
      description: m.description || '',
      deadline: m.deadline || '2026-09-15',
      status: m.status || 'On Track',
    });
    setIsModalOpen(true);
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMilestone) {
        const res = await api.patch(`/milestones/${editingMilestone.id}`, form);
        if (res.data?.success) {
          setMilestones((prev) =>
            prev.map((m) => (m.id === editingMilestone.id ? { ...m, ...res.data.data } : m))
          );
        }
      } else {
        const res = await api.post('/milestones', form);
        if (res.data?.success) {
          setMilestones((prev) => [...prev, res.data.data]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save milestone');
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!window.confirm('Delete this milestone from roadmap?')) return;
    try {
      const res = await api.delete(`/milestones/${id}`);
      if (res.data?.success) {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete milestone');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MilestoneIcon className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Milestone Roadmap (M1–M11)</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track phase deliverables against evaluation gates for SIH 2026.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Milestone
        </button>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {m.milestoneCode || m.code}
                </span>
                <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                <Badge
                  variant={
                    m.status === 'Completed'
                      ? 'success'
                      : m.status === 'At Risk'
                      ? 'danger'
                      : m.status === 'Delayed'
                      ? 'warning'
                      : 'info'
                  }
                >
                  {m.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {m.description || 'Milestone deliverable for SIH Grand Finale.'}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Deadline: {m.deadline || '2026-09-15'}
                </span>
                {m.tasksCount !== undefined && (
                  <span>Linked Tasks: {m.tasksCount}</span>
                )}
              </div>
            </div>

            {/* Progress Bar & Actions */}
            <div className="flex items-center gap-6 min-w-[220px] justify-between md:justify-end">
              <div className="w-32">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Progress</span>
                  <span>{m.progress}%</span>
                </div>
                <ProgressBar
                  progress={m.progress}
                  variant={m.status === 'Completed' ? 'emerald' : m.status === 'At Risk' ? 'red' : 'emerald'}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                  title="Edit Milestone"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-red-600"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingMilestone ? `Edit ${editingMilestone.milestoneCode}` : 'Create Milestone'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">MILESTONE NAME *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Blockchain Integration"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">STATUS</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900 font-medium"
                  >
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">DEADLINE</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  />
                </div>
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
