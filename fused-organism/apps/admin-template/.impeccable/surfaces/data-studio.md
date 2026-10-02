# MAATAA Data Studio

- **Mode:** Operate
- **Audience:** Central MAATAA platform operators and application architects.
- **Purpose:** Inspect registry contracts, trace architecture decisions, prepare a versioned application IR, and observe generated artifacts without administering runtime application data.
- **Visual inheritance:** Keep the established MAATAA paper-and-ink workspace shell, tokens, spacing, and control language. Data Studio is a first-party operator workspace, not a separate theme.
- **Primary path:** Overview → Catalog → Compose → Generated applications → Governance → System.
- **Critical interaction:** Save an Application IR draft locally, with visible boundaries between examples, canonical registry inputs, generated outputs, and disconnected services.
- **Truth constraints:** The workspace contains 21 platform JSON Schema contracts and a 90-entry MAATAA component registry. It does not contain the Domain Registry catalog, context/flow packages, resolver, compiler, generated application artifacts, governance service, MCP adapter, or audit service. The supplied Data Studio brief's 352 tables, 17 contexts, six products, and talent-profile example are reference claims, not live registry records.
- **Mutation boundary:** IR drafts may be edited and stored in this browser. Canonical registry artifacts, migrations, generated apps, infrastructure, and production records are not changed.
- **Query boundary:** Read query is an observe-only concept surface. No SQL execution is connected; future execution requires a SELECT-only parser, a single target database, schema allowlists, limits, side-effect blocking, and query auditing.
- **Responsive behavior:** Preserve readable architecture chains and tab labels; let contract lists and detail views stack on narrow screens; keep multi-step composition and registry source status visible.
