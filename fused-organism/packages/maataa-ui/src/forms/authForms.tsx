/**
 * @maataa/ui/forms/authForms
 * Sign in, sign up, password reset request and confirmation
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Input } from "../primitives/Input";
import { Button } from "../primitives/Button";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { PasswordInput, defaultPasswordRules, type PasswordRule } from "./PasswordInput";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const col: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: spacingTokens.md,
  maxWidth: 420,
};
const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: colorTokens.interactive.primary,
  textDecoration: "underline",
  cursor: "pointer",
  font: "inherit",
  alignSelf: "flex-start",
};

/* ---------- Sign in ---------- */

export interface SignInValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignInFormProps {
  onSubmit: (values: SignInValues) => void;
  /** Server error, e.g. "That email and password don't match." */
  error?: string;
  busy?: boolean;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  /** Extra content under the form, e.g. ProviderSignInButtons */
  children?: React.ReactNode;
}

/**
 * SignInForm
 * Email and password with autocomplete hints, Show password, and an error
 * summary. Server errors never say which field was wrong.
 */
export function SignInForm({
  onSubmit,
  error,
  busy,
  onForgotPassword,
  onCreateAccount,
  children,
}: SignInFormProps) {
  const t = useT();
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FormError[]>([]);
  const fieldErr = (fid: string) => errors.find((e) => e.fieldId === fid)?.message;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FormError[] = [];
    if (!EMAIL.test(email.trim()))
      errs.push({
        fieldId: `${id}-email`,
        message: msg("Enter your email address, like name@example.com"),
      });
    if (!password) errs.push({ fieldId: `${id}-password`, message: msg("Enter your password") });
    setErrors(errs);
    if (!errs.length) onSubmit({ email: email.trim(), password, remember });
  };
  return (
    <form noValidate onSubmit={submit} aria-label={t("Sign in")} style={col}>
      <ErrorSummary
        errors={error ? [...errors, { fieldId: `${id}-email`, message: error }] : errors}
      />
      <Input
        id={`${id}-email`}
        label={t("Email")}
        type="email"
        autoComplete="username"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErr(`${id}-email`)}
      />
      <PasswordInput
        id={`${id}-password`}
        label={t("Password")}
        value={password}
        onChange={setPassword}
        error={fieldErr(`${id}-password`)}
      />
      {onForgotPassword && (
        <button type="button" onClick={onForgotPassword} style={linkBtn}>
          {t("Forgot your password?")}
        </button>
      )}
      <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          style={{ accentColor: colorTokens.interactive.primary }}
        />
        {t("Keep me signed in on this device")}
      </label>
      <Button type="submit" disabled={busy} aria-busy={busy || undefined}>
        {busy ? t("Signing in…") : t("Sign in")}
      </Button>
      {children}
      {onCreateAccount && (
        <p style={{ margin: 0 }}>
          {t("New to maataa? ")}
          <button type="button" onClick={onCreateAccount} style={linkBtn}>
            {t("Create an account")}
          </button>
        </p>
      )}
    </form>
  );
}
SignInForm.displayName = "SignInForm";

/* ---------- Sign up ---------- */

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
}

export interface SignUpFormProps {
  onSubmit: (values: SignUpValues) => void;
  error?: string;
  busy?: boolean;
  /** Link to terms; required checkbox when given */
  termsHref?: string;
  privacyHref?: string;
  rules?: PasswordRule[];
  onSignIn?: () => void;
}

/** SignUpForm: name, email, new password with live rules, terms consent. */
export function SignUpForm({
  onSubmit,
  error,
  busy,
  termsHref,
  privacyHref,
  rules = defaultPasswordRules,
  onSignIn,
}: SignUpFormProps) {
  const t = useT();
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const fieldErr = (fid: string) => errors.find((e) => e.fieldId === fid)?.message;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FormError[] = [];
    if (!name.trim()) errs.push({ fieldId: `${id}-name`, message: msg("Enter your name") });
    if (!EMAIL.test(email.trim()))
      errs.push({
        fieldId: `${id}-email`,
        message: msg("Enter your email address, like name@example.com"),
      });
    const failed = rules.filter((r) => !r.test(password));
    if (failed.length)
      errs.push({
        fieldId: `${id}-password`,
        message: `Password: ${failed.map((r) => r.label.toLowerCase()).join(", ")}`,
      });
    if (termsHref && !agreed)
      errs.push({ fieldId: `${id}-terms`, message: msg("Agree to the terms to continue") });
    setErrors(errs);
    if (!errs.length) onSubmit({ name: name.trim(), email: email.trim(), password });
  };
  return (
    <form noValidate onSubmit={submit} aria-label={t("Create an account")} style={col}>
      <ErrorSummary
        errors={error ? [...errors, { fieldId: `${id}-email`, message: error }] : errors}
      />
      <Input
        id={`${id}-name`}
        label={t("Full name")}
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErr(`${id}-name`)}
        helperText={t("As you'd like it in credits")}
      />
      <Input
        id={`${id}-email`}
        label={t("Email")}
        type="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErr(`${id}-email`)}
      />
      <PasswordInput
        id={`${id}-password`}
        label={t("Create a password")}
        value={password}
        onChange={setPassword}
        rules={rules}
        autoComplete="new-password"
        error={fieldErr(`${id}-password`)}
      />
      {termsHref && (
        <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }}>
          <input
            id={`${id}-terms`}
            type="checkbox"
            style={{ accentColor: colorTokens.interactive.primary }}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            aria-invalid={fieldErr(`${id}-terms`) ? true : undefined}
          />
          <span>
            {t("I agree to the ")}
            <a href={termsHref} style={{ color: colorTokens.interactive.primary }}>
              {t("terms of use")}
            </a>
            {privacyHref && (
              <>
                {" "}
                and{" "}
                <a href={privacyHref} style={{ color: colorTokens.interactive.primary }}>
                  {t("privacy notice")}
                </a>
              </>
            )}
          </span>
        </label>
      )}
      <Button type="submit" disabled={busy} aria-busy={busy || undefined}>
        {busy ? t("Creating account…") : t("Create account")}
      </Button>
      {onSignIn && (
        <p style={{ margin: 0 }}>
          {t("Already have an account? ")}
          <button type="button" onClick={onSignIn} style={linkBtn}>
            {t("Sign in")}
          </button>
        </p>
      )}
    </form>
  );
}
SignUpForm.displayName = "SignUpForm";

