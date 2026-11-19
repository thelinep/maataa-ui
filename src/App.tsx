/**
 * App - Main application entry point with routing
 *
 * Sets up React Router and integrates all workflows
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/layout/AppShell';
import { ProjectList, ProjectDetail, CreateProject } from '@/pages/Projects';
import { TeamList, TeamDetail, CreateTeam } from '@/pages/Teams';
import { getRoute } from '@/nav/routes';

/**
 * App Component - Root router setup
 *
 * Routes:
 * - /projects - ProjectList
 * - /projects/:projectId - ProjectDetail
 * - / - Redirect to /projects
 */
export const App: React.FC = () => {
  return (
    <Router>
      <AppShell>
        <Routes>
          {/* Projects Workflow */}
          <Route
            path={getRoute('PROJECT_LIST').path}
            element={<ProjectList />}
          />
          <Route
            path={getRoute('PROJECT_CREATE').path}
            element={<CreateProject />}
          />
          <Route
            path={getRoute('PROJECT_DETAIL').path}
            element={<ProjectDetailWrapper />}
          />

          {/* Teams Workflow */}
          <Route
            path={getRoute('TEAM_LIST').path}
            element={<TeamList />}
          />
          <Route
            path={getRoute('TEAM_CREATE').path}
            element={<CreateTeam />}
          />
          <Route
            path={getRoute('TEAM_DETAIL').path}
            element={<TeamDetailWrapper />}
          />

          {/* Redirect home to projects */}
          <Route path="/" element={<Navigate to="/projects" replace />} />

          {/* TODO: Add more workflows */}
          {/* <Route path="/budget" element={<BudgetOverview />} />
          <Route path="/schedule" element={<ScheduleCalendar />} /> */}

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
};

/**
 * ProjectDetailWrapper - Extract projectId from URL params
 */
const ProjectDetailWrapper: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Navigate to="/projects" replace />;
  }

  return <ProjectDetail projectId={projectId} />;
};

/**
 * TeamDetailWrapper - Extract teamId from URL params
 */
const TeamDetailWrapper: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  if (!teamId) {
    return <Navigate to="/teams" replace />;
  }

  return <TeamDetail teamId={teamId} />;
};

App.displayName = 'App';

export default App;
