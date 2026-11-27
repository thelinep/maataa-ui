/**
 * @maataa/ui/trust/components
 * Display components for trust and compliance data supplied by an application.
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens } from "../tokens";

// =============================================================================
// Component Props Types
// =============================================================================

export interface RoleManagementPanelProps {
  userId: string;
  currentRoles: string[];
}

export interface MFASetupPanelProps {
  userId: string;
}

export interface AuditLogViewerProps {
  events: Array<{ id: string; timestamp: Date; action: string; status: string }>;
  isLoading?: boolean;
  error?: string;
}

export interface ComplianceStatusDashboardProps {
  frameworks?: string[];
  statuses?: Record<string, "reported-compliant" | "attention-needed" | "unknown">;
  compact?: boolean;
}

export interface PrivacyRequestManagerProps {
  userId: string;
  onRequestSubmit?: (type: string) => void;
}

export interface SessionManagerProps {
  sessions: Array<{ id: string; createdAt: Date; browser: string }>;
  onRevoke?: (sessionId: string) => void;
}

// =============================================================================
// Components
// =============================================================================

/**
 * RoleManagementPanel
 * Manage user roles and permissions
 */
export const RoleManagementPanel: React.FC<RoleManagementPanelProps> = ({
  userId,
  currentRoles,
}) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Role Management")}</h3>
      <p>{t("User: {userId}", { userId })}</p>
      <div>
        <strong>{t("Current Roles:")}</strong>
        <ul>
          {currentRoles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
      <p style={{ fontSize: "12px", color: colorTokens.text.secondary }}>
        {t("Display only. Connect an authoritative identity service before enabling role changes.")}
      </p>
    </div>
  );
};

/**
 * MFASetupPanel
 * Configure multi-factor authentication
 */
export const MFASetupPanel: React.FC<MFASetupPanelProps> = ({ userId }) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("MFA Setup")}</h3>
      <p>{t("User: {userId}", { userId })}</p>
      <p>
        Authentication setup is not connected. Use your organization’s identity provider to
        configure MFA.
      </p>
    </div>
  );
};

/**
 * AuditLogViewer
 * Display and filter audit events
 */
export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ events, isLoading, error }) => {
  const t = useT();
  if (isLoading) {
    return <div style={{ padding: "16px" }}>{t("Loading events...")}</div>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fee",
          border: "1px solid #f99",
          borderRadius: "4px",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Audit Log")}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>{t("Timestamp")}</th>
            <th style={{ padding: "8px", textAlign: "left" }}>{t("Action")}</th>
            <th style={{ padding: "8px", textAlign: "left" }}>{t("Status")}</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 10).map((event) => (
            <tr key={event.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{event.timestamp.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{event.action}</td>
              <td
                style={{
                  padding: "8px",
                  color: event.status === "success" ? "#0a0" : "#f00",
                }}
              >
                {event.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "12px", color: colorTokens.text.tertiary, marginTop: "8px" }}>
        {t("Showing 10 of {count} events", { count: events.length })}
      </p>
    </div>
  );
};

/**
 * ComplianceStatusDashboard
 * Display compliance status across frameworks
 */
export const ComplianceStatusDashboard: React.FC<ComplianceStatusDashboardProps> = ({
  frameworks = ["GDPR", "HIPAA", "SOC2"],
  statuses = {},
  compact,
}) => {
  const t = useT();
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>{t("Compliance Status")}</h3>
      {frameworks.map((framework) => {
        const status = statuses[framework] ?? "unknown";
        const label =
          status === "reported-compliant"
            ? "Reported compliant"
            : status === "attention-needed"
              ? t("Attention needed")
              : t("Not connected");
        return (
          <div
            key={framework}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "8px",
              marginBottom: "8px",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>{framework}</span>
            <span
              role="status"
              aria-label={`${framework}: ${label}`}
              style={{
                fontSize: "12px",
                color:
                  status === "reported-compliant"
                    ? "#176b37"
                    : status === "attention-needed"
                      ? "#9b2c2c"
                      : colorTokens.text.secondary,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
      {!compact && (
        <p style={{ fontSize: "12px", color: colorTokens.text.secondary }}>
          Statuses are supplied by your application; this display does not certify compliance.
        </p>
      )}
    </div>
  );
};

/**
 * PrivacyRequestManager
 * Handle GDPR and privacy requests
 */
export const PrivacyRequestManager: React.FC<PrivacyRequestManagerProps> = ({
  userId,
  onRequestSubmit,
}) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Privacy Requests")}</h3>
      <p>{t("User: {userId}", { userId })}</p>
      <p>{t("Request types:")}</p>
      <ul>
        <li>
          <button onClick={() => onRequestSubmit?.("access")}>{t("Access")}</button>
        </li>
        <li>
          <button onClick={() => onRequestSubmit?.("delete")}>{t("Deletion")}</button>
        </li>
        <li>
          <button onClick={() => onRequestSubmit?.("portability")}>{t("Portability")}</button>
        </li>
      </ul>
      <p style={{ fontSize: "12px", color: colorTokens.text.tertiary }}>
        {t("TODO: Implement privacy request workflow")}
      </p>
    </div>
  );
};

/**
 * SessionManager
 * Manage user sessions and active logins
 */
export const SessionManager: React.FC<SessionManagerProps> = ({ sessions, onRevoke }) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Active Sessions")}</h3>
      {sessions.length === 0 ? (
        <p>{t("No active sessions")}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>{t("Started")}</th>
              <th style={{ padding: "8px", textAlign: "left" }}>{t("Browser")}</th>
              <th style={{ padding: "8px", textAlign: "left" }}>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{session.createdAt.toLocaleString()}</td>
                <td style={{ padding: "8px" }}>{session.browser}</td>
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => onRevoke?.(session.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#f99",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {t("Revoke")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
