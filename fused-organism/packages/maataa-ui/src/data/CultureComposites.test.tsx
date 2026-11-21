import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ChakraCategoryRow,
  LanguageCulturalTimeline,
  AncestralChainFlow,
  TLPClassificationCard,
} from "./CultureComposites";

describe("CultureComposites", () => {
  it("chakra row names the chakra with Sanskrit lang", () => {
    render(
      <ChakraCategoryRow chakra="heart" category="Love stories" count={12} onOpen={() => {}} />
    );
    expect(
      screen.getByRole("button", { name: /Love stories Heart · Anahata अनाहत 12/ })
    ).toBeInTheDocument();
    expect(screen.getByText("अनाहत")).toHaveAttribute("lang", "sa");
  });

  it("timeline samples carry lang", () => {
    render(
      <LanguageCulturalTimeline
        language="Tamil"
        eras={[
          {
            period: "c. 300 BCE",
            title: "Sangam",
            sample: "யாதும் ஊரே",
            sampleLang: "ta",
            transliteration: "yātum ūrē",
          },
        ]}
      />
    );
    expect(screen.getByText("யாதும் ஊரே")).toHaveAttribute("lang", "ta");
  });

  it("lineage is an ordered list; TLP says who can see", () => {
    render(
      <>
        <AncestralChainFlow
          title="Gharana"
          chain={[
            { id: "1", name: "Ustad A" },
            { id: "2", name: "Pandit B" },
          ]}
        />
        <TLPClassificationCard level="AMBER" title="Budget v3" />
      </>
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByText("Who can see this: Your organisation and its clients")
    ).toBeInTheDocument();
  });
});
