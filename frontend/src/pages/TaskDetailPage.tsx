import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckSquare,
  Github,
  MessageSquare,
  Plus,
  ShieldCheck,
  GitPullRequest,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { Task } from '../types';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { useAuth } from '../context/AuthContext';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isReviewer } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const loadTask = async () => {
    if (!id) return;
    try {
      const data = await apiClient.getTaskById(id);
      setTask(data);
    } catch (e) {
      console.error('Failed to load task detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!id) return;
    try {
      await apiClient.updateTaskStatus(id, status);
      loadTask();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newSubtaskTitle.trim()) return;
    try {
      await apiClient.addSubtask(id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      loadTask();
    } catch (e) {
      console.error('Failed to add subtask:', e);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      await apiClient.toggleSubtask(subtaskId, completed);
      loadTask();
    } catch (e) {
      console.error('Failed to toggle subtask:', e);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;
    try {
      await apiClient.addTaskComment(id, newComment.trim());
      setNewComment('');
      loadTask();
    } catch (e) {
      console.error('Failed to add comment:', e);
    }
  };

  if (loading || !task) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading task details...</span>
      </div>
    );
  }

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link to="/tasks" className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-emerald-700 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tasks</span>
      </Link>

      {/* Task Header Card */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold font-mono text-emerald-800 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
              {task.taskId}
            </span>
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          {/* Quick Status Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-semibold">Change Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
            >
              <option value="BACKLOG">BACKLOG</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="IN_REVIEW">IN REVIEW</option>
              <option value="COMPLETED">DONE</option>
            </select>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900">{task.title}</h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {task.description}
        </p>

        {/* Review Approval Bar if in review */}
        {task.status === 'IN_REVIEW' && isReviewer && (
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-purple-900 font-medium">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>This task is awaiting code/technical review. As Reviewer/Lead, you can approve completion.</span>
            </div>
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Approve & Complete
            </button>
          </div>
        )}

        {/* Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Assignee</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{task.assignee?.name || 'Unassigned'}</span>
            <span className="text-[11px] text-emerald-700 font-medium">{task.assignee?.teamRole}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Workstream</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{task.workstream?.code}</span>
            <span className="text-[11px] text-slate-500 truncate block">{task.workstream?.name}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Milestone</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{task.milestone?.milestoneCode}</span>
            <span className="text-[11px] text-slate-500 truncate block">{task.milestone?.name}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Due Date</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
            </span>
            <span className="text-[11px] text-slate-500">Est: {task.estimatedHours} hrs</span>
          </div>
        </div>
      </Card>

      {/* Two Columns: Subtasks & GitHub Links / Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SUBTASKS CHECKLIST */}
        <Card className="p-5 bg-white border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700">{task.progress}%</span>
          </div>

          <ProgressBar progress={task.progress} size="sm" />

          {/* Subtask list */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {task.subtasks?.map((sub) => (
              <label
                key={sub.id}
                className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 cursor-pointer text-xs transition-colors"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={(e) => handleToggleSubtask(sub.id, e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-white border-slate-300"
                />
                <span className={sub.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-medium'}>
                  {sub.title}
                </span>
              </label>
            ))}
          </div>

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtask} className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add next subtask..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim()}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </Card>

        {/* GITHUB LINK */}
        <div className="space-y-6">
          <Card className="p-5 bg-white border-slate-200 space-y-3">
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Linked GitHub References
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Branch</span>
                <span className="font-mono text-emerald-700 font-bold">{task.githubBranch || 'main'}</span>
              </div>

              {task.githubPrNumber && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Pull Request</span>
                  <a
                    href={`https://github.com/vishanth11/AcadShield/pull/${task.githubPrNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-purple-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    #{task.githubPrNumber}
                  </a>
                </div>
              )}

              {task.githubIssueNumber && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Issue</span>
                  <a
                    href={`https://github.com/vishanth11/AcadShield/issues/${task.githubIssueNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-amber-700 font-bold hover:underline"
                  >
                    #{task.githubIssueNumber}
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* DISCUSSION & COMMENTS */}
      <Card className="p-6 bg-white border-slate-200 space-y-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Task Discussion & Activity ({task.comments?.length || 0})
          </h3>
        </div>

        {/* Comment List */}
        <div className="space-y-3">
          {task.comments?.map((c) => (
            <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{c.user.name} ({c.user.teamRole})</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{c.comment}</p>
            </div>
          ))}

          {(!task.comments || task.comments.length === 0) && (
            <div className="text-xs text-slate-400 py-3 text-center">No comments yet. Start the discussion below.</div>
          )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-3 border-t border-slate-100">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment or status update..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            Post
          </button>
        </form>
      </Card>
    </div>
  );
};
