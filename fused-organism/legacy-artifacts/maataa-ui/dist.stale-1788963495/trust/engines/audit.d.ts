/**
 * Audit System and Data Retention Manager
 * Tracks all system events and manages data lifecycle
 */
import type { AuditEvent, AuditReport, AnomalyReport, DataRetention, RetentionPolicy, RetentionException } from "../types";
/**
 * Audit System
 * Logs all events and detects anomalies
 */
export declare class AuditSystem {
    private events;
    private anomalyThresholds;
    /**
     * Log an audit event
     */
    logEvent(event: Omit<AuditEvent, "id">): AuditEvent;
    /**
     * Query events with filters
     */
    queryEvents(filters: {
        userId?: string;
        action?: string;
        resource?: string;
        startDate?: Date;
        endDate?: Date;
        status?: "success" | "failure";
    }, limit?: number): AuditEvent[];
    /**
     * Generate audit report for date range
     */
    generateReport(startDate: Date, endDate: Date): AuditReport;
    /**
     * Detect anomalies in audit events
     */
    detectAnomalies(timeWindowMinutes?: number): AnomalyReport;
}
/**
 * Data Retention Manager
 * Manages data lifecycle, archival, and deletion
 */
export declare class DataRetentionManager {
    private retentionPolicies;
    private dataRetentionRecords;
    private exceptions;
    /**
     * Create or update retention policy
     */
    setRetentionPolicy(policy: RetentionPolicy): void;
    /**
     * Track data for retention
     */
    trackData(dataId: string, dataType: string, policyId: string): DataRetention | null;
    /**
     * Archive data
     */
    archiveData(dataId: string): void;
    /**
     * Delete data
     */
    deleteData(dataId: string): void;
    /**
     * Check if data should be archived or deleted
     */
    checkRetentionStatus(): {
        toArchive: string[];
        toDelete: string[];
    };
    /**
     * Create retention exception
     */
    createException(reason: string, expiresAt: Date, approvedBy: string, dataId?: string): RetentionException;
    /**
     * Check if data has active exception
     */
    hasException(dataId: string): boolean;
    /**
     * Get policy for data type
     */
    private getPolicyForDataType;
}
//# sourceMappingURL=audit.d.ts.map