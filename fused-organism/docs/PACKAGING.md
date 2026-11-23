# Package publishing readiness

## Package contents

The package tarball gate runs npm pack --dry-run in every workspace package and verifies that all declared export targets, LICENSE and NOTICE are present in the package file list. The clean package consumer gate packs all 21 workspaces and builds isolated Vite and Next.js App Router apps from those tarballs. The small kernel packages intentionally publish source .mjs entry points under src/; do not rewrite those exports to dist/ without a separate build migration.

The package versions remain independently governed where maataaPolicy.versioning says so. Internal workspace dependencies must use a concrete semver range matching the target package version. Package privacy and repository identity remain release decisions: keep private true until a package is explicitly approved for a chosen registry, and make repository metadata match the repository that will publish it before enabling publication.

## Next.js entry points

The UI build adds the use client directive to the root visual entry and categories containing hooks, browser APIs, or event-driven controls. Static categories are left server-safe. The separate @maataa/ui/theme-style entry and @maataa/tokens package remain server-safe for server-rendered theme CSS and token generation. Validate both paths in a clean Next.js App Router consumer before enabling external publication.

## Inline styles and Content Security Policy

Components currently use inline style attributes. A host with a restrictive Content Security Policy must test the actual rendered app; do not treat this package note as a policy approval. For TLPS v2, first deploy the candidate policy with Content-Security-Policy-Report-Only on /desk, collect violations for representative flows, and decide whether to allow inline style attributes (for example through style-src-attr) or move the affected styles to generated classes. ThemeStyle emits a style element and accepts a CSP nonce; the host must apply its nonce policy to that element as well. Record the chosen policy and browser evidence before beta.

## Token migration

Theme tokens are CSS variables with fallbacks. Code that previously appended hex alpha to a token string must use a raw palette color or resolve the CSS variable with getComputedStyle before adding alpha. See the migration note in the @maataa/tokens README.

## Bundle side effects

Do not mark @maataa/ui with sideEffects false until the TLPS v2 pilot bundle has been measured and module initialization has been reviewed. The /desk pilot measurement is a release prerequisite; this repository does not contain that app.
