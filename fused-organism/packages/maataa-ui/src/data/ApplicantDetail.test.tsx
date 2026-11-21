import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApplicantDetail } from "./ApplicantDetail";

describe("ApplicantDetail", () => {
  it("hides email until shared", () => {
    render(
      <ApplicantDetail
        applicant={{
          id: "1",
          name: "Asha Rao",
          role: "Editor",
          stage: "Shortlist",
          appliedAt: new Date(2026, 10, 1),
          message: "Cut two features.",
        }}
        actions={<button>Callback</button>}
      />
    );
    expect(screen.getByRole("heading", { level: 2, name: "Asha Rao" })).toBeInTheDocument();
    expect(screen.getByText("Shared after you reply")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Message" })).toHaveTextContent("Cut two features.");
  });
});
