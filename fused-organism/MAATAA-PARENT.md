# MAATAA UI parent relationship

This directory is the fused application workspace owned by the MAATAA UI repository. The parent app lives at `..`; this child keeps its own `package.json`, lockfile, build graph, and validation commands because it coordinates multiple independently versioned packages and applications.

## Ownership

- `packages/maataa-ui` contains the workspace's visual host package and composes its local tokens and primitives.
- `packages/domain-registry` is the versioned source registry for application composition and Data Studio.
- `apps/admin-template` is the operator console that reads and edits local registry drafts.
- `apps/tlps-application` is a registered application in the fused workspace.

The child project is nested under the MAATAA UI repository for ownership and discovery. It is not an npm workspace of the root app; install, build, and validate it from this directory using its own scripts. Generated `dist`, dependency-install, and nested Git metadata are not vendored here.

## Integration source

The workspace was copied from the M2 closeout working tree. The domain-registry source contained uncommitted M2 composition work at integration time; its source files are included here, while its separate `.git` metadata remains in the original working tree.
