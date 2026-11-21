import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ScriptAnalysisChart,
  CastingProfileCard,
  CallTimeBadge,
  SidesViewer,
  WardrobeScheduleCard,
  PerDiemTable,
  WaiverSignatureBlock,
  DeliverySpecCard,
  ApprovalFrameMarker,
  type SceneStat,
} from "./ProductionComposites";
import type { SignatureValue } from "../forms/SignaturePad";

const meta = { title: "Data/ProductionComposites", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const scenes: SceneStat[] = Array.from({ length: 24 }, (_, i) => ({
  scene: String(i + 1),
  eighths: [3, 8, 12, 5, 2, 9, 14, 6, 4, 10, 7, 3, 16, 5, 8, 2, 11, 6, 4, 9, 13, 3, 7, 10][i]!,
  intExt: i % 3 === 0 ? "EXT" : "INT",
  time: i % 5 === 0 ? "NIGHT" : i % 7 === 0 ? "DUSK" : "DAY",
}));

export const Script: Story = { render: () => <ScriptAnalysisChart scenes={scenes} /> };

export const People: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <CastingProfileCard
        name="Ritu Sen"
        playingAge="25–32"
        languages={["Hindi", "Bengali", "English"]}
        skills={["Kathak", "Swimming", "Two-wheeler"]}
        height="5′5″"
        agent="Mehta Talent"
        stage="Callback"
        forRole="Asha"
        showreelHref="#"
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <CallTimeBadge time="05:30" label="Crew call" size="lg" />
        <CallTimeBadge time="06:15" label="Hair & make-up" changedFrom="06:45" />
        <CallTimeBadge time="04:45" label="Pick-up" />
      </div>
      <WardrobeScheduleCard
        character="Asha"
        actor="Ritu Sen"
        fittingAt="2 Dec, 14:00"
        changes={[
          {
            id: "Change 1",
            scenes: ["3", "4", "7"],
            description: "Office kurta, grey cardigan",
            status: "ready",
          },
          { id: "Change 2", scenes: ["12"], description: "Wedding red sari", status: "alteration" },
          {
            id: "Change 3",
            scenes: ["14C"],
            description: "Rain-soaked, double needed",
            status: "missing",
          },
        ]}
      />
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <SidesViewer
      title="Sides — Day 4"
      highlight="ASHA"
      scenes={[
        {
          number: "14C",
          lines: [
            { kind: "heading", text: "INT. FLAT — NIGHT" },
            {
              kind: "action",
              text: "The power is out. Rain hammers the window. ASHA waits by the door.",
            },
            { kind: "character", text: "ASHA" },
            { kind: "dialogue", text: "You said you’d call." },
            { kind: "character", text: "ARJUN" },
            { kind: "parenthetical", text: "(not looking at her)" },
            { kind: "dialogue", text: "I tried. Twice." },
            { kind: "transition", text: "Cut to:" },
          ],
        },
      ]}
    />
  ),
};

function WaiverDemo() {
  const [v, setV] = useState<SignatureValue>(null);
  return (
    <WaiverSignatureBlock
      title="Location release — 14 Kabir Nagar"
      terms={
        <p>
          The owner allows Vesahe Films to film at the property on 3–4 December 2026, including set
          dressing and lighting rigs. Any damage will be repaired at the production’s cost.
        </p>
      }
      signerName="Property owner"
      value={v}
      onChange={setV}
      onSubmit={() => {}}
    />
  );
}

export const Paperwork: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <PerDiemTable
        rows={[
          { id: "1", name: "Imran Sheikh", role: "Gaffer", days: 12, rate: 800, paid: 4800 },
          { id: "2", name: "Meera Iyer", role: "Sound mixer", days: 10, rate: 1000, paid: 10000 },
          { id: "3", name: "Arjun Rao", role: "DOP", days: 24, rate: 1500 },
        ]}
      />
      <DeliverySpecCard
        name="Theatrical DCP"
        recipient="PVR INOX"
        due="15 Jan 2027"
        specs={[
          { label: "Container", value: "SMPTE DCP, 2K Scope", ok: true },
          { label: "Frame rate", value: "24 fps", ok: true },
          { label: "Audio", value: "5.1, −27 LKFS", ok: false },
          { label: "Subtitles", value: "English, burnt-in" },
        ]}
      />
      <WaiverDemo />
    </div>
  ),
};

export const Review: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <ApprovalFrameMarker at="01:02:03:04" status="approved" reviewer="Asha" onOpen={() => {}} />
      <ApprovalFrameMarker
        at="01:04:11:20"
        status="changes"
        reviewer="Asha"
        note="Lift shadows a touch"
        onOpen={() => {}}
      />
      <ApprovalFrameMarker at="01:06:40:02" status="pending" onOpen={() => {}} />
    </div>
  ),
};
