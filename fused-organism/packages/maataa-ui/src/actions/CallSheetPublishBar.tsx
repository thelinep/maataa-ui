/**
 * @maataa/ui/actions/CallSheetPublishBar
 * Publish, withdraw and reissue a call sheet
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { Modal } from "../surfaces/Modal";
import { StateBadge, publicationStates } from "../status/StateBadge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface CallSheetPublishBarProps {
  state: "draft" | "published" | "withdrawn";
  version: number;
  recipientCount: number;
  publishedAt?: Date;
  onPublish: () => void;
  /** Called with the reason recipients will see */
  onWithdraw: (reason: string) => void;
  /** Called with what changed, sent to recipients */
  onReissue: (changes: string) => void;
  /** Problems that block publishing, e.g. "No hospital listed" */
  blockers?: string[];
  busy?: boolean;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * CallSheetPublishBar
 * Shows the state and version. Withdraw and Reissue ask for a short
 * message, because the crew receive it. Publish is blocked, with the
 * reasons listed, until required details are filled in.
 */
export function CallSheetPublishBar({
  state,
  version,
  recipientCount,
  publishedAt,
  onPublish,
  onWithdraw,
  onReissue,
  blockers = [],
  busy,
  locale: localeProp,
}: CallSheetPublishBarProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const id = useId();
  const [dialog, setDialog] = useState<null | "withdraw" | "reissue">(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const close = () => {
    setDialog(null);
    setText("");
    setErr("");
  };
  const submit = () => {
    if (text.trim().length < 5)
      return setErr(
        dialog === "withdraw"
          ? t("Tell the crew why (they'll see this)")
          : t("Say what changed (the crew will see this)")
      );
    if (dialog === "withdraw") onWithdraw(text.trim());
    else onReissue(text.trim());
    close();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.sm,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        background: colorTokens.background.secondary,
      }}
    >
      <div
        style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center", flexWrap: "wrap" }}
      >
        <StateBadge state={state} states={publicationStates} prefix="Call sheet" />
        <span style={{ fontSize: typographyTokens.fontSize.sm }}>
          {[
            t("Version {version}", { version }),
            publishedAt && state === "published"
              ? t("sent {date}", {
                  date: publishedAt.toLocaleString(locale, {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                })
              : null,
            t.plural(recipientCount, "{count} recipient", "{count} recipients"),
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
        <span style={{ flex: 1 }} />
        {state !== "published" && (
          <Button
            onClick={onPublish}
            disabled={busy || blockers.length > 0 || recipientCount === 0}
            aria-describedby={blockers.length ? `${id}-blockers` : undefined}
          >
            {state === "withdrawn" ? t("Publish again") : t("Publish and send")}
          </Button>
        )}
        {state === "published" && (
          <>
            <Button variant="secondary" onClick={() => setDialog("reissue")} disabled={busy}>
              {t("Reissue with changes")}
            </Button>
            <Button variant="danger" onClick={() => setDialog("withdraw")} disabled={busy}>
              {t("Withdraw")}
            </Button>
          </>
        )}
      </div>
      {blockers.length > 0 && state !== "published" && (
        <ul
          id={`${id}-blockers`}
          style={{
            margin: 0,
            paddingLeft: spacingTokens.lg,
            color: colorTokens.interactive.error,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={dialog !== null}
        onClose={close}
        size="sm"
        closeButton={false}
        title={
          dialog === "withdraw"
            ? t("Withdraw this call sheet?")
            : t("Reissue as version {version}?", { version: version + 1 })
        }
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: spacingTokens.sm }}>
            <Button variant="secondary" onClick={close}>
              {t("Cancel")}
            </Button>
            <Button variant={dialog === "withdraw" ? "danger" : "primary"} onClick={submit}>
              {dialog === "withdraw" ? t("Withdraw and notify") : t("Reissue and notify")}
            </Button>
          </div>
        }
      >
        <label style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          {dialog === "withdraw" ? t("Message to the crew") : t("What changed")}
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? `${id}-err` : undefined}
            style={{
              padding: spacingTokens.sm,
              border: `2px solid ${err ? colorTokens.interactive.error : colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
            }}
          />
        </label>
        {err && (
          <div
            id={`${id}-err`}
            role="alert"
            style={{
              color: colorTokens.interactive.error,
              fontSize: typographyTokens.fontSize.sm,
              marginTop: spacingTokens.xs,
            }}
          >
            {err}
          </div>
        )}
      </Modal>
    </div>
  );
}
CallSheetPublishBar.displayName = "CallSheetPublishBar";
