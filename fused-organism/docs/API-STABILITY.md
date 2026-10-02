# API Stability and Compatibility — M1 reconciled / 0.3.3

MAATAA UI 0.3.3 freezes the first compatibility baselines for the 11-package kernel.

## Contract freeze

The current semantic schemas use stable v1 identifiers such as:

`https://schemas.maataa.ui/v1/recommendation.schema.json`

Each frozen schema also declares `x-maataa-contract-version: 1.0.0`.

`compatibility/contracts.v1.json` is the reviewed compatibility baseline. For frozen v1 contracts the following are breaking and fail `npm run check:contracts-compat`:

- removing a contract;
- changing its `$id` or frozen contract version;
- changing `additionalProperties` behavior;
- changing required fields;
- adding or removing properties;
- changing a property's type, enum, nested item/object signature.

Because the v1 contracts use `additionalProperties: false`, adding even an optional property can break an older strict reader. Shape changes therefore require a new contract version rather than silent mutation of v1.

## Public package API freeze

`api/public-api.json` is generated from the actual package entry modules. `compatibility/public-api.v1.json` freezes the named exports present at the M1 compatibility baseline.

New named exports may be added. A frozen export may not be removed or renamed inside the compatibility line.

## Registry freeze

`compatibility/registry.v1.json` freezes each existing component's:

- component ID;
- component version;
- owning package;
- category;
- authority class;
- headless/render-adapter status;
- schema binding;
- accessibility role;
- supported states.

Supported states may be added but not removed. In the current single-version registry, a breaking component definition must use a new component ID; replacing an existing ID/version in place is rejected.

## Deprecation metadata

All planned removals must first be represented in `compatibility/deprecations.json` with kind, ID, release introduced, intended removal target, replacement, and reason. 0.3.3 contains no active deprecations.

## Compatibility gate

Run:

```bash
npm run check:compat
```

It executes version synchronization, contract compatibility, public API compatibility, registry compatibility, and deprecation metadata checks.

## Versioning model

Contract `v1 / 1.0.0` and platform `0.3.x` are separate version spaces. See `docs/adr/ADR-001-CONTRACT-AND-PLATFORM-VERSIONING.md`.

## Registry implementation binding

`headless: true` no longer stands alone as proof of implementation. Every frozen entry also carries `implementationStatus: "headless-bound"` and a resolvable `binding` to a package export. `npm run check:registry-bindings` executes those bindings.
