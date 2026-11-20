import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../src/hash.mjs";
import { registry } from "../src/index.mjs";
import { assessContractCoverage, assessDraftCompileTestability, compileDraftLogicalSchema } from "../src/contracts.mjs";
import { generatePrismaPreview } from "../src/prisma-preview.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(packageRoot, "applications");
const outputRoot = path.join(packageRoot, "schema-sources/authored/casting-v1");
const ir = JSON.parse(await readFile(path.join(appRoot, "casting-pipeline-demo.ir.json"), "utf8"));
const commDraft = JSON.parse(await readFile(path.join(packageRoot, "schema-sources/authored/maataa-communications-v1/contracts.draft.json"), "utf8"));
const coreDraft = JSON.parse(await readFile(path.join(packageRoot, "schema-sources/authored/maataa-core-v1/contracts.json"), "utf8"));

const canonicalIds = new Set(registry.tableContracts.contracts.map((item) => item.id));
const known = new Map([
  ...coreDraft.contracts.map((item) => [item.id, item]),
  ...commDraft.contracts.map((item) => [item.id, item]),
  ...registry.tableContracts.contracts.map((item) => [item.id, item]),
]);
const tableById = new Map(registry.domains.tables.map((item) => [item.id, item]));
const tableIds = [...new Set(ir.tableIds)].sort();
const included = new Set(tableIds);
const now = (nullable = false) => ({ type: "datetime", nullable, timezone: "UTC instant", ...(nullable ? {} : { defaultExpression: { kind: "current-timestamp" } }) });
const str = (maxLength = 200, nullable = false) => ({ type: "string", nullable, maxLength });
const uuid = (nullable = false) => ({ type: "uuid", nullable });
const text = (nullable = false) => ({ type: "text", nullable });
const int = (nullable = false) => ({ type: "int", nullable });
const decimal = (precision = 12, scale = 2, nullable = false) => ({ type: "decimal", nullable, precision, scale });
const date = (nullable = false) => ({ type: "date", nullable });
const json = (nullable = false) => ({ type: "json", nullable });
const humanize = (name) => name.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const contextOf = (id) => id.split(".")[0];
const tableNameOf = (id) => id.split(".")[1];
const safeName = (value) => value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase();

