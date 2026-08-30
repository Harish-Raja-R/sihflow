import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Plus,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { Blocker, User as UserType } from '../types';
import { Card } from '../components/common/Card';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const BlockersPage: React.FC = () => {
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Report Blocker Modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    priority: 'HIGH',
    impact: 'Blocks credential issue flow',
    blockedUserId: '',
  });

  // Resolve Blocker Modal
  const [resolvingBlocker, setResolvingBlocker] = useState<Blocker | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadBlockers = async () => {
    try {
      const [bData, mData] = await Promise.all([
        apiClient.getBlockers(),
        apiClient.getTeamMembers(),
      ]);
      setBlockers(bData);
      setTeamMembers(mData);
    } catch (e) {
      console.error('Failed to load blockers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockers();
  }, []);

  const handleReportBlocker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.reportBlocker({
        ...reportData,
        priority: reportData.priority as any,
        projectId: 'proj-acadshield-001',
      });
      setIsReportOpen(false);
      setReportData({
        title: '',
        description: '',
        priority: 'HIGH',
        impact: '',
        blockedUserId: '',
      });
      loadBlockers();
    } catch (e) {
      console.error('Failed to report blocker:', e);
    }
  };

  const handleResolveBlocker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingBlocker) return;
    try {
      await apiClient.resolveBlocker(resolvingBlocker.id, resolutionNotes);
      setResolvingBlocker(null);
      setResolutionNotes('');
      loadBlockers();
    } catch (e) {
      console.error('Failed to resolve blocker:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading active blockers...</span>
      </div>
    );
  }

  const openCount = blockers.filter((b) => b.status === 'OPEN' || b.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            <span>Active Blockers & Impediments</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Resolve critical cross-member blockers immediately to prevent cascade delays in the SIH pipeline.
          </p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Report Blocker</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-rose-50/60 border-rose-200 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs text-rose-700 font-bold uppercase font-mono">Open Blockers</div>
            <div className="text-2xl font-black text-rose-800 font-mono mt-0.5">{openCount}</div>
          </div>
          <AlertOctagon className="w-8 h-8 text-rose-300" />
        </Card>

        <Card className="p-4 bg-white border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase font-mono">Resolved Blockers</div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
              {blockers.filter((b) => b.status === 'RESOLVED').length}
            </div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-300" />
        </Card>

        <Card className="p-4 bg-white border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase font-mono">Avg Resolution Time</div>
            <div className="text-2xl font-black text-slate-800 font-mono mt-0.5">4.2 hrs</div>
          </div>
          <Clock className="w-8 h-8 text-slate-300" />
        </Card>
      </div>

      {/* Blockers List */}
      <div className="space-y-4">
        {blockers.map((b) => {
          const isResolved = b.status === 'RESOLVED';

          return (
            <Card
              key={b.id}
              className={`p-5 flex flex-col space-y-4 border shadow-xs transition-all ${
                isResolved
                  ? 'bg-white border-slate-200'
                  : 'bg-rose-50/30 border-rose-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <span className="font-mono text-xs font-bold text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-200 flex-shrink-0">
                    {b.blockerId}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <PriorityBadge priority={b.priority} />
                  <StatusBadge status={b.status} size="sm" />
                  {!isResolved && (
                    <button
                      onClick={() => setResolvingBlocker(b)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Impact & People */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Impact</span>
                  <span className="text-slate-800 font-medium">{b.impact || 'Project timeline'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Reporter</span>
                  <span className="text-slate-800 font-medium">{b.reporter?.name} ({b.reporter?.teamRole})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Blocked By</span>
                  <span className="text-amber-800 font-semibold">
                    {b.blockedUser?.name ? `${b.blockedUser.name} (${b.blockedUser.teamRole})` : 'External Dependency'}
                  </span>
                </div>
              </div>

              {/* Resolution Notes if resolved */}
              {isResolved && b.resolutionNotes && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                  <span className="font-bold text-[10px] uppercase font-mono block text-emerald-800 mb-0.5">
                    Resolution Notes
                  </span>
                  {b.resolutionNotes}
                </div>
              )}
            </Card>
          );
        })}

        {blockers.length === 0 && (
          <Card className="p-12 text-center text-slate-400 text-xs bg-slate-50 border-slate-200">
            No blockers reported.
          </Card>
        )}
      </div>

      {/* Report Blocker Modal */}
      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Report Project Blocker">
        <form onSubmit={handleReportBlocker} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Blocker Title *</label>
            <input
              type="text"
              required
              value={reportData.title}
              onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
              placeholder="e.g. Awaiting DID resolution contract interface"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-rose-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              placeholder="Describe what is blocked and what is required to unblock it..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-rose-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Priority</label>
              <select
                value={reportData.priority}
                onChange={(e) => setReportData({ ...reportData, priority: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-rose-600 focus:bg-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Blocked By (Member)</label>
              <select
                value={reportData.blockedUserId}
                onChange={(e) => setReportData({ ...reportData, blockedUserId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-rose-600 focus:bg-white"
              >
                <option value="">External / Not specified</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.teamRole})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReportOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shadow-xs"
            >
              Report Blocker
            </button>
          </div>
        </form>
      </Modal>

      {/* Resolve Blocker Modal */}
      <Modal
        isOpen={!!resolvingBlocker}
        onClose={() => setResolvingBlocker(null)}
        title={`Resolve Blocker: ${resolvingBlocker?.blockerId}`}
      >
        <form onSubmit={handleResolveBlocker} className="space-y-4 text-xs">
          <p className="text-slate-700 font-medium">{resolvingBlocker?.title}</p>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Resolution Summary & Steps Taken *</label>
            <textarea
              rows={4}
              required
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Explain how this impediment was resolved..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setResolvingBlocker(null)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
            >
              Confirm Resolution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
