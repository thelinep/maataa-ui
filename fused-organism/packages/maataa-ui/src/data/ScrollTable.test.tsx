import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollTable } from "./ScrollTable";

describe("ScrollTable", () => {
  it("is a focusable named region", () => {
    render(
      <ScrollTable label="Budget">
        <table>
          <tbody>
            <tr>
              <td>x</td>
            </tr>
          </tbody>
        </table>
      </ScrollTable>
    );
    expect(screen.getByRole("region", { name: "Budget" })).toHaveAttribute("tabindex", "0");
  });
});
