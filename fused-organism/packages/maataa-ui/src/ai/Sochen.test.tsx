import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThoughtInput, ModelResponse, ModelConfiguredCheck, ThoughtHistory } from "./Sochen";

describe("ThoughtInput", () => {
  it("sends with Ctrl+Enter and respects a disabled reason", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ThoughtInput onSubmit={onSubmit} />);
    await user.type(
      screen.getByLabelText(/What are you thinking about/),
      "Is the second act too slow?"
    );
    await user.keyboard("{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledWith("Is the second act too slow?");
    rerender(<ThoughtInput onSubmit={onSubmit} disabledReason="Sochen isn't set up yet" />);
    expect(screen.getByLabelText(/What are you thinking about/)).toBeDisabled();
  });
});

describe("ModelResponse", () => {
  it("announces state, not every token, and labels AI text", () => {
    const { rerender } = render(
      <ModelResponse prompt="Is act two slow?" text="Partly. The" streaming model="Claude" />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Writing a response…");
    rerender(
      <ModelResponse
        prompt="Is act two slow?"
        text={"Partly.\n\nTry cutting scene 18."}
        model="Claude"
      />
    );
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Response ready");
    expect(screen.getByText(/AI-written by Claude/)).toBeInTheDocument();
    expect(screen.getByText("Try cutting scene 18.")).toBeInTheDocument();
  });
  it("shows errors with retry", async () => {
    const onRetry = vi.fn();
    render(<ModelResponse prompt="x" text="" error="The model didn't answer." onRetry={onRetry} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe("ModelConfiguredCheck", () => {
  it("hides children until configured", () => {
    const { rerender } = render(
      <ModelConfiguredCheck configured={false} reason="No model connected">
        <p>chat</p>
      </ModelConfiguredCheck>
    );
    expect(screen.queryByText("chat")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Ask your workspace admin");
    rerender(
      <ModelConfiguredCheck configured>
        <p>chat</p>
      </ModelConfiguredCheck>
    );
    expect(screen.getByText("chat")).toBeInTheDocument();
  });
});

describe("ThoughtHistory", () => {
  it("searches, pins first and deletes by name", async () => {
    const onOpen = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <ThoughtHistory
        onOpen={onOpen}
        onDelete={onDelete}
        thoughts={[
          { id: "1", text: "Second act pacing", at: new Date(2026, 10, 20) },
          { id: "2", text: "Title ideas", at: new Date(2026, 10, 1), pinned: true },
        ]}
      />
    );
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Title ideas");
    await user.type(screen.getByLabelText("Search past thoughts"), "pacing");
    expect(screen.getByRole("status")).toHaveTextContent("1 found");
    await user.click(screen.getByRole("button", { name: "Delete thought: Second act pacing" }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
