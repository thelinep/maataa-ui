import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { BeingAvatar } from "./BeingAvatar";
import { CrewIdCard, type CrewPerson } from "./CrewIdCard";
import { CrewProfile } from "./CrewProfile";
import { StarRating } from "./StarRating";

const asha: CrewPerson = {
  id: "VFS-0142",
  name: "Asha Rao",
  designation: "1st Assistant Camera",
  department: "Camera",
  phone: "+91 98100 11111",
};
const moti: CrewPerson = {
  id: "VFS-A07",
  name: "Moti",
  designation: "Animal actor",
  department: "Animal handling",
  species: ["dog"],
};

describe("BeingAvatar", () => {
  it("names species, and keeps health hidden unless allowed", () => {
    const { rerender } = render(
      <BeingAvatar
        name="Moti"
        species={["dog"]}
        health={[{ label: "Vet check", state: "watch" }]}
      />
    );
    expect(screen.getByRole("list", { name: "Species" })).toHaveTextContent("Dog");
    expect(screen.queryByText("Vet check")).not.toBeInTheDocument();
    rerender(
      <BeingAvatar
        name="Moti"
        species={["dog"]}
        health={[{ label: "Vet check", state: "watch" }]}
        showHealth
      />
    );
    expect(screen.getByRole("list", { name: "Health" })).toHaveTextContent("Vet check · Watch");
  });

  it("shows hybrid species, a condition for characters and hit points for games", () => {
    const { rerender } = render(
      <BeingAvatar name="Vyom" species={["human", "robot"]} variant="character" vitality={35} />
    );
    expect(screen.getByRole("meter", { name: "Condition" })).toHaveAttribute(
      "aria-valuetext",
      "Badly hurt"
    );
    expect(screen.getByRole("list", { name: "Species" })).toHaveTextContent(/Human.*Robot/);
    rerender(<BeingAvatar name="Vyom" species={["robot"]} variant="game" vitality={80} />);
    expect(screen.getByText("80 / 100 HP")).toBeInTheDocument();
  });

  it("puts everything in one name when compact", () => {
    render(
      <BeingAvatar
        name="Moti"
        species={["dog"]}
        health={[{ label: "Fit", state: "ok" }]}
        showHealth
        compact
      />
    );
    expect(screen.getByRole("img", { name: "Moti, Dog, health: OK" })).toBeInTheDocument();
  });
});

describe("StarRating", () => {
  it("says the rating in words, to one decimal", () => {
    render(<StarRating value={4.3} count={23} />);
    expect(
      screen.getByRole("img", { name: "Rated 4.3 out of 5 from 23 ratings" })
    ).toBeInTheDocument();
  });
});

describe("CrewIdCard", () => {
  it("prints the front and back", () => {
    render(
      <CrewIdCard
        person={asha}
        production="Bhairav"
        organisation="Vesahe Film Solutions"
        validUntil={new Date(2027, 2, 31)}
        emergency={{ name: "Ravi Rao", relation: "Brother", phone: "+91 98100 22222" }}
      />
    );
    const front = screen.getByRole("region", { name: "ID card, front" });
    expect(within(front).getByText("Asha Rao")).toBeInTheDocument();
    expect(within(front).getByText("Camera")).toBeInTheDocument();
    expect(within(front).getByText("VFS-0142")).toBeInTheDocument();
    expect(within(front).getByRole("img", { name: "QR code for Asha Rao" })).toBeInTheDocument();
    const back = screen.getByRole("region", { name: "ID card, back" });
    expect(within(back).getByText("Ravi Rao (Brother)")).toBeInTheDocument();
    expect(within(back).getByText("+91 98100 22222")).toBeInTheDocument();
  });

  it("translates built-in department names", () => {
    render(
      <LocaleProvider locale="hi-IN">
        <CrewIdCard person={moti} production="Bhairav" organisation="VFS" side="front" />
      </LocaleProvider>
    );
    expect(screen.getByText("पशु देखभाल")).toBeInTheDocument();
  });
});

describe("CrewProfile", () => {
  const props = {
    person: asha,
    credits: [{ title: "Bhairav", role: "1st AC", year: 2026 }],
    tools: [{ name: "Follow focus", detail: "Tilta Nucleus-M", owned: true }],
    utils: [{ label: "Languages", value: "Hindi, Marathi, English" }],
    rating: { value: 4.6, count: 12 },
    rates: [{ label: "Day rate (12 hours)", amount: 9000 }],
    callSheets: [
      {
        id: "c1",
        date: new Date(2026, 10, 26),
        callTime: "06:30",
        location: "Film City",
        status: "confirmed" as const,
      },
    ],
    documents: [{ id: "d1", name: "Contract", status: "pending" as const }],
    emergency: { name: "Ravi Rao", phone: "+91 98100 22222" },
    health: [{ label: "Fit to work", state: "ok" as const }],
    production: "Bhairav",
    organisation: "Vesahe Film Solutions",
  };

  it("has a tab for each part, without Health unless allowed", () => {
    render(<CrewProfile {...props} />);
    const names = screen.getAllByRole("tab").map((t) => t.textContent);
    expect(names).toEqual([
      "Work",
      "Tools",
      "Utils",
      "Rating",
      "Pricing",
      "Call sheets",
      "Availability",
      "Documents",
      "Emergency contact",
      "iCard",
    ]);
    expect(screen.getByText("Department: Camera")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Bhairav" })).toBeInTheDocument();
  });

  it("shows pricing in rupees, call sheet and document states, and health when allowed", async () => {
    render(<CrewProfile {...props} canSeeHealth />);
    await userEvent.click(screen.getByRole("tab", { name: "Pricing" }));
    expect(screen.getByText("₹9,000")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Call sheets" }));
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Documents" }));
    expect(screen.getByText("Waiting for signature")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Health" }));
    expect(screen.getByText("Only production and medical roles can see this.")).toBeInTheDocument();
    expect(screen.getByText(/Fit to work/)).toBeInTheDocument();
  });
});
