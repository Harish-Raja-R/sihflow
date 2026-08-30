import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './stores/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TeamPage } from './pages/TeamPage';
import { TasksPage } from './pages/TasksPage';
import { BoardPage } from './pages/BoardPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { ActivityPage } from './pages/ActivityPage';
import { BlockersPage } from './pages/BlockersPage';
import { GitHubPage } from './pages/GitHubPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { TestingPage } from './pages/TestingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SihReadinessPage } from './pages/SihReadinessPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected App Layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="milestones" element={<MilestonesPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="blockers" element={<BlockersPage />} />
          <Route path="github" element={<GitHubPage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="testing" element={<TestingPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="sih-readiness" element={<SihReadinessPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};
