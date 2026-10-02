/**
 * @maataa/ui/trust/components
 * Security, authentication, and compliance UI components
 */
import React from "react";
export interface RoleManagementPanelProps {
    userId: string;
    currentRoles: string[];
    onRolesChange?: (roles: string[]) => void;
}
export interface MFASetupPanelProps {
    userId: string;
    onComplete?: () => void;
}
export interface AuditLogViewerProps {
    events: Array<{
        id: string;
        timestamp: Date;
        action: string;
        status: string;
    }>;
    isLoading?: boolean;
    error?: string;
}
export interface ComplianceStatusDashboardProps {
    frameworks?: string[];
    compact?: boolean;
}
export interface PrivacyRequestManagerProps {
    userId: string;
    onRequestSubmit?: (type: string) => void;
}
export interface SessionManagerProps {
    sessions: Array<{
        id: string;
        createdAt: Date;
        browser: string;
    }>;
    onRevoke?: (sessionId: string) => void;
}
/**
 * RoleManagementPanel
 * Manage user roles and permissions
 */
export declare const RoleManagementPanel: React.FC<RoleManagementPanelProps>;
/**
 * MFASetupPanel
 * Configure multi-factor authentication
 */
export declare const MFASetupPanel: React.FC<MFASetupPanelProps>;
/**
 * AuditLogViewer
 * Display and filter audit events
 */
export declare const AuditLogViewer: React.FC<AuditLogViewerProps>;
/**
 * ComplianceStatusDashboard
 * Display compliance status across frameworks
 */
export declare const ComplianceStatusDashboard: React.FC<ComplianceStatusDashboardProps>;
/**
 * PrivacyRequestManager
 * Handle GDPR and privacy requests
 */
export declare const PrivacyRequestManager: React.FC<PrivacyRequestManagerProps>;
/**
 * SessionManager
 * Manage user sessions and active logins
 */
export declare const SessionManager: React.FC<SessionManagerProps>;
//# sourceMappingURL=components.d.ts.map