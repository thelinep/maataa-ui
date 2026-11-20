/**
 * GanttChart - Gantt chart visualization for project tasks
 *
 * Visual timeline showing task schedules and dependencies
 * SVG-based rendering with Phase 1 token colors
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  dependencies?: string[]; // task IDs
}

export interface GanttChartProps {
  tasks: GanttTask[];
  startDate: string;
  endDate: string;
  currentDate?: string;
  onTaskClick?: (taskId: string) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  overflow-x: auto;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const ChartWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  min-width: fit-content;
`;

const TaskLabels = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `1px`};
  min-width: 200px;
`;

const TaskLabel = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 500;
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.xs || `2px`};
  min-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TimelineHeader = styled.div`
  display: flex;
  margin-bottom: ${spacing.sm};
  font-size: 11px;
  color: ${colorTokens.text.secondary};
  font-weight: 600;
`;

const TimelineMonth = styled.div`
  flex: 1;
  text-align: center;
  padding: ${spacing.xs || `4px`};
  border-right: 1px solid ${colorTokens.border.primary};
  min-width: 60px;
`;

const GanttSvg = styled.svg`
  display: block;
  min-height: 100%;
`;

const Legend = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
  margin-top: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid ${colorTokens.border.primary};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background: ${(props: any) => props.color};
`;

/**
 * Calculate pixel position for date
 */
function getPixelPosition(date: string, startDate: string, totalDays: number, pixelWidth: number): number {
  const start = new Date(startDate);
  const target = new Date(date);
  const daysFromStart = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return (daysFromStart / totalDays) * pixelWidth;
}

/**
 * Get color for task status
 */
function getTaskColor(status: string): string {
  switch (status) {
    case 'completed': return colorTokens.interactive.success;
    case 'in-progress': return colorTokens.interactive.info;
    case 'blocked': return colorTokens.interactive.error;
    default: return colorTokens.interactive.secondary;
  }
}

/**
 * GanttChart Component
 *
 * @example
 * <GanttChart
 *   tasks={tasks}
 *   startDate="2026-10-01"
 *   endDate="2026-12-31"
 *   onTaskClick={handleClick}
 * />
 */
export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  startDate,
  endDate,
  currentDate = new Date().toISOString().split('T')[0],
  onTaskClick,
}) => {
  const PIXELS_PER_DAY = 8;
  const TASK_HEIGHT = 32;
  const PADDING = 10;

  const metrics = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalWidth = totalDays * PIXELS_PER_DAY;
    return { totalDays, totalWidth, start };
  }, [startDate, endDate]);

  const getMonths = () => {
    const months = [];
    let current = new Date(startDate);
    while (current <= new Date(endDate)) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  return (
    <Container>
      <ChartWrapper>
        <TaskLabels>
          {tasks.map((task) => (
            <TaskLabel key={task.id} title={task.name}>
              {task.name}
            </TaskLabel>
          ))}
        </TaskLabels>

        <div style={{ flex: 1, minWidth: 0 }}>
          <TimelineHeader>
            {getMonths().map((month, i) => (
              <TimelineMonth key={i}>
                {month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              </TimelineMonth>
            ))}
          </TimelineHeader>

          <GanttSvg width={metrics.totalWidth} height={tasks.length * TASK_HEIGHT}>
            {/* Background lines */}
            {Array.from({ length: tasks.length }).map((_, i) => (
              <line
                key={`line-${i}`}
                x1="0"
                y1={i * TASK_HEIGHT}
                x2={metrics.totalWidth}
                y2={i * TASK_HEIGHT}
                stroke={colorTokens.border.primary}
                strokeWidth="1"
                opacity="0.5"
              />
            ))}

            {/* Current date line */}
            <line
              x1={getPixelPosition(currentDate, startDate, metrics.totalDays, metrics.totalWidth)}
              y1="0"
              x2={getPixelPosition(currentDate, startDate, metrics.totalDays, metrics.totalWidth)}
              y2={tasks.length * TASK_HEIGHT}
              stroke={colorTokens.interactive.info}
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Task bars */}
            {tasks.map((task, idx) => {
              const x = getPixelPosition(task.startDate, startDate, metrics.totalDays, metrics.totalWidth);
              const width =
                getPixelPosition(task.endDate, startDate, metrics.totalDays, metrics.totalWidth) - x;
              const y = idx * TASK_HEIGHT + PADDING / 2;
              const barHeight = TASK_HEIGHT - PADDING;
              const color = getTaskColor(task.status);

              return (
                <g
                  key={task.id}
                  onClick={() => onTaskClick?.(task.id)}
                  onKeyDown={(e) => {
                    if (onTaskClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onTaskClick(task.id);
                    }
                  }}
                  role={onTaskClick ? 'button' : undefined}
                  tabIndex={onTaskClick ? 0 : undefined}
                  aria-label={`${task.name}: ${task.progress}% (${task.status.replace('-', ' ')})`}
                  style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
                >
                  <title>{`${task.name} — ${task.progress}%`}</title>
                  {/* Background bar */}
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={barHeight}
                    fill={`${color}20`}
                    stroke={color}
                    strokeWidth="1"
                    rx="2"
                  />

                  {/* Progress bar */}
                  {task.progress > 0 && (
                    <rect
                      x={x}
                      y={y}
                      width={(width * task.progress) / 100}
                      height={barHeight}
                      fill={color}
                      rx="2"
                      opacity="0.7"
                    />
                  )}

                  {/* Progress text */}
                  {width > 50 && (
                    <text
                      x={x + width / 2}
                      y={y + barHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="white"
                      opacity={task.progress > 0 ? 0.9 : 0.6}
                    >
                      {task.progress}%
                    </text>
                  )}
                </g>
              );
            })}
          </GanttSvg>
        </div>
      </ChartWrapper>

      <Legend>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.success} />
          <span>Completed</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.info} />
          <span>In Progress</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.error} />
          <span>Blocked</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.secondary} />
          <span>Not Started</span>
        </LegendItem>
      </Legend>
    </Container>
  );
};

export default GanttChart;
