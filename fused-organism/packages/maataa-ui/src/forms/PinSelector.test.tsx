import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinSelector, parseLatLng } from "./PinSelector";

describe("parseLatLng", () => {
  it("parses and bounds-checks", () => {
    expect(parseLatLng("19.0760, 72.8777")).toEqual({ lat: 19.076, lng: 72.8777 });
    expect(parseLatLng("19.07° 72.87°")).toEqual({ lat: 19.07, lng: 72.87 });
    expect(parseLatLng("99, 10")).toBeNull();
    expect(parseLatLng("north")).toBeNull();
  });
});

describe("PinSelector", () => {
  it("selects several and adds a typed pin", async () => {
    const onChange = vi.fn();
    const onAddPin = vi.fn();
    const user = userEvent.setup();
    render(
      <PinSelector
        legend="Locations"
        multiple
        value={["a"]}
        onChange={onChange}
        onAddPin={onAddPin}
        places={[
          { id: "a", label: "Juhu beach", lat: 19.1, lng: 72.82 },
          { id: "b", label: "Film City", lat: 19.16, lng: 72.87 },
        ]}
      />
    );
    await user.click(screen.getByRole("checkbox", { name: /Film City/ }));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
    await user.type(screen.getByLabelText("New place name"), "Dharavi lane");
    await user.type(screen.getByLabelText(/Coordinates/), "bad");
    await user.click(screen.getByRole("button", { name: "Add place" }));
    expect(screen.getByLabelText(/Coordinates/)).toHaveAccessibleDescription(/Enter coordinates/);
    await user.clear(screen.getByLabelText(/Coordinates/));
    await user.type(screen.getByLabelText(/Coordinates/), "19.04, 72.85");
    await user.click(screen.getByRole("button", { name: "Add place" }));
    expect(onAddPin).toHaveBeenCalledWith({ label: "Dharavi lane", lat: 19.04, lng: 72.85 });
  });
});
