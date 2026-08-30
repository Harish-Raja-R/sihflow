import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Sparkles, CheckCircle2, Play, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DemoReadinessPage: React.FC = () => {
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDemo = async () => {
    try {
      const res = await apiClient.get('/readiness/demo-checklist');
      if (res.data?.success) {
        setChecklist(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemo();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/readiness/demo-checklist/${id}`, { status });
      fetchDemo();
    } catch (e) {
      console.error(e);
    }
  };

  const items = checklist?.items || [];
  const stats = checklist?.stats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Jury Demo Script & Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            5 end-to-end user journeys executed live during the 10-minute SIH Grand Finale jury evaluation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500 uppercase">Demo Reliability</div>
            <div className="text-2xl font-black text-emerald-600">{stats.readyPercentage || 80}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Demo Checklist Table */}
      <Card bodyClassName="p-0">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading demo checklist...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Step & Scenario</th>
                  <th className="px-4 py-3">Description & Expected Live Behavior</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-slate-900">{item.itemCode}</div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Category: {item.category}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-md">
                      <div className="text-slate-700 text-xs">{item.description}</div>
                      <div className="text-[11px] text-emerald-800 font-mono mt-1 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                        Expected: {item.expectedResult}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          item.status === 'PASS'
                            ? 'success'
                            : item.status === 'FAIL'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-white font-medium text-slate-700 focus:outline-none"
                      >
                        <option value="PASS">PASS (Verified)</option>
                        <option value="FAIL">FAIL</option>
                        <option value="NOT_TESTED">NOT TESTED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
