import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationGallery, LocationDetail } from "./LocationGallery";

const loc = {
  id: "l1",
  name: "Bandra bungalow",
  area: "Mumbai",
  setting: "Both",
  permit: "needed" as const,
  dayRate: "₹60,000",
  accessNotes: "Lift to first floor.",
};

describe("LocationGallery", () => {
  it("cards are single links with permit state", async () => {
    const onOpen = vi.fn();
    render(<LocationGallery locations={[loc]} onOpen={onOpen} />);
    expect(screen.getByText("Permit needed")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("link", { name: "Bandra bungalow" }));
    expect(onOpen).toHaveBeenCalledWith(loc);
  });
  it("detail lists access", () => {
    render(<LocationDetail location={loc} />);
    expect(screen.getByRole("region", { name: "Access" })).toHaveTextContent("Lift");
  });
});
