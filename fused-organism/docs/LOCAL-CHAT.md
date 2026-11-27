# Local chatbot

MAATAA UI can talk to a chat model running on your own computer, with nothing sent to the cloud. There are three parts:

| Part | Where | What it is |
|---|---|---|
| `LocalChat` | `@maataa/ui` (`./ai`) | A complete chat box. It streams replies, has a Stop button and explains connection problems in plain words. It can ground answers in your documents, and it is translated (English, Hindi). |
| `streamChat`, `listLocalModels` | `@maataa/ui` (`./ai`) | A small streaming client. It speaks Ollama's API, or the OpenAI-compatible API used by LM Studio, llama.cpp server, vLLM and Jan. |
| `createKeywordRetriever`, `formatContext` | `@maataa/ui` (`./ai`) | Keyword search (BM25) over your documents, which feeds the passages to the model. It needs no embeddings model or index server. |
| Local chat app | `examples/local-chat` | A runnable app with a free chat mode and a **MAATAA UI docs** mode that answers from this repo's components and guides. It also has a theme picker and Hindi. |

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

The dev server forwards `/ollama` to `http://localhost:11434` and `/lmstudio` to `http://localhost:1234`, so no CORS setup is needed. To use other addresses, set `OLLAMA_URL` or `LMSTUDIO_URL` before starting. The app remembers its server, model and language settings, and the theme picker remembers its theme.

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
/>
```

`node scripts/build-ui-docs-index.mjs [out.json]` builds MAATAA UI's own index from the source: one chunk per exported component (its description, import line and props) plus the guides.

## Behaviour and accessibility

- **Keyboard:** Enter sends and Shift+Enter adds a line. Enter is ignored while an input method is composing, so Hindi typing works.
- **Streaming and screen readers:** the reply streams into a `role="log"` region marked busy until it finishes. Then "Assistant replied." is announced once, rather than every word.
- **Stop and retry:** Stop keeps what was written so far, marked "(stopped)". A failed reply offers Try again. New conversation clears the chat.
- **Error messages:**
  - The model can't be reached: the message says to start it (`ollama serve`).
  - The model isn't installed: the message says to pull it (`ollama pull <model>`).
- **Tests:** the Storybook stories pass the axe check, and the app passes axe in both light/English and dark/Hindi.

## Security

- Talking straight to a model from the browser is fine on your own machine.
- In a deployed app, use `send` with your own backend route. The browser never holds a key, and the server decides which model and data a user may reach. Don't put a real API key in `model.apiKey` in browser code.
- The docs index holds only public source comments and guides.
