import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  CrowdfundingCampaignBuilder,
  campaignProblems,
  type CampaignDraft,
} from "./CrowdfundingCampaignBuilder";

const empty: CampaignDraft = {
  title: "",
  goal: 0,
  start: "",
  end: "",
  story: "",
  useOfFunds: "",
  tiers: [],
};

describe("campaignProblems", () => {
  it("lists what blocks review", () => {
    expect(campaignProblems(empty)).toContain("Set a funding goal");
    const ok: CampaignDraft = {
      title: "Monsoon Diaries",
      goal: 1000000,
      start: "2027-01-01",
      end: "2027-01-31",
      story: "x".repeat(200),
      useOfFunds: "Post-production",
      tiers: [
        {
          id: "t",
          title: "Thank-you credit",
          amount: 500,
          description: "Your name in the credits",
        },
      ],
    };
    expect(campaignProblems(ok)).toEqual([]);
    expect(campaignProblems({ ...ok, end: "2027-04-30" })).toContain(
      "Keep the campaign to 60 days or fewer"
    );
  });
});

function H() {
  const [c, setC] = useState(empty);
  return (
    <CrowdfundingCampaignBuilder
      value={c}
      onChange={setC}
      onSubmitForReview={() => {}}
      newId={() => "t1"}
    />
  );
}

describe("CrowdfundingCampaignBuilder", () => {
  it("explains why review is blocked and adds tiers", async () => {
    const user = userEvent.setup();
    render(<H />);
    expect(screen.getByRole("status")).toHaveTextContent(/things to do before review/);
    expect(screen.getByRole("button", { name: "Send for review" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Add tier" }));
    expect(screen.getByRole("group", { name: "Tier 1" })).toBeInTheDocument();
  });
});
