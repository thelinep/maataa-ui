import { describe, expect, it, vi } from "vitest";
import {
  fetchNovaOutputs,
  fromNovaCallSheet,
  fromNovaShotList,
  parseSceneHeading,
  readNovaOutput,
  sceneRowsFromShotList,
} from "./nova";
import {
  NOVA_CALL_SHEET,
  NOVA_CALL_SHEET_RESULT,
  NOVA_SHOT_LIST,
  NOVA_SHOT_LIST_RESULT,
} from "./nova.fixture";

describe("readNovaOutput", () => {
  it("reads a skill run result, a saved output, a Library recipe, bare data and JSON text", () => {
    expect(readNovaOutput(NOVA_SHOT_LIST_RESULT)).toMatchObject({
      kind: "shotlist",
      title: "Bhairav",
      model: "qwen3.5:9b-q4_K_M",
    });
    expect(
      readNovaOutput({
        id: "o1",
        skillId: "s1",
        title: "Day 2",
        data: NOVA_CALL_SHEET,
        createdAt: "2026-11-25T03:00:00Z",
      })
    ).toMatchObject({
      kind: "callsheet",
      id: "o1",
      title: "Day 2",
    });
    expect(
      readNovaOutput({ nova: "skill-output", outputId: "o2", data: NOVA_SHOT_LIST })
    ).toMatchObject({ kind: "shotlist", id: "o2" });
    expect(readNovaOutput(NOVA_CALL_SHEET).kind).toBe("callsheet");
    expect(readNovaOutput(JSON.stringify(NOVA_CALL_SHEET_RESULT)).kind).toBe("callsheet");
  });

  it("explains Markdown copies and anything else", () => {
    expect(() => readNovaOutput("# Shot list: Bhairav")).toThrow(/Open the .json file/);
    expect(() => readNovaOutput("{not json")).toThrow(/isn't a shot list or call sheet/);
    expect(() => readNovaOutput({ title: "Treatment", logline: "…" })).toThrow(
      /isn't a shot list or call sheet/
    );
  });
});

describe("parseSceneHeading", () => {
  it.each([
    ["EXT. ASSI GHAT - DAWN", "EXT. ASSI GHAT", "M"],
    ["INT. KITCHEN - NIGHT", "INT. KITCHEN", "N"],
    ["आंतरिक. माँ की रसोई - रात", "आंतरिक. माँ की रसोई", "N"],
    ["बाहरी. छत - शाम", "बाहरी. छत", "E"],
    ["Boat sequence, mid-river", "Boat sequence, mid-river", "D"],
  ] as const)("%s", (heading, set, dayNight) => {
    expect(parseSceneHeading(heading)).toEqual({ set, dayNight });
  });
});

describe("fromNovaCallSheet", () => {
  const p = fromNovaCallSheet(NOVA_CALL_SHEET);

  it("fills the day from the sheet, keeping TBC where the workstation wrote it", () => {
    expect(p.production).toBe("Bhairav");
    expect(p.day).toMatchObject({
      shootDay: 2,
      of: 5,
      date: "2026-11-27",
      shootingCall: "05:30",
      crewCall: "04:45",
      weather: "Fog till 08:00",
      hospital: "TBC",
      basecamp: "Assi Ghat, Varanasi, P: Bhadaini lane, near the water tank",
    });
  });

  it("turns the schedule into scene rows with the time in the notes", () => {
    expect(p.scenes).toHaveLength(3);
    expect(p.scenes[2]).toMatchObject({
      scene: "2",
      set: "आंतरिक. माँ की रसोई",
      dayNight: "N",
      cast: "Bhairav, Maa",
      notes: "19:00",
    });
  });

  it("keeps cast notes with the role and crew departments as roles", () => {
    expect(p.cast?.[0]).toEqual({
      role: "Bhairav · Make-up first",
      name: "Rohan Mishra",
      call: "05:00",
    });
    expect(p.crew?.[1]).toEqual({ role: "Sound", name: "TBC", call: "05:00" });
    expect(p.notes).toBe(
      "Life jackets for everyone on the boats\nNo drones over the ghat without the police letter"
    );
  });
});

describe("fromNovaShotList and sceneRowsFromShotList", () => {
  it("keeps every shot, and numbers only real durations", () => {
    const p = fromNovaShotList(NOVA_SHOT_LIST);
    expect(p.scenes.map((s) => s.shots.length)).toEqual([3, 3]);
    expect(p.scenes[0]!.shots[0]).toMatchObject({
      shot: "1A",
      size: "WS",
      durationSec: 8,
      lens: "24mm",
    });
    expect(
      fromNovaShotList({
        title: "x",
        scenes: [
          {
            scene: "1",
            heading: "h",
            shots: [
              {
                shot: "1A",
                size: "WS",
                angle: "a",
                movement: "m",
                description: "d",
                durationSec: "TBC",
              },
            ],
          },
        ],
      }).scenes[0]!.shots[0]!.durationSec
    ).toBeUndefined();
  });

  it("seeds call sheet rows from the scenes", () => {
    expect(sceneRowsFromShotList(NOVA_SHOT_LIST, "Varanasi")).toEqual([
      expect.objectContaining({
        scene: "1",
        set: "EXT. ASSI GHAT",
        dayNight: "M",
        location: "Varanasi",
        notes: "Shots: 3",
      }),
      expect.objectContaining({ scene: "2", set: "आंतरिक. माँ की रसोई", dayNight: "N" }),
    ]);
  });
});

describe("fetchNovaOutputs", () => {
  it("keeps only shot lists and call sheets from the saved outputs", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: "a", data: NOVA_SHOT_LIST },
        { id: "b", markdown: "# Summary", data: null },
        { id: "c", data: NOVA_CALL_SHEET },
      ],
    });
    const list = await fetchNovaOutputs("/nova/", fetcher as unknown as typeof fetch);
    expect(fetcher).toHaveBeenCalledWith("/nova/api/skill-outputs", expect.anything());
    expect(list.map((o) => [o.id, o.kind])).toEqual([
      ["a", "shotlist"],
      ["c", "callsheet"],
    ]);
  });

  it("says when the workstation isn't there", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false });
    await expect(fetchNovaOutputs("/nova", fetcher as unknown as typeof fetch)).rejects.toThrow(
      /Is it running/
    );
  });
});
