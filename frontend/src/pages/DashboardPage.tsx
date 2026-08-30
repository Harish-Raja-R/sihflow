import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Github,
  Award,
  Users,
  Activity,
  ArrowRight,
  GitPullRequest,
  Bug,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { DashboardMetrics } from '../types';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getDashboard();
        setMetrics(data);
      } catch (e) {
        console.error('Failed to load dashboard:', e);
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
          <span className="text-sm font-medium">Loading AcadShield Mission Control...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. MAIN HEADER / PROJECT BANNER */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono mb-1">
            <span>Smart India Hackathon 2026</span>
            <span>•</span>
            <span>Problem Statement #1422</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {metrics.project.name}
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              ACTIVE
            </span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {metrics.project.sihProblemStatement}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-500 font-semibold uppercase font-mono">Sprint</div>
            <div className="text-sm font-bold text-slate-800">{metrics.project.currentSprint}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-500 font-semibold uppercase font-mono">Team</div>
            <div className="text-sm font-bold text-emerald-700">6 Core Members</div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-[10px] text-emerald-800 font-semibold uppercase font-mono">Overall Progress</div>
            <div className="text-xl font-extrabold text-emerald-700 font-mono">
              {metrics.health.overallProgress}%
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROJECT HEALTH KPI METRICS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Project Health Indicators
          </h2>
          <Link to="/lead-center" className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold">
            Team Lead Actions <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card className="p-3 bg-white border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Progress</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
              {metrics.health.overallProgress}%
            </div>
            <ProgressBar progress={metrics.health.overallProgress} size="sm" className="mt-2" />
          </Card>

          <Card className="p-3 bg-white border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Completed</div>
            <div className="text-xl font-bold text-slate-800 font-mono mt-0.5 flex items-center justify-between">
              {metrics.health.completedTasks}
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">of {metrics.health.totalTasks} tasks</div>
          </Card>

          <Card className="p-3 bg-white border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">In Progress</div>
            <div className="text-xl font-bold text-blue-700 font-mono mt-0.5 flex items-center justify-between">
              {metrics.health.inProgressTasks}
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Active sprints</div>
          </Card>

          <Card className={`p-3 border ${metrics.health.blockedTasks > 0 ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200'}`}>
            <div className="text-[11px] text-slate-500 font-semibold">Blocked</div>
            <div className={`text-xl font-bold font-mono mt-0.5 flex items-center justify-between ${metrics.health.blockedTasks > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
              {metrics.health.blockedTasks}
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-[10px] text-rose-700 font-medium mt-1">Requires action</div>
          </Card>

          <Card className={`p-3 border ${metrics.health.overdueTasks > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200'}`}>
            <div className="text-[11px] text-slate-500 font-semibold">Overdue</div>
            <div className={`text-xl font-bold font-mono mt-0.5 flex items-center justify-between ${metrics.health.overdueTasks > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
              {metrics.health.overdueTasks}
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Passed deadline</div>
          </Card>

          <Card className="p-3 bg-white border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Open Bugs</div>
            <div className="text-xl font-bold text-orange-700 font-mono mt-0.5 flex items-center justify-between">
              {metrics.health.openBugs}
              <Bug className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Quality tracking</div>
          </Card>

          <Card className="p-3 bg-white border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Open PRs</div>
            <div className="text-xl font-bold text-purple-700 font-mono mt-0.5 flex items-center justify-between">
              {metrics.health.openPrs}
              <GitPullRequest className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">GitHub repo</div>
          </Card>

          <Card className="p-3 bg-white border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Reviews</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5 flex items-center justify-between">
              {metrics.health.pendingReviews}
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">In review queue</div>
          </Card>
        </div>
      </div>

      {/* 3. TWO COLUMN LAYOUT: TEAM STATUS & SIH READINESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TEAM STATUS TABLE (2 cols) */}
        <Card className="lg:col-span-2 p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Team Status (6 Members)
              </h3>
            </div>
            <Link to="/team" className="text-xs text-emerald-700 hover:underline font-semibold">
              View Profiles
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Current Task</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.teamStatus.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] text-emerald-700 overflow-hidden">
                          {m.avatarUrl ? <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" /> : m.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium text-[11px]">{m.teamRole}</td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-slate-700 font-medium">
                      {m.currentTask ? (
                        <span title={m.currentTask.title}>
                          <span className="font-mono text-[10px] text-emerald-700 font-bold mr-1">{m.currentTask.taskId}:</span>
                          {m.currentTask.title}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Available</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {m.currentTask ? (
                        <StatusBadge status={m.currentTask.status} size="sm" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">READY</span>
                      )}
                    </td>
                    <td className="py-3 px-3 w-28">
                      {m.currentTask ? (
                        <ProgressBar progress={m.currentTask.progress} size="sm" />
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* SIH READINESS & DEMO READINESS SUMMARY */}
        <div className="space-y-6">
          <Card className="p-5 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  SIH Readiness Score
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {metrics.sihReadiness.statusLabel}
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-5xl font-black text-emerald-700 font-mono tracking-tight">
                {metrics.sihReadiness.score}%
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">14 SIH Grand Finale Categories Tracked</p>
              <ProgressBar progress={metrics.sihReadiness.score} size="md" color="emerald" className="mt-3" />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Demo Checklist:</span>
              <span className="font-bold text-emerald-700 font-mono">
                {metrics.demoReadiness.passedCount} / {metrics.demoReadiness.totalCount} Scenarios Passed
              </span>
            </div>

            <Link
              to="/sih-readiness"
              className="mt-4 block w-full py-2 text-center text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
            >
              Open SIH Readiness Breakdown →
            </Link>
          </Card>
        </div>
      </div>

      {/* 4. ACTIVE BLOCKERS & MILESTONES PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVE BLOCKERS */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Active Blockers ({metrics.activeBlockers.length})
              </h3>
            </div>
            <Link to="/blockers" className="text-xs text-rose-700 hover:underline font-semibold">
              Resolve Blockers
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.activeBlockers.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-slate-200">
                ✅ No active blockers! Team is running smoothly.
              </div>
            ) : (
              metrics.activeBlockers.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-700 mr-2">{b.blockerId}</span>
                      <span className="text-xs font-bold text-slate-800">{b.title}</span>
                    </div>
                    <PriorityBadge priority={b.priority} showIcon={false} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                    <span>
                      Reported by <strong className="text-slate-800">{b.reporter}</strong>
                    </span>
                    <span>
                      Blocked by: <strong className="text-amber-800 font-semibold">{b.blockingUser}</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* MILESTONE PROGRESS */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Milestone Progress (M1–M11)
              </h3>
            </div>
            <Link to="/milestones" className="text-xs text-emerald-700 hover:underline font-semibold">
              All Milestones
            </Link>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {metrics.milestones.slice(0, 6).map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-100/60 border border-emerald-200">
                      {m.code}
                    </span>
                    <span className="font-bold text-slate-800">{m.name}</span>
                  </div>
                  <StatusBadge status={m.status} size="sm" />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <ProgressBar progress={m.progress} size="sm" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 font-bold">{m.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5. GITHUB ACTIVITY & RECENT EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GITHUB ACTIVITY */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                GitHub Activity
              </h3>
            </div>
            <Link to="/github" className="text-xs text-emerald-700 hover:underline font-semibold">
              GitHub Hub
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800 font-mono">{metrics.github.commitsCount}</div>
              <div className="text-[10px] text-slate-500 font-medium">Total Commits</div>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <div className="text-lg font-bold text-purple-700 font-mono">{metrics.github.openPrsCount}</div>
              <div className="text-[10px] text-purple-700 font-medium">Open PRs</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Recent Commits
            </div>
            {metrics.github.recentCommits.slice(0, 3).map((c) => (
              <div key={c.id} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-mono text-[10px] font-bold text-emerald-700">{c.sha}</div>
                <div className="text-slate-700 text-[11px] font-medium truncate mt-0.5">{c.message}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">by {c.authorName}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* RECENT ACTIVITY FEED (2 cols) */}
        <Card className="lg:col-span-2 p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Real-Time Team Activity
              </h3>
            </div>
            <Link to="/activity" className="text-xs text-emerald-700 hover:underline font-semibold">
              Full Feed
            </Link>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {metrics.recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-slate-800 font-semibold">{act.summary}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase text-slate-500 px-2 py-0.5 bg-white rounded border border-slate-200 font-semibold">
                  {act.entityType}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
