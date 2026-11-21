import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EvidencePackBuilder, SharePermissions } from "./EvidencePack";

const docs = [
  { id: "b", name: "Budget v3", category: "Finance" },
  { id: "c", name: "Cast contracts", category: "Legal", sensitive: true },
];

describe("EvidencePackBuilder", () => {
  it("adds, orders and warns about unredacted confidential docs", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <EvidencePackBuilder
        available={docs}
        included={["b"]}
        onChange={onChange}
        redact
        onRedactChange={() => {}}
      />
    );
    await user.click(screen.getByRole("checkbox", { name: "Cast contracts · confidential" }));
    expect(onChange).toHaveBeenCalledWith(["b", "c"]);
    rerender(
      <EvidencePackBuilder
        available={docs}
        included={["b", "c"]}
        onChange={onChange}
        redact={false}
        onRedactChange={() => {}}
      />
    );
    expect(
      screen.getByText("1 confidential document will be shared unredacted.")
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Move Cast contracts earlier" }));
    expect(onChange).toHaveBeenLastCalledWith(["c", "b"]);
  });
});

describe("SharePermissions", () => {
  it("shares view-only with expiry and revokes by name", async () => {
    const onAdd = vi.fn();
    const onRevoke = vi.fn();
    const user = userEvent.setup();
    render(
      <SharePermissions
        subject="Evidence pack v2"
        onAdd={onAdd}
        onRevoke={onRevoke}
        grants={[{ id: "g", name: "Ravi (Fund)", email: "ravi@fund.in", canDownload: false }]}
      />
    );
    expect(screen.getByText(/View only · not opened yet/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Email"), "Meera@Studio.in");
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(onAdd).toHaveBeenCalledWith("meera@studio.in", 30, false);
    await user.click(screen.getByRole("button", { name: "Revoke access for Ravi (Fund)" }));
    expect(onRevoke).toHaveBeenCalledWith("g");
  });
});
