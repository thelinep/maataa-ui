/**
 * Phase 5: Role-Based Access Control (RBAC)
 * Permission Management and Enforcement
 *
 * Implements role-based access control with permission inheritance,
 * custom roles, and fine-grained permission checks.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type Role = 'admin' | 'editor' | 'viewer' | 'commenter' | 'custom';
export type Permission =
  | 'entity:create'
  | 'entity:read'
  | 'entity:update'
  | 'entity:delete'
  | 'entity:export'
  | 'relationship:create'
  | 'relationship:read'
  | 'relationship:update'
  | 'relationship:delete'
  | 'workspace:manage'
  | 'user:manage'
  | 'permission:manage'
  | 'workflow:create'
  | 'workflow:execute'
  | 'api_key:manage'
  | 'audit:view'
  | 'share:manage'
  | 'report:generate'
  | 'comment:add'
  | 'comment:delete'
  | 'task:create'
  | 'task:complete'
  | 'integration:manage';

export interface RoleDefinition {
  name: Role;
  description: string;
  permissions: Set<Permission>;
  inherits?: Role;
  level: number; // 0=viewer, 1=commenter, 2=editor, 3=admin
}

export interface UserRole {
  userId: string;
  role: Role;
  entityId?: string;
  relationshipId?: string;
  grantedAt: number;
  grantedBy: string;
  expiresAt?: number;
  customPermissions?: Permission[];
}

export interface PermissionCheck {
  userId: string;
  permission: Permission;
  resourceId?: string;
  allowed: boolean;
  reason?: string;
  role?: Role;
}

export interface PermissionMatrix {
  [role in Role]: Set<Permission>;
}

// ============================================================================
// RBAC Engine
// ============================================================================

export class RBACEngine {
  private roles: Map<string, RoleDefinition> = new Map();
  private userRoles: Map<string, UserRole[]> = new Map();
  private entityPermissions: Map<string, UserRole[]> = new Map();
  private permissionAudit: Array<PermissionCheck> = [];

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * Initialize default role hierarchy
   */
  private initializeDefaultRoles(): void {
    // Viewer: Read-only access
    this.registerRole({
      name: 'viewer',
      description: 'Read-only access to entities and relationships',
      permissions: new Set([
        'entity:read',
        'relationship:read',
        'report:generate',
        'comment:add',
      ]),
      level: 0,
    });

    // Commenter: Viewer + comment capabilities
    this.registerRole({
      name: 'commenter',
      description: 'Can view and comment on entities',
      permissions: new Set(['comment:add', 'comment:delete']),
      inherits: 'viewer',
      level: 1,
    });

    // Editor: Full edit access
    this.registerRole({
      name: 'editor',
      description: 'Can create and edit entities and relationships',
      permissions: new Set([
        'entity:create',
        'entity:update',
        'entity:export',
        'relationship:create',
        'relationship:update',
        'task:create',
        'task:complete',
        'workflow:create',
        'workflow:execute',
        'share:manage',
      ]),
      inherits: 'commenter',
      level: 2,
    });

    // Admin: Full access
    this.registerRole({
      name: 'admin',
      description: 'Full administrative access',
      permissions: new Set([
        'entity:delete',
        'relationship:delete',
        'workspace:manage',
        'user:manage',
        'permission:manage',
        'api_key:manage',
        'audit:view',
        'integration:manage',
      ]),
      inherits: 'editor',
      level: 3,
    });
  }

  /**
   * Register custom role
   */
  public registerRole(definition: RoleDefinition): void {
    const roleWithInherits: RoleDefinition = {
      ...definition,
      permissions: new Set(definition.permissions),
    };

    // Add inherited permissions
    if (definition.inherits) {
      const parent = this.roles.get(definition.inherits);
      if (parent) {
        for (const perm of parent.permissions) {
          roleWithInherits.permissions.add(perm);
        }
      }
    }

    this.roles.set(definition.name, roleWithInherits);
  }

  /**
   * Grant role to user
   */
  public grantRole(userId: string, role: Role, grantedBy: string, expiresAt?: number): boolean {
    if (!this.roles.has(role)) {
      return false;
    }

    const userRole: UserRole = {
      userId,
      role,
      grantedAt: Date.now(),
      grantedBy,
      expiresAt,
    };

    const roles = this.userRoles.get(userId) || [];

    // Remove existing role if same (but allow multiple roles per user)
    const existingIdx = roles.findIndex((r) => r.role === role && !r.entityId);
    if (existingIdx >= 0) {
      roles[existingIdx] = userRole;
    } else {
      roles.push(userRole);
    }

    this.userRoles.set(userId, roles);
    return true;
  }

  /**
   * Grant entity-specific role
   */
  public grantEntityRole(
    userId: string,
    entityId: string,
    role: Role,
    grantedBy: string
  ): boolean {
    if (!this.roles.has(role)) {
      return false;
    }

    const userRole: UserRole = {
      userId,
      role,
      entityId,
      grantedAt: Date.now(),
      grantedBy,
    };

    const key = `${entityId}:${userId}`;
    const permissions = this.entityPermissions.get(key) || [];
    permissions.push(userRole);
    this.entityPermissions.set(key, permissions);

    return true;
  }

  /**
   * Revoke role from user
   */
  public revokeRole(userId: string, role: Role): boolean {
    const roles = this.userRoles.get(userId);
    if (!roles) return false;

    const idx = roles.findIndex((r) => r.role === role && !r.entityId);
    if (idx >= 0) {
      roles.splice(idx, 1);
      return true;
    }

    return false;
  }

  /**
   * Revoke entity-specific role
   */
  public revokeEntityRole(userId: string, entityId: string): boolean {
    const key = `${entityId}:${userId}`;
    return this.entityPermissions.delete(key);
  }

  /**
   * Get user's roles
   */
  public getUserRoles(userId: string): UserRole[] {
    return this.userRoles.get(userId) || [];
  }

  /**
   * Get user's roles for specific entity
   */
  public getEntityRoles(entityId: string, userId: string): UserRole[] {
    const key = `${entityId}:${userId}`;
    const entitySpecific = this.entityPermissions.get(key) || [];
    const global = this.userRoles.get(userId) || [];

    // Filter out expired roles
    const all = [...entitySpecific, ...global];
    return all.filter((r) => !r.expiresAt || r.expiresAt > Date.now());
  }

  /**
   * Check if user has permission
   */
  public hasPermission(
    userId: string,
    permission: Permission,
    entityId?: string
  ): PermissionCheck {
    const check: PermissionCheck = {
      userId,
      permission,
      resourceId: entityId,
      allowed: false,
      role: undefined,
    };

    // Get applicable roles
    let roles: UserRole[] = [];

    if (entityId) {
      // Check entity-specific roles first
      const entityRoles = this.getEntityRoles(entityId, userId);
      if (entityRoles.length > 0) {
        roles = entityRoles;
      } else {
        // Fall back to global roles
        roles = this.getUserRoles(userId);
      }
    } else {
      roles = this.getUserRoles(userId);
    }

    // Check each role's permissions
    for (const userRole of roles) {
      if (userRole.expiresAt && userRole.expiresAt < Date.now()) {
        continue; // Expired role
      }

      const roledef = this.roles.get(userRole.role);
      if (roledef && roledef.permissions.has(permission)) {
        check.allowed = true;
        check.role = userRole.role;
        break;
      }

      // Check custom permissions
      if (userRole.customPermissions && userRole.customPermissions.includes(permission)) {
        check.allowed = true;
        check.role = userRole.role;
        break;
      }
    }

    // Log audit
    this.permissionAudit.push(check);
    if (this.permissionAudit.length > 10000) {
      this.permissionAudit.shift();
    }

    return check;
  }

  /**
   * Check multiple permissions at once
   */
  public hasAllPermissions(
    userId: string,
    permissions: Permission[],
    entityId?: string
  ): boolean {
    return permissions.every((perm) => this.hasPermission(userId, perm, entityId).allowed);
  }

  /**
   * Check if user has any of the permissions
   */
  public hasAnyPermission(
    userId: string,
    permissions: Permission[],
    entityId?: string
  ): boolean {
    return permissions.some((perm) => this.hasPermission(userId, perm, entityId).allowed);
  }

  /**
   * Get permission matrix for role
   */
  public getRolePermissions(role: Role): Set<Permission> | undefined {
    const roledef = this.roles.get(role);
    return roledef ? new Set(roledef.permissions) : undefined;
  }

  /**
   * Add custom permission to user role
   */
  public grantCustomPermission(
    userId: string,
    entityId: string,
    permission: Permission
  ): boolean {
    const key = `${entityId}:${userId}`;
    const roles = this.entityPermissions.get(key) || [];

    if (roles.length === 0) {
      return false; // No role granted yet
    }

    for (const role of roles) {
      role.customPermissions = role.customPermissions || [];
      if (!role.customPermissions.includes(permission)) {
        role.customPermissions.push(permission);
      }
    }

    return true;
  }

  /**
   * Revoke custom permission
   */
  public revokeCustomPermission(
    userId: string,
    entityId: string,
    permission: Permission
  ): boolean {
    const key = `${entityId}:${userId}`;
    const roles = this.entityPermissions.get(key) || [];

    if (roles.length === 0) {
      return false;
    }

    for (const role of roles) {
      if (role.customPermissions) {
        const idx = role.customPermissions.indexOf(permission);
        if (idx >= 0) {
          role.customPermissions.splice(idx, 1);
        }
      }
    }

    return true;
  }

  /**
   * Get all users with specific role
   */
  public getUsersWithRole(role: Role): string[] {
    const users = new Set<string>();

    for (const [userId, userRoles] of this.userRoles.entries()) {
      if (userRoles.some((r) => r.role === role)) {
        users.add(userId);
      }
    }

    return Array.from(users);
  }

  /**
   * Get permission audit trail
   */
  public getPermissionAudit(limit: number = 100): PermissionCheck[] {
    return this.permissionAudit.slice(-limit);
  }

  /**
   * Get permission statistics
   */
  public getStatistics(): {
    totalUsers: number;
    totalRoles: number;
    roleDistribution: Record<Role, number>;
    deniedPermissions: number;
  } {
    const stats = {
      totalUsers: this.userRoles.size,
      totalRoles: this.roles.size,
      roleDistribution: {} as Record<Role, number>,
      deniedPermissions: this.permissionAudit.filter((c) => !c.allowed).length,
    };

    for (const [userId, roles] of this.userRoles.entries()) {
      for (const role of roles) {
        stats.roleDistribution[role.role] = (stats.roleDistribution[role.role] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Clear all permissions (for testing)
   */
  public clear(): void {
    this.userRoles.clear();
    this.entityPermissions.clear();
    this.permissionAudit = [];
  }

  /**
   * Get role hierarchy info
   */
  public getRoleHierarchy(): Record<Role, RoleDefinition> {
    const hierarchy: Record<Role, RoleDefinition> = {} as any;

    for (const [name, def] of this.roles.entries()) {
      hierarchy[name as Role] = def;
    }

    return hierarchy;
  }
}

export default RBACEngine;
