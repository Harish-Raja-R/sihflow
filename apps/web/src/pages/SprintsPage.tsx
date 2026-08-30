import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Zap, Calendar, Target, CheckCircle2 } from 'lucide-react';

export const SprintsPage: React.FC = () => {
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSprints() {
      try {
        const res = await apiClient.get('/sprints');
        if (res.data?.success) {
          setSprints(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSprints();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Sprint Planner</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Sprint execution cycles, goals, velocity, and task burn-up for AcadShield development
        </p>
      </div>

      {/* Sprints List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading sprints...</div>
      ) : (
        <div className="space-y-6">
          {sprints.map((s) => (
            <Card key={s.id}>
              <div className="space-y-4">
                {/* Sprint Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-sm font-bold text-slate-900">{s.name}</h2>
                    <Badge
                      variant={
                        s.status === 'COMPLETED'
                          ? 'success'
                          : s.status === 'ACTIVE'
                          ? 'info'
                          : 'default'
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      Velocity: <span className="font-bold text-slate-800">{s.velocity} pts</span>
                    </div>
                  </div>
                </div>

                {/* Sprint Goal */}
                <div className="flex items-start gap-2 text-xs bg-slate-50 p-3 rounded-lg">
                  <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Sprint Goal: </span>
                    <span className="text-slate-600">{s.goal}</span>
                  </div>
                </div>

                {/* Progress & Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white border border-slate-200/70 rounded-lg text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Deliverables</div>
                    <div className="text-lg font-black text-slate-800 mt-0.5">{s.totalTasks}</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200/70 rounded-lg text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Completed</div>
                    <div className="text-lg font-black text-emerald-600 mt-0.5">{s.completedTasks}</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200/70 rounded-lg text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">In Progress</div>
                    <div className="text-lg font-black text-blue-600 mt-0.5">{s.inProgressTasks}</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200/70 rounded-lg text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Blocked</div>
                    <div className="text-lg font-black text-amber-600 mt-0.5">{s.blockedTasks}</div>
                  </div>
                </div>

                <div>
                  <ProgressBar value={s.progress} showLabel={true} height="md" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
