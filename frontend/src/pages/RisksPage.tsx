import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus } from 'lucide-react';
import { apiClient } from '../services/api';
import { Risk } from '../types';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const RisksPage: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  // New Risk Modal
  const [isNewRiskOpen, setIsNewRiskOpen] = useState(false);
  const [newRiskData, setNewRiskData] = useState({
    title: '',
    category: 'TECHNICAL',
    likelihood: 'MEDIUM',
    impact: 'HIGH',
    mitigationPlan: '',
  });

  const loadRisks = async () => {
    try {
      const data = await apiClient.getRisks();
      setRisks(data);
    } catch (e) {
      console.error('Failed to load risks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createRisk({
        ...newRiskData,
        impact: newRiskData.impact as any,
        projectId: 'proj-acadshield-001',
      });
      setIsNewRiskOpen(false);
      loadRisks();
    } catch (e) {
      console.error('Failed to create risk:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading risk registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <span>Risk Management & Mitigation Matrix</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Track technical, infrastructure, and presentation risks along with mitigation failovers for the SIH Finale.
          </p>
        </div>

        <button
          onClick={() => setIsNewRiskOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Identify New Risk</span>
        </button>
      </div>

      {/* Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((r) => (
          <Card key={r.id} className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                {r.category || 'TECHNICAL'} RISK
              </span>
              <StatusBadge status={r.status} size="sm" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
              <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1.5">
                <span>Likelihood: <strong className="text-slate-800">{r.likelihood || r.probability}</strong></span>
                <span>•</span>
                <span>Impact: <strong className="text-rose-700 font-semibold">{r.impact}</strong></span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="text-[10px] text-emerald-800 uppercase font-mono font-bold block mb-1">
                Mitigation Strategy & Backup
              </span>
              {r.mitigationPlan || r.mitigation}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Owner: {r.owner?.name || 'Harish R (Team Lead)'}
            </div>
          </Card>
        ))}
      </div>

      {/* New Risk Modal */}
      <Modal isOpen={isNewRiskOpen} onClose={() => setIsNewRiskOpen(false)} title="Register Technical / Hackathon Risk">
        <form onSubmit={handleCreateRisk} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Risk Title *</label>
            <input
              type="text"
              required
              value={newRiskData.title}
              onChange={(e) => setNewRiskData({ ...newRiskData, title: e.target.value })}
              placeholder="e.g. Fabric peer node latency during live demo"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category</label>
              <select
                value={newRiskData.category}
                onChange={(e) => setNewRiskData({ ...newRiskData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
              >
                <option value="TECHNICAL">Technical</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="TIME">Time Constraint</option>
                <option value="PRESENTATION">Presentation / Demo</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Likelihood</label>
              <select
                value={newRiskData.likelihood}
                onChange={(e) => setNewRiskData({ ...newRiskData, likelihood: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Impact</label>
              <select
                value={newRiskData.impact}
                onChange={(e) => setNewRiskData({ ...newRiskData, impact: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Mitigation Plan & Contingency *</label>
            <textarea
              rows={4}
              required
              value={newRiskData.mitigationPlan}
              onChange={(e) => setNewRiskData({ ...newRiskData, mitigationPlan: e.target.value })}
              placeholder="Explicit fallback steps if this risk materializes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewRiskOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shadow-xs"
            >
              Save Risk
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
