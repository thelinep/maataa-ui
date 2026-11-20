-- Migration-only enforcement overlay for approved MAATAA Communications invariants.
-- Append after the generated Prisma schema creates these tables. SQLite cannot
-- add CHECK constraints to existing tables with ALTER TABLE, so equivalent
-- BEFORE triggers enforce inserts and changes to the constrained columns.
-- This file is a preview artifact; it is not an instruction to execute against
-- any database.

CREATE TRIGGER "trg_communications_announcements_audience_scope_insert"
BEFORE INSERT ON "communications_announcements"
WHEN NOT (
  (NEW."audience_kind" = 'ORGANISATION' AND NEW."workspace_id" IS NULL)
  OR
  (NEW."audience_kind" = 'WORKSPACE' AND NEW."workspace_id" IS NOT NULL)
)
BEGIN
  SELECT RAISE(ABORT, 'announcement audience must match workspace scope');
END;

CREATE TRIGGER "trg_communications_announcements_audience_scope_update"
BEFORE UPDATE OF "audience_kind", "workspace_id" ON "communications_announcements"
WHEN NOT (
  (NEW."audience_kind" = 'ORGANISATION' AND NEW."workspace_id" IS NULL)
  OR
  (NEW."audience_kind" = 'WORKSPACE' AND NEW."workspace_id" IS NOT NULL)
)
BEGIN
  SELECT RAISE(ABORT, 'announcement audience must match workspace scope');
END;

CREATE TRIGGER "trg_communications_direct_message_pair_order_insert"
BEFORE INSERT ON "communications_direct_message_threads"
WHEN NOT (
  length(NEW."participant_low_membership_id") = 36
  AND length(replace(NEW."participant_low_membership_id", '-', '')) = 32
  AND substr(NEW."participant_low_membership_id", 9, 1) = '-'
  AND substr(NEW."participant_low_membership_id", 14, 1) = '-'
  AND substr(NEW."participant_low_membership_id", 19, 1) = '-'
  AND substr(NEW."participant_low_membership_id", 24, 1) = '-'
  AND lower(NEW."participant_low_membership_id") NOT GLOB '*[^0-9a-f-]*'
  AND length(NEW."participant_high_membership_id") = 36
  AND length(replace(NEW."participant_high_membership_id", '-', '')) = 32
  AND substr(NEW."participant_high_membership_id", 9, 1) = '-'
  AND substr(NEW."participant_high_membership_id", 14, 1) = '-'
  AND substr(NEW."participant_high_membership_id", 19, 1) = '-'
  AND substr(NEW."participant_high_membership_id", 24, 1) = '-'
  AND lower(NEW."participant_high_membership_id") NOT GLOB '*[^0-9a-f-]*'
  AND lower(NEW."participant_low_membership_id") < lower(NEW."participant_high_membership_id")
)
BEGIN
  SELECT RAISE(ABORT, 'direct-message membership IDs must be strictly ordered');
END;

CREATE TRIGGER "trg_communications_direct_message_pair_order_update"
BEFORE UPDATE OF "participant_low_membership_id", "participant_high_membership_id" ON "communications_direct_message_threads"
WHEN NOT (
  length(NEW."participant_low_membership_id") = 36
  AND length(replace(NEW."participant_low_membership_id", '-', '')) = 32
  AND substr(NEW."participant_low_membership_id", 9, 1) = '-'
  AND substr(NEW."participant_low_membership_id", 14, 1) = '-'
  AND substr(NEW."participant_low_membership_id", 19, 1) = '-'
  AND substr(NEW."participant_low_membership_id", 24, 1) = '-'
  AND lower(NEW."participant_low_membership_id") NOT GLOB '*[^0-9a-f-]*'
  AND length(NEW."participant_high_membership_id") = 36
  AND length(replace(NEW."participant_high_membership_id", '-', '')) = 32
  AND substr(NEW."participant_high_membership_id", 9, 1) = '-'
  AND substr(NEW."participant_high_membership_id", 14, 1) = '-'
  AND substr(NEW."participant_high_membership_id", 19, 1) = '-'
  AND substr(NEW."participant_high_membership_id", 24, 1) = '-'
  AND lower(NEW."participant_high_membership_id") NOT GLOB '*[^0-9a-f-]*'
  AND lower(NEW."participant_low_membership_id") < lower(NEW."participant_high_membership_id")
)
BEGIN
  SELECT RAISE(ABORT, 'direct-message membership IDs must be strictly ordered');
END;

CREATE TRIGGER "trg_communications_direct_message_parent_insert"
BEFORE INSERT ON "communications_direct_message_threads"
WHEN NOT EXISTS (
  SELECT 1
  FROM "communications_communication_threads" AS parent
  WHERE parent."organisation_id" = NEW."organisation_id"
    AND parent."id" = NEW."thread_id"
    AND parent."workspace_id" = NEW."workspace_id"
    AND parent."kind" = 'direct'
)
BEGIN
  SELECT RAISE(ABORT, 'direct-message mapping must reference a direct thread in the same tenant and workspace');
END;

CREATE TRIGGER "trg_communications_direct_message_parent_update"
BEFORE UPDATE OF "organisation_id", "thread_id", "workspace_id" ON "communications_direct_message_threads"
WHEN NOT EXISTS (
  SELECT 1
  FROM "communications_communication_threads" AS parent
  WHERE parent."organisation_id" = NEW."organisation_id"
    AND parent."id" = NEW."thread_id"
    AND parent."workspace_id" = NEW."workspace_id"
    AND parent."kind" = 'direct'
)
BEGIN
  SELECT RAISE(ABORT, 'direct-message mapping must reference a direct thread in the same tenant and workspace');
END;

CREATE TRIGGER "trg_communications_direct_thread_kind_update"
BEFORE UPDATE OF "kind", "workspace_id" ON "communications_communication_threads"
WHEN EXISTS (
  SELECT 1
  FROM "communications_direct_message_threads" AS mapping
  WHERE mapping."organisation_id" = OLD."organisation_id"
    AND mapping."thread_id" = OLD."id"
) AND (NEW."kind" <> 'direct' OR NEW."workspace_id" IS NOT OLD."workspace_id")
BEGIN
  SELECT RAISE(ABORT, 'a mapped direct-message thread must remain direct and in its original workspace');
END;

CREATE TRIGGER "trg_communications_thread_membership_episode_update"
BEFORE UPDATE ON "communications_thread_members"
WHEN OLD."organisation_id" IS NOT NEW."organisation_id"
  OR OLD."workspace_id" IS NOT NEW."workspace_id"
  OR OLD."thread_id" IS NOT NEW."thread_id"
  OR OLD."workspace_membership_id" IS NOT NEW."workspace_membership_id"
  OR OLD."joined_at" IS NOT NEW."joined_at"
  OR OLD."created_at" IS NOT NEW."created_at"
  OR (OLD."left_at" IS NOT NULL AND OLD."left_at" IS NOT NEW."left_at")
BEGIN
  SELECT RAISE(ABORT, 'thread membership episode identity is immutable and ended episodes cannot be reopened or rewritten');
END;

CREATE UNIQUE INDEX "uq_communications_thread_members_active_episode"
  ON "communications_thread_members" (
    "organisation_id",
    "workspace_id",
    "thread_id",
    "workspace_membership_id"
  )
  WHERE "left_at" IS NULL;
