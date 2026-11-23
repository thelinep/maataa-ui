import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { createKeywordRetriever, formatContext, tokenize } from "./docsSearch";
import { LocalChat, type ChatTransport } from "./LocalChat";
import { LocalModelError, listLocalModels, streamChat, type ChatMessage } from "./localModel";

function streamResponse(chunks: string[], status = 200) {
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    start(controller) {
      chunks.forEach((c) => controller.enqueue(encoder.encode(c)));
      controller.close();
    },
  });
  return new Response(body, { status });
}

async function collect(iterable: AsyncIterable<string>) {
  let out = "";
  for await (const piece of iterable) out += piece;
  return out;
}

const msgs: ChatMessage[] = [{ role: "user", content: "Hi" }];

describe("streamChat", () => {
  it("streams Ollama NDJSON, even when a line is split across chunks", async () => {
    const fetch = vi.fn(async () =>
      streamResponse([
        '{"message":{"content":"Nam"}}\n{"message":{"con',
        'tent":"aste"}}\n{"message":{"content":""},"done":true}\n',
      ])
    );
    const text = await collect(streamChat(msgs, { model: "llama3.2", fetch, temperature: 0 }));
    expect(text).toBe("Namaste");
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:11434/api/chat");
    expect(JSON.parse(init.body as string)).toMatchObject({
      model: "llama3.2",
      stream: true,
      messages: msgs,
      options: { temperature: 0 },
    });
  });

  it("streams OpenAI-compatible server-sent events", async () => {
    const fetch = vi.fn(async () =>
      streamResponse([
        'data: {"choices":[{"delta":{"role":"assistant"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":"!"}}]}\n\n',
        "data: [DONE]\n\n",
      ])
    );
    const text = await collect(
      streamChat(msgs, {
        model: "qwen",
        api: "openai",
        baseUrl: "http://localhost:1234/",
        apiKey: "k",
        fetch,
      })
    );
    expect(text).toBe("Hello!");
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:1234/v1/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer k");
  });

  it("says when the server can't be reached or the model is missing", async () => {
    const down = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(collect(streamChat(msgs, { model: "x", fetch: down }))).rejects.toMatchObject({
      kind: "unreachable",
    });
    const missing = vi.fn(
      async () => new Response('{"error":"model \\"x\\" not found"}', { status: 404 })
    );
    await expect(collect(streamChat(msgs, { model: "x", fetch: missing }))).rejects.toBeInstanceOf(
      LocalModelError
    );
    await expect(collect(streamChat(msgs, { model: "x", fetch: missing }))).rejects.toMatchObject({
      kind: "model-missing",
    });
  });

  it("lists installed models", async () => {
    const fetch = vi.fn(async () =>
      Response.json({ models: [{ name: "qwen2.5:7b" }, { name: "llama3.2:latest" }] })
    );
    expect(await listLocalModels({ fetch })).toEqual(["llama3.2:latest", "qwen2.5:7b"]);
    const openai = vi.fn(async () => Response.json({ data: [{ id: "phi-4" }] }));
    expect(await listLocalModels({ api: "openai", fetch: openai })).toEqual(["phi-4"]);
  });
});

describe("docs search", () => {
  const search = createKeywordRetriever([
    {
      id: "1",
      title: "DatePicker",
      text: "Pick one date from a calendar. Props: value, onChange, min, max.",
    },
    {
      id: "2",
      title: "ThemePicker",
      text: "Choose Light, Dark, TLPS v2, High contrast or System.",
    },
    { id: "3", title: "Pagination", text: "Page numbers with previous and next buttons." },
  ]);

  it("splits camelCase names and ranks the named component first", () => {
    expect(tokenize("DatePicker")).toEqual(["datepicker", "date", "picker"]);
    expect(search("how do I use the date picker?")[0].chunk.title).toBe("DatePicker");
    expect(search("high contrast theme")[0].chunk.title).toBe("ThemePicker");
    expect(search("the")).toEqual([]);
  });

  it("formats numbered context within a size limit", () => {
    const context = formatContext(search("picker"), 400);
    expect(context).toMatch(/^\[1\] /);
    expect(context.length).toBeLessThanOrEqual(400);
  });
});

