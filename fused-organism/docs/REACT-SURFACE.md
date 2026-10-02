# React Surface — M2 shipped vs M3 deferred

Generated from `architecture.json` for MAATAA UI 0.4.1. Do not edit manually.

## Shipped and certified in M2

- `useDisclosure`
- `useMediaQuery`
- `useTelemetry`
- `useControl`
- `useApproval`
- `useAgent`
- `useTheme`
- `useToast`

## Deferred to M3 integration lane

- `useMaataaContext`
- `useRecommendation`
- `useProposal`
- `useEvidence`
- `useCommand`
- `useCommandReceipt`
- `useControlLease`
- `useObservedState`
- `useDeviceState`
- `useTwin`

The deferred hooks are **not part of the 0.4.1 public API** and carry no compatibility promise until implemented, exported, and tested. They remain generic `@maataa/react` candidates; M3 camera work is the first integration pressure that may require them.
