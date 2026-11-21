import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

function Boom({ fail }: { fail: boolean }) {
  if (fail) throw new Error("kaboom");
  return <p>Budget table</p>;
}

function Harness() {
  const [fail, setFail] = useState(true);
  return (
    <>
      <button onClick={() => setFail(false)}>fix</button>
      <ErrorBoundary region="Budget">
        <Boom fail={fail} />
      </ErrorBoundary>
    </>
  );
}

describe("ErrorBoundary", () => {
  it("shows a recoverable fallback and resets", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole("alert")).toHaveTextContent("Budget couldn't be shown.");
    expect(screen.getByText("kaboom")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "fix" }));
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText("Budget table")).toBeInTheDocument();
    spy.mockRestore();
  });
});
