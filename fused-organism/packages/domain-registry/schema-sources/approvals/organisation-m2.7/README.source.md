# MAATAA M2.7 Organisation approval bundle

Approved by: `thelinep`
Approved at: `2026-10-02T21:08:00+05:30`

This bundle contains the six missing Organisation review contracts:
- organisation.organisation_settings
- organisation.workspace_settings
- organisation.workspace_roles
- organisation.workspace_invites
- organisation.workspace_activity
- organisation.workspace_favourites

It records schema, provenance, and registry-retention approval for the full 10-table Organisation context.
Migration approval is explicitly NOT granted here.

Important boundary:
- These are MAATAA architecture decisions authored/approved by thelinep.
- They are not inferred from NEVO.
- Retention approval is for Domain Registry schema readiness only.
- Production legal/compliance review remains required.
- The local `feat/domain-contracts-core-v1` branch was not mounted in this ChatGPT session, so this bundle does not claim that branch files were physically modified.
- Apply/merge the six contracts into the branch's existing `maataa-core-v1/contracts.json`, merge the retention policies, update `review.json`, then run the branch validator. Canonical promotion must fail if the existing four Organisation contracts have drifted.

FK closure:
- The six new contracts introduce 15 FK edges.
- Every new target resolves to one of the 10 canonical Organisation tables.
- Existing four Organisation contracts were already part of the previously proven 13-table kernel closure.
