import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MasterApprovalPanel } from "./MasterApprovalPanel";

describe("MasterApprovalPanel", () => {
  it("waits for QC, then offers approval", async () => {
    const onApprove = vi.fn();
    const { rerender } = render(
      <MasterApprovalPanel
        title="Monsoon Diaries master"
        onApprove={onApprove}
        onReject={() => {}}
        deliverables={[
          { id: "1", name: "DCP 2K", qc: "passed" },
          { id: "2", name: "Subtitles", qc: "inReview" },
        ]}
      />
    );
    expect(screen.getByText(/Approval opens when QC passes on: Subtitles/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve master" })).toBeNull();
    rerender(
      <MasterApprovalPanel
        title="Monsoon Diaries master"
        onApprove={onApprove}
        onReject={() => {}}
        deliverables={[
          { id: "1", name: "DCP 2K", qc: "passed" },
          { id: "2", name: "Subtitles", qc: "waived" },
        ]}
      />
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Approve master" }));
    expect(onApprove).toHaveBeenCalled();
  });
});
