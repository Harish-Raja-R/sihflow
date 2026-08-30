import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  Award,
  CheckCircle,
  Clock,
  CircleDashed,
  RefreshCw,
} from 'lucide-react';

export const SihReadinessPage: React.FC = () => {
  const [readinessData, setReadinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/readiness/sih');
      if (res.data?.success) {
        setReadinessData(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load SIH readiness');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.patch(`/readiness/sih/${id}`, { status: newStatus });
      if (res.data?.success) {
        setReadinessData((prev: any) => {
          const updatedItems = prev.items.map((item: any) =>
            item.id === id ? { ...item, status: newStatus } : item
          );
          const completedCount = updatedItems.filter((i: any) => i.status === 'Completed').length;
          const overallScore = Math.round((completedCount / updatedItems.length) * 100);

          return {
            ...prev,
            overallScore,
            items: updatedItems,
          };
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update item status');
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

  if (error || !readinessData) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <p className="font-semibold">{error || 'Readiness data unavailable'}</p>
          <button onClick={fetchReadiness} className="px-3 py-1.5 bg-white border border-red-300 rounded text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overallScore, statusLabel, items } = readinessData;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header & Overall Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">SIH Grand Finale Readiness Index</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Standard 9-category checklist evaluating AcadShield for SIH jury presentation.
          </p>
        </div>

        <button
          onClick={fetchReadiness}
          title="Refresh score"
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Score Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OVERALL READINESS SCORE</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900">{overallScore}%</span>
            <Badge variant={overallScore >= 80 ? 'success' : 'warning'}>{statusLabel}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {items.filter((i: any) => i.status === 'Completed').length} of {items.length} categories completed
          </p>
        </div>

        <div className="w-full md:w-64">
          <ProgressBar progress={overallScore} variant="emerald" />
        </div>
      </div>

      {/* 9-Category Checklist */}
      <div className="space-y-3">
        {items?.map((item: any) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-sm text-slate-900">{item.category}</h3>
                <Badge
                  variant={
                    item.status === 'Completed'
                      ? 'success'
                      : item.status === 'In Progress'
                      ? 'info'
                      : 'default'
                  }
                >
                  {item.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{item.description}</p>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={item.status}
                onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                className="text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
