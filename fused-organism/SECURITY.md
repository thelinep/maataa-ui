# Security Policy

## Core invariants
- Prompt text is never authorization.
- Generated UI may request only registered component IDs.
- Renderer payloads are data, never executable code.
- Device commands require explicit authority and replay protection.
- Acknowledgement is not verification.
- Browser controls never replace required hardware interlocks or safety-rated emergency controls.

Report suspected vulnerabilities privately to the repository owner. Do not include credentials, production tokens or sensitive device endpoints in issues.
