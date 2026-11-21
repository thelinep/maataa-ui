import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeliveryStatusList } from "./DeliveryStatusList";

describe("DeliveryStatusList", () => {
  it("puts failures first and offers resend", async () => {
    const onResend = vi.fn();
    render(
      <DeliveryStatusList
        onResend={onResend}
        records={[
          { id: "1", name: "Asha", channel: "email", status: "opened" },
          {
            id: "2",
            name: "Ravi",
            channel: "sms",
            status: "bounced",
            error: "Number not reachable",
          },
        ]}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/1 of 2 opened · 1 not delivered/);
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Ravi");
    await userEvent.setup().click(screen.getByRole("button", { name: "Resend to Ravi" }));
    expect(onResend).toHaveBeenCalledWith("2");
  });
});
