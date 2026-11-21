import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CallbackList } from "./CallbackList";

describe("CallbackList", () => {
  it("sorts by time and states status in words", () => {
    render(
      <CallbackList
        callbacks={[
          {
            id: "2",
            name: "Ravi",
            role: "Lead",
            at: new Date(2026, 10, 25, 14),
            status: "invited",
          },
          {
            id: "1",
            name: "Asha",
            role: "Lead",
            at: new Date(2026, 10, 25, 10),
            status: "confirmed",
            material: "Scene 12",
          },
        ]}
      />
    );
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Asha");
    expect(rows[1]).toHaveTextContent("Confirmed");
  });
});
