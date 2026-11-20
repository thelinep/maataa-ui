# MAATAA Desktop

MAATAA Desktop is an Electron presentation shell for the existing MAATAA Control Plane and TLPS Operations Workspace. It packages the two built web applications behind a restricted `maataa://bundle` origin so browser storage is scoped to this desktop app and shared between its product windows.

## Local build and launch

```sh
npm run desktop:build
npm run desktop:launch
```

The desktop menu opens MAATAA with **File → MAATAA Control Plane** and TLPS with **File → TLPS Operations Workspace** (or `Cmd/Ctrl+1` and `Cmd/Ctrl+2`). Local workspace interactions persist in the desktop app's local browser storage.

## Package an installer

```sh
npm run desktop:package
```

The packaging target is selected for the host operating system. macOS packages are unsigned local artifacts unless a separate signing and notarization setup is supplied.

## Runtime boundary

- Renderer Node.js access is disabled; context isolation and sandboxing are enabled.
- A narrow preload publishes desktop identification only. It exposes no filesystem, shell, credential, or IPC capabilities.
- The `maataa://bundle` protocol serves only files under the packaged `dist/` directory and rejects path traversal, remote navigation, popups, embedded webviews, and permission requests.
- Product records remain local preview data. This desktop shell does not supply production identity, remote synchronization, a production API, or migration/deployment authority.
