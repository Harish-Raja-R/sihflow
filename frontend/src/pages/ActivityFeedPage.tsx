import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { apiClient } from '../services/api';
import { ActivityLog } from '../types';
import { Card } from '../components/common/Card';

export const ActivityFeedPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await apiClient.getActivities();
        setActivities(data);
      } catch (e) {
        console.error('Failed to load activity feed:', e);
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading real-time activity stream...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-600" />
          <span>Audit Log & Real-Time Activity Feed</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Chronological audit trail of all task mutations, status transitions, test runs, and GitHub commits.
        </p>
      </div>

      {/* Activity Timeline List */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors text-xs"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{act.summary}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(act.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                  <span>
                    Actor: <strong className="text-slate-700">{act.user?.name || 'System Automated'}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-mono uppercase text-emerald-700 font-semibold">{act.entityType}</span>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-xs text-slate-400 py-6 text-center">No activity recorded yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