// Names here are MAATAA design choices. They are proposals informed by the
// canonical table IDs and the five selected casting flows, not imported DB facts.
const specific = {
  "identity.access_policies": { fields: { policy_key: str(120), principal_kind: str(40), resource_pattern: str(240), action: str(80), effect: str(16), conditions: json(true), priority: int(), valid_from: now(true), valid_until: now(true) }, unique: [["policy_key"]], indexes: [{ name: "ix_access_policies_principal_resource_action", fields: ["principal_kind", "resource_pattern", "action"], unique: false }], refs: [] },
  "identity.access_reviews": { fields: { review_kind: str(60), decision: "decision", reviewed_at: now(true), due_at: now(true), notes: text(true) }, refs: [["subject_user_id", "identity.users", false], ["reviewer_user_id", "identity.users", true]] },
  "identity.auth_accounts": { fields: { provider: str(80), provider_subject: str(240), issuer: str(240, true), linked_at: now(), last_authenticated_at: now(true) }, unique: [["provider", "provider_subject"]], refs: [["user_id", "identity.users", false]] },
  "identity.auth_challenges": { fields: { challenge_kind: str(60), challenge_hash: str(128), expires_at: now(), consumed_at: now(true), attempt_count: int(), request_context: json(true) }, indexes: [{ name: "ix_auth_challenges_expiry", fields: ["expires_at"], unique: false }], refs: [["user_id", "identity.users", true]] },
  "identity.auth_credentials": { fields: { credential_kind: str(60), credential_hash: str(256), algorithm: str(80), issued_at: now(), expires_at: now(true), revoked_at: now(true), metadata: json(true) }, refs: [["user_id", "identity.users", false]] },
  "identity.delegations": { fields: { scope: json(), starts_at: now(), ends_at: now(true), reason: text(true), status: "workflow" }, unique: [["delegator_user_id", "delegate_user_id", "starts_at"]], refs: [["delegator_user_id", "identity.users", false], ["delegate_user_id", "identity.users", false], ["approved_by_user_id", "identity.users", true]] },
  "identity.device_verifications": { fields: { verification_kind: str(60), verification_hash: str(128), expires_at: now(), verified_at: now(true), attempt_count: int() }, refs: [["device_id", "identity.devices", false], ["user_id", "identity.users", false]] },
  "identity.devices": { fields: { device_fingerprint: str(256), display_name: str(160), device_kind: str(60), platform: str(60, true), last_seen_at: now(true), trusted_at: now(true), revoked_at: now(true) }, unique: [["user_id", "device_fingerprint"]], refs: [["user_id", "identity.users", false]] },
  "identity.invitations": { fields: { email: str(320), token_hash: str(128), invited_at: now(), expires_at: now(), accepted_at: now(true), revoked_at: now(true), message: text(true) }, indexes: [{ name: "ix_invitations_email_status", fields: ["email", "status"], unique: false }], refs: [["organisation_id", "organisation.organisations", false], ["workspace_id", "organisation.workspaces", true], ["invited_by_user_id", "identity.users", false], ["accepted_by_user_id", "identity.users", true]] },
  "identity.location_verifications": { fields: { verification_kind: str(60), country_code: str(2, true), region_code: str(40, true), location_hash: str(128), verified_at: now(true), expires_at: now(true), evidence: json(true) }, refs: [["user_id", "identity.users", false], ["verified_by_user_id", "identity.users", true]] },
  "identity.nda_acceptances": { fields: { accepted_at: now(), ip_address: str(64, true), user_agent: str(512, true), acceptance_hash: str(128), status: "decision" }, unique: [["user_id", "nda_version_id"]], refs: [["user_id", "identity.users", false], ["nda_version_id", "identity.nda_versions", false], ["signature_id", "identity.signatures", true]] },
  "identity.nda_versions": { fields: { version_number: int(), document_hash: str(128), effective_at: now(), retired_at: now(true), content_reference: str(512, true) }, unique: [["nda_id", "version_number"]], refs: [["nda_id", "identity.ndas", false]] },
  "identity.ndas": { fields: { code: str(80), title: str(200), description: text(true), status: "lifecycle", required_for: json(true) }, unique: [["code"]], refs: [] },
  "identity.otp_challenges": { fields: { channel: str(24), destination: str(320), code_hash: str(128), issued_at: now(), expires_at: now(), consumed_at: now(true), attempt_count: int() }, indexes: [{ name: "ix_otp_destination_expiry", fields: ["destination", "expires_at"], unique: false }], refs: [["user_id", "identity.users", true]] },
  "identity.password_reset_tokens": { fields: { token_hash: str(128), issued_at: now(), expires_at: now(), consumed_at: now(true), request_ip: str(64, true) }, indexes: [{ name: "ix_password_reset_expiry", fields: ["expires_at"], unique: false }], refs: [["user_id", "identity.users", false]] },
  "identity.permissions": { fields: { code: str(120), name: str(160), description: text(true), resource: str(120), action: str(80), is_system: { type: "boolean", nullable: false, defaultLiteral: false } }, unique: [["code"]], refs: [] },
  "identity.role_permissions": { fields: { granted_at: now(), granted_by_user_id: uuid(true) }, unique: [["role_id", "permission_id"]], refs: [["role_id", "identity.roles", false], ["permission_id", "identity.permissions", false], ["granted_by_user_id", "identity.users", true]] },
  "identity.roles": { fields: { code: str(80), name: str(120), description: text(true), is_system: { type: "boolean", nullable: false, defaultLiteral: false } }, unique: [["code"]], refs: [] },
  "identity.signatures": { fields: { signature_kind: str(60), storage_key: str(512, true), signature_hash: str(128), signed_at: now(true), signer_name: str(200, true), metadata: json(true) }, refs: [["user_id", "identity.users", true]] },
  "identity.user_emails": { fields: { email: str(320), is_primary: { type: "boolean", nullable: false, defaultLiteral: false }, is_verified: { type: "boolean", nullable: false, defaultLiteral: false }, verified_at: now(true), verification_method: str(60, true) }, unique: [["email"]], refs: [["user_id", "identity.users", false]] },
  "identity.user_phones": { fields: { phone_e164: str(20), is_primary: { type: "boolean", nullable: false, defaultLiteral: false }, is_verified: { type: "boolean", nullable: false, defaultLiteral: false }, verified_at: now(true), verification_method: str(60, true) }, unique: [["phone_e164"]], refs: [["user_id", "identity.users", false]] },
  "identity.user_roles": { fields: { assigned_at: now(), expires_at: now(true), assignment_source: str(60), status: "lifecycle" }, unique: [["user_id", "role_id"]], refs: [["user_id", "identity.users", false], ["role_id", "identity.roles", false], ["assigned_by_user_id", "identity.users", true]] },
  "people.casting_calls": { fields: { title: str(200), brief: text(true), status: "workflow", opens_at: now(true), closes_at: now(true) }, refs: [["project_id", "project.projects", false], ["created_by_user_id", "identity.users", true]] },
  "people.casting_call_roles": { fields: { role_name: str(160), character_description: text(true), headcount: int(), age_min: int(true), age_max: int(true), compensation_min: decimal(12, 2, true), compensation_max: decimal(12, 2, true), currency_code: str(3, true) }, refs: [["casting_call_id", "people.casting_calls", false]] },
  "people.talent_profiles": { fields: { display_name: str(200), biography: text(true), date_of_birth: date(true), pronouns: str(80, true), status: "lifecycle" }, refs: [["user_id", "identity.users", true]] },
  "people.talent_portfolios": { fields: { title: str(200), summary: text(true), is_primary: { type: "boolean", nullable: false, defaultLiteral: false } }, refs: [["talent_profile_id", "people.talent_profiles", false]] },
  "people.talent_media": { fields: { storage_key: str(512), media_kind: str(40), content_type: str(120), byte_length: int(true), checksum_sha256: str(64, true), caption: text(true) }, refs: [["talent_profile_id", "people.talent_profiles", false], ["evidence_item_id", "evidence.evidence_items", true]] },
  "people.audition_submissions": { fields: { submitted_at: now(true), status: "workflow", notes: text(true), external_reference: str(180, true) }, refs: [["casting_call_id", "people.casting_calls", false], ["casting_call_role_id", "people.casting_call_roles", false], ["talent_profile_id", "people.talent_profiles", false], ["submitted_by_user_id", "identity.users", true]] },
  "people.audition_media": { fields: { storage_key: str(512), media_kind: str(40), content_type: str(120), byte_length: int(true), checksum_sha256: str(64, true), captured_at: now(true) }, refs: [["audition_submission_id", "people.audition_submissions", false], ["evidence_item_id", "evidence.evidence_items", true]] },
  "people.talent_shortlists": { fields: { name: str(160), status: "workflow", purpose: text(true) }, refs: [["project_id", "project.projects", false], ["casting_call_id", "people.casting_calls", true], ["created_by_user_id", "identity.users", false]] },
  "people.talent_shortlist_items": { fields: { position: int(), decision: "decision", notes: text(true) }, refs: [["shortlist_id", "people.talent_shortlists", false], ["talent_profile_id", "people.talent_profiles", false], ["audition_submission_id", "people.audition_submissions", true]] },
  "people.talent_comparisons": { fields: { comparison_kind: str(40), left_score: decimal(7, 3, true), right_score: decimal(7, 3, true), rationale: text(true) }, refs: [["left_talent_profile_id", "people.talent_profiles", false], ["right_talent_profile_id", "people.talent_profiles", false], ["created_by_user_id", "identity.users", false]] },
  "people.casting_approvals": { fields: { status: "decision", decision_note: text(true), decided_at: now(true) }, refs: [["casting_call_id", "people.casting_calls", false], ["audition_submission_id", "people.audition_submissions", true], ["approver_user_id", "identity.users", false], ["approval_id", "evidence.approvals", true]] },
  "people.talent_availability": { fields: { available_from: now(), available_until: now(true), status: "lifecycle", notes: text(true) }, refs: [["talent_profile_id", "people.talent_profiles", false]] },
  "people.talent_offers": { fields: { offer_reference: str(100), status: "workflow", offered_at: now(), expires_at: now(true), compensation_amount: decimal(14, 2, true), currency_code: str(3, true), terms: text(true) }, refs: [["talent_profile_id", "people.talent_profiles", false], ["casting_call_role_id", "people.casting_call_roles", false], ["project_id", "project.projects", false]] },
  "people.talent_contracts": { fields: { contract_reference: str(100), status: "workflow", starts_on: date(true), ends_on: date(true), compensation_amount: decimal(14, 2, true), currency_code: str(3, true), terms: text(true), signed_at: now(true) }, refs: [["talent_profile_id", "people.talent_profiles", false], ["offer_id", "people.talent_offers", true], ["evidence_item_id", "evidence.evidence_items", true]] },
  "people.cast_assignments": { fields: { status: "workflow", starts_on: date(true), ends_on: date(true), assignment_note: text(true) }, refs: [["talent_profile_id", "people.talent_profiles", false], ["casting_call_role_id", "people.casting_call_roles", false], ["talent_contract_id", "people.talent_contracts", true]] },
  "people.cast_schedule_entries": { fields: { starts_at: now(), ends_at: now(true), location_label: str(200, true), status: "workflow" }, refs: [["cast_assignment_id", "people.cast_assignments", false], ["schedule_item_id", "production.schedule_items", true]] },
  "people.cast_messages": { fields: { body: text(), sent_at: now(), status: "lifecycle" }, refs: [["talent_profile_id", "people.talent_profiles", true], ["sender_user_id", "identity.users", false], ["communication_thread_id", "communications.communication_threads", true]] },
  "people.departments": { fields: { name: str(120), code: str(40), description: text(true), status: "lifecycle" }, refs: [["project_id", "project.projects", false]] },
  "people.department_members": { fields: { role_name: str(120), starts_on: date(true), ends_on: date(true) }, refs: [["department_id", "people.departments", false], ["user_id", "identity.users", false]] },
  "people.hod_assignments": { fields: { starts_on: date(), ends_on: date(true), status: "lifecycle" }, refs: [["department_id", "people.departments", false], ["crew_profile_id", "people.crew_profiles", false]] },
  "people.crew_profiles": { fields: { display_name: str(200), biography: text(true), status: "lifecycle", union_name: str(160, true) }, refs: [["user_id", "identity.users", true]] },
  "people.crew_skills": { fields: { skill_name: str(120), proficiency_level: str(40, true), verified_at: now(true) }, refs: [["crew_profile_id", "people.crew_profiles", false]] },
  "people.crew_availability": { fields: { available_from: now(), available_until: now(true), status: "lifecycle", notes: text(true) }, refs: [["crew_profile_id", "people.crew_profiles", false]] },
  "people.crew_hiring_requests": { fields: { title: str(200), description: text(true), positions_requested: int(), status: "workflow", needed_by: date(true) }, refs: [["project_id", "project.projects", false], ["department_id", "people.departments", true], ["requested_by_user_id", "identity.users", false]] },
  "people.crew_shortlists": { fields: { name: str(160), status: "workflow", purpose: text(true) }, refs: [["project_id", "project.projects", false], ["crew_hiring_request_id", "people.crew_hiring_requests", true], ["created_by_user_id", "identity.users", false]] },
  "people.crew_shortlist_items": { fields: { position: int(), decision: "decision", notes: text(true) }, refs: [["shortlist_id", "people.crew_shortlists", false], ["crew_profile_id", "people.crew_profiles", false]] },
  "people.crew_assignments": { fields: { status: "workflow", starts_on: date(true), ends_on: date(true), rate_amount: decimal(14, 2, true), currency_code: str(3, true) }, refs: [["project_id", "project.projects", false], ["crew_profile_id", "people.crew_profiles", false], ["department_id", "people.departments", true]] },
  "people.crew_contracts": { fields: { contract_reference: str(100), status: "workflow", starts_on: date(true), ends_on: date(true), terms: text(true), signed_at: now(true) }, refs: [["crew_assignment_id", "people.crew_assignments", false], ["crew_profile_id", "people.crew_profiles", false], ["evidence_item_id", "evidence.evidence_items", true]] },
  "people.attendance_records": { fields: { attendance_date: date(), check_in_at: now(true), check_out_at: now(true), status: "attendance", notes: text(true) }, refs: [["project_id", "project.projects", false], ["user_id", "identity.users", false], ["cast_assignment_id", "people.cast_assignments", true], ["crew_assignment_id", "people.crew_assignments", true]] },
  "people.timesheets": { fields: { period_start: date(), period_end: date(), hours_worked: decimal(7, 2), status: "workflow", submitted_at: now(true) }, refs: [["project_id", "project.projects", false], ["user_id", "identity.users", false], ["crew_assignment_id", "people.crew_assignments", true], ["cast_assignment_id", "people.cast_assignments", true]] },
  "people.performance_reviews": { fields: { review_date: date(), rating: decimal(4, 2, true), summary: text(true), status: "lifecycle" }, refs: [["project_id", "project.projects", false], ["reviewee_user_id", "identity.users", false], ["reviewer_user_id", "identity.users", false]] },
  "people.crew_messages": { fields: { body: text(), sent_at: now(), status: "lifecycle" }, refs: [["crew_profile_id", "people.crew_profiles", true], ["sender_user_id", "identity.users", false], ["communication_thread_id", "communications.communication_threads", true]] },
  "project.project_types": { fields: { name: str(120), code: str(40), description: text(true), is_active: { type: "boolean", nullable: false, defaultLiteral: true } }, refs: [] },
  "project.project_intakes": { fields: { title: str(200), request_summary: text(), status: "workflow", requested_start_on: date(true), requested_by_name: str(160, true) }, refs: [["submitted_by_user_id", "identity.users", true]] },
  "project.project_briefs": { fields: { title: str(200), objective: text(), scope: text(true), status: "workflow", version_number: int() }, refs: [["project_id", "project.projects", false], ["authored_by_user_id", "identity.users", true], ["evidence_item_id", "evidence.evidence_items", true]] },
  "project.project_status_history": { fields: { from_status: str(40, true), to_status: str(40), reason: text(true), changed_at: now() }, refs: [["project_id", "project.projects", false], ["changed_by_user_id", "identity.users", true]] },
  "project.project_health_snapshots": { fields: { health_score: decimal(6, 2), risk_level: str(24), summary: text(true), captured_at: now() }, refs: [["project_id", "project.projects", false]] },
  "project.project_milestones": { fields: { name: str(180), description: text(true), due_at: now(true), completed_at: now(true), status: "workflow" }, refs: [["project_id", "project.projects", false], ["owner_user_id", "identity.users", true]] },
  "project.project_tasks": { fields: { title: str(200), description: text(true), status: "workflow", priority: "priority", due_at: now(true), completed_at: now(true) }, refs: [["project_id", "project.projects", false], ["assignee_user_id", "identity.users", true], ["parent_task_id", "project.project_tasks", true]] },
  "project.task_dependencies": { fields: { dependency_kind: str(40), created_at: now() }, refs: [["task_id", "project.project_tasks", false], ["depends_on_task_id", "project.project_tasks", false]] },
  "project.task_checklists": { fields: { title: str(200), is_complete: { type: "boolean", nullable: false, defaultLiteral: false }, position: int() }, refs: [["task_id", "project.project_tasks", false], ["completed_by_user_id", "identity.users", true]] },
  "project.project_blockers": { fields: { title: str(200), details: text(true), status: "workflow", raised_at: now(), resolved_at: now(true) }, refs: [["project_id", "project.projects", false], ["task_id", "project.project_tasks", true], ["owner_user_id", "identity.users", true]] },
  "project.project_activity": { fields: { event_type: str(80), summary: str(240), details: json(true), occurred_at: now() }, refs: [["project_id", "project.projects", false], ["actor_user_id", "identity.users", true]] },
  "project.project_notes": { fields: { title: str(200, true), body: text(), visibility: str(24), status: "lifecycle" }, refs: [["project_id", "project.projects", false], ["author_user_id", "identity.users", false]] },
  "project.project_tags": { fields: { label: str(80), color_token: str(40, true) }, refs: [["project_type_id", "project.project_types", true]] },
  "project.project_tag_links": { fields: { created_at: now() }, refs: [["project_id", "project.projects", false], ["project_tag_id", "project.project_tags", false]] },
  "project.project_closeouts": { fields: { summary: text(), status: "workflow", closed_at: now(true), lessons_learned: text(true) }, refs: [["project_id", "project.projects", false], ["approved_by_user_id", "identity.users", true], ["evidence_item_id", "evidence.evidence_items", true]] },
  "evidence.documents": { fields: { title: str(240), document_kind: str(80), status: "lifecycle", current_version: int() }, refs: [["uploaded_by_user_id", "identity.users", true]] },
  "evidence.document_versions": { fields: { version_number: int(), storage_key: str(512), content_type: str(120), byte_length: int(true), checksum_sha256: str(64), captured_at: now() }, refs: [["document_id", "evidence.documents", false], ["uploaded_by_user_id", "identity.users", true]] },
  "evidence.document_links": { fields: { linked_record_type: str(100), linked_record_id: uuid(), link_purpose: str(80) }, refs: [["document_id", "evidence.documents", false], ["linked_by_user_id", "identity.users", true]] },
  "evidence.evidence_media": { fields: { storage_key: str(512), media_kind: str(40), content_type: str(120), byte_length: int(true), checksum_sha256: str(64) }, refs: [["evidence_item_id", "evidence.evidence_items", false], ["document_version_id", "evidence.document_versions", true]] },
  "evidence.evidence_metadata": { fields: { metadata_key: str(100), metadata_value: json(), classification: str(40) }, refs: [["evidence_item_id", "evidence.evidence_items", false]] },
  "evidence.evidence_links": { fields: { target_type: str(100), target_id: uuid(), relationship: str(80) }, refs: [["evidence_item_id", "evidence.evidence_items", false], ["created_by_user_id", "identity.users", true]] },
  "evidence.evidence_gps": { fields: { latitude: decimal(10, 7), longitude: decimal(10, 7), accuracy_meters: decimal(9, 2, true), captured_at: now(), source: str(40) }, refs: [["evidence_item_id", "evidence.evidence_items", false]] },
  "evidence.evidence_timestamps": { fields: { timestamp_kind: str(60), occurred_at: now(), source: str(80, true), precision_ms: int(true) }, refs: [["evidence_item_id", "evidence.evidence_items", false]] },
  "evidence.trusted_timestamps": { fields: { issued_at: now(), authority: str(200), token_reference: str(512), verification_status: str(40) }, refs: [["evidence_item_id", "evidence.evidence_items", false]] },
  "evidence.evidence_verifications": { fields: { verification_kind: str(80), outcome: "decision", checked_at: now(), report: json(true) }, refs: [["evidence_item_id", "evidence.evidence_items", false], ["verified_by_user_id", "identity.users", true]] },
  "evidence.evidence_timeline_events": { fields: { event_type: str(80), summary: str(240), occurred_at: now(), details: json(true) }, refs: [["evidence_item_id", "evidence.evidence_items", false], ["actor_user_id", "identity.users", true]] },
  "evidence.chain_of_custody_events": { fields: { event_type: str(80), occurred_at: now(), source_party: str(160, true), destination_party: str(160, true), integrity_hash: str(128, true) }, refs: [["evidence_item_id", "evidence.evidence_items", false], ["actor_user_id", "identity.users", true]] },
  "evidence.before_after_proofs": { fields: { subject_type: str(100), subject_id: uuid(), before_value: json(true), after_value: json(true), captured_at: now() }, refs: [["evidence_item_id", "evidence.evidence_items", false], ["change_request_id", "evidence.change_requests", true]] },
  "evidence.change_requests": { fields: { title: str(200), rationale: text(), status: "workflow", requested_at: now(), resolved_at: now(true) }, refs: [["project_id", "project.projects", true], ["requested_by_user_id", "identity.users", false], ["evidence_item_id", "evidence.evidence_items", true]] },
  "evidence.approval_steps": { fields: { step_number: int(), title: str(160), status: "decision", due_at: now(true), decided_at: now(true) }, refs: [["approval_id", "evidence.approvals", false], ["approver_user_id", "identity.users", true]] },
  "evidence.approval_decisions": { fields: { decision: "decision", rationale: text(true), decided_at: now() }, refs: [["approval_id", "evidence.approvals", false], ["approval_step_id", "evidence.approval_steps", true], ["decided_by_user_id", "identity.users", false]] },
  "evidence.approval_comments": { fields: { body: text(), visibility: str(24), created_at: now() }, refs: [["approval_id", "evidence.approvals", false], ["author_user_id", "identity.users", false]] },
  "evidence.risks": { fields: { title: str(200), description: text(true), likelihood: str(24), impact: str(24), status: "workflow" }, refs: [["project_id", "project.projects", true], ["owner_user_id", "identity.users", true]] },
  "evidence.risk_mitigations": { fields: { action: text(), due_at: now(true), status: "workflow", completed_at: now(true) }, refs: [["risk_id", "evidence.risks", false], ["owner_user_id", "identity.users", true]] },
  "evidence.legal_holds": { fields: { hold_reference: str(120), reason: text(), starts_at: now(), released_at: now(true), status: "lifecycle" }, refs: [["document_id", "evidence.documents", true], ["evidence_item_id", "evidence.evidence_items", true], ["authorised_by_user_id", "identity.users", true]] },
  "platform.support_tickets": { fields: { ticket_number: str(80), subject: str(240), description: text(), severity: "priority", status: "workflow", opened_at: now(), closed_at: now(true) }, refs: [["opened_by_user_id", "identity.users", false], ["assigned_to_user_id", "identity.users", true]] },
  "platform.support_comments": { fields: { body: text(), is_internal: { type: "boolean", nullable: false, defaultLiteral: false }, created_at: now() }, refs: [["support_ticket_id", "platform.support_tickets", false], ["author_user_id", "identity.users", false]] },
  "platform.system_incidents": { fields: { title: str(200), summary: text(true), severity: "priority", status: "workflow", started_at: now(), resolved_at: now(true) }, refs: [["detected_by_user_id", "identity.users", true], ["evidence_item_id", "evidence.evidence_items", true]] },
  "platform.api_keys": { fields: { label: str(120), key_hash: str(128), scopes: json(), expires_at: now(true), revoked_at: now(true) }, refs: [["created_by_user_id", "identity.users", false]] },
  "platform.feature_flags": { fields: { key: str(100), description: text(true), enabled: { type: "boolean", nullable: false, defaultLiteral: false }, rollout_percent: int() }, refs: [] },
  "platform.feature_flag_assignments": { fields: { enabled: { type: "boolean", nullable: false }, subject_kind: str(40), subject_id: uuid(), starts_at: now(), ends_at: now(true) }, refs: [["feature_flag_id", "platform.feature_flags", false]] },
  "platform.integrations": { fields: { key: str(100), name: str(160), provider: str(100), status: "lifecycle", capabilities: json(true) }, refs: [] },
  "platform.integration_connections": { fields: { external_account_ref: str(200, true), status: "lifecycle", connected_at: now(true), disconnected_at: now(true) }, refs: [["integration_id", "platform.integrations", false], ["connected_by_user_id", "identity.users", true]] },
  "platform.integration_events": { fields: { event_type: str(120), external_event_id: str(200, true), payload: json(), received_at: now(), processed_at: now(true) }, refs: [["integration_connection_id", "platform.integration_connections", false]] },
  "platform.webhooks": { fields: { name: str(160), target_url: str(2048), status: "lifecycle", secret_reference: str(160), created_at: now() }, refs: [["created_by_user_id", "identity.users", true]] },
  "platform.webhook_subscriptions": { fields: { event_pattern: str(160), status: "lifecycle" }, refs: [["webhook_id", "platform.webhooks", false]] },
  "platform.webhook_deliveries": { fields: { attempt_number: int(), status: "workflow", response_code: int(true), attempted_at: now(), next_attempt_at: now(true), response_excerpt: text(true) }, refs: [["webhook_id", "platform.webhooks", false], ["subscription_id", "platform.webhook_subscriptions", true]] },
  "platform.exports": { fields: { export_kind: str(80), status: "workflow", requested_at: now(), completed_at: now(true), object_key: str(512, true), expires_at: now(true) }, refs: [["requested_by_user_id", "identity.users", false]] },
  "platform.export_jobs": { fields: { status: "workflow", started_at: now(true), completed_at: now(true), error_code: str(80, true) }, refs: [["export_id", "platform.exports", false]] },
  "platform.backup_jobs": { fields: { status: "workflow", started_at: now(true), completed_at: now(true), target_reference: str(240), checksum: str(128, true) }, refs: [] },
  "platform.restore_jobs": { fields: { status: "workflow", started_at: now(true), completed_at: now(true), source_reference: str(240), requested_by_user_id: uuid() }, refs: [["backup_job_id", "platform.backup_jobs", true], ["requested_by_user_id", "identity.users", false]] },
  "platform.data_retention_policies": { fields: { policy_key: str(100), subject_kind: str(100), retention_days: int(true), legal_basis: str(240, true), status: "lifecycle" }, refs: [["approved_by_user_id", "identity.users", true]] },
  "platform.runtime_observations": { fields: { observed_at: now(), component: str(120), observation_kind: str(80), value: json(true), severity: "priority" }, refs: [] },
  "platform.status_events": { fields: { component: str(120), from_status: str(40, true), to_status: str(40), occurred_at: now(), details: json(true) }, refs: [["actor_user_id", "identity.users", true]] },
  "platform.sync_jobs": { fields: { direction: str(24), status: "workflow", started_at: now(true), completed_at: now(true), cursor: str(512, true) }, refs: [["integration_connection_id", "platform.integration_connections", true]] },
  "platform.sync_queue_items": { fields: { item_key: str(200), operation: str(40), status: "workflow", enqueued_at: now(), attempts: int() }, refs: [["sync_job_id", "platform.sync_jobs", false]] },
  "platform.sync_conflicts": { fields: { entity_type: str(100), entity_id: uuid(), local_value: json(true), remote_value: json(true), status: "workflow", resolved_at: now(true) }, refs: [["sync_job_id", "platform.sync_jobs", false], ["resolved_by_user_id", "identity.users", true]] },
  "platform.share_links": { fields: { token_hash: str(128), resource_type: str(100), resource_id: uuid(), expires_at: now(true), revoked_at: now(true), status: "lifecycle" }, refs: [["created_by_user_id", "identity.users", false]] },
  "platform.user_preferences": { fields: { preference_key: str(100), preference_value: json(), updated_at: now() }, refs: [["user_id", "identity.users", false]] },
  "platform.workspace_preferences": { fields: { preference_key: str(100), preference_value: json(), updated_at: now() }, refs: [["workspace_id", "organisation.workspaces", false]] },
  "production.schedules": { fields: { name: str(160), status: "workflow", timezone: str(80), effective_from: date(), effective_until: date(true) }, refs: [["project_id", "project.projects", false]] },
  "production.schedule_versions": { fields: { version_number: int(), status: "lifecycle", published_at: now(true), change_summary: text(true) }, refs: [["schedule_id", "production.schedules", false], ["created_by_user_id", "identity.users", true]] },
  "production.schedule_items": { fields: { title: str(200), item_kind: str(60), starts_at: now(), ends_at: now(true), location_label: str(200, true), status: "workflow", position: int() }, refs: [["schedule_id", "production.schedules", false], ["schedule_version_id", "production.schedule_versions", true], ["project_milestone_id", "project.project_milestones", true]] },
  "production.production_calendars": { fields: { name: str(160), timezone: str(80), status: "lifecycle" }, refs: [["project_id", "project.projects", false]] },
  "production.production_days": { fields: { production_date: date(), day_number: int(), status: "workflow", call_time: now(true), wrap_time: now(true) }, refs: [["project_id", "project.projects", false], ["calendar_id", "production.production_calendars", true]] },
  "production.shoot_days": { fields: { shoot_date: date(), status: "workflow", weather_notes: text(true), call_time: now(true), wrap_time: now(true) }, refs: [["production_day_id", "production.production_days", false]] },
  "production.stripboards": { fields: { name: str(160), status: "workflow", version_number: int(), published_at: now(true) }, refs: [["project_id", "project.projects", false], ["schedule_id", "production.schedules", true]] },
  "production.strips": { fields: { position: int(), scene_number: str(40), page_eighths: decimal(5, 2, true), scheduled_minutes: int(true), status: "workflow" }, refs: [["stripboard_id", "production.stripboards", false], ["production_day_id", "production.production_days", true]] },
  "production.call_sheets": { fields: { title: str(200), status: "workflow", version_number: int(), published_at: now(true), general_notes: text(true) }, refs: [["project_id", "project.projects", false], ["production_day_id", "production.production_days", false], ["created_by_user_id", "identity.users", false]] },
  "production.call_sheet_versions": { fields: { version_number: int(), status: "lifecycle", published_at: now(true), content_hash: str(128, true) }, refs: [["call_sheet_id", "production.call_sheets", false], ["created_by_user_id", "identity.users", true]] },
  "production.call_sheet_recipients": { fields: { delivery_status: "workflow", sent_at: now(true), acknowledged_at: now(true) }, refs: [["call_sheet_id", "production.call_sheets", false], ["user_id", "identity.users", false]] },
  "production.call_sheet_acknowledgements": { fields: { acknowledged_at: now(), response: str(40, true), note: text(true) }, refs: [["call_sheet_id", "production.call_sheets", false], ["user_id", "identity.users", false]] },
  "production.daily_production_reports": { fields: { report_date: date(), status: "workflow", summary: text(true), pages_completed: decimal(5, 2, true), submitted_at: now(true) }, refs: [["project_id", "project.projects", false], ["production_day_id", "production.production_days", true], ["submitted_by_user_id", "identity.users", true], ["evidence_item_id", "evidence.evidence_items", true]] },
  "production.delays": { fields: { reason: text(), started_at: now(), ended_at: now(true), impact_minutes: int(true), status: "workflow" }, refs: [["production_day_id", "production.production_days", false], ["reported_by_user_id", "identity.users", true]] },
  "production.incidents": { fields: { incident_kind: str(80), severity: "priority", summary: text(), occurred_at: now(), status: "workflow", resolved_at: now(true) }, refs: [["production_day_id", "production.production_days", true], ["reported_by_user_id", "identity.users", true], ["evidence_item_id", "evidence.evidence_items", true]] },
  "production.live_attendance": { fields: { attendance_date: date(), checked_in_at: now(true), checked_out_at: now(true), status: "attendance" }, refs: [["production_day_id", "production.production_days", false], ["user_id", "identity.users", false]] },
  "production.scene_progress": { fields: { scene_reference: str(80), status: "workflow", started_at: now(true), completed_at: now(true), takes_completed: int(true) }, refs: [["production_day_id", "production.production_days", false], ["strip_id", "production.strips", true]] },
  "production.shot_progress": { fields: { shot_reference: str(100), status: "workflow", started_at: now(true), completed_at: now(true), takes_completed: int(true) }, refs: [["production_day_id", "production.production_days", false], ["scene_progress_id", "production.scene_progress", true]] },
  "production.wrap_reports": { fields: { report_date: date(), status: "workflow", summary: text(true), wrapped_at: now(true), submitted_at: now(true) }, refs: [["production_day_id", "production.production_days", false], ["submitted_by_user_id", "identity.users", true]] },
};

