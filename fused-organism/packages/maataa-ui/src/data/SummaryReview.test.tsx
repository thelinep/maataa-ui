import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SummaryReview } from "./SummaryReview";

describe("SummaryReview", () => {
  it("names change buttons and fills empty values", async () => {
    const onEdit = vi.fn();
    render(
      <SummaryReview
        sections={[
          {
            id: "a",
            title: "Account type",
            rows: [
              { label: "Type", value: "Company" },
              { label: "GSTIN", value: "" },
            ],
            onEdit,
          },
        ]}
      />
    );
    expect(screen.getByText("Not given")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Change account type" }));
    expect(onEdit).toHaveBeenCalled();
  });
});
