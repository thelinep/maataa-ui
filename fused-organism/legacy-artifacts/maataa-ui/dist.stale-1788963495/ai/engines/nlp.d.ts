/**
 * Natural Language Processing (NLP) Engines
 * Text extraction, sentiment analysis, relationship detection
 */
/**
 * Text Relationship Extractor
 * Extracts relationships between entities in text
 */
export declare class TextRelationshipExtractor {
    /**
     * Extract relationships from text
     */
    extractRelationships(text: string): Relationship[];
}
/**
 * Relationship Sentiment Analyzer
 * Analyzes sentiment of relationships mentioned in text
 */
export declare class RelationshipSentimentAnalyzer {
    /**
     * Analyze sentiment of relationship
     */
    analyzeSentiment(text: string): {
        positive: number;
        negative: number;
        neutral: number;
    };
}
/**
 * Relationship Description Generator
 * Generates natural language descriptions of relationships
 */
export declare class RelationshipDescriptionGenerator {
    /**
     * Generate description for relationship
     */
    generateDescription(from: string, to: string, relationType: string): string;
}
/**
 * Text Preprocessor
 * Cleans and normalizes text
 */
export declare class TextPreprocessor {
    /**
     * Preprocess text
     */
    preprocess(text: string): string;
    /**
     * Tokenize text
     */
    tokenize(text: string): string[];
    /**
     * Remove stopwords
     */
    removeStopwords(tokens: string[]): string[];
}
interface Relationship {
    from: string;
    to: string;
    type: string;
    confidence: number;
}
export {};
//# sourceMappingURL=nlp.d.ts.map