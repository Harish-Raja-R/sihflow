import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  MessageSquare,
  Calendar,
  User,
  AlertCircle,
  X,
  Send,
  Milestone,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [taskComments, setTaskComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Form for Create/Edit
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-09-10',
    progress: 0,
    milestoneId: '',
  });
  const [isEditingInModal, setIsEditingInModal] = useState(false);

  const fetchTasksAndMetadata = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksRes, teamRes, milestonesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/team'),
        api.get('/milestones'),
      ]);

      if (tasksRes.data?.success) setTasks(tasksRes.data.data);
      if (teamRes.data?.success) setMembers(teamRes.data.data);
      if (milestonesRes.data?.success) setMilestones(milestonesRes.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load task registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndMetadata();
  }, []);

  const handleOpenCreateModal = () => {
    setTaskForm({
      title: '',
      description: '',
      assigneeId: members[0]?.id || 'usr-lead-001',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: '2026-09-10',
      progress: 0,
      milestoneId: milestones[0]?.id || '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    try {
      const res = await api.post('/tasks', taskForm);
      if (res.data?.success) {
        setTasks((prev) => [res.data.data, ...prev]);
        setIsCreateModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  const handleOpenTaskDetails = async (task: any) => {
    setSelectedTask(task);
    setIsEditingInModal(false);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assigneeId: task.assignee?.id || '',
      priority: task.priority || 'HIGH',
      status: task.status || 'TODO',
      dueDate: task.dueDate || '2026-09-10',
      progress: task.progress || 0,
      milestoneId: task.milestoneId || '',
    });

    try {
      const commentsRes = await api.get(`/tasks/${task.id}/comments`);
      if (commentsRes.data?.success) {
        setTaskComments(commentsRes.data.data);
      }
    } catch (err) {
      setTaskComments([]);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      const res = await api.patch(`/tasks/${selectedTask.id}`, taskForm);
      if (res.data?.success) {
        const updated = res.data.data;
        setSelectedTask(updated);
        setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, ...updated } : t)));
        setIsEditingInModal(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      if (res.data?.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (selectedTask?.id === taskId) setSelectedTask(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;
    try {
      const res = await api.post(`/tasks/${selectedTask.id}/comments`, { text: newCommentText });
      if (res.data?.success) {
        setTaskComments((prev) => [res.data.data, ...prev]);
        setNewCommentText('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add comment');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.taskId.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create, prioritize, assign, and track engineering tasks for AcadShield.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, TASK-ID or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="IN_REVIEW">IN REVIEW</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {filteredTasks.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Title & Milestone</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleOpenTaskDetails(task)}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-slate-900">{task.taskId}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{task.title}</div>
                    {task.milestone?.name && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{task.milestone.name}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{task.assignee?.name || 'Unassigned'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'default'}>
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={task.status === 'DONE' ? 'success' : task.status === 'BLOCKED' ? 'danger' : task.status === 'IN_PROGRESS' ? 'info' : 'default'}>
                      {task.status?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 w-28">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                      <span>{task.progress}%</span>
                    </div>
                    <ProgressBar progress={task.progress} variant={task.status === 'DONE' ? 'emerald' : 'blue'} />
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{task.dueDate || '2026-09-10'}</td>
                  <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenTaskDetails(task)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No tasks found matching your query</p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold"
            >
              + Create Task
            </button>
          </div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">TASK TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Integrate W3C DID Resolver"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Technical specifications, criteria and requirements..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ASSIGNEE</label>
                  <select
                    value={taskForm.assigneeId}
                    onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.teamRole})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">PRIORITY</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MILESTONE</label>
                  <select
                    value={taskForm.milestoneId}
                    onChange={(e) => setTaskForm({ ...taskForm, milestoneId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    {milestones.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.milestoneCode}: {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">DUE DATE</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAILS MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {selectedTask.taskId}
                </span>
                {isEditingInModal ? (
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="mt-2 text-lg font-bold border border-slate-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedTask.title}</h2>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditingInModal ? (
                  <button
                    onClick={handleUpdateTask}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingInModal(true)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Edit
                  </button>
                )}
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* Status & Priority Control Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">STATUS:</span>
                  <select
                    value={isEditingInModal ? taskForm.status : selectedTask.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (isEditingInModal) {
                        setTaskForm({ ...taskForm, status: newStatus });
                      } else {
                        api.patch(`/tasks/${selectedTask.id}/status`, { status: newStatus }).then((res) => {
                          if (res.data?.success) {
                            setSelectedTask(res.data.data);
                            setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? res.data.data : t)));
                          }
                        });
                      }
                    }}
                    className="w-full text-xs font-semibold border border-slate-300 rounded px-2 py-1 bg-white text-slate-800"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="BLOCKED">BLOCKED</option>
                    <option value="IN_REVIEW">IN REVIEW</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-1">PRIORITY:</span>
                  {isEditingInModal ? (
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full text-xs font-semibold border border-slate-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  ) : (
                    <div className="font-bold text-slate-800 mt-1">{selectedTask.priority}</div>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-1">ASSIGNEE:</span>
                  {isEditingInModal ? (
                    <select
                      value={taskForm.assigneeId}
                      onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                      className="w-full text-xs font-medium border border-slate-300 rounded px-2 py-1 bg-white"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="font-semibold text-slate-800 mt-1">{selectedTask.assignee?.name}</div>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-1">PROGRESS:</span>
                  {isEditingInModal ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taskForm.progress}
                      onChange={(e) => setTaskForm({ ...taskForm, progress: Number(e.target.value) })}
                      className="w-full text-xs font-bold border border-slate-300 rounded px-2 py-1 bg-white"
                    />
                  ) : (
                    <div className="font-bold text-emerald-700 mt-1">{selectedTask.progress}%</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                {isEditingInModal ? (
                  <textarea
                    rows={3}
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedTask.description || 'No detailed description provided.'}
                  </p>
                )}
              </div>

              {/* Comments Section */}
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Comments ({taskComments.length})
                </h4>

                <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add an engineering update or review comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Post
                  </button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {taskComments.map((comment) => (
                    <div key={comment.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-700">{comment.author?.name || 'Member'}</span>
                        <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone: Delete */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Task
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
