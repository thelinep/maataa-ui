import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EquipmentCatalog } from "./EquipmentCatalog";

describe("EquipmentCatalog", () => {
  it("groups by category and blocks unavailable items", async () => {
    const onBook = vi.fn();
    render(
      <EquipmentCatalog
        onBook={onBook}
        items={[
          {
            id: "1",
            name: "ARRI Alexa Mini",
            category: "Camera",
            dayRate: 28000,
            available: 1,
            total: 2,
          },
          { id: "2", name: "Aputure 600d", category: "Lighting", available: 0, total: 4 },
        ]}
      />
    );
    expect(screen.getByRole("region", { name: "Camera" })).toHaveTextContent("1 of 2 free");
    expect(screen.getByRole("button", { name: "Book Aputure 600d" })).toBeDisabled();
    await userEvent.setup().click(screen.getByRole("button", { name: "Book ARRI Alexa Mini" }));
    expect(onBook).toHaveBeenCalled();
  });
});
