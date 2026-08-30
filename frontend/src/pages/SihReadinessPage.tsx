import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../services/api';
import { ReadinessItem } from '../types';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';

export const SihReadinessPage: React.FC = () => {
  const [data, setData] = useState<{
    overallScore: number;
    statusLabel: string;
    items: ReadinessItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      const res = await apiClient.getSihReadiness();
      setData(res);
    } catch (e) {
      console.error('Failed to load SIH readiness report:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleUpdateItem = async (id: string, progress: number) => {
    try {
      await apiClient.updateReadinessItem(id, {
        progress,
        status: progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      });
      loadReport();
    } catch (e) {
      console.error('Failed to update readiness item:', e);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Evaluating SIH Grand Finale Readiness Index...</span>
      </div>
    );
  }

  // Group items by category
  const categories = Array.from(new Set(data.items.map((i) => i.category)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono mb-1">
            <Award className="w-4 h-4" />
            <span>Grand Finale Evaluation Index</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SIH Hackathon Readiness Score
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Comprehensive evaluation matrix verifying 14 hackathon deliverables across architecture, security, and presentation.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-200">
          <div className="text-right">
            <div className="text-[10px] text-emerald-800 uppercase font-mono font-bold">Readiness Score</div>
            <div className="text-3xl font-black text-emerald-700 font-mono">{data.overallScore}%</div>
          </div>
          <div className="px-3 py-1 bg-white rounded-lg border border-emerald-200 text-xs font-bold text-emerald-700">
            {data.statusLabel}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categoryItems = data.items.filter((i) => i.category === category);
          const avgProgress = Math.round(
            categoryItems.reduce((acc, curr) => acc + curr.progress, 0) / categoryItems.length
          );

          return (
            <Card key={category} className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">{category}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700">{avgProgress}%</span>
              </div>

              <ProgressBar progress={avgProgress} size="sm" />

              <div className="space-y-2 pt-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {item.progress === 100 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-600 font-bold">{item.progress}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug pl-6">{item.description}</p>
                    {item.evidence && (
                      <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 pl-2">
                        <strong>Evidence:</strong> {item.evidence}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
