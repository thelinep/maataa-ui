import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Hero,
  FeatureGrid,
  TestimonialCarousel,
  TestimonialCard,
  LogoStrip,
  StatsStrip,
  PricingCardRow,
  PricingTable,
  FAQAccordion,
  AnnouncementStrip,
  CookieConsentBanner,
} from "./Marketing";

const meta = { title: "Surfaces/Marketing", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const noop = () => {};

export const Heroes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <AnnouncementStrip href="#" onDismiss={noop}>
        New: Indian Sign Language help on every page
      </AnnouncementStrip>
      <Hero
        eyebrow="For independent film"
        title="From first idea to final cut"
        subtitle="Plan, shoot and deliver your film with one crew space — in Hindi, English and more."
        primary={{ label: "Start free", href: "#" }}
        secondary={{ label: "Watch the tour", href: "#" }}
      />
      <Hero
        variant="split"
        title="Call sheets in minutes"
        subtitle="Build, publish and track who has read them."
        primary={{ label: "Try it", href: "#" }}
        imageAlt=""
      />
    </div>
  ),
};

export const Sections: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <FeatureGrid
        title="Everything a production needs"
        intro="One place for the whole crew."
        features={[
          {
            title: "Call sheets",
            icon: "📋",
            description: "Scene by scene, published to everyone.",
          },
          { title: "Budgets", icon: "₹", description: "Versions, actuals and overruns flagged." },
          {
            title: "Storyboards",
            icon: "✏️",
            description: "Draw frames with shot types and angles.",
          },
          { title: "Casting", icon: "🎭", description: "From open call to offer letter." },
          {
            title: "Distribution",
            icon: "🌏",
            description: "Territories, windows and deliveries.",
          },
          {
            title: "Accessible",
            icon: "♿",
            description: "Screen readers, ISL and simple mode.",
            points: ["WCAG 2.2 AA", "Hindi and English"],
          },
        ]}
      />
      <LogoStrip
        logos={[
          { name: "Studio Nine" },
          { name: "Lotus Ventures" },
          { name: "Delhi Film Co-op" },
          { name: "NFDC Labs" },
        ]}
      />
      <StatsStrip
        stats={[
          { value: "1,200", label: "Productions" },
          { value: "18k", label: "Crew members" },
          { value: "42", label: "Cities" },
          { value: "4.8/5", label: "Average rating" },
        ]}
      />
    </div>
  ),
};

export const Testimonials: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <TestimonialCard
        quote="We cut a week of prep by having the call sheet, budget and schedule in one place."
        name="Asha Verma"
        role="Director, Monsoon Wedding"
        rating={5}
      />
      <TestimonialCarousel
        items={[
          {
            quote: "The ISL help panel meant our Deaf crew could follow every change.",
            name: "Meera Iyer",
            role: "Sound mixer",
          },
          { quote: "Investors loved the evidence pack.", name: "Leela Rao", role: "Producer" },
        ]}
      />
    </div>
  ),
};

function PricingDemo() {
  const [b, setB] = useState<"monthly" | "yearly">("monthly");
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PricingCardRow
        billing={b}
        onBillingChange={setB}
        tiers={[
          {
            name: "Solo",
            price: "Free",
            ctaLabel: "Choose",
            onSelect: noop,
            features: [
              { label: "1 project", included: true },
              { label: "Call sheets", included: true },
              { label: "Distribution", included: false },
            ],
          },
          {
            name: "Studio",
            price: b === "monthly" ? "₹4,999" : "₹49,990",
            period: b === "monthly" ? "per month" : "per year",
            badge: "Most popular",
            highlighted: true,
            ctaLabel: "Choose",
            onSelect: noop,
            features: [
              { label: "10 projects", included: true },
              { label: "Call sheets", included: true },
              { label: "Distribution", included: true },
            ],
          },
        ]}
      />
      <PricingTable
        plans={[
          { name: "Solo", price: "Free", ctaLabel: "Start", onSelect: noop },
          {
            name: "Studio",
            price: "₹4,999",
            period: "per month",
            ctaLabel: "Start",
            onSelect: noop,
            highlighted: true,
          },
          {
            name: "Network",
            price: "₹14,999",
            period: "per month",
            ctaLabel: "Talk to us",
            onSelect: noop,
          },
        ]}
        rows={[
          { feature: "Projects", group: "Production", values: ["1", "10", "Unlimited"] },
          { feature: "Call sheets", values: [true, true, true] },
          { feature: "Budgets with versions", values: [false, true, true] },
          { feature: "Territory matrix", group: "Distribution", values: [false, true, true] },
          { feature: "Evidence packs", values: [false, false, true] },
        ]}
      />
    </div>
  );
}
export const Pricing: Story = { render: () => <PricingDemo /> };

export const FAQAndConsent: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <FAQAccordion
        items={[
          {
            q: "Is it free for students?",
            a: "Yes — one project is free for everyone, and film schools get Studio at no cost.",
          },
          {
            q: "Can my crew use it in Hindi?",
            a: "Yes. The interface, read-aloud and help are in Hindi and English.",
          },
          {
            q: "Where is my data stored?",
            a: "In India (Mumbai region). You can export or delete it at any time.",
          },
        ]}
      />
      <CookieConsentBanner onSave={noop} policyHref="#" />
    </div>
  ),
};
