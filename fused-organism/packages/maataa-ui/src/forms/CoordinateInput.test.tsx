import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CoordinateInput, formatCoordinates, type Coordinates } from "./CoordinateInput";

function H() {
  const [v, setV] = useState<Coordinates | null>(null);
  return <CoordinateInput label="Location" value={v} onChange={setV} />;
}

describe("CoordinateInput", () => {
  it("formats with hemispheres", () => {
    expect(formatCoordinates({ lat: 28.6139, lng: 77.209 })).toBe("28.6139° N, 77.2090° E");
    expect(formatCoordinates({ lat: -33.86, lng: -70.65 }, 2)).toBe("33.86° S, 70.65° W");
  });

  it("fills both fields from a pasted pair", async () => {
    const user = userEvent.setup();
    render(<H />);
    await user.click(screen.getByLabelText("Latitude"));
    await user.paste("28.6139, 77.2090");
    expect(screen.getByLabelText("Longitude")).toHaveValue("77.209");
    expect(screen.getByText("28.6139° N, 77.2090° E")).toBeInTheDocument();
  });

  it("explains out-of-range values and geolocation refusal", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: vi.fn((_ok, err) => err({ code: 1 })) },
    });
    render(<H />);
    await user.type(screen.getByLabelText("Latitude"), "95");
    await user.type(screen.getByLabelText("Longitude"), "10");
    await user.tab();
    expect(screen.getByLabelText("Latitude")).toHaveAccessibleDescription(/-90 to 90/);
    await user.click(screen.getByRole("button", { name: "Use my location" }));
    expect(screen.getByRole("status")).toHaveTextContent(/permission was refused/);
  });
});
