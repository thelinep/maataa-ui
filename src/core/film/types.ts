/**
 * Phase J × Phase 2: Film Production entity types
 *
 * One record type per workflow. Each is stored in the Phase 2 EntityManager as
 * a `FilmEntity` whose `type` is `film.<kind>` and whose `data` is the record
 * payload below. `id`, `createdAt` and `updatedAt` come from the entity itself.
 */

import type { FilmEntityType } from '../phase2-entity-manager';

// ---------------------------------------------------------------------------
// Pre-production
// ---------------------------------------------------------------------------

export type ConceptFormat = 'feature' | 'short' | 'series';
export type ConceptStatus = 'ideation' | 'pitch' | 'approved';

export interface ConceptAttachment {
  url: string;
  type: string;
  name: string;
}

export interface ConceptData {
  title: string;
  vision: string;
  genre: string[];
  format: ConceptFormat;
  /** Runtime in minutes */
  duration: number;
  status: ConceptStatus;
  /** INR */
  budgetEstimate: number;
  attachments?: ConceptAttachment[];
}

export type ScriptFormat = 'feature' | 'short';
export type ScriptStatus = 'draft' | 'locked' | 'approved';

export interface ScriptVersion {
  version: number;
  content: string;
  changesSummary: string;
  createdAt: Date;
  createdBy: string;
}

export interface ScriptData {
  title: string;
  conceptId: string;
  format: ScriptFormat;
  pages: number;
  currentVersion: number;
  status: ScriptStatus;
  createdBy: string;
  lastEditedBy: string;
  versions: ScriptVersion[];
}

export type StoryboardStatus = 'in-progress' | 'review' | 'approved';

export interface StoryboardShot {
  shotNumber: number;
  sceneNumber: number;
  description: string;
  /** Seconds */
  duration: number;
  cameraMove: string;
  imageUrl?: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  title: string;
  shots: StoryboardShot[];
}

export interface StoryboardData {
  title: string;
  scriptId: string;
  status: StoryboardStatus;
  createdBy: string;
  scenes: StoryboardScene[];
}

// ---------------------------------------------------------------------------
// Production
// ---------------------------------------------------------------------------

export type TakeStatus = 'kept' | 'retake' | 'review';

export interface Take {
  takeNumber: number;
  /** Seconds */
  duration: number;
  status: TakeStatus;
  notes: string;
  timestamp: Date;
  /** Footage size in MB, once offloaded */
  fileSize?: number;
}

export interface FilmingShot {
  shotNumber: number;
  sceneNumber: number;
  takes: Take[];
}

/** One shooting day */
export interface FilmingData {
  date: Date;
  location: string;
  camera: string;
  operator: string;
  shots: FilmingShot[];
}

export type ScreeningType = 'internal' | 'test' | 'premiere';
export type ScreeningStatus = 'scheduled' | 'completed' | 'cancelled';
export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';

export interface ScreeningFeedback {
  id: string;
  name: string;
  /** 1-5 */
  rating: number;
  comment: string;
  timestamp: Date;
  sentiment: FeedbackSentiment;
}

export interface ScreeningData {
  title: string;
  type: ScreeningType;
  date: Date;
  location: string;
  audienceSize: number;
  status: ScreeningStatus;
  feedback: ScreeningFeedback[];
}

// ---------------------------------------------------------------------------
// Post-production
// ---------------------------------------------------------------------------

export type ClipStatus = 'locked' | 'draft' | 'approved';
export type EditVersionStatus = 'draft' | 'review' | 'approved';

export interface TimelineClip {
  id: string;
  /** Seconds */
  startTime: number;
  endTime: number;
  shotNumber: number;
  notes: string;
  status: ClipStatus;
}

export interface EditingTrack {
  trackId: string;
  trackName: string;
  type: 'video' | 'audio';
  clips: TimelineClip[];
}

export interface EditVersion {
  version: number;
  date: Date;
  editor: string;
  changes: string;
  /** Minutes */
  duration: number;
  status: EditVersionStatus;
}

/** One cut of the film: its timeline plus version history */
export interface EditingData {
  title: string;
  /** Timeline length in seconds */
  totalDuration: number;
  tracks: EditingTrack[];
  versions: EditVersion[];
}

export type ColorStatus = 'pending' | 'in-progress' | 'approved';

/** Colour correction for one scene */
export interface ColorData {
  sceneNumber: number;
  status: ColorStatus;
  colorist: string;
  lut: string;
}

export interface AudioTrack {
  name: string;
  /** dB, -24..0 */
  level: number;
  muted: boolean;
  solo: boolean;
}

/** One mix session */
export interface SoundData {
  title: string;
  tracks: AudioTrack[];
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export interface FilmDataMap {
  concept: ConceptData;
  script: ScriptData;
  storyboard: StoryboardData;
  filming: FilmingData;
  screening: ScreeningData;
  editing: EditingData;
  color: ColorData;
  sound: SoundData;
}

export type FilmKind = keyof FilmDataMap;

export const FILM_KINDS: readonly FilmKind[] = [
  'concept',
  'script',
  'storyboard',
  'filming',
  'screening',
  'editing',
  'color',
  'sound',
];

export interface FilmRecordMeta {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What components work with: payload flattened with entity metadata */
export type FilmRecord<K extends FilmKind> = FilmDataMap[K] & FilmRecordMeta;

export type ConceptRecord = FilmRecord<'concept'>;
export type ScriptRecord = FilmRecord<'script'>;
export type StoryboardRecord = FilmRecord<'storyboard'>;
export type FilmingRecord = FilmRecord<'filming'>;
export type ScreeningRecord = FilmRecord<'screening'>;
export type EditingRecord = FilmRecord<'editing'>;
export type ColorRecord = FilmRecord<'color'>;
export type SoundRecord = FilmRecord<'sound'>;

export function toEntityType(kind: FilmKind): FilmEntityType {
  return `film.${kind}` as FilmEntityType;
}
