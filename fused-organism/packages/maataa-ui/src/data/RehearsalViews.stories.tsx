import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AttendanceGrid,
  RehearsalSceneList,
  DirectorNotesPanel,
  RescheduleRequest,
} from "./RehearsalViews";

const meta = {
  title: "Data/AttendanceGrid",
  component: AttendanceGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof AttendanceGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {},
    people: [
      { id: "a", name: "Asha Rao", role: "Meera" },
      { id: "r", name: "Ravi Menon", role: "Arjun" },
    ],
    sessions: [
      { id: "s1", label: "Mon 23" },
      { id: "s2", label: "Tue 24" },
      { id: "s3", label: "Wed 25" },
    ],
    value: { a: { s1: "present", s2: "late" }, r: { s1: "present", s2: "absent", s3: "excused" } },
  },
};
export const SceneList: Story = {
  args: Default.args,
  render: () => (
    <RehearsalSceneList
      start={new Date(2026, 10, 24, 10)}
      scenes={[
        {
          id: "a",
          scene: "12",
          title: "Kitchen argument",
          cast: ["Asha Rao", "Ravi Menon"],
          minutes: 45,
          done: true,
        },
        {
          id: "b",
          scene: "22",
          title: "First kiss",
          cast: ["Asha Rao", "Ravi Menon"],
          minutes: 30,
        },
      ]}
    />
  ),
};
export const Notes: Story = {
  args: Default.args,
  render: () => (
    <DirectorNotesPanel
      cast={["Asha Rao", "Ravi Menon"]}
      onAdd={() => {}}
      onToggleResolved={() => {}}
      notes={[
        {
          id: "n1",
          scene: "12",
          forWhom: "Asha Rao",
          text: "Slower on the reveal",
          at: new Date(),
        },
        {
          id: "n2",
          scene: "",
          forWhom: "All",
          text: "Lines off-book by Thursday",
          at: new Date(),
          resolved: true,
        },
      ]}
    />
  ),
};
export const Reschedule: Story = {
  args: Default.args,
  render: () => (
    <RescheduleRequest
      session="Rehearsal, Tue 24 Nov, 10 am"
      needsConsent
      consentDescription="Scene 22 includes a kiss. An intimacy coordinator will be present."
      onConsent={() => {}}
      onRequestReschedule={() => {}}
    />
  ),
};