const enumSets = {
  workflow: ["draft", "open", "submitted", "in_review", "approved", "rejected", "scheduled", "active", "completed", "cancelled", "closed"],
  lifecycle: ["active", "inactive", "suspended", "archived", "revoked"],
  decision: ["pending", "approved", "rejected", "needs_changes", "withdrawn"],
  priority: ["low", "normal", "high", "urgent", "critical"],
  attendance: ["expected", "present", "late", "absent", "excused", "checked_out"],
};

const existingField = (contract, name) => contract?.fields?.[name];
const draftContracts = [];
for (const tableId of tableIds) {
  if (known.has(tableId)) continue;
  const table = tableById.get(tableId);
  if (!table) throw new Error(`CASTING_TABLE_NOT_REGISTERED:${tableId}`);
  const context = contextOf(tableId);
  const name = tableNameOf(tableId);
  const plan = specific[tableId] ?? { fields: {}, refs: [] };
  const scopeOrg = (context !== "identity" || tableId === "identity.invitations") && !["identity.users", "identity.roles", "identity.permissions", "project.project_types", "platform.feature_flags", "platform.integrations", "platform.backup_jobs", "platform.runtime_observations"].includes(tableId);
  const fields = {
    id: { ...uuid(), generated: true, defaultExpression: { kind: "uuid-v4" } },
    ...(scopeOrg ? { organisation_id: uuid() } : {}),
  };
  if (scopeOrg && !["project.project_types", "project.project_tags"].includes(tableId)) fields.workspace_id = uuid(true);
  for (const [fieldName, descriptor] of Object.entries(plan.fields ?? {})) {
    if (descriptor === "workflow" || descriptor === "lifecycle" || descriptor === "decision" || descriptor === "priority" || descriptor === "attendance") {
      const values = enumSets[descriptor];
      const enumId = `${tableId}#${fieldName}`;
      const defaultLiteral = descriptor === "workflow" ? "draft" : descriptor === "decision" ? "pending" : descriptor === "lifecycle" ? "active" : descriptor === "priority" ? "normal" : "expected";
      fields[fieldName] = { type: "enum", nullable: false, enumId, defaultLiteral };
      (plan.enums ??= []).push({ id: enumId, values });
    } else fields[fieldName] = { ...descriptor };
  }
  if (!Object.hasOwn(plan.fields ?? {}, "name") && !Object.hasOwn(plan.fields ?? {}, "title") && !["identity", "production"].includes(context)) fields.name = str(180);
  if (!Object.hasOwn(plan.fields ?? {}, "description") && !Object.hasOwn(plan.fields ?? {}, "summary") && !["identity", "production"].includes(context)) fields.description = text(true);
  if (!Object.hasOwn(fields, "status")) {
    const statusValues = enumSets.lifecycle;
    const enumId = `${tableId}#status`;
    fields.status = { type: "enum", nullable: false, enumId, defaultLiteral: "active" };
    (plan.enums ??= []).push({ id: enumId, values: statusValues });
  }
  if (!Object.hasOwn(fields, "created_at")) fields.created_at = now();
  if (!Object.hasOwn(fields, "updated_at")) fields.updated_at = now();
  if (scopeOrg && !Object.hasOwn(fields, "created_by_user_id")) fields.created_by_user_id = uuid(true);

  const refs = [...(plan.refs ?? [])];
  if (scopeOrg) refs.unshift(["organisation_id", "organisation.organisations", false]);
  if (scopeOrg && Object.hasOwn(fields, "workspace_id") && context !== "organisation") refs.push(["workspace_id", "organisation.workspaces", true]);
  if (fields.created_by_user_id && !refs.some(([field]) => field === "created_by_user_id")) refs.push(["created_by_user_id", "identity.users", true]);
  const foreignKeys = [];
  const relations = [];
  const seenRef = new Set();
  for (const [fieldName, targetId, nullable = false] of refs) {
    if (seenRef.has(fieldName)) continue;
    seenRef.add(fieldName);
    if (!included.has(targetId) && !canonicalIds.has(targetId)) throw new Error(`CASTING_REFERENCE_OUTSIDE_SLICE:${tableId}:${targetId}`);
    if (fieldName !== "organisation_id" && !fields[fieldName]) fields[fieldName] = uuid(nullable);
    const target = known.get(targetId) ?? draftContracts.find((item) => item.id === targetId);
    const targetKeys = [target?.primaryKey, ...(target?.uniqueConstraints ?? []).map((item) => item.fields)].filter(Array.isArray);
    const compositeKey = targetKeys.find((keyFields) => keyFields.length === 2 && keyFields.includes("id") && keyFields.includes("organisation_id"));
    const compositeOrg = Boolean(compositeKey && Object.hasOwn(fields, "organisation_id") && fieldName !== "organisation_id");
    const targetFields = compositeOrg ? compositeKey : ["id"];
    const localFields = compositeOrg ? targetFields.map((targetField) => targetField === "id" ? fieldName : "organisation_id") : [fieldName];
    const key = `fk_${safeName(name)}_${safeName(fieldName)}_${safeName(targetId)}`.slice(0, 60);
    const onDelete = fieldName === "organisation_id" ? "restrict" : "restrict";
    foreignKeys.push({ name: key, fields: localFields, references: targetId, referencedFields: targetFields, onDelete, onUpdate: "no-action" });
    relations.push({ name: `${fieldName}_to_${targetId.replaceAll(".", "_")}`, from: localFields, to: targetId, toFields: targetFields, cardinality: "many-to-one" });
  }
  const uniques = [];
  if (scopeOrg) uniques.push({ name: `uq_${safeName(name)}_id_organisation`, fields: ["id", "organisation_id"] });
  const planUnique = plan.unique ?? [];
  for (const unique of planUnique) uniques.push({ name: `uq_${safeName(name)}_${safeName(unique.join("_"))}`, fields: unique });
  const fkIndexes = foreignKeys.map((key) => ({ name: `ix_${safeName(name)}_${safeName(key.fields.join("_"))}`.slice(0, 60), fields: key.fields, unique: false }));
  const indexes = [...new Map([
    ...(scopeOrg ? [{ name: `ix_${safeName(name)}_organisation_status`, fields: ["organisation_id", "status"], unique: false }] : []),
    ...fkIndexes,
    ...(plan.indexes ?? []),
  ].map((index) => [JSON.stringify(index.fields), index])).values()];
  const evidence = [`domain-catalog:${tableId}`, "application-ir:casting-pipeline-demo", ...ir.flowIds.map((flowId) => `flow:${flowId}`)];
  const provenance = { kind: "MAATAA_AUTHORED", evidence };
  for (const index of indexes) if (!index.provenance) index.provenance = provenance;
  for (const constraint of uniques) if (!constraint.provenance) constraint.provenance = provenance;
  for (const key of foreignKeys) key.provenance = provenance;
  for (const relation of relations) relation.provenance = provenance;
  const enums = (plan.enums ?? []).map((definition) => ({ ...definition, provenance }));
  const timestamps = Object.keys(fields).includes("created_at");
  const contract = {
    schemaVersion: "1.0.0", schemaLifecycle: "DRAFT", id: tableId, context, name, version: "1.0.0",
    description: plan.description ?? `${humanize(name)} records owned by the ${context} context. This definition is a MAATAA-authored design proposal for the casting composition.`,
    fields, enums, primaryKey: ["id"], uniqueConstraints: uniques, foreignKeys, relations, indexes,
    ownership: { owner: context, steward: context, tenantKey: scopeOrg ? "organisation_id" : undefined, provenance },
    lifecycle: { createdAt: timestamps ? "created_at" : undefined, updatedAt: Object.hasOwn(fields, "updated_at") ? "updated_at" : undefined, softDeleteField: Object.hasOwn(fields, "archived_at") ? "archived_at" : undefined, retentionPolicy: `proposed:${context}-${name}-retention-v1`, provenance },
    provenance,
  };
  if (contract.ownership.tenantKey === undefined) delete contract.ownership.tenantKey;
  for (const key of Object.keys(contract.lifecycle)) if (contract.lifecycle[key] === undefined) delete contract.lifecycle[key];
  known.set(tableId, contract);
  draftContracts.push(contract);
}

