import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarketingCampaignCard, MarketingAssetLibrary } from "./MarketingViews";

describe("MarketingCampaignCard", () => {
  it("flags overspend and shows result", () => {
    render(
      <MarketingCampaignCard
        campaign={{
          id: "1",
          name: "Trailer launch",
          goal: "Awareness",
          channels: ["YouTube", "Instagram"],
          start: new Date(2026, 10, 1),
          end: new Date(2026, 10, 30),
          budget: 500000,
          spent: 620000,
          status: "published",
          result: { label: "Views", value: "1.2 M" },
        }}
      />
    );
    expect(screen.getByRole("article", { name: "Trailer launch" })).toHaveTextContent(
      "over budget"
    );
    expect(screen.getByText("1.2 M")).toBeInTheDocument();
  });
});

describe("MarketingAssetLibrary", () => {
  it("separates expired rights and filters by channel", async () => {
    const assets = [
      {
        id: "1",
        name: "poster.jpg",
        kind: "image" as const,
        type: "Poster",
        approvedFor: ["Instagram"],
      },
      {
        id: "2",
        name: "old-still.jpg",
        kind: "image" as const,
        type: "Still",
        approvedFor: ["Press"],
        rightsUntil: new Date(2025, 0, 1),
      },
    ];
    render(
      <MarketingAssetLibrary assets={assets} onOpen={() => {}} now={new Date(2026, 10, 21)} />
    );
    expect(screen.getByRole("region", { name: "Rights expired" })).toHaveTextContent(
      "old-still.jpg"
    );
    expect(screen.getByRole("status")).toHaveTextContent("1 usable asset");
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "Approved for" }), "Press");
    expect(screen.getByRole("status")).toHaveTextContent("0 usable assets");
  });
});
