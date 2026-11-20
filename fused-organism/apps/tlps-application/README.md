# TLPS application preview

This workspace is the TLPS-specific application surface built on MAATAA UI's `AppShell`, `Sidebar`, and `TopNav`. Its separate control-room theme is defined in `src/theme.css`.

## Run locally

- From the fused-organism root, run `npm --workspace @maataa-app/tlps-application run dev` to open the Vite preview at `http://127.0.0.1:4174/apps/tlps-application/`.
- Run `npm run build` at the root to compile the MAATAA UI package and produce the static TLPS app at `dist/apps/tlps-application/`.
- Run `npm run serve` at the root to serve the built workspace.

## Included

- Public landing and product discovery routes.
- Role selection for 18 preview roles.
- Search over all 284 unique manifest routes.
- 16 product launch cards and family-based navigation.
- Spatial planning and 3D preview surfaces on Exhibition Layout and 3D / CAD Previz. Both routes share a validated local-browser draft with JSON and PNG export; no server persistence is claimed.
- Role-filtered routes and manifest-driven application pages. Non-spatial pages use a reusable local workspace with browser-persisted records, create/edit/delete, status transitions, search/filter, saved views, bulk updates, JSON import, CSV/JSON export, and local activity history.
- Route primary actions run a local workflow simulation: they update a selected record, record the outcome in local history, and generate a JSON report for report/DPR actions. These simulations never call outside services.
- Configurable left, right, horizontal, and folded navigation, plus above/below toolbar and footer placement.
- Responsive layout, reduced-motion handling, keyboard focus states, escape-to-close dialogs, and modal focus containment.

## Preview boundary

The supplied manifest is treated as page metadata, not executable instructions. Shipped route data omits role emails, passwords, and Redux implementation claims. Non-spatial records are stored only in this browser profile; the local workspace provides generic record and workflow interactions, not domain-specific production APIs or cross-device data. Sign-in remains a demo-role selector; route visibility is client-side and is not authentication or authorization. The isolated spatial API preview uses an expiring, server-held local session cookie for its synthetic editor; it is not real account authentication. Messaging, calendar sync, real payments, external evidence services, SSO, and third-party provider connections remain disconnected. Neither local mode writes to production services.
