import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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

const meta = { title: "Data/LogisticsComposites", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Weather: Story = {
  render: () => (
    <WeatherWidget
      place="Shimla"
      date="Thu 3 Dec"
      source="IMD forecast, 21 Nov"
      hours={[
        { time: "06:00", tempC: 3, rain: 5, windKmh: 8, condition: "fog" },
        { time: "09:00", tempC: 7, rain: 10, windKmh: 12, condition: "clear" },
        { time: "12:00", tempC: 11, rain: 25, windKmh: 18, condition: "partly" },
        { time: "15:00", tempC: 10, rain: 55, windKmh: 34, condition: "storm" },
        { time: "18:00", tempC: 6, rain: 40, windKmh: 20, condition: "rain" },
      ]}
    />
  ),
};

function CompareDemo() {
  const [c, setC] = useState<string | undefined>("b");
  return (
    <LocationComparisonCard
      title="Haveli for scenes 12–14"
      criteria={["Look", "Access for trucks", "Noise", "Power"]}
      options={[
        {
          id: "a",
          name: "Haveli Dharampura",
          scores: { Look: 5, "Access for trucks": 2, Noise: 2, Power: 3 },
          cost: 45000,
        },
        {
          id: "b",
          name: "Naughara house",
          scores: { Look: 4, "Access for trucks": 4, Noise: 3, Power: 4 },
          cost: 32000,
        },
        {
          id: "c",
          name: "Set at studio",
          scores: { Look: 3, "Access for trucks": 5, Noise: 5, Power: 5 },
          cost: 60000,
        },
      ]}
      chosenId={c}
      onChoose={setC}
    />
  );
}
export const Locations: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <CompareDemo />
      <PermitTimelineStrip
        permit="Filming permit — Chandni Chowk"
        authority="MCD + Delhi Police"
        steps={[
          { label: "Applied", date: "1 Nov", state: "done" },
          { label: "Site visit", date: "8 Nov", state: "done" },
          { label: "Police NOC", date: "15 Nov", state: "blocked" },
          { label: "Fee paid", date: "20 Nov", state: "upcoming" },
          { label: "Issued", date: "25 Nov", state: "upcoming" },
        ]}
      />
    </div>
  ),
};

export const Transport: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <VehicleCapacityCard
          name="Van 1 — Camera"
          detail="Tempo Traveller · DL 1C 4421"
          seats={12}
          assigned={["Arjun Rao", "Imran Sheikh", "Focus puller", "2nd AC", "DIT"]}
          driver="Ramesh"
          departs="04:45"
          from="Hotel"
          to="Jama Masjid"
        />
        <VehicleCapacityCard
          name="Car 3 — Cast"
          seats={3}
          assigned={["Ritu Sen", "Dev Malhotra", "Make-up", "Spot"]}
          departs="05:15"
          from="Hotel"
          to="Base"
        />
      </div>
      <VehicleRateRow
        rates={[
          {
            id: "1",
            vehicle: "Innova Crysta",
            seats: 6,
            dayRate: 3200,
            extraHour: 300,
            extraKm: 18,
            vendor: "Sharma Travels",
          },
          {
            id: "2",
            vehicle: "Tempo Traveller",
            seats: 12,
            dayRate: 5500,
            extraHour: 450,
            extraKm: 26,
          },
          { id: "3", vehicle: "Generator van 62.5 kVA", dayRate: 9000, extraHour: 900 },
        ]}
      />
    </div>
  ),
};

export const Food: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["veg", "nonveg", "egg", "vegan", "jain", "glutenfree", "nutfree", "halal"] as const).map(
          (d) => (
            <DietaryBadge key={d} diet={d} />
          )
        )}
      </div>
      <CraftServiceMealCard
        meal="Lunch"
        time="13:30"
        location="Unit base, Daryaganj"
        vendor="Annapurna Caterers"
        items={[
          { name: "Dal makhani", diets: ["veg", "glutenfree"], allergens: ["dairy"] },
          { name: "Butter chicken", diets: ["nonveg", "halal"], allergens: ["dairy", "nuts"] },
          { name: "Jeera rice", diets: ["veg", "vegan", "jain"] },
        ]}
        counts={{ veg: 42, nonveg: 28, jain: 4, vegan: 3 }}
      />
    </div>
  ),
};

export const Crew: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <CrewPositionRow
        positions={[
          {
            id: "1",
            department: "Camera",
            position: "DOP",
            name: "Arjun Rao",
            rate: 25000,
            status: "confirmed",
          },
          { id: "2", department: "Camera", position: "Focus puller", status: "open" },
          {
            id: "3",
            department: "Sound",
            position: "Mixer",
            name: "Meera Iyer",
            rate: 12000,
            status: "hold",
          },
          {
            id: "4",
            department: "Art",
            position: "Set dresser",
            name: "Kabir",
            rate: 4000,
            status: "confirmed",
          },
        ]}
      />
      <DepartmentCoverageGrid
        days={["D1", "D2", "D3", "D4"]}
        departments={["Camera", "Sound", "Art"]}
        needed={[
          [5, 5, 6, 5],
          [3, 3, 3, 0],
          [6, 4, 4, 2],
        ]}
        crewed={[
          [5, 4, 6, 5],
          [3, 3, 2, 0],
          [6, 4, 4, 2],
        ]}
      />
      <div style={{ display: "grid", gap: 4, maxWidth: 360 }}>
        <SkillMeter skill="Steadicam" level={4} />
        <SkillMeter skill="Drone (DGCA)" level={2} />
        <SkillMeter skill="Underwater" level={1} />
      </div>
    </div>
  ),
};

export const Package: Story = {
  render: () => (
    <PackageSummaryBar
      lines={[
        { label: "Camera kit", amount: 18500 },
        { label: "Lighting 5-tonne", amount: 22000 },
        { label: "Generator", amount: 9000 },
      ]}
      onAction={() => {}}
    />
  ),
};