/* ---------- Password reset request ---------- */

export interface PasswordResetRequestFormProps {
  onSubmit: (email: string) => void;
  /** Set after submit: shows the neutral "check your email" message */
  sent?: boolean;
  busy?: boolean;
  onBack?: () => void;
}

/**
 * PasswordResetRequestForm
 * After sending, the message is the same whether or not the account exists,
 * so it can't be used to find out who has an account.
 */
export function PasswordResetRequestForm({
  onSubmit,
  sent,
  busy,
  onBack,
}: PasswordResetRequestFormProps) {
  const t = useT();
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  if (sent) {
    return (
      <div role="status" style={col}>
        <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>
          {t("Check your email")}
        </h2>
        <p style={{ margin: 0 }}>
          {t(
            "If an account uses {value}, we’ve sent a link to reset the password. It works for 30 minutes.",
            { value: email || "that address" }
          )}
        </p>
        {onBack && (
          <button type="button" onClick={onBack} style={linkBtn}>
            {t("Back to sign in")}
          </button>
        )}
      </div>
    );
  }
  return (
    <form
      noValidate
      aria-label={t("Reset your password")}
      style={col}
      onSubmit={(e) => {
        e.preventDefault();
        if (!EMAIL.test(email.trim()))
          return setError("Enter your email address, like name@example.com");
        setError(undefined);
        onSubmit(email.trim());
      }}
    >
      <p style={{ margin: 0 }}>
        {t("Enter the email you sign in with. We’ll send a link to choose a new password.")}
      </p>
      <Input
        id={`${id}-email`}
        label={t("Email")}
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button type="submit" disabled={busy}>
        {t("Send reset link")}
      </Button>
      {onBack && (
        <button type="button" onClick={onBack} style={linkBtn}>
          {t("Back to sign in")}
        </button>
      )}
    </form>
  );
}
PasswordResetRequestForm.displayName = "PasswordResetRequestForm";

/* ---------- Password reset confirmation ---------- */

export interface PasswordResetConfirmFormProps {
  onSubmit: (password: string) => void;
  /** The link has expired or was used */
  expired?: boolean;
  onRequestNewLink?: () => void;
  busy?: boolean;
  rules?: PasswordRule[];
}

/** PasswordResetConfirmForm: new password twice, with an expired-link state. */
export function PasswordResetConfirmForm({
  onSubmit,
  expired,
  onRequestNewLink,
  busy,
  rules = defaultPasswordRules,
}: PasswordResetConfirmFormProps) {
  const t = useT();
  const id = useId();
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [errors, setErrors] = useState<FormError[]>([]);
  if (expired) {
    return (
      <div role="alert" style={col}>
        <strong>{t("This reset link has expired")}</strong>
        <p style={{ margin: 0 }}>
          {t("Links work once, for 30 minutes. Ask for a new one and use the latest email.")}
        </p>
        {onRequestNewLink && <Button onClick={onRequestNewLink}>{t("Send a new link")}</Button>}
      </div>
    );
  }
  const fieldErr = (fid: string) => errors.find((e) => e.fieldId === fid)?.message;
  return (
    <form
      noValidate
      aria-label={t("Choose a new password")}
      style={col}
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        const failed = rules.filter((r) => !r.test(pw));
        if (failed.length)
          errs.push({
            fieldId: `${id}-pw`,
            message: `Password: ${failed.map((r) => r.label.toLowerCase()).join(", ")}`,
          });
        else if (pw !== again)
          errs.push({ fieldId: `${id}-again`, message: msg("The two passwords don't match") });
        setErrors(errs);
        if (!errs.length) onSubmit(pw);
      }}
    >
      <ErrorSummary errors={errors} />
      <PasswordInput
        id={`${id}-pw`}
        label={t("New password")}
        value={pw}
        onChange={setPw}
        rules={rules}
        autoComplete="new-password"
        error={fieldErr(`${id}-pw`)}
      />
      <PasswordInput
        id={`${id}-again`}
        label={t("Type it again")}
        value={again}
        onChange={setAgain}
        autoComplete="new-password"
        error={fieldErr(`${id}-again`)}
      />
      <Button type="submit" disabled={busy}>
        {t("Save new password")}
      </Button>
    </form>
  );
}
PasswordResetConfirmForm.displayName = "PasswordResetConfirmForm";
