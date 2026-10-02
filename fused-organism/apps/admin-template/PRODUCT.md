# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Central MAATAA platform operators managing application registrations and infrastructure assignments.

## Product Purpose

Provide one workspace to register applications and infrastructure, and to inspect the architecture metadata and composition drafts that describe generated applications.

## Operating Context

The operator needs to see which domains and source repositories belong to each application, which server provides each runtime capability, how a generated application traces back to intent and registry inputs, and where sources or configuration remain unavailable or unverified.

## Capabilities and Constraints

- The requested example applications are TLPS at `tlps.in` and NEVO Events at `nevoevents.in`.
- Repository URLs, server inventory, DNS/provider connections, and a control-plane API were not supplied. Applications own their routes, domains, repository/build configuration, environments, and deployment records; server capabilities are assigned to those app environments.
- Configuration edits stay in this browser's local preview; they do not write DNS, Git, server, or deployment settings.
- Do not invent repository addresses, server records, ownership, or verification status.
- The exact API contract, authorization model, and live-configuration workflow remain open decisions.
- Data Studio reads the workspace's JSON Schema contracts and MAATAA component registry. No canonical Domain Registry, context/flow packages, resolver, compiler, generated artifacts, governance service, MCP adapter, or audit service is connected.
- Example architecture values copied from the Data Studio brief must remain labeled as examples; local IR drafts cannot mutate canonical registry data.

## Brand Commitments

This operator workspace uses the MAATAA design system's React primitives and templates. Its route navigation is generated from the application registry. The product shell and reusable visual primitives remain separate from application-specific pages and infrastructure records.

## Evidence on Hand

The user's request names `tlps.in` and `nevoevents.in` and asks for application-to-domain, application-to-repository, and server-to-capability configuration. No connected infrastructure, credentials, provider accounts, or operational data were supplied.

## Product Principles

- Keep the app, its domains, source repository, and assigned services visible together.
- Make verification and connection state explicit.
- Keep draft configuration separate from live infrastructure changes.
- Leave unknown infrastructure unconfigured until an operator supplies it.

## Accessibility & Inclusion

Preserve the template's keyboard-operable controls, visible focus, and responsive layout.