// Resolve forward references after every casting target contract is available.
// Every organisation-owned source referencing a tenant-owned target must carry
// the same organisation key, regardless of context or declaration order.
for (const contract of draftContracts.filter((item) => item.fields.organisation_id)) {
  for (const foreignKey of contract.foreignKeys) {
    const target = known.get(foreignKey.references);
    const targetHasTenantKey = target?.fields?.organisation_id
      && target.uniqueConstraints?.some((constraint) => JSON.stringify(constraint.fields) === JSON.stringify(["id", "organisation_id"]));
    if (!targetHasTenantKey || JSON.stringify(foreignKey.referencedFields) !== JSON.stringify(["id"]) || foreignKey.fields.length !== 1) continue;
    const localField = foreignKey.fields[0];
    if (localField === "organisation_id") continue;
    foreignKey.fields = [localField, "organisation_id"];
    foreignKey.referencedFields = ["id", "organisation_id"];
    const relation = contract.relations.find((item) => item.to === foreignKey.references && JSON.stringify(item.from) === JSON.stringify([localField]));
    if (relation) {
      relation.from = [localField, "organisation_id"];
      relation.toFields = ["id", "organisation_id"];
    }
  }
}

const source = { ...registry, castingDraftContracts: draftContracts };
const readiness = assessDraftCompileTestability(tableIds, source);
if (readiness.status !== "DRAFT_COMPILE_TESTABLE") {
  console.error(JSON.stringify(readiness.entries.filter((item) => item.errors.length), null, 2));
  throw new Error(`CASTING_DRAFT_STRUCTURE_FAILED:${readiness.counts.structurallyComplete}/${readiness.counts.total}`);
}
const logical = compileDraftLogicalSchema(tableIds, source);
if (logical.status !== "DRAFT_LOGICAL_SCHEMA_READY") throw new Error(`CASTING_DRAFT_LOGICAL_FAILED:${JSON.stringify(logical.blockers)}`);
const canonicalCoverage = assessContractCoverage(tableIds, registry);
const closureIds = logical.model.tables.map((item) => item.id).sort();
const closureCoverage = assessContractCoverage(closureIds, registry);
const schemaReady = canonicalCoverage.status === "SCHEMA_READY"
  && closureCoverage.status === "SCHEMA_READY"
  && readiness.status === "DRAFT_COMPILE_TESTABLE"
  && logical.model.tables.length === tableIds.length;
