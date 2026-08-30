import React, { useState, useEffect } from 'react';
import {
  Github,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';

export const GitHubPage: React.FC = () => {
  const [commits, setCommits] = useState<any[]>([]);
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'commits' | 'prs' | 'issues'>('prs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        const [cData, pData, iData] = await Promise.all([
          apiClient.getGitHubCommits(),
          apiClient.getGitHubPullRequests(),
          apiClient.getGitHubIssues(),
        ]);
        setCommits(cData);
        setPullRequests(pData);
        setIssues(iData);
      } catch (e) {
        console.error('Failed to load GitHub data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Syncing GitHub Repository Data (vishanth11/AcadShield)...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-700 font-mono mb-1">
            <Github className="w-4 h-4" />
            <span>Repository Integration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            vishanth11/AcadShield
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              public
            </span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Live synchronization of commits, pull requests, code reviews, and issue trackers.
          </p>
        </div>

        <a
          href="https://github.com/vishanth11/AcadShield"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs w-fit"
        >
          <span>Open on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-slate-500 font-bold uppercase font-mono">Total Commits</div>
          <div className="text-2xl font-black text-slate-800 font-mono mt-1">{commits.length}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center justify-center gap-1">
            <GitCommit className="w-3 h-3" /> Across all branches
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-purple-700 font-bold uppercase font-mono">Pull Requests</div>
          <div className="text-2xl font-black text-purple-700 font-mono mt-1">{pullRequests.length}</div>
          <div className="text-[10px] text-purple-700 font-semibold mt-1 flex items-center justify-center gap-1">
            <GitPullRequest className="w-3 h-3" /> {pullRequests.filter((p) => p.status === 'OPEN').length} Open
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-amber-700 font-bold uppercase font-mono">Issues</div>
          <div className="text-2xl font-black text-amber-700 font-mono mt-1">{issues.length}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-1 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" /> {issues.filter((i) => i.state === 'OPEN').length} Open
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 text-center shadow-xs">
          <div className="text-xs text-emerald-700 font-bold uppercase font-mono">Review Approval</div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">100%</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Mandatory SIH gate
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold font-mono">
        <button
          onClick={() => setActiveTab('prs')}
          className={`pb-3 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'prs'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>PULL REQUESTS ({pullRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('commits')}
          className={`pb-3 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'commits'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>COMMITS ({commits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`pb-3 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'issues'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>ISSUES ({issues.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'prs' && (
        <div className="space-y-3">
          {pullRequests.map((pr) => (
            <Card key={pr.id} className="p-4 bg-white border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-purple-700 font-bold text-xs">#{pr.number}</span>
                  <h3 className="text-sm font-bold text-slate-900">{pr.title}</h3>
                </div>
                <StatusBadge status={pr.status} size="sm" />
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <span>
                    Author: <strong className="text-slate-800">{pr.author?.name || 'Harish R'}</strong>
                  </span>
                  <span>
                    Branches: <code className="text-emerald-700 font-bold">{pr.headBranch}</code> → <code className="text-slate-700">{pr.baseBranch}</code>
                  </span>
                </div>
                <a
                  href={`https://github.com/vishanth11/AcadShield/pull/${pr.number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-700 hover:underline flex items-center gap-1 font-mono text-[11px] font-bold"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'commits' && (
        <div className="space-y-2">
          {commits.map((c) => (
            <Card key={c.id} className="p-3.5 bg-white border-slate-200 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {c.sha}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{c.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    by {c.authorName} on branch <strong className="text-slate-600">{c.branch}</strong>
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(c.committedAt).toLocaleDateString()}
              </span>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-3">
          {issues.map((i) => (
            <Card key={i.id} className="p-4 bg-white border-slate-200 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-amber-700 font-bold">#{i.number}</span>
                  <h3 className="font-bold text-slate-800">{i.title}</h3>
                </div>
                <StatusBadge status={i.state} size="sm" />
              </div>
              <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-100 text-[11px]">
                <span>Assignee: {i.assignee?.name || 'Unassigned'}</span>
                <span className="font-mono text-slate-400">
                  Updated: {new Date(i.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
