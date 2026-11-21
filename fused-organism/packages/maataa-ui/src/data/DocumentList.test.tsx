import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentList, QuarantinePanel, ScannerFailureNotice } from "./DocumentList";

const docs = [
  {
    id: "1",
    name: "permit.pdf",
    size: 2048,
    uploadedAt: new Date(2026, 10, 20),
    scan: "clean" as const,
  },
  {
    id: "2",
    name: "invoice.pdf",
    size: 2048,
    uploadedAt: new Date(2026, 10, 20),
    scan: "quarantined" as const,
  },
];

describe("DocumentList", () => {
  it("downloads only clean files and explains held ones", async () => {
    const onDownload = vi.fn();
    const onOpenIssue = vi.fn();
    const user = userEvent.setup();
    render(<DocumentList documents={docs} onDownload={onDownload} onOpenIssue={onOpenIssue} />);
    await user.click(screen.getByRole("button", { name: "Download permit.pdf" }));
    expect(onDownload).toHaveBeenCalledWith(docs[0]);
    const held = screen.getByRole("button", { name: "Download invoice.pdf" });
    expect(held).toHaveAttribute("aria-disabled", "true");
    expect(held).toHaveAccessibleDescription(/scan found a problem/);
    await user.click(held);
    expect(onDownload).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "What happened to invoice.pdf?" }));
    expect(onOpenIssue).toHaveBeenCalledWith(docs[1]);
  });
  it("quarantine and failure panels offer next steps", async () => {
    const onDelete = vi.fn();
    const onRetry = vi.fn();
    render(
      <>
        <QuarantinePanel
          name="invoice.pdf"
          finding="Trojan.PDF"
          onDelete={onDelete}
          onRequestReview={() => {}}
        />
        <ScannerFailureNotice name="cut.mov" onRetry={onRetry} />
      </>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Trojan.PDF");
    fireEvent.click(screen.getByRole("button", { name: "Delete file" }));
    fireEvent.click(screen.getByRole("button", { name: "Scan again" }));
    expect(onDelete).toHaveBeenCalled();
    expect(onRetry).toHaveBeenCalled();
  });
});
