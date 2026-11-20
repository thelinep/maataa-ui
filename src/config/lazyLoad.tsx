/**
 * Code-split film production workflow pages.
 *
 * Each page loads on first visit to its route; the app shell wraps routed
 * content in <Suspense> (see src/app/AppLayout.tsx).
 */

import { lazy } from 'react';

// Pre-production
export const ConceptList = lazy(() => import('@/pages/Concepts/ConceptList'));
export const ConceptDetail = lazy(() => import('@/pages/Concepts/ConceptDetail'));
export const ConceptForm = lazy(() => import('@/pages/Concepts/ConceptForm'));
export const CreateConcept = lazy(() => import('@/pages/Concepts/CreateConcept'));
export const ScriptList = lazy(() => import('@/pages/Scripts/ScriptList'));
export const ScriptDetail = lazy(() => import('@/pages/Scripts/ScriptDetail'));
export const ScriptEditor = lazy(() => import('@/pages/Scripts/ScriptEditor'));
export const StoryboardList = lazy(() => import('@/pages/Storyboards/StoryboardList'));
export const StoryboardGrid = lazy(() => import('@/pages/Storyboards/StoryboardGrid'));

// Production
export const FilmingLog = lazy(() => import('@/pages/Filming/FilmingLog'));
export const DailiesView = lazy(() => import('@/pages/Filming/DailiesView'));
export const ScreeningList = lazy(() => import('@/pages/Screenings/ScreeningList'));
export const FeedbackCollection = lazy(() => import('@/pages/Screenings/FeedbackCollection'));

// Post-production
export const EditingTimeline = lazy(() => import('@/pages/Editing/EditingTimeline'));
export const EditingLog = lazy(() => import('@/pages/Editing/EditingLog'));
export const ColorGrading = lazy(() => import('@/pages/ColorGrading/ColorGrading'));
export const SoundMixing = lazy(() => import('@/pages/Sound/SoundMixing'));

// Management (Projects / Teams / Budgets)
export const ProjectList = lazy(() => import('@/pages/Projects/ProjectList'));
export const ProjectDetail = lazy(() => import('@/pages/Projects/ProjectDetail'));
export const CreateProject = lazy(() => import('@/pages/Projects/CreateProject'));
export const TeamList = lazy(() => import('@/pages/Teams/TeamList'));
export const TeamDetail = lazy(() => import('@/pages/Teams/TeamDetail'));
export const CreateTeam = lazy(() => import('@/pages/Teams/CreateTeam'));
export const BudgetList = lazy(() => import('@/pages/Budgets/BudgetList'));
export const BudgetDetail = lazy(() => import('@/pages/Budgets/BudgetDetail'));
export const CreateBudget = lazy(() => import('@/pages/Budgets/CreateBudget'));
