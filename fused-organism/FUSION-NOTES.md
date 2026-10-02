# MAATAA fused organism — integration notes

The 0.4.1 governed kernel now shares a workspace with the extracted MAATAA and TLPS package boundaries:

```text
@maataa/tokens → @maataa/primitives → @maataa/ui
                       └────────────→ @tlps/{domain,workflow,evidence,generative}-primitives
                       └────────────→ @tlps/{composites,templates}
```

`@maataa/tokens` owns the design scales; `@maataa/primitives` owns reusable components and the master inventory; `@maataa/ui` owns the wider visual component library. The six TLPS packages own registry-scoped catalogs and buildable package entrypoints. Catalog entries marked `planned` remain future work, not shipped UI. The React package remains a host-provided peer.

The old `_to_delete/dist.stale-1788963495` output is retained under `legacy-artifacts/maataa-ui/` for inspection only. It is not an input to builds or package exports.

`npm run build` compiles all nine canonical packages and both React applications. `npm run build:ui` builds the nine packages in dependency order and emits Node-compatible ESM relative imports. The prior kernel-only PASS remains historical and is not certification for this workspace.

## Current verification

- Product suites: kernel 49/49, React adapter 5/5, MAATAA UI 726/726, admin application 5/5.
- Nine-package build, integrated application build, package exports, workspace boundaries, UI typecheck, UI formatting, and package entrypoint imports: passed.
- UI lint: 0 errors and 4 existing warnings in `Checkbox`, `Select`, and `Popover`.
- Toolchain gate: not passed; this workspace requires npm 10.9.x and the current host provides npm 12.0.2.
- A full offline install remains unverified because a locked dependency tarball is absent from the local npm cache. The lockfile itself was regenerated offline successfully.
- Browser certification has not been rerun as part of this extraction; the prior closeout reported `CHROMIUM_NOT_FOUND`.

The UI adapter remains a client-side guard: hosts must authenticate and re-authorize consequential operations on the server.
