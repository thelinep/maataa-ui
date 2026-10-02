# Domain and server dashboard

- **Mode:** Operate
- **Audience:** Central MAATAA platform operator (confirmed)
- **Build path:** Comp first (confirmed)
- **Approved composition:** `../mocks/decision/portfolio-and-services.png`
- **First viewport:** A clear page title and purpose sit above a local-draft boundary strip. An application registry fills the left two-thirds, listing each app's domains, repository connection, server assignment, and verification state. A service-coverage panel uses the right rail. A server capability inventory continues below the application table.
- **Signature interaction:** Add or edit an application, its domain list and repository URL; add a server and assign its capabilities and consuming applications. Every change remains a browser-local draft.
- **Responsive behavior:** Keep the task hierarchy on narrow screens by stacking service coverage and server inventory under the application registry; do not compress the registry into unreadable columns.
- **Truth constraints:** TLPS / `tlps.in` and NEVO Events / `nevoevents.in` are user-provided examples, shown as unverified. Repository URLs and servers are unknown and must remain unconfigured until entered by the operator. Never imply DNS, Git, server, deployment, or API changes.
- **Visual inheritance:** Retain the existing MAATAA shell, paper-and-ink theme, familiar controls, border language, and semantic status colors. The approved comp's dark rendering reflects the current appearance preference; do not hard-code the feature to dark mode.
