-- Migration-only enforcement overlay for approved MAATAA Communications invariants.
-- Apply after the generated Prisma schema creates these tables. This file is a
-- preview artifact; it is not an instruction to execute against any database.

ALTER TABLE "communications_announcements"
  ADD CONSTRAINT "ck_communications_announcements_audience_scope"
  CHECK (
    ("audience_kind" = 'ORGANISATION' AND "workspace_id" IS NULL)
    OR
    ("audience_kind" = 'WORKSPACE' AND "workspace_id" IS NOT NULL)
  );

ALTER TABLE "communications_direct_message_threads"
  ADD CONSTRAINT "ck_communications_direct_message_pair_order"
  CHECK ("participant_low_membership_id" < "participant_high_membership_id");

CREATE OR REPLACE FUNCTION "enforce_communications_direct_message_parent"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "communications_communication_threads" AS parent
    WHERE parent."organisation_id" = NEW."organisation_id"
      AND parent."id" = NEW."thread_id"
      AND parent."workspace_id" = NEW."workspace_id"
      AND parent."kind" = 'direct'
  ) THEN
    RAISE EXCEPTION 'direct-message mapping must reference a direct thread in the same tenant and workspace'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_communications_direct_message_parent_insert"
  BEFORE INSERT ON "communications_direct_message_threads"
  FOR EACH ROW EXECUTE FUNCTION "enforce_communications_direct_message_parent"();

CREATE TRIGGER "trg_communications_direct_message_parent_update"
  BEFORE UPDATE OF "organisation_id", "thread_id", "workspace_id"
  ON "communications_direct_message_threads"
  FOR EACH ROW EXECUTE FUNCTION "enforce_communications_direct_message_parent"();

CREATE OR REPLACE FUNCTION "enforce_communications_direct_thread_kind"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "communications_direct_message_threads" AS mapping
    WHERE mapping."organisation_id" = OLD."organisation_id"
      AND mapping."thread_id" = OLD."id"
  ) AND (NEW."kind" <> 'direct' OR NEW."workspace_id" IS DISTINCT FROM OLD."workspace_id") THEN
    RAISE EXCEPTION 'a mapped direct-message thread must remain direct and in its original workspace'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_communications_direct_thread_kind_update"
  BEFORE UPDATE OF "kind", "workspace_id"
  ON "communications_communication_threads"
  FOR EACH ROW EXECUTE FUNCTION "enforce_communications_direct_thread_kind"();

CREATE UNIQUE INDEX "uq_communications_thread_members_active_episode"
  ON "communications_thread_members" (
    "organisation_id",
    "workspace_id",
    "thread_id",
    "workspace_membership_id"
  )
  WHERE "left_at" IS NULL;

CREATE OR REPLACE FUNCTION "enforce_communications_thread_membership_episode"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD."organisation_id" IS DISTINCT FROM NEW."organisation_id"
    OR OLD."workspace_id" IS DISTINCT FROM NEW."workspace_id"
    OR OLD."thread_id" IS DISTINCT FROM NEW."thread_id"
    OR OLD."workspace_membership_id" IS DISTINCT FROM NEW."workspace_membership_id"
    OR OLD."joined_at" IS DISTINCT FROM NEW."joined_at"
    OR OLD."created_at" IS DISTINCT FROM NEW."created_at"
    OR (OLD."left_at" IS NOT NULL AND NEW."left_at" IS DISTINCT FROM OLD."left_at") THEN
    RAISE EXCEPTION 'thread membership episode identity is immutable and ended episodes cannot be reopened or rewritten'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_communications_thread_membership_episode_update"
  BEFORE UPDATE ON "communications_thread_members"
  FOR EACH ROW EXECUTE FUNCTION "enforce_communications_thread_membership_episode"();
