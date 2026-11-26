// Calls for the phase 3 studio screens: knowledge, agents and automations,
// the coding studio, and the system screen. All go to Maataa Workstation
// through the desktop app's /nova proxy.
import { novaCall } from "./nova";

const get = <T>(path: string) => novaCall<T>(path);
const post = <T>(path: string, body: unknown = {}) =>
  novaCall<T>(path, { method: "POST", body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
  novaCall<T>(path, { method: "PUT", body: JSON.stringify(body) });
const del = <T>(path: string) => novaCall<T>(path, { method: "DELETE" });
const id = (s: string) => encodeURIComponent(s);

/** Ollama's cloud models (e.g. "deepseek-v4.1-flash:cloud") run on someone else's computer. */
export const isCloudModel = (name: string) => /(:|-)cloud$/i.test(name);

/** A short random id in the style Workstation uses for its own records. */
export const newId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// ---- knowledge -----------------------------------------------------------

export interface KnowledgeCollection {
  id: string;
  name: string;
  status?: string;
  embeddingModel?: string;
  docCount?: number;
  chunkCount?: number;
  lastIndexed?: string | null;
}
export interface KnowledgeDocument {
  id: string;
  collectionId: string;
  name: string;
  sizeKb: number;
  chunkCount: number;
  status: string;
  indexedAt?: string;
  embeddingModel?: string;
}
export interface KnowledgeHit {
  docName: string;
  text: string;
  score?: number;
  collectionId?: string;
}

export const listCollections = () => get<KnowledgeCollection[]>("/store/knowledgeCollections");
export async function listDocuments(): Promise<KnowledgeDocument[]> {
  const docs = await get<(KnowledgeDocument & { text?: string })[]>("/store/knowledgeDocuments");
  // The full text of every document comes back too; keep only what the list shows.
  return docs.map(({ text: _text, ...d }) => d);
}
export const createCollection = (name: string) =>
  put<KnowledgeCollection>("/store/knowledgeCollections", {
    id: newId("kc"),
    name,
    status: "pending",
    embeddingModel: "nomic-embed-text",
    docCount: 0,
    chunkCount: 0,
    lastIndexed: null,
  });
export const deleteCollection = (cid: string) => del<unknown>(`/store/knowledgeCollections/${id(cid)}`);
export const ingestDocument = (collectionId: string, name: string, text: string) =>
  post<{ document: KnowledgeDocument; chunkCount: number }>("/knowledge/ingest", {
    collectionId,
    name,
    text,
  });
export const deleteDocument = (did: string) => del<unknown>(`/knowledge/documents/${id(did)}`);
export const reindexCollection = (cid: string) => post<unknown>(`/knowledge/reindex/${id(cid)}`);
export const searchKnowledge = (query: string, collectionId?: string) =>
  post<{ results: KnowledgeHit[] }>("/knowledge/search", {
    query,
    topK: 6,
    ...(collectionId ? { collectionId } : {}),
  });

// ---- agents, workflows, automations, approvals --------------------------

export interface Agent {
  id: string;
  name: string;
  role?: string;
  status: string;
  description?: string;
  goal?: string;
  systemPrompt?: string;
  modelId?: string | null;
  lastRun?: string | null;
  lastResult?: { instruction: string; content: string; rounds?: number; at?: string } | null;
}
export interface WorkflowNode {
  id?: string;
  type: string;
  ref?: string | null;
  label: string;
}
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: string;
  nodes: WorkflowNode[];
}
export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: string;
  currentNodeId?: string | null;
  startedAt: string;
  finishedAt?: string | null;
  lastOutput?: string | null;
  error?: string | null;
  steps: { nodeId: string; status: string }[];
}
export interface Schedule {
  kind: "daily" | "weekly" | "interval";
  hour?: number;
  minute?: number;
  weekday?: number;
  everyMinutes?: number;
}
export interface Automation {
  id: string;
  name: string;
  status: "Draft" | "Enabled";
  modelId?: string | null;
  collections: string[];
  trigger?:
    | { type: "schedule"; schedule: Schedule; detail?: string }
    | { type: "event"; collectionId?: string | null; detail?: string };
  lastRun?: string | null;
  nextRun?: string | null;
  lastDuration?: string | null;
  logs?: string[];
}
export interface ComputerApproval {
  id: string;
  tool: string;
  title?: string;
  detail?: string;
  where?: string | null;
  risk?: string;
  requestedAt?: string;
}
export interface McpApproval {
  approvalId: string;
  serverName?: string;
  toolName: string;
  arguments?: unknown;
  createdAt?: string;
}

