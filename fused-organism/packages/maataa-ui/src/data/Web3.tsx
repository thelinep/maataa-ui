/**
 * @maataa/ui/data/Web3
 * WalletConnectButton, WalletAddress, TransactionList, TransactionConfirmDialog,
 * GasEstimate, DistributionEventLog and ContractStatusBadge
 * (for v1.1+ tokenised financing; no wallet library is bundled)
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { inrShort } from "./FinanceComposites";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const btn = (primary?: boolean): React.CSSProperties => ({
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 10,
  border: primary ? 0 : `1px solid ${colorTokens.border.control}`,
  background: primary ? colorTokens.interactive.primary : colorTokens.background.primary,
  color: primary ? colorTokens.text.inverse : colorTokens.text.primary,
  font: "inherit",
  fontWeight: primary ? 700 : 500,
  cursor: "pointer",
});

/** 0x71C7…976F */
export function shortAddress(a: string, head = 6, tail = 4) {
  return a.length > head + tail + 1 ? `${a.slice(0, head)}…${a.slice(-tail)}` : a;
}

/* ───────────────────────── WalletAddress ───────────────────────── */

/**
 * WalletAddress
 * Shortened visually; the full address is in the accessible text and copied
 * whole. An identicon-style block helps sighted users compare.
 */
export function WalletAddress({
  address,
  label,
  explorerHref,
}: {
  address: string;
  label?: string;
  explorerHref?: string;
}) {
  const [msg, setMsg] = useState("");
  const hue = parseInt(address.slice(2, 8) || "0", 16) % 360;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          background: `conic-gradient(hsl(${hue} 55% 40%), hsl(${(hue + 120) % 360} 55% 45%), hsl(${(hue + 240) % 360} 55% 40%), hsl(${hue} 55% 40%))`,
        }}
      />
      {label && <span style={{ fontWeight: 600 }}>{label}</span>}
      <code style={{ fontFamily: mono }} title={address}>
        <span aria-hidden="true">{shortAddress(address)}</span>
        <VisuallyHidden>{address}</VisuallyHidden>
      </code>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard?.writeText
            ? navigator.clipboard.writeText(address).then(
                () => setMsg("Address copied."),
                () => setMsg("Couldn’t copy.")
              )
            : setMsg("Couldn’t copy.")
        }
        style={{
          minHeight: 28,
          padding: "0 8px",
          borderRadius: 6,
          border: `1px solid ${colorTokens.border.control}`,
          background: colorTokens.background.primary,
          font: "inherit",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Copy <VisuallyHidden>address</VisuallyHidden>
      </button>
      {explorerHref && (
        <a
          href={explorerHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: colorTokens.interactive.primary }}
        >
          View on explorer <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
        </a>
      )}
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </span>
  );
}

/* ───────────────────────── WalletConnectButton ───────────────────────── */

export interface WalletOption {
  id: string;
  name: string;
  /** Detected in this browser */
  installed?: boolean;
}

export interface WalletConnectButtonProps {
  wallets: WalletOption[];
  /** Resolve with the connected address */
  connect: (walletId: string) => Promise<string>;
  disconnect?: () => void;
  address?: string | null;
  network?: string;
}

/**
 * WalletConnectButton
 * Connected: shows address + network with Disconnect. Not connected: a
 * disclosure listing wallets; errors (refused, no wallet) are explained.
 */
export function WalletConnectButton({
  wallets,
  connect,
  disconnect,
  address,
  network,
}: WalletConnectButtonProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  if (address) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <WalletAddress address={address} />
        {network && (
          <span
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 999,
              background: colorTokens.semantic.success.bg,
              color: colorTokens.semantic.success.text,
              fontWeight: 700,
            }}
          >
            {network}
          </span>
        )}
        {disconnect && (
          <button
            type="button"
            onClick={disconnect}
            style={{ ...btn(), minHeight: 32, fontSize: 12 }}
          >
            Disconnect
          </button>
        )}
      </div>
    );
  }
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        style={btn(true)}
      >
        Connect wallet
      </button>
      <div
        id={id}
        hidden={!open}
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 20,
          minWidth: 240,
          padding: 8,
          borderRadius: 12,
          background: colorTokens.background.primary,
          border: `1px solid ${colorTokens.border.control}`,
          boxShadow: colorTokens.shadow.lg,
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {wallets.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                disabled={!!busy}
                onClick={async () => {
                  setBusy(w.id);
                  setMsg(`Waiting for ${w.name}…`);
                  try {
                    await connect(w.id);
                    setMsg(`Connected with ${w.name}.`);
                    setOpen(false);
                  } catch (e) {
                    const code = (e as { code?: number }).code;
                    setMsg(
                      code === 4001
                        ? `You declined the request in ${w.name}.`
                        : `Couldn’t connect to ${w.name}. Is it installed and unlocked?`
                    );
                  } finally {
                    setBusy(null);
                  }
                }}
                style={{
                  ...btn(),
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: 0,
                  textAlign: "left",
                }}
              >
                {w.name}
                <span style={{ fontSize: 11, color: colorTokens.text.secondary }}>
                  {busy === w.id ? "Connecting…" : w.installed ? "Detected" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p
        role="status"
        style={{ margin: "4px 0 0", fontSize: 12, color: colorTokens.text.secondary }}
      >
        {msg}
      </p>
    </div>
  );
}

