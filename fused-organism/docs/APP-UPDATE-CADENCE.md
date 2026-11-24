# App update cadence

How apps that use MAATAA pick up new package releases, how they pin them, and how they roll back. This covers the release channel chosen in `RELEASE.md`: versioned tarballs, vendored into each app. Nothing here applies to public npm, which is not enabled.

## Who consumes what

| App | How it gets MAATAA | When it updates |
|---|---|---|
| Root app in this repository (`/`) | `file:` dependencies on `fused-organism/packages/*`, built in the same CI job | On every merge to `master`. It always runs the code in the same commit, so it needs no cadence of its own. |
| TLPS v2 (`/desk` and later surfaces) | Vendored tarballs from the **Internal package tarballs** workflow | On the cadence below |
| Any other app | Vendored tarballs, same as TLPS v2 | On the cadence below |

## Release cadence

1. **Library releases: at most one each week, on Tuesday.** A release is a successful run of the Internal package tarballs workflow on `master`. That run certifies the commit, writes `release-manifest.json` (package versions and SHA-256 digests), pushes one `@scope/package@version` tag for each package, and keeps the bundle for 90 days as the build artifact `maataa-internal-tarballs-<commit>`.
2. **App update window: within 5 working days of a release.** An app may skip a release. It may not stay more than two releases behind. That keeps every jump small enough to read the changelog in one sitting.
3. **Security fixes: out of cycle.** When a release fixes a security finding (high or critical in `npm audit`, or anything filed under `SECURITY.md`), apps update within 2 working days. The release notes say so in their first line.
4. **Prerelease line.** Until the 1.0 decision, every version carries the `-alpha.N` (later `-beta.N`) suffix. Apps pin exact versions, so a prerelease never arrives by accident.

## Pinning

Keep the tarballs in the app repository, so a build never depends on an artifact that can expire:

```
vendor/maataa/
  release-manifest.json
  maataa-tokens-<version>.tgz
  maataa-primitives-<version>.tgz
  maataa-ui-<version>.tgz
```

Reference them by path in the app's `package.json`. Do not use `npm install --no-save` in an app: the lockfile would not record the version.

```json
"@maataa/tokens": "file:vendor/maataa/maataa-tokens-<version>.tgz",
"@maataa/primitives": "file:vendor/maataa/maataa-primitives-<version>.tgz",
"@maataa/ui": "file:vendor/maataa/maataa-ui-<version>.tgz"
```

Then run `npm install`. The lockfile records each tarball's integrity hash, and `npm ci` fails if a tarball changes under the same name.

Update the three packages together, from one manifest. `@maataa/ui` accepts a range of `@maataa/tokens` and `@maataa/primitives` versions, but only the set in one manifest was certified together.

## Updating an app, step by step

1. Download the `maataa-internal-tarballs-<commit>` artifact from the release run.
2. Check every file against `release-manifest.json`: `shasum -a 256 *.tgz`. Stop if a digest differs.
3. Replace the files in `vendor/maataa/`, including the manifest, and change the three paths in `package.json`.
4. Run `npm install`, then the app's own checks: type-check, tests, build.
5. Read the release's `CHANGELOG.md` entries for the three packages. A minor version bump can add components. Deprecations name the version they will be removed in.
6. Open one pull request named `Update MAATAA to <ui version>`. Put the release commit and the manifest in the description, so a reviewer can trace the tarballs back to a certified run.
7. After merging, watch the app's error reporting for a day. Render errors are reported as `render_error` events by the route error boundary.

## Rolling back

Roll back when an update causes a regression the app cannot fix quickly in its own code.

1. Revert the update pull request. The previous tarballs come back with it, because they live in the repository, and the lockfile returns to their integrity hashes.
2. Run `npm ci` and the app's checks, then deploy.
3. File an issue in this repository with the version, the broken flow, and the error. Mark it `regression`.
4. Skip that release. Take the next one that has the fix, even if it falls inside the normal window.

Because each release also has git tags, a library fix can start from the exact released source: `git checkout @maataa/ui@<version>`.

## What the library side promises

- Every release passes `npm run certify` on the released commit, including the story accessibility audit and the packed-file secret scan.
- Breaking changes are not made in a patch release. During alpha they can arrive in a minor release; the changelog lists them first, with the change an app needs.
- Hindi text is reviewed before beta. Until then, apps that show Hindi to users should treat it as a draft.
