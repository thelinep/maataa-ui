import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * MLInsightsPanel
 * Display ML-derived insights
 */
export const MLInsightsPanel = ({ title = "ML Insights", insights = [], }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: title }), insights.length === 0 ? (_jsx("p", { children: "No insights available" })) : (_jsx("ul", { children: insights.map((insight) => (_jsxs("li", { children: [insight.label, ": ", insight.value.toFixed(2)] }, insight.id))) }))] }));
};
/**
 * PredictionChart
 * Display predictions vs historical data
 */
export const PredictionChart = ({ predictions, historical, confidence, }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Predictions" }), _jsxs("p", { style: { fontSize: "12px", color: "#999" }, children: ["Showing ", historical.length, " historical + ", predictions.length, " predicted points", confidence && ` (Confidence: ${(confidence * 100).toFixed(0)}%)`] }), _jsx("div", { style: {
                    height: "200px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: _jsx("p", { style: { color: "#999" }, children: "Chart placeholder" }) })] }));
};
/**
 * AnomalyAlerts
 * Display detected anomalies
 */
export const AnomalyAlerts = ({ anomalies = [], onDismiss }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Anomaly Alerts" }), anomalies.length === 0 ? (_jsx("p", { style: { color: "#0a0" }, children: "No anomalies detected" })) : (_jsx("ul", { style: { listStyle: "none", padding: 0 }, children: anomalies.map((anomaly) => (_jsxs("li", { style: {
                        padding: "8px",
                        marginBottom: "8px",
                        backgroundColor: anomaly.severity === "high" ? "#fee" : "#ffe",
                        borderLeft: `4px solid ${anomaly.severity === "high" ? "#f00" : "#f90"}`,
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }, children: [_jsx("span", { children: anomaly.description }), _jsx("button", { onClick: () => onDismiss?.(anomaly.id), style: {
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                            }, children: "\u00D7" })] }, anomaly.id))) }))] }));
};
/**
 * RecommendationCards
 * Display ML-generated recommendations
 */
export const RecommendationCards = ({ recommendations = [], onAccept, onDismiss, }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Recommendations" }), recommendations.length === 0 ? (_jsx("p", { children: "No recommendations available" })) : (_jsx("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                }, children: recommendations.map((rec) => (_jsxs("div", { style: {
                        padding: "12px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "4px",
                        border: "1px solid #eee",
                    }, children: [_jsx("div", { style: { fontWeight: "bold", marginBottom: "4px" }, children: rec.title }), _jsx("div", { style: { fontSize: "12px", color: "#666", marginBottom: "8px" }, children: rec.description }), _jsxs("div", { style: { fontSize: "12px", color: "#999", marginBottom: "8px" }, children: ["Score: ", (rec.score * 100).toFixed(0), "%"] }), _jsxs("div", { style: { display: "flex", gap: "4px" }, children: [_jsx("button", { onClick: () => onAccept?.(rec.id), style: {
                                        flex: 1,
                                        padding: "4px",
                                        backgroundColor: "#3498db",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }, children: "Accept" }), _jsx("button", { onClick: () => onDismiss?.(rec.id), style: {
                                        flex: 1,
                                        padding: "4px",
                                        backgroundColor: "#ddd",
                                        color: "#333",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }, children: "Dismiss" })] })] }, rec.id))) }))] }));
};
/**
 * EmbeddingVisualization
 * Visualize embeddings in 2D space
 */
export const EmbeddingVisualization = ({ embeddings = [], onNodeClick, }) => {
    return (_jsxs("div", { style: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }, children: [_jsx("h3", { children: "Embedding Visualization" }), _jsx("div", { style: {
                    width: "100%",
                    height: "400px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                }, children: embeddings.length === 0 ? (_jsx("p", { style: { color: "#999" }, children: "No embeddings to visualize" })) : (_jsx("svg", { width: "100%", height: "100%", children: embeddings.map((embedding) => (_jsx("circle", { cx: embedding.x * 300 + 150, cy: embedding.y * 300 + 150, r: "5", fill: "#3498db", opacity: "0.7", onClick: () => onNodeClick?.(embedding.id), style: { cursor: "pointer" } }, embedding.id))) })) }), _jsxs("p", { style: { fontSize: "12px", color: "#999", marginTop: "8px" }, children: ["Showing ", embeddings.length, " embeddings"] })] }));
};
//# sourceMappingURL=components.js.map