import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductionListingCard, ProductionListingGrid } from "./ProductionListing";

const item = {
  id: "p1",
  title: "Monsoon Diaries",
  type: "Feature film",
  genre: "Drama",
  location: "Mumbai",
  openRoles: ["Editor"],
};

describe("ProductionListing", () => {
  it("card is one named link", async () => {
    const onOpen = vi.fn();
    render(<ProductionListingCard item={item} onOpen={onOpen} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    await userEvent.setup().click(screen.getByRole("link", { name: "Monsoon Diaries" }));
    expect(onOpen).toHaveBeenCalledWith(item);
  });
  it("empty state explains privacy-hidden productions", () => {
    render(<ProductionListingGrid items={[]} hiddenCount={3} onClearFilters={() => {}} />);
    expect(screen.getByText(/3 productions are set to private or unlisted/)).toBeInTheDocument();
  });
  it("grid is a labelled list", () => {
    render(<ProductionListingGrid items={[item]} />);
    expect(screen.getByRole("list", { name: "Productions" })).toBeInTheDocument();
  });
});
