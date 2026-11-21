import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PermitStatusCard } from "./PermitStatusCard";

describe("PermitStatusCard", () => {
  it("warns about expiry within a week", () => {
    render(
      <PermitStatusCard
        now={new Date(2026, 10, 21)}
        permit={{
          id: "1",
          title: "Shoot permit – BMC",
          authority: "BMC",
          status: "approved",
          validFrom: new Date(2026, 10, 1),
          validTo: new Date(2026, 10, 24),
          conditions: ["No shooting after 10 pm"],
        }}
      />
    );
    expect(screen.getByRole("article", { name: "Shoot permit – BMC" })).toHaveTextContent(
      "Approved"
    );
    expect(screen.getByText(/expires in 3 days/)).toBeInTheDocument();
    expect(screen.getByText("1 condition")).toBeInTheDocument();
  });
});
