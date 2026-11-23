import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DeliveryTracker,
  ScreeningAttendeeList,
  LegalMatterList,
  SignatureStatusList,
  SubsidyProgrammeList,
} from "./BusinessLists";

const meta = {
  title: "Data/DeliveryTracker",
  component: DeliveryTracker,
  tags: ["autodocs"],
} satisfies Meta<typeof DeliveryTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    now: new Date(2026, 10, 21),
    items: [
      {
        id: "1",
        recipient: "Netflix India",
        item: "IMF package",
        due: new Date(2026, 10, 18),
        status: "inProgress",
      },
      {
        id: "2",
        recipient: "Netflix India",
        item: "Dubbing script",
        due: new Date(2026, 10, 30),
        status: "accepted",
      },
      {
        id: "3",
        recipient: "PVR Inox",
        item: "DCP + KDMs",
        due: new Date(2026, 11, 20),
        status: "notStarted",
      },
    ],
  },
};
export const Attendees: Story = {
  args: Default.args,
  render: () => (
    <ScreeningAttendeeList
      capacity={80}
      onToggleAttended={() => {}}
      attendees={[
        {
          id: "1",
          name: "Asha Rao",
          group: "Cast",
          rsvp: "yes",
          plusOnes: 1,
          access: ["Wheelchair space"],
        },
        { id: "2", name: "Ravi Menon", group: "Press", rsvp: "maybe" },
        {
          id: "3",
          name: "Meera Iyer",
          group: "Distributor",
          rsvp: "yes",
          access: ["ISL interpreter", "Captions"],
          attended: true,
        },
      ]}
    />
  ),
};
export const Legal: Story = {
  args: Default.args,
  render: () => (
    <LegalMatterList
      matters={[
        {
          id: "a",
          title: "Song sample claim",
          kind: "Dispute",
          counterparty: "Saregama",
          owner: "Hemant",
          risk: "high",
          open: true,
          nextStep: "Reply to notice",
          nextDate: new Date(2026, 10, 28),
        },
        {
          id: "b",
          title: "Location agreement",
          kind: "Agreement",
          counterparty: "Mr. Fernandes",
          owner: "Asha",
          risk: "low",
          open: true,
        },
      ]}
    />
  ),
};
export const Signatures: Story = {
  args: Default.args,
  render: () => (
    <SignatureStatusList
      contract="Lead actor agreement v3"
      onRemind={() => {}}
      signatories={[
        { id: "1", name: "Hemant", role: "Producer", status: "signed", at: new Date(2026, 10, 18) },
        { id: "2", name: "Asha Rao", role: "Lead actor", status: "sent" },
        { id: "3", name: "Talent agency", role: "Witness", status: "draft" },
      ]}
    />
  ),
};
export const Subsidies: Story = {
  args: Default.args,
  render: () => (
    <SubsidyProgrammeList
      now={new Date(2026, 10, 21)}
      programmes={[
        {
          id: "1",
          name: "UP Film Policy 2023",
          body: "Film Bandhu, Uttar Pradesh",
          benefit: "Up to 25% of local spend, max ₹2 Cr",
          eligible: "maybe",
          reason: "Needs half the shoot days in UP",
          deadline: new Date(2026, 10, 30),
        },
        {
          id: "2",
          name: "NFDC co-production",
          body: "NFDC",
          benefit: "Co-funding up to 50%",
          eligible: "yes",
        },
      ]}
    />
  ),
};
