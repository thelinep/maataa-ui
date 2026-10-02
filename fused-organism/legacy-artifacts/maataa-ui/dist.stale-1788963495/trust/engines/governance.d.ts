/**
 * Data Governance and Quality Management Engines
 */
import type { DataClassification, DataGovernancePolicy, DataQualityMetrics, DataQualityIssue } from "../types";
/**
 * Data Governance Engine
 * Manages data classification and governance policies
 */
export declare class DataGovernanceEngine {
    private policies;
    private classifications;
    constructor();
    /**
     * Initialize standard data classification levels
     */
    private initializeClassifications;
    /**
     * Get classification for level
     */
    getClassification(level: number): DataClassification | undefined;
    /**
     * Create or update governance policy
     */
    createPolicy(policy: DataGovernancePolicy): void;
    /**
     * Get policy
     */
    getPolicy(policyId: string): DataGovernancePolicy | undefined;
    /**
     * Classify data based on characteristics
     */
    classifyData(dataType: string, containsSensitiveInfo: boolean, containsPII: boolean, containsPaymentInfo: boolean): DataClassification;
    /**
     * List all policies
     */
    listPolicies(): DataGovernancePolicy[];
    /**
     * Delete policy
     */
    deletePolicy(policyId: string): boolean;
}
/**
 * Data Quality Manager
 * Monitors and reports on data quality metrics
 */
export declare class DataQualityManager {
    private metrics;
    private issues;
    /**
     * Record data quality metrics
     */
    recordMetrics(completeness: number, accuracy: number, consistency: number, timeliness: number, uniqueness: number): DataQualityMetrics;
    /**
     * Report data quality issue
     */
    reportIssue(type: "missing_data" | "invalid_format" | "duplicate" | "inconsistency" | "stale_data", severity: "low" | "medium" | "high" | "critical", affectedRecords: number, description: string): DataQualityIssue;
    /**
     * Resolve quality issue
     */
    resolveIssue(issueId: string): void;
    /**
     * Get current metrics
     */
    getCurrentMetrics(): DataQualityMetrics | undefined;
    /**
     * Get metrics for time range
     */
    getMetricsForRange(startDate: Date, endDate: Date): DataQualityMetrics[];
    /**
     * Get unresolved issues
     */
    getUnresolvedIssues(): DataQualityIssue[];
    /**
     * Get quality score trend (simplified)
     */
    getQualityTrend(dayCount?: number): number[];
    /**
     * Calculate data quality score
     */
    calculateQualityScore(): {
        score: number;
        status: string;
    };
}
//# sourceMappingURL=governance.d.ts.map