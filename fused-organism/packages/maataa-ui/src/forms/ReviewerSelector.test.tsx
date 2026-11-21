import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewerSelector, validateReviewers } from "./ReviewerSelector";

const roles = [
  { id: "lp", label: "Line producer" },
  { id: "acc", label: "Accountant" },
  { id: "opt", label: "Advisor", required: false },
];
const people = [
  { id: "me", name: "Hemant" },
  { id: "a", name: "Asha" },
  { id: "b", name: "Ravi" },
];

describe("validateReviewers", () => {
  it("requires required roles only", () => {
    const e = validateReviewers(roles, {}, people);
    expect(Object.keys(e)).toEqual(["lp", "acc"]);
  });
  it("rejects the author and duplicates", () => {
    const e = validateReviewers(roles, { lp: "me", acc: "a", opt: "a" }, people, "me");
    expect(e.lp).toMatch(/author/);
    expect(e.opt).toMatch(/Asha is already the accountant/);
  });
});

describe("ReviewerSelector", () => {
  it("leaves the author out of the options", () => {
    render(
      <ReviewerSelector
        roles={roles}
        people={people}
        value={{}}
        onChange={() => {}}
        authorId="me"
      />
    );
    const lp = screen.getByRole("combobox", { name: "Line producer" });
    expect(Array.from((lp as HTMLSelectElement).options).map((o) => o.text)).toEqual([
      "Not assigned",
      "Asha",
      "Ravi",
    ]);
  });
  it("ties errors to the select", () => {
    render(
      <ReviewerSelector roles={roles} people={people} value={{}} onChange={() => {}} showErrors />
    );
    expect(screen.getByRole("combobox", { name: "Line producer" })).toHaveAccessibleDescription(
      "Choose a line producer."
    );
  });
  it("reports changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ReviewerSelector roles={roles} people={people} value={{}} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox", { name: "Accountant" }), "b");
    expect(onChange).toHaveBeenCalledWith({ acc: "b" });
  });
});