function fakeTransport(reply: string[], seen?: ChatMessage[][]): ChatTransport {
  return async function* (messages) {
    seen?.push(messages);
    for (const piece of reply) yield piece;
  };
}

describe("LocalChat", () => {
  it("sends the question with system prompt and context, streams the reply, and shows sources", async () => {
    const user = userEvent.setup();
    const seen: ChatMessage[][] = [];
    render(
      <LocalChat
        title="MAATAA help"
        send={fakeTransport(["Use ", "ThemePicker."], seen)}
        systemPrompt="Answer about MAATAA UI."
        getContext={() => ({ text: "[1] ThemePicker", sources: [{ title: "ThemePicker" }] })}
        starterQuestions={["How do I switch themes?"]}
      />
    );
    expect(screen.getByRole("log", { name: "MAATAA help" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "How do I switch themes?" }));
    await screen.findByText("Use ThemePicker.");
    expect(seen[0][0]).toEqual({
      role: "system",
      content: "Answer about MAATAA UI.\n\n[1] ThemePicker",
    });
    expect(seen[0][1]).toEqual({ role: "user", content: "How do I switch themes?" });
    expect(screen.getByText("1 source")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Assistant replied."));
  });

  it("keeps history, sends on Enter, and adds a line on Shift+Enter", async () => {
    const user = userEvent.setup();
    const seen: ChatMessage[][] = [];
    render(<LocalChat send={fakeTransport(["OK"], seen)} />);
    const box = screen.getByRole("textbox", { name: "Your message" });
    await user.type(box, "first{Enter}");
    await screen.findByText("OK");
    await user.type(box, "line one{Shift>}{Enter}{/Shift}line two{Enter}");
    await waitFor(() => expect(seen).toHaveLength(2));
    expect(seen[1].map((m) => m.content)).toEqual(["first", "OK", "line one\nline two"]);
  });

  it("explains an unreachable server and retries", async () => {
    const user = userEvent.setup();
    let calls = 0;
    const send: ChatTransport = async function* () {
      calls += 1;
      if (calls === 1) throw new LocalModelError("unreachable", "down");
      yield "Back online";
    };
    render(<LocalChat send={send} model={{ model: "llama3.2" }} />);
    await user.type(screen.getByRole("textbox", { name: "Your message" }), "hello{Enter}");
    expect(
      await within(screen.getByRole("log")).findByText(
        /Can’t reach the model at http:\/\/localhost:11434/
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    await screen.findByText("Back online");
    expect(screen.getAllByText("hello")).toHaveLength(1);
  });

  it("can be stopped, keeping what was written", async () => {
    const user = userEvent.setup();
    let release: () => void = () => undefined;
    const send: ChatTransport = async function* (_messages, signal) {
      yield "Partial";
      await new Promise<void>((resolve) => {
        release = resolve;
        signal.addEventListener("abort", () => resolve());
      });
      if (signal.aborted) throw new DOMException("aborted", "AbortError");
      yield " never";
    };
    render(<LocalChat send={send} />);
    await user.type(screen.getByRole("textbox", { name: "Your message" }), "go{Enter}");
    await screen.findByText("Partial");
    await user.click(screen.getByRole("button", { name: "Stop writing" }));
    await screen.findByText("(stopped)");
    act(() => release());
    expect(screen.queryByText(/never/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "New conversation" }));
    expect(screen.getByText("Ask a question to start.")).toBeInTheDocument();
  });

  it("speaks Hindi", () => {
    render(
      <LocaleProvider locale="hi-IN">
        <LocalChat send={fakeTransport([])} />
      </LocaleProvider>
    );
    expect(screen.getByRole("textbox", { name: "आपका संदेश" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "भेजें" })).toBeInTheDocument();
  });
});
