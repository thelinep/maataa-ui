# M3 — Product Integration + Camera Experimental Package Scope and Acceptance

Status: **SCOPE DEFINED · IMPLEMENTATION NOT STARTED**

M3 is a single milestone with two coordinated workstreams: a bounded TLPS product integration, and the experimental camera package needed to support that scenario. The camera package is not a separate milestone numbered M3.

M3 takes the certified M2 kernel into a bounded product integration. M2 evidence alone does not establish product completeness. Its initial vertical-slice candidate is the spatial scene/camera-control preview in the TLPS application, using `@tlps/domain-primitives`; this means a rendered scene-preview integration, not physical camera capture or a certified device runtime. M3 covers rendered MAATAA surfaces, only the React integrations required by that scenario, one reviewed domain-pack integration, and explicit disposition of the route debt listed below.

## Objective

Deliver one source-backed, end-to-end product slice that composes MAATAA primitives and tokens in a host application, exercises the React adapter through its public API, and integrates one explicitly selected domain package. Keep kernel contracts stable and keep experimental device, spatial, and domain behavior outside the certified kernel unless separately reviewed and promoted.

The existing M3 camera milestone remains the candidate integration scenario. `@tlps/domain-primitives` is a candidate package, not yet promoted by this scope. Its existing canvas and WebGL surfaces do not by themselves prove product integration, device capability, simulation, digital-twin behavior, or production readiness.

## In scope

1. **Rendered component slice** — choose and inventory the components required by the end-to-end scenario; compose them from the existing tokens/primitives; document supported states and interaction contracts. Do not imply that the full headless primitive inventory is rendered or certified.
2. **React integration** — implement only the deferred hooks the scenario actually needs. Give each shipped hook a public contract, cleanup/error behavior, deterministic adapter tests, and host-application integration coverage. Unused candidates remain deferred and absent from the public API.
3. **One domain-pack integration** — select the pack and owning application explicitly before implementation. Prove package ownership, dependency direction, exports, host composition, and a working user path. Broader domain-pack promotion is outside M3.
4. **Route and flow integrity** — triage all 11 source-referenced route gaps below and close any that intersect the M3 scenario before claiming that slice is complete. Broader product-completeness claims require every one of these 11 gaps to be resolved or retired in authoritative source, as well as closure across the rest of the route/flow inventory.
5. **Release evidence** — produce a reproducible integration record that pins the source commit, package/API versions, selected routes, test/browser matrix, known exclusions, and exact results. Keep M2 certification, M3 integration evidence, and production authorization distinct.

## Acceptance criteria

M3 is complete only when all criteria pass for the declared slice:

| Gate | Acceptance |
|---|---|
| Scope and ownership | The scenario, host application, rendered-component inventory, hooks, domain pack, route set, and out-of-scope items are named in a reviewed manifest. No package is promoted by implication. |
| Rendered UI | Every in-scope component has documented props, states, keyboard behavior, focus behavior, and responsive behavior. The end-to-end scenario has no inert primary action or placeholder presented as a working capability. |
| React API | Only implemented hooks are exported. Hook behavior is tested against the adapter contract and in the real host app, including subscription cleanup, stale/unmounted updates, errors, and repeated mount/unmount where applicable. Public API and peer/dependency boundaries validate. |
| Domain integration | The selected pack is imported through its declared public entry point, respects one-way package dependencies, and is exercised in the host app. Any promotion is explicit, versioned, reviewed, and covered by package-boundary checks. |
| Routes and flows | Every M3-scenario flow reference resolves to an executable registered static/dynamic route, an approved alias backed by source evidence, or is retired from the authoritative flow source with review evidence. No `UNRESOLVED` or `DECLARED_UNREGISTERED` route may be counted as complete. Before a broader product-completeness claim, all 11 routes below must have such a disposition. |
| Interaction proof | The end-to-end scenario is demonstrated in the host app with deterministic evidence for its primary and failure paths. Any hardware, camera permission, browser, or network dependency is named and tested only to the level actually supported. |
| Quality evidence | Focused unit/integration tests, build/type checks, keyboard/focus/accessibility checks, responsive checks, and the applicable pinned-browser checks pass. The report names its source commit and exact commands/results. |
| Claim boundary | M3 completion makes no claim of all 38 primitives rendered, all deferred hooks implemented, all domain packs promoted, broad cross-browser certification, full WCAG conformance, hardware certification, migration readiness, or deployment approval unless separate evidence proves each claim. |

## Route debt requiring disposition

Current registry evidence records **11 unresolved, non-executable routes**. Each is absent from the 284-page application manifest and has no registered dynamic pattern or authored alias. They are explicitly deferred as `missing-source` to registry version `1.1.0`; that deferral keeps the registry publishable but does not resolve the route. `routes/deferred.json`, `routes/findings.json`, and `routes/resolutions.json` remain the route-status authorities.

| Route | Source flow | Current evidence | Required disposition |
|---|---|---|---|
| `/mobile/auth/create-organisation` | `TLPS-FLOW-005` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/auth/invite` | `TLPS-FLOW-006` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/auth/accept-invite` | `TLPS-FLOW-006` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/auth/sign-out` | `TLPS-FLOW-008` | Missing from manifest, patterns, and aliases | Determine from the flow source whether this is a navigable confirmation page or an action; register the correct supported route or remove the route reference with review evidence. |
| `/offline` | `TLPS-FLOW-115` | Missing from manifest, patterns, and aliases; `/mobile/253/offline-sync-status` is a different route | Register the intended offline experience, map it only if authoritative source proves equivalence, or retire/update the flow reference with review evidence. |
| `/mobile/admin/api-keys` | `TLPS-FLOW-119` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/admin/webhooks` | `TLPS-FLOW-120` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/admin/integrations` | `TLPS-FLOW-121` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/admin/audit-log` | `TLPS-FLOW-122` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/admin/data-retention` | `TLPS-FLOW-123` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |
| `/mobile/admin/feature-flags` | `TLPS-FLOW-124` | Missing from manifest, patterns, and aliases | Register a source-backed executable page/route, or retire/update the source flow with review evidence. |

The route resolution policy is fail-closed: do not infer a page from a path name, derive a dynamic pattern without the required route evidence, or add an alias solely to clear a count. A route is closed only when the source-backed implementation is registered and executable, or the authoritative source no longer references it and that change is reviewed. Until all 11 are disposed, the registry may retain its current informational deferrals, but MAATAA must not describe the referenced route set—or the broader product—as complete.

## M3 completion statement

The permitted M3 claim is limited to the named scenario and its evidence. “Product complete” remains unavailable while any of the 11 routes below (or any other authoritative flow route) is unresolved, any claimed component/hook/domain integration lacks its acceptance evidence, or any required capability is only a preview. Registry/schema readiness and migration/deployment approval remain separate gates.
