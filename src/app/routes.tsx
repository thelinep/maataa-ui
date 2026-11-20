/**
 * Route table for the 8 film production workflows.
 *
 * Page components stay router-agnostic (they expose onSelect/onCreate/...
 * callbacks); the thin route components below translate those into navigation.
 */

import React from 'react';
import styled from 'styled-components';
import { Link, Navigate, useNavigate, useParams, type RouteObject } from 'react-router';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';
import { useFilmEntities, useFilmEntity } from '@/hooks/data/useFilmEntities';
import {
  ConceptList,
  ConceptDetail,
  ConceptForm,
  CreateConcept,
  ScriptList,
  ScriptDetail,
  ScriptEditor,
  StoryboardList,
  StoryboardGrid,
  FilmingLog,
  DailiesView,
  ScreeningList,
  FeedbackCollection,
  EditingTimeline,
  EditingLog,
  ColorGrading,
  SoundMixing,
  ProjectList,
  ProjectDetail,
  CreateProject,
  TeamList,
  TeamDetail,
  CreateTeam,
  BudgetList,
  BudgetDetail,
  CreateBudget,
} from '@/config/lazyLoad';
import { ErrorState, LoadingState, NotFoundState } from '@/pages/shared/AsyncState';
import { AppLayout, WorkflowTabs } from './AppLayout';
import { useCurrentUser } from './CurrentUser';

const BackBar = styled.div`
  padding: ${spacing.md} ${spacing.lg} 0;
  font-size: ${typography.bodySmall.fontSize};

  a {
    color: ${colorTokens.text.secondary};
    text-decoration: none;
  }

  a:hover {
    color: ${colorTokens.primary.main};
  }
`;

const BackLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <BackBar>
    <Link to={to}>← {children}</Link>
  </BackBar>
);

// ---------------------------------------------------------------------------
// Concepts
// ---------------------------------------------------------------------------

function ConceptsRoute() {
  const navigate = useNavigate();
  return <ConceptList onSelect={(id) => navigate(`/concepts/${id}`)} onCreate={() => navigate('/concepts/new')} />;
}

function CreateConceptRoute() {
  const navigate = useNavigate();
  return (
    <>
      <BackLink to="/concepts">All concepts</BackLink>
      <CreateConcept onCreated={(c) => navigate(`/concepts/${c.id}`)} onCancel={() => navigate('/concepts')} />
    </>
  );
}

function ConceptDetailRoute() {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <BackLink to="/concepts">All concepts</BackLink>
      <ConceptDetail conceptId={conceptId} onEdit={(id) => navigate(`/concepts/${id}/edit`)} />
    </>
  );
}

