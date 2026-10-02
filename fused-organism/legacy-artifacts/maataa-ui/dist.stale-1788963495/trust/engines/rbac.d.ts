/**
 * Role-Based and Attribute-Based Access Control Engines
 * Provides RBAC, ABAC, and scope-based access control implementations
 */
import type { Role, AccessControl, Scope, ScopeGrant } from "../types";
/**
 * Role-Based Access Control (RBAC) Engine
 * Manages users, roles, and permissions with hierarchical role support
 */
export declare class RBACEngine {
    private roles;
    private userRoles;
    private permissions;
    /**
     * Create or update a role
     */
    createRole(role: Role): void;
    /**
     * Check if user has permission
     */
    hasPermission(userId: string, resource: string, action: string): boolean;
    /**
     * Assign role to user
     */
    assignRole(userId: string, roleId: string): void;
    /**
     * Revoke role from user
     */
    revokeRole(userId: string, roleId: string): void;
    /**
     * Get user's access control info
     */
    getAccessControl(userId: string): AccessControl;
}
/**
 * Attribute-Based Access Control (ABAC) Engine
 * Evaluates access based on attributes of users, resources, and environment
 */
export declare class ABACEngine {
    /**
     * Evaluate access based on attributes
     */
    evaluate(userAttributes: Record<string, unknown>, resourceAttributes: Record<string, unknown>, environmentAttributes: Record<string, unknown>, policy: Record<string, unknown>): boolean;
    /**
     * Validate that user attributes match policy requirements
     */
    validateAttributes(userAttributes: Record<string, unknown>, requiredAttributes: Record<string, unknown>): boolean;
}
/**
 * Scope-Based Access Control (OAuth 2.0 Scopes)
 * Manages granular permissions through scopes for API/token-based access
 */
export declare class ScopeBasedAccessControl {
    private scopes;
    private grants;
    /**
     * Register a scope
     */
    registerScope(scope: Scope): void;
    /**
     * Grant scope to user
     */
    grantScope(userId: string, scopeId: string, expiresAt?: Date): ScopeGrant;
    /**
     * Check if user has scope
     */
    hasScope(userId: string, scopeId: string): boolean;
    /**
     * Get user's granted scopes
     */
    getUserScopes(userId: string): Scope[];
    /**
     * Revoke scope from user
     */
    revokeScope(userId: string, scopeId: string): void;
}
//# sourceMappingURL=rbac.d.ts.map