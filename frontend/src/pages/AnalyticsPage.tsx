import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';
import { apiClient } from '../services/api';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getDashboard();
        setMetrics(data);
      } catch (e) {
        console.error('Failed to load analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Computing project analytics & velocity distributions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-emerald-600" />
          <span>Project Analytics & Workload Distribution</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Quantitative performance breakdown, member contribution metrics, and sprint throughput for AcadShield.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-slate-500 font-bold uppercase font-mono">Completion Rate</div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
            {metrics.health.overallProgress}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {metrics.health.completedTasks} / {metrics.health.totalTasks} Tasks Done
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-blue-700 font-bold uppercase font-mono">In Progress Work</div>
          <div className="text-2xl font-black text-blue-700 font-mono mt-1">
            {metrics.health.inProgressTasks}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Under active development</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-purple-700 font-bold uppercase font-mono">GitHub PR Velocity</div>
          <div className="text-2xl font-black text-purple-700 font-mono mt-1">
            {metrics.github.openPrsCount} Open
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{metrics.github.commitsCount} commits synced</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-emerald-700 font-bold uppercase font-mono">SIH Readiness Index</div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
            {metrics.sihReadiness.score}%
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
            {metrics.sihReadiness.statusLabel}
          </div>
        </Card>
      </div>

      {/* Member Workload Breakdown */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            6-Member Workload Distribution
          </h3>
        </div>

        <div className="space-y-4">
          {metrics.teamStatus.map((m: any) => {
            return (
              <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                      {m.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900">{m.name}</span>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">({m.teamRole})</span>
                  </div>
                  <span className="font-mono text-slate-600 font-bold">
                    {m.currentTask ? `${m.currentTask.progress}% Current Task` : 'Available'}
                  </span>
                </div>

                <ProgressBar progress={m.currentTask ? m.currentTask.progress : 100} size="sm" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
