import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OfferLetterPreview, templateFields } from "./OfferLetterPreview";

const t = "Dear {{name}},\n\nWe are pleased to offer you the role of {{role}} at {{fee}} per day.";

describe("OfferLetterPreview", () => {
  it("lists fields and flags missing ones", () => {
    expect(templateFields(t)).toEqual(["name", "role", "fee"]);
    render(<OfferLetterPreview template={t} values={{ name: "Asha", role: "Editor" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("1 field to fill: Fee");
    expect(screen.getByText("[Fee missing]")).toBeInTheDocument();
    expect(screen.getByText("Asha")).toBeInTheDocument();
  });
});
