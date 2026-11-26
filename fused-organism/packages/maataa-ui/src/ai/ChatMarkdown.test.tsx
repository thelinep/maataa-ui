import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatMarkdown, parseFenceInfo, parseMarkdown } from "./ChatMarkdown";
import {
  CHAT_3D_PROMPT,
  CHAT_BLOCKS_PROMPT,
  findArtifacts,
  findTasks,
  renderChatBlock,
  repairShotList,
} from "./ChatBlocks";
import { LocalChat, type ChatTransport } from "./LocalChat";
import { streamChat, type ChatMessage } from "./localModel";
import { speakableText } from "./speech";

describe("ChatMarkdown", () => {
  it("treats an unnamed code block that starts a Mermaid diagram as a diagram", () => {
    const code = (md: string) =>
      parseMarkdown(md).flatMap((b) => (b.kind === "code" ? [b.block.lang] : []));
    expect(code("```\ngraph LR\n  A --> B\n```")).toEqual(["mermaid"]);
    expect(code("```\n\nsequenceDiagram\n  A->>B: hi\n```")).toEqual(["mermaid"]);
    expect(code("```\nconst graph = 1;\n```")).toEqual([""]);
    expect(code("```js\ngraph LR\n```")).toEqual(["js"]);
  });

  it("formats bold, code, lists, links and headings without raw marks", () => {
    render(
      <ChatMarkdown>
        {
          "## Plan\n\nUse **ShotList** with `sceneRowsFromShotList()`.\n\n- Camera\n- Sound\n\n1. Load\n2. Shoot\n\nSee [docs](https://example.com)."
        }
      </ChatMarkdown>
    );
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByText("ShotList").tagName).toBe("STRONG");
    expect(screen.getByText("sceneRowsFromShotList()").tagName).toBe("CODE");
    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "docs" })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
    expect(document.body.textContent).not.toMatch(/\*\*|##/);
  });

  it("never turns HTML or javascript: links into live markup", () => {
    const { container } = render(
      <ChatMarkdown>{'<img src=x onerror="alert(1)"> [click](javascript:alert(1))'}</ChatMarkdown>
    );
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.textContent).toContain("<img src=x");
  });

  it("draws tables with header cells and right-aligned numbers", () => {
    render(
      <ChatMarkdown>
        {"| Item | Cost |\n|---|---:|\n| Lens | 1,200 |\n| Dolly | 800 |"}
      </ChatMarkdown>
    );
    const table = screen.getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((c) => c.textContent)
    ).toEqual(["Item", "Cost"]);
    expect(within(table).getByText("1,200")).toHaveStyle({ textAlign: "right" });
  });

  it("shows checklists with words for screen readers", () => {
    render(<ChatMarkdown>{"- [x] Book van\n- [ ] Call actor"}</ChatMarkdown>);
    expect(screen.getByText("Done:")).toBeInTheDocument();
    expect(screen.getByText("To do:")).toBeInTheDocument();
  });

  it("reads fence settings and keeps an unclosed fence as streaming code", () => {
    expect(parseFenceInfo('chart title="Q1 budget" type=bar')).toEqual({
      lang: "chart",
      meta: { title: "Q1 budget", type: "bar" },
    });
    const blocks = parseMarkdown("Here:\n```tsx\nconst a = 1;");
    expect(blocks[1]).toMatchObject({
      kind: "code",
      block: { lang: "tsx", closed: false, code: "const a = 1;" },
    });
  });

  it("copies code", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<ChatMarkdown>{"```sh\nnpm run chat:local\n```"}</ChatMarkdown>);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("npm run chat:local");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});

