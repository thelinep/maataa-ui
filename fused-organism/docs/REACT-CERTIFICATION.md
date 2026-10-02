# React Adapter Certification — 0.4.1 / M2 closeout

`@maataa/react` remains one of the 11 active kernel packages. React itself remains an optional host-provided peer at `>=18.2.0 <20` under ADR-002 and ADR-004.

## M2 adapter contract

M2 certifies:

- `REACT_ADAPTER_CONTRACT_VERSION = 1.0.0`;
- `REACT_PEER_RANGE`;
- `validateReactHost()`;
- `createMaataaReact()`;
- explicit rejection of hosts missing `createElement`, `useState`, or `useEffect`;
- the shipped primitive/hook surface listed in `docs/REACT-SURFACE.md`;
- real-browser semantics for the smaller browser-certified primitive subset listed in `docs/CERTIFIED-SURFACES.md`.

The deterministic host fixture proves MAATAA's adapter contract without bundling or certifying the third-party React implementation.

## Hooks shipped in M2

`useDisclosure`, `useMediaQuery`, `useTelemetry`, `useControl`, `useApproval`, `useAgent`, `useTheme`, `useToast`.

## Hooks deferred to M3 integration

`useMaataaContext`, `useRecommendation`, `useProposal`, `useEvidence`, `useCommand`, `useCommandReceipt`, `useControlLease`, `useObservedState`, `useDeviceState`, `useTwin`.

Deferred hooks are not exported in 0.4.1 and have no compatibility promise until implemented and tested.
