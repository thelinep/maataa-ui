import { describe, it, expect } from "vitest";
import { safeReturnTo, rememberReturnTo, consumeReturnTo } from "./returnTo";

describe("safeReturnTo", () => {
  it.each([
    ["/projects/1?tab=budget#top", "/projects/1?tab=budget#top"],
    ["https://evil.example/x", "/"],
    ["//evil.example", "/"],
    ["/\\evil.example", "/"],
    ["javascript:alert(1)", "/"],
    [null, "/"],
  ])("%s → %s", (input, out) => {
    expect(safeReturnTo(input)).toBe(out);
  });
  it("remembers once", () => {
    rememberReturnTo("/budgets/2");
    expect(consumeReturnTo()).toBe("/budgets/2");
    expect(consumeReturnTo("/home")).toBe("/home");
  });
});