const resolvedContractSet = tableIds.map((id) => {
  const contract = known.get(id);
  if (!contract) throw new Error(`CASTING_RESOLVED_CONTRACT_MISSING:${id}`);
  return contract;
});
const contractSetHash = sha256(JSON.stringify(resolvedContractSet));
const packageFile = {
  schemaVersion: "1.0.0", schemaLifecycle: "DRAFT", contextScope: "casting-composition-160", status: schemaReady ? "SCHEMA_READY" : "DRAFT_COMPLETE_REVIEW_PENDING",
  sourceBoundary: "MAATAA-authored design proposals based on canonical table IDs, the casting application IR, and its five selected flows. No external schema source is claimed.",
  contractSetHash,
  composition: { applicationId: ir.application.appId, irHash: ir.irHash, contextIds: ir.contextVersions.map((item) => item.contextId), selectedFlowIds: ir.flowIds, tableCount: tableIds.length },
  readiness: { compileTestable: true, fkClosure: "PASS", logicalPreviewValid: true, schemaReady, canonicalCoverage: canonicalCoverage.counts, closureCoverage: closureCoverage.counts, prismaPreviewValid: false, migrationPreviewValid: false, migrationApproved: false, deploymentApproved: false, legalReviewed: false, authoredDraftCount: draftContracts.length, effectiveContractCount: tableIds.length, closureTableCount: logical.model.tables.length, logicalSchemaHash: logical.schemaHash },
  contractIds: tableIds,
  resolvedContractCount: resolvedContractSet.length,
  contracts: draftContracts,
  decisions: [
    { id: "CAST-DRAFT-001", decision: "Every organization-owned table carries organisation_id and an alternate (id, organisation_id) key; tenant-local relations use composite references.", rationale: "Keeps cross-tenant references structurally closed in the draft model.", status: "PROPOSED" },
    { id: "CAST-DRAFT-002", decision: "Generated DRAFT table IDs use UUID v4; lifecycle timestamps are UTC instants; retention is represented by a proposed policy ID.", rationale: "Makes provider previews deterministic while keeping retention policy unapproved.", status: "PROPOSED" },
    { id: "CAST-DRAFT-003", decision: "Child deletes restrict by default; any cascade or external side-effect policy requires an explicit reviewed decision.", rationale: "Avoids silently erasing casting, approval, evidence, or audit history.", status: "PROPOSED" },
    { id: "CAST-DRAFT-004", decision: "People actor fields reference global identity.users; application authorization must verify the actor's active organisation/workspace membership and applicable project access.", rationale: "User identity is global. Membership and project access remain runtime authorization checks; the user foreign key proves identity existence only.", status: "APPROVED", approvedBy: "thelinep", approvedAt: "2026-10-03" },
  ],
};

