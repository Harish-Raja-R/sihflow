import React, { useState } from 'react';
import { useAuth } from '../stores/AuthContext';
import { Badge } from '../components/common/Badge';
import {
  Settings,
  User,
  Shield,
  Bell,
  Save,
  CheckCircle,
  Moon,
  Sun,
  Database,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState(user?.name || 'Member 1');
  const [notifications, setNotifications] = useState({
    blockerAlerts: true,
    taskAssignments: true,
    standupReminders: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-800" />
          <h1 className="text-2xl font-bold text-slate-900">ERP System & Profile Settings</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account profile, role preferences, and notification triggers.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-base text-slate-900">User Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">DISPLAY NAME</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                disabled
                value={user?.email || 'lead@sihflow.io'}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">SYSTEM ROLE</label>
              <div className="mt-1">
                <Badge variant={user?.role === 'TEAM_LEAD' ? 'warning' : 'info'}>
                  {user?.role || 'TEAM_LEAD'}
                </Badge>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">TEAM ASSIGNMENT</label>
              <div className="mt-1 font-semibold text-slate-800 text-xs">
                {user?.teamRole || 'Team Lead / Integration'}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-base text-slate-900">Notification Alerts</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Critical Blocker Notifications</span>
                <span className="text-slate-500">Alert team lead immediately when high/critical blockers are logged</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.blockerAlerts}
                onChange={(e) => setNotifications({ ...notifications, blockerAlerts: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Task Assignment Updates</span>
                <span className="text-slate-500">Notify developer when a new sprint task is assigned</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.taskAssignments}
                onChange={(e) => setNotifications({ ...notifications, taskAssignments: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Daily Standup Reminders</span>
                <span className="text-slate-500">Broadcast meeting calendar invites before morning standup</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.standupReminders}
                onChange={(e) => setNotifications({ ...notifications, standupReminders: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Database & Runtime Diagnostics */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-base text-slate-900">Runtime Environment</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-bold block">BACKEND API:</span>
              <span className="font-mono text-slate-800 font-bold mt-1 block">/api/v1/</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-bold block">TARGET PROJECT:</span>
              <span className="font-semibold text-slate-800 mt-1 block">AcadShield (#1422)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-bold block">UI THEME:</span>
              <span className="font-semibold text-emerald-700 mt-1 block">Clean Light Theme</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-bold block">VERSION:</span>
              <span className="font-bold text-slate-800 mt-1 block">SihFlow v2.0</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