export const listAgents = () => get<Agent[]>("/store/agents");
export const draftAgent = (goal: string, modelId?: string) =>
  post<Agent>("/builder/agents", { goal, ...(modelId ? { modelId } : {}) });
export const approveAgent = (aid: string) => post<Agent>(`/agents/${id(aid)}/approve`);
export const discardAgent = (aid: string) => post<unknown>(`/agents/${id(aid)}/discard`);
export const runAgent = (aid: string, instruction: string) =>
  post<{ agent: Agent; result: { content: string; rounds?: number; toolTrace?: { name: string }[] } }>(
    `/agents/${id(aid)}/run`,
    { instruction },
  );

export const listWorkflows = () => get<Workflow[]>("/store/workflows");
export const listWorkflowRuns = () => get<WorkflowRun[]>("/store/workflowRuns");
export const draftWorkflow = (goal: string) => post<Workflow>("/builder/workflows", { goal });
export const approveWorkflow = (wid: string) => post<Workflow>(`/workflows/${id(wid)}/approve`);
export const discardWorkflow = (wid: string) => post<unknown>(`/workflows/${id(wid)}/discard`);
export const runWorkflow = (wid: string) => post<WorkflowRun>(`/workflows/${id(wid)}/run`);
export const decideWorkflowRun = (rid: string, approve: boolean) =>
  post<WorkflowRun>(`/workflows/runs/${id(rid)}/${approve ? "approve" : "reject"}`);

export const listAutomations = () => get<Automation[]>("/store/automations");
export const createAutomation = (name: string) => post<Automation>("/automations", { name });
export const configureAutomation = (
  aid: string,
  patch: Partial<Pick<Automation, "name" | "modelId" | "collections" | "status">> & { trigger?: unknown },
) => post<Automation>(`/automations/${id(aid)}/configure`, patch);
export const runAutomation = (aid: string) =>
  post<{ automation: Automation; output: string; tokens?: number; duration?: string }>(
    `/automations/${id(aid)}/run`,
  );
export const deleteAutomation = (aid: string) => del<unknown>(`/store/automations/${id(aid)}`);

export const listComputerApprovals = () => get<ComputerApproval[]>("/computer/approvals");
export const decideComputer = (aid: string, decision: "allow" | "always" | "deny") =>
  post<unknown>(`/computer/approvals/${id(aid)}`, { decision });
export const listMcpApprovals = () => get<McpApproval[]>("/mcp/approvals");
export const decideMcp = (aid: string, approve: boolean) =>
  post<unknown>(`/mcp/approvals/${id(aid)}/${approve ? "approve" : "reject"}`);

// ---- Radheya card runs -----------------------------------------------------

export const runCard = (
  cid: string,
  input: { kind: "local" | "browser"; model?: string; url?: string; query?: string },
) => post<{ id: string; status: string }>(`/radheya/cards/${id(cid)}/run`, input);
export const cancelCardRun = (cid: string) => post<unknown>(`/radheya/cards/${id(cid)}/cancel`);

// ---- coding studio ---------------------------------------------------------

