import assert from "node:assert/strict";
import React from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });

const { cleanup, fireEvent, render, screen } = await import("@testing-library/react");
const { createMaataaProduct } = await import("../packages/maataa-ui/dist/kernelIntegration.js");
const { ComplianceStatusDashboard } = await import("../packages/maataa-ui/dist/trust/components.js");
const Product = createMaataaProduct(React);

try {
  let dispatched = 0;
  const allowed = render(React.createElement(Product.Button, {
    policyDecision: { id: "policy:allow", outcome: "allow", reasonCodes: ["SERVER_DECISION"] },
    onAction: () => { dispatched += 1; },
    children: "Allowed action",
  }));
  fireEvent.click(screen.getByRole("button", { name: "Allowed action" }));
  assert.equal(dispatched, 1, "an explicit allow should dispatch once");
  cleanup();

  let clicked = 0;
  const denied = render(React.createElement(Product.Button, {
    policyDecision: { id: "policy:approval", outcome: "allow_with_approval", reasonCodes: ["HUMAN"], requiredApprovalIds: ["approval:1"] },
    onClick: () => { clicked += 1; },
    children: "Approval required",
  }));
  const deniedButton = screen.getByRole("button", { name: "Approval required" });
  assert.equal(deniedButton.disabled, true, "missing approval should disable the action");
  fireEvent.click(deniedButton);
  assert.equal(clicked, 0, "missing approval must not call the button handler");
  cleanup();

  render(React.createElement(ComplianceStatusDashboard));
  assert.equal(screen.getByRole("status", { name: "GDPR: Not connected" }).textContent, "Not connected");
  assert.equal(screen.queryByText("85%"), null, "the product must not invent a compliance score");
  cleanup();
  console.log("UI product smoke PASS (allowed dispatch, approval denial, truthful compliance state)");
} finally {
  cleanup();
  dom.window.close();
}
