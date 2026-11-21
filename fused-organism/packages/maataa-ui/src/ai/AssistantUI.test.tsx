import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  AIChatBubble,
  AITypingIndicator,
  InteractionModeSwitcher,
  type InteractionMode,
} from "./AssistantUI";

describe("AssistantUI", () => {
  it("bubbles name the speaker and mark AI content", () => {
    render(
      <>
        <AIChatBubble from="user" time="10:02">
          Best time for the rooftop?
        </AIChatBubble>
        <AIChatBubble from="assistant" name="Sochen" sources={[{ title: "Sun times, Delhi" }]}>
          Golden hour starts at 4:52 pm.
        </AIChatBubble>
        <AITypingIndicator name="Sochen" onStop={() => {}} />
      </>
    );
    expect(screen.getByRole("article", { name: "You, 10:02" })).toBeInTheDocument();
    expect(screen.getByText("· AI-generated")).toBeInTheDocument();
    expect(screen.getByText("1 source")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Sochen is writing…");
    expect(screen.getByRole("button", { name: "Stop writing" })).toBeInTheDocument();
  });

  it("mode switcher is a radio group", async () => {
    function H() {
      const [m, setM] = useState<InteractionMode>("text");
      return <InteractionModeSwitcher value={m} onChange={setM} />;
    }
    render(<H />);
    screen.getByRole("radio", { name: /Type/ }).focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("radio", { name: /Sign/ })).toHaveAttribute("aria-checked", "true");
  });
});
