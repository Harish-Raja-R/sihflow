import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import {
  Kanban,
  Plus,
  MoveRight,
  User,
  Calendar,
  AlertOctagon,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', label: 'TODO', bg: 'bg-slate-100/70', badge: 'default' },
  { id: 'IN_PROGRESS', label: 'IN PROGRESS', bg: 'bg-blue-50/70', badge: 'info' },
  { id: 'BLOCKED', label: 'BLOCKED', bg: 'bg-amber-50/70', badge: 'warning' },
  { id: 'IN_REVIEW', label: 'IN REVIEW', bg: 'bg-purple-50/70', badge: 'info' },
  { id: 'DONE', label: 'DONE', bg: 'bg-emerald-50/70', badge: 'success' },
];

export const BoardPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/tasks');
      if (res.data?.success) {
        setTasks(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load task board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId') || draggingTaskId;
    setDraggingTaskId(null);

    if (!taskId) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId || t.taskId === taskId ? { ...t, status: targetStatus } : t
      )
    );

    // Persist to backend
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: targetStatus });
    } catch (err) {
      console.error('Failed to persist task move:', err);
      fetchTasks(); // Revert on failure
    }
  };

  const handleQuickMove = async (taskId: string, targetStatus: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId || t.taskId === taskId ? { ...t, status: targetStatus } : t
      )
    );

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: targetStatus });
    } catch (err) {
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-xl animate-pulse" />
          ))}
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
            <Kanban className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Kanban Task Board</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Drag and drop task cards across columns. Moves are persisted instantly to the database.
          </p>
        </div>

        <button
          onClick={fetchTasks}
          title="Refresh board"
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id || (col.id === 'DONE' && t.status === 'COMPLETED'));

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-slate-100/60 rounded-xl p-3.5 border border-slate-200/80 min-h-[520px] flex flex-col justify-between"
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 tracking-wider uppercase">{col.label}</span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600">{task.taskId}</span>
                        <Badge
                          variant={task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'default'}
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 leading-snug">{task.title}</h4>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> {task.assignee?.name || 'Unassigned'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {task.dueDate || '09/10'}
                        </span>
                      </div>

                      {/* Quick Move Dropdown */}
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Move:</span>
                        <select
                          value={col.id}
                          onChange={(e) => handleQuickMove(task.id, e.target.value)}
                          className="border border-slate-200 rounded px-1.5 py-0.5 text-[10px] bg-slate-50 text-slate-700 font-medium"
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="BLOCKED">BLOCKED</option>
                          <option value="IN_REVIEW">IN REVIEW</option>
                          <option value="DONE">DONE</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-medium">
                      Drop cards here
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
