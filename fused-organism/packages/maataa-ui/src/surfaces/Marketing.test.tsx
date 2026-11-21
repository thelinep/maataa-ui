import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Hero,
  FeatureGrid,
  TestimonialCarousel,
  LogoStrip,
  StatsStrip,
  PricingCardRow,
  PricingTable,
  FAQAccordion,
  AnnouncementStrip,
  CookieConsentBanner,
} from "./Marketing";

describe("Marketing", () => {
  it("hero has one h1 and CTA pair", () => {
    render(
      <Hero
        title="Make films together"
        subtitle="Plan, shoot and deliver."
        primary={{ label: "Start free", href: "/signup" }}
        secondary={{ label: "See how", href: "#how" }}
      />
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Make films together" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start free" })).toHaveAttribute("href", "/signup");
  });

  it("features, logos and stats are lists", () => {
    render(
      <>
        <FeatureGrid
          title="Why maataa"
          features={[
            { title: "Call sheets", description: "Publish in minutes." },
            { title: "Budgets", description: "Track every rupee." },
          ]}
        />
        <LogoStrip logos={[{ name: "Studio Nine" }]} />
        <StatsStrip stats={[{ value: "1,200", label: "Productions" }]} />
      </>
    );
    expect(screen.getByRole("heading", { level: 3, name: "Budgets" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Trusted by" })).toBeInTheDocument();
    expect(screen.getByRole("definition")).toHaveTextContent("1,200");
  });

  it("carousel moves and says position", async () => {
    render(
      <TestimonialCarousel
        items={[
          { quote: "Saved us a week.", name: "Asha" },
          { quote: "Finally, one place.", name: "Imran", rating: 5 },
        ]}
      />
    );
    expect(screen.getByRole("region", { name: "What people say" })).toHaveAttribute(
      "aria-roledescription",
      "carousel"
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("group", { name: "2 of 2" })).toHaveTextContent("Finally, one place.");
    expect(screen.getByText("Rated 5 out of 5")).toBeInTheDocument();
  });

  it("pricing table reads included/not included", async () => {
    const pick = vi.fn();
    render(
      <>
        <PricingTable
          plans={[
            { name: "Solo", price: "Free", ctaLabel: "Start", onSelect: pick },
            {
              name: "Studio",
              price: "₹4,999",
              ctaLabel: "Start",
              onSelect: pick,
              highlighted: true,
            },
          ]}
          rows={[
            { feature: "Call sheets", group: "Production", values: [true, true] },
            { feature: "Distribution", values: [false, true] },
          ]}
        />
        <PricingCardRow
          tiers={[
            { name: "Solo", price: "Free", ctaLabel: "Choose", onSelect: pick, features: [] },
          ]}
          billing="monthly"
          onBillingChange={() => {}}
        />
      </>
    );
    expect(screen.getByRole("table", { name: "Compare plans" })).toBeInTheDocument();
    expect(screen.getAllByText("Not included")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Start: Studio" }));
    expect(pick).toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Monthly" })).toBeChecked();
  });

  it("FAQ expands all; announcement dismisses; cookie choices are equal", async () => {
    const dismiss = vi.fn();
    const save = vi.fn();
    render(
      <>
        <FAQAccordion items={[{ q: "Is it free?", a: "For one project." }]} />
        <AnnouncementStrip href="/new" onDismiss={dismiss}>
          New: ISL help
        </AnnouncementStrip>
        <CookieConsentBanner onSave={save} />
      </>
    );
    await userEvent.click(screen.getByRole("button", { name: "Expand all" }));
    expect(screen.getByText("Is it free?").closest("details")).toHaveAttribute("open");
    await userEvent.click(screen.getByRole("button", { name: "Dismiss announcement" }));
    expect(dismiss).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Choose" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /Analytics/ }));
    await userEvent.click(screen.getByRole("button", { name: "Save my choices" }));
    expect(save).toHaveBeenCalledWith({ necessary: true, analytics: true, marketing: false });
  });
});
