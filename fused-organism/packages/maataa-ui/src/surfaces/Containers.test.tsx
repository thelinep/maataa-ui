import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ImageCard,
  ProfileCard,
  PricingTierCard,
  ServiceCard,
  InsetCard,
  CompareGrid,
  PreviewFrame,
  FullScreenModal,
} from "./Containers";

describe("Cards", () => {
  it("have headings and a single stretched link", () => {
    render(
      <>
        <ImageCard title="Monsoon Wedding" imageAlt="" eyebrow="Feature" href="/p/1" />
        <ProfileCard name="Asha Verma" role="Director" href="/people/asha" tags={["Drama"]} />
        <ServiceCard
          title="Colour grade"
          description="Feature-length grade"
          price="₹2,50,000"
          turnaround="3 weeks"
        />
      </>
    );
    expect(screen.getByRole("heading", { name: "Monsoon Wedding" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Monsoon Wedding" })).toHaveAttribute("href", "/p/1");
    expect(screen.getByRole("link", { name: "Asha Verma" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByText("3 weeks")).toBeInTheDocument();
  });

  it("pricing tier says what is included and names the button", async () => {
    const pick = vi.fn();
    render(
      <PricingTierCard
        name="Studio"
        price="₹4,999"
        period="per month"
        ctaLabel="Choose"
        onSelect={pick}
        features={[
          { label: "10 projects", included: true },
          { label: "Distribution tools", included: false },
        ]}
      />
    );
    expect(screen.getByText(/10 projects/)).toHaveTextContent("10 projects, included");
    expect(screen.getByText(/Distribution tools/)).toHaveTextContent(
      "Distribution tools, not included"
    );
    await userEvent.click(screen.getByRole("button", { name: "Choose Studio" }));
    expect(pick).toHaveBeenCalled();
  });

  it("inset card is a named region; compare grid is a list", () => {
    render(
      <CompareGrid label="Options">
        <InsetCard title="Plan A">A</InsetCard>
        <InsetCard title="Plan B">B</InsetCard>
      </CompareGrid>
    );
    expect(screen.getByRole("region", { name: "Plan A" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("preview frame switches width", async () => {
    render(
      <PreviewFrame title="Call sheet" code="<CallSheet />">
        <p>preview</p>
      </PreviewFrame>
    );
    await userEvent.click(screen.getByRole("radio", { name: "Phone" }));
    expect(
      screen.getByRole("region", { name: "Call sheet preview, 375 pixels wide" })
    ).toBeInTheDocument();
  });
});

describe("FullScreenModal", () => {
  it("focuses the title, traps Tab, closes on Escape and returns focus", async () => {
    const user = userEvent.setup();
    function H() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Edit script</button>
          <FullScreenModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Edit scene 4"
            actions={<button>Save</button>}
          >
            <textarea aria-label="Text" />
          </FullScreenModal>
        </>
      );
    }
    render(<H />);
    const opener = screen.getByRole("button", { name: "Edit script" });
    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Edit scene 4" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Edit scene 4" })).toHaveFocus();
    screen.getByRole("textbox", { name: "Text" }).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(opener).toHaveFocus();
  });
});
