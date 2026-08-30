import React from 'react';
import { Task } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { GitPullRequest, CheckSquare, User as UserIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => Promise<void>;
  onAddTask?: () => void;
}

const COLUMNS = [
  { id: 'BACKLOG', label: 'BACKLOG', color: 'border-slate-300' },
  { id: 'TODO', label: 'TODO', color: 'border-amber-400' },
  { id: 'IN_PROGRESS', label: 'IN PROGRESS', color: 'border-blue-400' },
  { id: 'BLOCKED', label: 'BLOCKED', color: 'border-rose-400' },
  { id: 'IN_REVIEW', label: 'IN REVIEW', color: 'border-purple-400' },
  { id: 'COMPLETED', label: 'DONE', color: 'border-emerald-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onStatusChange, onAddTask }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex flex-col bg-slate-100/70 rounded-xl border border-slate-200/80 p-3 min-w-[260px] min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b-2 ${col.color}`}>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-slate-700 rounded-full border border-slate-200 shadow-2xs">
                  {colTasks.length}
                </span>
              </div>
              {col.id === 'TODO' && onAddTask && (
                <button
                  onClick={onAddTask}
                  className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task Cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
              {colTasks.map((task) => {
                const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
                const totalSubtasks = task.subtasks?.length || 0;

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('taskId', task.id);
                    }}
                    className="p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing shadow-xs group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-700">
                        {task.taskId}
                      </span>
                      <PriorityBadge priority={task.priority} showIcon={false} />
                    </div>

                    <Link to={`/tasks/${task.id}`} className="block group-hover:text-emerald-700">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug mb-2">
                        {task.title}
                      </h4>
                    </Link>

                    {/* Meta Row */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        {task.assignee ? (
                          <div className="flex items-center space-x-1" title={task.assignee.name}>
                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-700 overflow-hidden font-bold">
                              {task.assignee.avatarUrl ? (
                                <img src={task.assignee.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                task.assignee.name.charAt(0)
                              )}
                            </div>
                          </div>
                        ) : (
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        )}

                        {totalSubtasks > 0 && (
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                            <CheckSquare className="w-3 h-3 text-slate-400" />
                            <span>
                              {completedSubtasks}/{totalSubtasks}
                            </span>
                          </div>
                        )}
                      </div>

                      {task.githubPrNumber && (
                        <div className="flex items-center space-x-0.5 text-purple-700 font-mono text-[10px] font-semibold">
                          <GitPullRequest className="w-3 h-3" />
                          <span>#{task.githubPrNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="h-24 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
