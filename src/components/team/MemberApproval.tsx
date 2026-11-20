/**
 * MemberApproval - Member onboarding and approval workflows
 *
 * Handle member requests, invitations, and approval process
 * Integrates with Phase 5 activity stream
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface MemberRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: number;
  approvedBy?: string;
  approvedAt?: number;
  reason?: string;
}

export interface MemberApprovalProps {
  teamId: string;
  requests: MemberRequest[];
  currentUserId: string;
  canApprove: boolean;
  onApprove?: (requestId: string, roleId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onInvite?: (email: string, roleId: string) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const SectionTitle = styled.h4`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const RequestCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 2px solid ${(props: any) => {
    switch (props.status) {
      case 'approved': return colorTokens.interactive.success;
      case 'rejected': return colorTokens.interactive.error;
      case 'pending': return colorTokens.interactive.warning;
      default: return colorTokens.border.primary;
    }
  }};
  border-radius: ${borderRadius.md};
  position: relative;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: ${spacing.sm};
  right: ${spacing.sm};
  display: inline-block;
  padding: 4px 8px;
  background: ${(props: any) => {
    switch (props.status) {
      case 'approved': return colorTokens.interactive.success;
      case 'rejected': return colorTokens.interactive.error;
      case 'pending': return colorTokens.interactive.warning;
      default: return colorTokens.border.primary;
    }
  }};
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const RequestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding-right: 100px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const UserEmail = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const RoleTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${colorTokens.interactive.info}20;
  color: ${colorTokens.interactive.info};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const Timeline = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  margin-top: ${spacing.sm};
`;

const TimelineIcon = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: ${colorTokens.interactive.info};
  border-radius: 50%;
`;

const ApprovalSection = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Label = styled.label`
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const Input = styled.input`
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.sm};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
`;

const Select = styled.select`
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.sm};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
`;

const EmptyState = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${colorTokens.text.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

/**
 * Format date for display
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * MemberApproval Component
 *
 * @example
 * <MemberApproval
 *   teamId="team-123"
 *   requests={memberRequests}
 *   currentUserId="user-123"
 *   canApprove={true}
 *   onApprove={handleApprove}
 * />
 */
export const MemberApproval: React.FC<MemberApprovalProps> = ({
  teamId,
  requests,
  currentUserId,
  canApprove,
  onApprove,
  onReject,
  onInvite,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [rejectReason, setRejectReason] = useState<string | null>(null);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');

  return (
    <Container>
      <Header>
        <Title>✅ Member Approval Workflow</Title>
      </Header>

      {/* Invite Section */}
      <Section>
        <SectionTitle>📧 Invite New Member</SectionTitle>
        <FormSection>
          <FormControl>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="member@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Label>Role</Label>
            <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="lead">Team Lead</option>
              <option value="manager">Manager</option>
            </Select>
          </FormControl>
          <Button
            variant="primary"
            onClick={() => {
              if (inviteEmail) {
                onInvite?.(inviteEmail, inviteRole);
                setInviteEmail('');
                setInviteRole('member');
              }
            }}
          >
            Send Invite
          </Button>
        </FormSection>
      </Section>

      {/* Pending Approvals */}
      {canApprove && (
        <Section>
          <SectionTitle>⏳ Pending Approval ({pendingRequests.length})</SectionTitle>
          {pendingRequests.length === 0 ? (
            <EmptyState>All member requests have been processed</EmptyState>
          ) : (
            <RequestsList>
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} status={request.status}>
                  <StatusBadge status={request.status}>Pending</StatusBadge>

                  <RequestHeader>
                    <UserInfo>
                      <UserName>{request.userName}</UserName>
                      <UserEmail>{request.email}</UserEmail>
                    </UserInfo>
                    <RoleTag>{request.role}</RoleTag>
                  </RequestHeader>

                  <Timeline>
                    <TimelineIcon />
                    <span>Requested {formatDate(request.requestedAt)}</span>
                  </Timeline>

                  {!rejectReason && (
                    <ApprovalSection>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onApprove?.(request.id, request.role)}
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectReason(request.id)}
                      >
                        ✕ Reject
                      </Button>
                    </ApprovalSection>
                  )}

                  {rejectReason === request.id && (
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Reason for rejection (optional)"
                        onBlur={(e) => {
                          if (e.target.value || !e.target.value) {
                            onReject?.(request.id, e.target.value);
                            setRejectReason(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onReject?.(request.id, e.currentTarget.value);
                            setRejectReason(null);
                          }
                        }}
                        autoFocus
                      />
                    </FormControl>
                  )}
                </RequestCard>
              ))}
            </RequestsList>
          )}
        </Section>
      )}

      {/* Approved Members */}
      {approvedRequests.length > 0 && (
        <Section>
          <SectionTitle>✓ Approved Members ({approvedRequests.length})</SectionTitle>
          <RequestsList>
            {approvedRequests.map((request) => (
              <RequestCard key={request.id} status={request.status}>
                <StatusBadge status={request.status}>Approved</StatusBadge>

                <RequestHeader>
                  <UserInfo>
                    <UserName>{request.userName}</UserName>
                    <UserEmail>{request.email}</UserEmail>
                  </UserInfo>
                  <RoleTag>{request.role}</RoleTag>
                </RequestHeader>

                <Timeline>
                  <TimelineIcon />
                  <span>Approved {request.approvedAt ? formatDate(request.approvedAt) : 'recently'}</span>
                  {request.approvedBy && <span>by {request.approvedBy}</span>}
                </Timeline>
              </RequestCard>
            ))}
          </RequestsList>
        </Section>
      )}

      {/* Rejected */}
      {rejectedRequests.length > 0 && (
        <Section>
          <SectionTitle>✕ Rejected ({rejectedRequests.length})</SectionTitle>
          <RequestsList>
            {rejectedRequests.map((request) => (
              <RequestCard key={request.id} status={request.status}>
                <StatusBadge status={request.status}>Rejected</StatusBadge>

                <RequestHeader>
                  <UserInfo>
                    <UserName>{request.userName}</UserName>
                    <UserEmail>{request.email}</UserEmail>
                  </UserInfo>
                  <RoleTag>{request.role}</RoleTag>
                </RequestHeader>

                {request.reason && (
                  <div style={{ fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
                    <strong>Reason:</strong> {request.reason}
                  </div>
                )}
              </RequestCard>
            ))}
          </RequestsList>
        </Section>
      )}
    </Container>
  );
};

export default MemberApproval;
