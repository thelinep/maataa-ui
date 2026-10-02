import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =============================================================================
// Components
// =============================================================================
/**
 * RoleManagementPanel
 * Manage user roles and permissions
 */
export const RoleManagementPanel = ({ userId, currentRoles, onRolesChange, }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Role Management" }), _jsxs("p", { children: ["User: ", userId] }), _jsxs("div", { children: [_jsx("strong", { children: "Current Roles:" }), _jsx("ul", { children: currentRoles.map((role) => (_jsx("li", { children: role }, role))) })] }), _jsx("p", { style: { fontSize: "12px", color: "#999" }, children: "TODO: Implement role assignment UI" })] }));
};
/**
 * MFASetupPanel
 * Configure multi-factor authentication
 */
export const MFASetupPanel = ({ userId, onComplete }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "MFA Setup" }), _jsxs("p", { children: ["User: ", userId] }), _jsx("p", { children: "Select authentication method:" }), _jsxs("ul", { children: [_jsx("li", { children: "TOTP (Google Authenticator)" }), _jsx("li", { children: "SMS" }), _jsx("li", { children: "Email" }), _jsx("li", { children: "Hardware Key" })] }), _jsx("p", { style: { fontSize: "12px", color: "#999" }, children: "TODO: Implement MFA setup flow" })] }));
};
/**
 * AuditLogViewer
 * Display and filter audit events
 */
export const AuditLogViewer = ({ events, isLoading, error }) => {
    if (isLoading) {
        return _jsx("div", { style: { padding: "16px" }, children: "Loading events..." });
    }
    if (error) {
        return (_jsxs("div", { style: {
                padding: "16px",
                backgroundColor: "#fee",
                border: "1px solid #f99",
                borderRadius: "4px",
            }, children: ["Error: ", error] }));
    }
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Audit Log" }), _jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px" }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: "2px solid #ddd" }, children: [_jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Timestamp" }), _jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Action" }), _jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Status" })] }) }), _jsx("tbody", { children: events.slice(0, 10).map((event) => (_jsxs("tr", { style: { borderBottom: "1px solid #eee" }, children: [_jsx("td", { style: { padding: "8px" }, children: event.timestamp.toLocaleString() }), _jsx("td", { style: { padding: "8px" }, children: event.action }), _jsx("td", { style: {
                                        padding: "8px",
                                        color: event.status === "success" ? "#0a0" : "#f00",
                                    }, children: event.status })] }, event.id))) })] }), _jsxs("p", { style: { fontSize: "12px", color: "#999", marginTop: "8px" }, children: ["Showing 10 of ", events.length, " events"] })] }));
};
/**
 * ComplianceStatusDashboard
 * Display compliance status across frameworks
 */
export const ComplianceStatusDashboard = ({ frameworks = ["GDPR", "HIPAA", "SOC2"], compact, }) => {
    return (_jsxs("div", { style: {
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
        }, children: [_jsx("h3", { children: "Compliance Status" }), frameworks.map((framework) => (_jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                    borderBottom: "1px solid #eee",
                }, children: [_jsx("span", { children: framework }), _jsx("div", { style: {
                            width: "60px",
                            height: "6px",
                            backgroundColor: "#ddd",
                            borderRadius: "3px",
                            overflow: "hidden",
                        }, children: _jsx("div", { style: {
                                width: "85%",
                                height: "100%",
                                backgroundColor: "#0a0",
                            } }) }), _jsx("span", { style: { fontSize: "12px", minWidth: "40px", textAlign: "right" }, children: "85%" })] }, framework))), _jsx("p", { style: { fontSize: "12px", color: "#999" }, children: "TODO: Connect to real compliance data" })] }));
};
/**
 * PrivacyRequestManager
 * Handle GDPR and privacy requests
 */
export const PrivacyRequestManager = ({ userId, onRequestSubmit, }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Privacy Requests" }), _jsxs("p", { children: ["User: ", userId] }), _jsx("p", { children: "Request types:" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx("button", { onClick: () => onRequestSubmit?.("access"), children: "Access" }) }), _jsx("li", { children: _jsx("button", { onClick: () => onRequestSubmit?.("delete"), children: "Deletion" }) }), _jsx("li", { children: _jsx("button", { onClick: () => onRequestSubmit?.("portability"), children: "Portability" }) })] }), _jsx("p", { style: { fontSize: "12px", color: "#999" }, children: "TODO: Implement privacy request workflow" })] }));
};
/**
 * SessionManager
 * Manage user sessions and active logins
 */
export const SessionManager = ({ sessions, onRevoke }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Active Sessions" }), sessions.length === 0 ? (_jsx("p", { children: "No active sessions" })) : (_jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px" }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: "2px solid #ddd" }, children: [_jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Started" }), _jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Browser" }), _jsx("th", { style: { padding: "8px", textAlign: "left" }, children: "Action" })] }) }), _jsx("tbody", { children: sessions.map((session) => (_jsxs("tr", { style: { borderBottom: "1px solid #eee" }, children: [_jsx("td", { style: { padding: "8px" }, children: session.createdAt.toLocaleString() }), _jsx("td", { style: { padding: "8px" }, children: session.browser }), _jsx("td", { style: { padding: "8px" }, children: _jsx("button", { onClick: () => onRevoke?.(session.id), style: {
                                            padding: "4px 8px",
                                            backgroundColor: "#f99",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }, children: "Revoke" }) })] }, session.id))) })] }))] }));
};
//# sourceMappingURL=components.js.map