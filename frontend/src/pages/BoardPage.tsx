import React, { useState, useEffect } from 'react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { apiClient } from '../services/api';
import { Task } from '../types';
import { Kanban } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BoardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const data = await apiClient.getTasks();
      setTasks(data);
    } catch (e) {
      console.error('Failed to load board tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await apiClient.updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading Kanban Board...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-emerald-600" />
            <span>Interactive Kanban Board</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Drag and drop task cards across sprint workflow stages. Real-time activity is automatically updated.
          </p>
        </div>

        <Link
          to="/tasks"
          className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
        >
          View Table Mode
        </Link>
      </div>

      {/* Kanban Board Grid */}
      <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
};
