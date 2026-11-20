/**
 * Team Components Test Suite
 * Unit tests for TeamRoles, TeamPermissions, MemberApproval
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamRoles, type TeamRole } from '@/components/team/TeamRoles';
import { TeamPermissions, type Permission } from '@/components/team/TeamPermissions';
import { MemberApproval, type MemberRequest } from '@/components/team/MemberApproval';

describe('TeamRoles', () => {
  const mockRoles: TeamRole[] = [
    {
      id: 'role-member',
      name: 'Member',
      description: 'Standard team member',
      level: 1,
      permissions: ['view:project', 'view:budget'],
      color: '#D4A574',
      memberCount: 8,
    },
    {
      id: 'role-lead',
      name: 'Team Lead',
      description: 'Team lead with edit access',
      level: 2,
      permissions: ['view:*', 'edit:project', 'manage:members'],
      color: '#C89968',
      memberCount: 2,
    },
  ];

  it('renders role hierarchy with levels', () => {
    render(<TeamRoles roles={mockRoles} />);

    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('Team Lead')).toBeInTheDocument();
  });

  it('displays permission count per role', () => {
    render(<TeamRoles roles={mockRoles} />);

    expect(screen.getByText(/2 permissions/)).toBeInTheDocument();
    expect(screen.getByText(/3 permissions/)).toBeInTheDocument();
  });

  it('shows member count for each role', () => {
    render(<TeamRoles roles={mockRoles} />);

    expect(screen.getByText(/8 members/)).toBeInTheDocument();
    expect(screen.getByText(/2 members/)).toBeInTheDocument();
  });

  it('expands role to show permissions on click', async () => {
    render(<TeamRoles roles={mockRoles} />);

    const roleCard = screen.getByText('Member').closest('div');
    expect(roleCard).not.toBeNull();
    fireEvent.click(roleCard!);

    expect(screen.getByText(/view:project/)).toBeInTheDocument();
  });

  it('sorts roles by level ascending', () => {
    const unorderedRoles = [mockRoles[1], mockRoles[0]];
    render(<TeamRoles roles={unorderedRoles} />);

    const names = screen.getAllByText(/Member|Team Lead/);
    expect(names[0].textContent).toBe('Member');
  });
});

describe('TeamPermissions', () => {
  const mockRoles = [
    { id: 'role-1', name: 'Member', level: 1 },
    { id: 'role-2', name: 'Admin', level: 4 },
  ];

  const mockPermissions: Permission[] = [
    {
      id: 'perm-1',
      resource: 'project',
      action: 'view',
      description: 'View projects',
    },
    {
      id: 'perm-2',
      resource: 'project',
      action: 'edit',
      description: 'Edit projects',
    },
  ];

  it('renders permission matrix with roles and permissions', () => {
    render(
      <TeamPermissions
        roles={mockRoles}
        permissions={mockPermissions}
        rolePermissions={[]}
      />
    );

    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('allows toggling permissions for roles', () => {
    const handleToggle = vi.fn();
    render(
      <TeamPermissions
        roles={mockRoles}
        permissions={mockPermissions}
        rolePermissions={[]}
        onTogglePermission={handleToggle}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(handleToggle).toHaveBeenCalled();
  });

  it('displays permission descriptions grouped by resource', async () => {
    render(
      <TeamPermissions
        roles={mockRoles}
        permissions={mockPermissions}
        rolePermissions={[]}
      />
    );

    const projectHeader = screen.getByRole('button', { name: 'Projects' });
    expect(projectHeader).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('View projects')).not.toBeInTheDocument();

    fireEvent.click(projectHeader);

    expect(projectHeader).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('View projects')).toBeInTheDocument();
  });
});

describe('MemberApproval', () => {
  const mockRequests: MemberRequest[] = [
    {
      id: 'req-1',
      userId: 'user-1',
      userName: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'member',
      status: 'pending',
      requestedAt: Date.now(),
    },
    {
      id: 'req-2',
      userId: 'user-2',
      userName: 'Bob Smith',
      email: 'bob@example.com',
      role: 'lead',
      status: 'approved',
      requestedAt: Date.now(),
      approvedBy: 'manager-1',
      approvedAt: Date.now(),
    },
  ];

  it('renders member request list', () => {
    render(
      <MemberApproval
        teamId="team-1"
        requests={mockRequests}
        currentUserId="user-123"
        canApprove={true}
      />
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('displays pending requests separately', () => {
    render(
      <MemberApproval
        teamId="team-1"
        requests={mockRequests}
        currentUserId="user-123"
        canApprove={true}
      />
    );

    expect(screen.getByText(/Pending Approval \(1\)/)).toBeInTheDocument();
  });

  it('shows approve and reject buttons for pending requests', () => {
    render(
      <MemberApproval
        teamId="team-1"
        requests={mockRequests}
        currentUserId="user-123"
        canApprove={true}
      />
    );

    expect(screen.getByText('✓ Approve')).toBeInTheDocument();
    expect(screen.getByText('✕ Reject')).toBeInTheDocument();
  });

  it('allows inviting new members', async () => {
    const handleInvite = vi.fn();
    render(
      <MemberApproval
        teamId="team-1"
        requests={[]}
        currentUserId="user-123"
        canApprove={true}
        onInvite={handleInvite}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    const emailInput = inputs[0];
    
    await userEvent.type(emailInput, 'newmember@example.com');
    
    const sendButton = screen.getByText('Send Invite');
    fireEvent.click(sendButton);

    expect(handleInvite).toHaveBeenCalledWith('newmember@example.com', 'member');
  });

  it('shows approved members in separate section', () => {
    render(
      <MemberApproval
        teamId="team-1"
        requests={mockRequests}
        currentUserId="user-123"
        canApprove={true}
      />
    );

    expect(screen.getByText(/Approved Members \(1\)/)).toBeInTheDocument();
  });

  it('hides approval buttons when canApprove is false', () => {
    render(
      <MemberApproval
        teamId="team-1"
        requests={mockRequests}
        currentUserId="user-123"
        canApprove={false}
      />
    );

    expect(screen.queryByText('✓ Approve')).not.toBeInTheDocument();
  });
});
