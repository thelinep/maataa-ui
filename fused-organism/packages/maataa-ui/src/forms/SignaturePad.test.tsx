import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SignaturePad, type SignatureValue } from "./SignaturePad";

describe("SignaturePad", () => {
  it("can be signed by typing a name, then cleared", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<SignatureValue>(null);
      return <SignaturePad label="Release signature" value={v} onChange={setV} />;
    }
    render(<H />);
    expect(screen.getByRole("status")).toHaveTextContent("Not signed yet.");
    expect(screen.getByRole("img", { name: /Signature pad, empty/ })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Type name" }));
    await user.type(screen.getByLabelText("Full name"), "Asha Verma");
    await user.tab();
    expect(screen.getByRole("status")).toHaveTextContent(/Signed as Asha Verma at/);
    await user.click(screen.getByRole("button", { name: "Clear signature" }));
    expect(screen.getByRole("status")).toHaveTextContent("Not signed yet.");
  });
});
