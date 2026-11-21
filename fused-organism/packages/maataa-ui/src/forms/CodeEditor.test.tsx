import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CodeEditor, caretPosition } from "./CodeEditor";

describe("CodeEditor", () => {
  it("indents with Tab and lets Esc+Tab leave", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("");
      return (
        <>
          <CodeEditor label="Config" value={v} onChange={setV} language="JSON" />
          <button>Next</button>
        </>
      );
    }
    render(<H />);
    const ta = screen.getByRole("textbox", { name: "Config" });
    expect(ta).toHaveAccessibleDescription(/press Esc and then Tab/);
    await user.click(ta);
    await user.keyboard("a{Tab}b");
    expect(ta).toHaveValue("a  b");
    expect(ta).toHaveFocus();
    await user.keyboard("{Escape}{Tab}");
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
  });

  it("reports line and column", () => {
    expect(caretPosition("ab\ncd", 4)).toEqual({ line: 2, column: 2 });
  });
});
