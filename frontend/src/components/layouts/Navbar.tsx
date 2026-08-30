import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Bot,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { NotificationItem } from '../../types';

interface NavbarProps {
  onOpenAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAi }) => {
  const { user, switchRole } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const members = [
    { name: 'Harish R', email: 'lead@sihflow.io', role: 'TEAM LEAD', tag: 'Architect & Lead' },
    { name: 'Vikas Sharma', email: 'blockchain@sihflow.io', role: 'BLOCKCHAIN ENGINEER', tag: 'Smart Contracts' },
    { name: 'Ananya Roy', email: 'security@sihflow.io', role: 'IDENTITY + SECURITY', tag: 'DID & Fraud' },
    { name: 'Rohan Patel', email: 'backend@sihflow.io', role: 'BACKEND ENGINEER', tag: 'APIs & DB' },
    { name: 'Sneha Kulkarni', email: 'frontend@sihflow.io', role: 'FRONTEND ENGINEER', tag: 'UI & Wallet' },
    { name: 'Kavya Nair', email: 'qa@sihflow.io', role: 'QA + UI/UX + DOCS', tag: 'Testing & SRS' },
  ];

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const notifs = await apiClient.getNotifications();
        setNotifications(notifs);
      } catch (e) {
        // Fallback
      }
    };
    fetchNotifs();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between">
      {/* Search Input */}
      <div className="flex items-center w-80 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, milestones, PRs, docs..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-colors"
        />
      </div>

      {/* Action Controls & User Switcher */}
      <div className="flex items-center space-x-3">
        {/* Linked Project External Repo */}
        <a
          href="https://github.com/vishanth11/AcadShield"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <span>vishanth11/AcadShield</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAi}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all text-xs font-semibold shadow-xs"
        >
          <Bot className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">AI Assistant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                <button
                  onClick={async () => {
                    await apiClient.markAllNotificationsRead();
                    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                  }}
                  className="text-[11px] text-emerald-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-slate-400 text-center">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                        !notif.isRead ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <p className="font-semibold text-slate-800">{notif.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 6-Member Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleModal(!showRoleModal)}
            className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none">{user?.name}</div>
              <div className="text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
                {user?.teamRole}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleModal && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Switch Active SIH Member
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Instant one-click role preview
                </div>
              </div>
              <div className="p-1.5 space-y-0.5">
                {members.map((m) => {
                  const isCurrent = user?.email === m.email;
                  return (
                    <button
                      key={m.email}
                      onClick={async () => {
                        await switchRole(m.email);
                        setShowRoleModal(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{m.name}</div>
                        <div className="text-[10px] text-slate-500">{m.role}</div>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
