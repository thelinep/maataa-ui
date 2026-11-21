import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileDropzone, fileMatchesAccept, formatBytes } from "./FileDropzone";

const pdf = new File(["x"], "script.pdf", { type: "application/pdf" });
const png = new File(["x"], "still.png", { type: "image/png" });

describe("helpers", () => {
  it("matches accept rules", () => {
    expect(fileMatchesAccept(pdf, ".pdf")).toBe(true);
    expect(fileMatchesAccept(png, "image/*")).toBe(true);
    expect(fileMatchesAccept(png, ".pdf,application/pdf")).toBe(false);
    expect(fileMatchesAccept(png)).toBe(true);
  });
  it("formats bytes", () => {
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(20 * 1024 * 1024)).toBe("20 MB");
  });
});

describe("FileDropzone", () => {
  it("has a keyboard path: a Choose files button", () => {
    render(<FileDropzone label="Upload script" onFiles={() => {}} />);
    expect(screen.getByRole("group", { name: "Upload script" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose files" })).toBeInTheDocument();
  });
  it("accepts chosen files and rejects bad ones, announcing both", async () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(
      <FileDropzone label="Upload script" accept=".pdf" onFiles={onFiles} onReject={onReject} />
    );
    await user.upload(screen.getByTestId("file-dropzone-input"), [pdf, png]);
    expect(onFiles).toHaveBeenCalledWith([pdf]);
    expect(onReject).toHaveBeenCalledWith([{ file: png, reason: "file type not allowed" }]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 file added. still.png not added: file type not allowed"
    );
  });
  it("accepts dropped files and checks size", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    render(<FileDropzone label="Drop" maxSizeBytes={0} onFiles={onFiles} onReject={onReject} />);
    fireEvent.drop(screen.getByRole("group", { name: "Drop" }), { dataTransfer: { files: [pdf] } });
    expect(onFiles).not.toHaveBeenCalled();
    expect(onReject.mock.calls[0][0][0].reason).toMatch(/larger than/);
  });
});
