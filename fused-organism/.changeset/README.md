# Changesets

Add a changeset for every package whose contents or public API change:

```sh
npm run changeset
```

Choose `patch`, `minor`, or `major` according to the compatibility impact. Changesets updates package versions and `CHANGELOG.md` files with `npm run release:version`. Internal workspace dependencies are updated by patch when a dependency version changes.

For the alpha train, run `npm run release:pre:enter-alpha` before `npm run release:version`. This keeps `@maataa/ui` on the alpha line instead of promoting `1.0.0-alpha.0` to stable `1.0.0`. Exit prerelease mode only for an approved beta or stable release.

Packages stay private. Changesets versions and tags private packages because the selected first channel is versioned tarball artifacts; no npm registry publish is configured. The internal tarball workflow is manual and uses the protected `internal-tarball-release` GitHub environment.
