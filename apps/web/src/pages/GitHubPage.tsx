import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Key,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

export const GitHubPage: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);
  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Token input state
  const [tokenInput, setTokenInput] = useState('');
  const [configuring, setConfiguring] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  const fetchGitHubData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statusRes, repoRes] = await Promise.all([
        api.get('/github/status'),
        api.get('/github/repository'),
      ]);

      if (statusRes.data?.success) setStatusData(statusRes.data.data);
      if (repoRes.data?.success) setRepoData(repoRes.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to query GitHub status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    try {
      setConfiguring(true);
      const res = await api.post('/github/token', { token: tokenInput });
      if (res.data?.success) {
        setConfigSuccess(true);
        setTokenInput('');
        fetchGitHubData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save token');
    } finally {
      setConfiguring(false);
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

  const isConfigured = statusData?.isConfigured;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-900">GitHub Repository Telemetry</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tracking AcadShield repository on GitHub (vishanth11/AcadShield).
          </p>
        </div>

        <button
          onClick={fetchGitHubData}
          title="Refresh GitHub state"
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Repository Info Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">TARGET REPOSITORY</div>
          <a
            href="https://github.com/vishanth11/AcadShield.git"
            target="_blank"
            rel="noreferrer"
            className="text-lg font-bold text-emerald-700 hover:underline flex items-center gap-1.5 mt-1"
          >
            vishanth11/AcadShield <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-500 mt-0.5">
            Default Branch: <span className="font-semibold text-slate-800">main</span> | SCM Isolation: 6 Feature Branches
          </p>
        </div>

        <Badge variant={isConfigured ? 'success' : 'default'}>
          {isConfigured ? 'Live API Connected' : 'Integration Not Configured'}
        </Badge>
      </div>

      {/* When NOT CONFIGURED: Show clear configuration prompt */}
      {!isConfigured && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">GitHub integration is not configured.</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Live GitHub sync requires a Personal Access Token (classic or fine-grained) with <code>repo</code> read scope.
                Without a token, fake live data will NOT be shown.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveToken} className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="Enter GitHub Personal Access Token (ghp_...)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={configuring}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
            >
              {configuring ? 'Connecting...' : 'Connect GitHub Token'}
            </button>
          </form>

          {configSuccess && (
            <p className="text-xs font-semibold text-emerald-700">Token saved! Refreshing repository data...</p>
          )}
        </div>
      )}

      {/* 6-Developer Branch Architecture Policy */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Configured Development Branches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {repoData?.branches?.map((b: any) => (
            <div key={b.name} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800 font-mono">{b.name}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{b.description}</p>
              </div>
              <Badge variant={b.isProtected ? 'warning' : 'default'}>
                {b.isProtected ? 'Protected' : 'Feature'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* When CONFIGURED: Show Commits and PRs */}
      {isConfigured && repoData?.commits?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commits */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <GitCommit className="w-4 h-4 text-slate-600" /> Commits ({repoData.commits.length})
            </h3>
            <div className="space-y-2">
              {repoData.commits.map((c: any) => (
                <div key={c.sha} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                  <div className="flex justify-between font-mono font-bold text-slate-700">
                    <span>{c.sha}</span>
                    <span className="font-sans font-normal text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-slate-800 font-medium mt-1">{c.message}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Author: {c.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pull Requests */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <GitPullRequest className="w-4 h-4 text-purple-600" /> Pull Requests ({repoData.pullRequests.length})
            </h3>
            <div className="space-y-2">
              {repoData.pullRequests.map((pr: any) => (
                <div key={pr.number} className="p-3 rounded-lg border border-purple-100 bg-purple-50/40 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>#{pr.number}: {pr.title}</span>
                    <Badge variant="info">{pr.status}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {pr.head} &rarr; {pr.base} by {pr.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