function EditConceptRoute() {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const { item, loading, error, update } = useFilmEntity('concept', conceptId);

  if (error) return <ErrorState error={error} />;
  if (loading) return <LoadingState label="Loading concept…" />;
  if (!item) return <NotFoundState label="Concept not found." />;

  const { title, vision, genre, format, duration, budgetEstimate } = item;
  return (
    <>
      <BackLink to={`/concepts/${item.id}`}>{item.title}</BackLink>
      <ConceptForm
        submitLabel="Update Concept"
        initialData={{ title, vision, genre, format, duration, budgetEstimate }}
        onSubmit={async (data) => {
          await update(data);
          navigate(`/concepts/${item.id}`);
        }}
        onCancel={() => navigate(`/concepts/${item.id}`)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Scripts
// ---------------------------------------------------------------------------

function ScriptsRoute() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  return (
    <ScriptList
      currentUser={currentUser}
      onSelect={(id) => navigate(`/scripts/${id}`)}
      onCreated={(s) => navigate(`/scripts/${s.id}/edit`)}
    />
  );
}

function ScriptDetailRoute() {
  const { scriptId } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <BackLink to="/scripts">All scripts</BackLink>
      <ScriptDetail scriptId={scriptId} onOpenEditor={(id) => navigate(`/scripts/${id}/edit`)} />
    </>
  );
}

function ScriptEditorRoute() {
  const { scriptId } = useParams();
  const currentUser = useCurrentUser();
  return (
    <>
      <BackLink to={`/scripts/${scriptId}`}>Script details</BackLink>
      <ScriptEditor scriptId={scriptId} currentUser={currentUser} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Storyboards
// ---------------------------------------------------------------------------

function StoryboardsRoute() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { create } = useFilmEntities('storyboard');
  const handleCreate = async () => {
    try {
      const sb = await create({ title: 'Untitled Storyboard', scriptId: '', status: 'in-progress', createdBy: currentUser, scenes: [] });
      navigate(`/storyboards/${sb.id}`);
    } catch {
      // the list shows the store error
    }
  };
  return <StoryboardList onSelect={(id) => navigate(`/storyboards/${id}`)} onCreate={handleCreate} />;
}

function StoryboardRoute() {
  const { storyboardId } = useParams();
  return (
    <>
      <BackLink to="/storyboards">All storyboards</BackLink>
      <StoryboardGrid storyboardId={storyboardId} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Screenings
// ---------------------------------------------------------------------------

function ScreeningsRoute() {
  const navigate = useNavigate();
  const { create } = useFilmEntities('screening');
  const handleCreate = async () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    try {
      await create({ title: 'New Screening', type: 'internal', date, location: 'TBD', audienceSize: 0, status: 'scheduled', feedback: [] });
    } catch {
      // the list shows the store error
    }
  };
  return <ScreeningList onSelect={(id) => navigate(`/screenings/${id}`)} onCreate={handleCreate} />;
}

function ScreeningFeedbackRoute() {
  const { screeningId } = useParams();
  return (
    <>
      <BackLink to="/screenings">All screenings</BackLink>
      <FeedbackCollection screeningId={screeningId} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Management (Projects / Teams / Budgets) — pages navigate on their own
// ---------------------------------------------------------------------------

function ProjectDetailRoute() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  if (!projectId) return <Navigate to="/projects" replace />;
  return <ProjectDetail projectId={projectId} onNavigateBack={() => navigate('/projects')} />;
}

function TeamDetailRoute() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  if (!teamId) return <Navigate to="/teams" replace />;
  return <TeamDetail teamId={teamId} onNavigateBack={() => navigate('/teams')} />;
}

function BudgetDetailRoute() {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  if (!budgetId) return <Navigate to="/budgets" replace />;
  return <BudgetDetail budgetId={budgetId} onNavigateBack={() => navigate('/budgets')} />;
}

function NotFoundRoute() {
  return (
    <>
      <NotFoundState label="Page not found." />
      <BackLink to="/concepts">Go to Concepts</BackLink>
    </>
  );
}

// ---------------------------------------------------------------------------
// Route table
// ---------------------------------------------------------------------------

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/concepts" replace /> },

      { path: 'concepts', element: <ConceptsRoute /> },
      { path: 'concepts/new', element: <CreateConceptRoute /> },
      { path: 'concepts/:conceptId', element: <ConceptDetailRoute /> },
      { path: 'concepts/:conceptId/edit', element: <EditConceptRoute /> },

      { path: 'scripts', element: <ScriptsRoute /> },
      { path: 'scripts/:scriptId', element: <ScriptDetailRoute /> },
      { path: 'scripts/:scriptId/edit', element: <ScriptEditorRoute /> },

      { path: 'storyboards', element: <StoryboardsRoute /> },
      { path: 'storyboards/:storyboardId', element: <StoryboardRoute /> },

      {
        path: 'filming',
        element: (
          <WorkflowTabs
            label="Filming views"
            tabs={[
              { label: 'Filming Log', to: '/filming', end: true },
              { label: 'Dailies', to: '/filming/dailies' },
            ]}
          />
        ),
        children: [
          { index: true, element: <FilmingLog /> },
          { path: 'dailies', element: <DailiesView /> },
        ],
      },

      { path: 'screenings', element: <ScreeningsRoute /> },
      { path: 'screenings/:screeningId', element: <ScreeningFeedbackRoute /> },

      {
        path: 'editing',
        element: (
          <WorkflowTabs
            label="Editing views"
            tabs={[
              { label: 'Timeline', to: '/editing', end: true },
              { label: 'Version Log', to: '/editing/log' },
            ]}
          />
        ),
        children: [
          { index: true, element: <EditingTimeline /> },
          { path: 'log', element: <EditingLog /> },
        ],
      },

      { path: 'color', element: <ColorGrading /> },
      { path: 'sound', element: <SoundMixing /> },

      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/new', element: <CreateProject /> },
      { path: 'projects/:projectId', element: <ProjectDetailRoute /> },
      { path: 'teams', element: <TeamList /> },
      { path: 'teams/new', element: <CreateTeam /> },
      { path: 'teams/:teamId', element: <TeamDetailRoute /> },
      { path: 'budgets', element: <BudgetList /> },
      { path: 'budgets/new', element: <CreateBudget /> },
      { path: 'budgets/:budgetId', element: <BudgetDetailRoute /> },

      { path: '*', element: <NotFoundRoute /> },
    ],
  },
];
