import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import {
  Activity,
  CheckCircle,
  AlertOctagon,
  FileText,
  Calendar,
  Zap,
  RefreshCw,
  Clock,
  User,
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/activity');
      if (res.data?.success) {
        setActivities(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load activity stream');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'TASK_COMPLETED':
      case 'TESTS_PASSED':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'BLOCKER_REPORTED':
      case 'BLOCKER_RAISED':
        return <AlertOctagon className="w-4 h-4 text-amber-600" />;
      case 'DOCUMENT_UPLOADED':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'MEETING_SCHEDULED':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Zap className="w-4 h-4 text-slate-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Live Team Activity</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time audit log of team actions, task progressions, and blocker events.
          </p>
        </div>

        <button
          onClick={fetchActivities}
          title="Refresh Feed"
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {activities.length > 0 ? (
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline Dot / Icon */}
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {getEventIcon(act.eventType)}
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {act.user?.name || 'Team Member'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(act.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {act.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No activity recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
