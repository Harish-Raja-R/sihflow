import React, { useState, useEffect } from 'react';
import { Bug as BugIcon, Plus } from 'lucide-react';
import { apiClient } from '../services/api';
import { Bug, User as UserType } from '../types';
import { Card } from '../components/common/Card';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const BugsPage: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // New Bug Modal
  const [isNewBugOpen, setIsNewBugOpen] = useState(false);
  const [newBugData, setNewBugData] = useState({
    title: '',
    description: '',
    severity: 'HIGH',
    stepsToReproduce: '',
    assigneeId: '',
  });

  const loadBugs = async () => {
    try {
      const [bData, mData] = await Promise.all([
        apiClient.getBugs(),
        apiClient.getTeamMembers(),
      ]);
      setBugs(bData);
      setTeamMembers(mData);
    } catch (e) {
      console.error('Failed to load bugs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBugs();
  }, []);

  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createBug({
        ...newBugData,
        severity: newBugData.severity as any,
        projectId: 'proj-acadshield-001',
      });
      setIsNewBugOpen(false);
      loadBugs();
    } catch (e) {
      console.error('Failed to create bug:', e);
    }
  };

  const handleStatusChange = async (bugId: string, status: string) => {
    try {
      await apiClient.updateBugStatus(bugId, status);
      loadBugs();
    } catch (e) {
      console.error('Failed to update bug status:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading bug tracking registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BugIcon className="w-6 h-6 text-orange-600" />
            <span>Bug Tracker & Defect Management</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Capture, triage, assign, and resolve functional defects before the SIH live evaluation.
          </p>
        </div>

        <button
          onClick={() => setIsNewBugOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Report Bug</span>
        </button>
      </div>

      {/* Bugs List */}
      <div className="space-y-4">
        {bugs.map((b) => (
          <Card key={b.id} className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <span className="font-mono text-xs font-bold text-orange-700 px-2 py-0.5 rounded bg-orange-50 border border-orange-200 flex-shrink-0">
                  {b.bugId}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                <PriorityBadge priority={b.severity} />
                <StatusBadge status={b.status} size="sm" />

                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-600 font-medium"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* Steps to Reproduce */}
            {b.stepsToReproduce && (
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block mb-1">
                  Steps to Reproduce
                </span>
                <p className="whitespace-pre-line leading-relaxed font-mono text-[11px] text-slate-600">
                  {b.stepsToReproduce}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Reporter: {b.reporter?.name} ({b.reporter?.teamRole})</span>
              <span>Assignee: <strong className="text-slate-800">{b.assignee?.name || 'Unassigned'}</strong></span>
            </div>
          </Card>
        ))}

        {bugs.length === 0 && (
          <Card className="p-12 text-center text-slate-400 text-xs bg-slate-50 border-slate-200">
            ✅ No open defects recorded.
          </Card>
        )}
      </div>

      {/* New Bug Modal */}
      <Modal isOpen={isNewBugOpen} onClose={() => setIsNewBugOpen(false)} title="Report Defect">
        <form onSubmit={handleCreateBug} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Bug Title *</label>
            <input
              type="text"
              required
              value={newBugData.title}
              onChange={(e) => setNewBugData({ ...newBugData, title: e.target.value })}
              placeholder="e.g. Tampered verification returns HTTP 500 instead of TAMPERED badge"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={newBugData.description}
              onChange={(e) => setNewBugData({ ...newBugData, description: e.target.value })}
              placeholder="Summary of unexpected behavior..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Severity</label>
              <select
                value={newBugData.severity}
                onChange={(e) => setNewBugData({ ...newBugData, severity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-600 focus:bg-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Assignee</label>
              <select
                value={newBugData.assigneeId}
                onChange={(e) => setNewBugData({ ...newBugData, assigneeId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-600 focus:bg-white"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.teamRole})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Steps to Reproduce</label>
            <textarea
              rows={3}
              value={newBugData.stepsToReproduce}
              onChange={(e) => setNewBugData({ ...newBugData, stepsToReproduce: e.target.value })}
              placeholder="1. Upload altered certificate PDF&#10;2. Click Verify&#10;3. Check response payload"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-600 focus:bg-white font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewBugOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors shadow-xs"
            >
              Report Bug
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
