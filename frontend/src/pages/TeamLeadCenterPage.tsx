import React, { useState, useEffect } from 'react';
import {
  Compass,
  AlertOctagon,
  Clock,
  Calendar,
  Zap,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { DashboardMetrics, Task, Blocker } from '../types';
import { Card } from '../components/common/Card';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Link } from 'react-router-dom';

export const TeamLeadCenterPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashData, tasksData, blockersData] = await Promise.all([
          apiClient.getDashboard(),
          apiClient.getTasks(),
          apiClient.getBlockers(),
        ]);
        setMetrics(dashData);
        setTasks(tasksData);
        setBlockers(blockersData);
      } catch (e) {
        console.error('Failed to load control center:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Calculating Team Lead Action Priorities...</span>
        </div>
      </div>
    );
  }

  const now = new Date();
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED');
  const reviewTasks = tasks.filter((t) => t.status === 'IN_REVIEW');
  const openBlockers = blockers.filter((b) => b.status === 'OPEN' || b.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-700 font-mono mb-1">
            <Compass className="w-4 h-4" />
            <span>Team Lead Operational Command</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            What Should I Do Now?
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Algorithmic priority engine synthesizing critical path blockers, review bottlenecks, and milestone deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Team Readiness</div>
            <div className="text-lg font-bold text-emerald-700 font-mono">
              {metrics.sihReadiness.score}% ({metrics.sihReadiness.statusLabel})
            </div>
          </div>
        </div>
      </div>

      {/* 1. RECOMMENDED ACTIONS ENGINE */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
            Direct Action Priorities (Calculated from Project State)
          </h2>
        </div>

        <div className="space-y-3">
          {metrics.recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-4 hover:border-emerald-300 transition-all"
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {action}
                </p>
              </div>

              {action.toLowerCase().includes('blocker') ? (
                <Link
                  to="/blockers"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
                >
                  Resolve Blocker
                </Link>
              ) : action.toLowerCase().includes('review') ? (
                <Link
                  to="/tasks"
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
                >
                  Review Tasks
                </Link>
              ) : action.toLowerCase().includes('demo') ? (
                <Link
                  to="/demo-readiness"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
                >
                  Open Demo Test
                </Link>
              ) : (
                <Link
                  to="/sih-readiness"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Inspect
                </Link>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 2. THREE COLUMNS: URGENT, TODAY, THIS WEEK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* URGENT COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b-2 border-rose-200 text-rose-700">
            <AlertOctagon className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
              1. Urgent Bottlenecks ({openBlockers.length + overdueTasks.length + reviewTasks.length})
            </h3>
          </div>

          <div className="space-y-3">
            {openBlockers.map((b) => (
              <Card key={b.id} className="p-3.5 bg-rose-50/50 border-rose-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-rose-700">{b.blockerId}</span>
                  <PriorityBadge priority={b.priority} showIcon={false} />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{b.title}</h4>
                <p className="text-[11px] text-slate-500">Reporter: {b.reporter.name}</p>
              </Card>
            ))}

            {overdueTasks.map((t) => (
              <Card key={t.id} className="p-3.5 bg-amber-50/50 border-amber-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-700">{t.taskId}</span>
                  <span className="text-[10px] text-amber-700 font-mono font-bold">OVERDUE</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{t.title}</h4>
                <p className="text-[11px] text-slate-500">Assignee: {t.assignee?.name || 'Unassigned'}</p>
              </Card>
            ))}

            {reviewTasks.map((t) => (
              <Card key={t.id} className="p-3.5 bg-purple-50/50 border-purple-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-purple-700">{t.taskId}</span>
                  <span className="text-[10px] text-purple-700 font-mono font-bold">IN REVIEW</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{t.title}</h4>
                <p className="text-[11px] text-slate-500">Ready for code approval</p>
              </Card>
            ))}

            {openBlockers.length === 0 && overdueTasks.length === 0 && reviewTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                No urgent bottlenecks!
              </div>
            )}
          </div>
        </div>

        {/* TODAY COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b-2 border-blue-200 text-blue-700">
            <Clock className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
              2. Today's Execution Focus
            </h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-white border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Team Sync at 6:00 PM IST</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review Fabric adapter merge and student wallet selective sharing demonstration.
              </p>
            </Card>

            <Card className="p-4 bg-white border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Active Sprint In-Progress Tasks
              </div>
              <div className="space-y-2 pt-1">
                {tasks
                  .filter((t) => t.status === 'IN_PROGRESS')
                  .slice(0, 3)
                  .map((t) => (
                    <div key={t.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                      <span className="text-slate-700 font-medium truncate max-w-[180px]">{t.title}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">{t.progress}%</span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>

        {/* THIS WEEK COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b-2 border-amber-200 text-amber-700">
            <Zap className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
              3. This Week's Milestones
            </h3>
          </div>

          <div className="space-y-3">
            {metrics.milestones.slice(3, 6).map((m) => (
              <Card key={m.id} className="p-4 bg-white border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{m.code}: {m.name}</span>
                  <StatusBadge status={m.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500">Deadline: {new Date(m.deadline).toLocaleDateString()}</p>
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-medium">Progress</span>
                    <span className="font-mono font-bold text-slate-700">{m.progress}%</span>
                  </div>
                  <ProgressBar progress={m.progress} size="sm" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
