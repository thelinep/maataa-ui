import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AvatarUpload } from "./AvatarUpload";

describe("AvatarUpload", () => {
  it("offers Add photo when empty", () => {
    render(<AvatarUpload name="Asha Rao" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Add photo for Asha Rao" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
  });
  it("selects images and rejects others", async () => {
    const onSelect = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(
      <AvatarUpload
        name="Asha Rao"
        src="/a.png"
        onSelect={onSelect}
        onRemove={() => {}}
        onError={onError}
      />
    );
    expect(screen.getByRole("button", { name: "Remove photo for Asha Rao" })).toBeInTheDocument();
    const input = screen.getByTestId("avatar-upload-input");
    const img = new File(["x"], "me.png", { type: "image/png" });
    await user.upload(input, img);
    expect(onSelect).toHaveBeenCalledWith(img);
    await user.upload(input, new File(["x"], "cv.pdf", { type: "application/pdf" }));
    expect(onError).toHaveBeenCalledWith("Choose an image file.");
  });
});
