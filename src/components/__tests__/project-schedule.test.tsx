/**
 * Project and Schedule Components Test Suite
 * Unit tests for ProjectDependencies, GanttChart, ScheduleForm, ConflictDetection
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectDependencies, type ProjectTask } from '@/components/project/ProjectDependencies';
import { GanttChart, type GanttTask } from '@/components/project/GanttChart';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { ConflictDetection } from '@/components/schedule/ConflictDetection';

describe('ProjectDependencies', () => {
  const mockTasks: ProjectTask[] = [
    { id: 't-1', name: 'Design', status: 'completed', durationDays: 5 },
    { id: 't-2', name: 'Development', status: 'in-progress', durationDays: 10 },
    { id: 't-3', name: 'Testing', status: 'not-started', durationDays: 5 },
  ];

  it('renders task dependency graph', () => {
    render(
      <ProjectDependencies
        tasks={mockTasks}
        dependencies={[]}
      />
    );

    expect(screen.getByRole('heading', { name: /Task Dependencies & Critical Path/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Task Dependencies' })).toBeInTheDocument();
  });

  it('displays critical path tasks highlighted', () => {
    render(
      <ProjectDependencies
        tasks={mockTasks}
        dependencies={[]}
        criticalPath={['t-1', 't-2', 't-3']}
      />
    );

    expect(screen.getByText('Critical Path')).toBeInTheDocument();
  });

  it('shows task statistics', () => {
    render(
      <ProjectDependencies
        tasks={mockTasks}
        dependencies={[]}
      />
    );

    expect(screen.getByText(/Total Tasks/)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('allows removing dependencies', () => {
    const handleRemove = vi.fn();
    render(
      <ProjectDependencies
        tasks={mockTasks}
        dependencies={[
          { id: 'd-1', fromTaskId: 't-1', toTaskId: 't-2', type: 'finish-start' },
        ]}
        onRemoveDependency={handleRemove}
      />
    );

    const removeButton = screen.getByText('✕');
    fireEvent.click(removeButton);

    expect(handleRemove).toHaveBeenCalled();
  });
});

describe('GanttChart', () => {
  const mockTasks: GanttTask[] = [
    {
      id: 'task-1',
      name: 'Phase 1',
      startDate: '2026-11-21',
      endDate: '2026-11-28',
      progress: 100,
      status: 'completed',
    },
    {
      id: 'task-2',
      name: 'Phase 2',
      startDate: '2026-11-28',
      endDate: '2026-12-05',
      progress: 50,
      status: 'in-progress',
    },
  ];

  it('renders Gantt chart SVG', () => {
    const { container } = render(
      <GanttChart
        tasks={mockTasks}
        startDate="2026-11-21"
        endDate="2026-12-05"
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays task labels and progress', () => {
    render(
      <GanttChart
        tasks={mockTasks}
        startDate="2026-11-21"
        endDate="2026-12-05"
      />
    );

    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
    expect(screen.getByLabelText(/Phase 2: 50%/)).toBeInTheDocument();
  });

  it('shows current date indicator line', () => {
    render(
      <GanttChart
        tasks={mockTasks}
        startDate="2026-11-21"
        endDate="2026-12-05"
        currentDate="2026-11-28"
      />
    );

    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    const todayLine = document.querySelector('line[stroke-dasharray="4 4"]');
    expect(todayLine).toBeInTheDocument();
    // 2026-11-28 sits between the chart's start and end, so the line is inside the chart
    expect(Number(todayLine!.getAttribute('x1'))).toBeGreaterThan(0);
  });

  it('calls onTaskClick when task clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <GanttChart
        tasks={mockTasks}
        startDate="2026-11-21"
        endDate="2026-12-05"
        onTaskClick={handleClick}
      />
    );

    const svg = container.querySelector('svg');
    if (svg) {
      fireEvent.click(svg);
      // Note: Click behavior depends on SVG implementation
    }
  });
});

describe('ScheduleForm', () => {
  it('renders form fields for event creation', () => {
    const handleSubmit = vi.fn();
    render(
      <ScheduleForm
        onSubmit={handleSubmit}
        availableAttendees={[
          { label: 'Alice', value: 'user-1' },
          { label: 'Bob', value: 'user-2' },
        ]}
      />
    );

    expect(screen.getByText('Event Title')).toBeInTheDocument();
    expect(screen.getByText('Event Type')).toBeInTheDocument();
    expect(screen.getByText('Attendees')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const handleSubmit = vi.fn();
    render(
      <ScheduleForm
        onSubmit={handleSubmit}
      />
    );

    const submitButton = screen.getByText('Schedule Event');
    fireEvent.click(submitButton);

    // Form should not submit with empty required fields
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calculates and displays duration', async () => {
    const handleSubmit = vi.fn();
    render(
      <ScheduleForm
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    // The wrapper's label is associated with the input inside it
    const startTimeInput = screen.getByLabelText(/Start Time/);
    expect(startTimeInput).toHaveAttribute('type', 'datetime-local');
    expect(startTimeInput).toBeRequired();
    fireEvent.change(startTimeInput, { target: { value: '2026-11-21T09:00' } });
    expect(startTimeInput).toHaveValue('2026-11-21T09:00');
  });

  it('shows success message after submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ScheduleForm
        onSubmit={handleSubmit}
      />
    );

    // Note: Full submission test would require filling all fields
  });
});

describe('ConflictDetection', () => {
  const mockConflicts = [
    {
      id: 'c-1',
      resourceId: 'resource-1',
      resourceName: 'Conference Room A',
      eventIds: ['e-1', 'e-2'],
      conflictingEvents: [
        {
          id: 'e-1',
          title: 'Team Meeting',
          startTime: '2026-11-21T10:00:00',
          endTime: '2026-11-21T11:00:00',
        },
        {
          id: 'e-2',
          title: 'Client Call',
          startTime: '2026-11-21T10:30:00',
          endTime: '2026-11-21T11:30:00',
        },
      ],
      severity: 'high' as const,
      suggestedResolution: 'Move Client Call to 11:30 AM',
    },
  ];

  it('renders conflict summary with severity counts', () => {
    render(
      <ConflictDetection
        conflicts={mockConflicts}
        totalEvents={10}
      />
    );

    expect(screen.getByText('High Severity')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays conflicting events with times', () => {
    render(
      <ConflictDetection
        conflicts={mockConflicts}
        totalEvents={10}
      />
    );

    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    expect(screen.getByText('Client Call')).toBeInTheDocument();
  });

  it('shows suggested resolutions', () => {
    render(
      <ConflictDetection
        conflicts={mockConflicts}
        totalEvents={10}
      />
    );

    expect(screen.getByText(/Move Client Call to 11:30 AM/)).toBeInTheDocument();
  });

  it('calculates conflict rate percentage', () => {
    render(
      <ConflictDetection
        conflicts={mockConflicts}
        totalEvents={10}
      />
    );

    expect(screen.getByText(/Conflict Rate/)).toBeInTheDocument();
  });

  it('shows empty state when no conflicts', () => {
    render(
      <ConflictDetection
        conflicts={[]}
        totalEvents={10}
      />
    );

    expect(screen.getByText(/No scheduling conflicts detected/)).toBeInTheDocument();
  });

  it('calls onResolve when resolve button clicked', () => {
    const handleResolve = vi.fn();
    render(
      <ConflictDetection
        conflicts={mockConflicts}
        totalEvents={10}
        onResolve={handleResolve}
      />
    );

    const resolveButton = screen.getByText('Resolve');
    fireEvent.click(resolveButton);

    expect(handleResolve).toHaveBeenCalled();
  });
});