await mkdir(outputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "contracts.draft.json"), `${JSON.stringify(packageFile, null, 2)}\n`);
await writeFile(path.join(outputRoot, "logical-schema.draft.json"), `${JSON.stringify(logical, null, 2)}\n`);
await writeFile(path.join(outputRoot, "readiness.draft.json"), `${JSON.stringify({ status: packageFile.status, schemaLifecycle: packageFile.schemaLifecycle, schemaReady, canonicalCoverage: canonicalCoverage.counts, closureCoverage: closureCoverage.counts, contractSetHash, structuralReadiness: readiness, logicalSchemaHash: logical.schemaHash, closureTableIds: closureIds }, null, 2)}\n`);
for (const targetProvider of ["postgresql", "sqlite"]) {
  const preview = generatePrismaPreview(logical, { targetProvider });
  if (preview.status !== "GENERATED_UNVALIDATED") throw new Error(`CASTING_PRISMA_PREVIEW_FAILED:${targetProvider}:${JSON.stringify(preview.blockers)}`);
  await writeFile(path.join(outputRoot, `prisma-preview.${targetProvider}.draft.prisma`), preview.schema);
  await writeFile(path.join(outputRoot, `prisma-preview.${targetProvider}.draft.metadata.json`), `${JSON.stringify(preview.metadata, null, 2)}\n`);
}
console.log(JSON.stringify({ applicationId: ir.application.appId, requestedTables: tableIds.length, preExistingDefinitions: tableIds.length - draftContracts.length, authoredDraftContracts: draftContracts.length, canonicalCoverage: canonicalCoverage.counts, closureCoverage: closureCoverage.counts, structuralStatus: readiness.status, logicalStatus: logical.status, schemaReady, fkClosure: "PASS", effectiveClosureTables: logical.model.tables.length, contractSetHash, logicalSchemaHash: logical.schemaHash, lifecycle: "DRAFT" }, null, 2));
