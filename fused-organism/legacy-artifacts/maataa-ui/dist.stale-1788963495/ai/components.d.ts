/**
 * @maataa/ui/ai/components
 * ML/AI visualization components
 */
import React from "react";
export interface MLInsightsPanelProps {
    title?: string;
    insights?: Array<{
        id: string;
        label: string;
        value: number;
    }>;
}
export interface PredictionChartProps {
    predictions: number[];
    historical: number[];
    confidence?: number;
}
export interface AnomalyAlertsProps {
    anomalies?: Array<{
        id: string;
        severity: string;
        description: string;
    }>;
    onDismiss?: (id: string) => void;
}
export interface RecommendationCardsProps {
    recommendations?: Array<{
        id: string;
        title: string;
        description: string;
        score: number;
    }>;
    onAccept?: (id: string) => void;
    onDismiss?: (id: string) => void;
}
export interface EmbeddingVisualizationProps {
    embeddings?: Array<{
        id: string;
        x: number;
        y: number;
    }>;
    onNodeClick?: (id: string) => void;
}
/**
 * MLInsightsPanel
 * Display ML-derived insights
 */
export declare const MLInsightsPanel: React.FC<MLInsightsPanelProps>;
/**
 * PredictionChart
 * Display predictions vs historical data
 */
export declare const PredictionChart: React.FC<PredictionChartProps>;
/**
 * AnomalyAlerts
 * Display detected anomalies
 */
export declare const AnomalyAlerts: React.FC<AnomalyAlertsProps>;
/**
 * RecommendationCards
 * Display ML-generated recommendations
 */
export declare const RecommendationCards: React.FC<RecommendationCardsProps>;
/**
 * EmbeddingVisualization
 * Visualize embeddings in 2D space
 */
export declare const EmbeddingVisualization: React.FC<EmbeddingVisualizationProps>;
//# sourceMappingURL=components.d.ts.map