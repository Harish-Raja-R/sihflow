import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  Users,
  CheckSquare,
  AlertOctagon,
  Clock,
  Activity,
  X,
  Phone,
  Mail,
  GitBranch,
  Edit2,
  Save,
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Member Profile Modal
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Member Edit State
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', responsibilities: '', githubUsername: '' });

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/team');
      if (res.data?.success) {
        setMembers(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load team roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenProfile = async (member: any) => {
    try {
      setProfileLoading(true);
      setSelectedMember(member);
      setIsEditingMember(false);
      const res = await api.get(`/team/${member.id}`);
      if (res.data?.success) {
        setSelectedMember(res.data.data);
        setEditForm({
          name: res.data.data.name || '',
          phone: res.data.data.phone || '',
          responsibilities: res.data.data.responsibilities || '',
          githubUsername: res.data.data.githubUsername || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveMember = async () => {
    if (!selectedMember) return;
    try {
      const res = await api.patch(`/team/${selectedMember.id}`, editForm);
      if (res.data?.success) {
        setSelectedMember((prev: any) => ({ ...prev, ...editForm }));
        setMembers((prev) =>
          prev.map((m) => (m.id === selectedMember.id ? { ...m, ...editForm } : m))
        );
        setIsEditingMember(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save member details');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <p className="font-semibold">{error}</p>
          <button onClick={fetchTeam} className="px-3 py-1 bg-white border border-red-300 rounded text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">6-Member Team Roster</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Click on any team member to inspect their assigned tasks, blockers, and recent activity.
          </p>
        </div>
      </div>

      {/* 6 Team Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => handleOpenProfile(member)}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">{member.teamRole}</p>
                </div>
                <Badge variant={member.role === 'TEAM_LEAD' ? 'warning' : 'info'}>
                  {member.role === 'TEAM_LEAD' ? 'Lead' : 'Member'}
                </Badge>
              </div>

              {/* Current Task & Progress */}
              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT TASK</div>
                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {member.currentTask?.title || 'System Integration'}
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                    <span>Task Progress</span>
                    <span className="font-bold text-slate-700">{member.currentTask?.progress || 80}%</span>
                  </div>
                  <ProgressBar progress={member.currentTask?.progress || 80} variant="emerald" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                {member.stats?.completedTasks || 3} Completed
              </span>
              <span className="font-semibold text-emerald-600 hover:underline">
                View Profile &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center">
                  {selectedMember.name?.slice(0, 2) || 'MB'}
                </div>
                <div>
                  {isEditingMember ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-lg font-bold border border-slate-300 rounded px-2 py-0.5"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-slate-900">{selectedMember.name}</h2>
                  )}
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">{selectedMember.teamRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditingMember ? (
                  <button
                    onClick={handleSaveMember}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingMember(true)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Edit
                  </button>
                )}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Contact & Responsibilities */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">EMAIL:</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedMember.email}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">PHONE:</span>
                  {isEditingMember ? (
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="text-xs border border-slate-300 rounded px-2 py-0.5 w-full bg-white"
                    />
                  ) : (
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedMember.phone || '+91 98765 43210'}
                    </div>
                  )}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Responsibilities</h4>
                {isEditingMember ? (
                  <textarea
                    rows={2}
                    value={editForm.responsibilities}
                    onChange={(e) => setEditForm({ ...editForm, responsibilities: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-normal"
                  />
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedMember.responsibilities || 'Dedicated feature engineering and system development.'}
                  </p>
                )}
              </div>

              {/* Assigned / Current Tasks */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Current & Assigned Tasks ({selectedMember.assignedTasks?.length || 1})
                </h4>
                <div className="space-y-2">
                  {selectedMember.assignedTasks?.map((task: any) => (
                    <div key={task.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{task.taskId}</span>
                          <span className="font-medium text-slate-900">{task.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Due: {task.dueDate || '2026-09-10'}</div>
                      </div>
                      <Badge variant={task.status === 'DONE' ? 'success' : task.status === 'BLOCKED' ? 'danger' : 'info'}>
                        {task.status}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-500">No tasks assigned currently.</p>
                  )}
                </div>
              </div>

              {/* Blocked Tasks (if any) */}
              {selectedMember.blockedTasks && selectedMember.blockedTasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> Blocked Tasks ({selectedMember.blockedTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedMember.blockedTasks.map((t: any) => (
                      <div key={t.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 text-xs">
                        <span className="font-bold text-amber-900">{t.taskId}:</span> {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-slate-500" /> Recent Activity
                </h4>
                <div className="space-y-2">
                  {selectedMember.activities?.slice(0, 3).map((act: any) => (
                    <div key={act.id} className="text-xs text-slate-700 p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span>{act.summary}</span>
                      <span className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-500">No recent activity logged.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
