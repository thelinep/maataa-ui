/**
 * @maataa/ui/forms/ContactBlocks
 * ContactForm and NewsletterSignup
 */

import React, { useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle } from "./fieldKit";

const primary: React.CSSProperties = {
  minHeight: 48,
  padding: "0 22px",
  borderRadius: 10,
  border: 0,
  background: colorTokens.interactive.primary,
  color: colorTokens.text.inverse,
  font: "inherit",
  fontWeight: 700,
  cursor: "pointer",
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactFormProps {
  topics?: string[];
  onSubmit: (v: ContactValues) => Promise<void> | void;
  title?: string;
}

/**
 * ContactForm
 * Errors are listed in a summary that gets focus, each linking to its field;
 * success replaces the form with a confirmation that gets focus.
 */
export function ContactForm({
  topics = ["General", "Production enquiry", "Press", "Partnership"],
  onSubmit,
  title = "Contact us",
}: ContactFormProps) {
  const id = useId();
  const [v, setV] = useState<ContactValues>({
    name: "",
    email: "",
    topic: topics[0] ?? "",
    message: "",
  });
  const [err, setErr] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const summary = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const set =
    (k: keyof ContactValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setV({ ...v, [k]: e.target.value });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const x: typeof err = {};
    if (!v.name.trim()) x.name = "Enter your name";
    if (!emailOk(v.email)) x.email = "Enter an email address like name@example.com";
    if (v.message.trim().length < 10) x.message = "Write a message of at least 10 characters";
    setErr(x);
    if (Object.keys(x).length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setState("sending");
    try {
      await onSubmit(v);
      setState("sent");
      requestAnimationFrame(() => done.current?.focus());
    } catch {
      setState("failed");
    }
  };
  if (state === "sent") {
    return (
      <div
        ref={done}
        tabIndex={-1}
        role="status"
        style={{
          padding: spacingTokens.lg,
          borderRadius: 12,
          background: colorTokens.semantic.success.bg,
          color: colorTokens.semantic.success.text,
        }}
      >
        <strong>Thanks, {v.name.split(" ")[0]}.</strong> We’ve got your message and will reply to{" "}
        {v.email} within two working days.
      </div>
    );
  }
  const keys = Object.keys(err) as (keyof ContactValues)[];
  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 560 }}
    >
      <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize["2xl"] }}>
        {title}
      </h2>
      {keys.length > 0 && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          style={{
            padding: spacingTokens.md,
            borderRadius: 10,
            border: `3px solid ${colorTokens.interactive.error}`,
            background: colorTokens.background.primary,
          }}
        >
          <strong>
            There {keys.length === 1 ? "is a problem" : `are ${keys.length} problems`}
          </strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
            {keys.map((k) => (
              <li key={k}>
                <a href={`#${id}-${k}`} style={{ color: colorTokens.interactive.error }}>
                  {err[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <FieldFrame label="Name" error={err.name} id={`${id}-name`}>
        {(f) => (
          <input
            id={f.id}
            value={v.name}
            onChange={set("name")}
            autoComplete="name"
            aria-invalid={err.name ? true : undefined}
            aria-describedby={f.describedBy}
            style={controlStyle(!!err.name)}
          />
        )}
      </FieldFrame>
      <FieldFrame label="Email" error={err.email} id={`${id}-email`}>
        {(f) => (
          <input
            id={f.id}
            type="email"
            value={v.email}
            onChange={set("email")}
            autoComplete="email"
            inputMode="email"
            aria-invalid={err.email ? true : undefined}
            aria-describedby={f.describedBy}
            style={controlStyle(!!err.email)}
          />
        )}
      </FieldFrame>
      <FieldFrame label="Topic" id={`${id}-topic`}>
        {(f) => (
          <select
            id={f.id}
            value={v.topic}
            onChange={set("topic")}
            style={{ ...controlStyle(false), accentColor: colorTokens.interactive.primary }}
          >
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}
      </FieldFrame>
      <FieldFrame label="Message" error={err.message} id={`${id}-message`}>
        {(f) => (
          <textarea
            id={f.id}
            rows={5}
            value={v.message}
            onChange={set("message")}
            aria-invalid={err.message ? true : undefined}
            aria-describedby={f.describedBy}
            style={{ ...controlStyle(!!err.message), resize: "vertical", fontFamily: "inherit" }}
          />
        )}
      </FieldFrame>
      {state === "failed" && (
        <p role="alert" style={{ margin: 0, color: colorTokens.interactive.error }}>
          Your message wasn’t sent. Check your connection and try again — nothing you typed has been
          lost.
        </p>
      )}
      <div>
        <button
          type="submit"
          style={primary}
          disabled={state === "sending"}
          aria-busy={state === "sending" || undefined}
        >
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

export interface NewsletterSignupProps {
  onSubscribe: (email: string) => Promise<void> | void;
  title?: string;
  blurb?: React.ReactNode;
  /** e.g. "Fortnightly. Unsubscribe any time." */
  frequency?: string;
}

/**
 * NewsletterSignup
 * One labelled email field and a button; consent wording is visible; the
 * result (or error) is announced and focusable.
 */
export function NewsletterSignup({
  onSubscribe,
  title = "Get production news",
  blurb,
  frequency = "Fortnightly. Unsubscribe any time.",
}: NewsletterSignupProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) {
      setErr("Enter an email address like name@example.com");
      return;
    }
    setErr("");
    setState("busy");
    try {
      await onSubscribe(email.trim());
      setState("done");
    } catch {
      setState("idle");
      setErr("We couldn’t subscribe you just now. Try again in a minute.");
    }
  };
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.lg,
        borderRadius: 16,
        background: colorTokens.background.tertiary,
      }}
    >
      <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>
        {title}
      </h2>
      {blurb && <div style={{ color: colorTokens.text.secondary }}>{blurb}</div>}
      {state === "done" ? (
        <p
          role="status"
          style={{ margin: 0, fontWeight: 700, color: colorTokens.interactive.success }}
        >
          Check {email} — we’ve sent a link to confirm your subscription.
        </p>
      ) : (
        <form
          noValidate
          onSubmit={submit}
          style={{
            display: "flex",
            gap: spacingTokens.xs,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <FieldFrame
            label="Email address"
            hint={frequency}
            error={err}
            style={{ flex: 1, minWidth: 220 }}
          >
            {(f) => (
              <input
                id={f.id}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={err ? true : undefined}
                aria-describedby={f.describedBy}
                style={controlStyle(!!err)}
              />
            )}
          </FieldFrame>
          <button type="submit" style={primary} disabled={state === "busy"}>
            {state === "busy" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
    </section>
  );
}
