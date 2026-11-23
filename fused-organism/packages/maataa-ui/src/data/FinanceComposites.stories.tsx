import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
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

const meta = { title: "Data/FinanceComposites", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date(2026, 10, 21);

function Money() {
  const [s, setS] = useState("base");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ScenarioSwitcher
        scenarios={[
          { id: "low", name: "Low", value: 18000000, note: "Break-even month 22" },
          { id: "base", name: "Base", value: 42000000, note: "Break-even month 14" },
          { id: "high", name: "High", value: 95000000, note: "Break-even month 8" },
        ]}
        value={s}
        onChange={setS}
      />
      <CostDriverRow
        drivers={[
          {
            id: "cast",
            label: "Cast",
            amount: 9500000,
            delta: 1200000,
            reason: "Lead actor fee revised",
          },
          { id: "loc", label: "Locations & permits", amount: 3200000 },
          {
            id: "crew",
            label: "Crew",
            amount: 6800000,
            delta: -400000,
            reason: "One shoot day cut",
          },
          { id: "post", label: "Post-production", amount: 4100000 },
        ]}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ContractExpiryPill expires={new Date(2026, 10, 18)} today={today} />
        <ContractExpiryPill expires={new Date(2026, 11, 2)} today={today} />
        <ContractExpiryPill expires={new Date(2027, 5, 1)} today={today} />
      </div>
      <ProfitDistributionRing
        pool={25000000}
        shares={[
          { label: "Investors", percent: 50 },
          { label: "Producers", percent: 30 },
          { label: "Cast & crew pool", percent: 15 },
          { label: "Community fund", percent: 5 },
        ]}
      />
    </div>
  );
}
export const Finance: Story = { render: () => <Money /> };

export const Chain: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <TokenBalanceCard
        symbol="MTA"
        name="Monsoon share token"
        balance={1200}
        valueInr={186000}
        change24h={2.4}
        holdersShare={0.4}
      />
      <SmartContractStatusCard
        name="Revenue split"
        state="audited"
        network="Polygon PoS"
        address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
        auditedBy="CertiK, 12 Nov 2026"
        lastEvent="Payout #4 · 18 Nov"
      />
      <GovernanceVoteCard
        title="Fund a second shoot week?"
        description="Adds ₹18 lakh to the budget from the reserve."
        options={[
          { id: "y", label: "Yes", votes: 312 },
          { id: "n", label: "No", votes: 104 },
          { id: "a", label: "Abstain", votes: 20 },
        ]}
        closesAt="30 Nov, 18:00"
        quorum={500}
        myVote="y"
        onVote={() => {}}
      />
    </div>
  ),
};

export const Raising: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["Title", "Logline", "Market", "Team", "Budget"].map((t, i) => (
          <PitchSlideThumbnail
            key={t}
            number={i + 1}
            title={t}
            current={i === 2}
            viewedSeconds={[8, 21, 42, 30, 55][i]}
            onOpen={() => {}}
          />
        ))}
      </div>
      <InvestorRow
        investors={[
          {
            id: "1",
            name: "Leela Rao",
            firm: "Lotus Ventures",
            ticket: 5000000,
            stage: "Committed",
            lastContact: "18 Nov",
            nextStep: "Sign SHA",
          },
          {
            id: "2",
            name: "Vikram Shah",
            ticket: 20000000,
            stage: "Due diligence",
            lastContact: "15 Nov",
            nextStep: "Send cost report",
          },
          {
            id: "3",
            name: "Ananya Gupta",
            firm: "Studio Nine",
            stage: "Passed",
            lastContact: "2 Nov",
          },
        ]}
      />
      <CrowdfundingProgressBar
        raised={750000}
        goal={1000000}
        backers={312}
        daysLeft={9}
        stretchGoals={[{ at: 1500000, label: "Original score with live orchestra" }]}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        <RewardTierCard
          title="Digital thank-you"
          amount={500}
          includes={["Name in credits", "Behind-the-scenes diary"]}
          delivery="Mar 2027"
          onSelect={() => {}}
        />
        <RewardTierCard
          title="Premiere ticket"
          amount={2500}
          includes={["Two premiere tickets", "Signed poster"]}
          delivery="Apr 2027"
          limit={100}
          claimed={100}
          onSelect={() => {}}
        />
      </div>
      <AudienceRecommendationMeter recommend={164} neutral={41} notRecommend={22} />
    </div>
  ),
};
