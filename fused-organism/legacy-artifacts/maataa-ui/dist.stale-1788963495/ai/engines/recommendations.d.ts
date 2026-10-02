/**
 * Recommendation Engines
 * Connection, collaboration, and health suggestions
 */
/**
 * Connection Recommendation Engine
 * Recommends new connections for users
 */
export declare class ConnectionRecommendationEngine {
    /**
     * Generate connection recommendations
     */
    recommend(userId: string, topK?: number): Recommendation[];
    /**
     * Calculate recommendation score
     */
    calculateScore(user1: string, user2: string): number;
}
/**
 * Collaboration Opportunity Detector
 * Detects collaboration opportunities between users
 */
export declare class CollaborationOpportunityDetector {
    /**
     * Detect collaboration opportunities
     */
    detectOpportunities(userIds: string[]): CollaborationOpportunity[];
    /**
     * Calculate collaboration potential
     */
    calculatePotential(user1: string, user2: string): number;
}
/**
 * Network Health Suggester
 * Suggests improvements for network health
 */
export declare class NetworkHealthSuggester {
    /**
     * Get health suggestions
     */
    getSuggestions(): HealthSuggestion[];
    /**
     * Calculate network health score
     */
    calculateHealthScore(): number;
}
interface Recommendation {
    userId: string;
    score: number;
    reason: string;
}
interface CollaborationOpportunity {
    users: string[];
    score: number;
    domain: string;
}
interface HealthSuggestion {
    id: string;
    title: string;
    description: string;
    impact: "low" | "medium" | "high";
    priority: "low" | "medium" | "high";
}
export {};
//# sourceMappingURL=recommendations.d.ts.map