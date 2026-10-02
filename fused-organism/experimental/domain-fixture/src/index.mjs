import { primitive } from "@maataa/core";
import { createRenderPlan } from "@maataa/renderer";

export function fixtureDomainSurface(node) {
  return {
    shell: primitive("Box", { "data-domain-fixture": true }),
    plan: createRenderPlan(node)
  };
}
