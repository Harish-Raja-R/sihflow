import React, { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import { apiClient } from '../services/api';
import { Milestone } from '../types';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';

export const MilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMilestones = async () => {
    try {
      const data = await apiClient.getMilestones();
      setMilestones(data);
    } catch (e) {
      console.error('Failed to load milestones:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const handleUpdateStatus = async (id: string, status: string, progress: number) => {
    try {
      await apiClient.updateMilestone(id, { status: status as any, progress });
      loadMilestones();
    } catch (e) {
      console.error('Failed to update milestone:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading SIH Milestones (M1–M11)...</span>
      </div>
    );
  }

  const completedCount = milestones.filter((m) => m.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Flag className="w-6 h-6 text-emerald-600" />
            <span>SIH Milestones Roadmap (M1–M11)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Core hackathon delivery gates from Architecture Freeze to Final Live Pitch.
          </p>
        </div>

        <div className="px-4 py-2 rounded-lg bg-white border border-slate-200 flex items-center space-x-3 text-xs shadow-xs">
          <span className="text-slate-500">Completed Gates:</span>
          <span className="font-mono font-bold text-emerald-700">
            {completedCount} / {milestones.length}
          </span>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((m) => {
          return (
            <Card key={m.id} className="p-5 bg-white border-slate-200 space-y-4 hover:border-slate-300 transition-all shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-mono font-bold text-xs text-emerald-800 flex-shrink-0">
                    {m.code || m.milestoneCode}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      {m.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Deadline</div>
                    <div className="text-xs font-mono font-bold text-slate-800">
                      {new Date(m.deadline || m.endDate || new Date().toISOString()).toLocaleDateString()}
                    </div>
                  </div>

                  <StatusBadge status={m.status} />

                  {/* Status Dropdown */}
                  <select
                    value={m.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const newProgress = newStatus === 'COMPLETED' ? 100 : newStatus === 'IN_PROGRESS' ? 60 : 0;
                      handleUpdateStatus(m.id, newStatus, newProgress);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="PLANNED">PLANNED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              {/* Progress & Deliverables */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">Milestone Completion</span>
                  <span className="font-mono font-bold text-slate-800">{m.progress}%</span>
                </div>
                <ProgressBar progress={m.progress} size="sm" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
