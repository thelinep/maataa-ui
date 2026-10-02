# Certification Gate Runtime Matrix — 0.4.1

This document separates **tree/kernel gates** from **browser-environment gates**.

| Gate / command | Browser runtime required? | Notes |
| --- | --- | --- |
| `npm run gate:m0` | No | Foundation-document/tooling audit. |
| `npm run gate:m2-closeout` | No | M2 evidence/document/policy consistency. |
| `npm run gate:toolchain` | No | Node/npm workspace toolchain. |
| `npm run gate:version-sync` | No | Root/workspace/lock/API/registry/architecture versions. |
| `npm run gate:drift` | No | Regenerates and compares generated source/docs. |
| `npm run gate:visual-policy` | No | Checks pinned browser/DPR/threshold/update policy metadata only. |
| `npm run check:registry-bindings` | No | Imports all registry bindings. |
| `npm run check:react-policy` | No | React host-peer policy. |
| `npm run check:compat` | No | Contract/API/registry/deprecation baselines. |
| `npm run lint` | No | Source/static lint gate. |
| `npm run format:check` | No | Formatting gate. |
| `npm run check:boundaries` | No | Package-boundary policy. |
| `npm run check:exports` | No | Package export integrity. |
| `npm run test:react` | No | Deterministic host-contract fixture; does not launch React or a browser. |
| `npm test` | No | Node test runner. |
| `npm run build` | No | Kernel build. |
| `npm run fresh-clone` | No | Empty-cache offline kernel certification. |
| `npm run gate:browser-runtime` | **Yes** | Requires exact pinned Chromium. |
| `npm run certify:browser` / `npm run test:browser` | **Yes** | CDP browser certification + screenshot comparison. |
| `npm run visuals:update` | **Yes** | Maintainer-only baseline mutation; also requires explicit review acknowledgement. |
| `npm run certify:kernel` | No | All non-browser kernel gates. |
| `npm run certify:m2` | **Yes** | M2 browser lane plus React policy/tests. |
| `npm run certify` | **Yes** | Full release certification includes browser runtime. |
| `npm run release:check` | **Yes** | M2 release check requires browser evidence/runtime. |

A clean checkout can therefore prove the kernel from the tree alone; **full M2 certification additionally depends on the pinned external browser runtime**.
