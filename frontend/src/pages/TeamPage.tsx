import React, { useState, useEffect } from 'react';
import { Users, Edit3, ArrowRight } from 'lucide-react';
import { apiClient } from '../services/api';
import { User } from '../types';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const TeamPage: React.FC = () => {
  const { isTeamLead } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Role Modal
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    teamRole: '',
    responsibilities: '',
    role: 'TEAM_MEMBER',
  });

  const loadTeam = async () => {
    try {
      const data = await apiClient.getTeamMembers();
      setMembers(data);
    } catch (e) {
      console.error('Failed to load team:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenEdit = (m: User) => {
    setEditingMember(m);
    setEditFormData({
      teamRole: m.teamRole,
      responsibilities: m.responsibilities || '',
      role: m.role,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      await apiClient.updateMember(editingMember.id, {
        ...editFormData,
        role: editFormData.role as any,
      });
      setEditingMember(null);
      loadTeam();
    } catch (err) {
      console.error('Failed to update member:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading SIH Team Members...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>6-Member SIH Team Roster</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Specialized role distribution, cross-functional responsibilities, and balanced contribution metrics for AcadShield.
          </p>
        </div>
      </div>

      {/* Team Member Cards Grid (6 Members) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const stats = member.stats || {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            blockedTasks: 0,
            completionRate: 0,
          };

          return (
            <Card key={member.id} className="p-6 bg-white border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs group">
              <div className="space-y-4">
                {/* Header Profile Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base font-bold text-emerald-800 overflow-hidden shadow-2xs">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {member.name}
                      </h3>
                      <span className="inline-block text-[11px] font-mono font-bold text-emerald-700">
                        {member.teamRole}
                      </span>
                    </div>
                  </div>

                  {isTeamLead && (
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                      title="Edit role & responsibilities"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Responsibilities */}
                <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80 min-h-[60px]">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">Responsibilities</span>
                  {member.responsibilities || 'General development and review responsibilities.'}
                </div>

                {/* Active Task */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">Current Focus</span>
                  {member.currentTask ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 font-medium truncate max-w-[170px]">
                        {member.currentTask.taskId}: {member.currentTask.title}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-700 font-bold">{member.currentTask.progress}%</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No task in progress</span>
                  )}
                </div>

                {/* Task Stats Row */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 font-medium">Tasks</div>
                    <div className="text-xs font-bold text-slate-800 font-mono">{stats.totalTasks}</div>
                  </div>
                  <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-[10px] text-emerald-700 font-medium">Done</div>
                    <div className="text-xs font-bold text-emerald-700 font-mono">{stats.completedTasks}</div>
                  </div>
                  <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-[10px] text-blue-700 font-medium">Active</div>
                    <div className="text-xs font-bold text-blue-700 font-mono">{stats.inProgressTasks}</div>
                  </div>
                  <div className="p-1.5 bg-rose-50 rounded-lg border border-rose-200">
                    <div className="text-[10px] text-rose-700 font-medium">Blocked</div>
                    <div className="text-xs font-bold text-rose-700 font-mono">{stats.blockedTasks}</div>
                  </div>
                </div>

                {/* Completion Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium">Task Completion</span>
                    <span className="font-mono text-slate-800 font-bold">{stats.completionRate}%</span>
                  </div>
                  <ProgressBar progress={stats.completionRate} size="sm" />
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/team/${member.id}`}
                className="mt-4 flex items-center justify-center space-x-1.5 w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-emerald-700 border border-slate-200 text-xs font-semibold transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editingMember} onClose={() => setEditingMember(null)} title={`Edit Role: ${editingMember?.name}`}>
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Designated Role Title *</label>
            <input
              type="text"
              required
              value={editFormData.teamRole}
              onChange={(e) => setEditFormData({ ...editFormData, teamRole: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">ERP Permission Level</label>
            <select
              value={editFormData.role}
              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="TEAM_LEAD">TEAM_LEAD (Full Control)</option>
              <option value="TEAM_MEMBER">TEAM_MEMBER (Developer)</option>
              <option value="REVIEWER">REVIEWER (Code & Document Approval)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Assigned Responsibilities *</label>
            <textarea
              rows={4}
              required
              value={editFormData.responsibilities}
              onChange={(e) => setEditFormData({ ...editFormData, responsibilities: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingMember(null)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
