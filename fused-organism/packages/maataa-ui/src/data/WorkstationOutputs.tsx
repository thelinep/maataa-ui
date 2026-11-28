/**
 * @maataa/ui/data/WorkstationOutputs
 * Opens shot lists and call sheets made in Maataa Workstation (brahmini /
 * nova-console): from its saved outputs, a Maataa Library .json file, or
 * pasted JSON. Shows them with ShotList and CallSheetPrintView, and can
 * start a call sheet from a shot list's scenes.
 */

import React, { useId, useState } from "react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { Button } from "../primitives/Button";
import type { SceneRow } from "../forms/CallSheetEditor";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { CallSheetPrintView } from "./CallSheetPrintView";
import {
  fetchNovaOutputs,
  fromNovaCallSheet,
  fromNovaShotList,
  readNovaOutput,
  sceneRowsFromShotList,
  type NovaOutput,
} from "./nova";
import { ShotList } from "./ShotList";

export interface WorkstationOutputsProps {
  /**
   * Where Maataa Workstation answers, usually a dev-server proxy path such
   * as "/nova". Leave out to hide the Load button (files and paste still work).
   */
  base?: string;
  /** Outputs to show at first */
  initial?: NovaOutput[];
  /** Called with scene rows when someone starts a call sheet from a shot list */
  onStartCallSheet?: (rows: SceneRow[], from: NovaOutput) => void;
  /** For tests: replaces window.fetch */
  fetcher?: typeof fetch;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WorkstationOutputs
 *
 * @example
 * ```tsx
 * <WorkstationOutputs base="/nova" onStartCallSheet={(rows) => setScenes(rows)} />
 * ```
 */
export function WorkstationOutputs({
  base,
  initial = [],
  onStartCallSheet,
  fetcher,
  className,
  style,
}: WorkstationOutputsProps) {
  const t = useT();
  const locale = useLocale();
  const pasteId = useId();
  const fileId = useId();
  const [outputs, setOutputs] = useState<NovaOutput[]>(initial);
  const [current, setCurrent] = useState(0);
  const [paste, setPaste] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const add = (o: NovaOutput) => {
    setOutputs((list) => [o, ...list]);
    setCurrent(0);
    setStatus(
      o.kind === "shotlist"
        ? t("Shot list opened: {title}", { title: o.title ?? "" })
        : t("Call sheet opened: {title}", { title: o.title ?? "" })
    );
  };
  const tryRead = (input: unknown) => {
    setError(null);
    try {
      add(readNovaOutput(input));
      return true;
    } catch (e) {
      setError(
        t(
          e instanceof Error
            ? e.message
            : "This isn't a shot list or call sheet from Maataa Workstation."
        )
      );
      return false;
    }
  };
  const load = async () => {
    if (!base) return;
    setError(null);
    setLoading(true);
    try {
      const list = await fetchNovaOutputs(base, fetcher ?? fetch);
      setOutputs(list);
      setCurrent(0);
      setStatus(
        t.plural(list.length, "{count} saved output loaded.", "{count} saved outputs loaded.")
      );
    } catch (e) {
      setError(
        t(e instanceof Error ? e.message : "Couldn't reach Maataa Workstation. Is it running?")
      );
    } finally {
      setLoading(false);
    }
  };

  const shown = outputs[current];
  const when = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(locale, {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

  return (
    <section
      aria-labelledby={`${pasteId}-title`}
      className={className}
      style={{
        display: "grid",
        gap: spacingTokens.md,
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      <h2 id={`${pasteId}-title`} style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"] }}>
        {t("Shot lists and call sheets from Maataa Workstation")}
      </h2>

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.sm, alignItems: "flex-end" }}
      >
        {base && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => void load()}
            isLoading={loading}
            loadingText={t("Loading…")}
          >
            {t("Load from Maataa Workstation")}
          </Button>
        )}
        <input
          id={fileId}
          type="file"
          accept=".json,application/json"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) tryRead(await f.text());
          }}
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => document.getElementById(fileId)?.click()}
        >
          {t("Open a Maataa Library .json file")}
        </Button>
      </div>

      <details
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: radiusTokens.lg,
          padding: spacingTokens.sm,
        }}
      >
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>{t("Paste JSON")}</summary>
        <div style={{ display: "grid", gap: spacingTokens.sm, marginTop: spacingTokens.sm }}>
          <label htmlFor={pasteId} style={{ fontSize: typographyTokens.fontSize.sm }}>
            {t("The JSON of a shot list or call sheet")}
          </label>
          <textarea
            id={pasteId}
            rows={5}
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            style={{
              fontFamily: typographyTokens.fontFamily.mono,
              fontSize: typographyTokens.fontSize.sm,
              padding: spacingTokens.sm,
              borderRadius: radiusTokens.md,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
            }}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (tryRead(paste)) setPaste("");
            }}
            disabled={!paste.trim()}
          >
            {t("Show it")}
          </Button>
        </div>
      </details>

      {error && (
        <p role="alert" style={{ margin: 0, color: colorTokens.semantic.error.text }}>
          {error}
        </p>
      )}
      <p
        aria-live="polite"
        style={{
          margin: 0,
          minHeight: "1.4em",
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        {status}
      </p>

      {outputs.length > 1 && (
        <ul
          aria-label={t("Opened outputs")}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacingTokens.xs,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {outputs.map((o, i) => (
            <li key={`${o.id ?? o.title}-${i}`}>
              <Button
                size="sm"
                variant={i === current ? "primary" : "secondary"}
                aria-pressed={i === current}
                onClick={() => setCurrent(i)}
              >
                {`${o.kind === "shotlist" ? t("Shot list") : t("Call sheet")}: ${o.title ?? ""}${o.createdAt ? ` · ${when(o.createdAt)}` : ""}`}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!shown ? (
        <p style={{ margin: 0, color: colorTokens.text.secondary }}>
          {t(
            "Nothing open yet. Load the workstation's saved outputs, open a .json file from Maataa Library, or paste JSON."
          )}
        </p>
      ) : shown.kind === "shotlist" ? (
        <div style={{ display: "grid", gap: spacingTokens.sm }}>
          {onStartCallSheet && (
            <div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  onStartCallSheet(sceneRowsFromShotList(shown.data, "", t), shown);
                  setStatus(
                    t.plural(
                      shown.data.scenes.length,
                      "{count} scene sent to the call sheet.",
                      "{count} scenes sent to the call sheet."
                    )
                  );
                }}
              >
                {t("Start a call sheet from these scenes")}
              </Button>
            </div>
          )}
          <ShotList {...fromNovaShotList(shown.data)} />
        </div>
      ) : (
        <CallSheetPrintView {...fromNovaCallSheet(shown.data)} />
      )}
      {shown?.model && (
        <p
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize.xs,
            color: colorTokens.text.tertiary,
          }}
        >
          {t("Drafted by the local model {model}. Check every TBC before sending.", {
            model: shown.model,
          })}
        </p>
      )}
    </section>
  );
}

WorkstationOutputs.displayName = "WorkstationOutputs";
