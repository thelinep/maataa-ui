# Backend, Identity, Database, and Deployment Evidence

**Captured:** 2026-10-05<br>
**Scope:** TLPS `/mobile/223/3d-cad-previz` local spatial-layout slice<br>
**Status:** Local API and database are prepared. Hosted identity, database, and deployment connections remain unconfigured.

## Run the prepared local slice

Start the API from one terminal. This launcher imports the local API checkout and keeps its SQLite working copy inside the ignored MAATAA UI workspace:

```sh
cd /Users/vesahe/Documents/GitHub/maataa-ui/fused-organism
npm run dev:tlps-api
```

Start the TLPS UI from another terminal:

```sh
cd /Users/vesahe/Documents/GitHub/maataa-ui/fused-organism
npm run dev --workspace @maataa-app/tlps-application
```

Open `http://127.0.0.1:4174/apps/tlps-application/#/mobile/223/3d-cad-previz`. Stop either process with Ctrl-C. The current ignored local database is `fused-organism/.local-dev/tlps-spatial-local.db`; it contains one seeded project and no layouts yet. The source TLPS database remains unchanged. The UI's ignored `.env.local` is configured; no secrets or real user credentials are needed for this local demo.

This is one vertical slice, not production APIs for all MAATAA apps or all 352 domain tables. The other template applications still contain preview/local flows; this work adds no generic CRUD surface because app ownership and action permissions must remain source-backed.

## Local setup now available

The `maataa-api` checkout includes a local Node runner and a SQLite repository adapter. It uses Node's built-in SQLite module, so a local demo needs no Docker, Cloudflare, Supabase, or SSO account.

On first run, `npm run dev:local` copies the existing TLPS schema database to the ignored file `maataa-api/.local-dev/tlps-spatial-local.db`, seeds a sample spatial project in that copy, and binds the API to `127.0.0.1:4178`. It never writes to the original owner-split SQLite files. The UI's ignored `.env.local` points to this API and enables a local-only synthetic editor. The UI labels the connection as local development.

The local token and actor are test fixtures, not user authentication. The runner refuses any bind address other than `127.0.0.1`; this mode must never be exposed or deployed. Node 22's built-in SQLite module currently reports itself as experimental.

## Implemented API behavior

The API routes cover only spatial layout operations on the canonical `eventsspatial.spatial_layouts` table:

- `GET /health/live` and configuration-only `GET /health/ready`.
- `GET /v1/session` for verified actor claims.
- Project-scoped list/create plus layout read/update.
- Permission checks, organisation/workspace filters, bounded payloads, and exact-origin CORS.
- Draft-only editor behavior. Saves use the existing row ID and version, increment `version_number` on that row, and return `409` on a stale version. Published and archived layouts are not loaded or edited by this route.

The hosted Worker path is kept separate: it verifies signed JWTs and has a Supabase PostgREST adapter that forwards the end-user token, never a service-role key. Staging and production remain `DATA_PLANE_MODE=disabled`. A draft PostgreSQL RLS migration is present but has not been applied.

## Fresh verification

- API tests: **19/19 passed**, including local SQLite CAS updates, cross-project FK rejection, local-only auth gating, signed JWT validation, permission denial, tenant/workspace scope, stale-write conflict, draft-only reads, and oversized-response rejection.
- Local loopback smoke test: **passed** using a disposable SQLite copy. Health reported `configured-local-only`; a draft was created at version 1 and updated on the same row to version 2.
- TLPS/Admin tests: **12/12 passed**.
- TLPS production build: **passed** (Vite 5.4.21).
- Wrangler staging dry run: **passed**; no upload/deployment occurred.
- Actual local startup smoke: API health reported `configured-local-only` and the TLPS Vite page responded on loopback. The API runner binds only to `127.0.0.1`.
- Original `maataa.db`, `tlps.db`, and `shared.db` were checked read-only: 25/209/118 tables, SQLite `quick_check=ok`, zero FK violations. The local runner writes to a separate ignored copy.
- Toolchain: Node **22.22.3** satisfies the API's Node range. Installed npm **12.0.2** is outside the declared `>=10.9 <11` range; offline install and checks succeeded, but use the pinned npm 10.9.x toolchain for reproducible setup.
- Node 22 prints its expected experimental warning for built-in `node:sqlite`.
- The API changes are uncommitted and unpushed. No hosted database was contacted, no migration was applied, and no Worker was deployed.

## Still missing for hosted use

1. The actual internal SSO provider, its administrator, trusted claim issuance, session policy, and approved role-to-permission mapping.
2. A real staging database/project and its PostgreSQL version, baseline, test identities, and protected secret references.
3. A hosting decision and authorized access for the API/database. The current hosted deployment draft names Cloudflare and the hosted adapter names Supabase; the local runner needs neither.
4. Protected CI/deployment environments and a valid repository owner login. Current local Cloudflare credentials are expired/unavailable; no Supabase token is configured; GitHub CLI credentials are invalid.
5. A real host session adapter and project ID for hosted TLPS use.
6. Separate approval for the exact migration and target-bound deployment. The successful local and dry-run checks do not grant either approval.

The current source draft retains the hosted Cloudflare/Supabase path as a future option. The newly prepared local workflow is the only end-to-end connection verified against data in this task.
