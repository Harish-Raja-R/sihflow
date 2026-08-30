import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  BarChart3,
  CheckSquare,
  AlertOctagon,
  Users,
  Milestone,
  RefreshCw,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/dashboard');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <p className="font-semibold">{error || 'No analytics data available'}</p>
          <button onClick={fetchAnalytics} className="px-3 py-1.5 bg-white border border-red-300 rounded text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { health, teamStatus, milestones, activeBlockers } = data;

  const totalTasks = health?.totalTasks || 0;
  const completedTasks = health?.completedTasks || 0;
  const inProgressTasks = health?.inProgressTasks || 0;
  const blockedTasks = health?.blockedTasks || (activeBlockers?.length || 0);
  const pendingReviews = health?.pendingReviews || 0;
  const todoTasks = Math.max(0, totalTasks - completedTasks - inProgressTasks - blockedTasks - pendingReviews);

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Project & Team Analytics</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real metrics computed from tasks, milestones, member workloads, and blockers.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          title="Refresh analytics"
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Analytics Grid: 5 Core Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. TASK COMPLETION RATE */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-base text-slate-900">Task Completion Rate</h2>
            </div>
            <span className="text-xl font-bold text-emerald-700">{completionPercentage}%</span>
          </div>

          <ProgressBar progress={completionPercentage} variant="emerald" />

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold block">COMPLETED</span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block">{completedTasks}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold block">REMAINING</span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block">{totalTasks - completedTasks}</span>
            </div>
          </div>
        </div>

        {/* 2. TASKS BY STATUS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">Tasks by Status</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-700">COMPLETED</span>
              <span className="font-bold text-emerald-700">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-700">IN PROGRESS</span>
              <span className="font-bold text-blue-600">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-700">IN REVIEW</span>
              <span className="font-bold text-purple-600">{pendingReviews}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-700">BLOCKED</span>
              <span className="font-bold text-amber-600">{blockedTasks}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-slate-700">TODO</span>
              <span className="font-bold text-slate-600">{todoTasks}</span>
            </div>
          </div>
        </div>

        {/* 3. TASKS BY MEMBER (Workload Distribution) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-base text-slate-900">Tasks by Member (Workload)</h2>
          </div>

          <div className="space-y-3">
            {teamStatus?.map((m: any) => (
              <div key={m.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{m.name} ({m.teamRole})</span>
                  <span className="text-slate-500 font-bold">{m.currentTask ? '1 Active' : 'Standby'}</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{m.currentTask?.title || 'Standby'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. MILESTONE ROADMAP PROGRESS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Milestone className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-base text-slate-900">Milestone Progress</h2>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {milestones?.map((m: any) => (
              <div key={m.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{m.code}: {m.name}</span>
                  <span className="text-slate-700">{m.progress}%</span>
                </div>
                <ProgressBar progress={m.progress} variant={m.status === 'Completed' ? 'emerald' : 'blue'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BLOCKERS IMPACT OVERVIEW */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <AlertOctagon className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-base text-slate-900">Blockers Impact Analysis</h2>
        </div>

        {activeBlockers && activeBlockers.length > 0 ? (
          <div className="space-y-2">
            {activeBlockers.map((b: any) => (
              <div key={b.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-amber-900">{b.blockerId}:</strong> {b.title}
                </div>
                <Badge variant="warning">{b.priority || 'HIGH'}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No active blockers impeding project velocity.</p>
        )}
      </div>
    </div>
  );
};
