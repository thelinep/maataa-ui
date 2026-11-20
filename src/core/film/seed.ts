/**
 * Phase J seed data
 *
 * The sample records the Phase J components previously held in local
 * `useState` mocks, moved here so they flow through the EntityManager.
 * IDs are stable so cross-references (script.conceptId, storyboard.scriptId)
 * resolve. Dailies are derived from filming takes, so footage sizes live on
 * the takes themselves.
 */

import type { FilmDataMap, FilmKind } from './types';

export interface FilmSeedRecord<K extends FilmKind> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  data: FilmDataMap[K];
}

export type FilmSeed = { [K in FilmKind]: FilmSeedRecord<K>[] };

const d = (iso: string) => new Date(iso);

export function createFilmSeed(): FilmSeed {
  return {
    concept: [
      {
        id: 'concept-1',
        createdAt: d('2026-11-01'),
        updatedAt: d('2026-11-15'),
        data: {
          title: 'The Lost Highway',
          vision: 'A noir thriller about a jazz musician searching for his past',
          genre: ['Thriller', 'Drama'],
          format: 'feature',
          duration: 120,
          status: 'approved',
          budgetEstimate: 2500000,
          attachments: [],
        },
      },
      {
        id: 'concept-2',
        createdAt: d('2026-11-05'),
        updatedAt: d('2026-11-18'),
        data: {
          title: 'Street Voices',
          vision: 'Documentary exploring street musicians in urban centers',
          genre: ['Documentary'],
          format: 'short',
          duration: 45,
          status: 'pitch',
          budgetEstimate: 150000,
          attachments: [],
        },
      },
      {
        id: 'concept-3',
        createdAt: d('2026-11-10'),
        updatedAt: d('2026-11-20'),
        data: {
          title: 'Neon Dreams',
          vision: 'Experimental short on virtual reality and identity',
          genre: ['Sci-Fi', 'Experimental'],
          format: 'short',
          duration: 15,
          status: 'ideation',
          budgetEstimate: 75000,
          attachments: [],
        },
      },
    ],

    script: [
      {
        id: 'script-1',
        createdAt: d('2026-11-01'),
        updatedAt: d('2026-11-18'),
        data: {
          title: 'The Lost Highway - Revised',
          conceptId: 'concept-1',
          format: 'feature',
          pages: 127,
          currentVersion: 5,
          status: 'locked',
          createdBy: 'Hemant',
          lastEditedBy: 'Hemant',
          versions: [
            { version: 1, content: 'FADE IN:\n\nEXT. HIGHWAY - NIGHT\n\n(Initial draft)', changesSummary: 'Initial draft - full screenplay written', createdAt: d('2026-11-01'), createdBy: 'Hemant' },
            { version: 2, content: 'FADE IN:\n\nEXT. DESERTED HIGHWAY - NIGHT\n\n(Revised)', changesSummary: 'Scene revisions - improved pacing in Act 2', createdAt: d('2026-11-05'), createdBy: 'Dev' },
            { version: 3, content: 'FADE IN:\n\nEXT. DESERTED HIGHWAY - NIGHT\n\nA lone figure...', changesSummary: 'Character development - deepened protagonist backstory', createdAt: d('2026-11-10'), createdBy: 'Hemant' },
            { version: 4, content: 'FADE IN:\n\nEXT. DESERTED HIGHWAY - NIGHT\n\nA lone figure walks...', changesSummary: 'Dialogue polish - refined key conversations', createdAt: d('2026-11-15'), createdBy: 'Hemant' },
            { version: 5, content: 'FADE IN:\n\nEXT. DESERTED HIGHWAY - NIGHT\n\nA lone figure walks slowly...', changesSummary: 'Final revision - locked for pre-production', createdAt: d('2026-11-18'), createdBy: 'Hemant' },
          ],
        },
      },
      {
        id: 'script-2',
        createdAt: d('2026-11-05'),
        updatedAt: d('2026-11-15'),
        data: {
          title: 'Street Voices - Final Draft',
          conceptId: 'concept-2',
          format: 'short',
          pages: 32,
          currentVersion: 3,
          status: 'approved',
          createdBy: 'Dev',
          lastEditedBy: 'Hemant',
          versions: [
            { version: 1, content: 'FADE IN:\n\nEXT. CITY SQUARE - DAY', changesSummary: 'First pass from interview transcripts', createdAt: d('2026-11-05'), createdBy: 'Dev' },
            { version: 2, content: 'FADE IN:\n\nEXT. CITY SQUARE - DAY\n\nA saxophone echoes...', changesSummary: 'Restructured around three musicians', createdAt: d('2026-11-10'), createdBy: 'Dev' },
            { version: 3, content: 'FADE IN:\n\nEXT. CITY SQUARE - DAY\n\nA saxophone echoes off the stone...', changesSummary: 'Final draft approved', createdAt: d('2026-11-15'), createdBy: 'Hemant' },
          ],
        },
      },
      {
        id: 'script-3',
        createdAt: d('2026-11-10'),
        updatedAt: d('2026-11-20'),
        data: {
          title: 'Neon Dreams - WIP',
          conceptId: 'concept-3',
          format: 'short',
          pages: 8,
          currentVersion: 1,
          status: 'draft',
          createdBy: 'Hemant',
          lastEditedBy: 'Hemant',
          versions: [
            { version: 1, content: 'FADE IN:\n\nINT. VR LAB - NIGHT', changesSummary: 'Working draft', createdAt: d('2026-11-10'), createdBy: 'Hemant' },
          ],
        },
      },
    ],

    storyboard: [
      {
        id: 'storyboard-1',
        createdAt: d('2026-11-10'),
        updatedAt: d('2026-11-18'),
        data: {
          title: 'The Lost Highway - Full',
          scriptId: 'script-1',
          status: 'approved',
          createdBy: 'Storyboard Artist',
          scenes: [
            {
              sceneNumber: 1,
              title: 'EXT. HIGHWAY - NIGHT',
              shots: [
                { shotNumber: 1, sceneNumber: 1, description: 'Wide establishing shot of empty highway', duration: 3, cameraMove: 'Static' },
                { shotNumber: 2, sceneNumber: 1, description: 'Close-up of road markings', duration: 2, cameraMove: 'Push in' },
              ],
            },
            {
              sceneNumber: 2,
              title: 'INT. CAR - CONTINUOUS',
              shots: [
                { shotNumber: 3, sceneNumber: 2, description: 'Driver POV through windshield', duration: 4, cameraMove: 'Steady cam' },
                { shotNumber: 4, sceneNumber: 2, description: 'Profile of driver in dim light', duration: 3, cameraMove: 'Pan right' },
              ],
            },
          ],
        },
      },
      {
        id: 'storyboard-2',
        createdAt: d('2026-11-15'),
        updatedAt: d('2026-11-20'),
        data: {
          title: 'Street Voices - Rough Pass',
          scriptId: 'script-2',
          status: 'in-progress',
          createdBy: 'Visual Director',
          scenes: [
            {
              sceneNumber: 1,
              title: 'EXT. CITY SQUARE - DAY',
              shots: [
                { shotNumber: 1, sceneNumber: 1, description: 'Crowd gathering around saxophonist', duration: 5, cameraMove: 'Crane down' },
              ],
            },
          ],
        },
      },
    ],

    filming: [
      {
        id: 'filming-2026-11-19',
        createdAt: d('2026-11-19'),
        updatedAt: d('2026-11-19'),
        data: {
          date: d('2026-11-19'),
          location: 'Interior car rig - Stage 2',
          camera: 'RED Monstro 8K',
          operator: 'Cinematographer Team',
          shots: [
            {
              shotNumber: 3,
              sceneNumber: 2,
              takes: [
                { takeNumber: 1, duration: 4.4, status: 'retake', notes: 'Reflection on windshield', timestamp: d('2026-11-19T14:15:00') },
                { takeNumber: 2, duration: 4.5, status: 'kept', notes: 'Clean POV', timestamp: d('2026-11-19T14:30:00'), fileSize: 1200 },
              ],
            },
            {
              shotNumber: 4,
              sceneNumber: 2,
              takes: [
                { takeNumber: 1, duration: 3.8, status: 'review', notes: 'Check exposure on profile', timestamp: d('2026-11-19T15:00:00'), fileSize: 1010 },
              ],
            },
          ],
        },
      },
      {
        id: 'filming-2026-11-20',
        createdAt: d('2026-11-20'),
        updatedAt: d('2026-11-20'),
        data: {
          date: d('2026-11-20'),
          location: 'Highway overpass - Mile 23',
          camera: 'RED Monstro 8K',
          operator: 'Cinematographer Team',
          shots: [
            {
              shotNumber: 1,
              sceneNumber: 1,
              takes: [
                { takeNumber: 1, duration: 3.2, status: 'retake', notes: 'Focus missed on car entrance', timestamp: d('2026-11-20T06:30:00') },
                { takeNumber: 2, duration: 3.1, status: 'retake', notes: 'Lighting not ready', timestamp: d('2026-11-20T06:45:00') },
                { takeNumber: 3, duration: 3.0, status: 'review', notes: 'Good lighting, check focus', timestamp: d('2026-11-20T07:00:00'), fileSize: 790 },
                { takeNumber: 4, duration: 2.9, status: 'retake', notes: 'Wind mic picked up', timestamp: d('2026-11-20T07:15:00') },
                { takeNumber: 5, duration: 3.2, status: 'kept', notes: 'Perfect - all elements aligned', timestamp: d('2026-11-20T07:30:00'), fileSize: 850 },
                { takeNumber: 6, duration: 3.1, status: 'kept', notes: 'Alternate angle', timestamp: d('2026-11-20T07:45:00'), fileSize: 820 },
                { takeNumber: 7, duration: 3.0, status: 'kept', notes: 'Wide shot backup', timestamp: d('2026-11-20T08:00:00'), fileSize: 795 },
              ],
            },
            {
              shotNumber: 2,
              sceneNumber: 1,
              takes: [
                { takeNumber: 1, duration: 2.5, status: 'retake', notes: 'Boom shadow visible', timestamp: d('2026-11-20T08:30:00') },
                { takeNumber: 2, duration: 2.4, status: 'review', notes: 'Good but slightly soft', timestamp: d('2026-11-20T08:45:00'), fileSize: 630 },
                { takeNumber: 3, duration: 2.6, status: 'kept', notes: 'Strong detail', timestamp: d('2026-11-20T09:00:00'), fileSize: 680 },
                { takeNumber: 4, duration: 2.5, status: 'kept', notes: 'Alt version', timestamp: d('2026-11-20T09:15:00'), fileSize: 670 },
              ],
            },
          ],
        },
      },
    ],

    screening: [
      {
        id: 'screening-1',
        createdAt: d('2026-11-10'),
        updatedAt: d('2026-11-15'),
        data: {
          title: 'Internal Team Screening',
          type: 'internal',
          date: d('2026-11-15'),
          location: 'Post Production Suite',
          audienceSize: 12,
          status: 'completed',
          feedback: [
            { id: 'f1', name: 'Abhishek D.', rating: 5, comment: 'Outstanding cinematography and compelling narrative. The highway scenes are absolutely stunning.', timestamp: d('2026-11-15T20:30:00'), sentiment: 'positive' },
            { id: 'f2', name: 'Priya S.', rating: 4, comment: 'Strong first half, pacing could be tighter in Act 2. Character development is excellent.', timestamp: d('2026-11-15T20:45:00'), sentiment: 'neutral' },
            { id: 'f3', name: 'Rajesh K.', rating: 5, comment: 'This is cinema. Every frame tells a story. The music elevates the narrative beautifully.', timestamp: d('2026-11-15T21:00:00'), sentiment: 'positive' },
            { id: 'f4', name: 'Meera P.', rating: 3, comment: 'Good attempt but the ending felt rushed. Too many plot threads left unresolved.', timestamp: d('2026-11-15T21:15:00'), sentiment: 'negative' },
            { id: 'f5', name: 'Amit S.', rating: 4, comment: 'Well-crafted thriller with excellent performances. Minor issues with sound mixing.', timestamp: d('2026-11-15T21:30:00'), sentiment: 'neutral' },
          ],
        },
      },
      {
        id: 'screening-2',
        createdAt: d('2026-11-12'),
        updatedAt: d('2026-11-12'),
        data: {
          title: 'Test Screening - Focus Group',
          type: 'test',
          date: d('2026-11-25'),
          location: 'Cinema Multiplex',
          audienceSize: 60,
          status: 'scheduled',
          feedback: [],
        },
      },
      {
        id: 'screening-3',
        createdAt: d('2026-11-14'),
        updatedAt: d('2026-11-14'),
        data: {
          title: 'Film Festival Premiere',
          type: 'premiere',
          date: d('2026-12-10'),
          location: 'Main Theater - Film Fest',
          audienceSize: 500,
          status: 'scheduled',
          feedback: [],
        },
      },
    ],

    editing: [
      {
        id: 'edit-1',
        createdAt: d('2026-11-15'),
        updatedAt: d('2026-11-20'),
        data: {
          title: 'The Lost Highway - Main Cut',
          totalDuration: 120,
          tracks: [
            {
              trackId: 'v1',
              trackName: 'Video 1',
              type: 'video',
              clips: [
                { id: 'c1', startTime: 0, endTime: 3.2, shotNumber: 1, notes: 'Wide shot', status: 'locked' },
                { id: 'c2', startTime: 3.2, endTime: 5.8, shotNumber: 2, notes: 'Close-up', status: 'locked' },
                { id: 'c3', startTime: 5.8, endTime: 9.0, shotNumber: 3, notes: 'POV', status: 'approved' },
              ],
            },
            {
              trackId: 'a1',
              trackName: 'Audio 1',
              type: 'audio',
              clips: [{ id: 'a1', startTime: 0, endTime: 9.0, shotNumber: 0, notes: 'Dialogue', status: 'locked' }],
            },
          ],
          versions: [
            { version: 3, date: d('2026-11-15'), editor: 'Assistant Editor', changes: 'Initial assembly from selects', duration: 140, status: 'draft' },
            { version: 4, date: d('2026-11-18'), editor: 'Lead Editor', changes: 'Scene reordering and pacing', duration: 125, status: 'review' },
            { version: 5, date: d('2026-11-20'), editor: 'Editor Team', changes: 'Final color pass & sound mix', duration: 118, status: 'approved' },
          ],
        },
      },
    ],

    color: [
      { id: 'color-scene-1', createdAt: d('2026-11-18'), updatedAt: d('2026-11-20'), data: { sceneNumber: 1, status: 'approved', colorist: 'Colorist A', lut: 'Cinematic Warm' } },
      { id: 'color-scene-2', createdAt: d('2026-11-18'), updatedAt: d('2026-11-20'), data: { sceneNumber: 2, status: 'in-progress', colorist: 'Colorist B', lut: 'Cool Tone' } },
      { id: 'color-scene-3', createdAt: d('2026-11-18'), updatedAt: d('2026-11-18'), data: { sceneNumber: 3, status: 'pending', colorist: '', lut: '' } },
    ],

    sound: [
      {
        id: 'mix-1',
        createdAt: d('2026-11-19'),
        updatedAt: d('2026-11-20'),
        data: {
          title: 'The Lost Highway - Final Mix',
          tracks: [
            { name: 'Dialogue', level: -3, muted: false, solo: false },
            { name: 'Music', level: -6, muted: false, solo: false },
            { name: 'Foley', level: -9, muted: false, solo: false },
            { name: 'Ambient', level: -12, muted: false, solo: false },
          ],
        },
      },
    ],
  };
}
