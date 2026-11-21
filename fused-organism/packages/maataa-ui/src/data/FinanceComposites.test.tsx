import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  inrShort,
  daysUntil,
  CostDriverRow,
  ScenarioSwitcher,
  ContractExpiryPill,
  TokenBalanceCard,
  SmartContractStatusCard,
  ProfitDistributionRing,
  GovernanceVoteCard,
  PitchSlideThumbnail,
  InvestorRow,
  CrowdfundingProgressBar,
  RewardTierCard,
  AudienceRecommendationMeter,
} from "./FinanceComposites";

describe("FinanceComposites", () => {
  it("formats rupees in lakh and crore", () => {
    expect(inrShort(250000)).toBe("₹2.5 lakh");
    expect(inrShort(32000000)).toBe("₹3.2 crore");
    expect(inrShort(9500)).toBe("₹9,500");
    expect(daysUntil(new Date(2026, 11, 1), new Date(2026, 10, 21))).toBe(10);
  });

  it("cost drivers and scenarios", async () => {
    function H() {
      const [s, setS] = useState("base");
      return (
        <ScenarioSwitcher
          scenarios={[
            { id: "low", name: "Low", value: 10000000 },
            { id: "base", name: "Base", value: 25000000 },
          ]}
          value={s}
          onChange={setS}
        />
      );
    }
    render(
      <>
        <CostDriverRow
          drivers={[
            { id: "a", label: "Cast", amount: 600000, delta: 200000 },
            { id: "b", label: "Locations", amount: 400000 },
          ]}
        />
        <H />
      </>
    );
    expect(screen.getByText("up ₹2 lakh")).toBeInTheDocument();
    screen.getByRole("radio", { name: /Base/ }).focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: /Low/ })).toHaveAttribute("aria-checked", "true");
  });

  it("expiry pill, token and contract", () => {
    render(
      <>
        <ContractExpiryPill expires={new Date(2026, 10, 18)} today={new Date(2026, 10, 21)} />
        <TokenBalanceCard symbol="MTA" name="Maataa share" balance={1200} change24h={-2.4} />
        <SmartContractStatusCard
          name="Revenue split"
          state="deployed"
          network="Polygon"
          address="0x1234567890abcdef1234"
        />
      </>
    );
    expect(screen.getByText(/Expired 3 days ago/)).toBeInTheDocument();
    expect(screen.getByText("Down 2.4% in 24 hours")).toBeInTheDocument();
    expect(screen.getByText("0x1234567890abcdef1234")).toBeInTheDocument();
  });

  it("profit ring warns when shares don't add up; vote shows results", async () => {
    const vote = vi.fn();
    render(
      <>
        <ProfitDistributionRing
          shares={[
            { label: "Investors", percent: 50 },
            { label: "Producers", percent: 40 },
          ]}
          pool={10000000}
        />
        <GovernanceVoteCard
          title="Fund a second shoot week?"
          options={[
            { id: "y", label: "Yes", votes: 30 },
            { id: "n", label: "No", votes: 10 },
          ]}
          closesAt="30 Nov"
          quorum={50}
          onVote={vote}
        />
      </>
    );
    expect(screen.getByText("Shares add up to 90%, not 100%.")).toBeInTheDocument();
    expect(screen.getByText(/10 more needed/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Yes 75%, 30 votes" }));
    expect(vote).toHaveBeenCalledWith("y");
  });

  it("pitch, investors, crowdfunding, reward and audience", () => {
    render(
      <>
        <PitchSlideThumbnail number={3} title="Market" viewedSeconds={42} onOpen={() => {}} />
        <InvestorRow
          investors={[{ id: "1", name: "Leela Rao", ticket: 5000000, stage: "Committed" }]}
        />
        <CrowdfundingProgressBar raised={750000} goal={1000000} backers={312} daysLeft={9} />
        <RewardTierCard
          title="Premiere ticket"
          amount={2500}
          includes={["Two tickets"]}
          limit={100}
          claimed={100}
          onSelect={() => {}}
        />
        <AudienceRecommendationMeter recommend={70} neutral={20} notRecommend={10} />
      </>
    );
    expect(
      screen.getByRole("button", { name: "Slide 3: Market, viewed 42 seconds" })
    ).toBeInTheDocument();
    expect(screen.getByText("Committed so far:")).toHaveTextContent("₹50 lakh");
    expect(screen.getByRole("progressbar", { name: "Funding" })).toHaveAttribute(
      "aria-valuetext",
      "₹7.5 lakh of ₹10 lakh, 75%"
    );
    expect(screen.getByRole("button", { name: "All claimed: Premiere ticket" })).toBeDisabled();
    expect(screen.getByText(/Net score/)).toHaveTextContent(
      "Net score +60 — Strong. Based on 100 responses."
    );
  });
});
