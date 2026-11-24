# Pending surface certification matrix

Status: proposed acceptance criteria; no test execution or certification implied.
Use existing Node test, Vitest, Storybook accessibility and pinned Chromium certification lanes. Native tests require actual platform runtimes. Each case requires a current-head result and reproducible evidence.

| ID | Acceptance scenario | Required evidence |
|---|---|---|
| IC-01 | Every recovered archive is inventoried; bytes and hashes match originals | Archive manifest and independent hash log |
| IC-02 | All historical IDs and aliases resolve or explicitly remain unresolved | Full source-to-crosswalk comparison |
| IC-03 | No artwork overwritten; exact, structural and visual duplicates distinguished | Hashes, SVG parser results, rendered comparison and reviewer decisions |
| IC-04 | Registry schema, path containment, unique IDs, provenance, variants and packs | Node acceptance tests and negative fixtures |
| IC-05 | Manager searches exact IDs, aliases, labels and domains; empty and invalid queries handled | Browser E2E |
| IC-06 | Manager previews original artwork in light/dark themes; keyboard access and export fidelity | Browser screenshots, axe, exported hash |
| IC-07 | MAATAA UI adapter resolves canonical and historical IDs; unknown IDs handled safely | Consumer build and integration tests |
| IC-08 | NEVO EOS adapter consumes pinned version without artwork duplication or breaking imports | Actual NEVO consumer build |
| IC-09 | Release rejects missing artifacts, unresolved blocking reviews, drift and stale CI | Negative release-gate tests |
| AI-01 | Model install verifies checksum and license; interrupted download resumes or cleans up | Real local model fixture |
| AI-02 | Local inference produces streamed response; stop cancels runtime | Real inference trace |
| AI-03 | Multi-turn chat, history, branching, memory and context isolation | Persistence and runtime tests |
| AI-04 | Markdown, code, table, media and attachment handling; unsafe markup rejected | UI and security fixtures |
| AI-05 | Tool calls require explicit permissions and approval; denial causes no side effect | Adapter execution trace |
| AI-06 | Offline inference works after disconnect; no unexpected network egress | Network capture and real inference |
| AI-07 | Model errors, out-of-memory, cancellation and retry recover safely | Fault injection |
| AI-08 | Export PDF, DOCX, Markdown and JSON with real content and correct file signatures | Export parser tests |
| WEB-01 | All 24 reference frames mapped to routes or states; navigation and reload work | Browser route inventory and screenshots |
| WEB-02 | Responsive layout, keyboard, reduced motion, contrast, offline PWA lifecycle | Pinned browser evidence |
| DESK-01 | All 24 desktop frames mapped; launch, local files, background mode and command palette | Packaged Electron runtime tests |
| DESK-02 | IPC authorization, path traversal rejection, crash recovery and restart persistence | Native security and lifecycle tests |
| MOB-01 | All 24 mobile frames mapped; onboarding, permissions, keyboard and touch interactions | Android/iOS device or emulator evidence |
| MOB-02 | Local storage, background/foreground, low-memory, offline and permission denial | Native runtime evidence |
| CORE-01 | All 21 core chatbot states represented and reusable | Component stories and state transition tests |
| LAND-01 | Seven landing sections, ten feature cards, four platform selectors and six ecosystem cards | DOM assertions and visual baseline |
| LAND-02 | Navigation and CTAs lead to real destinations; no invented metrics or dead controls | Link and interaction tests |
| LAND-03 | Mobile/tablet/desktop layout, accessibility, loading and image failure | Browser evidence |
| CERT-01 | Existing kernel, product, accessibility, visual and package consumer gates remain green | Current-head CI |
| CERT-02 | Fresh clone, reproducible build, versioned release, rollback and license review | Release artifacts and logs |

Do not replace missing runtime tests with mocked success. A missing implementation is a failing acceptance gate or explicitly blocked prerequisite. Generated design boards are references, not golden pixel baselines until reviewed. Record sample data as fixtures, not telemetry.
