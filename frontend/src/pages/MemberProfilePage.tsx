import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { User, Task } from '../types';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';

export const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      try {
        const [userData, userTasks] = await Promise.all([
          apiClient.getMemberProfile(id),
          apiClient.getTasks({ assigneeId: id }),
        ]);
        setMember(userData);
        setTasks(userTasks);
      } catch (e) {
        console.error('Failed to load member profile:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading || !member) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading member profile...</span>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link to="/team" className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-emerald-700 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Team Roster</span>
      </Link>

      {/* Header Profile Card */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-emerald-800 overflow-hidden shadow-xs">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{member.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-mono font-bold text-emerald-800 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {member.teamRole}
                </span>
                <span className="text-xs text-slate-500">{member.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Github className="w-4 h-4 text-slate-700" />
            <span className="font-mono font-semibold">{member.githubUsername || 'N/A'}</span>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">
            Designated Responsibilities & Deliverables
          </span>
          {member.responsibilities}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 font-semibold uppercase font-mono">Assigned Tasks</div>
            <div className="text-xl font-bold text-slate-800 font-mono mt-0.5">{tasks.length}</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <div className="text-[10px] text-emerald-700 font-semibold uppercase font-mono">Completed</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">{completedCount}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-[10px] text-blue-700 font-semibold uppercase font-mono">In Progress</div>
            <div className="text-xl font-bold text-blue-700 font-mono mt-0.5">{inProgressCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 font-semibold uppercase font-mono">Completion Rate</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">{completionRate}%</div>
          </div>
        </div>
      </Card>

      {/* Member Tasks Table */}
      <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
          Assigned Tasks ({tasks.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                    <Link to={`/tasks/${t.id}`} className="hover:underline">
                      {t.taskId}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{t.title}</td>
                  <td className="py-2.5 px-3">
                    <PriorityBadge priority={t.priority} showIcon={false} />
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 w-28">
                    <ProgressBar progress={t.progress} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 text-xs">
                    No tasks currently assigned to this member.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
