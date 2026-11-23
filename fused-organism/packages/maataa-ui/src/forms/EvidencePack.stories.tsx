import type { Meta, StoryObj } from "@storybook/react-vite";
import { EvidencePackBuilder, SharePermissions } from "./EvidencePack";

const meta = {
  title: "Forms/EvidencePackBuilder",
  component: EvidencePackBuilder,
  tags: ["autodocs"],
} satisfies Meta<typeof EvidencePackBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    available: [
      { id: "b", name: "Budget v3", category: "Finance" },
      { id: "r", name: "Revenue scenarios", category: "Finance" },
      { id: "c", name: "Chain of title", category: "Legal" },
      { id: "k", name: "Cast contracts", category: "Legal", sensitive: true },
      { id: "s", name: "Script (locked)", category: "Creative" },
    ],
    included: ["s", "b", "k"],
    onChange: () => {},
    redact: false,
    onRedactChange: () => {},
    onPreview: () => {},
  },
};
export const Sharing: Story = {
  args: Default.args,
  render: () => (
    <SharePermissions
      subject="Evidence pack v2"
      onAdd={() => {}}
      onRevoke={() => {}}
      grants={[
        {
          id: "g",
          name: "Ravi (Fund)",
          email: "ravi@fund.in",
          canDownload: false,
          expiresAt: new Date(2026, 11, 21),
          lastViewed: new Date(2026, 10, 20),
        },
        { id: "h", name: "Meera (Studio)", email: "meera@studio.in", canDownload: true },
      ]}
    />
  ),
};
