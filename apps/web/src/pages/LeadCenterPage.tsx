import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  Crown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  GitPullRequest,
  Send,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  RotateCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LeadCenterPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeadData = async () => {
    try {
      const res = await apiClient.get('/analytics/dashboard');
      if (res.data?.success) {
        setDashboardData(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, []);

  const handleAiAsk = async (queryText?: string) => {
    const q = queryText || aiQuery;
    if (!q.trim()) return;

    setAiLoading(true);
    try {
      const res = await apiClient.post('/ai/query', { query: q });
      if (res.data?.success) {
        setAiResponse(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleQuickResolveBlocker = async (blockerId: string) => {
    try {
      await apiClient.patch(`/blockers/${blockerId}/resolve`, {
        resolutionNotes: 'Resolved by Team Lead from Mission Control.',
      });
      fetchLeadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 text-sm">
        Loading Team Lead Mission Control...
      </div>
    );
  }

  const urgent = dashboardData?.urgent || {};
  const activeBlockers = dashboardData?.activeBlockers || [];

  return (
    <div className="space-y-6">
      {/* Lead Command Header */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
                Team Lead Mission Control
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Project Steering & Risk Governance</h1>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
              Real-time bottleneck resolution, architectural decision log, AI project assistant, and SIH jury demo readiness controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeadData}
              className="px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-xs font-semibold rounded-lg border border-emerald-700/60 transition-colors flex items-center gap-1.5 text-white"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh Telemetry</span>
            </button>
            <Link
              to="/reports"
              className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-extrabold rounded-lg transition-colors shadow-sm"
            >
              Generate Jury Brief
            </Link>
          </div>
        </div>
      </div>

      {/* Urgent Attention Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Critical Blockers</div>
          <div className={`text-2xl font-black mt-1 ${activeBlockers.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {activeBlockers.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires immediate unblock</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Awaiting Lead Review</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{urgent.pendingReviewsCount || 2}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pull requests in review queue</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">SIH Evaluation Score</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {dashboardData?.sihReadiness?.score || 88}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Grand Finale Benchmark</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Open Defects (QA)</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{urgent.openBugsCount || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Reported by QA (Member 6)</div>
        </div>
      </div>

      {/* AI Lead Copilot */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">SihFlow AI Copilot (Ground Truth Grounded)</span>
          </div>
        }
        subtitle="Ask complex architectural, blocker, or team assignment questions based on live database state"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 'What is delaying us?', 'Who is blocked right now?', 'Summarize today\'s priorities'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
              className="flex-1 text-xs border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleAiAsk()}
              disabled={aiLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {aiLoading ? (
                <span>Thinking...</span>
              ) : (
                <>
                  <span>Ask Copilot</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              'What is delaying us?',
              'Who is blocked right now?',
              "Today's recommended priorities",
              'SIH Grand Finale readiness gap',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAiQuery(prompt);
                  handleAiAsk(prompt);
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Copilot Answer Display */}
          {aiResponse && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-3">
              <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {aiResponse.answer}
              </div>
              {aiResponse.suggestedActions?.length > 0 && (
                <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-900">Suggested Lead Actions:</span>
                  {aiResponse.suggestedActions.map((act: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 rounded font-semibold"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Lead Decision Tables: Blockers & Code Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocker Action Center */}
        <Card
          title="Active Blocker Triage"
          subtitle="One-click resolution for lead unblocking"
          action={
            <Link to="/blockers" className="text-xs text-emerald-600 font-semibold hover:underline">
              Blocker Hub
            </Link>
          }
        >
          {activeBlockers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              ✅ All blockers have been resolved!
            </div>
          ) : (
            <div className="space-y-3">
              {activeBlockers.map((b: any) => (
                <div
                  key={b.id}
                  className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900">{b.blockerId}</span>
                      <Badge variant="warning">{b.priority}</Badge>
                    </div>
                    <div className="font-semibold text-slate-900">{b.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Reporter: <span className="font-medium text-slate-700">{b.reporter}</span> • Impact on critical path
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickResolveBlocker(b.id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded transition-colors shrink-0"
                  >
                    Quick Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* PR & Architecture Review Queue */}
        <Card
          title="Awaiting Lead Review Queue"
          subtitle="Feature branches pending integration into develop"
          action={
            <Link to="/github" className="text-xs text-emerald-600 font-semibold hover:underline">
              GitHub Sync
            </Link>
          }
        >
          <div className="space-y-3">
            {[
              {
                id: 'pr-4',
                num: '#4',
                title: 'feat: add Hyperledger Fabric contract adapter',
                branch: 'feature/github -> develop',
                author: 'Member 2',
                status: 'NEEDS_LEAD_REVIEW',
              },
              {
                id: 'pr-5',
                num: '#5',
                title: 'feat: W3C DID cryptographic credential issuer',
                branch: 'feature/auth-security -> develop',
                author: 'Member 3',
                status: 'NEEDS_LEAD_REVIEW',
              },
            ].map((pr) => (
              <div
                key={pr.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{pr.num}</span>
                    <Badge variant="info">{pr.branch}</Badge>
                  </div>
                  <div className="font-semibold text-slate-800">{pr.title}</div>
                  <div className="text-[11px] text-slate-500">Author: {pr.author}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
