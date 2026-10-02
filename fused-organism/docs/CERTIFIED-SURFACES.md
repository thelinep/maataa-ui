# M2 Certified Surfaces

Generated from `architecture.json` for MAATAA UI 0.4.1. Do not edit manually.

## React adapter — Node-certified exports

**Constants:** `REACT_ADAPTER_CONTRACT_VERSION`, `REACT_PEER_RANGE`

**Functions:** `validateReactHost`, `createMaataaReact`

**Primitives:** `Box`, `Button`, `Input`, `Textarea`, `Select`, `Switch`, `VisuallyHidden`, `AriaLive`

**Hooks shipped in M2:** `useDisclosure`, `useMediaQuery`, `useTelemetry`, `useControl`, `useApproval`, `useAgent`, `useTheme`, `useToast`

## Real-browser-certified React primitives

- `Button`
- `Input`
- `Switch`
- `AriaLive`

## Real-browser-certified behaviours

- accessibility-tree roles/names
- keyboard tab navigation
- dialog initial focus/focus restoration
- polite live-region update
- responsive no-overflow
- reduced-motion
- forced-colors

## Visual-regression-certified semantic states

- `state.info`
- `state.ai`
- `state.proposal`
- `state.approval`
- `state.authorized`
- `state.executing`
- `state.verified`
- `state.danger`
- `state.stale`
- `state.offline`

## Fixture-only surfaces

These are used to certify browser mechanics but are **not exports of `@maataa/react`**:

- tablist/tabs fixture
- native dialog fixture
- motion probe
- forced-colors probe
- semantic visual swatches
