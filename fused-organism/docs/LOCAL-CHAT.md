# Local chatbot

MAATAA UI can talk to a chat model running on your own computer, with nothing sent to the cloud. There are three parts:

| Part                                      | Where                 | What it is                                                                                                                                                                                  |
| ----------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LocalChat`                               | `@maataa/ui` (`./ai`) | A complete chat box. It streams replies, has a Stop button and explains connection problems in plain words. It can ground answers in your documents, and it is translated (English, Hindi). |
| `streamChat`, `listLocalModels`           | `@maataa/ui` (`./ai`) | A small streaming client. It speaks Ollama's API, or the OpenAI-compatible API used by LM Studio, llama.cpp server, vLLM and Jan.                                                           |
| `createKeywordRetriever`, `formatContext` | `@maataa/ui` (`./ai`) | Keyword search (BM25) over your documents, which feeds the passages to the model. It needs no embeddings model or index server.                                                             |
| Local chat app                            | `examples/local-chat` | A runnable app with a free chat mode and a **MAATAA UI docs** mode that answers from this repo's components and guides. It also has a theme picker and Hindi.                               |

## Run the app

1. Install [Ollama](https://ollama.com) and pull a model:

   ```sh
   ollama pull llama3.2
   ```

   For Hindi answers, a larger multilingual model works better, for example `ollama pull qwen2.5:7b`.

2. From `fused-organism`:

   ```sh
   npm run chat:local
   ```

   This builds the UI packages, builds the docs index (`examples/local-chat/public/maataa-docs.json`) and starts the app at http://127.0.0.1:5180.

The dev server forwards `/ollama` to `http://localhost:11434`, `/lmstudio` to `http://localhost:1234` and `/nova` to Maataa Workstation on `http://127.0.0.1:8787`, so no CORS setup is needed. To use other addresses, set `OLLAMA_URL`, `LMSTUDIO_URL` or `NOVA_URL` before starting. The app remembers its server, model and language settings, and the theme picker remembers its theme.

