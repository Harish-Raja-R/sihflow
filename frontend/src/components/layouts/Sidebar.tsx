import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CheckSquare,
  Kanban,
  Flag,
  Zap,
  AlertOctagon,
  Users,
  Activity,
  Github,
  Calendar,
  FileText,
  ShieldAlert,
  Bug,
  TestTube,
  Award,
  PlayCircle,
  BarChart3,
  FileSpreadsheet,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  alert?: boolean;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const navSections: NavSection[] = [
    {
      title: 'MISSION CONTROL',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Team Lead Center', path: '/lead-center', icon: Compass, badge: 'Lead' },
      ],
    },
    {
      title: 'PROJECT EXECUTION',
      items: [
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Kanban Board', path: '/board', icon: Kanban },
        { name: 'Milestones (M1-M11)', path: '/milestones', icon: Flag },
        { name: 'Sprints & Velocity', path: '/sprints', icon: Zap },
        { name: 'Active Blockers', path: '/blockers', icon: AlertOctagon, alert: true },
      ],
    },
    {
      title: 'COLLABORATION',
      items: [
        { name: '6-Member Team', path: '/team', icon: Users },
        { name: 'Team Activity Feed', path: '/activity', icon: Activity },
        { name: 'Team Meetings', path: '/meetings', icon: Calendar },
      ],
    },
    {
      title: 'DEV & QUALITY',
      items: [
        { name: 'GitHub Hub', path: '/github', icon: Github },
        { name: 'Documents & SRS', path: '/documents', icon: FileText },
        { name: 'Risk Management', path: '/risks', icon: ShieldAlert },
        { name: 'Bug Tracker', path: '/bugs', icon: Bug },
        { name: 'Testing & QA', path: '/testing', icon: TestTube },
      ],
    },
    {
      title: 'SIH READINESS',
      items: [
        { name: 'SIH Readiness', path: '/sih-readiness', icon: Award, highlight: true },
        { name: 'Live Demo Checklist', path: '/demo-readiness', icon: PlayCircle, highlight: true },
        { name: 'Contribution Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Reports & Export', path: '/reports', icon: FileSpreadsheet },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1">
            SihFlow <span className="text-emerald-600">ERP</span>
          </h1>
          <div className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold">
            ACADSHIELD TEAM
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 group',
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )
                  }
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded font-mono uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-slate-800">Target Project</span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">SIH 2026</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">AcadShield (Blockchain)</p>
        </div>
      </div>
    </aside>
  );
};
