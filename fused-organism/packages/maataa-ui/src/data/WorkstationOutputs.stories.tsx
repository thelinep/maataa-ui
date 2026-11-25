import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CallSheetEditor, type CallSheetDay, type SceneRow } from "../forms/CallSheetEditor";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { readNovaOutput } from "./nova";
import { NOVA_CALL_SHEET_RESULT, NOVA_SHOT_LIST_RESULT } from "./nova.fixture";
import { ShotList } from "./ShotList";
import { fromNovaShotList } from "./nova";
import { WorkstationOutputs } from "./WorkstationOutputs";

const shots = readNovaOutput(NOVA_SHOT_LIST_RESULT);
const sheet = readNovaOutput(NOVA_CALL_SHEET_RESULT);

const meta = {
  title: "Data/WorkstationOutputs",
  component: WorkstationOutputs,
  tags: ["autodocs"],
  args: { initial: [shots, sheet] },
} satisfies Meta<typeof WorkstationOutputs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A shot list and a call sheet from Maataa Workstation, as its skills return them. */
export const Default: Story = {};

function ShotsToCallSheet() {
  const [day, setDay] = useState<CallSheetDay>({
    shootDay: 1,
    date: "2026-11-27",
    crewCall: "05:00",
    shootingCall: "05:30",
  });
  const [scenes, setScenes] = useState<SceneRow[]>([]);
  return (
    <div style={{ display: "grid", gap: 32 }}>
      <WorkstationOutputs initial={[shots]} onStartCallSheet={(rows) => setScenes(rows)} />
      <CallSheetEditor day={day} onDayChange={setDay} scenes={scenes} onScenesChange={setScenes} />
    </div>
  );
}

/** Press "Start a call sheet from these scenes": the scenes land in the call sheet editor below. */
export const ShotListToCallSheet: Story = { render: () => <ShotsToCallSheet /> };

/** The shot list on its own, in Hindi. */
export const ShotListHindi: Story = {
  render: () => (
    <LocaleProvider locale="hi-IN">
      <ShotList {...fromNovaShotList(NOVA_SHOT_LIST_RESULT.data)} />
    </LocaleProvider>
  ),
};

/** Nothing open yet, with the Load button for a running workstation. */
export const Empty: Story = { args: { initial: [], base: "/nova" } };
