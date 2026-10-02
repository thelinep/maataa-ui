# Governance

MAATAA UI uses four authority classes: `advisory`, `proposal`, `approval`, and `execution`; authoritative state belongs to external trusted systems.

Breaking contract changes require a major contract version. Emergency changes still require evidence, review and a post-incident record.

## Compatibility governance — 0.3.2+

Frozen v1 contracts, public exports, and registry semantics cannot be changed in place. Any planned removal must first be recorded in `compatibility/deprecations.json` and survive the published deprecation window. Baseline files under `compatibility/` are review artifacts and must never be rewritten by ordinary generation commands.
