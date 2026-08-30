import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  X,
  Info,
  Calendar,
  User,
  CheckCircle,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload/Create modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    type: 'SRS',
    category: 'SPECIFICATION',
    version: '1.0.0',
    content: '',
  });

  // View Modal
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/documents');
      if (res.data?.success) {
        setDocuments(res.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;
    try {
      const res = await api.post('/documents', docForm);
      if (res.data?.success) {
        setDocuments((prev) => [res.data.data, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create document specification');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm('Delete this document specification?')) return;
    try {
      const res = await api.delete(`/documents/${id}`);
      if (res.data?.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">Project Documents & Specifications</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Software Requirements Specification (SRS), architectural blueprints, and API contracts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs"
        >
          <Upload className="w-4 h-4" /> Add Document Specification
        </button>
      </div>

      {/* Storage Limitation Banner */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Storage Notice:</strong> Documents are stored in the ERP database as structured specifications. External cloud object storage (S3/GCS) is not configured in local development mode.
        </p>
      </div>

      {/* Document Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {documents.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Version: v{doc.version || '1.0.0'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{doc.owner?.name || doc.author?.name || 'Member 6'}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{doc.date || doc.updatedAt || '2026-08-25'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={doc.status === 'APPROVED' ? 'success' : 'warning'}>
                      {doc.status || 'APPROVED'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      title="View Content"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No documents added yet.</p>
          </div>
        )}
      </div>

      {/* CREATE / UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Add Document Specification</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">DOCUMENT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., AcadShield SRS Specification (WS-14)"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">TYPE</label>
                  <select
                    value={docForm.type}
                    onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    <option value="SRS">SRS</option>
                    <option value="ARCH_DOC">Architecture Doc</option>
                    <option value="API_SPEC">API Contract</option>
                    <option value="USER_GUIDE">User Guide</option>
                    <option value="DEMO_SCRIPT">Demo Script</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">VERSION</label>
                  <input
                    type="text"
                    value={docForm.version}
                    onChange={(e) => setDocForm({ ...docForm, version: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CONTENT / ABSTRACT</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Document abstract, section outline or specification text..."
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Save Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {viewingDoc.type} &bull; v{viewingDoc.version}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{viewingDoc.title}</h2>
              </div>
              <button onClick={() => setViewingDoc(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                <span>Owner: <strong>{viewingDoc.owner?.name || viewingDoc.author?.name || 'Member 6'}</strong></span>
                <span>Date: <strong>{viewingDoc.date || viewingDoc.updatedAt || '2026-08-25'}</strong></span>
                <Badge variant="success">{viewingDoc.status || 'APPROVED'}</Badge>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                {viewingDoc.content || 'No content recorded in specification.'}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
