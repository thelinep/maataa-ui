import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ScriptAnalysisChart,
  pagesFromEighths,
  CastingProfileCard,
  CallTimeBadge,
  SidesViewer,
  WardrobeScheduleCard,
  PerDiemTable,
  WaiverSignatureBlock,
  DeliverySpecCard,
  ApprovalFrameMarker,
} from "./ProductionComposites";
import type { SignatureValue } from "../forms/SignaturePad";

describe("ProductionComposites", () => {
  it("script analysis summarises pacing", () => {
    expect(pagesFromEighths(11)).toBe("1 3/8");
    render(
      <ScriptAnalysisChart
        scenes={[
          { scene: "1", eighths: 8, intExt: "EXT", time: "DAY" },
          { scene: "2", eighths: 12, intExt: "INT", time: "NIGHT" },
        ]}
      />
    );
    expect(
      screen.getByRole("img", {
        name: "2 scenes, 2 4/8 pages. 60% night, 40% exterior. Longest: scene 2 (1 4/8 pages).",
      })
    ).toBeInTheDocument();
  });

  it("casting card and call-time change", () => {
    render(
      <>
        <CastingProfileCard
          name="Ritu Sen"
          playingAge="25–32"
          languages={["Hindi", "Bengali"]}
          stage="Callback"
          showreelHref="#"
        />
        <CallTimeBadge time="05:30" label="Crew call" changedFrom="06:00" />
      </>
    );
    expect(screen.getByRole("heading", { name: "Ritu Sen" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Showreel: Ritu Sen" })).toBeInTheDocument();
    expect(screen.getByText("changed from 06:00")).toBeInTheDocument();
  });

  it("sides mark the actor's lines and enlarge text", async () => {
    render(
      <SidesViewer
        title="Sides — Day 4"
        highlight="ASHA"
        scenes={[
          {
            number: "14",
            lines: [
              { kind: "heading", text: "INT. FLAT — NIGHT" },
              { kind: "character", text: "ASHA" },
              { kind: "dialogue", text: "You said you'd call." },
              { kind: "character", text: "ARJUN" },
              { kind: "dialogue", text: "I did." },
            ],
          },
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: "14. INT. FLAT — NIGHT" })).toBeInTheDocument();
    expect(screen.getByText("You said you'd call.")).toHaveTextContent(
      "Your line: You said you'd call."
    );
    expect(screen.getByText("I did.")).not.toHaveTextContent("Your line");
    await userEvent.click(screen.getByRole("button", { name: "A+ larger text" }));
  });

  it("wardrobe, per diem and delivery spec use words", () => {
    render(
      <>
        <WardrobeScheduleCard
          character="Asha"
          actor="Ritu Sen"
          changes={[
            { id: "Change 1", scenes: ["3", "4"], description: "Red sari", status: "missing" },
          ]}
        />
        <PerDiemTable
          rows={[{ id: "1", name: "Imran", role: "Gaffer", days: 10, rate: 800, paid: 4000 }]}
        />
        <DeliverySpecCard
          name="DCP"
          recipient="PVR"
          specs={[
            { label: "Resolution", value: "2K Flat", ok: true },
            { label: "Loudness", value: "85 dBC", ok: false },
          ]}
        />
        <ApprovalFrameMarker
          at="01:02:03:04"
          status="changes"
          reviewer="Asha"
          note="Lift shadows"
          onOpen={() => {}}
        />
      </>
    );
    expect(screen.getByText("Missing")).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /Imran Gaffer 10 ₹800 ₹8,000 ₹4,000/ })
    ).toBeInTheDocument();
    expect(screen.getByText("1 failing")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Frame 01:02:03:04, Changes requested by Asha: Lift shadows",
      })
    ).toBeInTheDocument();
  });

  it("waiver explains missing steps on submit", async () => {
    const user = userEvent.setup();
    const done = vi.fn();
    function H() {
      const [v, setV] = useState<SignatureValue>(null);
      return (
        <WaiverSignatureBlock
          title="Location release"
          terms={<p>Terms…</p>}
          signerName="Owner"
          value={v}
          onChange={setV}
          onSubmit={done}
        />
      );
    }
    render(<H />);
    await user.click(screen.getByRole("button", { name: "Submit signed form" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Tick “I have read and agree”.Owner needs to sign."
    );
    expect(done).not.toHaveBeenCalled();
  });
});
