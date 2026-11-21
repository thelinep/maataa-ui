import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  StickyNavbar,
  HamburgerMenu,
  BottomNav,
  StepDots,
  AnchorNav,
  LoadMoreButton,
} from "./PageNavigation";

const meta = { title: "Navigation/PageNavigation", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/projects", label: "Projects", icon: "🎬", badge: 3 },
  { href: "/people", label: "People", icon: "👥" },
  { href: "/schedule", label: "Schedule", icon: "📅" },
];

function Demo() {
  const [step, setStep] = useState(1);
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 720 }}>
      <StickyNavbar brand="MAATAA" links={links} currentHref="/projects" label="Site" />
      <HamburgerMenu links={links} currentHref="/projects" label="Mobile" />
      <div style={{ maxWidth: 380 }}>
        <BottomNav links={links} currentHref="/" label="App" />
      </div>
      <StepDots count={5} current={step} onSelect={setStep} noun="Slide" />
      <AnchorNav
        items={[
          { id: "synopsis", label: "Synopsis" },
          { id: "cast", label: "Cast" },
          { id: "budget", label: "Budget" },
        ]}
        trackActive={false}
      />
      <LoadMoreButton shown={20} total={64} noun="shots" onLoadMore={() => {}} />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
