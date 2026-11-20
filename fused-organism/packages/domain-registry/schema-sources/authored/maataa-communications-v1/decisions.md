# MAATAA Communications Schema v1 — Reviewed semantic source

**Status:** `REVIEWED_APPROVED_PENDING_PIN`

**Owner:** MAATAA

**Reviewer:** `thelinep`

**External database lineage:** none

**Canonical contracts generated:** no

`decisions.json` records explicit MAATAA-owned design decisions for all nine canonical Communications table IDs. These are MAATAA-authored design decisions, not discovered database facts. The assigned reviewer `thelinep` approved all twelve decision groups under the user's explicit instruction. The older `communications.notifications` contract is retained as an unreviewed baseline and is revised in this proposal where noted; it is not authority. `communications-schema.json` now describes the reviewed row shapes and carries relational decisions as explicit MAATAA metadata. Its separate authority-registry pin is pending.

## Proposed model

- **Tenant and workspace:** Every row has `organisation_id`. Workspace-capable records have nullable `workspace_id` and the tenant-safe reference `(workspace_id, organisation_id) → organisation.workspaces(id, organisation_id)`. Null means organisation-wide; no synthetic workspace is created. Preferences are per-organisation in v1.
- **Keys and time:** Primary keys use application-generated UUID v4; no database-specific default is proposed. Timestamps are UTC instants and `created_at` is immutable.
- **Identity and membership:** User attribution references `identity.users`. Tenant-scoped recipients/authors also reference the `(organisation_id, user_id)` key in Organisation memberships. Workspace-specific thread participation references `workspace_membership_id`; cross-row policy checks that it belongs to the parent thread’s workspace, organisation, and user. FKs prove row existence, while active membership and action authorization remain application policy.
- **Notifications:** A notification is the semantic in-product event. Its explicit proposed states are `unread`, `read`, and `dismissed`; delivery attempts are separate rows. This replaces the older proposal’s archive state with dismissal and preserves read/dismiss timestamps.
- **Preferences:** One preference per organisation, user, type, and channel. Proposed channels are in-app, email, and push. Provider secrets are excluded. Workspace-specific preference overrides are deferred from v1.
- **Delivery attempts:** Each row is one append-oriented attempt with idempotency key, attempt number, provider reference/response metadata, and timestamps. Proposed states are `queued → sending → sent → delivered`, with failure/suppression terminal paths. A retry inserts a new attempt; a failed row is not reset or overwritten.
- **Threads and messages:** Threads may be organisation-wide or workspace-scoped; a null workspace is valid. Thread identity is independent of participants. Members retain identity and optional workspace-membership references, join/leave times, role, and last-read position. Messages reference tenant-safe threads, carry author/content/order/state, and preserve their row when redacted.
- **Attachments:** Preserve the existing proposal vocabulary: `storage_key`, `media_type`, `file_name`, `byte_length`, `sha256`, and creator attribution. The storage provider is unspecified and no binary data is stored in the relational row. Retention follows the parent message.
- **Direct messages:** The proposal limits direct-message threads to a workspace and references two workspace-membership IDs. Database-level ascending-order and not-equal checks plus a unique `(organisation_id, workspace_id, low_membership_id, high_membership_id)` key make the pair symmetric without relying on caller-side sorting. The parent thread must be direct and use the same workspace.
- **Announcements:** Audience is relationally expressed as organisation-wide (`workspace_id = null`) or one workspace (`workspace_id` present). No opaque selected-user JSON list is used. Proposed lifecycle is `draft`, `scheduled`, `published`, `expired`, `retired`; published audience is immutable. Per-recipient acknowledgements/snapshots are excluded because they need another canonical table.

## Retention policy proposals

All durations below are MAATAA product-policy proposals, not statutory requirements. Every row remains `PROPOSED_REVIEW_REQUIRED`; legal/compliance review is still required.

| Table | Proposed retention |
| --- | --- |
| `communications.notification_preferences` | Active lifecycle, then 90 days after it becomes inactive or its owning membership ends |
| `communications.notifications` | 365 days after read/dismissal terminal time |
| `communications.notification_deliveries` | 180 days after terminal attempt state |
| `communications.communication_threads` | 1095 days after closed/archived |
| `communications.thread_members` | 1095 days after thread closure or membership end, whichever is later |
| `communications.messages` | 1095 days after parent thread closure |
| `communications.message_attachments` | Same 1095-day lifecycle as parent message |
| `communications.direct_message_threads` | 1095 days after parent thread closure |
| `communications.announcements` | 730 days after expiry/retirement |

An active legal/governance hold overrides ordinary retention deletion. Hold semantics belong to Governance/Evidence; this proposal adds no per-table `evidence.legal_holds` foreign key.

## Remaining approval boundaries

Source review is complete, but the following dependencies and physical-design checks remain explicit blockers:

- `identity.users` remains authored-only. It can support draft structural inspection, but canonical readiness and Prisma remain blocked until Identity is approved and canonical.
- Workspace, organisation-membership, and user FKs need target-key and lifecycle compatibility review. The Organisation schema is canonical; cross-context FK approval still needs to be recorded for Communications.
- FKs do not prove workspace membership is active, a sender belongs to a thread, or an actor was authorized at action time. Those are application-policy invariants.
- Check constraints, nullable composite-FK behavior, partial/compound indexes, and JSON support must be confirmed for a database dialect before physical compilation. No database vendor is selected here.
- Announcement acknowledgement and immutable per-recipient audience snapshots are not represented; adding either requires a reviewed catalog/table decision.
- The nine retention values and legal-hold override still require legal/compliance approval; the recorded review only accepts proposed MAATAA product defaults.

## Source and gate status

- `source.json` is `REVIEWED_UNPINNED`; actual source commit/blob hashes are intentionally absent until commit one exists.
- `review.json` records all twelve reviewer decisions by `thelinep`; it is not a cryptographic signature.
- `communications-schema.json` records JSON row shapes and relational metadata; it is not a canonical table-contract registry and does not enable contract generation/promotion by itself.
- No Communications contract was added to `data/table-contracts.json`; canonical coverage is unchanged.
- Draft compilation may use only complete, source-backed contracts through the explicit draft compiler. It is `DRAFT_OR_MIXED` and never Prisma-eligible.
- Canonical `SCHEMA_READY`, Prisma generation, migration approval, and production/legal approval remain separate gates and are not granted here.

The reviewed source package is committed first. A separate follow-up commit pins its actual commit SHA and Git blob SHAs in the authority registry. Contract authoring follows registered source authority; canonical promotion follows contract validation and explicit approval.
