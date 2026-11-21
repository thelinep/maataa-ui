import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ImageCard,
  ProfileCard,
  PricingTierCard,
  ServiceCard,
  InsetCard,
  GlassPanel,
  CompareGrid,
  PreviewFrame,
  FullScreenModal,
} from "./Containers";

const meta = { title: "Surfaces/Containers", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const Cards: Story = {
  render: () => (
    <CompareGrid columns={2}>
      <ImageCard
        title="Monsoon Wedding"
        imageAlt=""
        eyebrow="Feature · Drama"
        description="A wedding planner has four days to save a family."
        meta="Shooting Dec 2026 · Delhi"
        href="#"
      />
      <ProfileCard
        name="Asha Verma"
        role="Director"
        location="Delhi"
        availability="Available from 4 Dec"
        facts={[
          { label: "Credits", value: "3 features, 12 shorts" },
          { label: "Languages", value: "Hindi, English" },
        ]}
        tags={["Drama", "Documentary"]}
        href="#"
      />
      <ServiceCard
        title="Colour grade — feature"
        icon="🎨"
        description="Full DI grade with two review sessions."
        includes={["Look development", "HDR and SDR passes", "Two client sessions"]}
        price="₹2,50,000"
        turnaround="3 weeks"
      />
      <InsetCard title="Inside a card" tone="info">
        An inset card uses a recessed fill instead of another shadow.
      </InsetCard>
    </CompareGrid>
  ),
};

export const Pricing: Story = {
  render: () => (
    <CompareGrid columns={3}>
      <PricingTierCard
        name="Solo"
        price="Free"
        ctaLabel="Choose"
        onSelect={noop}
        current
        features={[
          { label: "1 project", included: true },
          { label: "Call sheets", included: true },
          { label: "Distribution tools", included: false },
        ]}
      />
      <PricingTierCard
        name="Studio"
        price="₹4,999"
        period="per month"
        badge="Most popular"
        highlighted
        ctaLabel="Choose"
        onSelect={noop}
        features={[
          { label: "10 projects", included: true },
          { label: "Call sheets", included: true },
          { label: "Distribution tools", included: true },
        ]}
      />
      <PricingTierCard
        name="Network"
        price="₹14,999"
        period="per month"
        ctaLabel="Choose"
        onSelect={noop}
        features={[
          { label: "Unlimited projects", included: true },
          { label: "Call sheets", included: true },
          { label: "Distribution tools", included: true },
        ]}
      />
    </CompareGrid>
  ),
};

export const Glass: Story = {
  render: () => (
    <div
      style={{
        padding: 32,
        borderRadius: 16,
        background: "linear-gradient(135deg, #1E3A5F, #806641 55%, #F5D547)",
      }}
    >
      <GlassPanel style={{ maxWidth: 360 }}>
        <strong>Day 12 of 24</strong>
        <p style={{ margin: "6px 0 0" }}>Ext. Rooftop — magic hour at 17:42. Call time 15:30.</p>
      </GlassPanel>
    </div>
  ),
};

export const Preview: Story = {
  render: () => (
    <PreviewFrame title="Call-time badge" code={'<CallTimeBadge time="05:30" />'}>
      <p style={{ margin: 0, padding: 16 }}>Preview content</p>
    </PreviewFrame>
  ),
};

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ minHeight: 44, padding: "0 16px", font: "inherit" }}
      >
        Open full-screen editor
      </button>
      <FullScreenModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Edit scene 4"
        actions={<button style={{ minHeight: 44, font: "inherit" }}>Save</button>}
      >
        <p>Scene text goes here.</p>
      </FullScreenModal>
    </>
  );
}
export const FullScreen: Story = { render: () => <ModalDemo /> };
