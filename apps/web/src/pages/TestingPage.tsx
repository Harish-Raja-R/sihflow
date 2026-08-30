import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  CheckCircle,
  Bug,
  Plus,
  Play,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';

export const TestingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'test-cases' | 'bugs'>('test-cases');

  // Test Cases State
  const [testCases, setTestCases] = useState<any[]>([]);
  const [testMetrics, setTestMetrics] = useState<any>(null);

  // Bugs State
  const [bugs, setBugs] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test Case Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testForm, setTestForm] = useState({
    feature: '',
    description: '',
    steps: '',
    expectedResult: '',
    status: 'NOT_TESTED',
  });

  // Bug Modal
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugForm, setBugForm] = useState({
    title: '',
    description: '',
    severity: 'HIGH',
    assigneeId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tcRes, metricsRes, bugsRes, teamRes] = await Promise.all([
        api.get('/testing/test-cases'),
        api.get('/testing/metrics'),
        api.get('/bugs'),
        api.get('/team'),
      ]);

      if (tcRes.data?.success) setTestCases(tcRes.data.data);
      if (metricsRes.data?.success) setTestMetrics(tcRes.data.data);
      if (bugsRes.data?.success) setBugs(bugsRes.data.data);
      if (teamRes.data?.success) setMembers(teamRes.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load testing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Run / Change Test Case Status
  const handleUpdateTestStatus = async (tcId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/testing/test-cases/${tcId}`, { status: newStatus });
      if (res.data?.success) {
        setTestCases((prev) =>
          prev.map((t) => (t.id === tcId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update test case');
    }
  };

  // Create Test Case
  const handleCreateTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.feature.trim()) return;
    try {
      const res = await api.post('/testing/test-cases', testForm);
      if (res.data?.success) {
        setTestCases((prev) => [...prev, res.data.data]);
        setIsTestModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create test case');
    }
  };

  // Delete Test Case
  const handleDeleteTestCase = async (id: string) => {
    if (!window.confirm('Delete this test case?')) return;
    try {
      const res = await api.delete(`/testing/test-cases/${id}`);
      if (res.data?.success) {
        setTestCases((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete test case');
    }
  };

  // Create Bug
  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;
    try {
      const res = await api.post('/bugs', bugForm);
      if (res.data?.success) {
        setBugs((prev) => [res.data.data, ...prev]);
        setIsBugModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to report bug');
    }
  };

  // Update Bug Status
  const handleUpdateBugStatus = async (bugId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/bugs/${bugId}`, { status: newStatus });
      if (res.data?.success) {
        setBugs((prev) =>
          prev.map((b) => (b.id === bugId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update bug status');
    }
  };

  // Delete Bug
  const handleDeleteBug = async (id: string) => {
    if (!window.confirm('Delete this bug ticket?')) return;
    try {
      const res = await api.delete(`/bugs/${id}`);
      if (res.data?.success) {
        setBugs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete bug');
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

  const passedTests = testCases.filter((t) => t.status === 'PASS').length;
  const passRate = testCases.length > 0 ? Math.round((passedTests / testCases.length) * 100) : 0;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">QA Testing & Defect Tracking</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Verification suites, tamper detection scenarios, and defect management for AcadShield.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'test-cases' ? (
            <button
              onClick={() => {
                setTestForm({ feature: '', description: '', steps: '', expectedResult: '', status: 'NOT_TESTED' });
                setIsTestModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Test Case
            </button>
          ) : (
            <button
              onClick={() => {
                setBugForm({ title: '', description: '', severity: 'HIGH', assigneeId: members[0]?.id || '' });
                setIsBugModalOpen(true);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Report Defect
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('test-cases')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'test-cases'
              ? 'border-emerald-600 text-emerald-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Test Cases ({testCases.length}) &bull; {passRate}% Pass Rate
        </button>
        <button
          onClick={() => setActiveTab('bugs')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'bugs'
              ? 'border-red-600 text-red-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bug className="w-4 h-4" />
          Bugs & Defects ({bugs.filter((b) => b.status === 'OPEN').length} Open)
        </button>
      </div>

      {/* TAB 1: TEST CASES */}
      {activeTab === 'test-cases' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">TOTAL TESTS</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{testCases.length}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase">PASSED</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{passedTests}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-red-600 uppercase">FAILED</span>
              <div className="text-xl font-bold text-red-600 mt-1">{testCases.filter((t) => t.status === 'FAIL').length}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">PASS RATE</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">{passRate}%</div>
            </div>
          </div>

          <div className="space-y-3">
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {tc.testCaseId}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{tc.feature}</h3>
                    <Badge
                      variant={
                        tc.status === 'PASS'
                          ? 'success'
                          : tc.status === 'FAIL'
                          ? 'danger'
                          : tc.status === 'BLOCKED'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {tc.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600">{tc.description}</p>
                  <p className="text-[11px] text-slate-500">
                    <strong>Expected:</strong> {tc.expectedResult}
                  </p>
                </div>

                {/* Status Switcher & Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={tc.status}
                    onChange={(e) => handleUpdateTestStatus(tc.id, e.target.value)}
                    className="text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
                  >
                    <option value="NOT_TESTED">NOT TESTED</option>
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>

                  <button
                    onClick={() => handleDeleteTestCase(tc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    title="Delete Test Case"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BUGS */}
      {activeTab === 'bugs' && (
        <div className="space-y-3">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {bug.bugId}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{bug.title}</h3>
                  <Badge variant={bug.severity === 'CRITICAL' ? 'danger' : 'warning'}>{bug.severity}</Badge>
                  <Badge variant={bug.status === 'RESOLVED' ? 'success' : bug.status === 'OPEN' ? 'danger' : 'default'}>
                    {bug.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600">{bug.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Reporter: <strong>{bug.reporter?.name || 'QA'}</strong></span>
                  <span>Assignee: <strong>{bug.assignee?.name || 'Unassigned'}</strong></span>
                </div>
              </div>

              {/* Status Switcher & Delete */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={bug.status}
                  onChange={(e) => handleUpdateBugStatus(bug.id, e.target.value)}
                  className="text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <button
                  onClick={() => handleDeleteBug(bug.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                  title="Delete Defect"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {bugs.length === 0 && (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-400">
              <Bug className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No defects recorded.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE TEST CASE MODAL */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Add Test Case</h2>
              <button onClick={() => setIsTestModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestCase} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">FEATURE UNDER TEST *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., QR Verification Latency"
                  value={testForm.feature}
                  onChange={(e) => setTestForm({ ...testForm, feature: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="Verification objective..."
                  value={testForm.description}
                  onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">EXPECTED RESULT</label>
                <input
                  type="text"
                  placeholder="e.g., Returns HTTP 200 with response time < 50ms"
                  value={testForm.expectedResult}
                  onChange={(e) => setTestForm({ ...testForm, expectedResult: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Save Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BUG MODAL */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Report Defect / Bug</h2>
              <button onClick={() => setIsBugModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBug} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">DEFECT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Certificate hash verification returns 500 on null DID"
                  value={bugForm.title}
                  onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Steps to reproduce and actual error..."
                  value={bugForm.description}
                  onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SEVERITY</label>
                  <select
                    value={bugForm.severity}
                    onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ASSIGNEE</label>
                  <select
                    value={bugForm.assigneeId}
                    onChange={(e) => setBugForm({ ...bugForm, assigneeId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-900"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBugModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Report Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
