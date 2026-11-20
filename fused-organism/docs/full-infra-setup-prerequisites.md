# Full infrastructure setup — prerequisites and stop gate

**Status: BLOCKED before remote provisioning.** The task requires a credential-presence check before any remote operation. All required variables below were absent from the current shell. Their values were not read or printed. No Cloudflare, Supabase, Terraform, or GitHub remote operation was attempted.

## Checkout inspected

- Repository: `thelinep/maataa-ui`, branch `feat/fused-organism-parent`.
- HEAD: `8058945dee3efdab81491e832a994467a7be2c98`.
- Existing worktree: 83 modified/untracked status entries before this file was added. Preserve those changes; do not reset or clean them.
- No local `/Users/vesahe/Documents/GitHub/maataa-api` checkout was found. Do not put API Worker configuration in MAATAA UI as a substitute for the API repository.
- Local `wrangler` and `terraform` executables are not installed. `supabase` is installed.

## Required credentials — absent

Inject these through the approved local secret manager or CI secret store. Do not paste values into chat, write them to tracked files, or include them in command arguments.

| Variable | Needed for |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Authenticated Cloudflare provisioning and Worker configuration |
| `CLOUDFLARE_ACCOUNT_ID` | Select the Cloudflare account |
| `SUPABASE_ACCESS_TOKEN` | Supabase project/CLI management |
| `SUPABASE_STAGING_PROJECT_REF` | Identify the staging project |
| `SUPABASE_STAGING_DB_PASSWORD` | Authenticated database baseline access |
| `SUPABASE_STAGING_URL` | Staging Auth/API configuration |
| `SUPABASE_STAGING_ANON_KEY` | Client-scoped Supabase Auth/API configuration |
| `SUPABASE_STAGING_SERVICE_ROLE_KEY` | Server-only privileged operations, if approved |
| `TF_VAR_cloudflare_api_token` | Terraform Cloudflare provider |
| `TF_VAR_supabase_access_token` | Terraform Supabase provider |

Optional variables also absent: `SUPABASE_PRODUCTION_PROJECT_REF`, `SUPABASE_PRODUCTION_DB_PASSWORD`, and `SENTRY_DSN`. Production credentials are not required for this staging preflight; Sentry remains an optional integration until a project/DSN is designated.

## Manual steps to unblock

1. Provide or open the authorized local checkout for `thelinep/maataa-api`. Confirm its default branch and intended staging entry point; the current MAATAA UI checkout is not that API repository.
2. Select an accountable owner for the staging environment and provide the staging project reference, exact PostgreSQL version, and database/schema identity. Confirm whether MAATAA, TLPS, and shared data use separate Supabase projects or owner-scoped schemas in one project. Derive this from the existing data-ownership declaration; do not duplicate one project reference across all owners by assumption.
3. Inject the required variables above through a secure environment/secret manager. Then verify **presence only**; never print values. Provide secret references for any control-plane records, not raw credentials.
4. Select a remote Terraform state backend (Terraform Cloud organization/workspace or an approved S3 bucket, region, and encryption/key reference). Shared infrastructure must not use local state. Confirm that the selected Terraform Supabase provider and Cloudflare Worker resource types are supported before authoring resources.
5. Have the accountable database owner attest whether staging is empty or already contains data/schema. Capture the schema and migration-history baseline read-only first. `supabase db pull` can interact with the remote migration-history table; review its effects before proceeding. Do not run `supabase db push` or apply migrations without a separate explicit migration execution approval.
6. Approve the identity/session authority, trusted actor claims, role/action matrix, and RLS ownership model before creating Auth hooks or policies. The example `GRANT postgres TO hyperdrive_user` is over-privileged and must not be used. A Supabase service-role/secret key bypasses RLS; keep it server-only and do not use it for user-scoped authorization.
7. Confirm the Cloudflare plan supports Hyperdrive for the intended account and that the Supabase direct PostgreSQL endpoint is reachable. Hyperdrive configuration should use the direct database connection; do not send it through the Supabase transaction pooler. Keep the connection string in secret provisioning, never Wrangler config or Git.
8. After the API checkout, staging target, and remote state backend are available, generate a baseline and target-bound diff, hash-bind both, then update control-plane/M4 evidence. A no-op diff must remain a no-op and must not be described as a migration.
9. Obtain separate written approvals bound to exact artifacts and targets: migration-plan review, migration execution (provider, target, migration hash, window, operator), and deployment (application artifact hash, environment, rollout/health gates, rollback owner). None is recorded by this prerequisite check.

## Current deliverable boundary

This file records the missing prerequisites and stop condition only. No Worker, Hyperdrive, Supabase project, database role, Auth hook, RLS policy, Vault secret, Terraform state, CI secret, migration baseline, target diff, or deployment was created. No remote database was contacted or changed. No migration or deployment is approved.

## References

- [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
- [Supabase CLI database pull](https://supabase.com/docs/reference/cli/supabase-db-pull)
- [Supabase CLI database diff](https://supabase.com/docs/reference/cli/supabase-db-diff)
- [Supabase custom access token hooks](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
