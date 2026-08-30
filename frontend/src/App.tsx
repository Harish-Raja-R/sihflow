import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layouts/AppLayout';

import { DashboardPage } from './pages/DashboardPage';
import { TeamLeadCenterPage } from './pages/TeamLeadCenterPage';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { BoardPage } from './pages/BoardPage';
import { TeamPage } from './pages/TeamPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { MilestonesPage } from './pages/MilestonesPage';
import { SprintsPage } from './pages/SprintsPage';
import { BlockersPage } from './pages/BlockersPage';
import { ActivityFeedPage } from './pages/ActivityFeedPage';
import { GitHubPage } from './pages/GitHubPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { RisksPage } from './pages/RisksPage';
import { BugsPage } from './pages/BugsPage';
import { TestingPage } from './pages/TestingPage';
import { SihReadinessPage } from './pages/SihReadinessPage';
import { DemoReadinessPage } from './pages/DemoReadinessPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">Initializing SihFlow ERP Session...</span>
        </div>
      </div>
    );
  }

  // Fallback to layout if user is present, or continue
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="lead-center" element={<TeamLeadCenterPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="team/:id" element={<MemberProfilePage />} />
            <Route path="milestones" element={<MilestonesPage />} />
            <Route path="sprints" element={<SprintsPage />} />
            <Route path="blockers" element={<BlockersPage />} />
            <Route path="activity" element={<ActivityFeedPage />} />
            <Route path="github" element={<GitHubPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="risks" element={<RisksPage />} />
            <Route path="bugs" element={<BugsPage />} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="sih-readiness" element={<SihReadinessPage />} />
            <Route path="demo-readiness" element={<DemoReadinessPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
