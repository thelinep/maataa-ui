import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm, NewsletterSignup } from "./ContactBlocks";

describe("ContactBlocks", () => {
  it("contact form summarises errors, then confirms", async () => {
    const user = userEvent.setup();
    const send = vi.fn();
    render(<ContactForm onSubmit={send} />);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByRole("alert")).toHaveTextContent("There are 3 problems");
    expect(screen.getByRole("link", { name: "Enter your name" })).toHaveAttribute(
      "href",
      expect.stringMatching(/-name$/)
    );
    await user.type(screen.getByLabelText("Name"), "Asha Verma");
    await user.type(screen.getByLabelText("Email"), "asha@example.com");
    await user.type(screen.getByLabelText("Message"), "We’d like a demo for our team.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/Thanks, Asha./)).toBeInTheDocument();
    expect(send).toHaveBeenCalled();
  });

  it("newsletter validates and confirms", async () => {
    const user = userEvent.setup();
    render(<NewsletterSignup onSubscribe={async () => {}} />);
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription(
      /Enter an email address/
    );
    await user.type(screen.getByLabelText("Email address"), "a@b.in");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Check a@b.in");
  });
});
