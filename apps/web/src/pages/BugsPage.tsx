import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Bug, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const BugsPage: React.FC = () => {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('HIGH');

  const fetchBugs = async () => {
    try {
      const res = await apiClient.get('/bugs');
      if (res.data?.success) {
        setBugs(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiClient.post('/bugs', {
        title,
        description: desc,
        severity,
        projectId: 'proj-acadshield-001',
      });
      setTitle('');
      setDesc('');
      setShowModal(false);
      fetchBugs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/bugs/${id}/status`, { status });
      fetchBugs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">QA Defect Tracker</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log, assign, and verify defects discovered during integration and tamper-proof testing
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Report Bug</span>
        </button>
      </div>

      {/* Bugs Table */}
      <Card bodyClassName="p-0">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading defects...</div>
        ) : bugs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            ✅ 0 open bugs! All test suites passing cleanly.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Bug ID & Title</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bugs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-rose-700 shrink-0">{b.bugId}</span>
                        <div>
                          <div className="font-semibold text-slate-900">{b.title}</div>
                          {b.description && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{b.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={b.severity === 'CRITICAL' ? 'danger' : 'warning'}>{b.severity}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={b.status === 'RESOLVED' ? 'success' : 'default'}>{b.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {b.assignee?.name || 'Member 4 (Backend)'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-white font-medium text-slate-700 focus:outline-none"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Report Defect</h3>
            <form onSubmit={handleCreateBug} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. QR code canvas does not resize on mobile viewport"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Steps to reproduce, actual behavior, logs..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white rounded-lg"
                >
                  Save Bug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
