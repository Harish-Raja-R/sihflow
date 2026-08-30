import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../stores/AuthContext';
import {
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  User,
} from 'lucide-react';
import { api } from '../../api/client';

export const Header: React.FC = () => {
  const { user, isLead, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get('/notifications');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setNotifications(res.data.data);
          setUnreadCount(res.data.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {
        setNotifications([
          { id: '1', title: 'Blocker Alert', message: 'BLK-001 is active on Hyperledger Adapter', type: 'WARNING', isRead: false },
          { id: '2', title: 'SIH Readiness', message: 'Readiness Index at 86% (Grand Finale Ready)', type: 'SUCCESS', isRead: false },
        ]);
        setUnreadCount(2);
      }
    }
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left Project / Context Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-md">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-900 tracking-wide">SIH #1422: AcadShield</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sprint 2 Active</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">6 Developers Assigned</span>
        </div>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-emerald-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 ${!n.isRead ? 'bg-emerald-50/30' : ''}`}>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-0.5">
                      {n.type === 'WARNING' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      ) : n.type === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <span>{n.title}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Chip & Dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5">
                <span>{user?.name || 'Member 1'}</span>
                {isLead && (
                  <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Lead
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">{user?.teamRole || 'Team Lead'}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'M1'}
            </div>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{user?.name || 'Member 1'}</div>
                <div className="text-slate-500 text-[11px]">{user?.email || 'lead@sihflow.io'}</div>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" /> Account Settings
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
