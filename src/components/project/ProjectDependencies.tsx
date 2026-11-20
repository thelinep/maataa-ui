/**
 * ProjectDependencies - Task dependency management
 *
 * Visualize and manage task dependencies with graph visualization
 * Integrates with Phase 1 design tokens
 */

import React from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface ProjectTask {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  owner?: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
}

export interface TaskDependency {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  type: 'finish-start' | 'start-start' | 'finish-finish';
  lagDays?: number;
}

export interface ProjectDependenciesProps {
  tasks: ProjectTask[];
  dependencies: TaskDependency[];
  criticalPath?: string[];
  onAddDependency?: (dependency: TaskDependency) => void;
  onRemoveDependency?: (dependencyId: string) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const TaskNode = styled.div<{ $status?: string; $isCritical?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
  padding: ${spacing.sm};
  background: ${(props) => {
    switch (props.$status) {
      case 'completed': return colorTokens.interactive.success;
      case 'in-progress': return colorTokens.interactive.info;
      case 'blocked': return colorTokens.interactive.error;
      default: return colorTokens.interactive.secondary;
    }
  }};
  color: white;
  border-radius: ${borderRadius.sm};
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  min-width: 120px;
  text-align: center;
  border: ${(props) => props.$isCritical ? `2px solid ${colorTokens.interactive.error}` : '1px solid transparent'};
  box-shadow: ${(props) => props.$isCritical ? `0 0 8px ${colorTokens.interactive.error}` : 'none'};
`;

const DependencyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const DependencyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.sm};
  background: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.bodySmall.fontSize};
`;

const DependencyArrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs || `4px`};
  color: ${colorTokens.text.secondary};
  font-weight: 600;

  &::before {
    content: '→';
  }
`;

const DependencyBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background: ${colorTokens.interactive.info}20;
  color: ${colorTokens.interactive.info};
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
`;

const LagTag = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background: ${colorTokens.interactive.warning}20;
  color: ${colorTokens.interactive.warning};
  border-radius: 3px;
  font-size: 10px;
  margin-left: ${spacing.xs || `4px`};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.sm};
`;

const StatLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const StatValue = styled.span`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

/**
 * ProjectDependencies Component
 *
 * @example
 * <ProjectDependencies
 *   tasks={tasks}
 *   dependencies={dependencies}
 *   criticalPath={criticalPathTaskIds}
 *   onAddDependency={handleAdd}
 * />
 */
export const ProjectDependencies: React.FC<ProjectDependenciesProps> = ({
  tasks,
  dependencies,
  criticalPath = [],
  onRemoveDependency,
}) => {
  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  const blockedTasks = tasks.filter((t) => t.status === 'blocked').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalDependencies = dependencies.length;

  return (
    <Container>
      <Title>🔗 Task Dependencies & Critical Path</Title>

      <Stats>
        <StatCard>
          <StatLabel>Total Tasks</StatLabel>
          <StatValue>{tasks.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Dependencies</StatLabel>
          <StatValue>{totalDependencies}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Critical Path</StatLabel>
          <StatValue>{criticalPath.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Completed</StatLabel>
          <StatValue style={{ color: colorTokens.interactive.success }}>
            {completedTasks}/{tasks.length}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Blocked</StatLabel>
          <StatValue
            style={{
              color: blockedTasks > 0 ? colorTokens.interactive.error : colorTokens.text.secondary,
            }}
          >
            {blockedTasks}
          </StatValue>
        </StatCard>
      </Stats>

      <div>
        <h4 style={{ margin: `${spacing.md} 0 ${spacing.sm} 0`, color: colorTokens.text.primary }}>
          Task Dependencies
        </h4>
        {dependencies.length === 0 ? (
          <p style={{ color: colorTokens.text.secondary }}>No task dependencies defined</p>
        ) : (
          <DependencyList>
            {dependencies.map((dep) => {
              const fromTask = getTaskById(dep.fromTaskId);
              const toTask = getTaskById(dep.toTaskId);
              const isCritical =
                criticalPath.includes(dep.fromTaskId) &&
                criticalPath.includes(dep.toTaskId);

              return (
                <DependencyItem key={dep.id} style={{ borderLeftColor: isCritical ? colorTokens.interactive.error : colorTokens.border.primary, borderLeftWidth: isCritical ? '3px' : '1px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <TaskNode $status={fromTask?.status}>
                      {fromTask?.name.substring(0, 10)}
                    </TaskNode>
                    <DependencyArrow>
                      <DependencyBadge>{dep.type}</DependencyBadge>
                    </DependencyArrow>
                    <TaskNode $status={toTask?.status} $isCritical={isCritical}>
                      {toTask?.name.substring(0, 10)}
                    </TaskNode>
                    {dep.lagDays && <LagTag>+{dep.lagDays}d lag</LagTag>}
                    {isCritical && <span style={{ color: colorTokens.interactive.error, fontWeight: 'bold' }}>⚡ Critical</span>}
                  </div>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => onRemoveDependency?.(dep.id)}
                  >
                    ✕
                  </Button>
                </DependencyItem>
              );
            })}
          </DependencyList>
        )}
      </div>
    </Container>
  );
};

export default ProjectDependencies;