describe("chat blocks", () => {
  const md = (text: string, onChoose?: (s: string) => void) =>
    render(
      <ChatMarkdown renderBlock={(b) => renderChatBlock(b, { onChoose })}>{text}</ChatMarkdown>
    );

  it("draws a chart with its numbers as a table", () => {
    md(
      '```chart\n{"type":"bar","title":"Hours","labels":["Mon","Tue"],"series":[{"name":"Crew","values":[10,12]}]}\n```'
    );
    expect(screen.getByRole("img", { name: "Hours" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Tue" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "12" })).toBeInTheDocument();
  });

  it("sends a tapped option once", async () => {
    const user = userEvent.setup();
    const onChoose = vi.fn();
    md('```choices\n{"question":"Which day?","options":["Monday","Tuesday"]}\n```', onChoose);
    await user.click(screen.getByRole("button", { name: "Tuesday" }));
    expect(onChoose).toHaveBeenCalledWith("Tuesday");
    expect(screen.getByRole("button", { name: "Monday" })).toBeDisabled();
  });

  it("draws a call sheet and a shot list from the workstation shapes", () => {
    md(
      '```callsheet\n{"production":"Dhoop","shootDay":"Day 1 of 2","date":"2026-12-01","generalCall":"06:00","location":{"name":"Haveli"},"schedule":[{"time":"07:00","scene":"1","description":"INT. KITCHEN - DAY"}]}\n```\n\n```shotlist\n{"title":"Dhoop shots","scenes":[{"scene":"1","heading":"INT. KITCHEN - DAY","shots":[{"shot":"1A","size":"WS","angle":"Eye level","movement":"Static","description":"Steam rises"}]}]}\n```'
    );
    expect(screen.getAllByText(/Dhoop/).length).toBeGreaterThan(0);
    expect(screen.getByText("Steam rises")).toBeInTheDocument();
  });

  it("says when a block can't be read, and waits for unfinished ones", () => {
    md('```chart\n{not json}\n```\n\n```shotlist\n{"title":');
    expect(screen.getByText("The model sent a chart that couldn’t be read.")).toBeInTheDocument();
    expect(screen.getByText("Preparing the shot list…")).toBeInTheDocument();
  });

  it("finds artifacts and tasks in a reply", () => {
    const reply =
      'Here is the page:\n```html\n<title>Poster</title><h1>Hi</h1>\n```\n```markdown title="Shoot plan"\n# Plan\n```\n```ts\nconst x = 1;\n```\n- [ ] Book **van**\n- [x] Call actor\n```md\n- [ ] not a task\n```';
    expect(findArtifacts(reply).map((a) => [a.title, a.type])).toEqual([
      ["Poster", "html"],
      ["Shoot plan", "markdown"],
    ]);
    expect(findTasks(reply)).toEqual([
      { title: "Book van", done: false },
      { title: "Call actor", done: true },
    ]);
  });

  it("keeps the model instructions short", () => {
    expect(CHAT_BLOCKS_PROMPT.length).toBeLessThan(2400);
  });
});

describe("speakableText", () => {
  it("drops code, tables and marks", () => {
    expect(
      speakableText("**Call** at 6.\n```sh\nnpm i\n```\n| a | b |\n- [ ] Book [van](https://x.y)")
    ).toBe("Call at 6. Book van");
  });
});

describe("pictures", () => {
  it("sends pictures to Ollama as base64 and to OpenAI-style servers as image parts", async () => {
    const calls: string[] = [];
    const fetch = vi.fn(async (_url: string, init: RequestInit) => {
      calls.push(init.body as string);
      return new Response('{"message":{"content":"ok"},"done":true}\n');
    });
    const msgs: ChatMessage[] = [
      { role: "user", content: "What is this?", images: ["data:image/png;base64,AAAA"] },
    ];
    for await (const _ of streamChat(msgs, { model: "llava", fetch })) void _;
    expect(JSON.parse(calls[0]!).messages[0]).toEqual({
      role: "user",
      content: "What is this?",
      images: ["AAAA"],
    });
    const sse = vi.fn(async (_url: string, init: RequestInit) => {
      calls.push(init.body as string);
      return new Response("data: [DONE]\n");
    });
    for await (const _ of streamChat(msgs, { model: "qwen", api: "openai", fetch: sse })) void _;
    expect(JSON.parse(calls[1]!).messages[0].content).toEqual([
      { type: "text", text: "What is this?" },
      { type: "image_url", image_url: { url: "data:image/png;base64,AAAA" } },
    ]);
  });

  it("attaches a picture, shows it, and sends it with the question", async () => {
    const user = userEvent.setup();
    const seen: ChatMessage[][] = [];
    const send: ChatTransport = async function* (messages) {
      seen.push(messages);
      yield "A clapperboard.";
    };
    const { container } = render(<LocalChat send={send} allowImages />);
    const file = new File([new Uint8Array([137, 80, 78, 71])], "slate.png", { type: "image/png" });
    await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, file);
    expect(await screen.findByRole("img", { name: "Attached picture 1" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByText("A clapperboard.");
    expect(seen[0]!.at(-1)).toMatchObject({
      content: "What’s in this picture?",
      images: [expect.stringMatching(/^data:image\/png/)],
    });
  });
});

describe("LocalChat states", () => {
  it("turns sending off while the model is unavailable", async () => {
    render(
      <LocalChat
        send={async function* () {}}
        starterQuestions={["Hi"]}
        unavailable={<p>Model server is off.</p>}
      />
    );
    expect(screen.getByText("Model server is off.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hi" })).toBeNull();
    await userEvent.setup().type(screen.getByRole("textbox", { name: "Your message" }), "hello");
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(screen.getByText("Sending is off until the model is available.")).toBeInTheDocument();
  });

  it("shows Stop in place of Send while writing, and formats the reply", async () => {
    const user = userEvent.setup();
    let release: () => void = () => undefined;
    const send: ChatTransport = async function* (_m, signal) {
      yield "Use **ShotList**";
      await new Promise<void>((r) => {
        release = r;
        signal.addEventListener("abort", () => r());
      });
      if (signal.aborted) throw new DOMException("aborted", "AbortError");
    };
    render(<LocalChat send={send} />);
    await user.type(screen.getByRole("textbox", { name: "Your message" }), "go{Enter}");
    expect(await screen.findByText("ShotList")).toHaveProperty("tagName", "STRONG");
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Stop writing" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument());
    release();
  });

  it("adds app actions under finished replies", async () => {
    const user = userEvent.setup();
    render(
      <LocalChat
        send={async function* () {
          yield "Done";
        }}
        messageActions={(m) => <button type="button">Keep {m.content}</button>}
      />
    );
    await user.type(screen.getByRole("textbox", { name: "Your message" }), "go{Enter}");
    expect(await screen.findByRole("button", { name: "Keep Done" })).toBeInTheDocument();
  });
});

describe("maths, raw HTML and maps", () => {
  const tex = (s: string, display: boolean) => (
    <span data-tex={display ? "block" : "inline"}>{s}</span>
  );

  it("draws inline and block maths only when a renderer is given, and leaves prices alone", () => {
    const text =
      "Area is $\\pi r^2$ and \\(e^x\\). It costs $5 and $10.\n\n$$\nE = mc^2\n$$\n\n\\[a+b\\]";
    const { container, rerender } = render(<ChatMarkdown renderMath={tex}>{text}</ChatMarkdown>);
    const found = [...container.querySelectorAll("[data-tex]")].map((e) => [
      e.getAttribute("data-tex"),
      e.textContent,
    ]);
    expect(found).toEqual([
      ["inline", "\\pi r^2"],
      ["inline", "e^x"],
      ["block", "E = mc^2"],
      ["block", "a+b"],
    ]);
    expect(container.textContent).toContain("It costs $5 and $10.");
    rerender(<ChatMarkdown>{text}</ChatMarkdown>);
    expect(container.querySelector("[data-tex]")).toBeNull();
    expect(container.textContent).toContain("$\\pi r^2$");
  });

  it("treats ```latex as maths", () => {
    const { container } = render(
      <ChatMarkdown renderMath={tex}>{"```latex\n\\frac{1}{2}\n```"}</ChatMarkdown>
    );
    expect(container.querySelector('[data-tex="block"]')?.textContent).toBe("\\frac{1}{2}");
  });

  it("turns HTML written straight into a reply into an html block and artifact", () => {
    const reply =
      'Here you go:\n<!doctype html>\n<html><body><h1>Hi</h1>\n<script>1</script></body>\n</html>\nEnjoy.\n<svg viewBox="0 0 10 10">\n<circle r="4"/>\n</svg>';
    const blocks = parseMarkdown(reply).filter((b) => b.kind === "code");
    expect(
      blocks.map((b) => b.kind === "code" && [b.block.lang, b.block.raw, b.block.closed])
    ).toEqual([
      ["html", true, true],
      ["svg", true, true],
    ]);
    expect(findArtifacts(reply).map((a) => a.type)).toEqual(["html", "svg"]);
    const { container } = render(<ChatMarkdown>{reply}</ChatMarkdown>);
    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("Enjoy.")).toBeInTheDocument();
  });

  it("draws a map with links to OpenStreetMap, and rejects made-up shapes", () => {
    render(
      <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>
        {
          '```map\n{"title":"Recce","places":[{"name":"Haveli","lat":28.6562,"lng":77.2301},{"name":"LNJP Hospital","lat":28.6386,"lng":77.2385,"note":"Nearest hospital"}]}\n```\n\n```map\n{"places":[{"name":"Nowhere","lat":200,"lng":0}]}\n```'
        }
      </ChatMarkdown>
    );
    expect(screen.getByRole("link", { name: "LNJP Hospital" })).toHaveAttribute(
      "href",
      expect.stringContaining("openstreetmap.org/?mlat=28.6386&mlon=77.2385")
    );
    expect(screen.getByText("The model sent a map that couldn’t be read.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find LNJP Hospital by name" })).toHaveAttribute(
      "href",
      "https://www.openstreetmap.org/search?query=LNJP%20Hospital"
    );
    expect(screen.getByText(/can get places wrong/)).toBeInTheDocument();
  });
});

describe("shot lists from small models", () => {
  it("turns scenes that are really shots into one scene of shots, keeping the words", () => {
    const fixed = repairShotList({
      title: "Kitchen",
      scenes: [
        { title: "INT. KITCHEN - DAY", heading: "Amma stands at the stove." },
        { title: "Close-up on Amma's hands as she adds spices.", heading: "Quick and precise." },
        { title: "Medium shot of Amma stirring.", heading: "The camera pans to the window." },
      ],
    }) as {
      scenes: {
        heading: string;
        shots: { shot: string; size: string; movement: string; description: string }[];
      }[];
    };
    expect(fixed.scenes).toHaveLength(1);
    expect(fixed.scenes[0]!.heading).toBe("INT. KITCHEN - DAY");
    expect(fixed.scenes[0]!.shots.map((s) => [s.shot, s.size, s.movement])).toEqual([
      ["1A", "—", "Static"],
      ["1B", "CU", "Static"],
      ["1C", "MS", "Pan"],
    ]);
    expect(fixed.scenes[0]!.shots[1]!.description).toContain("Quick and precise.");
    render(
      <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>
        {"```shotlist\n" +
          JSON.stringify({ title: "Kitchen", scenes: [{ title: "Wide shot of the kitchen" }] }) +
          "\n```"}
      </ChatMarkdown>
    );
    expect(screen.getByText(/Wide shot of the kitchen/)).toBeInTheDocument();
  });

  it("leaves a proper shot list alone", () => {
    const ok = {
      title: "x",
      scenes: [
        {
          scene: "4",
          heading: "INT. A",
          shots: [{ shot: "4A", size: "WS", angle: "Eye", movement: "Static", description: "d" }],
        },
      ],
    };
    expect(repairShotList(ok)).toBe(ok);
  });
});

describe("3D scenes", () => {
  it("reads ```three, ```scene and ```threejs as one kind and keeps them as artifacts", () => {
    const reply =
      '```three title="Set"\nscene.add(new THREE.Mesh());\n```\n```scene\nconst a = 1;\n```\n```threejs title="Dolly"\nonFrame(() => {});\n```';
    expect(findArtifacts(reply).map((a) => [a.title, a.type])).toEqual([
      ["Set", "threejs"],
      ["threejs 2", "threejs"],
      ["Dolly", "threejs"],
    ]);
    expect(CHAT_3D_PROMPT).toContain("onFrame");
  });
});

describe("backend events", () => {
  it("shows sources, progress and follow-up questions a backend reports", async () => {
    const user = userEvent.setup();
    let release: () => void = () => undefined;
    const send: ChatTransport = async function* () {
      yield { type: "status", text: "Searched your knowledge" };
      yield "Call time is 6 am.";
      await new Promise<void>((r) => (release = r));
      yield { type: "sources", sources: [{ title: "Shoot notes.md" }] };
      yield { type: "followups", items: ["Who is on set?", "Where do we park?"] };
    };
    const seen: string[] = [];
    render(
      <LocalChat
        send={async function* (m, s) {
          seen.push(m.at(-1)!.content);
          yield* send(m, s);
        }}
      />
    );
    await user.type(screen.getByRole("textbox", { name: "Your message" }), "When?{Enter}");
    expect(await screen.findByText("Searched your knowledge")).toBeInTheDocument();
    release();
    expect(await screen.findByText("Shoot notes.md")).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Where do we park?" }));
    await waitFor(() => expect(seen).toEqual(["When?", "Where do we park?"]));
  });
});
