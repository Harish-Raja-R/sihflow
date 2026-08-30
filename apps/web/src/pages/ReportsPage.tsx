import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { FileBarChart, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await apiClient.get('/reports');
      if (res.data?.success) {
        setReports(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await apiClient.post('/reports/generate', { reportType: 'SIH_EXECUTIVE_SUMMARY' });
      await fetchReports();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Executive SIH Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured evaluation dossiers, technical summaries, and compliance reports for SIH mentors & jury
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <FileBarChart className="w-4 h-4" />
          <span>{generating ? 'Compiling Dossier...' : 'Generate New Dossier'}</span>
        </button>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading reports...</div>
      ) : (
        <div className="space-y-6">
          {reports.map((r, idx) => (
            <Card key={idx}>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                    <Badge variant="success">READY</Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Generated: {new Date(r.generatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Target Project</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{r.project}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Tasks</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{r.metrics?.totalTasks}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Completion</div>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">{r.metrics?.completionRate}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</div>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">{r.metrics?.readinessScore}%</div>
                  </div>
                </div>

                {/* Gates */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2">Jury Evaluation Gates:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {r.evaluationGates?.map((g: any, gIdx: number) => (
                      <div
                        key={gIdx}
                        className="flex items-center justify-between p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs"
                      >
                        <span className="font-semibold text-slate-800">{g.name}</span>
                        <Badge variant="success">{g.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
