# MAATAA Workspace

Runnable, responsive operator workspace composed from the MAATAA React design system.

## Run it

From the repository root, run `npm run serve` and open `http://127.0.0.1:4173/apps/admin-template/`. `npm run build` compiles the MAATAA UI package, then builds this React application and TLPS into `dist/apps/`.

## Included

- A React application shell composed from MAATAA `AppShell`, `Sidebar`, `TopNav`, `Button`, `Card`, and `ThemeProvider` primitives.
- One application registry owning applications, their routes/pages, domains and route mappings, repository/build settings, environments, and deployment records.
- A navigation tree derived from the active application's registered routes; no sibling Applications or Pages catalog is used for runtime routing.
- A separate infrastructure registry of servers and capabilities, with assignments scoped to application environments.
- A workspace launchpad, fifteen requested modules, and the Domains & Servers operator screen.
- Activities, authentication, system, invoice, pricing, and skeleton pages.
- Left, right, horizontal, and folded navigation; toolbar and footer placement; 24 content layout choices.
- Color, light/dark, language-shell, and RTL settings.
- App-owned route records select route templates, with route-level ESM imports for screen code splitting.
- Local preview interactions for tasks, notes, sprint cards, contacts, products, and projects.
- Application and infrastructure registries are saved as separate browser-local drafts. TLPS (`tlps.in`) and NEVO Events (`nevoevents.in`) are unverified domain examples.
- Host adapter seams for JWT authentication and screen permissions.

## Host integration boundary

This app ships with illustrative local data. The application and infrastructure registries store drafts in this browser only: they do not check DNS, connect to Git, probe servers, deploy applications, or store credentials. The TLPS page ownership list is sourced from its application manifest; its screen implementations still require a host integration to become live product pages. This preview does not send email or messages, charge customers, connect storage/calendar providers, mint or store JWTs, or enforce server authorization. Those capabilities belong to host services. Provide `window.MAATAA_ADMIN_AUTH` for auth methods and `window.MAATAA_ADMIN.permissions` from a trusted host; protected APIs must still enforce authorization on the server.

Tasks, notes, and platform configuration drafts use this browser's local storage. Other preview changes last only for the current page session. None is an authoritative shared data source.

## Style tools

`.eslintrc.json` extends `airbnb-base`, and `.prettierrc.json` sets the matching JavaScript formatting defaults. A host project must provide ESLint, `eslint-config-airbnb-base`, and Prettier to run those optional tools.
