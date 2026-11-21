import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  WalletConnectButton,
  WalletAddress,
  TransactionList,
  TransactionConfirmDialog,
  GasEstimate,
  DistributionEventLog,
  ContractStatusBadge,
} from "./Web3";

const meta = { title: "Data/Web3", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const addr = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

function Demo() {
  const [a, setA] = useState<string | null>(null);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <WalletConnectButton
        wallets={[
          { id: "mm", name: "MetaMask", installed: true },
          { id: "wc", name: "WalletConnect" },
        ]}
        connect={async () => {
          setA(addr);
          return addr;
        }}
        disconnect={() => setA(null)}
        address={a}
        network="Polygon"
      />
      <WalletAddress address={addr} label="Revenue split" explorerHref="#" />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <ContractStatusBadge state="deployed" />
        <ContractStatusBadge state="paused" />
        <ContractStatusBadge state="audited" />
      </div>
      <TransactionList
        transactions={[
          {
            hash: "0x9f2a1c7b3e4d5f60718293a4b5c6d7e8f9a0b1c2",
            description: "Payout #4 to investors",
            amount: "1,240 MATIC",
            state: "confirmed",
            time: "18 Nov, 14:02",
            explorerHref: "#",
          },
          {
            hash: "0x1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4",
            description: "Buy 100 MTA",
            amount: "₹15,500",
            state: "pending",
            confirmations: 3,
            time: "21 Nov, 10:41",
          },
          {
            hash: "0x2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5",
            description: "Vote: second shoot week",
            state: "failed",
            time: "20 Nov, 19:10",
          },
        ]}
      />
      <GasEstimate fee={0.0021} symbol="MATIC" feeInr={0.42} speed="about 30 seconds" level="low" />
      <DistributionEventLog
        events={[
          {
            id: "2",
            date: "18 Nov 2026",
            source: "OTT licence Q3",
            total: 5000000,
            recipients: 420,
            yourShare: 12000,
            txHash: "0x9f2a1c7b3e4d5f607182",
            explorerHref: "#",
          },
          {
            id: "1",
            date: "20 Aug 2026",
            source: "Festival prize",
            total: 800000,
            recipients: 410,
            yourShare: 1900,
            txHash: "0x77aa1c7b3e4d5f607182",
          },
        ]}
      />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };

export const Confirm: Story = {
  render: () => (
    <div style={{ position: "relative", height: 520, transform: "translateZ(0)" }}>
      <TransactionConfirmDialog
        open
        title="Send 100 MTA?"
        summary="You are sending 100 Monsoon share tokens to Leela Rao."
        rows={[
          { label: "Amount", value: "100 MTA (≈ ₹15,500)" },
          { label: "To", value: addr },
        ]}
        gas={{ fee: 0.0021, symbol: "MATIC", feeInr: 0.42, level: "normal" }}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </div>
  ),
};
