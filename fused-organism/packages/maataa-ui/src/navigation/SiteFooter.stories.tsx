import type { Meta, StoryObj } from "@storybook/react";
import { SiteFooter } from "./SiteFooter";

const meta = { title: "Navigation/SiteFooter", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const social = [
  { name: "Instagram", href: "#", icon: "IG" },
  { name: "YouTube", href: "#", icon: "▶" },
  { name: "LinkedIn", href: "#", icon: "in" },
];

export const Full: Story = {
  render: () => (
    <SiteFooter
      brand="maataa"
      tagline="From first idea to final cut."
      columns={[
        {
          heading: "Product",
          links: [
            { label: "Call sheets", href: "#" },
            { label: "Budgets", href: "#" },
            { label: "Pricing", href: "#" },
          ],
        },
        {
          heading: "Help",
          links: [
            { label: "Accessibility guide", href: "#" },
            { label: "ISL videos", href: "#" },
            { label: "Contact", href: "#" },
          ],
        },
        {
          heading: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
          ],
        },
      ]}
      social={social}
      legal={[
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Accessibility statement", href: "#" },
      ]}
      copyright="© 2026 Vesahe Film Solutions Pvt Ltd"
      registration="Shahdara, Delhi"
    />
  ),
};

export const Compact: Story = {
  render: () => (
    <SiteFooter
      variant="compact"
      social={social}
      legal={[
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ]}
      copyright="© 2026 Vesahe Film Solutions"
    />
  ),
};
