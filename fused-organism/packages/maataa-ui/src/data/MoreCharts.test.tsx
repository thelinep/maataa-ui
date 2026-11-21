import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  HorizontalBarChart,
  GroupedBarChart,
  ThresholdBarChart,
  PieChart,
  FunnelChart,
  WaterfallChart,
  RadarChart,
  Heatmap,
} from "./MoreCharts";

describe("MoreCharts", () => {
  it("names each chart with a summary and offers the data table", async () => {
    const user = userEvent.setup();
    render(
      <HorizontalBarChart
        title="Spend by department"
        data={[
          { label: "Camera", value: 12 },
          { label: "Art", value: 30 },
        ]}
        unit="₹ lakh"
        sort
      />
    );
    expect(
      screen.getByRole("img", { name: "2 bars. Highest is Art at 30 ₹ lakh." })
    ).toBeInTheDocument();
    await user.click(screen.getByText("Show data as a table"));
    const table = screen.getByRole("table");
    expect(within(table).getByRole("rowheader", { name: "Art" })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: "Value (₹ lakh)" })).toBeInTheDocument();
  });

  it("threshold chart lists the bars over the line", () => {
    render(
      <ThresholdBarChart
        title="Daily spend"
        threshold={10}
        thresholdLabel="Daily cap"
        data={[
          { label: "Mon", value: 8 },
          { label: "Tue", value: 14 },
        ]}
      />
    );
    expect(
      screen.getByRole("img", { name: "1 of 2 over the daily cap of 10: Tue." })
    ).toBeInTheDocument();
  });

  it("pie, funnel, waterfall, radar, grouped and heatmap summaries", () => {
    render(
      <>
        <PieChart
          title="Budget"
          data={[
            { label: "Above line", value: 30 },
            { label: "Below line", value: 70 },
          ]}
        />
        <FunnelChart
          title="Casting"
          stages={[
            { label: "Applied", value: 200 },
            { label: "Auditioned", value: 40 },
            { label: "Cast", value: 10 },
          ]}
        />
        <WaterfallChart
          title="Cash"
          start={{ label: "Opening", value: 100 }}
          steps={[
            { label: "Grant", value: 50 },
            { label: "Shoot", value: -120 },
          ]}
        />
        <RadarChart
          title="Concept"
          axes={["Story", "Market", "Cast"]}
          series={[{ name: "Draft 2", values: [8, 4, 6] }]}
        />
        <GroupedBarChart
          title="Budget vs actual"
          categories={["Wk 1"]}
          series={[
            { name: "Budget", values: [5] },
            { name: "Actual", values: [6] },
          ]}
        />
        <Heatmap title="Crew load" rows={["Mon"]} columns={["AM", "PM"]} values={[[2, 9]]} />
      </>
    );
    expect(screen.getByRole("img", { name: /Largest is Below line at 70%/ })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /200 applied to 10 cast \(5% overall\)/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Starts at 100 and ends at 30 after 2 changes." })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /strongest on Story, weakest on Market/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Budget and Actual compared across 1 categories/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Highest: Mon, PM/ })).toBeInTheDocument();
  });
});
