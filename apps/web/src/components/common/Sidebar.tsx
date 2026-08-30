import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  CheckSquare,
  Kanban,
  Milestone,
  Activity,
  AlertOctagon,
  GitBranch,
  Calendar,
  FileText,
  CheckCircle,
  BarChart3,
  Award,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/team', label: 'Team', icon: Users },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/board', label: 'Board', icon: Kanban },
    { to: '/milestones', label: 'Milestones', icon: Milestone },
    { to: '/activity', label: 'Activity', icon: Activity },
    { to: '/blockers', label: 'Blockers', icon: AlertOctagon },
    { to: '/github', label: 'GitHub', icon: GitBranch },
    { to: '/meetings', label: 'Meetings', icon: Calendar },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/testing', label: 'Testing', icon: CheckCircle },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/sih-readiness', label: 'SIH Readiness', icon: Award },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          SF
        </div>
        <div>
          <div className="font-bold text-sm text-slate-900 leading-tight">
            SihFlow ERP
          </div>
          <p className="text-[11px] text-slate-500 font-medium">SIH 2026 Team Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs border border-emerald-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>Project:</span>
          <span className="font-semibold text-slate-700">AcadShield</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          SIH Problem #1422
        </div>
      </div>
    </aside>
  );
};
