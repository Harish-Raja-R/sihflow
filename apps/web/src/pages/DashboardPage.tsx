import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  CheckSquare,
  AlertOctagon,
  Clock,
  Users,
  Milestone,
  Activity,
  GitBranch,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/dashboard');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-semibold">Unable to load dashboard data</p>
            <p className="text-sm">{error || 'Server error occurred'}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 bg-white border border-red-300 rounded-md text-sm font-medium hover:bg-red-50 text-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { project, health, teamStatus, milestones, activeBlockers, recentActivities, github } = data;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. TOP HEADER: Project Name & Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
            <Badge variant="success">SIH PS #{project.problemStatementNumber || '1422'}</Badge>
            <span className="text-xs font-medium text-slate-500">{project.currentSprint || 'Sprint 2'}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {project.sihProblemStatement || 'Blockchain-based Academic Credential Verification System'}
          </p>
        </div>
        <div className="flex items-center gap-4 min-w-[240px]">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Overall Progress</span>
              <span className="text-slate-900">{project.overallProgress}%</span>
            </div>
            <ProgressBar progress={project.overallProgress} variant="emerald" />
          </div>
          <button
            onClick={fetchDashboardData}
            title="Refresh metrics"
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. KPI METRICS: Project Progress, Active, Completed, Blocked, Overdue */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Progress</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{health.overallProgress}%</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Target: Grand Finale</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tasks</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{health.inProgressTasks + (health.pendingReviews || 0)}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">In progress & review</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Tasks</div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{health.completedTasks}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">of {health.totalTasks} total tasks</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked Tasks</div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{health.blockedTasks || (activeBlockers?.length || 0)}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Needs team resolution</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Tasks</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{health.overdueTasks || 0}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">All deadlines on track</div>
        </Card>
      </div>

      {/* 3. TEAM STATUS (All 6 Members) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">Team Status (6 Members)</h2>
          </div>
          <button
            onClick={() => navigate('/team')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {teamStatus?.map((member: any) => (
            <div
              key={member.id}
              onClick={() => navigate('/team')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 transition-all cursor-pointer"
            >
              <div className="font-bold text-sm text-slate-900">{member.name}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{member.teamRole}</div>
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="text-[10px] text-slate-400 font-medium">CURRENT TASK</div>
                <div className="text-xs text-slate-700 font-medium truncate mt-0.5" title={member.currentTask?.title}>
                  {member.currentTask?.title || 'Standby'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. UPCOMING MILESTONES */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Upcoming Milestones</h2>
            </div>
            <button
              onClick={() => navigate('/milestones')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Milestone Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {milestones?.slice(0, 4).map((m: any) => (
              <div key={m.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{m.code}:</span>
                    <span className="text-sm font-semibold text-slate-900">{m.name}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Deadline: {m.deadline || '2026-09-10'}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={m.status === 'Completed' ? 'success' : m.status === 'At Risk' ? 'danger' : 'info'}>
                    {m.status}
                  </Badge>
                  <div className="text-xs font-bold text-slate-700 mt-1">{m.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ACTIVE BLOCKERS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">Active Blockers</h2>
            </div>
            <button
              onClick={() => navigate('/blockers')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Blocker Hub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeBlockers && activeBlockers.length > 0 ? (
            <div className="space-y-3">
              {activeBlockers.map((b: any) => (
                <div key={b.id} className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800">{b.blockerId}</span>
                    <Badge variant="warning">{b.priority || 'HIGH'}</Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-1">{b.title}</h4>
                  <div className="text-xs text-slate-500 mt-1">
                    Reporter: <span className="font-medium text-slate-700">{b.reporter}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
              <CheckSquare className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium">No active blockers. Team is running smoothly!</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. RECENT ACTIVITY & 7. GITHUB SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            </div>
            <button
              onClick={() => navigate('/activity')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Full Feed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities?.slice(0, 4).map((act: any) => (
              <div key={act.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900">{act.summary}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">GitHub Summary</h2>
            </div>
            <button
              onClick={() => navigate('/github')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              GitHub Settings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Repository:</span>
              <a
                href="https://github.com/vishanth11/AcadShield.git"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                vishanth11/AcadShield <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
              <div>
                <div className="text-base font-bold text-slate-900">{github?.commitsCount || 5}</div>
                <div className="text-[10px] text-slate-500 font-semibold">COMMITS</div>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">{github?.openPrsCount || 2}</div>
                <div className="text-[10px] text-slate-500 font-semibold">OPEN PRS</div>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">{github?.openIssuesCount || 0}</div>
                <div className="text-[10px] text-slate-500 font-semibold">ISSUES</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
