import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  FolderGit2,
  Calendar,
  GitBranch,
  Users,
  CheckSquare,
  Milestone,
  Edit2,
  Save,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workstreams' | 'milestones' | 'tasks'>('overview');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective: '',
    status: '',
    progress: 0,
    startDate: '',
    targetDate: '',
    repositoryUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/projects/proj-acadshield-001');
      if (res.data?.success) {
        setProject(res.data.data);
        setFormData({
          name: res.data.data.name || '',
          description: res.data.data.description || '',
          objective: res.data.data.objective || '',
          status: res.data.data.status || 'ACTIVE',
          progress: res.data.data.progress || 0,
          startDate: res.data.data.startDate || '2026-08-01',
          targetDate: res.data.data.targetDate || '2026-09-15',
          repositoryUrl: res.data.data.repositoryUrl || 'https://github.com/vishanth11/AcadShield.git',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.patch('/projects/proj-acadshield-001', formData);
      if (res.data?.success) {
        setProject((prev: any) => ({ ...prev, ...formData }));
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save project updates');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        objective: project.objective || '',
        status: project.status || 'ACTIVE',
        progress: project.progress || 0,
        startDate: project.startDate || '2026-08-01',
        targetDate: project.targetDate || '2026-09-15',
        repositoryUrl: project.repositoryUrl || 'https://github.com/vishanth11/AcadShield.git',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <p className="font-semibold">{error || 'Project data unavailable'}</p>
          <button onClick={fetchProjectData} className="px-3 py-1.5 bg-white border border-red-300 rounded text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
          Project details updated and saved successfully!
        </div>
      )}

      {/* Main Project Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        {/* Header with Title & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-xl">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-xl font-bold text-slate-900 border border-slate-300 rounded px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                )}
                <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>{project.status}</Badge>
                <Badge variant="info">SIH #1422</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Blockchain-based Academic Credential Verification Platform
              </p>
            </div>
          </div>

          {/* Working Edit / Save / Cancel Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Edit2 className="w-4 h-4 text-slate-500" /> Edit Project
              </button>
            )}
          </div>
        </div>

        {/* Project Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">STATUS</div>
            {isEditing ? (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 text-xs border border-slate-300 rounded px-2 py-1 w-full bg-white font-medium text-slate-900"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            ) : (
              <div className="text-sm font-bold text-slate-800 mt-1">{project.status}</div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OVERALL PROGRESS</div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="mt-1 text-xs border border-slate-300 rounded px-2 py-1 w-full bg-white font-medium text-slate-900"
              />
            ) : (
              <div className="text-sm font-bold text-emerald-700 mt-1">{project.progress}%</div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">START DATE</div>
            {isEditing ? (
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 text-xs border border-slate-300 rounded px-2 py-1 w-full bg-white font-medium text-slate-900"
              />
            ) : (
              <div className="text-sm font-semibold text-slate-700 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {project.startDate || '2026-08-01'}
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TARGET DATE</div>
            {isEditing ? (
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="mt-1 text-xs border border-slate-300 rounded px-2 py-1 w-full bg-white font-medium text-slate-900"
              />
            ) : (
              <div className="text-sm font-semibold text-slate-700 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {project.targetDate || '2026-09-15'}
              </div>
            )}
          </div>
        </div>

        {/* Repository & Team Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="text-xs font-semibold text-slate-500 mb-1">Git Repository:</div>
            {isEditing ? (
              <input
                type="text"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                className="text-xs border border-slate-300 rounded px-2 py-1 w-full"
              />
            ) : (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <GitBranch className="w-3.5 h-3.5" /> {project.repositoryUrl} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="text-xs font-semibold text-slate-500 mb-1">Dedicated Team:</div>
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" /> 6 Assigned Full-Stack Developers
            </div>
          </div>
        </div>
      </div>

      {/* Sections: Overview | Workstreams | Milestones | Tasks */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workstreams')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'workstreams'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Workstreams ({project.workstreams?.length || 6})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'milestones'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Milestones ({project.milestones?.length || 11})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tasks ({project.tasks?.length || 6})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Project Description</h3>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-3 font-normal"
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {project.description}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Core Objective</h3>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-3 font-normal"
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {project.objective}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WORKSTREAMS */}
          {activeTab === 'workstreams' && (
            <div className="space-y-3">
              {project.workstreams?.map((ws: any) => (
                <div key={ws.code} className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {ws.code}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">{ws.name}</h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Lead: <span className="font-medium text-slate-700">{ws.owner}</span></div>
                  </div>
                  <div className="w-32 text-right">
                    <div className="text-xs font-bold text-slate-800 mb-1">{ws.progress}%</div>
                    <ProgressBar progress={ws.progress} variant="emerald" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-3">
              {project.milestones?.map((m: any) => (
                <div key={m.id} className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {m.milestoneCode || m.code}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">{m.name}</h4>
                      <Badge variant={m.status === 'Completed' ? 'success' : m.status === 'At Risk' ? 'danger' : 'info'}>
                        {m.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-xs font-bold text-slate-800 mb-1">{m.progress}%</div>
                    <div className="text-xs text-slate-400">Due: {m.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {project.tasks?.map((t: any) => (
                <div key={t.id} className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">{t.taskId}</span>
                      <h4 className="text-sm font-semibold text-slate-900">{t.title}</h4>
                      <Badge variant={t.status === 'DONE' || t.status === 'COMPLETED' ? 'success' : t.status === 'BLOCKED' ? 'danger' : 'info'}>
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Assignee: <span className="font-medium text-slate-700">{t.assignee?.name}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <Badge variant={t.priority === 'CRITICAL' ? 'danger' : t.priority === 'HIGH' ? 'warning' : 'default'}>
                      {t.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
