import React, { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '../services/api';
import { DemoChecklistItem } from '../types';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';

export const DemoReadinessPage: React.FC = () => {
  const [data, setData] = useState<{
    items: DemoChecklistItem[];
    stats: {
      total: number;
      passed: number;
      failed: number;
      notTested: number;
      readyPercentage: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDemo = async () => {
    try {
      const res = await apiClient.getDemoChecklist();
      setData(res);
    } catch (e) {
      console.error('Failed to load demo checklist:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemo();
  }, []);

  const handleToggleItem = async (itemId: string, status: 'PASS' | 'FAIL' | 'NOT_TESTED') => {
    try {
      await apiClient.updateDemoChecklistItem(itemId, status, 'Validated in rehearsal session');
      loadDemo();
    } catch (e) {
      console.error('Failed to update demo checklist item:', e);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading live demo verification checklist...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono mb-1">
            <PlayCircle className="w-4 h-4" />
            <span>Jury Demonstration Gate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Demo Readiness Checklist
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Rehearse and verify every live step of the AcadShield demo: Issuer Issuance, Tamper Detection, QR Verification, DID Resolution, and IPFS fallbacks.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-200">
          <div className="text-right">
            <div className="text-[10px] text-emerald-800 uppercase font-mono font-bold">Passed Scenarios</div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {data.stats.passed} / {data.stats.total}
            </div>
          </div>
          <div className="text-sm font-bold text-emerald-700 font-mono">{data.stats.readyPercentage}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 bg-white border-slate-200 space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">Demo Scenario Readiness Progress</span>
          <span className="font-mono font-bold text-slate-800">{data.stats.readyPercentage}%</span>
        </div>
        <ProgressBar progress={data.stats.readyPercentage} size="md" color="emerald" />
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {data.items.map((item) => {
          const isPass = item.status === 'PASS';
          const isFail = item.status === 'FAIL';

          return (
            <Card
              key={item.id}
              className={`p-4 flex items-center justify-between border shadow-xs transition-all ${
                isPass
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isFail
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <button
                  onClick={() => handleToggleItem(item.id, isPass ? 'NOT_TESTED' : 'PASS')}
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    isPass
                      ? 'bg-emerald-600 text-white'
                      : isFail
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-300 text-transparent hover:border-emerald-500'
                  }`}
                >
                  {isPass ? <CheckCircle2 className="w-4 h-4" /> : isFail ? <XCircle className="w-4 h-4" /> : null}
                </button>

                <div>
                  <h3 className={`text-xs sm:text-sm font-bold ${isPass ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {item.itemCode}: {item.title || item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  {item.expectedResult && (
                    <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">
                      Expected: {item.expectedResult}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                  {item.category || 'DEMO'}
                </span>

                <button
                  onClick={() => handleToggleItem(item.id, isPass ? 'NOT_TESTED' : 'PASS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isPass
                      ? 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {isPass ? 'Mark Pending' : 'Verify Scenario'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
