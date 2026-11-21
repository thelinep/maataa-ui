import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  WalletConnectButton,
  WalletAddress,
  TransactionList,
  TransactionConfirmDialog,
  GasEstimate,
  DistributionEventLog,
  ContractStatusBadge,
  shortAddress,
} from "./Web3";

const addr = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

describe("Web3", () => {
  it("addresses read in full, show short", () => {
    expect(shortAddress(addr)).toBe("0x71C7…976F");
    render(<WalletAddress address={addr} />);
    expect(screen.getByText(addr)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy address" })).toBeInTheDocument();
  });

  it("connect explains a declined request", async () => {
    const connect = vi.fn().mockRejectedValue({ code: 4001 });
    render(
      <WalletConnectButton
        wallets={[{ id: "mm", name: "MetaMask", installed: true }]}
        connect={connect}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Connect wallet" }));
    await userEvent.click(screen.getByRole("button", { name: /MetaMask/ }));
    expect(await screen.findByText("You declined the request in MetaMask.")).toBeInTheDocument();
  });

  it("transactions, gas, log and badge use words", () => {
    render(
      <>
        <TransactionList
          transactions={[
            {
              hash: "0xabc1234567890def",
              description: "Payout #4",
              amount: "120 MATIC",
              state: "pending",
              confirmations: 3,
              time: "18 Nov",
            },
          ]}
        />
        <GasEstimate fee={0.002} symbol="MATIC" feeInr={0.4} level="high" />
        <DistributionEventLog
          events={[
            {
              id: "1",
              date: "18 Nov",
              source: "OTT Q3",
              total: 5000000,
              recipients: 420,
              yourShare: 12000,
            },
          ]}
        />
        <ContractStatusBadge state="paused" />
      </>
    );
    expect(screen.getByText("Pending (3 confirmations)")).toBeInTheDocument();
    expect(screen.getByText("Network busy — fee is high")).toBeInTheDocument();
    expect(screen.getByText(/You have received/)).toHaveTextContent("₹12,000");
    expect(screen.getByText("Contract paused")).toBeInTheDocument();
  });

  it("confirm dialog focuses Cancel and warns", async () => {
    const cancel = vi.fn();
    render(
      <TransactionConfirmDialog
        open
        title="Send 100 MTA?"
        summary="To Leela Rao"
        rows={[{ label: "To", value: addr }]}
        onConfirm={() => {}}
        onCancel={cancel}
      />
    );
    expect(screen.getByRole("alertdialog", { name: "Send 100 MTA?" })).toHaveAccessibleDescription(
      /can’t be reversed/
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(cancel).toHaveBeenCalled();
  });
});
