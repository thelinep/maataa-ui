import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { RichTextEditor, renderMarkdown } from "./RichTextEditor";

function H({ initial = "" }: { initial?: string }) {
  const [v, setV] = useState(initial);
  return <RichTextEditor label="Synopsis" value={v} onChange={setV} />;
}

describe("RichTextEditor", () => {
  it("formats the selection from the toolbar and keyboard", async () => {
    const user = userEvent.setup();
    render(<H initial="rain" />);
    const ta = screen.getByRole("textbox", { name: "Synopsis" }) as HTMLTextAreaElement;
    ta.setSelectionRange(0, 4);
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(ta).toHaveValue("**rain**");
    const toolbar = screen.getByRole("toolbar", { name: "Formatting" });
    expect(toolbar).toBeInTheDocument();
    screen.getByRole("button", { name: "Bold" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
  });

  it("previews safely as elements, refusing script links", async () => {
    const user = userEvent.setup();
    render(
      <H
        initial={
          "# Monsoon\n\n- **Act one**\n- [site](https://maataa.in)\n\n[bad](javascript:alert(1))"
        }
      />
    );
    await user.click(screen.getByRole("tab", { name: "Preview" }));
    const panel = screen.getByRole("tabpanel", { name: "Preview" });
    expect(panel.querySelector("h3")).toHaveTextContent("Monsoon");
    expect(screen.getByRole("link", { name: "site" })).toHaveAttribute("href", "https://maataa.in");
    expect(screen.queryByRole("link", { name: "bad" })).toBeNull();
  });

  it("renders numbered lists", () => {
    render(<div>{renderMarkdown("1. one\n2. two")}</div>);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
