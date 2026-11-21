import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReceiptDisplay } from "./ReceiptDisplay";

describe("ReceiptDisplay", () => {
  const lines = [
    { label: "Screening fee", amount: 15000 },
    { label: "GST", amount: 2700 },
  ];
  it("renders a table with a total", () => {
    render(
      <ReceiptDisplay
        reference="RCPT-0042"
        issuedAt={new Date("2026-11-01")}
        lines={lines}
        status="paid"
      />
    );
    expect(screen.getByRole("article", { name: "Receipt RCPT-0042" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /RCPT-0042/ })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Total" })).toBeInTheDocument();
    expect(screen.getByText(/17,700/)).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });
});
