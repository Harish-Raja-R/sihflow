import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ShieldAlert, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const RisksPage: React.FC = () => {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [mitigation, setMitigation] = useState('');
  const [category, setCategory] = useState('TECHNICAL');
  const [impact, setImpact] = useState('HIGH');

  const fetchRisks = async () => {
    try {
      const res = await apiClient.get('/risks');
      if (res.data?.success) {
        setRisks(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiClient.post('/risks', {
        title,
        description: desc,
        mitigationPlan: mitigation,
        category,
        impact,
        projectId: 'proj-acadshield-001',
      });
      setTitle('');
      setDesc('');
      setMitigation('');
      setShowModal(false);
      fetchRisks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Risk & Threat Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify potential architectural bottlenecks, live demo failure modes, and proactive mitigation plans
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Identify Risk</span>
        </button>
      </div>

      {/* Risks List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading risks...</div>
      ) : risks.length === 0 ? (
        <Card className="text-center py-12 text-slate-500 text-xs">
          No architectural risks recorded.
        </Card>
      ) : (
        <div className="space-y-4">
          {risks.map((r) => (
            <Card key={r.id} className="border-l-4 border-l-rose-500">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                    <Badge variant="danger">{r.impact} IMPACT</Badge>
                    <Badge variant="default">{r.category}</Badge>
                  </div>
                  <Badge variant={r.status === 'MITIGATED' ? 'success' : 'warning'}>{r.status}</Badge>
                </div>

                {r.description && <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>}

                {r.mitigationPlan && (
                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/60 rounded-lg text-xs text-emerald-950 font-medium">
                    <strong>Mitigation Strategy: </strong>
                    {r.mitigationPlan}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Identify New Risk</h3>
            <form onSubmit={handleCreateRisk} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Risk Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hyperledger Peer Outage during Jury Presentation"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Impact Level</label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mitigation Plan</label>
                <textarea
                  rows={3}
                  required
                  value={mitigation}
                  onChange={(e) => setMitigation(e.target.value)}
                  placeholder="Pre-generate cryptographic fallback blocks and local mock ledger toggle..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white rounded-lg"
                >
                  Log Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
