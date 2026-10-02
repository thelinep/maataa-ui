/**
 * Graph Neural Network (GNN) Analysis Engine
 * Analyzes node embeddings and graph relationships
 */
/**
 * GNN Analyzer
 * Analyzes graph structures using neural network techniques
 */
export declare class GNNAnalyzer {
    private nodes;
    private edges;
    constructor();
    /**
     * Add node to graph
     */
    addNode(nodeId: string, features: Record<string, number>): void;
    /**
     * Add edge between nodes
     */
    addEdge(fromId: string, toId: string, weight?: number): void;
    /**
     * Compute node embeddings
     */
    computeEmbeddings(dimensions?: number): Map<string, number[]>;
    /**
     * Find similar nodes based on embeddings
     */
    findSimilarNodes(nodeId: string, topK?: number): string[];
    /**
     * Detect community structure
     */
    detectCommunities(): Map<string, string[]>;
    /**
     * Compute graph centrality measures
     */
    computeCentrality(): Map<string, {
        degree: number;
        betweenness: number;
    }>;
    private computeSimilarity;
    private bfsTraverse;
}
/**
 * Node Embedding Visualizer
 * Visualizes node embeddings in 2D/3D space
 */
export declare class NodeEmbeddingVisualizer {
    /**
     * Project high-dimensional embeddings to 2D (t-SNE/UMAP simplified)
     */
    projectTo2D(embeddings: Map<string, number[]>, iterations?: number): Map<string, {
        x: number;
        y: number;
    }>;
    /**
     * Project embeddings to 3D
     */
    projectTo3D(embeddings: Map<string, number[]>): Map<string, {
        x: number;
        y: number;
        z: number;
    }>;
    /**
     * Compute layout for visualization
     */
    computeLayout(nodes: Map<string, number[]>): VisualizationLayout;
    private calculateBounds;
}
export interface VisualizationLayout {
    nodes: Array<{
        id: string;
        position: {
            x: number;
            y: number;
        };
        size: number;
        color: string;
    }>;
    edges: Array<{
        from: string;
        to: string;
        strength: number;
    }>;
    bounds: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };
}
//# sourceMappingURL=gnn.d.ts.map