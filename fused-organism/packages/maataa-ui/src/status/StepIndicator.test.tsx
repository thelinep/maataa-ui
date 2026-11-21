import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepIndicator, type Step } from "./StepIndicator";

const steps: Step[] = [
  { id: "a", label: "Script", state: "done" },
  { id: "b", label: "Budget", state: "current" },
  { id: "c", label: "Schedule", state: "upcoming" },
];

describe("StepIndicator", () => {
  it("is a labelled nav with an ordered list", () => {
    render(<StepIndicator label="Pre-production" steps={steps} />);
    expect(screen.getByRole("navigation", { name: "Pre-production" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
  it("marks only the current step with aria-current", () => {
    const { container } = render(<StepIndicator label="Steps" steps={steps} />);
    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Budget");
  });
  it("states each step in words", () => {
    render(<StepIndicator label="Steps" steps={steps} />);
    expect(screen.getByText(/Completed/)).toBeInTheDocument();
    expect(screen.getByText(/Not started/)).toBeInTheDocument();
  });
});
