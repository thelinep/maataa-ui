import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ShapeToolPicker,
  LayerStack,
  EffectsLibrary,
  LiveDrawingOverlay,
  RenderQueue,
  type Layer,
  type ShapeKind,
  type Annotation,
  type RenderJob,
} from "./EditorPanels";

describe("ShapeToolPicker", () => {
  it("is a radio group with arrows", async () => {
    const user = userEvent.setup();
    function H() {
      const [s, setS] = useState<ShapeKind>("rectangle");
      return <ShapeToolPicker value={s} onChange={setS} filled={false} onFilledChange={() => {}} />;
    }
    render(<H />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Ellipse" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox", { name: "Fill" })).toBeInTheDocument();
  });
});

describe("LayerStack", () => {
  it("toggles and reorders with announcements", async () => {
    const user = userEvent.setup();
    function H() {
      const [l, setL] = useState<Layer[]>([
        { id: "t", name: "Titles", visible: true, locked: false },
        { id: "b", name: "Background", visible: true, locked: true },
      ]);
      return <LayerStack layers={l} onChange={setL} />;
    }
    render(<H />);
    await user.click(screen.getByRole("button", { name: "Hide Titles" }));
    expect(screen.getByRole("button", { name: "Hide Titles" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Lock Background" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await user.click(screen.getByRole("button", { name: "Move Titles down" }));
    expect(screen.getByRole("status")).toHaveTextContent("Titles moved to position 2 of 2.");
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Background");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Move Titles up" })).toHaveFocus()
    );
  });
});

describe("EffectsLibrary", () => {
  it("filters and names apply buttons", async () => {
    const user = userEvent.setup();
    const apply = vi.fn();
    render(
      <EffectsLibrary
        effects={[
          { id: "g", name: "Film grain", category: "Texture" },
          { id: "b", name: "Bloom", category: "Light" },
        ]}
        applied={["b"]}
        onApply={apply}
      />
    );
    expect(screen.getByRole("button", { name: "Applied: Bloom" })).toBeDisabled();
    await user.type(screen.getByRole("searchbox", { name: "Search effects" }), "grain");
    expect(screen.getByRole("status")).toHaveTextContent("1 effect");
    await user.click(screen.getByRole("button", { name: "Apply Film grain" }));
    expect(apply).toHaveBeenCalledWith("g");
  });
});

describe("LiveDrawingOverlay", () => {
  it("requires a typed note and lists notes by time", async () => {
    const user = userEvent.setup();
    function H() {
      const [a, setA] = useState<Annotation[]>([]);
      return (
        <LiveDrawingOverlay
          currentTime={75}
          annotations={a}
          onAdd={(x) => setA((l) => [...l, { ...x, id: String(l.length) }])}
        >
          <div style={{ height: 100 }}>frame</div>
        </LiveDrawingOverlay>
      );
    }
    render(<H />);
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(screen.getByLabelText("Note at 1:15")).toHaveAccessibleDescription(
      "Add a note describing the drawing."
    );
    await user.type(screen.getByLabelText("Note at 1:15"), "Boom in frame top left");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(screen.getByRole("list", { name: "Review notes" })).toHaveTextContent(
      "1:15 Boom in frame top left"
    );
  });
});

describe("RenderQueue", () => {
  it("summarises and announces finished jobs", () => {
    const jobs: RenderJob[] = [
      { id: "1", name: "Reel 1", preset: "ProRes 4K", state: "rendering", percent: 40, eta: 300 },
      { id: "2", name: "Trailer", preset: "H.264 1080p", state: "queued" },
    ];
    const { rerender } = render(<RenderQueue jobs={jobs} onCancel={() => {}} />);
    expect(screen.getByText("1 queued, 1 rendering")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Reel 1 render" })).toHaveAttribute(
      "aria-valuetext",
      "Rendering, 40%, 5 min left"
    );
    expect(screen.getByRole("button", { name: "Cancel Trailer" })).toBeInTheDocument();
    rerender(<RenderQueue jobs={[{ ...jobs[0]!, state: "done", percent: 100 }, jobs[1]!]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Reel 1: done");
  });
});
