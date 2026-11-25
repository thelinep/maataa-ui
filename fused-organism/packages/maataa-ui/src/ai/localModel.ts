/**
 * @maataa/ui/ai/localModel
 * A small streaming client for chat models running on your own machine:
 * Ollama (its native API) or any OpenAI-compatible server (LM Studio,
 * llama.cpp server, vLLM, Jan). No SDK, no API key needed for local use.
 */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  /**
   * Pictures sent with this message, as data URLs ("data:image/png;base64,…")
   * or bare base64. Needs a model that can see, e.g. llava, gemma3, qwen2.5vl.
   */
  images?: string[];
}

const bareBase64 = (image: string) => image.replace(/^data:[^,]*,/, "");
const dataUrl = (image: string) =>
  image.startsWith("data:") ? image : `data:image/png;base64,${image}`;

/** The message in the shape each API expects. */
function toWire(message: ChatMessage, api: LocalModelApi): unknown {
  if (!message.images?.length) return { role: message.role, content: message.content };
  if (api === "ollama")
    return { role: message.role, content: message.content, images: message.images.map(bareBase64) };
  return {
    role: message.role,
    content: [
      { type: "text", text: message.content },
      ...message.images.map((image) => ({ type: "image_url", image_url: { url: dataUrl(image) } })),
    ],
  };
}

export type LocalModelApi = "ollama" | "openai";

export interface LocalModelOptions {
  /** Model name, e.g. "llama3.2" or "qwen2.5:7b". */
  model: string;
  /** Server address. @default "http://localhost:11434" (Ollama) */
  baseUrl?: string;
  /** Which API the server speaks. @default "ollama" */
  api?: LocalModelApi;
  /** Bearer token, for OpenAI-compatible servers that need one. Never ship a real key to a browser. */
  apiKey?: string;
  /** 0 = focused, higher = more varied. Left to the server when unset. */
  temperature?: number;
  /** Replace fetch, e.g. in tests. */
  fetch?: typeof fetch;
}

/** Why a request failed, so the UI can say what to do next. */
export type LocalModelErrorKind = "unreachable" | "model-missing" | "http" | "bad-response";

export class LocalModelError extends Error {
  constructor(
    public readonly kind: LocalModelErrorKind,
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "LocalModelError";
  }
}

export const DEFAULT_LOCAL_MODEL_URL = "http://localhost:11434";

const trimSlash = (url: string) => url.replace(/\/+$/, "");

function headers(options: LocalModelOptions): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
  };
}

async function request(
  url: string,
  init: RequestInit,
  options: LocalModelOptions
): Promise<Response> {
  const doFetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  let response: Response;
  try {
    response = await doFetch(url, init);
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new LocalModelError("unreachable", `Could not reach ${url}`);
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const missing =
      response.status === 404 && /model|not found/i.test(body) && !/<html/i.test(body);
    throw new LocalModelError(
      missing ? "model-missing" : "http",
      body.slice(0, 300) || `HTTP ${response.status}`,
      response.status
    );
  }
  return response;
}

async function* lines(response: Response): AsyncGenerator<string> {
  if (!response.body) {
    const text = await response.text();
    yield* text.split("\n");
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      yield buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
    }
  }
  buffer += decoder.decode();
  if (buffer) yield buffer;
}

/**
 * Streams the model's reply to `messages`, one text piece at a time.
 *
 * @example
 * ```ts
 * for await (const piece of streamChat(messages, { model: "llama3.2" }, signal)) {
 *   reply += piece;
 * }
 * ```
 */
export async function* streamChat(
  messages: ChatMessage[],
  options: LocalModelOptions,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const base = trimSlash(options.baseUrl ?? DEFAULT_LOCAL_MODEL_URL);
  const api = options.api ?? "ollama";
  const wire = messages.map((m) => toWire(m, api));
  const body =
    api === "ollama"
      ? {
          model: options.model,
          messages: wire,
          stream: true,
          ...(options.temperature !== undefined
            ? { options: { temperature: options.temperature } }
            : {}),
        }
      : {
          model: options.model,
          messages: wire,
          stream: true,
          ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
        };
  const url = api === "ollama" ? `${base}/api/chat` : `${base}/v1/chat/completions`;
  const response = await request(
    url,
    { method: "POST", headers: headers(options), body: JSON.stringify(body), signal },
    options
  );

  for await (const raw of lines(response)) {
    const line = raw.trim();
    if (!line) continue;
    if (api === "ollama") {
      let chunk: { message?: { content?: string }; done?: boolean; error?: string };
      try {
        chunk = JSON.parse(line);
      } catch {
        throw new LocalModelError("bad-response", "The server sent something that isn't JSON");
      }
      if (chunk.error) throw new LocalModelError("http", chunk.error);
      if (chunk.message?.content) yield chunk.message.content;
      if (chunk.done) return;
    } else {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      let chunk: { choices?: { delta?: { content?: string } }[]; error?: { message?: string } };
      try {
        chunk = JSON.parse(data);
      } catch {
        throw new LocalModelError("bad-response", "The server sent something that isn't JSON");
      }
      if (chunk.error) throw new LocalModelError("http", chunk.error.message ?? "Model error");
      const piece = chunk.choices?.[0]?.delta?.content;
      if (piece) yield piece;
    }
  }
}

/** The models installed on the server, by name. */
export async function listLocalModels(
  options: Omit<LocalModelOptions, "model">,
  signal?: AbortSignal
): Promise<string[]> {
  const base = trimSlash(options.baseUrl ?? DEFAULT_LOCAL_MODEL_URL);
  const api = options.api ?? "ollama";
  const url = api === "ollama" ? `${base}/api/tags` : `${base}/v1/models`;
  const response = await request(
    url,
    { headers: headers(options as LocalModelOptions), signal },
    options as LocalModelOptions
  );
  const json = (await response.json().catch(() => null)) as {
    models?: { name?: string; model?: string }[];
    data?: { id?: string }[];
  } | null;
  if (!json) throw new LocalModelError("bad-response", "The server sent something that isn't JSON");
  const names =
    api === "ollama"
      ? (json.models ?? []).map((m) => m.name ?? m.model ?? "")
      : (json.data ?? []).map((m) => m.id ?? "");
  return names.filter(Boolean).sort();
}
