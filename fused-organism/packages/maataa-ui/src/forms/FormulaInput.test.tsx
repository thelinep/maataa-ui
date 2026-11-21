import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { FormulaInput, evaluateFormula } from "./FormulaInput";

describe("evaluateFormula", () => {
  const vars = { days: 12, rate: 25000 };
  it("respects precedence, functions and variables", () => {
    expect(evaluateFormula("days * rate * 1.18", vars)).toEqual({ ok: true, value: 354000 });
    expect(evaluateFormula("2 + 3 * 4 ^ 2", vars)).toEqual({ ok: true, value: 50 });
    expect(evaluateFormula("round(10 / 3, 2)", vars)).toEqual({ ok: true, value: 3.33 });
    expect(evaluateFormula("max(days, 20) - -1", vars)).toEqual({ ok: true, value: 21 });
  });
  it("explains errors in words", () => {
    expect(evaluateFormula("days * crew", vars)).toEqual({
      ok: false,
      error: "Unknown value “crew”.",
    });
    expect(evaluateFormula("(1 + 2", vars)).toEqual({
      ok: false,
      error: "A bracket is not closed.",
    });
    expect(evaluateFormula("1 / 0", vars)).toEqual({ ok: false, error: "Division by zero." });
    expect(evaluateFormula("alert(1)", vars)).toEqual({
      ok: false,
      error: "There is no function called alert.",
    });
  });
});

describe("FormulaInput", () => {
  it("inserts variables and shows the result", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("");
      return (
        <FormulaInput
          label="Crew cost"
          value={v}
          onChange={(t) => setV(t)}
          variables={[
            { name: "days", value: 12, label: "Shoot days" },
            { name: "rate", value: 25000 },
          ]}
        />
      );
    }
    render(<H />);
    await user.click(screen.getByRole("button", { name: /days · Shoot days/ }));
    await user.type(screen.getByLabelText("Crew cost"), " * ");
    await user.click(screen.getByRole("button", { name: /^rate/ }));
    expect(screen.getByLabelText("Crew cost")).toHaveValue("days * rate");
    expect(screen.getByRole("status")).toHaveTextContent("Result: 3,00,000");
  });
});
