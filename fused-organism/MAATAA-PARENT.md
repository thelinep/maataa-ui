# MAATAA UI parent relationship

This directory is the fused application workspace owned by the MAATAA UI project at `..`. MAATAA UI is the repository/product parent; `fused-organism/` is its independently managed application workspace. It keeps its own `package.json`, lockfile, build graph, and validation commands because it coordinates multiple packages and applications.

## Ownership

- `packages/maataa-ui` contains the workspace's visual host package and composes its local tokens and primitives.
- `packages/domain-registry` is the versioned source registry for application composition and Data Studio.
- `apps/admin-template` is the operator console that reads and edits local registry drafts.
- `apps/tlps-application` is a registered application in the fused workspace.

The child project is nested under the MAATAA UI source tree for ownership and discovery. It is not an npm workspace of the parent component package; install, build, and validate it from this directory using its own scripts. Generated `dist`, dependency-install, and nested Git metadata are not vendored here.

## Integration source

The domain-registry package is the current versioned source for composition, schema contracts, and source intake. The parent workspace consumes it directly; application navigation and Data Studio read the registry package rather than maintaining a parallel catalog. Keep registry publication readiness separate from schema compiler readiness. Git metadata belongs to the parent repository; the child workspace does not carry a nested `.git` directory.
