/**
 * @maataa/ui/ai
 * AI components: chat (LocalChat for local models), Sochen, ML insights
 */

export {
  MLInsightsPanel,
  PredictionChart,
  AnomalyAlerts,
  RecommendationCards,
  EmbeddingVisualization,
} from "./components";

export type {
  MLInsightsPanelProps,
  PredictionChartProps,
  AnomalyAlertsProps,
  RecommendationCardsProps,
  EmbeddingVisualizationProps,
} from "./components";

// Sochen
export {
  ThoughtInput,
  ModelResponse,
  ModelConfiguredCheck,
  ThoughtHistory,
  type ThoughtInputProps,
  type ModelResponseProps,
  type ModelConfiguredCheckProps,
  type ThoughtHistoryProps,
  type ThoughtRecord,
} from "./Sochen";

// UI element catalog batch J
export {
  AIChatBubble,
  AITypingIndicator,
  InteractionModeSwitcher,
  type AIChatBubbleProps,
  type InteractionMode,
} from "./AssistantUI";

// Local chatbot
export {
  LocalChat,
  type LocalChatProps,
  type LocalChatMessage,
  type ChatTransport,
  type ChatContext,
  type ChatCommand,
} from "./LocalChat";
export {
  streamChat,
  listLocalModels,
  LocalModelError,
  DEFAULT_LOCAL_MODEL_URL,
  type ChatMessage,
  type ChatRole,
  type LocalModelApi,
  type LocalModelOptions,
  type LocalModelErrorKind,
} from "./localModel";
export {
  createKeywordRetriever,
  formatContext,
  tokenize,
  type DocChunk,
  type DocHit,
} from "./docsSearch";

// Rich replies
export {
  ChatMarkdown,
  CodeBlock,
  parseMarkdown,
  parseFenceInfo,
  findFencedBlocks,
  renderInline,
  renderInlineWithMath,
  type ChatMarkdownProps,
  type MathRenderer,
  type FencedBlock,
} from "./ChatMarkdown";
export {
  ChatChart,
  ChatChoices,
  ChatMap,
  renderChatBlock,
  findArtifacts,
  findTasks,
  CHAT_BLOCKS_PROMPT,
  CHAT_DIAGRAM_PROMPT,
  CHAT_MEDIA_PROMPT,
  CHAT_BLOCK_KINDS,
  type ChatArtifact,
  type ChatBlockOptions,
} from "./ChatBlocks";
export { useSpeech, speakableText } from "./speech";
