/**
 * Phase J: Film Production workflow components
 * Each test renders against a fresh, seeded FilmEntityService (Phase 2 EntityManager).
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { FilmEntityProvider, FilmEntityService } from '@/core/film';

import { ConceptList, ConceptForm, ConceptDetail, CreateConcept } from '../Concepts';
import { ScriptList, ScriptEditor, ScriptDetail } from '../Scripts';
import { StoryboardList, StoryboardGrid } from '../Storyboards';
import { FilmingLog, DailiesView } from '../Filming';
import { buildDailies } from '../Filming/DailiesView';
import { ScreeningList, FeedbackCollection } from '../Screenings';
import { averageRating } from '../Screenings/ScreeningList';
import { calculateFeedbackStats } from '../Screenings/FeedbackCollection';
import { EditingTimeline, EditingLog } from '../Editing';
import { ColorGrading } from '../ColorGrading';
import { SoundMixing } from '../Sound';

function renderWithStore(ui: React.ReactElement, { seed = true }: { seed?: boolean } = {}) {
  const service = new FilmEntityService();
  if (seed) service.seed();
  const utils = render(<FilmEntityProvider service={service}>{ui}</FilmEntityProvider>);
  return { service, ...utils };
}

// ---------------------------------------------------------------------------
// Concepts
// ---------------------------------------------------------------------------

describe('ConceptList', () => {
  it('shows a loading state, then concepts newest-updated first', async () => {
    renderWithStore(<ConceptList />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading concepts');

    await screen.findByText('Neon Dreams');
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((r) => within(r).getAllByRole('cell')[0].textContent)).toEqual([
      'Neon Dreams',
      'Street Voices',
      'The Lost Highway',
    ]);
  });

  it('filters by search text and status', async () => {
    renderWithStore(<ConceptList />);
    await screen.findByText('Neon Dreams');

    fireEvent.change(screen.getByPlaceholderText(/search concepts/i), { target: { value: 'jazz' } });
    expect(screen.getByText('The Lost Highway')).toBeInTheDocument();
    expect(screen.queryByText('Neon Dreams')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search concepts/i), { target: { value: '' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'pitch' } });
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('Street Voices')).toBeInTheDocument();
  });

  it('reports row selection by click and Enter, and create clicks', async () => {
    const onSelect = vi.fn();
    const onCreate = vi.fn();
    renderWithStore(<ConceptList onSelect={onSelect} onCreate={onCreate} />);

    fireEvent.click(await screen.findByText('Street Voices'));
    fireEvent.keyDown(screen.getByText('Neon Dreams').closest('tr')!, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: /new concept/i }));

    expect(onSelect).toHaveBeenNthCalledWith(1, 'concept-2');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'concept-3');
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('shows an empty state when there are no concepts', async () => {
    renderWithStore(<ConceptList />, { seed: false });
    expect(await screen.findByText(/no concepts found/i)).toBeInTheDocument();
  });

  it('refreshes when a concept is created elsewhere', async () => {
    const { service } = renderWithStore(<ConceptList />);
    await screen.findByText('Neon Dreams');

    await act(async () => {
      await service.createEntity('concept', {
        title: 'Monsoon Letters',
        vision: 'Pen pals in a flooded city',
        genre: ['Drama'],
        format: 'feature',
        duration: 100,
        status: 'ideation',
        budgetEstimate: 900000,
      });
    });

    expect(await screen.findByText('Monsoon Letters')).toBeInTheDocument();
  });

  it('shows an error state when loading fails', async () => {
    const service = new FilmEntityService();
    vi.spyOn(service, 'getEntities').mockRejectedValue(new Error('store offline'));
    render(
      <FilmEntityProvider service={service}>
        <ConceptList />
      </FilmEntityProvider>
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('store offline');
  });
});

describe('ConceptForm', () => {
  it('submits the entered data, including toggled genres', async () => {
    const onSubmit = vi.fn();
    render(<ConceptForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Concept Title'), { target: { name: 'title', value: 'Monsoon Letters' } });
    fireEvent.change(screen.getByLabelText('Vision & Concept'), { target: { name: 'vision', value: 'Pen pals' } });
    fireEvent.change(screen.getByLabelText('Format'), { target: { name: 'format', value: 'short' } });
    fireEvent.change(screen.getByLabelText('Duration (minutes)'), { target: { name: 'duration', value: '30' } });
    fireEvent.click(screen.getByLabelText('Drama'));
    fireEvent.click(screen.getByLabelText('Comedy'));
    fireEvent.click(screen.getByLabelText('Comedy'));
    fireEvent.click(screen.getByRole('button', { name: 'Save Concept' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Monsoon Letters',
      vision: 'Pen pals',
      genre: ['Drama'],
      format: 'short',
      duration: 30,
      budgetEstimate: 1000000,
    });
  });

  it('prefills from initialData and calls onCancel', () => {
    const onCancel = vi.fn();
    render(
      <ConceptForm
        onCancel={onCancel}
        submitLabel="Update"
        initialData={{ title: 'Existing', vision: 'v', genre: ['Thriller'], format: 'feature', duration: 90, budgetEstimate: 5 }}
      />
    );

    expect(screen.getByLabelText('Concept Title')).toHaveValue('Existing');
    expect(screen.getByLabelText('Thriller')).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('disables submit while an async submit is pending', async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(<ConceptForm onSubmit={onSubmit} initialData={{ title: 'T', vision: 'V', genre: [], format: 'feature', duration: 90, budgetEstimate: 1 }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save Concept' }));
    expect(await screen.findByRole('button', { name: 'Saving…' })).toBeDisabled();

    await act(async () => resolve());
    expect(screen.getByRole('button', { name: 'Save Concept' })).toBeEnabled();
  });
});

describe('CreateConcept', () => {
  it('persists a new ideation-stage concept and reports it', async () => {
    const onCreated = vi.fn();
    const { service } = renderWithStore(<CreateConcept onCreated={onCreated} />);

    fireEvent.change(screen.getByLabelText('Concept Title'), { target: { name: 'title', value: 'Monsoon Letters' } });
    fireEvent.change(screen.getByLabelText('Vision & Concept'), { target: { name: 'vision', value: 'Pen pals' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Concept' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    const created = onCreated.mock.calls[0][0];
    expect(created).toMatchObject({ title: 'Monsoon Letters', status: 'ideation' });
    expect(await service.getEntity('concept', created.id)).toMatchObject({ title: 'Monsoon Letters' });
    expect(await service.getEntities('concept')).toHaveLength(4);
  });
});

describe('ConceptDetail', () => {
  it('renders the requested concept', async () => {
    renderWithStore(<ConceptDetail conceptId="concept-2" />);
    expect(await screen.findByRole('heading', { name: 'Street Voices' })).toBeInTheDocument();
    expect(screen.getByText('SHORT • 45 min')).toBeInTheDocument();
    expect(screen.getByText('Pitch')).toBeInTheDocument();
  });

  it('falls back to the first concept when no id is given', async () => {
    renderWithStore(<ConceptDetail />);
    expect(await screen.findByRole('heading', { name: 'The Lost Highway' })).toBeInTheDocument();
  });

  it('shows not-found for an unknown id', async () => {
    renderWithStore(<ConceptDetail conceptId="missing" />);
    expect(await screen.findByText('Concept not found.')).toBeInTheDocument();
  });

  it('wires Edit and Share actions', async () => {
    const onEdit = vi.fn();
    const onShare = vi.fn();
    renderWithStore(<ConceptDetail conceptId="concept-1" onEdit={onEdit} onShare={onShare} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Edit Concept' }));
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    expect(onEdit).toHaveBeenCalledWith('concept-1');
    expect(onShare).toHaveBeenCalledWith('concept-1');
  });
});

// ---------------------------------------------------------------------------
// Scripts
// ---------------------------------------------------------------------------

describe('ScriptList', () => {
  it('lists scripts and filters by status', async () => {
    renderWithStore(<ScriptList />);
    await screen.findByText('Neon Dreams - WIP');
    expect(screen.getByText('The Lost Highway - Revised')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'locked' } });
    expect(screen.getByText('The Lost Highway - Revised')).toBeInTheDocument();
    expect(screen.queryByText('Neon Dreams - WIP')).not.toBeInTheDocument();
  });

  it('creates a blank draft from "+ New Script"', async () => {
    const onCreated = vi.fn();
    const { service } = renderWithStore(<ScriptList onCreated={onCreated} conceptId="concept-3" currentUser="Tester" />);
    await screen.findByText('Neon Dreams - WIP');

    fireEvent.click(screen.getByRole('button', { name: /new script/i }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(onCreated.mock.calls[0][0]).toMatchObject({
      title: 'Untitled Script',
      conceptId: 'concept-3',
      status: 'draft',
      createdBy: 'Tester',
    });
    expect(await service.getEntities('script')).toHaveLength(4);
    expect(await screen.findByText('Untitled Script')).toBeInTheDocument();
  });

  it('reports card selection', async () => {
    const onSelect = vi.fn();
    renderWithStore(<ScriptList onSelect={onSelect} />);
    fireEvent.click(await screen.findByText('Street Voices - Final Draft'));
    expect(onSelect).toHaveBeenCalledWith('script-2');
  });
});

describe('ScriptDetail', () => {
  it('shows metadata and version history newest first', async () => {
    renderWithStore(<ScriptDetail scriptId="script-1" />);
    await screen.findByRole('heading', { name: 'The Lost Highway - Revised' });

    expect(screen.getByText('127')).toBeInTheDocument();
    const versions = screen.getAllByText(/^Version \d$/).map((el) => el.textContent);
    expect(versions).toEqual(['Version 5', 'Version 4', 'Version 3', 'Version 2', 'Version 1']);
  });

  it('wires Open Editor', async () => {
    const onOpenEditor = vi.fn();
    renderWithStore(<ScriptDetail scriptId="script-2" onOpenEditor={onOpenEditor} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open Editor' }));
    expect(onOpenEditor).toHaveBeenCalledWith('script-2');
  });

  it('shows not-found for an unknown id', async () => {
    renderWithStore(<ScriptDetail scriptId="missing" />);
    expect(await screen.findByText('Script not found.')).toBeInTheDocument();
  });
});

describe('ScriptEditor', () => {
  it('opens the current version, read-only while locked', async () => {
    renderWithStore(<ScriptEditor scriptId="script-1" />);
    const editor = await screen.findByLabelText('Script content');

    await waitFor(() => expect(editor).toHaveValue('FADE IN:\n\nEXT. DESERTED HIGHWAY - NIGHT\n\nA lone figure walks slowly...'));
    expect(editor).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Unlock' })).toBeInTheDocument();
  });

  it('switches to an older version', async () => {
    renderWithStore(<ScriptEditor scriptId="script-1" />);
    await screen.findByLabelText('Script content');

    fireEvent.click(screen.getByText('v1'));
    expect(screen.getByLabelText('Script content')).toHaveValue('FADE IN:\n\nEXT. HIGHWAY - NIGHT\n\n(Initial draft)');
  });

  it('saves edits as a new version without overwriting history', async () => {
    const { service } = renderWithStore(<ScriptEditor scriptId="script-3" currentUser="Tester" />);
    const editor = await screen.findByLabelText('Script content');
    await waitFor(() => expect(editor).toHaveValue('FADE IN:\n\nINT. VR LAB - NIGHT'));

    fireEvent.change(editor, { target: { value: 'FADE IN:\n\nINT. VR LAB - NIGHT\n\nScreens flicker.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(async () => {
      const script = await service.getEntity('script', 'script-3');
      expect(script?.currentVersion).toBe(2);
    });
    const script = (await service.getEntity('script', 'script-3'))!;
    expect(script.versions).toHaveLength(2);
    expect(script.versions[0].content).toBe('FADE IN:\n\nINT. VR LAB - NIGHT');
    expect(script.versions[1]).toMatchObject({ version: 2, createdBy: 'Tester', changesSummary: 'Edited from v1' });
    expect(script.lastEditedBy).toBe('Tester');
    expect(await screen.findByText('v2')).toBeInTheDocument();
  });

  it('toggles the lock state in the store', async () => {
    const { service } = renderWithStore(<ScriptEditor scriptId="script-3" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Lock Version' }));

    expect(await screen.findByRole('button', { name: 'Unlock' })).toBeInTheDocument();
    expect((await service.getEntity('script', 'script-3'))?.status).toBe('locked');
  });
});

// ---------------------------------------------------------------------------
// Storyboards
// ---------------------------------------------------------------------------

describe('StoryboardList', () => {
  it('derives scene and shot counts from the storyboard', async () => {
    renderWithStore(<StoryboardList />);
    const card = (await screen.findByText('The Lost Highway - Full')).closest('[role="button"]') as HTMLElement;

    expect(within(card).getByText('Scenes').nextSibling).toHaveTextContent('2');
    expect(within(card).getByText('Shots').nextSibling).toHaveTextContent('4');
  });

  it('reports selection and create', async () => {
    const onSelect = vi.fn();
    const onCreate = vi.fn();
    renderWithStore(<StoryboardList onSelect={onSelect} onCreate={onCreate} />);

    fireEvent.click(await screen.findByText('Street Voices - Rough Pass'));
    fireEvent.click(screen.getByRole('button', { name: /new storyboard/i }));
    expect(onSelect).toHaveBeenCalledWith('storyboard-2');
    expect(onCreate).toHaveBeenCalled();
  });
});

describe('StoryboardGrid', () => {
  it('renders scenes and shots for the storyboard', async () => {
    renderWithStore(<StoryboardGrid storyboardId="storyboard-1" />);
    expect(await screen.findByText(/Storyboard: The Lost Highway - Full/)).toBeInTheDocument();
    expect(screen.getByText('Scene 2: INT. CAR - CONTINUOUS')).toBeInTheDocument();
    expect(screen.getByText('Driver POV through windshield')).toBeInTheDocument();
  });

  it('marks the selected shot', async () => {
    renderWithStore(<StoryboardGrid storyboardId="storyboard-1" />);
    const shot = (await screen.findByText('Shot 3')).closest('[role="button"]') as HTMLElement;

    expect(shot).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(shot);
    expect(shot).toHaveAttribute('aria-pressed', 'true');
  });

  it('persists a new scene', async () => {
    const { service } = renderWithStore(<StoryboardGrid storyboardId="storyboard-1" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Add Scene' }));

    expect(await screen.findByText('Scene 3: Scene 3')).toBeInTheDocument();
    expect((await service.getEntity('storyboard', 'storyboard-1'))?.scenes).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// Filming
// ---------------------------------------------------------------------------

describe('FilmingLog', () => {
  it('shows the most recent shooting day with take totals', async () => {
    renderWithStore(<FilmingLog />);
    expect(await screen.findByText('Highway overpass - Mile 23')).toBeInTheDocument();
    expect(screen.getByText('5 kept / 11 total')).toBeInTheDocument();
    expect(screen.getByText('7 takes')).toBeInTheDocument();
  });

  it('shows a specific day by id', async () => {
    renderWithStore(<FilmingLog filmingDayId="filming-2026-11-19" />);
    expect(await screen.findByText('Interior car rig - Stage 2')).toBeInTheDocument();
  });

  it('logs a new take to the store', async () => {
    const { service } = renderWithStore(<FilmingLog />);
    fireEvent.click(await screen.findByRole('button', { name: '+ Log New Take' }));

    expect(await screen.findByText('8 takes')).toBeInTheDocument();
    const day = await service.getEntity('filming', 'filming-2026-11-20');
    expect(day?.shots[0].takes.at(-1)).toMatchObject({ takeNumber: 8, status: 'review' });
  });

  it('expands another shot', async () => {
    renderWithStore(<FilmingLog />);
    await screen.findByText('Highway overpass - Mile 23');
    expect(screen.queryByText('Boom shadow visible')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Shot 2'));
    expect(screen.getByText('Boom shadow visible')).toBeInTheDocument();
  });

  it('shows an empty state with no shooting days', async () => {
    renderWithStore(<FilmingLog />, { seed: false });
    expect(await screen.findByText('No shooting days logged yet.')).toBeInTheDocument();
  });
});

describe('DailiesView', () => {
  it('derives clips from kept and review takes', async () => {
    renderWithStore(<DailiesView />);
    expect(await screen.findByRole('option', { name: 'All Footage (9 clips)' })).toBeInTheDocument();
    expect(screen.getByText('S2 Sh3 T2')).toBeInTheDocument();
    expect(screen.queryByText('S1 Sh1 T1')).not.toBeInTheDocument(); // retake
  });

  it('filters to kept footage', async () => {
    renderWithStore(<DailiesView />);
    fireEvent.change(await screen.findByRole('combobox'), { target: { value: 'kept' } });
    expect(screen.queryByText('S1 Sh2 T2')).not.toBeInTheDocument(); // review
    expect(screen.getByText('S1 Sh1 T5')).toBeInTheDocument();
  });

  it('buildDailies groups by day, newest first, and drops empty days', () => {
    const groups = buildDailies([
      { id: 'a', createdAt: new Date(), updatedAt: new Date(), date: new Date('2026-01-01'), location: '', camera: '', operator: '', shots: [{ shotNumber: 1, sceneNumber: 1, takes: [{ takeNumber: 1, duration: 1, status: 'retake', notes: '', timestamp: new Date() }] }] },
      { id: 'b', createdAt: new Date(), updatedAt: new Date(), date: new Date('2026-01-02'), location: '', camera: '', operator: '', shots: [{ shotNumber: 2, sceneNumber: 1, takes: [{ takeNumber: 1, duration: 1, status: 'kept', notes: '', timestamp: new Date() }] }] },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].footage[0]).toMatchObject({ shotNumber: 2, fileSize: 0 });
  });
});

// ---------------------------------------------------------------------------
// Screenings
// ---------------------------------------------------------------------------

describe('ScreeningList', () => {
  it('lists screenings with ratings derived from feedback', async () => {
    renderWithStore(<ScreeningList />);
    expect(await screen.findByText('Internal Team Screening')).toBeInTheDocument();
    expect(screen.getByText('4.2/5')).toBeInTheDocument();
    expect(screen.getByText('(5 responses)')).toBeInTheDocument();
    expect(screen.getByText('Film Festival Premiere')).toBeInTheDocument();
  });

  it('reports selection and create', async () => {
    const onSelect = vi.fn();
    const onCreate = vi.fn();
    renderWithStore(<ScreeningList onSelect={onSelect} onCreate={onCreate} />);

    fireEvent.click(await screen.findByText('Test Screening - Focus Group'));
    fireEvent.click(screen.getByRole('button', { name: /schedule screening/i }));
    expect(onSelect).toHaveBeenCalledWith('screening-2');
    expect(onCreate).toHaveBeenCalled();
  });

  it('averageRating handles empty feedback', () => {
    expect(averageRating([])).toBeNull();
  });
});

describe('FeedbackCollection', () => {
  it('summarises feedback for a screening', async () => {
    renderWithStore(<FeedbackCollection screeningId="screening-1" />);
    expect(await screen.findByText(/Feedback Results: Internal Team Screening/)).toBeInTheDocument();
    expect(screen.getByText('4.2/5 ⭐')).toBeInTheDocument();
    expect(screen.getByTitle('Positive: 2 (40%)')).toBeInTheDocument();
    expect(screen.getByText('Meera P.')).toBeInTheDocument();
  });

  it('handles a screening with no feedback yet', async () => {
    renderWithStore(<FeedbackCollection screeningId="screening-2" />);
    expect(await screen.findByText('No feedback collected yet')).toBeInTheDocument();
    expect(screen.getByText('0/5 ⭐')).toBeInTheDocument();
  });

  it('calculateFeedbackStats does not produce NaN', () => {
    expect(calculateFeedbackStats([]).avgRating).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Post-production
// ---------------------------------------------------------------------------

describe('EditingTimeline', () => {
  it('renders tracks, clips and stats from the edit', async () => {
    renderWithStore(<EditingTimeline />);
    expect(await screen.findByText('Video 1')).toBeInTheDocument();
    expect(screen.getByText('Shot 3')).toHaveAttribute('title', 'POV');
    expect(screen.getByText('9.0s')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('120s')).toBeInTheDocument();
  });

  it('shows not-found for an unknown edit', async () => {
    renderWithStore(<EditingTimeline editId="missing" />);
    expect(await screen.findByText('Edit not found.')).toBeInTheDocument();
  });
});

describe('EditingLog', () => {
  it('lists versions newest first', async () => {
    renderWithStore(<EditingLog editId="edit-1" />);
    await screen.findByText('v5');
    expect(screen.getAllByText(/^v\d$/).map((el) => el.textContent)).toEqual(['v5', 'v4', 'v3']);
    expect(screen.getByText('Final color pass & sound mix')).toBeInTheDocument();
  });
});

describe('ColorGrading', () => {
  it('lists scene grades in scene order', async () => {
    renderWithStore(<ColorGrading />);
    await screen.findByText('Scene 1');
    expect(screen.getAllByText(/^Scene \d$/).map((el) => el.textContent)).toEqual(['Scene 1', 'Scene 2', 'Scene 3']);
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('Cinematic Warm')).toBeInTheDocument();
  });

  it('reflects store updates', async () => {
    const { service } = renderWithStore(<ColorGrading />);
    await screen.findByText('Scene 3');
    await act(async () => {
      await service.updateEntity('color', 'color-scene-3', { status: 'in-progress', colorist: 'Colorist C', lut: 'Bleach Bypass' });
    });
    expect(await screen.findByText('Bleach Bypass')).toBeInTheDocument();
  });
});

describe('SoundMixing', () => {
  it('renders a fader per track', async () => {
    renderWithStore(<SoundMixing />);
    expect(await screen.findByLabelText('Dialogue level')).toHaveValue('-3');
    expect(screen.getAllByRole('slider')).toHaveLength(4);
  });

  it('persists level, mute and solo changes', async () => {
    const { service } = renderWithStore(<SoundMixing mixId="mix-1" />);
    fireEvent.change(await screen.findByLabelText('Music level'), { target: { value: '-10' } });
    await waitFor(() => expect(screen.getByLabelText('Music level')).toHaveValue('-10'));

    fireEvent.click(screen.getByRole('button', { name: 'Mute Foley' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Mute Foley' })).toHaveAttribute('aria-pressed', 'true'));

    fireEvent.click(screen.getByRole('button', { name: 'Solo Dialogue' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Solo Dialogue' })).toHaveAttribute('aria-pressed', 'true'));
    fireEvent.click(screen.getByRole('button', { name: 'Solo Ambient' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Solo Ambient' })).toHaveAttribute('aria-pressed', 'true'));

    const mix = (await service.getEntity('sound', 'mix-1'))!;
    expect(mix.tracks.find((t) => t.name === 'Music')?.level).toBe(-10);
    expect(mix.tracks.find((t) => t.name === 'Foley')?.muted).toBe(true);
    expect(mix.tracks.filter((t) => t.solo).map((t) => t.name)).toEqual(['Ambient']);
  });

  it('shows an error state when the store fails', async () => {
    const service = new FilmEntityService();
    vi.spyOn(service, 'getEntities').mockRejectedValue(new Error('disk full'));
    render(
      <FilmEntityProvider service={service}>
        <SoundMixing />
      </FilmEntityProvider>
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('disk full');
  });
});
