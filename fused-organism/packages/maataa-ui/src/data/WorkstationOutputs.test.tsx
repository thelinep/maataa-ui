import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ShotList } from "./ShotList";
import { WorkstationOutputs } from "./WorkstationOutputs";
import { fromNovaShotList } from "./nova";
import {
  NOVA_CALL_SHEET,
  NOVA_CALL_SHEET_RESULT,
  NOVA_SHOT_LIST,
  NOVA_SHOT_LIST_RESULT,
} from "./nova.fixture";

describe("ShotList", () => {
  it("shows totals, scene headings and shot sizes spelled out", () => {
    render(<ShotList {...fromNovaShotList(NOVA_SHOT_LIST)} />);
    expect(screen.getByRole("heading", { name: "Shot list: Bhairav" })).toBeInTheDocument();
    expect(screen.getByText(/2 scenes · 6 shots · about 33 s of screen time/)).toBeInTheDocument();
    const scene2 = screen.getByRole("region", { name: "Scene 2: आंतरिक. माँ की रसोई - रात" });
    expect(within(scene2).getByText("OTS")).toHaveAttribute("title", "over the shoulder");
    expect(within(scene2).getByRole("rowheader", { name: "2C" })).toBeInTheDocument();
  });
});

describe("WorkstationOutputs", () => {
  it("shows a pasted call sheet with its print view", async () => {
    render(<WorkstationOutputs />);
    await userEvent.click(screen.getByText("Paste JSON"));
    await userEvent.click(screen.getByLabelText("The JSON of a shot list or call sheet"));
    await userEvent.paste(JSON.stringify(NOVA_CALL_SHEET_RESULT));
    await userEvent.click(screen.getByRole("button", { name: "Show it" }));
    expect(screen.getByText("Call sheet opened: Bhairav")).toBeInTheDocument();
    expect(screen.getByText("Rohan Mishra")).toBeInTheDocument();
    expect(screen.getByText(/Drafted by the local model qwen3.5:9b-q4_K_M/)).toBeInTheDocument();
  });

  it("explains a Markdown copy", async () => {
    render(<WorkstationOutputs />);
    await userEvent.click(screen.getByText("Paste JSON"));
    await userEvent.click(screen.getByLabelText("The JSON of a shot list or call sheet"));
    await userEvent.paste("# Shot list: Bhairav");
    await userEvent.click(screen.getByRole("button", { name: "Show it" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Open the .json file saved beside it in Maataa Library."
    );
  });

  it("loads saved outputs, switches between them, and starts a call sheet from a shot list", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: "a", title: "Bhairav shots", data: NOVA_SHOT_LIST },
        { id: "b", title: "Day 2", data: NOVA_CALL_SHEET },
      ],
    });
    const onStart = vi.fn();
    render(
      <WorkstationOutputs
        base="/nova"
        fetcher={fetcher as unknown as typeof fetch}
        onStartCallSheet={onStart}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Load from Maataa Workstation" }));
    expect(await screen.findByText("2 saved outputs loaded.")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Start a call sheet from these scenes" })
    );
    expect(onStart).toHaveBeenCalledWith(
      [
        expect.objectContaining({ scene: "1", dayNight: "M" }),
        expect.objectContaining({ scene: "2", dayNight: "N" }),
      ],
      expect.objectContaining({ id: "a" })
    );
    await userEvent.click(screen.getByRole("button", { name: /^Call sheet: Day 2/ }));
    expect(screen.getByText("Rohan Mishra")).toBeInTheDocument();
  });

  it("starts with what it's given", () => {
    render(
      <WorkstationOutputs
        initial={[{ kind: "shotlist", data: NOVA_SHOT_LIST_RESULT.data, title: "Bhairav" }]}
      />
    );
    expect(screen.getByRole("heading", { name: "Shot list: Bhairav" })).toBeInTheDocument();
  });
});
