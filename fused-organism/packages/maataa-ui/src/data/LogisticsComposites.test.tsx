import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  WeatherWidget,
  LocationComparisonCard,
  PermitTimelineStrip,
  VehicleCapacityCard,
  VehicleRateRow,
  CraftServiceMealCard,
  DietaryBadge,
  CrewPositionRow,
  DepartmentCoverageGrid,
  SkillMeter,
  PackageSummaryBar,
} from "./LogisticsComposites";

describe("LogisticsComposites", () => {
  it("weather flags risky hours in words", () => {
    render(
      <WeatherWidget
        place="Shimla"
        date="3 Dec"
        hours={[
          { time: "06:00", tempC: 4, rain: 10, windKmh: 8, condition: "clear" },
          { time: "14:00", tempC: 9, rain: 60, windKmh: 35, condition: "storm" },
        ]}
      />
    );
    expect(screen.getByText("Watch: 14:00")).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /14:00 Thunderstorm 9°C 60% 35 km\/h Rain risk, High wind/ })
    ).toBeInTheDocument();
  });

  it("location comparison marks best and total", async () => {
    const choose = vi.fn();
    render(
      <LocationComparisonCard
        title="Haveli options"
        criteria={["Look", "Access"]}
        options={[
          { id: "a", name: "Haveli A", scores: { Look: 5, Access: 2 }, cost: 40000 },
          { id: "b", name: "Haveli B", scores: { Look: 3, Access: 5 }, cost: 30000 },
        ]}
        onChoose={choose}
      />
    );
    expect(screen.getByText("Haveli B", { selector: "strong" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Choose Haveli A" }));
    expect(choose).toHaveBeenCalledWith("a");
  });

  it("permit steps, vehicles and diets", () => {
    render(
      <>
        <PermitTimelineStrip
          permit="MCD filming permit"
          steps={[
            { label: "Applied", date: "1 Nov", state: "done" },
            { label: "Police NOC", date: "10 Nov", state: "blocked" },
            { label: "Issued", date: "—", state: "upcoming" },
          ]}
        />
        <VehicleCapacityCard name="Van 2" seats={2} assigned={["A", "B", "C"]} />
        <DietaryBadge diet="jain" />
        <DietaryBadge diet="veg" compact />
      </>
    );
    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Van 2 seats" })).toHaveAttribute(
      "aria-valuetext",
      "3 of 2 seats, 1 over"
    );
    expect(screen.getByText("Jain")).toBeInTheDocument();
    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
  });

  it("meal, crew, coverage, skill and package", async () => {
    const act = vi.fn();
    render(
      <>
        <CraftServiceMealCard
          meal="Lunch"
          time="13:00"
          location="Unit base"
          items={[{ name: "Dal makhani", diets: ["veg"], allergens: ["dairy"] }]}
          counts={{ veg: 40, nonveg: 25 }}
        />
        <CrewPositionRow
          positions={[{ id: "1", department: "Camera", position: "Focus puller", status: "open" }]}
        />
        <DepartmentCoverageGrid
          days={["D1"]}
          departments={["Sound"]}
          needed={[[3]]}
          crewed={[[2]]}
        />
        <SkillMeter skill="Steadicam" level={4} />
        <PackageSummaryBar lines={[{ label: "Camera", amount: 10000 }]} onAction={act} />
      </>
    );
    expect(screen.getByText("Contains: dairy")).toBeInTheDocument();
    expect(screen.getByText("Open — not filled")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2 of 3 short" })).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Steadicam" })).toHaveAttribute(
      "aria-valuetext",
      "4 of 5, Expert"
    );
    expect(screen.getByText("₹11,800")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Request quote" }));
    expect(act).toHaveBeenCalled();
    render(
      <VehicleRateRow
        rates={[
          { id: "1", vehicle: "Innova", seats: 6, dayRate: 3200, extraHour: 300, extraKm: 18 },
        ]}
      />
    );
    expect(screen.getByRole("rowheader", { name: "Innova" })).toBeInTheDocument();
  });
});
