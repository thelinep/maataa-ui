import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { BudgetLineEditor, type BudgetLine } from "./BudgetLineEditor";

function H() {
  const [lines, setLines] = useState<BudgetLine[]>([
    { id: "1", category: "Catering", item: "Lunch", quantity: 12, unit: "days", rate: 4000 },
  ]);
  return (
    <BudgetLineEditor
      lines={lines}
      onChange={setLines}
      categories={["Catering", "Crew"]}
      newId={() => "n"}
    />
  );
}

describe("BudgetLineEditor", () => {
  it("labels cells by row and totals live", async () => {
    const user = userEvent.setup();
    render(<H />);
    expect(screen.getByRole("table", { name: "Budget lines" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("₹48,000");
    const rate = screen.getByLabelText("Rate for Lunch");
    await user.clear(rate);
    await user.type(rate, "5000");
    expect(screen.getByRole("status")).toHaveTextContent("₹60,000");
    await user.click(screen.getByRole("button", { name: "Add line" }));
    expect(screen.getAllByRole("row")).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "Remove Lunch" }));
    expect(screen.queryByLabelText("Rate for Lunch")).toBeNull();
  });
});
