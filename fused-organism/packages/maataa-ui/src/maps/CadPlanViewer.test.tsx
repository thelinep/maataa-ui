import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CadPlanViewer } from "./CadPlanViewer";
import { parseDxf } from "./dxf";
import { STUDIO_PLAN_DXF } from "./studioPlan.fixture";

const plan = parseDxf(STUDIO_PLAN_DXF);

describe("CadPlanViewer", () => {
  it("draws the plan with its size and layers", () => {
    render(<CadPlanViewer drawing={plan} label="Studio 4" />);
    expect(screen.getByRole("heading", { name: /Studio 4 · 24 × 14 m/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Studio 4" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "WALLS" })).toBeChecked();
    expect(screen.getByText("Not drawn: HATCH ×1")).toBeInTheDocument();
  });

  it("hides a layer's shapes when it is turned off", async () => {
    const { container } = render(<CadPlanViewer drawing={plan} />);
    const before = container.querySelectorAll("svg text").length;
    await userEvent.click(screen.getByRole("checkbox", { name: "LABELS" }));
    expect(container.querySelectorAll("svg text").length).toBe(before - 3);
  });

  it("zooms with the buttons and keys, and fits back", async () => {
    render(<CadPlanViewer drawing={plan} />);
    const svg = screen.getByRole("img");
    const start = svg.getAttribute("viewBox");
    await userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(svg.getAttribute("viewBox")).not.toBe(start);
    fireEvent.keyDown(svg, { key: "0" });
    expect(svg.getAttribute("viewBox")).toBe(start);
    fireEvent.keyDown(svg, { key: "ArrowRight" });
    expect(svg.getAttribute("viewBox")).not.toBe(start);
  });

  it("announces measuring mode", async () => {
    render(<CadPlanViewer drawing={plan} />);
    await userEvent.click(screen.getByRole("button", { name: "Measure" }));
    expect(screen.getByRole("button", { name: "Measure" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Measuring: choose the first point.")).toBeInTheDocument();
  });

  it("opens a DXF file and refuses DWG with a reason", async () => {
    const onChange = vi.fn();
    const { container } = render(<CadPlanViewer onDrawingChange={onChange} />);
    expect(screen.getByText("Open a DXF floor plan to see it here.")).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(["x"], "plan.dwg"));
    expect(screen.getByRole("alert")).toHaveTextContent("Save the drawing as DXF");
    const file = new File([STUDIO_PLAN_DXF], "studio.dxf");
    Object.defineProperty(file, "text", { value: () => Promise.resolve(STUDIO_PLAN_DXF) });
    await userEvent.upload(input, file);
    expect(await screen.findByText("studio.dxf opened.")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ units: "m" }), "studio.dxf");
    expect(screen.getByRole("checkbox", { name: "DOORS" })).toBeInTheDocument();
  });
});
