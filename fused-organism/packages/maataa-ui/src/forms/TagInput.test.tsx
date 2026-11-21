import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { TagInput } from "./TagInput";

describe("TagInput", () => {
  it("adds with Enter and comma, refuses duplicates and removes", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<string[]>([]);
      return <TagInput label="Genres" value={v} onChange={setV} maxTags={3} />;
    }
    render(<H />);
    const input = screen.getByLabelText("Genres");
    await user.type(input, "Drama{Enter}Thriller,");
    expect(screen.getByRole("list", { name: "Genres: 2 tags" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Added Thriller. 2 tags.");
    await user.type(input, "drama{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("drama is already added.");
    await user.click(screen.getByRole("button", { name: "Remove Drama" }));
    expect(screen.getByRole("status")).toHaveTextContent("Removed Drama. 1 tags.");
    expect(input).toHaveFocus();
  });
});
