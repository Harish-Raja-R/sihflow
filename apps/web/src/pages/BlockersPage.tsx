import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import {
  AlertOctagon,
  Plus,
  CheckCircle,
  Trash2,
  Edit2,
  X,
  User,
  Clock,
  CheckSquare,
} from 'lucide-react';

export const BlockersPage: React.FC = () => {
  const [blockers, setBlockers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlocker, setEditingBlocker] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    impact: '',
    priority: 'HIGH',
    status: 'OPEN',
    taskId: '',
  });

  // Resolve Modal
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolvingBlocker, setResolvingBlocker] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchBlockersAndTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const [blockersRes, tasksRes] = await Promise.all([
        api.get('/blockers'),
        api.get('/tasks'),
      ]);
      if (blockersRes.data?.success) setBlockers(blockersRes.data.data);
      if (tasksRes.data?.success) setTasks(tasksRes.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load blockers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockersAndTasks();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlocker(null);
    setForm({
      title: '',
      description: '',
      impact: '',
      priority: 'HIGH',
      status: 'OPEN',
      taskId: tasks[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBlocker(b);
    setForm({
      title: b.title,
      description: b.description || '',
      impact: b.impact || '',
      priority: b.priority || 'HIGH',
      status: b.status || 'OPEN',
      taskId: b.relatedTask?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveBlocker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlocker) {
        const res = await api.patch(`/blockers/${editingBlocker.id}`, form);
        if (res.data?.success) {
          setBlockers((prev) =>
            prev.map((b) => (b.id === editingBlocker.id ? { ...b, ...res.data.data } : b))
          );
        }
      } else {
        const res = await api.post('/blockers', form);
        if (res.data?.success) {
          setBlockers((prev) => [res.data.data, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save blocker');
    }
  };

  const handleOpenResolve = (b: any) => {
    setResolvingBlocker(b);
    setResolutionNotes('');
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingBlocker) return;
    try {
      const res = await api.patch(`/blockers/${resolvingBlocker.id}/resolve`, { resolutionNotes });
      if (res.data?.success) {
        setBlockers((prev) =>
          prev.map((b) => (b.id === resolvingBlocker.id ? { ...b, status: 'RESOLVED', resolutionNotes } : b))
        );
        setIsResolveModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to resolve blocker');
    }
  };

  const handleDeleteBlocker = async (id: string) => {
    if (!window.confirm('Delete this blocker record?')) return;
    try {
      const res = await api.delete(`/blockers/${id}`);
      if (res.data?.success) {
        setBlockers((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete blocker');
    }
  };

  const openBlockers = blockers.filter((b) => b.status === 'OPEN' || b.status === 'IN_PROGRESS');
  const resolvedBlockers = blockers.filter((b) => b.status === 'RESOLVED');

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-slate-900">Blocker Registry</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Report, triage, and resolve impediments hindering team velocity.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Report Blocker
        </button>
      </div>

      {/* Unresolved Blockers Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span>Unresolved Blockers</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {openBlockers.length}
          </span>
        </h2>

        {openBlockers.length > 0 ? (
          <div className="space-y-3">
            {openBlockers.map((b) => (
              <div
                key={b.id}
                className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {b.blockerId}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">{b.title}</h3>
                    <Badge variant={b.priority === 'CRITICAL' ? 'danger' : 'warning'}>{b.priority}</Badge>
                    <Badge variant="default">{b.status}</Badge>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">{b.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>
                      Reported by: <strong className="text-slate-800">{b.reporter?.name || 'Member'}</strong>
                    </span>
                    {b.relatedTask && (
                      <span className="flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                        Related Task: <strong>{b.relatedTask.taskId}</strong>
                      </span>
                    )}
                    {b.impact && (
                      <span className="text-amber-800 font-medium">Impact: {b.impact}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenResolve(b)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                    title="Edit Blocker"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlocker(b.id)}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-red-600"
                    title="Delete Blocker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No active blockers</p>
            <p className="text-xs text-slate-400 mt-0.5">All engineering workstreams are unblocked.</p>
          </div>
        )}
      </div>

      {/* Resolved Blockers Section */}
      {resolvedBlockers.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span>Resolved Blockers</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {resolvedBlockers.length}
            </span>
          </h2>

          <div className="space-y-2">
            {resolvedBlockers.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between opacity-80"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">{b.blockerId}:</span>
                    <span className="text-xs font-semibold text-slate-800">{b.title}</span>
                    <Badge variant="success">RESOLVED</Badge>
                  </div>
                  {b.resolutionNotes && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Notes: <em>{b.resolutionNotes}</em>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteBlocker(b.id)}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingBlocker ? `Edit ${editingBlocker.blockerId}` : 'Report Blocker'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlocker} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">BLOCKER TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hyperledger TLS certificates mismatch"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">DESCRIPTION *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why progress is impeded..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">IMPACT ON SPRINT / MILESTONE</label>
                <input
                  type="text"
                  placeholder="e.g., Delays live verification demo"
                  value={form.impact}
                  onChange={(e) => setForm({ ...form, impact: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PRIORITY</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">RELATED TASK</label>
                  <select
                    value={form.taskId}
                    onChange={(e) => setForm({ ...form, taskId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    <option value="">None / General</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.taskId}: {t.title}
                      </option>
                    ))}
                  </select>
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
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                >
                  Save Blocker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE MODAL */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Resolve {resolvingBlocker?.blockerId}
              </h2>
              <button onClick={() => setIsResolveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs">
              <p className="text-xs text-slate-600">
                Marking <strong>{resolvingBlocker?.title}</strong> as resolved.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">RESOLUTION NOTES</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain how this issue was unblocked..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
