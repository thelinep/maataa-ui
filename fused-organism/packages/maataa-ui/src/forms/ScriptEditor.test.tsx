import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ScriptEditor,
  FormatToolbar,
  SceneNavigator,
  CharacterTracker,
  charactersOf,
  scenesOf,
  type ScriptElement,
  type ScriptElementType,
} from "./ScriptEditor";

const els: ScriptElement[] = [
  { id: "1", type: "scene", text: "INT. KITCHEN - NIGHT" },
  { id: "2", type: "action", text: "Rain hammers the roof." },
  { id: "3", type: "character", text: "MEERA" },
  { id: "4", type: "dialogue", text: "You came back." },
  { id: "5", type: "scene", text: "EXT. TERRACE - NIGHT" },
  { id: "6", type: "character", text: "MEERA (V.O.)" },
  { id: "7", type: "dialogue", text: "I always knew." },
];

describe("script helpers", () => {
  it("finds scenes and characters", () => {
    expect(scenesOf(els).map((s) => s.heading)).toEqual([
      "INT. KITCHEN - NIGHT",
      "EXT. TERRACE - NIGHT",
    ]);
    expect(charactersOf(els)).toEqual([{ name: "MEERA", lines: 2, scenes: [1, 2] }]);
  });
});

function H() {
  const [v, setV] = useState(els);
  const [cur, setCur] = useState<{ id: string; type: ScriptElementType }>();
  return (
    <>
      <FormatToolbar
        current={cur?.type}
        onChange={(t) => cur && setV(v.map((x) => (x.id === cur.id ? { ...x, type: t } : x)))}
      />
      <ScriptEditor
        title="Monsoon Diaries"
        elements={v}
        onChange={setV}
        onFocusChange={(id, type) => setCur({ id, type })}
        newId={() => "n"}
      />
      <SceneNavigator elements={v} onGo={() => {}} currentId={cur?.id} />
      <CharacterTracker elements={v} />
    </>
  );
}

describe("ScriptEditor", () => {
  it("labels lines by type and adds the logical next element on Enter", async () => {
    const user = userEvent.setup();
    render(<H />);
    const charLine = screen.getByLabelText("Character, line 3");
    await user.click(charLine);
    expect(screen.getByRole("button", { name: "Character" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await user.click(screen.getByLabelText("Dialogue, line 4"));
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Character, line 5")).toHaveFocus();
    expect(screen.getByRole("navigation", { name: "Scenes" })).toHaveTextContent(
      "INT. KITCHEN - NIGHT"
    );
    expect(screen.getByRole("region", { name: "Characters" })).toHaveTextContent(
      "MEERA · 2 speeches"
    );
  });
  it("Ctrl+number changes type", async () => {
    const user = userEvent.setup();
    render(<H />);
    await user.click(screen.getByLabelText("Action, line 2"));
    await user.keyboard("{Control>}6{/Control}");
    expect(screen.getByLabelText("Transition, line 2")).toBeInTheDocument();
  });
});
