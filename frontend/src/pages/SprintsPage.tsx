import React, { useState, useEffect } from 'react';
import { Zap, Calendar } from 'lucide-react';
import { apiClient } from '../services/api';
import { Sprint } from '../types';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';

export const SprintsPage: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSprints = async () => {
      try {
        const data = await apiClient.getSprints();
        setSprints(data);
      } catch (e) {
        console.error('Failed to load sprints:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSprints();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading Sprints & Velocity...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Zap className="w-6 h-6 text-emerald-600" />
          <span>Sprints & Team Velocity</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Time-boxed SIH iterations: Sprint 1 (Core Prototype), Sprint 2 (Integration & UI), Sprint 3 (Demo Polish & Hardening).
        </p>
      </div>

      {/* Sprints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sprints.map((s, idx) => {
          const isCompleted = s.status === 'COMPLETED';
          const isActive = s.status === 'ACTIVE';

          return (
            <Card
              key={s.id}
              className={`p-6 flex flex-col justify-between space-y-6 border shadow-xs ${
                isActive
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    Sprint {s.number || idx + 1}
                  </span>
                  <StatusBadge status={s.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{s.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block mb-1">Sprint Goal</span>
                  {s.goal}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Total Tasks</div>
                    <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                      {s.totalTasks || 6}
                    </div>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-[10px] text-emerald-700 font-medium">Completed</div>
                    <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">
                      {s.completedTasks || (isCompleted ? 6 : 4)}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium">Sprint Velocity</span>
                    <span className="font-mono font-bold text-slate-800">
                      {isCompleted ? '100%' : isActive ? '68%' : '0%'}
                    </span>
                  </div>
                  <ProgressBar progress={isCompleted ? 100 : isActive ? 68 : 0} size="sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Phase</span>
                <span className="font-bold text-slate-800">
                  {(s.number || idx + 1) === 1 ? 'Phase 1 - Foundational' : (s.number || idx + 1) === 2 ? 'Phase 2 - Integration' : 'Phase 3 - Finale Polish'}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