The app has projects (each with its own chats, instructions and text files), artifacts in a side panel, tasks, pictures and voice. See [the example's README](../examples/local-chat/README.md). On a phone the project list becomes a drawer (☰) and the side panel opens full screen.

It also runs as a desktop app (Rust and Tauri): `npm run chat:desktop`. See [Desktop app](../examples/local-chat/README.md#desktop-app-rust) for installers and how its local server is locked down.

## Use the component

```tsx
import { LocalChat } from "@maataa/ui";

// Straight to Ollama on this machine
<LocalChat model={{ model: "llama3.2" }} />

// LM Studio, or any OpenAI-compatible server
<LocalChat model={{ model: "qwen2.5-7b-instruct", api: "openai", baseUrl: "http://localhost:1234" }} />

// Through your own backend (recommended inside a real app)
<LocalChat send={(messages, signal) => streamFromMyServer(messages, signal)} />
```

To answer from documents, pass `getContext`. It returns the passages for each question, and they are added to the system prompt and listed as sources:

```tsx
const search = createKeywordRetriever(chunks); // [{ id, title, text, source? }]
<LocalChat
  model={{ model: "llama3.2" }}
  systemPrompt="Answer only from the numbered passages and cite them like [1]."
  getContext={(q) => {
    const hits = search(q, 6);
    return { text: formatContext(hits), sources: hits.map((h) => ({ title: h.chunk.title })) };
  }}
/>;
```

`node scripts/build-ui-docs-index.mjs [out.json]` builds MAATAA UI's own index from the source: one chunk per exported component (its description, import line and props) plus the guides.

### Rich replies, pictures and voice

Replies are formatted by `ChatMarkdown` (headings, lists, checklists, tables, links, code with Copy). It never injects HTML, so a reply can't run scripts; only `http`, `https` and `mailto` links become links.

A model can also answer with fenced blocks that hold JSON, and the chat draws them. Add `CHAT_BLOCKS_PROMPT` to your system prompt to teach the model the formats:

| Block                              | Draws                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| ` ```chart `                       | `ChatChart`: a bar or line chart, with its numbers as a table under "Show the numbers" |
| ` ```choices `                     | `ChatChoices`: tap-to-answer options; the pick is sent as the person's next message    |
| ` ```callsheet ` / ` ```shotlist ` | `CallSheetPrintView` / `ShotList`, from the Maataa Workstation shapes                  |
| ` ```crew `                        | `CrewIdCard` (front)                                                                   |
| ` ```date `                        | `IndianDate` (Vikram Samvat)                                                           |

| ` ```map ` (or ` ```location `) | `ChatMap`: places drawn offline (no map tiles are fetched), each linking to OpenStreetMap |

Maths: pass `renderMath` (for example with KaTeX) and `$…$`, `\(…\)`, `$$…$$`, `\[…\]` and ` ```math ` are drawn; "$5 and $10" is left alone. HTML written straight into a reply (a page starting `<!doctype html>`, or a block starting with a tag such as `<div>` or `<svg>`) becomes an ` ```html ` / ` ```svg ` block, so apps can run it in a sandbox like any page; it is never injected into the chat itself. `CHAT_DIAGRAM_PROMPT` teaches Mermaid and LaTeX, `CHAT_MEDIA_PROMPT` teaches ` ```image `, ` ```audio ` and ` ```video ` blocks (add it only when the app can make them).

A block that is still streaming shows "Preparing the chart…"; one that can't be read says so instead of breaking the reply. Pass `renderBlock` to draw kinds of your own; `findArtifacts(reply)` and `findTasks(reply)` pull pages, documents and checklists out of a reply.

```tsx
<LocalChat
  model={{ model: "gemma3" }}
  systemPrompt={`You help a film crew. ${CHAT_BLOCKS_PROMPT}`}
  allowImages // attach, paste or drop up to 4 pictures; big photos are scaled to 1600 px
  voice // Read aloud on replies, and a microphone button where the browser supports it
  fill
  bare // fill the parent, no border of its own
  hideNewConversation // when the app has its own New chat
  unavailable={serverDown ? <ServerHelp /> : undefined} // shown in place of the empty state; sending is off
  messageActions={(m) => <SaveButton message={m} />}
  onReplyDone={(reply) => saveArtifacts(reply)}
/>
```

Pictures go to Ollama as `images` and to OpenAI-compatible servers as `image_url` parts. Speech uses the browser's own `speechSynthesis` and speech recognition; some browsers recognise speech online.

## Behaviour and accessibility

- **Keyboard:** Enter sends and Shift+Enter adds a line. Enter is ignored while an input method is composing, so Hindi typing works.
- **Streaming and screen readers:** the reply streams into a `role="log"` region marked busy until it finishes. Then "Assistant replied." is announced once, rather than every word.
- **Stop and retry:** while a reply streams, Stop takes Send's place (Escape works too). Stop keeps what was written so far, marked "(stopped)". A failed reply offers Try again. New conversation clears the chat.
- **Phones:** the chat reflows at 320 px with no sideways scrolling; wide blocks (call sheets, tables, code) scroll inside themselves. On touch screens every control is at least 44 px tall.
- **Error messages:**
  - The model can't be reached: the message says to start it (`ollama serve`).
  - The model isn't installed: the message says to pull it (`ollama pull <model>`).
- **Tests:** the Storybook stories pass the axe check, and the app passes axe in both light/English and dark/Hindi.

## Security

- Talking straight to a model from the browser is fine on your own machine.
- In a deployed app, use `send` with your own backend route. The browser never holds a key, and the server decides which model and data a user may reach. Don't put a real API key in `model.apiKey` in browser code.
- The docs index holds only public source comments and guides.
- In the example app, artifact pages run in an `<iframe sandbox="allow-scripts allow-popups allow-modals">` without `allow-same-origin`, so they can't read the app, its storage or other chats. SVG pictures get no scripts at all.
- Projects, chats, artifacts and tasks are stored in the browser's IndexedDB on this computer. Only tasks are sent anywhere, and only to Maataa Workstation, when that option is on.
