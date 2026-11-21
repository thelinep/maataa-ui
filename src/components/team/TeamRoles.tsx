/**
 * TeamRoles - Role management and hierarchy
 *
 * Define roles and permissions structure for teams
 * Integrates with Phase 1 design tokens
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  level: number; // 1=member, 2=lead, 3=manager, 4=admin
  permissions: string[];
  color: string;
  memberCount?: number;
}

export interface TeamRolesProps {
  roles: TeamRole[];
  onAddRole?: (role: TeamRole) => void;
  onUpdateRole?: (role: TeamRole) => void;
  onDeleteRole?: (roleId: string) => void;
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

const HierarchyChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const HierarchyLevel = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;

  &::before {
    content: '';
    width: 40px;
    height: 2px;
    background: ${colorTokens.border.primary};
    flex-shrink: 0;
  }
`;

const RoleCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border: 2px solid ${(props: any) => props.color};
  border-radius: ${borderRadius.md};
  flex: 1;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    background: ${(props: any) => props.color};
    border-radius: 50%;
    border: 3px solid ${colorTokens.background.primary};
  }
`;

const RoleName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const RoleDescription = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const RoleStats = styled.div`
  display: flex;
  gap: ${spacing.md};
  font-size: ${typography.bodySmall.fontSize};
  margin-top: ${spacing.sm};
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs || `4px`};
  color: ${colorTokens.text.secondary};
`;

const PermissionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs || `6px`};
  margin-top: ${spacing.sm};
`;

const PermissionTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${(props: any) => `${props.color}20`};
  color: ${(props: any) => props.color};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

// Predefined roles
const PREDEFINED_ROLES: TeamRole[] = [
  {
    id: 'role-member',
    name: 'Member',
    description: 'Standard team member with view access',
    level: 1,
    permissions: ['view:project', 'view:budget', 'view:team'],
    color: '#D4A574',
    memberCount: 0,
  },
  {
    id: 'role-lead',
    name: 'Team Lead',
    description: 'Team lead with edit access to team data',
    level: 2,
    permissions: [
      'view:project',
      'view:budget',
      'view:team',
      'edit:project',
      'edit:budget',
      'manage:members',
    ],
    color: '#C89968',
    memberCount: 0,
  },
  {
    id: 'role-manager',
    name: 'Manager',
    description: 'Manager with full access and approvals',
    level: 3,
    permissions: [
      'view:*',
      'edit:*',
      'manage:members',
      'approve:budget',
      'approve:members',
    ],
    color: '#B8956A',
    memberCount: 0,
  },
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Team administrator with all permissions',
    level: 4,
    permissions: ['*'],
    color: '#8B7E6B',
    memberCount: 0,
  },
];

const PERMISSION_CATEGORIES: Record<string, { label: string; color: string }> = {
  'view': { label: 'View', color: colorTokens.interactive.info },
  'edit': { label: 'Edit', color: colorTokens.interactive.warning },
  'manage': { label: 'Manage', color: colorTokens.interactive.secondary },
  'approve': { label: 'Approve', color: colorTokens.interactive.success },
};

/**
 * TeamRoles Component
 *
 * @example
 * <TeamRoles
 *   roles={roles}
 *   onAddRole={handleAdd}
 * />
 */
export const TeamRoles: React.FC<TeamRolesProps> = ({
  roles,
  onAddRole,
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Sort roles by level
  const sortedRoles = [...roles].sort((a, b) => a.level - b.level);

  return (
    <Container>
      <Header>
        <Title><span aria-hidden="true">👥 </span>Team Role Hierarchy</Title>
      </Header>

      <HierarchyChart>
        {sortedRoles.length === 0 ? (
          <div style={{ padding: spacing.lg, textAlign: 'center', color: colorTokens.text.secondary }}>
            <p>No roles defined. Using default hierarchy:</p>
            {PREDEFINED_ROLES.map((role) => (
              <div key={role.id} style={{ fontSize: typography.bodySmall.fontSize, margin: `${spacing.sm} 0` }}>
                {role.name} ({role.permissions.length} permissions)
              </div>
            ))}
          </div>
        ) : (
          <>
            {sortedRoles.map((role, index) => (
              <HierarchyLevel key={role.id}>
                {index > 0 && <div />}
                <RoleCard
                  color={role.color}
                  onClick={() => setExpanded(expanded === role.id ? null : role.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <RoleName>{role.name}</RoleName>
                  <RoleDescription>{role.description}</RoleDescription>

                  <RoleStats>
                    <Stat>👤 {role.memberCount || 0} members</Stat>
                    <Stat>🔐 {role.permissions.length} permissions</Stat>
                  </RoleStats>

                  {expanded === role.id && (
                    <PermissionsList>
                      {role.permissions.map((perm) => {
                        const category = perm.split(':')[0];
                        const permConfig =
                          PERMISSION_CATEGORIES[category] ||
                          PERMISSION_CATEGORIES['view'];
                        return (
                          <PermissionTag key={perm} color={permConfig.color}>
                            {perm}
                          </PermissionTag>
                        );
                      })}
                    </PermissionsList>
                  )}
                </RoleCard>
              </HierarchyLevel>
            ))}
          </>
        )}
      </HierarchyChart>

      {sortedRoles.length === 0 && (
        <Button
          variant="primary"
          onClick={() => {
            const role = PREDEFINED_ROLES[0];
            onAddRole?.({ ...role, id: `role-${Date.now()}` });
          }}
        >
          Initialize Default Roles
        </Button>
      )}
    </Container>
  );
};

export default TeamRoles;
