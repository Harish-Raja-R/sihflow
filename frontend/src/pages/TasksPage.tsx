import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { Task, User as UserType } from '../types';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { Link } from 'react-router-dom';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  // Modal State
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'HIGH',
    status: 'TODO',
    estimatedHours: 8,
    dueDate: '2026-09-05',
  });

  const loadTasks = async () => {
    try {
      const [tData, mData] = await Promise.all([
        apiClient.getTasks({
          search,
          status: statusFilter,
          priority: priorityFilter,
          assigneeId: assigneeFilter,
        }),
        apiClient.getTeamMembers(),
      ]);
      setTasks(tData);
      setTeamMembers(mData);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [search, statusFilter, priorityFilter, assigneeFilter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createTask({
        ...newTaskData,
        priority: newTaskData.priority as any,
        status: newTaskData.status as any,
        projectId: 'proj-acadshield-001',
      });
      setIsNewTaskOpen(false);
      setNewTaskData({
        title: '',
        description: '',
        assigneeId: '',
        priority: 'HIGH',
        status: 'TODO',
        estimatedHours: 8,
        dueDate: '2026-09-05',
      });
      loadTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleQuickStatus = async (taskId: string, newStatus: string) => {
    try {
      await apiClient.updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Project Tasks</h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage, assign, and track technical deliverables across AcadShield workstreams.
          </p>
        </div>
        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 bg-white border-slate-200 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, or keywords..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="BLOCKED">BLOCKED</option>
          <option value="IN_REVIEW">IN REVIEW</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Priorities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Assignees</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.teamRole})
            </option>
          ))}
        </select>
      </Card>

      {/* Task Table */}
      <Card className="p-0 bg-white border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Title & Workstream</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    <Link to={`/tasks/${task.id}`} className="hover:underline">
                      {task.taskId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <Link to={`/tasks/${task.id}`} className="font-bold text-slate-800 hover:text-emerald-700 block truncate">
                      {task.title}
                    </Link>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {task.workstream ? `${task.workstream.code}: ${task.workstream.name}` : 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {task.assignee ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 overflow-hidden">
                          {task.assignee.avatarUrl ? (
                            <img src={task.assignee.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            task.assignee.name.charAt(0)
                          )}
                        </div>
                        <span className="text-slate-700 font-medium truncate max-w-[120px]">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={task.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 w-32">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <ProgressBar progress={task.progress} size="sm" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 font-semibold">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <select
                      value={task.status}
                      onChange={(e) => handleQuickStatus(task.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:border-emerald-600 font-medium"
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="BLOCKED">BLOCKED</option>
                      <option value="IN_REVIEW">IN REVIEW</option>
                      <option value="COMPLETED">DONE</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No tasks found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Task Modal */}
      <Modal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              placeholder="e.g. Implement Verification UI Drag and Drop"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
              placeholder="Detailed technical deliverable description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Assignee</label>
              <select
                value={newTaskData.assigneeId}
                onChange={(e) => setNewTaskData({ ...newTaskData, assigneeId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.teamRole})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Priority</label>
              <select
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Estimated Hours</label>
              <input
                type="number"
                value={newTaskData.estimatedHours}
                onChange={(e) => setNewTaskData({ ...newTaskData, estimatedHours: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Due Date</label>
              <input
                type="date"
                value={newTaskData.dueDate}
                onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
