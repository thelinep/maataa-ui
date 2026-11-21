import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { WizardShell } from "./WizardShell";

const steps = [
  { id: "type", label: "Account type" },
  { id: "dev", label: "Your device", optional: true },
  { id: "review", label: "Review" },
];

function Harness({ onFinish }: { onFinish: () => void }) {
  const [i, setI] = useState(0);
  return (
    <WizardShell
      title="Set up"
      steps={steps}
      current={i}
      onBack={() => setI(i - 1)}
      onNext={() => (i === steps.length - 1 ? onFinish() : setI(i + 1))}
      onSkip={() => setI(i + 1)}
    >
      <p>content {i}</p>
    </WizardShell>
  );
}

describe("WizardShell", () => {
  it("walks the steps, focusing each heading", async () => {
    const onFinish = vi.fn();
    const user = userEvent.setup();
    render(<Harness onFinish={onFinish} />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "Your device" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Skip this step" }));
    expect(screen.getByRole("heading", { name: "Review" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(onFinish).toHaveBeenCalled();
  });
});
