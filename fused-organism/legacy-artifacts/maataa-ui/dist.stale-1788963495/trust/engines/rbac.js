/**
 * Role-Based and Attribute-Based Access Control Engines
 * Provides RBAC, ABAC, and scope-based access control implementations
 */
/**
 * Role-Based Access Control (RBAC) Engine
 * Manages users, roles, and permissions with hierarchical role support
 */
export class RBACEngine {
    constructor() {
        Object.defineProperty(this, "roles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "userRoles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "permissions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Create or update a role
     */
    createRole(role) {
        if (!role.id || !role.name) {
            throw new Error("Role must have id and name");
        }
        this.roles.set(role.id, role);
    }
    /**
     * Check if user has permission
     */
    hasPermission(userId, resource, action) {
        const userRoleIds = this.userRoles.get(userId) || [];
        for (const roleId of userRoleIds) {
            const role = this.roles.get(roleId);
            if (!role)
                continue;
            const hasPermission = role.permissions.some((p) => p.resource === resource && p.action === action);
            if (hasPermission)
                return true;
        }
        return false;
    }
    /**
     * Assign role to user
     */
    assignRole(userId, roleId) {
        if (!this.roles.has(roleId)) {
            throw new Error(`Role ${roleId} not found`);
        }
        const roles = this.userRoles.get(userId) || [];
        if (!roles.includes(roleId)) {
            roles.push(roleId);
            this.userRoles.set(userId, roles);
        }
    }
    /**
     * Revoke role from user
     */
    revokeRole(userId, roleId) {
        const roles = this.userRoles.get(userId) || [];
        const index = roles.indexOf(roleId);
        if (index > -1) {
            roles.splice(index, 1);
            this.userRoles.set(userId, roles);
        }
    }
    /**
     * Get user's access control info
     */
    getAccessControl(userId) {
        const roleIds = this.userRoles.get(userId) || [];
        const roles = roleIds.map((id) => this.roles.get(id)).filter(Boolean);
        const permissions = roles.flatMap((r) => r.permissions);
        return {
            userId,
            roles,
            permissions,
        };
    }
}
/**
 * Attribute-Based Access Control (ABAC) Engine
 * Evaluates access based on attributes of users, resources, and environment
 */
export class ABACEngine {
    /**
     * Evaluate access based on attributes
     */
    evaluate(userAttributes, resourceAttributes, environmentAttributes, policy) {
        // TODO: Implement attribute-based policy evaluation
        // This is a simplified stub that should evaluate policy against attributes
        return false;
    }
    /**
     * Validate that user attributes match policy requirements
     */
    validateAttributes(userAttributes, requiredAttributes) {
        for (const [key, value] of Object.entries(requiredAttributes)) {
            if (userAttributes[key] !== value) {
                return false;
            }
        }
        return true;
    }
}
/**
 * Scope-Based Access Control (OAuth 2.0 Scopes)
 * Manages granular permissions through scopes for API/token-based access
 */
export class ScopeBasedAccessControl {
    constructor() {
        Object.defineProperty(this, "scopes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "grants", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * Register a scope
     */
    registerScope(scope) {
        if (!scope.id || !scope.name) {
            throw new Error("Scope must have id and name");
        }
        this.scopes.set(scope.id, scope);
    }
    /**
     * Grant scope to user
     */
    grantScope(userId, scopeId, expiresAt) {
        if (!this.scopes.has(scopeId)) {
            throw new Error(`Scope ${scopeId} not found`);
        }
        const grant = {
            userId,
            scopeId,
            grantedAt: new Date(),
            grantedBy: "system",
            expiresAt,
        };
        this.grants.push(grant);
        return grant;
    }
    /**
     * Check if user has scope
     */
    hasScope(userId, scopeId) {
        const now = new Date();
        return this.grants.some((g) => g.userId === userId && g.scopeId === scopeId && (!g.expiresAt || g.expiresAt > now));
    }
    /**
     * Get user's granted scopes
     */
    getUserScopes(userId) {
        const now = new Date();
        const grantedScopeIds = this.grants
            .filter((g) => g.userId === userId && (!g.expiresAt || g.expiresAt > now))
            .map((g) => g.scopeId);
        return grantedScopeIds.map((id) => this.scopes.get(id)).filter(Boolean);
    }
    /**
     * Revoke scope from user
     */
    revokeScope(userId, scopeId) {
        const index = this.grants.findIndex((g) => g.userId === userId && g.scopeId === scopeId);
        if (index > -1) {
            this.grants.splice(index, 1);
        }
    }
}
//# sourceMappingURL=rbac.js.map