export interface WorkspaceRoot {
  id: string;
  path: string;
  name?: string;
  label?: string;
}
export interface CodingTask {
  id: string;
  title: string;
  state: string;
  created_at: string;
  updated_at?: string;
  error?: string | null;
  rootId: string | null;
  modelId: string | null;
  batchId: string | null;
  codingStudio?: boolean;
}
export interface ProposedChange {
  operation: "create" | "overwrite" | "edit" | "delete" | "rename";
  relativePath: string;
  toPath?: string;
  content?: string;
  find?: string;
  replacement?: string;
}
export interface CodingDetail {
  task: CodingTask & {
    result?: {
      proposal: { summary: string; changes: ProposedChange[]; acceptanceChecks?: string[] } | null;
      batchId: string | null;
    } | null;
    batchPreview?: {
      id: string;
      status: string;
      summary?: string;
      changes: {
        relativePath: string;
        operation: string;
        toPath?: string | null;
        impact?: string;
        diff?: string;
      }[];
    } | null;
  };
  events: { id: string; kind: string; reason?: string | null; timestamp: string }[];
  controls: { human_result_review_available: boolean; retry_available: boolean; cancel_available: boolean };
}
export interface CodingTeam {
  tasks: CodingTask[];
  controls: { runtime_halted?: boolean; execution_available?: boolean; execution_reason?: string | null };
}
export interface ChangeBatch {
  id: string;
  status: string;
  rootId: string;
  summary?: string;
  checks?: { name?: string; label?: string; status: string; detail?: string }[];
  rollback?: { available?: boolean };
}

export const listRoots = () => get<WorkspaceRoot[]>("/workspace/roots");
export const addRoot = (path: string) => post<WorkspaceRoot>("/workspace/roots", { path });
export const codingTeam = () => get<CodingTeam>("/agents/team");
export const codingDetail = (tid: string) => get<CodingDetail>(`/agents/tasks/${id(tid)}`);
export const createCodingTask = (rootId: string, modelId: string, request: string) =>
  post<CodingTask>("/agents/coding/tasks", { rootId, modelId, request });
export const reviewCodingTask = (tid: string, decision: "accept" | "reject" | "revise", reason?: string) =>
  post<unknown>(`/agents/tasks/${id(tid)}/review`, reason ? { decision, reason } : { decision });
export const retryCodingTask = (tid: string, feedback: string) =>
  post<unknown>(`/agents/tasks/${id(tid)}/retry`, { feedback });
export const cancelCodingTask = (tid: string) => post<unknown>(`/agents/tasks/${id(tid)}/cancel`);
export const listBatches = () => get<ChangeBatch[]>("/workspace/change-batches");
export const batchAction = (bid: string, action: "check" | "approve" | "execute" | "rollback") =>
  post<ChangeBatch>(`/workspace/change-batches/${id(bid)}/${action}`);

// ---- system ------------------------------------------------------------------

export interface OllamaModel {
  name: string;
  size?: number;
  details?: { parameter_size?: string; quantization_level?: string; family?: string };
}
export interface OllamaStatus {
  reachable: boolean;
  host?: string;
  error?: string;
  models: OllamaModel[];
  runningModelNames: string[];
  loaded?: { name: string; size: number | null; sizeVram?: number; expiresAt?: string }[];
}
export interface ComfyStatus {
  state: string;
  running?: boolean;
  managed?: boolean;
  url?: string | null;
  installed?: boolean;
  lastError?: string | null;
}
export interface Execution {
  id: string;
  type: string;
  label: string;
  status: string;
  detail?: string;
  startedAt: string;
  finishedAt?: string | null;
}
export interface DiskInfo {
  freeBytes: number;
  totalBytes: number;
  dataDir?: string;
}

export const health = () => get<{ ok: boolean; pid?: number; dataDir?: string }>("/health");
export const ollamaStatus = () => get<OllamaStatus>("/ollama/status");
export const loadModel = (name: string) => post<unknown>(`/models/${id(name)}/load`);
export const unloadModel = (name: string) => post<unknown>(`/models/${id(name)}/unload`);
export const comfyStatus = () => get<ComfyStatus>("/comfy/status");
export const comfyLog = () => get<{ log: string | string[] }>("/comfy/log");
export const comfyAction = (action: "start" | "stop" | "restart") => post<unknown>(`/comfy/${action}`);
export const schedulerStatus = () =>
  get<{
    running: boolean;
    lastTickAt?: string | null;
    enabledScheduleCount?: number;
    nextDueAt?: string | null;
  }>("/scheduler/status");
export const recentActivity = () =>
  get<{ rows: Execution[]; total: number }>("/store/executions/page?limit=40");
export const serviceStatus = (path: "/images/status" | "/audio/status" | "/video/status") =>
  get<Record<string, unknown>>(path);
/** Free space on Workstation's disk. Needs the Workstation update; older versions answer 404. */
export const diskInfo = () => get<DiskInfo>("/system/disk");