/* ───────────────────────── Transactions ───────────────────────── */

export type TxState = "pending" | "confirmed" | "failed";

export interface Transaction {
  hash: string;
  /** e.g. "Payout to investors", "Buy 100 MTA" */
  description: string;
  amount?: string;
  state: TxState;
  /** Blocks confirmed */
  confirmations?: number;
  time: string;
  explorerHref?: string;
}

const TX: Record<TxState, [string, string, string, string]> = {
  pending: ["Pending", "…", colorTokens.semantic.warning.bg, colorTokens.semantic.warning.text],
  confirmed: ["Confirmed", "✓", colorTokens.semantic.success.bg, colorTokens.semantic.success.text],
  failed: ["Failed", "✕", colorTokens.semantic.error.bg, colorTokens.semantic.error.text],
};

/** Transaction rows with state in words and a link to the explorer. */
export function TransactionList({
  transactions,
  label = "Transactions",
}: {
  transactions: Transaction[];
  label?: string;
}) {
  return (
    <section aria-label={label}>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {transactions.map((t) => {
          const [w, sym, bg, fg] = TX[t.state];
          return (
            <li
              key={t.hash}
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: `1px solid ${colorTokens.border.tertiary}`,
                background: colorTokens.background.primary,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  background: bg,
                  color: fg,
                  fontWeight: 800,
                }}
              >
                {sym}
              </span>
              <span style={{ minWidth: 0 }}>
                <strong style={{ display: "block" }}>{t.description}</strong>
                <span style={{ fontSize: 12, color: colorTokens.text.secondary }}>
                  {t.time} · <span style={{ fontFamily: mono }}>{shortAddress(t.hash, 8, 6)}</span>
                  {t.explorerHref && (
                    <>
                      {" · "}
                      <a
                        href={t.explorerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colorTokens.interactive.primary }}
                      >
                        Details{" "}
                        <VisuallyHidden>for {t.description} (opens in a new tab)</VisuallyHidden>
                      </a>
                    </>
                  )}
                </span>
              </span>
              <span style={{ textAlign: "right" }}>
                {t.amount && (
                  <span style={{ display: "block", fontWeight: 700, fontFamily: mono }}>
                    {t.amount}
                  </span>
                )}
                <span style={{ fontSize: 12, fontWeight: 700, color: fg }}>
                  {w}
                  {t.state === "pending" && t.confirmations != null
                    ? ` (${t.confirmations} confirmations)`
                    : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ───────────────────────── Gas ───────────────────────── */

export interface GasEstimateProps {
  /** Native token fee, e.g. 0.0021 */
  fee: number;
  symbol: string;
  /** Fee in ₹ */
  feeInr?: number;
  /** e.g. "about 30 seconds" */
  speed?: string;
  level?: "low" | "normal" | "high";
}

/** Network fee in token and ₹, with a word for how busy the network is. */
export function GasEstimate({ fee, symbol, feeInr, speed, level = "normal" }: GasEstimateProps) {
  const word = {
    low: "Network quiet — fee is low",
    normal: "Normal fee",
    high: "Network busy — fee is high",
  }[level];
  const col =
    level === "high"
      ? colorTokens.interactive.error
      : level === "low"
        ? colorTokens.interactive.success
        : colorTokens.text.secondary;
  return (
    <dl
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "2px 12px",
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      <dt style={{ color: colorTokens.text.secondary }}>Network fee</dt>
      <dd style={{ margin: 0, fontFamily: mono }}>
        {fee} {symbol}
        {feeInr != null && (
          <span style={{ fontFamily: "inherit", color: colorTokens.text.secondary }}>
            {" "}
            ≈ ₹{feeInr.toLocaleString("en-IN")}
          </span>
        )}
      </dd>
      {speed && (
        <>
          <dt style={{ color: colorTokens.text.secondary }}>Expected time</dt>
          <dd style={{ margin: 0 }}>{speed}</dd>
        </>
      )}
      <dt style={{ color: colorTokens.text.secondary }}>Status</dt>
      <dd style={{ margin: 0, color: col, fontWeight: 600 }}>{word}</dd>
    </dl>
  );
}

/* ───────────────────────── TransactionConfirmDialog ───────────────────────── */

export interface TransactionConfirmDialogProps {
  open: boolean;
  title: string;
  /** What will happen, in plain words */
  summary: React.ReactNode;
  rows: { label: string; value: React.ReactNode }[];
  gas?: GasEstimateProps;
  onConfirm: () => void;
  onCancel: () => void;
  /** Irreversibility warning (always shown) */
  warning?: string;
}

/**
 * TransactionConfirmDialog
 * Review before signing: plain-language summary, every amount and address,
 * fee, and a clear "cannot be undone" warning. Cancel is focused first.
 */
export function TransactionConfirmDialog({
  open,
  title,
  summary,
  rows,
  gas,
  onConfirm,
  onCancel,
  warning = "Blockchain transactions can’t be reversed once confirmed.",
}: TransactionConfirmDialogProps) {
  const id = useId();
  const cancel = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement as HTMLElement | null;
    cancel.current?.focus();
    return () => opener.current?.focus?.();
  }, [open]);
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "grid",
        placeItems: "center",
        background: "rgba(20,14,8,0.6)",
      }}
    >
      <div
        ref={box}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-d`}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
          if (e.key !== "Tab" || !box.current) return;
          const f = Array.from(box.current.querySelectorAll<HTMLElement>("button, a[href]"));
          const first = f[0];
          const last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }}
        style={{
          width: 440,
          maxWidth: "calc(100vw - 32px)",
          padding: spacingTokens.lg,
          borderRadius: 16,
          background: colorTokens.background.primary,
          boxShadow: colorTokens.shadow.xl,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.md,
        }}
      >
        <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>
          {title}
        </h2>
        <div
          id={`${id}-d`}
          style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
        >
          <div>{summary}</div>
          <p
            style={{
              margin: 0,
              padding: spacingTokens.sm,
              borderRadius: 8,
              background: colorTokens.semantic.warning.bg,
              color: colorTokens.semantic.warning.text,
              fontWeight: 600,
            }}
          >
            <span aria-hidden="true">⚠ </span>
            {warning}
          </p>
        </div>
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "4px 12px",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {rows.map((r) => (
            <React.Fragment key={r.label}>
              <dt style={{ color: colorTokens.text.secondary }}>{r.label}</dt>
              <dd style={{ margin: 0, wordBreak: "break-all" }}>{r.value}</dd>
            </React.Fragment>
          ))}
        </dl>
        {gas && <GasEstimate {...gas} />}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button ref={cancel} type="button" onClick={onCancel} style={btn()}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} style={btn(true)}>
            Confirm in wallet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── DistributionEventLog ───────────────────────── */

export interface DistributionEvent {
  id: string;
  date: string;
  /** e.g. "Q3 OTT revenue" */
  source: string;
  /** Pool distributed (₹) */
  total: number;
  /** Recipients count */
  recipients: number;
  /** Your share (₹) */
  yourShare?: number;
  txHash?: string;
  explorerHref?: string;
}

/** Revenue distribution history as a table, newest first. */
export function DistributionEventLog({
  events,
  label = "Distributions",
}: {
  events: DistributionEvent[];
  label?: string;
}) {
  const td: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
    textAlign: "left",
  };
  const sum = events.reduce((s, e) => s + (e.yourShare ?? 0), 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sum > 0 && (
        <p style={{ margin: 0 }}>
          You have received <strong>{inrShort(sum)}</strong> across {events.length} distributions.
        </p>
      )}
      <div role="region" aria-label={label} tabIndex={0} style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 600,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <thead>
            <tr style={{ background: colorTokens.background.secondary }}>
              {["Date", "Source", "Pool", "Recipients", "Your share", "Transaction"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  style={{
                    ...td,
                    borderBottom: `2px solid ${colorTokens.border.primary}`,
                    textAlign: ["Pool", "Recipients", "Your share"].includes(h) ? "right" : "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td style={td}>{e.date}</td>
                <th scope="row" style={{ ...td, fontWeight: 500 }}>
                  {e.source}
                </th>
                <td style={{ ...td, textAlign: "right" }}>{inrShort(e.total)}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  {e.recipients.toLocaleString("en-IN")}
                </td>
                <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>
                  {e.yourShare != null ? inrShort(e.yourShare) : "—"}
                </td>
                <td style={{ ...td, fontFamily: mono }}>
                  {e.txHash ? (
                    e.explorerHref ? (
                      <a
                        href={e.explorerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colorTokens.interactive.primary }}
                      >
                        {shortAddress(e.txHash, 8, 4)}{" "}
                        <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
                      </a>
                    ) : (
                      shortAddress(e.txHash, 8, 4)
                    )
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────── ContractStatusBadge ───────────────────────── */

export type ContractBadgeState =
  "draft" | "audited" | "deployed" | "paused" | "upgraded" | "failed";

/** Compact smart-contract state badge with symbol + word. */
export function ContractStatusBadge({ state }: { state: ContractBadgeState }) {
  const m: Record<ContractBadgeState, [string, string, string, string]> = {
    draft: ["Draft", "○", colorTokens.background.tertiary, colorTokens.text.primary],
    audited: ["Audited", "◆", colorTokens.semantic.info.bg, colorTokens.semantic.info.text],
    deployed: ["Deployed", "●", colorTokens.semantic.success.bg, colorTokens.semantic.success.text],
    paused: ["Paused", "❚❚", colorTokens.semantic.warning.bg, colorTokens.semantic.warning.text],
    upgraded: ["Upgraded", "↑", colorTokens.semantic.info.bg, colorTokens.semantic.info.text],
    failed: ["Failed", "✕", colorTokens.semantic.error.bg, colorTokens.semantic.error.text],
  };
  const [w, sym, bg, fg] = m[state];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span aria-hidden="true">{sym}</span>
      Contract {w.toLowerCase()}
    </span>
  );
}
