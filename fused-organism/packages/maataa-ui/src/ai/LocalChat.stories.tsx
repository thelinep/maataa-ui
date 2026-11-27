import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { createKeywordRetriever, formatContext } from "./docsSearch";
import { LocalChat, type ChatTransport } from "./LocalChat";

const meta = {
  title: "AI/LocalChat",
  component: LocalChat,
  tags: ["autodocs"],
} satisfies Meta<typeof LocalChat>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A stand-in model for Storybook: streams back a short reply word by word. */
const demoModel: ChatTransport = async function* (messages, signal) {
  const question = messages[messages.length - 1]?.content ?? "";
  const words =
    `You asked: “${question}”. In a real app this reply streams from Ollama or LM Studio on your computer.`.split(
      /(?<= )/
    );
  for (const word of words) {
    if (signal.aborted) return;
    await new Promise((resolve) => setTimeout(resolve, 40));
    yield word;
  }
};

/** Point `model` at Ollama (`{ model: "llama3.2" }`) or pass any `send` transport. */
export const Default: Story = {
  args: {
    title: "Chat",
    send: demoModel,
    starterQuestions: [
      "Write a call sheet note for a 6 am shoot",
      "Explain golden hour in two lines",
    ],
    height: 360,
  },
};

const search = createKeywordRetriever([
  {
    id: "theme",
    title: "ThemePicker",
    text: 'import { ThemePicker } from "@maataa/ui/themes"; offers Light, Dark, TLPS v2, High contrast and System.',
  },
  {
    id: "locale",
    title: "LocaleProvider",
    text: 'import { LocaleProvider } from "@maataa/ui"; <LocaleProvider locale="hi-IN"> shows built-in text in Hindi.',
  },
]);

/** Answers grounded in your own documents: `getContext` adds matching passages and lists them as sources. */
export const WithDocs: Story = {
  args: {
    title: "Ask about MAATAA UI",
    assistantName: "Docs helper",
    send: demoModel,
    getContext: (question: string) => {
      const hits = search(question, 3);
      return { text: formatContext(hits), sources: hits.map((h) => ({ title: h.chunk.title })) };
    },
    initialMessages: [
      { id: "q", role: "user", content: "How do I switch themes?" },
      {
        id: "a",
        role: "assistant",
        content: 'Add <ThemePicker /> from "@maataa/ui/themes" [1].',
        sources: [{ title: "ThemePicker" }],
      },
    ],
    height: 360,
  },
};

/** When the local server isn't running, the chat says what to do. */
export const ServerNotRunning: Story = {
  args: {
    title: "Chat",
    model: { model: "llama3.2", baseUrl: "http://127.0.0.1:9" },
    initialMessages: [
      { id: "q", role: "user", content: "Hello?" },
      {
        id: "a",
        role: "assistant",
        content: "",
        error:
          "Can’t reach the model at http://127.0.0.1:9. Check that it’s running (for Ollama: ollama serve).",
      },
    ],
    height: 240,
  },
};

/** In Hindi. */
export const Hindi: Story = {
  args: { send: demoModel, height: 240 },
  render: (args) => (
    <LocaleProvider locale="hi-IN">
      <LocalChat {...args} />
    </LocaleProvider>
  ),
};
