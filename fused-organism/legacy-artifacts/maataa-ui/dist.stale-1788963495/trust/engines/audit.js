/**
 * Audit System and Data Retention Manager
 * Tracks all system events and manages data lifecycle
 */
/**
 * Audit System
 * Logs all events and detects anomalies
 */
export class AuditSystem {
    constructor() {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "anomalyThresholds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Log an audit event
     */
    logEvent(event) {
        const auditEvent = {
            ...event,
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        this.events.push(auditEvent);
        return auditEvent;
    }
    /**
     * Query events with filters
     */
    queryEvents(filters, limit = 100) {
        let results = this.events;
        if (filters.userId) {
            results = results.filter((e) => e.userId === filters.userId);
        }
        if (filters.action) {
            results = results.filter((e) => e.action === filters.action);
        }
        if (filters.resource) {
            results = results.filter((e) => e.resource === filters.resource);
        }
        if (filters.startDate) {
            results = results.filter((e) => e.timestamp >= filters.startDate);
        }
        if (filters.endDate) {
            results = results.filter((e) => e.timestamp <= filters.endDate);
        }
        if (filters.status) {
            results = results.filter((e) => e.status === filters.status);
        }
        return results.slice(-limit);
    }
    /**
     * Generate audit report for date range
     */
    generateReport(startDate, endDate) {
        const events = this.queryEvents({ startDate, endDate });
        const successCount = events.filter((e) => e.status === "success").length;
        const failureCount = events.filter((e) => e.status === "failure").length;
        // Calculate top actions
        const actionCounts = new Map();
        events.forEach((e) => {
            actionCounts.set(e.action, (actionCounts.get(e.action) || 0) + 1);
        });
        // Calculate top resources
        const resourceCounts = new Map();
        events.forEach((e) => {
            resourceCounts.set(e.resource, (resourceCounts.get(e.resource) || 0) + 1);
        });
        // Calculate top users
        const userCounts = new Map();
        events.forEach((e) => {
            userCounts.set(e.userId, (userCounts.get(e.userId) || 0) + 1);
        });
        return {
            id: `audit_${Date.now()}`,
            startDate,
            endDate,
            eventCount: events.length,
            events,
            summary: {
                successCount,
                failureCount,
                topActions: Array.from(actionCounts.entries())
                    .map(([action, count]) => ({ action, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
                topResources: Array.from(resourceCounts.entries())
                    .map(([resource, count]) => ({ resource, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
                topUsers: Array.from(userCounts.entries())
                    .map(([userId, count]) => ({ userId, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
            },
            generatedAt: new Date(),
            generatedBy: "system",
        };
    }
    /**
     * Detect anomalies in audit events
     */
    detectAnomalies(timeWindowMinutes = 60) {
        const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
        const recentEvents = this.events.filter((e) => e.timestamp >= cutoffTime);
        const anomalies = [];
        // Detect failed authentication attempts
        const failedAuths = recentEvents.filter((e) => e.action === "authenticate" && e.status === "failure");
        if (failedAuths.length > 5) {
            anomalies.push({
                id: `anom_${Date.now()}`,
                type: "failed_attempts",
                severity: failedAuths.length > 10 ? "high" : "medium",
                description: `${failedAuths.length} failed authentication attempts in last ${timeWindowMinutes} minutes`,
                detectedAt: new Date(),
                affectedResource: "authentication",
                evidenceCount: failedAuths.length,
            });
        }
        // Detect unusual access patterns (TODO: implement statistical analysis)
        const riskLevel = anomalies.length === 0
            ? "low"
            : anomalies.some((a) => a.severity === "high")
                ? "high"
                : "medium";
        return {
            id: `report_${Date.now()}`,
            timestamp: new Date(),
            anomalies,
            riskLevel,
            recommendations: anomalies.map((a) => `Review ${a.type}: ${a.description}`),
        };
    }
}
/**
 * Data Retention Manager
 * Manages data lifecycle, archival, and deletion
 */
export class DataRetentionManager {
    constructor() {
        Object.defineProperty(this, "retentionPolicies", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "dataRetentionRecords", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "exceptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * Create or update retention policy
     */
    setRetentionPolicy(policy) {
        if (!policy.id) {
            throw new Error("Policy must have an id");
        }
        this.retentionPolicies.set(policy.id, policy);
    }
    /**
     * Track data for retention
     */
    trackData(dataId, dataType, policyId) {
        const policy = this.retentionPolicies.get(policyId);
        if (!policy) {
            return null;
        }
        const retention = {
            dataId,
            dataType,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + policy.deleteAfterDays * 24 * 60 * 60 * 1000),
            archived: false,
            deleted: false,
        };
        this.dataRetentionRecords.set(dataId, retention);
        return retention;
    }
    /**
     * Archive data
     */
    archiveData(dataId) {
        const retention = this.dataRetentionRecords.get(dataId);
        if (retention) {
            retention.archived = true;
            retention.archivedAt = new Date();
            this.dataRetentionRecords.set(dataId, retention);
        }
    }
    /**
     * Delete data
     */
    deleteData(dataId) {
        const retention = this.dataRetentionRecords.get(dataId);
        if (retention) {
            retention.deleted = true;
            retention.deletedAt = new Date();
            this.dataRetentionRecords.set(dataId, retention);
        }
    }
    /**
     * Check if data should be archived or deleted
     */
    checkRetentionStatus() {
        const now = new Date();
        const toArchive = [];
        const toDelete = [];
        this.dataRetentionRecords.forEach((retention, dataId) => {
            if (retention.deleted)
                return;
            const policy = this.retentionPolicies.get(this.getPolicyForDataType(retention.dataType));
            if (!policy)
                return;
            // Check if should be archived
            if (!retention.archived &&
                policy.archiveAfterDays &&
                now.getTime() - retention.createdAt.getTime() >
                    policy.archiveAfterDays * 24 * 60 * 60 * 1000) {
                toArchive.push(dataId);
            }
            // Check if should be deleted
            if (!retention.deleted && now > retention.expiresAt) {
                toDelete.push(dataId);
            }
        });
        return { toArchive, toDelete };
    }
    /**
     * Create retention exception
     */
    createException(reason, expiresAt, approvedBy, dataId) {
        const exception = {
            id: `exc_${Date.now()}`,
            dataId,
            reason,
            expiresAt,
            approvedBy,
            approvedAt: new Date(),
        };
        this.exceptions.push(exception);
        return exception;
    }
    /**
     * Check if data has active exception
     */
    hasException(dataId) {
        const now = new Date();
        return this.exceptions.some((e) => e.dataId === dataId && e.expiresAt > now);
    }
    /**
     * Get policy for data type
     */
    getPolicyForDataType(dataType) {
        // In production, this would look up the appropriate policy
        return "default-policy";
    }
}
//# sourceMappingURL=audit.js.map