import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("has a contentinfo landmark, named navs and social links", () => {
    render(
      <SiteFooter
        brand="maataa"
        columns={[{ heading: "Product", links: [{ label: "Pricing", href: "/pricing" }] }]}
        social={[{ name: "Instagram", href: "https://instagram.com/x", icon: "IG" }]}
        legal={[{ label: "Privacy", href: "/privacy" }]}
        copyright="© 2026 Vesahe Film Solutions"
      />
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Product" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Legal" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Instagram (opens in a new tab)" })
    ).toBeInTheDocument();
  });
});
