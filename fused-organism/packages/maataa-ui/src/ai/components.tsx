/**
 * @maataa/ui/ai/components
 * ML/AI visualization components
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens } from "../tokens";

export interface MLInsightsPanelProps {
  title?: string;
  insights?: Array<{ id: string; label: string; value: number }>;
}

export interface PredictionChartProps {
  predictions: number[];
  historical: number[];
  confidence?: number;
}

export interface AnomalyAlertsProps {
  anomalies?: Array<{ id: string; severity: string; description: string }>;
  onDismiss?: (id: string) => void;
}

export interface RecommendationCardsProps {
  recommendations?: Array<{ id: string; title: string; description: string; score: number }>;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export interface EmbeddingVisualizationProps {
  embeddings?: Array<{ id: string; x: number; y: number }>;
  onNodeClick?: (id: string) => void;
}

/**
 * MLInsightsPanel
 * Display ML-derived insights
 */
export const MLInsightsPanel: React.FC<MLInsightsPanelProps> = ({
  title: titleProp,
  insights = [],
}) => {
  const t = useT();
  const title = titleProp ?? t("ML Insights");
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{title}</h3>
      {insights.length === 0 ? (
        <p>{t("No insights available")}</p>
      ) : (
        <ul>
          {insights.map((insight) => (
            <li key={insight.id}>
              {insight.label}: {insight.value.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * PredictionChart
 * Display predictions vs historical data
 */
export const PredictionChart: React.FC<PredictionChartProps> = ({
  predictions,
  historical,
  confidence,
}) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Predictions")}</h3>
      <p style={{ fontSize: "12px", color: colorTokens.text.tertiary }}>
        {confidence
          ? t("Showing {count} historical + {count2} predicted points (confidence: {pct}%)", {
              count: historical.length,
              count2: predictions.length,
              pct: (confidence * 100).toFixed(0),
            })
          : t("Showing {count} historical + {count2} predicted points", {
              count: historical.length,
              count2: predictions.length,
            })}
      </p>
      <div
        style={{
          height: "200px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: colorTokens.text.tertiary }}>{t("Chart placeholder")}</p>
      </div>
    </div>
  );
};

/**
 * AnomalyAlerts
 * Display detected anomalies
 */
export const AnomalyAlerts: React.FC<AnomalyAlertsProps> = ({ anomalies = [], onDismiss }) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Anomaly Alerts")}</h3>
      {anomalies.length === 0 ? (
        <p style={{ color: "#0a0" }}>{t("No anomalies detected")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {anomalies.map((anomaly) => (
            <li
              key={anomaly.id}
              style={{
                padding: "8px",
                marginBottom: "8px",
                backgroundColor: anomaly.severity === "high" ? "#fee" : "#ffe",
                borderLeft: `4px solid ${anomaly.severity === "high" ? "#f00" : "#f90"}`,
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{anomaly.description}</span>
              <button
                onClick={() => onDismiss?.(anomaly.id)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * RecommendationCards
 * Display ML-generated recommendations
 */
export const RecommendationCards: React.FC<RecommendationCardsProps> = ({
  recommendations = [],
  onAccept,
  onDismiss,
}) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Recommendations")}</h3>
      {recommendations.length === 0 ? (
        <p>{t("No recommendations available")}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                padding: "12px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
                border: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{rec.title}</div>
              <div
                style={{ fontSize: "12px", color: colorTokens.text.secondary, marginBottom: "8px" }}
              >
                {rec.description}
              </div>
              <div
                style={{ fontSize: "12px", color: colorTokens.text.tertiary, marginBottom: "8px" }}
              >
                Score: {(rec.score * 100).toFixed(0)}%
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => onAccept?.(rec.id)}
                  style={{
                    flex: 1,
                    padding: "4px",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {t("Accept")}
                </button>
                <button
                  onClick={() => onDismiss?.(rec.id)}
                  style={{
                    flex: 1,
                    padding: "4px",
                    backgroundColor: "#ddd",
                    color: colorTokens.text.primary,
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {t("Dismiss")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * EmbeddingVisualization
 * Visualize embeddings in 2D space
 */
export const EmbeddingVisualization: React.FC<EmbeddingVisualizationProps> = ({
  embeddings = [],
  onNodeClick,
}) => {
  const t = useT();
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{t("Embedding Visualization")}</h3>
      <div
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {embeddings.length === 0 ? (
          <p style={{ color: colorTokens.text.tertiary }}>{t("No embeddings to visualize")}</p>
        ) : (
          <svg width="100%" height="100%">
            {embeddings.map((embedding) => (
              <circle
                key={embedding.id}
                cx={embedding.x * 300 + 150}
                cy={embedding.y * 300 + 150}
                r="5"
                fill="#3498db"
                opacity="0.7"
                onClick={() => onNodeClick?.(embedding.id)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </svg>
        )}
      </div>
      <p style={{ fontSize: "12px", color: colorTokens.text.tertiary, marginTop: "8px" }}>
        {t("Showing {count} embeddings", { count: embeddings.length })}
      </p>
    </div>
  );
};
