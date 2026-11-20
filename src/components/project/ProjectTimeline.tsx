/**
 * ProjectTimeline - Project timeline and milestones
 *
 * Visual timeline with milestones and phase markers
 * Integrates with Phase 1 design tokens
 */

import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface ProjectMilestone {
  id: string;
  name: string;
  date: string;
  status: 'not-started' | 'at-risk' | 'on-track' | 'completed';
  description?: string;
  deliverables?: string[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  percentComplete?: number;
}

export interface ProjectTimelineProps {
  projectName: string;
  startDate: string;
  endDate: string;
  currentDate?: string;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
  onAddMilestone?: (milestone: ProjectMilestone) => void;
  onUpdatePhase?: (phase: ProjectPhase) => void;
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

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const TimelineStats = styled.div`
  display: flex;
  gap: ${spacing.lg};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
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

const TimelineView = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const PhaseBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const PhaseName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  height: 32px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  flex: 1;
  height: 24px;
  background: ${colorTokens.border.primary};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => `${props.$progress}%`};
    background: linear-gradient(
      to right,
      ${colorTokens.interactive.info},
      ${colorTokens.interactive.success}
    );
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.secondary};
  min-width: 45px;
  text-align: right;
`;

const DateRange = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${colorTokens.text.secondary};
  margin-top: ${spacing.xs || `4px`};
`;

const MilestoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
`;

const MilestoneItem = styled.div<{ $status?: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border: 2px solid ${(props) => {
    switch (props.$status) {
      case 'completed': return colorTokens.interactive.success;
      case 'at-risk': return colorTokens.interactive.error;
      case 'on-track': return colorTokens.interactive.info;
      default: return colorTokens.border.primary;
    }
  }};
  border-radius: ${borderRadius.md};
`;

const MilestoneIcon = styled.div<{ $status?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case 'completed': return colorTokens.interactive.success;
      case 'at-risk': return colorTokens.interactive.error;
      case 'on-track': return colorTokens.interactive.info;
      default: return colorTokens.border.primary;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  color: white;
`;

const MilestoneContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  flex: 1;
`;

const MilestoneName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const MilestoneDate = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const Deliverables = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs || `6px`};
  margin-top: ${spacing.sm};
`;

const DeliverableTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${colorTokens.interactive.info}20;
  color: ${colorTokens.interactive.info};
  border-radius: 3px;
  font-size: 11px;
`;

/**
 * Calculate days between dates
 */
function daysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days elapsed
 */
function daysElapsed(start: string, current: string): number {
  const startDate = new Date(start);
  const currentDate = new Date(current);
  return Math.max(0, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * ProjectTimeline Component
 *
 * @example
 * <ProjectTimeline
 *   projectName="Q4 Launch"
 *   startDate="2026-10-01"
 *   endDate="2026-12-31"
 *   phases={phases}
 *   milestones={milestones}
 * />
 */
export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projectName,
  startDate,
  endDate,
  currentDate = new Date().toISOString().split('T')[0],
  phases,
  milestones,
}) => {
  const totalDays = daysBetween(startDate, endDate);
  const elapsedDays = daysElapsed(startDate, currentDate);
  const projectProgress = Math.min(100, (elapsedDays / totalDays) * 100);
  const phasesComplete = phases.filter((p) => p.status === 'completed').length;

  return (
    <Container>
      <Title>📅 Project Timeline: {projectName}</Title>

      <TimelineHeader>
        <TimelineStats>
          <StatItem>
            <StatLabel>Start Date</StatLabel>
            <StatValue>{new Date(startDate).toLocaleDateString()}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>End Date</StatLabel>
            <StatValue>{new Date(endDate).toLocaleDateString()}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Duration</StatLabel>
            <StatValue>{totalDays} days</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Phases</StatLabel>
            <StatValue>{phasesComplete}/{phases.length}</StatValue>
          </StatItem>
        </TimelineStats>

        <div style={{ textAlign: 'right' }}>
          <ProgressText style={{ display: 'block', marginBottom: spacing.sm }}>
            {projectProgress.toFixed(0)}% complete
          </ProgressText>
          <ProgressBar $progress={projectProgress} style={{ width: '200px' }} />
        </div>
      </TimelineHeader>

      <TimelineView>
        {phases.map((phase) => (
          <PhaseBar key={phase.id}>
            <PhaseName>{phase.name}</PhaseName>
            <ProgressContainer>
              <ProgressBar $progress={phase.percentComplete || 0} />
              <ProgressText>{phase.percentComplete || 0}%</ProgressText>
            </ProgressContainer>
            <DateRange>
              <span>{new Date(phase.startDate).toLocaleDateString()}</span>
              <span>{new Date(phase.endDate).toLocaleDateString()}</span>
            </DateRange>
          </PhaseBar>
        ))}
      </TimelineView>

      <div>
        <h4 style={{ margin: `${spacing.md} 0 ${spacing.sm} 0`, color: colorTokens.text.primary }}>
          🎯 Milestones ({milestones.length})
        </h4>

        {milestones.length === 0 ? (
          <p style={{ color: colorTokens.text.secondary }}>No milestones defined</p>
        ) : (
          <MilestoneContainer>
            {milestones.map((milestone) => (
              <MilestoneItem key={milestone.id} $status={milestone.status}>
                <MilestoneIcon $status={milestone.status}>
                  {milestone.status === 'completed'
                    ? '✓'
                    : milestone.status === 'at-risk'
                    ? '!'
                    : milestone.status === 'on-track'
                    ? '◐'
                    : '○'}
                </MilestoneIcon>

                <MilestoneContent>
                  <MilestoneName>{milestone.name}</MilestoneName>
                  <MilestoneDate>{new Date(milestone.date).toLocaleDateString()}</MilestoneDate>
                  {milestone.description && (
                    <span style={{ fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
                      {milestone.description}
                    </span>
                  )}
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <Deliverables>
                      {milestone.deliverables.map((d, i) => (
                        <DeliverableTag key={i}>{d}</DeliverableTag>
                      ))}
                    </Deliverables>
                  )}
                </MilestoneContent>
              </MilestoneItem>
            ))}
          </MilestoneContainer>
        )}
      </div>
    </Container>
  );
};

export default ProjectTimeline;
