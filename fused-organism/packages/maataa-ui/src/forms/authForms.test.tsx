import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SignInForm,
  SignUpForm,
  PasswordResetRequestForm,
  PasswordResetConfirmForm,
} from "./authForms";

describe("SignInForm", () => {
  it("validates, then submits", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<SignInForm onSubmit={onSubmit} onForgotPassword={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("There is a problem");
    expect(screen.getAllByRole("alert")[0]).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText("Email"), "asha@vesahe.in");
    await user.type(screen.getByLabelText("Password"), "secret-pass");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(onSubmit).toHaveBeenCalledWith({
      email: "asha@vesahe.in",
      password: "secret-pass",
      remember: true,
    });
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "username");
  });
});

describe("SignUpForm", () => {
  it("requires terms and a strong enough password", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<SignUpForm onSubmit={onSubmit} termsHref="/terms" />);
    await user.type(screen.getByLabelText(/Full name/), "Asha Rao");
    await user.type(screen.getByLabelText("Email"), "asha@vesahe.in");
    await user.type(screen.getByLabelText("Create a password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(/at least 12 characters/);
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(/Agree to the terms/);
    await user.type(screen.getByLabelText("Create a password"), " but now long");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe("Password reset", () => {
  it("request shows a neutral confirmation", () => {
    render(<PasswordResetRequestForm onSubmit={() => {}} sent />);
    expect(screen.getByRole("status")).toHaveTextContent("If an account uses");
  });
  it("confirm checks the two passwords match", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<PasswordResetConfirmForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("New password"), "a long passphrase");
    await user.type(screen.getByLabelText("Type it again"), "a long passphrasE");
    await user.click(screen.getByRole("button", { name: "Save new password" }));
    expect(screen.getByRole("alert")).toHaveTextContent("don't match");
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("confirm explains an expired link", () => {
    render(<PasswordResetConfirmForm onSubmit={() => {}} expired onRequestNewLink={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("expired");
  });
});
