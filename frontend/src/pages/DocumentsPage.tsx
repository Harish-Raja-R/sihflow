import React, { useState, useEffect } from 'react';
import { FileText, Plus, ShieldCheck } from 'lucide-react';
import { apiClient } from '../services/api';
import { Document } from '../types';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

export const DocumentsPage: React.FC = () => {
  const { isReviewer, isTeamLead } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // New Doc Modal
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [newDocData, setNewDocData] = useState({
    title: '',
    type: 'SRS',
    version: '1.0.0',
    content: '',
  });

  const loadDocs = async () => {
    try {
      const data = await apiClient.getDocuments();
      setDocuments(data);
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createDocument({
        ...newDocData,
        projectId: 'proj-acadshield-001',
      });
      setIsNewDocOpen(false);
      loadDocs();
    } catch (e) {
      console.error('Failed to create doc:', e);
    }
  };

  const handleApprove = async (docId: string) => {
    try {
      await apiClient.updateDocumentStatus(docId, 'APPROVED', 'Verified and compliant for SIH jury.');
      loadDocs();
    } catch (e) {
      console.error('Failed to approve doc:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading project documentation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Documents & Technical Specifications</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            System Architecture, Software Requirements Specification (SRS), Threat Model, API Docs, and SIH Pitch Deck.
          </p>
        </div>

        <button
          onClick={() => setIsNewDocOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => {
          const isApproved = doc.reviewStatus === 'APPROVED';

          return (
            <Card key={doc.id} className="p-6 bg-white border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    {doc.type || doc.category} v{doc.version}
                  </span>
                  <StatusBadge status={doc.reviewStatus} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900">{doc.title || doc.name}</h3>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 max-h-32 overflow-y-auto whitespace-pre-line leading-relaxed font-sans">
                  {doc.content || 'Specification artifact compliant with SIH requirements.'}
                </div>
              </div>

              {/* Review & Approvals */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Author: <strong className="text-slate-800">{doc.author?.name || doc.owner?.name || 'Kavya Nair'}</strong>
                </div>

                {!isApproved && (isReviewer || isTeamLead) && (
                  <button
                    onClick={() => handleApprove(doc.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Approve Document</span>
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Document Modal */}
      <Modal isOpen={isNewDocOpen} onClose={() => setIsNewDocOpen(false)} title="Create Documentation Artifact">
        <form onSubmit={handleCreateDoc} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={newDocData.title}
              onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
              placeholder="e.g. Threat Model & STRIDE Analysis"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Type</label>
              <select
                value={newDocData.type}
                onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="ARCHITECTURE">Architecture Diagram & Specs</option>
                <option value="SRS">Software Requirements (SRS)</option>
                <option value="THREAT_MODEL">Threat Model</option>
                <option value="API_DOC">API Specification</option>
                <option value="PITCH_DECK">SIH Pitch Deck</option>
                <option value="DEMO_GUIDE">Demo Guide</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Version</label>
              <input
                type="text"
                value={newDocData.version}
                onChange={(e) => setNewDocData({ ...newDocData, version: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Content / Document Summary *</label>
            <textarea
              rows={5}
              required
              value={newDocData.content}
              onChange={(e) => setNewDocData({ ...newDocData, content: e.target.value })}
              placeholder="Document text and specifications..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewDocOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
            >
              Save Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
