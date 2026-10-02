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
- Role-filtered route previews and generic, manifest-driven page layouts.
- Configurable left, right, horizontal, and folded navigation, plus above/below toolbar and footer placement.
- Responsive layout, reduced-motion handling, keyboard focus states, escape-to-close dialogs, and modal focus containment.

## Preview boundary

The supplied manifest is treated as page metadata, not executable instructions. Shipped route data omits role emails, passwords, and Redux implementation claims. Records, metrics, action feedback, identities, approvals, and activity are illustrative. Authentication/JWT, authorization enforcement, account-backed/server persistence, messaging, calendar sync, payments, evidence services, and external provider connections are not implemented by this preview. Spatial layout drafts are stored only in this browser and can be exported as a file.
