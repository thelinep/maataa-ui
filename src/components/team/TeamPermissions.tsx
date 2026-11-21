/**
 * TeamPermissions - Permission matrix and configuration
 *
 * Visual permission matrix for roles and resources
 * Configure granular access control
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface Permission {
  id: string;
  resource: string; // 'project', 'budget', 'team', 'members'
  action: string; // 'view', 'edit', 'delete', 'approve'
  description: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  granted: boolean;
}

export interface TeamPermissionsProps {
  roles: Array<{ id: string; name: string; level: number }>;
  permissions: Permission[];
  rolePermissions: RolePermission[];
  onTogglePermission?: (roleId: string, permissionId: string, granted: boolean) => void;
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

const MatrixContainer = styled.div`
  overflow-x: auto;
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  background: ${colorTokens.background.secondary};
`;

const Matrix = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(auto-fit, minmax(120px, 1fr));
  min-width: 100%;
`;

const MatrixCell = styled.div<{ $isHeader?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.md};
  border-right: 1px solid ${colorTokens.border.primary};
  border-bottom: 1px solid ${colorTokens.border.primary};
  font-size: ${typography.bodySmall.fontSize};
  min-height: 50px;
  background: ${(props) => props.$isHeader ? colorTokens.background.primary : colorTokens.background.secondary};
  font-weight: ${(props) => props.$isHeader ? 600 : 400};
  color: ${(props) => props.$isHeader ? colorTokens.text.primary : colorTokens.text.secondary};

  &:last-child {
    border-right: none;
  }
`;

const PermissionCell = styled(MatrixCell)`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colorTokens.background.primary};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${colorTokens.interactive.success};
`;

const ResourceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const ResourceName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const PermissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const PermissionBadge = styled.span<{ $action?: string }>`
  display: inline-block;
  padding: 2px 6px;
  background: ${(props) => {
    switch (props.$action) {
      case 'view': return colorTokens.interactive.info;
      case 'edit': return colorTokens.interactive.warning;
      case 'delete': return colorTokens.interactive.error;
      case 'approve': return colorTokens.interactive.success;
      default: return colorTokens.border.primary;
    }
  }};
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
`;

/**
 * TeamPermissions Component
 *
 * @example
 * <TeamPermissions
 *   roles={roles}
 *   permissions={permissions}
 *   rolePermissions={rolePermissions}
 *   onTogglePermission={handleToggle}
 * />
 */
export const TeamPermissions: React.FC<TeamPermissionsProps> = ({
  roles,
  permissions,
  rolePermissions,
  onTogglePermission,
}) => {
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const sortedRoles = [...roles].sort((a, b) => a.level - b.level);
  const resourceGroups = [
    { name: 'project', label: 'Projects' },
    { name: 'budget', label: 'Budgets' },
    { name: 'team', label: 'Team' },
    { name: 'members', label: 'Members' },
  ];

  const getPermissionGranted = (roleId: string, permissionId: string): boolean => {
    const rp = rolePermissions.find((rp) => rp.roleId === roleId && rp.permissionId === permissionId);
    return rp?.granted || false;
  };

  return (
    <Container>
      <Title><span aria-hidden="true">🔐 </span>Permission Matrix</Title>

      <MatrixContainer>
        <Matrix>
          {/* Header row */}
          <MatrixCell $isHeader>Resource:Action</MatrixCell>
          {sortedRoles.map((role) => (
            <MatrixCell key={role.id} $isHeader>
              {role.name}
            </MatrixCell>
          ))}

          {/* Permission rows */}
          {permissions.map((perm) => (
            <React.Fragment key={perm.id}>
              <MatrixCell $isHeader style={{ justifyContent: 'flex-start' }}>
                <div>
                  {perm.resource}
                  <br />
                  <span style={{ fontSize: '10px', color: colorTokens.text.secondary }}>
                    {perm.action}
                  </span>
                </div>
              </MatrixCell>
              {sortedRoles.map((role) => (
                <PermissionCell
                  key={`${role.id}-${perm.id}`}
                  onClick={() =>
                    onTogglePermission?.(
                      role.id,
                      perm.id,
                      !getPermissionGranted(role.id, perm.id)
                    )
                  }
                >
                  <Checkbox
                    type="checkbox"
                    checked={getPermissionGranted(role.id, perm.id)}
                    onChange={(e) =>
                      onTogglePermission?.(role.id, perm.id, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </PermissionCell>
              ))}
            </React.Fragment>
          ))}
        </Matrix>
      </MatrixContainer>

      <Title style={{ marginTop: spacing.lg }}><span aria-hidden="true">📋 </span>Permission Descriptions</Title>

      {resourceGroups.map((group) => {
        const groupPerms = permissions.filter((p) => p.resource === group.name);
        return (
          <ResourceGroup key={group.name}>
            <ResourceName
              as="button"
              type="button"
              aria-expanded={expandedResource === group.name}
              onClick={() =>
                setExpandedResource(
                  expandedResource === group.name ? null : group.name
                )
              }
              style={{ cursor: 'pointer', userSelect: 'none', background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left' }}
            >
              {group.label} <span aria-hidden="true">{expandedResource === group.name ? '▼' : '▶'}</span>
            </ResourceName>

            {expandedResource === group.name && (
              <PermissionsList>
                {groupPerms.map((perm) => (
                  <PermissionItem key={perm.id}>
                    <PermissionBadge $action={perm.action}>
                      {perm.action}
                    </PermissionBadge>
                    <span>{perm.description}</span>
                  </PermissionItem>
                ))}
              </PermissionsList>
            )}
          </ResourceGroup>
        );
      })}
    </Container>
  );
};

export default TeamPermissions;
