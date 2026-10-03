-- STATUS: GENERATED REVIEW-ONLY EMPTY-DATABASE BOOTSTRAP PREVIEW; NOT AN APPROVED MIGRATION.
-- Canonical 352-table schema input; no target baseline, data migration, or provider enforcement overlay is included.
-- Do not execute. Review M4 target compatibility, invariant enforcement, backfill, backup, restore, and rollback evidence first.

-- CreateTable
CREATE TABLE "campaign_activation_calendar_items" (
    "activation_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_kind" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_activation_calendar_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_calendar_items_activation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("activation_id", "workspace_id", "organisation_id") REFERENCES "campaign_activations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_calendar_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_calendar_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_activation_feed_events" (
    "activation_id" TEXT NOT NULL,
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "event_kind" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_activation_feed_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_feed_events_activation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("activation_id", "workspace_id", "organisation_id") REFERENCES "campaign_activations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_feed_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_feed_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activation_feed_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_activations" (
    "activation_kind" TEXT NOT NULL,
    "activation_status" TEXT NOT NULL DEFAULT 'planned',
    "budget" DECIMAL,
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "starts_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_activations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activations_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activations_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activations_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_activations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_atl_plans" (
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "details" TEXT,
    "gross_rating_points" DECIMAL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_plan_id" TEXT,
    "medium" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "planned_spend" DECIMAL,
    "reach_target" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_atl_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_atl_plans_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_atl_plans_media_plan_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("media_plan_id", "workspace_id", "organisation_id") REFERENCES "campaign_media_plans" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_atl_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_atl_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_btl_plans" (
    "activation_type" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "details" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locations" JSONB,
    "media_plan_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "planned_spend" DECIMAL,
    "staffing_count" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_btl_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_btl_plans_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_btl_plans_media_plan_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("media_plan_id", "workspace_id", "organisation_id") REFERENCES "campaign_media_plans" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_btl_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_btl_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_campaign_briefs" (
    "audience" TEXT,
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "deliverables" JSONB,
    "due_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_campaign_briefs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_briefs_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_briefs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_briefs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_campaign_markets" (
    "budget_share" DECIMAL,
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "market_id" TEXT NOT NULL,
    "market_status" TEXT NOT NULL DEFAULT 'target',
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_campaign_markets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_markets_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_markets_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "campaign_markets" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_markets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_markets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_campaign_metrics" (
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "dimensions" JSONB,
    "id" TEXT NOT NULL PRIMARY KEY,
    "metric_key" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "period_end" DATETIME,
    "period_start" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DECIMAL NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_campaign_metrics_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_metrics_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_metrics_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_metrics_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_campaign_results" (
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "measured_at" DATETIME NOT NULL,
    "measured_value" DECIMAL NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "result_kind" TEXT NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_campaign_results_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_results_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_results_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_results_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_campaign_strategies" (
    "campaign_id" TEXT NOT NULL,
    "channels" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "positioning" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "success_criteria" JSONB,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_campaign_strategies_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_strategies_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_strategies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaign_strategies_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_campaigns" (
    "budget" DECIMAL,
    "campaign_kind" TEXT NOT NULL,
    "campaign_status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "project_id" TEXT NOT NULL,
    "starts_on" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_campaigns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaigns_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaigns_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaigns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_campaigns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_cities" (
    "city_code" TEXT,
    "country_code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_cities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_dooh_schedules" (
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "creative_uri" TEXT,
    "dooh_screen_id" TEXT NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "frequency_per_hour" INTEGER,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "schedule_status" TEXT NOT NULL DEFAULT 'draft',
    "starts_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_dooh_schedules_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_schedules_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_schedules_dooh_screen_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("dooh_screen_id", "workspace_id", "organisation_id") REFERENCES "campaign_dooh_screens" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_schedules_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_schedules_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_dooh_screens" (
    "availability" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT,
    "location_note" TEXT,
    "organisation_id" TEXT NOT NULL,
    "orientation" TEXT,
    "resolution" TEXT,
    "screen_code" TEXT NOT NULL,
    "screen_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_dooh_screens_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_screens_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_screens_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_dooh_screens_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_lead_events" (
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "event_kind" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_id" TEXT NOT NULL,
    "notes" TEXT,
    "occurred_at" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "payload" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_lead_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_lead_events_lead_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("lead_id", "workspace_id", "organisation_id") REFERENCES "campaign_leads" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_lead_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_lead_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_lead_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_leads" (
    "assigned_to_user_id" TEXT,
    "campaign_id" TEXT,
    "consent_status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "email" TEXT,
    "full_name" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_status" TEXT NOT NULL DEFAULT 'new',
    "organisation_id" TEXT NOT NULL,
    "organisation_name" TEXT,
    "phone" TEXT,
    "source" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_leads_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_leads_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_leads_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_leads_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_leads_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_markets" (
    "country_code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "market_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "timezone" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_markets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_media_plan_items" (
    "channel" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "impressions_target" INTEGER,
    "media_plan_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "placement" TEXT,
    "planned_spend" DECIMAL,
    "sort_order" INTEGER NOT NULL,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_media_plan_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_media_plan_items_media_plan_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("media_plan_id", "workspace_id", "organisation_id") REFERENCES "campaign_media_plans" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_media_plan_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_media_plan_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_media_plans" (
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "objective" TEXT,
    "organisation_id" TEXT NOT NULL,
    "plan_version" INTEGER NOT NULL,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "total_budget" DECIMAL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_media_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_media_plans_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_media_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_media_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_ooh_site_bookings" (
    "booking_status" TEXT NOT NULL DEFAULT 'held',
    "campaign_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "ooh_site_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "price" DECIMAL,
    "project_id" TEXT NOT NULL,
    "proof_uri" TEXT,
    "starts_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_ooh_site_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_site_bookings_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_site_bookings_ooh_site_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("ooh_site_id", "workspace_id", "organisation_id") REFERENCES "campaign_ooh_sites" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_site_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_site_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_site_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_ooh_sites" (
    "address" TEXT,
    "availability_note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "format" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL,
    "location_id" TEXT,
    "longitude" DECIMAL,
    "organisation_id" TEXT NOT NULL,
    "rate_card" DECIMAL,
    "site_code" TEXT,
    "site_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_ooh_sites_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_sites_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_sites_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_ooh_sites_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "campaign_site_checkins" (
    "activation_id" TEXT NOT NULL,
    "checked_in_at" DATETIME NOT NULL,
    "checked_in_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL,
    "location_id" TEXT,
    "longitude" DECIMAL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_method" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "campaign_site_checkins_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_site_checkins_activation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("activation_id", "workspace_id", "organisation_id") REFERENCES "campaign_activations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_site_checkins_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_site_checkins_checked_in_by_user_id_fkey" FOREIGN KEY ("checked_in_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "campaign_site_checkins_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "campaign_site_checkins_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_announcements" (
    "audience_kind" TEXT NOT NULL,
    "author_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "published_at" DATETIME,
    "retired_at" DATETIME,
    "scheduled_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" DATETIME,
    "workspace_id" TEXT,
    CONSTRAINT "communications_announcements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_announcements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_announcements_organisation_id_author_user_id_fkey" FOREIGN KEY ("organisation_id", "author_user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_announcements_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_communication_threads" (
    "archived_at" DATETIME,
    "closed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "subject" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "communications_communication_threads_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_communication_threads_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_communication_threads_organisation_id_created_by_user_id_fkey" FOREIGN KEY ("organisation_id", "created_by_user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_communication_threads_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_direct_message_threads" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "participant_high_membership_id" TEXT NOT NULL,
    "participant_low_membership_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "communications_direct_message_threads_organisation_id_thread_id_workspace_id_fkey" FOREIGN KEY ("organisation_id", "thread_id", "workspace_id") REFERENCES "communications_communication_threads" ("organisation_id", "id", "workspace_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_direct_message_threads_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_direct_message_threads_participant_low_membership_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("participant_low_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_direct_message_threads_participant_high_membership_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("participant_high_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_message_attachments" (
    "byte_length" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT NOT NULL,
    "deleted_at" DATETIME,
    "file_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_type" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    CONSTRAINT "communications_message_attachments_organisation_id_message_id_fkey" FOREIGN KEY ("organisation_id", "message_id") REFERENCES "communications_messages" ("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_message_attachments_organisation_id_created_by_user_id_fkey" FOREIGN KEY ("organisation_id", "created_by_user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_message_attachments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_messages" (
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "redacted_at" DATETIME,
    "redacted_by_user_id" TEXT,
    "redaction_reason" TEXT,
    "sender_user_id" TEXT NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'visible',
    "thread_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "communications_messages_organisation_id_thread_id_fkey" FOREIGN KEY ("organisation_id", "thread_id") REFERENCES "communications_communication_threads" ("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_messages_organisation_id_sender_user_id_fkey" FOREIGN KEY ("organisation_id", "sender_user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_messages_redacted_by_user_id_fkey" FOREIGN KEY ("redacted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "communications_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_notification_deliveries" (
    "attempt_number" INTEGER NOT NULL,
    "attempted_at" DATETIME,
    "channel" TEXT NOT NULL,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" DATETIME,
    "failed_at" DATETIME,
    "failure_code" TEXT,
    "failure_detail" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "idempotency_key" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "provider_identifier" TEXT,
    "provider_reference" TEXT,
    "response_metadata" JSONB,
    "scheduled_at" DATETIME,
    "sent_at" DATETIME,
    "status" TEXT NOT NULL,
    "terminal_at" DATETIME,
    CONSTRAINT "communications_notification_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notification_deliveries_organisation_id_notification_id_fkey" FOREIGN KEY ("organisation_id", "notification_id") REFERENCES "communications_notifications" ("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_notification_preferences" (
    "channel" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notification_type" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "communications_notification_preferences_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notification_preferences_organisation_id_user_id_fkey" FOREIGN KEY ("organisation_id", "user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_notifications" (
    "action_uri" TEXT,
    "actor_user_id" TEXT,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissed_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notification_type" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "read_at" DATETIME,
    "recipient_user_id" TEXT NOT NULL,
    "resource_id" TEXT,
    "resource_type" TEXT,
    "state" TEXT NOT NULL DEFAULT 'unread',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "communications_notifications_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notifications_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "communications_notifications_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notifications_organisation_id_recipient_user_id_fkey" FOREIGN KEY ("organisation_id", "recipient_user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notifications_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_notifications_organisation_id_actor_user_id_fkey" FOREIGN KEY ("organisation_id", "actor_user_id") REFERENCES "organisation_organisation_memberships" ("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "communications_thread_members" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_read_at" DATETIME,
    "left_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "workspace_membership_id" TEXT NOT NULL,
    CONSTRAINT "communications_thread_members_organisation_id_thread_id_workspace_id_fkey" FOREIGN KEY ("organisation_id", "thread_id", "workspace_id") REFERENCES "communications_communication_threads" ("organisation_id", "id", "workspace_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "communications_thread_members_workspace_membership_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_asset_versions" (
    "change_summary" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "creative_asset_id" TEXT NOT NULL,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "storage_uri" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_asset_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_asset_versions_creative_asset_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("creative_asset_id", "workspace_id", "organisation_id") REFERENCES "creative_creative_assets" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_asset_versions_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_asset_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_asset_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_character_scene_links" (
    "appearance_note" TEXT,
    "character_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "scene_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_character_scene_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_character_scene_links_character_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("character_id", "workspace_id", "organisation_id") REFERENCES "creative_characters" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_character_scene_links_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_character_scene_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_character_scene_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_characters" (
    "age_range" TEXT,
    "character_kind" TEXT NOT NULL,
    "continuity_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "talent_profile_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_characters_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_characters_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_characters_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_characters_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_characters_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_creative_approvals" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "creative_asset_id" TEXT,
    "decided_at" DATETIME,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "feedback" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "reviewer_user_id" TEXT,
    "script_version_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subject_kind" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_creative_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_approvals_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_approvals_script_version_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_version_id", "workspace_id", "organisation_id") REFERENCES "creative_script_versions" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_approvals_creative_asset_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("creative_asset_id", "workspace_id", "organisation_id") REFERENCES "creative_creative_assets" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_approvals_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_creative_assets" (
    "asset_kind" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "license" TEXT,
    "metadata" JSONB,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "rights_note" TEXT,
    "source_uri" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_creative_assets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_assets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_assets_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_assets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_assets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_creative_references" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "credit" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "reference_kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_creative_references_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_references_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_references_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_references_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_creative_references_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_ideas" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "logline" TEXT,
    "organisation_id" TEXT NOT NULL,
    "premise" TEXT,
    "priority" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_ideas_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_ideas_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_ideas_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_ideas_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_production_elements" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "element_kind" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "quantity" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_production_elements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_production_elements_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_production_elements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_production_elements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_research_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "findings" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "method" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "source_uri" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_research_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_research_items_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_research_items_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_research_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_research_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_scene_elements" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "production_element_id" TEXT NOT NULL,
    "quantity" DECIMAL,
    "scene_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_scene_elements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_elements_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_elements_production_element_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("production_element_id", "workspace_id", "organisation_id") REFERENCES "creative_production_elements" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_elements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_elements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_scene_versions" (
    "change_summary" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "scene_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_scene_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_versions_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_scene_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_scenes" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "heading" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "interior_exterior" TEXT NOT NULL,
    "location_text" TEXT,
    "organisation_id" TEXT NOT NULL,
    "scene_number" TEXT NOT NULL,
    "script_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "time_of_day" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_scenes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scenes_script_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scenes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_scenes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_script_breakdowns" (
    "category" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "quantity" DECIMAL,
    "scene_id" TEXT,
    "script_version_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_script_breakdowns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_breakdowns_script_version_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_version_id", "workspace_id", "organisation_id") REFERENCES "creative_script_versions" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_breakdowns_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_breakdowns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_breakdowns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_script_versions" (
    "change_summary" TEXT,
    "content_uri" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "script_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_script_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_versions_script_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_script_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_scripts" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "format" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "language" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "treatment_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "working_draft" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_scripts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scripts_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scripts_treatment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("treatment_id", "workspace_id", "organisation_id") REFERENCES "creative_treatments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_scripts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_scripts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_shot_lists" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "objective" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "script_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_shot_lists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_shot_lists_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_shot_lists_script_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_shot_lists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_shot_lists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_shots" (
    "camera_setup" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "duration_seconds" DECIMAL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "lens" TEXT,
    "movement" TEXT,
    "organisation_id" TEXT NOT NULL,
    "scene_id" TEXT NOT NULL,
    "shot_list_id" TEXT NOT NULL,
    "shot_number" TEXT NOT NULL,
    "shot_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_shots_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_shots_shot_list_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("shot_list_id", "workspace_id", "organisation_id") REFERENCES "creative_shot_lists" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_shots_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_shots_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_shots_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_storyboard_frames" (
    "camera_note" TEXT,
    "caption" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "frame_number" INTEGER NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "image_uri" TEXT,
    "organisation_id" TEXT NOT NULL,
    "scene_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "storyboard_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_storyboard_frames_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboard_frames_storyboard_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("storyboard_id", "workspace_id", "organisation_id") REFERENCES "creative_storyboards" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboard_frames_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboard_frames_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboard_frames_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_storyboards" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "script_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "status_note" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_storyboards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboards_script_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_storyboards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "creative_treatments" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "logline" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "synopsis" TEXT,
    "target_minutes" INTEGER,
    "title" TEXT NOT NULL,
    "tone" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "creative_treatments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_treatments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "creative_treatments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "creative_treatments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_board_items" (
    "board_id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "position_x" DECIMAL,
    "position_y" DECIMAL,
    "size_h" DECIMAL,
    "size_w" DECIMAL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_board_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_board_items_board_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("board_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_boards" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_board_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_board_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_boards" (
    "board_kind" TEXT NOT NULL,
    "board_status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "event_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "spatial_project_id" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_boards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_boards_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_boards_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_boards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_boards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_cad_models" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "file_uri" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "model_version" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "spatial_project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "units" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_cad_models_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_cad_models_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_cad_models_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_cad_models_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_cad_models_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_cad_models_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_decision_graph_edges" (
    "condition" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decision_graph_id" TEXT NOT NULL,
    "edge_kind" TEXT NOT NULL,
    "from_node_key" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "to_node_key" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_decision_graph_edges_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graph_edges_decision_graph_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("decision_graph_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_decision_graphs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graph_edges_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graph_edges_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_decision_graph_nodes" (
    "config" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decision_graph_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "node_key" TEXT NOT NULL,
    "node_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_decision_graph_nodes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graph_nodes_decision_graph_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("decision_graph_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_decision_graphs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graph_nodes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graph_nodes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_decision_graphs" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "graph_status" TEXT NOT NULL DEFAULT 'draft',
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "spatial_project_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_decision_graphs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graphs_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graphs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_decision_graphs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_event_journeys" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "event_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "journey_kind" TEXT NOT NULL,
    "journey_status" TEXT NOT NULL DEFAULT 'draft',
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_event_journeys_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_event_journeys_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_event_journeys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_event_journeys_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_event_timeline_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME,
    "event_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "owner_label" TEXT,
    "sort_order" INTEGER NOT NULL,
    "stage" TEXT,
    "starts_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_event_timeline_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_event_timeline_items_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_event_timeline_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_event_timeline_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_events" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "ends_at" DATETIME,
    "event_kind" TEXT NOT NULL,
    "event_status" TEXT NOT NULL DEFAULT 'draft',
    "guest_capacity" INTEGER,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "starts_at" DATETIME NOT NULL,
    "timezone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_id" TEXT,
    "wedding_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_events_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_events_wedding_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("wedding_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_weddings" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_events_venue_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_exhibition_layouts" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "layout_data" JSONB NOT NULL,
    "layout_status" TEXT NOT NULL DEFAULT 'draft',
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "spatial_project_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_area" TEXT,
    "venue_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_exhibition_layouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_exhibition_layouts_venue_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_exhibition_layouts_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_exhibition_layouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_exhibition_layouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_film_twins" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "last_synced_at" DATETIME,
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "source_project_id" TEXT,
    "spatial_project_id" TEXT,
    "twin_status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_film_twins_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_film_twins_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_film_twins_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_film_twins_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_film_twins_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_presentation_slides" (
    "background_uri" TEXT,
    "content" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "presentation_id" TEXT NOT NULL,
    "slide_number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_presentation_slides_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentation_slides_presentation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("presentation_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_presentations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentation_slides_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentation_slides_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_presentations" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "event_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "presentation_status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "spatial_project_id" TEXT,
    "theme" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_presentations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentations_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentations_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_presentations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_run_of_show_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "cue" TEXT NOT NULL,
    "duration_minutes" INTEGER,
    "event_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator_note" TEXT,
    "organisation_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "starts_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "status_note" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_run_of_show_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_run_of_show_items_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_run_of_show_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_run_of_show_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_simulations" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "layout_id" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "requested_by_user_id" TEXT,
    "results" JSONB,
    "simulation_kind" TEXT NOT NULL,
    "simulation_status" TEXT NOT NULL DEFAULT 'queued',
    "spatial_project_id" TEXT NOT NULL,
    "started_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_simulations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_simulations_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_simulations_layout_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("layout_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_layouts" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_simulations_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_simulations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_simulations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_layers" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "layer_kind" TEXT NOT NULL,
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "opacity" DECIMAL,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "spatial_project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_spatial_layers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_layers_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_layers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_layers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_layouts" (
    "canvas_height" DECIMAL,
    "canvas_width" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "layout_data" JSONB NOT NULL,
    "layout_status" TEXT NOT NULL DEFAULT 'draft',
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "spatial_project_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_spatial_layouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_layouts_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_layouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_layouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_objects" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "geometry" JSONB NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "object_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "properties" JSONB,
    "sort_order" INTEGER NOT NULL,
    "spatial_layer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "transform" JSONB,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_spatial_objects_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_objects_spatial_layer_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_layer_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_layers" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_objects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_objects_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_operations" (
    "actor_label" TEXT,
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL,
    "operation_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "sequence" INTEGER NOT NULL,
    "spatial_project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_spatial_operations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_operations_spatial_project_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_operations_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_operations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_operations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_projects" (
    "coordinate_reference" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "event_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "project_status" TEXT NOT NULL DEFAULT 'draft',
    "spatial_kind" TEXT NOT NULL,
    "units" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_spatial_projects_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_projects_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_projects_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_projects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_spatial_projects_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_venue_bookings" (
    "booking_status" TEXT NOT NULL DEFAULT 'held',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "event_id" TEXT,
    "guest_count" INTEGER,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "quoted_cost" DECIMAL,
    "starts_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_venue_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venue_bookings_venue_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venue_bookings_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venue_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venue_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venue_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_venues" (
    "accessibility" TEXT,
    "address" TEXT,
    "capacity" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL,
    "location_id" TEXT,
    "longitude" DECIMAL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_kind" TEXT NOT NULL,
    "venue_status" TEXT NOT NULL DEFAULT 'active',
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_venues_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venues_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venues_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_venues_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_wedding_events" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME,
    "event_kind" TEXT NOT NULL,
    "guest_count" INTEGER,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_id" TEXT,
    "wedding_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_wedding_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_events_wedding_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("wedding_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_weddings" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_events_venue_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_wedding_journeys" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "journey_name" TEXT NOT NULL,
    "journey_stage" TEXT NOT NULL,
    "journey_status" TEXT NOT NULL DEFAULT 'planned',
    "organisation_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wedding_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_wedding_journeys_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_journeys_wedding_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("wedding_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_weddings" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_journeys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_wedding_journeys_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "eventsSpatial_weddings" (
    "client_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "display_name" TEXT NOT NULL,
    "guest_count" INTEGER,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "style_brief" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wedding_date" DATETIME,
    "wedding_status" TEXT NOT NULL DEFAULT 'inquiry',
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "eventsSpatial_weddings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_weddings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_weddings_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_weddings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "eventsSpatial_weddings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_approval_comments" (
    "approval_id" TEXT NOT NULL,
    "author_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_approval_comments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_comments_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_comments_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_comments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_comments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_approval_decisions" (
    "approval_id" TEXT NOT NULL,
    "approval_step_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decided_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_by_user_id" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "rationale" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_approval_decisions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_decisions_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_decisions_approval_step_id_organisation_id_fkey" FOREIGN KEY ("approval_step_id", "organisation_id") REFERENCES "evidence_approval_steps" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_decisions_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_decisions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_decisions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_approval_steps" (
    "approval_id" TEXT NOT NULL,
    "approver_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decided_at" DATETIME,
    "description" TEXT,
    "due_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "step_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_approval_steps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_steps_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_steps_approver_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_steps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approval_steps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_approvals" (
    "assigned_reviewer_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" DATETIME,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "decision_note" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "request_note" TEXT,
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_user_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evidence_approvals_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approvals_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "evidence_approvals_assigned_reviewer_user_id_fkey" FOREIGN KEY ("assigned_reviewer_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_audit_events" (
    "action" TEXT NOT NULL,
    "actor_user_id" TEXT,
    "correlation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata" JSONB NOT NULL DEFAULT {},
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "resource_id" TEXT,
    "resource_type" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evidence_audit_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_audit_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "evidence_audit_events_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_before_after_proofs" (
    "after_value" JSONB,
    "before_value" JSONB,
    "captured_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_request_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "subject_id" TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_before_after_proofs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_before_after_proofs_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_before_after_proofs_change_request_id_organisation_id_fkey" FOREIGN KEY ("change_request_id", "organisation_id") REFERENCES "evidence_change_requests" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_before_after_proofs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_before_after_proofs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_chain_of_custody_events" (
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "destination_party" TEXT,
    "event_type" TEXT NOT NULL,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrity_hash" TEXT,
    "name" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "source_party" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_chain_of_custody_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_chain_of_custody_events_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_chain_of_custody_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_chain_of_custody_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_chain_of_custody_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_change_requests" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "rationale" TEXT NOT NULL,
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_user_id" TEXT NOT NULL,
    "resolved_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_change_requests_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_change_requests_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_change_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_change_requests_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_change_requests_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_change_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_document_links" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "document_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "link_purpose" TEXT NOT NULL,
    "linked_by_user_id" TEXT,
    "linked_record_id" TEXT NOT NULL,
    "linked_record_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_document_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_links_document_id_organisation_id_fkey" FOREIGN KEY ("document_id", "organisation_id") REFERENCES "evidence_documents" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_links_linked_by_user_id_fkey" FOREIGN KEY ("linked_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_document_versions" (
    "byte_length" INTEGER,
    "captured_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checksum_sha256" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "document_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "storage_key" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_document_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_versions_document_id_organisation_id_fkey" FOREIGN KEY ("document_id", "organisation_id") REFERENCES "evidence_documents" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_versions_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_document_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_documents" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "current_version" INTEGER NOT NULL,
    "description" TEXT,
    "document_kind" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_documents_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_documents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_gps" (
    "accuracy_meters" DECIMAL,
    "captured_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_gps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_gps_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_gps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_gps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_items" (
    "captured_at" DATETIME,
    "content_sha256" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT {},
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "retention_until" DATETIME,
    "size_bytes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "storage_uri" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT,
    "withdrawn_at" DATETIME,
    CONSTRAINT "evidence_evidence_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_items_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_items_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_links" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "target_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_links_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_media" (
    "byte_length" INTEGER,
    "checksum_sha256" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "document_version_id" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "storage_key" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_media_document_version_id_organisation_id_fkey" FOREIGN KEY ("document_version_id", "organisation_id") REFERENCES "evidence_document_versions" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_metadata" (
    "classification" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata_key" TEXT NOT NULL,
    "metadata_value" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_metadata_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_metadata_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_metadata_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_metadata_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_timeline_events" (
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "details" JSONB,
    "event_type" TEXT NOT NULL,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "summary" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_timeline_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timeline_events_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timeline_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timeline_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timeline_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_timestamps" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "precision_ms" INTEGER,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "timestamp_kind" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_timestamps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timestamps_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timestamps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_timestamps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_evidence_verifications" (
    "checked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "outcome" TEXT NOT NULL DEFAULT 'pending',
    "report" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_kind" TEXT NOT NULL,
    "verified_by_user_id" TEXT,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_evidence_verifications_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_verifications_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_verifications_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_evidence_verifications_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_legal_holds" (
    "authorised_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "document_id" TEXT,
    "evidence_item_id" TEXT,
    "hold_reference" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "released_at" DATETIME,
    "starts_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_legal_holds_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_legal_holds_document_id_organisation_id_fkey" FOREIGN KEY ("document_id", "organisation_id") REFERENCES "evidence_documents" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_legal_holds_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_legal_holds_authorised_by_user_id_fkey" FOREIGN KEY ("authorised_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_legal_holds_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_legal_holds_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_risk_mitigations" (
    "action" TEXT NOT NULL,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "due_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "risk_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_risk_mitigations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risk_mitigations_risk_id_organisation_id_fkey" FOREIGN KEY ("risk_id", "organisation_id") REFERENCES "evidence_risks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risk_mitigations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risk_mitigations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risk_mitigations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_risks" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "impact" TEXT NOT NULL,
    "likelihood" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "project_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_risks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risks_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risks_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_risks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "evidence_trusted_timestamps" (
    "authority" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "token_reference" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_status" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "evidence_trusted_timestamps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_trusted_timestamps_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_trusted_timestamps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "evidence_trusted_timestamps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_budget_categories" (
    "code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_budget_categories_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_categories_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_budget_lines" (
    "approved_amount" DECIMAL,
    "budget_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "line_number" INTEGER NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "planned_amount" DECIMAL NOT NULL,
    "project_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_budget_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_lines_budget_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_id", "workspace_id", "organisation_id") REFERENCES "finance_budgets" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_lines_category_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("category_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_categories" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_lines_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_budget_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_budgets" (
    "approved_amount" DECIMAL,
    "budget_status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "fiscal_period" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "project_id" TEXT NOT NULL,
    "total_amount" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_budgets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budgets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_budgets_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_budgets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_budgets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_cashflow_entries" (
    "amount" DECIMAL NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "description" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'inflow',
    "entry_date" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "project_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_cashflow_entries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cashflow_entries_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cashflow_entries_payment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cashflow_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_cashflow_entries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_commitments" (
    "budget_line_id" TEXT,
    "commitment_number" TEXT NOT NULL,
    "commitment_status" TEXT NOT NULL DEFAULT 'open',
    "committed_amount" DECIMAL NOT NULL,
    "committed_on" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "purchase_order_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_commitments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_commitments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_commitments_budget_line_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_commitments_purchase_order_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_commitments_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_commitments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_commitments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_cost_sheet_lines" (
    "actual_amount" DECIMAL,
    "budget_line_id" TEXT,
    "cost_sheet_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT NOT NULL,
    "estimated_amount" DECIMAL NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "line_number" INTEGER NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_cost_sheet_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheet_lines_cost_sheet_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("cost_sheet_id", "workspace_id", "organisation_id") REFERENCES "finance_cost_sheets" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheet_lines_budget_line_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheet_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheet_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_cost_sheets" (
    "budget_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sheet_status" TEXT NOT NULL DEFAULT 'draft',
    "total_actual" DECIMAL,
    "total_estimated" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_cost_sheets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheets_budget_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_id", "workspace_id", "organisation_id") REFERENCES "finance_budgets" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_cost_sheets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_currencies" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "minor_unit_digits" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "symbol" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "finance_currencies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_estimate_lines" (
    "budget_line_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT NOT NULL,
    "estimate_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "line_number" INTEGER NOT NULL,
    "line_total" DECIMAL,
    "organisation_id" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "unit_cost" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_estimate_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimate_lines_estimate_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("estimate_id", "workspace_id", "organisation_id") REFERENCES "finance_estimates" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimate_lines_budget_line_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimate_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimate_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_estimates" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "estimate_number" TEXT NOT NULL,
    "estimate_status" TEXT NOT NULL DEFAULT 'draft',
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT,
    "subtotal" DECIMAL NOT NULL,
    "tax_total" DECIMAL,
    "total" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_estimates_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimates_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimates_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_estimates_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_exchange_rates" (
    "base_currency" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "effective_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "quote_currency" TEXT NOT NULL,
    "rate" DECIMAL NOT NULL,
    "rate_status" TEXT NOT NULL DEFAULT 'proposed',
    "source" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_by_user_id" TEXT,
    CONSTRAINT "finance_exchange_rates_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_exchange_rates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_expense_approvals" (
    "comment" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decided_at" DATETIME,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "expense_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "reviewer_user_id" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_expense_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_approvals_expense_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("expense_id", "workspace_id", "organisation_id") REFERENCES "finance_expenses" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_approvals_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_expense_lines" (
    "budget_line_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT NOT NULL,
    "expense_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "line_amount" DECIMAL NOT NULL,
    "line_number" INTEGER NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "quantity" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tax_code_id" TEXT,
    "unit" TEXT,
    "unit_amount" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_expense_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_lines_expense_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("expense_id", "workspace_id", "organisation_id") REFERENCES "finance_expenses" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_lines_budget_line_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_lines_tax_code_id_fkey" FOREIGN KEY ("tax_code_id") REFERENCES "finance_tax_codes" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_expense_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_expenses" (
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expense_date" DATETIME NOT NULL,
    "expense_number" TEXT NOT NULL,
    "expense_status" TEXT NOT NULL DEFAULT 'draft',
    "id" TEXT NOT NULL PRIMARY KEY,
    "merchant" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "submitted_by_user_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_expenses_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expenses_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_expenses_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_expenses_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_expenses_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_invoice_approvals" (
    "comment" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decided_at" DATETIME,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "reviewer_user_id" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_invoice_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_approvals_invoice_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_approvals_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_invoice_lines" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "line_amount" DECIMAL NOT NULL,
    "line_number" INTEGER NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "purchase_order_item_id" TEXT,
    "quantity" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tax_code_id" TEXT,
    "unit" TEXT,
    "unit_amount" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_invoice_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_lines_invoice_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_lines_purchase_order_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("purchase_order_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_order_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_lines_tax_code_id_fkey" FOREIGN KEY ("tax_code_id") REFERENCES "finance_tax_codes" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_invoice_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_payment_allocations" (
    "allocated_at" DATETIME NOT NULL,
    "allocation_kind" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "expense_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_payment_allocations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_allocations_payment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_allocations_invoice_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_allocations_expense_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("expense_id", "workspace_id", "organisation_id") REFERENCES "finance_expenses" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_allocations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_allocations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_payment_verifications" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "evidence_uri" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "reference" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_method" TEXT NOT NULL,
    "verification_status" TEXT NOT NULL DEFAULT 'pending',
    "verified_at" DATETIME,
    "verified_by_user_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_payment_verifications_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_verifications_payment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_verifications_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_verifications_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payment_verifications_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_payments" (
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "payment_date" DATETIME,
    "payment_method" TEXT NOT NULL,
    "payment_reference" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "provider_reference" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_payments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payments_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payments_invoice_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_payments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_payments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_profitability_snapshots" (
    "calculated_at" DATETIME NOT NULL,
    "calculated_by_user_id" TEXT,
    "cost" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "margin_percent" DECIMAL,
    "organisation_id" TEXT NOT NULL,
    "period_end" DATETIME NOT NULL,
    "period_start" DATETIME NOT NULL,
    "profit" DECIMAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "revenue" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_profitability_snapshots_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_profitability_snapshots_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_profitability_snapshots_calculated_by_user_id_fkey" FOREIGN KEY ("calculated_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_profitability_snapshots_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_profitability_snapshots_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_tax_codes" (
    "code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "effective_from" DATETIME NOT NULL,
    "effective_until" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rate_percent" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tax_kind" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "finance_tax_codes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "finance_vendor_invoices" (
    "commitment_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "due_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_number" TEXT NOT NULL,
    "invoice_status" TEXT NOT NULL DEFAULT 'received',
    "issued_on" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "purchase_order_id" TEXT,
    "subtotal" DECIMAL NOT NULL,
    "tax_total" DECIMAL,
    "total" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "finance_vendor_invoices_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_vendor_invoices_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_vendor_invoices_purchase_order_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_vendor_invoices_commitment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("commitment_id", "workspace_id", "organisation_id") REFERENCES "finance_commitments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "finance_vendor_invoices_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "finance_vendor_invoices_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_access_policies" (
    "action" TEXT NOT NULL,
    "conditions" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effect" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "policy_key" TEXT NOT NULL,
    "principal_kind" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "resource_pattern" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_from" DATETIME,
    "valid_until" DATETIME
);

-- CreateTable
CREATE TABLE "identity_access_reviews" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "due_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "review_kind" TEXT NOT NULL,
    "reviewed_at" DATETIME,
    "reviewer_user_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "subject_user_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "identity_access_reviews_subject_user_id_fkey" FOREIGN KEY ("subject_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_access_reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_auth_accounts" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issuer" TEXT,
    "last_authenticated_at" DATETIME,
    "linked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT NOT NULL,
    "provider_subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_auth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_auth_challenges" (
    "attempt_count" INTEGER NOT NULL,
    "challenge_hash" TEXT NOT NULL,
    "challenge_kind" TEXT NOT NULL,
    "consumed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "request_context" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    CONSTRAINT "identity_auth_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_auth_credentials" (
    "algorithm" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credential_hash" TEXT NOT NULL,
    "credential_kind" TEXT NOT NULL,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "revoked_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_auth_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_delegations" (
    "approved_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delegate_user_id" TEXT NOT NULL,
    "delegator_user_id" TEXT NOT NULL,
    "ends_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "reason" TEXT,
    "scope" JSONB NOT NULL,
    "starts_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "identity_delegations_delegator_user_id_fkey" FOREIGN KEY ("delegator_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_delegations_delegate_user_id_fkey" FOREIGN KEY ("delegate_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_delegations_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_device_verifications" (
    "attempt_count" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "verification_hash" TEXT NOT NULL,
    "verification_kind" TEXT NOT NULL,
    "verified_at" DATETIME,
    CONSTRAINT "identity_device_verifications_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "identity_devices" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_device_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_devices" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_fingerprint" TEXT NOT NULL,
    "device_kind" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "last_seen_at" DATETIME,
    "platform" TEXT,
    "revoked_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "trusted_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_invitations" (
    "accepted_at" DATETIME,
    "accepted_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "email" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invited_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invited_by_user_id" TEXT NOT NULL,
    "message" TEXT,
    "organisation_id" TEXT NOT NULL,
    "revoked_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "token_hash" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "identity_invitations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_invitations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_invitations_accepted_by_user_id_fkey" FOREIGN KEY ("accepted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_invitations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_location_verifications" (
    "country_code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" JSONB,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_hash" TEXT NOT NULL,
    "region_code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "verification_kind" TEXT NOT NULL,
    "verified_at" DATETIME,
    "verified_by_user_id" TEXT,
    CONSTRAINT "identity_location_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_location_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_nda_acceptances" (
    "acceptance_hash" TEXT NOT NULL,
    "accepted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip_address" TEXT,
    "nda_version_id" TEXT NOT NULL,
    "signature_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_nda_acceptances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_nda_acceptances_nda_version_id_fkey" FOREIGN KEY ("nda_version_id") REFERENCES "identity_nda_versions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_nda_acceptances_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "identity_signatures" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_nda_versions" (
    "content_reference" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "document_hash" TEXT NOT NULL,
    "effective_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "nda_id" TEXT NOT NULL,
    "retired_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    CONSTRAINT "identity_nda_versions_nda_id_fkey" FOREIGN KEY ("nda_id") REFERENCES "identity_ndas" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_ndas" (
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "required_for" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "identity_otp_challenges" (
    "attempt_count" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "consumed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destination" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    CONSTRAINT "identity_otp_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_password_reset_tokens" (
    "consumed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_ip" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "token_hash" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_permissions" (
    "action" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "identity_role_permissions" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "permission_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "identity_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity_roles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "identity_permissions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_role_permissions_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_roles" (
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "identity_signatures" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata" JSONB,
    "signature_hash" TEXT NOT NULL,
    "signature_kind" TEXT NOT NULL,
    "signed_at" DATETIME,
    "signer_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "storage_key" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    CONSTRAINT "identity_signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_user_emails" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "verification_method" TEXT,
    "verified_at" DATETIME,
    CONSTRAINT "identity_user_emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_user_phones" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_e164" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "verification_method" TEXT,
    "verified_at" DATETIME,
    CONSTRAINT "identity_user_phones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_user_profiles" (
    "avatar_uri" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "preferred_locale" TEXT,
    "time_zone" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_user_roles" (
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by_user_id" TEXT,
    "assignment_source" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "role_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity_roles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "identity_user_roles_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_user_sessions" (
    "client_label" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "last_used_at" DATETIME,
    "revoked_at" DATETIME,
    "token_hash" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "identity_user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "identity_users" (
    "closed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "intelligence_ai_citations" (
    "citation_index" INTEGER NOT NULL,
    "citation_kind" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "excerpt" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "message_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "page_number" INTEGER,
    "source_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_ai_citations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_citations_message_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("message_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_messages" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_citations_source_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("source_id", "workspace_id", "organisation_id") REFERENCES "intelligence_research_sources" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_citations_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_citations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_citations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_ai_contexts" (
    "attached_at" DATETIME NOT NULL,
    "attached_by_user_id" TEXT,
    "context_data" JSONB,
    "context_kind" TEXT NOT NULL,
    "conversation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "document_id" TEXT,
    "evidence_item_id" TEXT,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "source_reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_ai_contexts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_contexts_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_contexts_document_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("document_id", "workspace_id", "organisation_id") REFERENCES "intelligence_knowledge_documents" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_contexts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_contexts_attached_by_user_id_fkey" FOREIGN KEY ("attached_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_contexts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_contexts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_ai_conversations" (
    "assistant_kind" TEXT NOT NULL,
    "conversation_status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "last_activity_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "started_at" DATETIME NOT NULL,
    "title" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_ai_conversations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_conversations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_conversations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_conversations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_ai_messages" (
    "content" TEXT NOT NULL,
    "content_format" TEXT,
    "conversation_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "model_key" TEXT,
    "organisation_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'system',
    "sent_at" DATETIME NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "token_count" INTEGER,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_ai_messages_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_messages_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_messages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_messages_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_ai_suggestions" (
    "body" TEXT NOT NULL,
    "confidence" DECIMAL,
    "conversation_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "message_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "suggestion_kind" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_ai_suggestions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_suggestions_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_suggestions_message_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("message_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_messages" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_suggestions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_ai_suggestions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_analytics_events" (
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "event_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "properties" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subject_id" TEXT,
    "subject_type" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_analytics_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_analytics_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_analytics_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_analytics_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_evidence_aware_answers" (
    "answer" TEXT NOT NULL,
    "answered_at" DATETIME NOT NULL,
    "citation_count" INTEGER NOT NULL,
    "confidence" DECIMAL,
    "conversation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "grounding_status" TEXT NOT NULL DEFAULT 'grounded',
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "research_session_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_evidence_aware_answers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_evidence_aware_answers_research_session_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("research_session_id", "workspace_id", "organisation_id") REFERENCES "intelligence_research_sessions" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_evidence_aware_answers_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_evidence_aware_answers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_evidence_aware_answers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_forecast_runs" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "forecast_kind" TEXT NOT NULL,
    "generated_at" DATETIME,
    "horizon_end" DATETIME NOT NULL,
    "horizon_start" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "requested_by_user_id" TEXT,
    "run_status" TEXT NOT NULL DEFAULT 'queued',
    "target_metric" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_forecast_runs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_runs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_runs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_runs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_runs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_forecast_scenarios" (
    "assumptions" JSONB NOT NULL,
    "confidence_high" DECIMAL,
    "confidence_low" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "forecast_run_id" TEXT NOT NULL,
    "forecast_values" JSONB NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_forecast_scenarios_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_scenarios_forecast_run_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("forecast_run_id", "workspace_id", "organisation_id") REFERENCES "intelligence_forecast_runs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_scenarios_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_forecast_scenarios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_generation_jobs" (
    "completed_at" DATETIME,
    "conversation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "input_data" JSONB NOT NULL,
    "job_kind" TEXT NOT NULL,
    "job_status" TEXT NOT NULL DEFAULT 'queued',
    "organisation_id" TEXT NOT NULL,
    "requested_at" DATETIME NOT NULL,
    "requested_by_user_id" TEXT,
    "result_reference" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_generation_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_generation_jobs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_generation_jobs_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_generation_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_generation_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_intelligence_runs" (
    "completed_at" DATETIME,
    "conversation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "input_data" JSONB NOT NULL,
    "model_key" TEXT,
    "organisation_id" TEXT NOT NULL,
    "output_data" JSONB,
    "project_id" TEXT,
    "requested_by_user_id" TEXT,
    "run_kind" TEXT NOT NULL,
    "run_status" TEXT NOT NULL DEFAULT 'queued',
    "started_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_intelligence_runs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_runs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_runs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_runs_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_runs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_runs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_intelligence_signals" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "observed_at" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "score" DECIMAL,
    "signal_data" JSONB NOT NULL,
    "signal_kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subject_id" TEXT,
    "subject_type" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_intelligence_signals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_signals_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_signals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_intelligence_signals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_knowledge_chunks" (
    "chunk_index" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "document_id" TEXT NOT NULL,
    "embedding_reference" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata" JSONB,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "token_count" INTEGER,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_knowledge_chunks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_chunks_document_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("document_id", "workspace_id", "organisation_id") REFERENCES "intelligence_knowledge_documents" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_chunks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_chunks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_knowledge_documents" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "document_kind" TEXT NOT NULL,
    "document_status" TEXT NOT NULL DEFAULT 'queued',
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "indexed_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "source_uri" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_knowledge_documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_documents_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_documents_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_knowledge_documents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_kpi_definitions" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "aggregation" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "definition" JSONB NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "metric_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "intelligence_kpi_definitions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_kpi_measurements" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "dimensions" JSONB,
    "id" TEXT NOT NULL PRIMARY KEY,
    "kpi_definition_id" TEXT NOT NULL,
    "measured_at" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "source_reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DECIMAL NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_kpi_measurements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_kpi_measurements_kpi_definition_id_fkey" FOREIGN KEY ("kpi_definition_id") REFERENCES "intelligence_kpi_definitions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_kpi_measurements_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_kpi_measurements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_kpi_measurements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_model_registry" (
    "capabilities" JSONB NOT NULL,
    "configuration" JSONB,
    "context_limit" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL PRIMARY KEY,
    "model_key" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "intelligence_model_registry_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_model_runs" (
    "completed_at" DATETIME,
    "conversation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "generation_job_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "input_tokens" INTEGER,
    "latency_ms" INTEGER,
    "model_key" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "output_tokens" INTEGER,
    "provider_request_id" TEXT,
    "requested_by_user_id" TEXT,
    "run_status" TEXT NOT NULL DEFAULT 'requested',
    "started_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_model_runs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_model_runs_generation_job_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("generation_job_id", "workspace_id", "organisation_id") REFERENCES "intelligence_generation_jobs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_model_runs_conversation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_model_runs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_model_runs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_model_runs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_prompt_templates" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "system_prompt" TEXT NOT NULL,
    "template_key" TEXT NOT NULL,
    "template_status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_template" TEXT NOT NULL,
    "variables" JSONB,
    "version_number" INTEGER NOT NULL,
    CONSTRAINT "intelligence_prompt_templates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_research_sessions" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "query" TEXT NOT NULL,
    "requested_by_user_id" TEXT,
    "scope" JSONB,
    "session_status" TEXT NOT NULL DEFAULT 'open',
    "started_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_research_sessions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sessions_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sessions_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sessions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sessions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_research_sources" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "document_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "research_session_id" TEXT NOT NULL,
    "retrieved_at" DATETIME,
    "source_data" JSONB,
    "source_kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_research_sources_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sources_research_session_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("research_session_id", "workspace_id", "organisation_id") REFERENCES "intelligence_research_sessions" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sources_document_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("document_id", "workspace_id", "organisation_id") REFERENCES "intelligence_knowledge_documents" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sources_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_research_sources_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "intelligence_saved_insights" (
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "insight_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "project_id" TEXT,
    "saved_at" DATETIME NOT NULL,
    "source_references" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "intelligence_saved_insights_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_saved_insights_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_saved_insights_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_saved_insights_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "intelligence_saved_insights_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_deal_room_members" (
    "accepted_at" DATETIME,
    "access_status" TEXT NOT NULL DEFAULT 'invited',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "deal_room_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invited_at" DATETIME NOT NULL,
    "invited_by_user_id" TEXT,
    "last_viewed_at" DATETIME,
    "member_role" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_deal_room_members_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_room_members_deal_room_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("deal_room_id", "workspace_id", "organisation_id") REFERENCES "investor_deal_rooms" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_room_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_room_members_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_room_members_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_room_members_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_deal_rooms" (
    "access_policy" TEXT NOT NULL,
    "closed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "opened_at" DATETIME,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "room_status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_deal_rooms_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_rooms_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_rooms_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_deal_rooms_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_disclosures" (
    "ack_required" BOOLEAN NOT NULL DEFAULT false,
    "body" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "disclosure_kind" TEXT NOT NULL,
    "document_uri" TEXT,
    "effective_at" DATETIME NOT NULL,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_disclosures_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_disclosures_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_disclosures_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_disclosures_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_disclosures_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_distribution_channels" (
    "channel_kind" TEXT NOT NULL,
    "channel_status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "terms_uri" TEXT,
    "territories" JSONB,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_distribution_channels_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_distribution_channels_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_distribution_channels_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_distribution_deals" (
    "channel_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "deal_number" TEXT NOT NULL,
    "deal_status" TEXT NOT NULL DEFAULT 'draft',
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "minimum_guarantee" DECIMAL,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "rights_scope" JSONB NOT NULL,
    "starts_on" DATETIME,
    "territory" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_distribution_deals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_distribution_deals_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_distribution_deals_channel_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("channel_id", "workspace_id", "organisation_id") REFERENCES "investor_distribution_channels" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_distribution_deals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_distribution_deals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_due_diligence_items" (
    "assigned_to_user_id" TEXT,
    "category" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "due_on" DATETIME,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_status" TEXT NOT NULL DEFAULT 'open',
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_due_diligence_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_due_diligence_items_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_due_diligence_items_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_due_diligence_items_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_due_diligence_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_due_diligence_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_funding_requirements" (
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "due_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "requirement_status" TEXT NOT NULL DEFAULT 'proposed',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_funding_requirements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_funding_requirements_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_funding_requirements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_funding_requirements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investment_opportunities" (
    "closes_on" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "instrument" TEXT NOT NULL,
    "minimum_investment" DECIMAL,
    "opportunity_status" TEXT NOT NULL DEFAULT 'draft',
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "summary" TEXT,
    "target_amount" DECIMAL NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investment_opportunities_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_opportunities_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_opportunities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_opportunities_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investment_profiles" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "investor_kind" TEXT NOT NULL,
    "mandate" TEXT,
    "organisation_id" TEXT NOT NULL,
    "risk_profile" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "website" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investment_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investment_tranches" (
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "funding_requirement_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "released_on" DATETIME,
    "scheduled_on" DATETIME,
    "tranche_number" INTEGER NOT NULL,
    "tranche_status" TEXT NOT NULL DEFAULT 'planned',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investment_tranches_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_tranches_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_tranches_funding_requirement_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("funding_requirement_id", "workspace_id", "organisation_id") REFERENCES "investor_funding_requirements" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_tranches_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investment_tranches_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investor_accounts" (
    "account_kind" TEXT NOT NULL,
    "account_reference" TEXT NOT NULL,
    "account_status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "investor_profile_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "provider" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" DATETIME,
    "verified_by_user_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investor_accounts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_accounts_investor_profile_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_accounts_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_accounts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_accounts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investor_commitments" (
    "amount" DECIMAL NOT NULL,
    "commitment_number" TEXT NOT NULL,
    "commitment_status" TEXT NOT NULL DEFAULT 'indication',
    "committed_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "deal_room_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "investor_profile_id" TEXT NOT NULL,
    "notes" TEXT,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investor_commitments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_commitments_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_commitments_investor_profile_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_commitments_deal_room_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("deal_room_id", "workspace_id", "organisation_id") REFERENCES "investor_deal_rooms" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_commitments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_commitments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investor_evidence_links" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "investor_profile_id" TEXT,
    "link_kind" TEXT NOT NULL,
    "linked_at" DATETIME NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investor_evidence_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_evidence_links_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_evidence_links_investor_profile_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_evidence_links_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_evidence_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_evidence_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investor_progress_reports" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "investor_profile_id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "progress_percent" DECIMAL,
    "report_period" TEXT NOT NULL,
    "reported_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investor_progress_reports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_progress_reports_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_progress_reports_investor_profile_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_progress_reports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_progress_reports_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_investor_returns" (
    "commitment_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "period_end" DATETIME NOT NULL,
    "period_start" DATETIME NOT NULL,
    "principal_returned" DECIMAL NOT NULL,
    "profit_share" DECIMAL NOT NULL,
    "recoupment_model_id" TEXT,
    "return_status" TEXT NOT NULL DEFAULT 'estimated',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_investor_returns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_returns_commitment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("commitment_id", "workspace_id", "organisation_id") REFERENCES "investor_investor_commitments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_returns_recoupment_model_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("recoupment_model_id", "workspace_id", "organisation_id") REFERENCES "investor_recoupment_models" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_returns_payment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_returns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_investor_returns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_pitch_decks" (
    "content_uri" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "published_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" TEXT,
    "version_number" INTEGER NOT NULL,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_pitch_decks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_pitch_decks_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_pitch_decks_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_pitch_decks_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_pitch_decks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_pitch_decks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_recoupment_models" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "effective_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "model_status" TEXT NOT NULL DEFAULT 'draft',
    "name" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "priority_order" INTEGER NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waterfall" JSONB NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_recoupment_models_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_recoupment_models_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_recoupment_models_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_recoupment_models_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_recoupment_tiers" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "participant_kind" TEXT NOT NULL,
    "recoupment_model_id" TEXT NOT NULL,
    "share_percent" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "threshold_amount" DECIMAL NOT NULL,
    "tier_number" INTEGER NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_recoupment_tiers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_recoupment_tiers_recoupment_model_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("recoupment_model_id", "workspace_id", "organisation_id") REFERENCES "investor_recoupment_models" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_recoupment_tiers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_recoupment_tiers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_revenue_entries" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "distribution_deal_id" TEXT,
    "gross_amount" DECIMAL NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "net_amount" DECIMAL NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "period_end" DATETIME NOT NULL,
    "period_start" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "recognized_at" DATETIME NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_revenue_entries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_revenue_entries_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_revenue_entries_distribution_deal_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("distribution_deal_id", "workspace_id", "organisation_id") REFERENCES "investor_distribution_deals" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_revenue_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_revenue_entries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_rights" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_on" DATETIME,
    "exclusivity" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunity_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "right_kind" TEXT NOT NULL,
    "rights_status" TEXT NOT NULL DEFAULT 'proposed',
    "starts_on" DATETIME,
    "terms" TEXT,
    "territory" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_rights_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_opportunity_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "investor_rights_windows" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "distribution_deal_id" TEXT,
    "ends_on" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "platform" TEXT,
    "right_id" TEXT NOT NULL,
    "starts_on" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "territory" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "window_kind" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "investor_rights_windows_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_windows_right_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("right_id", "workspace_id", "organisation_id") REFERENCES "investor_rights" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_windows_distribution_deal_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("distribution_deal_id", "workspace_id", "organisation_id") REFERENCES "investor_distribution_deals" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_windows_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "investor_rights_windows_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_accommodations" (
    "address" TEXT,
    "check_in" DATETIME,
    "check_out" DATETIME,
    "contact_phone" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "property_kind" TEXT,
    "room_count" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_accommodations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_accommodations_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_accommodations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_accommodations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_drivers" (
    "availability_note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "license_expires_on" DATETIME,
    "license_number" TEXT,
    "organisation_id" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_drivers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_drivers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_drivers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_bookings" (
    "booked_by_user_id" TEXT,
    "booking_status" TEXT NOT NULL DEFAULT 'held',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "equipment_item_id" TEXT,
    "equipment_kit_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_bookings_equipment_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_bookings_equipment_kit_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_kit_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_kits" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_bookings_booked_by_user_id_fkey" FOREIGN KEY ("booked_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_categories" (
    "code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "requires_serial" BOOLEAN NOT NULL DEFAULT false,
    "returnable" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_categories_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_categories_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_checkouts" (
    "checked_out_at" DATETIME NOT NULL,
    "checked_out_quantity" INTEGER NOT NULL,
    "checked_out_to_user_id" TEXT,
    "condition_out" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "due_at" DATETIME,
    "equipment_booking_id" TEXT,
    "equipment_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued_by_user_id" TEXT,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_checkouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_checkouts_equipment_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_checkouts_equipment_booking_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_booking_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_bookings" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_checkouts_checked_out_to_user_id_fkey" FOREIGN KEY ("checked_out_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_checkouts_issued_by_user_id_fkey" FOREIGN KEY ("issued_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_checkouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_checkouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_inventory_events" (
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "equipment_item_id" TEXT NOT NULL,
    "equipment_kit_id" TEXT,
    "event_kind" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "occurred_at" DATETIME NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "quantity_delta" INTEGER NOT NULL,
    "reference" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_inventory_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_inventory_events_equipment_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_inventory_events_equipment_kit_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_kit_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_kits" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_inventory_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_inventory_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_inventory_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_items" (
    "acquired_on" DATETIME,
    "asset_tag" TEXT,
    "category_id" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturer" TEXT,
    "metadata" JSONB,
    "model" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "replacement_value" DECIMAL,
    "serial_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_items_category_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("category_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_categories" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_kits" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "kit_code" TEXT,
    "kit_status" TEXT NOT NULL DEFAULT 'active',
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_kits_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_kits_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_kits_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_maintenance" (
    "completed_at" DATETIME,
    "cost" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "equipment_item_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "maintenance_kind" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "scheduled_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_name" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_maintenance_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_maintenance_equipment_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_maintenance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_maintenance_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_equipment_returns" (
    "checkout_id" TEXT NOT NULL,
    "condition_in" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "damage_note" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "received_by_user_id" TEXT,
    "returned_at" DATETIME NOT NULL,
    "returned_quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_equipment_returns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_returns_checkout_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("checkout_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_checkouts" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_returns_received_by_user_id_fkey" FOREIGN KEY ("received_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_returns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_equipment_returns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_location_bookings" (
    "booked_by_user_id" TEXT,
    "booking_status" TEXT NOT NULL DEFAULT 'held',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "permit_id" TEXT,
    "project_id" TEXT NOT NULL,
    "purpose" TEXT,
    "quoted_cost" DECIMAL,
    "starts_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_location_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_bookings_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_bookings_permit_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("permit_id", "workspace_id", "organisation_id") REFERENCES "logistics_permits" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_bookings_booked_by_user_id_fkey" FOREIGN KEY ("booked_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_location_comparisons" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "criteria" JSONB NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'open',
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "recce_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_location_comparisons_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_comparisons_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_comparisons_recce_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("recce_id", "workspace_id", "organisation_id") REFERENCES "logistics_recces" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_comparisons_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_comparisons_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_location_media" (
    "caption" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT NOT NULL,
    "media_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_location_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_media_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_location_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_locations" (
    "access_notes" TEXT,
    "capacity" INTEGER,
    "city" TEXT,
    "country_code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL,
    "location_kind" TEXT NOT NULL,
    "longitude" DECIMAL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "postal_code" TEXT,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_locations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_locations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_locations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_logistics_tasks" (
    "assigned_to_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "details" TEXT,
    "due_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "task_kind" TEXT NOT NULL,
    "task_status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_logistics_tasks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_logistics_tasks_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_logistics_tasks_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_logistics_tasks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_logistics_tasks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_permit_documents" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "document_kind" TEXT NOT NULL,
    "evidence_item_id" TEXT,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "permit_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_permit_documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permit_documents_permit_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("permit_id", "workspace_id", "organisation_id") REFERENCES "logistics_permits" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permit_documents_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permit_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permit_documents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_permits" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issuing_authority" TEXT,
    "location_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "permit_kind" TEXT NOT NULL,
    "permit_number" TEXT,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "status_note" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_from" DATETIME,
    "valid_until" DATETIME,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_permits_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permits_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permits_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permits_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_permits_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_recce_media" (
    "caption" TEXT,
    "captured_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_kind" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "recce_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_recce_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recce_media_recce_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("recce_id", "workspace_id", "organisation_id") REFERENCES "logistics_recces" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recce_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recce_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recce_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_recces" (
    "access_notes" TEXT,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decision" TEXT NOT NULL DEFAULT 'planned',
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_user_id" TEXT,
    "location_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "scheduled_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weather" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_recces_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recces_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recces_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recces_lead_user_id_fkey" FOREIGN KEY ("lead_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recces_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_recces_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_room_allocations" (
    "accommodation_id" TEXT NOT NULL,
    "allocation_status" TEXT NOT NULL DEFAULT 'held',
    "check_in" DATETIME NOT NULL,
    "check_out" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "occupant_name" TEXT,
    "organisation_id" TEXT NOT NULL,
    "person_user_id" TEXT,
    "project_id" TEXT NOT NULL,
    "room_label" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_room_allocations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_room_allocations_accommodation_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("accommodation_id", "workspace_id", "organisation_id") REFERENCES "logistics_accommodations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_room_allocations_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_room_allocations_person_user_id_fkey" FOREIGN KEY ("person_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_room_allocations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_room_allocations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_shipments" (
    "carrier" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "expected_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "logistics_task_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "ship_from" TEXT,
    "ship_to" TEXT,
    "shipment_status" TEXT NOT NULL DEFAULT 'preparing',
    "shipped_at" DATETIME,
    "tracking_number" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_shipments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_shipments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_shipments_logistics_task_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("logistics_task_id", "workspace_id", "organisation_id") REFERENCES "logistics_logistics_tasks" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_shipments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_shipments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_transport_plans" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "pickup_note" TEXT,
    "project_id" TEXT NOT NULL,
    "service_kind" TEXT NOT NULL,
    "starts_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "status_note" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_transport_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_transport_plans_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_transport_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_transport_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_travel_legs" (
    "arrive_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "depart_at" DATETIME,
    "destination" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT,
    "mode" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "reference" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "travel_plan_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_travel_legs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_legs_travel_plan_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("travel_plan_id", "workspace_id", "organisation_id") REFERENCES "logistics_travel_plans" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_legs_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_legs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_legs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_travel_plans" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "depart_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "return_at" DATETIME,
    "title" TEXT NOT NULL,
    "travel_status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_travel_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_plans_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_travel_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_vehicle_assignments" (
    "assignment_status" TEXT NOT NULL DEFAULT 'planned',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "driver_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "route_note" TEXT,
    "starts_at" DATETIME NOT NULL,
    "transport_plan_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_vehicle_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicle_assignments_transport_plan_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("transport_plan_id", "workspace_id", "organisation_id") REFERENCES "logistics_transport_plans" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicle_assignments_vehicle_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vehicle_id", "workspace_id", "organisation_id") REFERENCES "logistics_vehicles" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicle_assignments_driver_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("driver_id", "workspace_id", "organisation_id") REFERENCES "logistics_drivers" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicle_assignments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicle_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicle_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "logistics_vehicles" (
    "accessibility_notes" TEXT,
    "capacity" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT,
    "model" TEXT,
    "organisation_id" TEXT NOT NULL,
    "registration_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "status_note" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_kind" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "logistics_vehicles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "logistics_vehicles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_capability_packs" (
    "capabilities" JSONB NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "pack_status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_capability_packs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_capability_packs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_capability_packs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_deliveries" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "delivered_at" DATETIME,
    "delivery_number" TEXT NOT NULL,
    "delivery_status" TEXT NOT NULL DEFAULT 'planned',
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "proof_uri" TEXT,
    "purchase_order_id" TEXT NOT NULL,
    "scheduled_at" DATETIME,
    "shipment_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_deliveries_purchase_order_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_deliveries_shipment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("shipment_id", "workspace_id", "organisation_id") REFERENCES "logistics_shipments" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_deliveries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_deliveries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_marketplace_categories" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "parent_category_id" TEXT,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_marketplace_categories_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_marketplace_categories_parent_category_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("parent_category_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_categories" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_marketplace_categories_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_marketplace_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_marketplace_services" (
    "category_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "delivery_mode" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "service_kind" TEXT NOT NULL,
    "service_status" TEXT NOT NULL DEFAULT 'draft',
    "slug" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_marketplace_services_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_marketplace_services_category_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("category_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_categories" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_marketplace_services_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_marketplace_services_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_procurement_awards" (
    "award_number" TEXT NOT NULL,
    "awarded_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decided_by_user_id" TEXT,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "quote_id" TEXT,
    "rationale" TEXT,
    "rfq_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_procurement_awards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_procurement_awards_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_procurement_awards_quote_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("quote_id", "workspace_id", "organisation_id") REFERENCES "marketplace_quotes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_procurement_awards_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_procurement_awards_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_procurement_awards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_procurement_awards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_purchase_order_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "delivered_quantity" DECIMAL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "line_total" DECIMAL NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "rfq_item_id" TEXT,
    "sku_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "unit_price" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_purchase_order_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_order_items_purchase_order_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_order_items_sku_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("sku_id", "workspace_id", "organisation_id") REFERENCES "marketplace_service_skus" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_order_items_rfq_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfq_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_order_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_order_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_purchase_orders" (
    "award_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "expected_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued_at" DATETIME,
    "issued_by_user_id" TEXT,
    "order_status" TEXT NOT NULL DEFAULT 'draft',
    "organisation_id" TEXT NOT NULL,
    "po_number" TEXT NOT NULL,
    "project_id" TEXT,
    "subtotal" DECIMAL NOT NULL,
    "tax_total" DECIMAL,
    "total" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_purchase_orders_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_orders_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_orders_award_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("award_id", "workspace_id", "organisation_id") REFERENCES "marketplace_procurement_awards" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_orders_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_orders_issued_by_user_id_fkey" FOREIGN KEY ("issued_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_orders_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_purchase_orders_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_quote_comparisons" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "criteria" JSONB NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "rfq_id" TEXT NOT NULL,
    "selected_quote_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_quote_comparisons_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_comparisons_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_comparisons_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_comparisons_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_quote_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "delivery_days" INTEGER,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "line_total" DECIMAL NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "quote_id" TEXT NOT NULL,
    "rfq_item_id" TEXT,
    "sku_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "unit_price" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_quote_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_items_quote_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("quote_id", "workspace_id", "organisation_id") REFERENCES "marketplace_quotes" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_items_rfq_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfq_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_items_sku_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("sku_id", "workspace_id", "organisation_id") REFERENCES "marketplace_service_skus" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quote_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_quotes" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "quote_number" TEXT NOT NULL,
    "quote_status" TEXT NOT NULL DEFAULT 'draft',
    "rfq_id" TEXT NOT NULL,
    "submitted_by_user_id" TEXT,
    "subtotal" DECIMAL NOT NULL,
    "tax_total" DECIMAL,
    "total" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" DATETIME,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_quotes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quotes_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quotes_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quotes_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quotes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_quotes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_rfq_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "required_by" DATETIME,
    "rfq_id" TEXT NOT NULL,
    "service_id" TEXT,
    "sku_id" TEXT,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "unit" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_rfq_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_items_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_items_service_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_items_sku_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("sku_id", "workspace_id", "organisation_id") REFERENCES "marketplace_service_skus" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_rfq_recipients" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invited_at" DATETIME NOT NULL,
    "invited_by_user_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "responded_at" DATETIME,
    "response_status" TEXT NOT NULL DEFAULT 'invited',
    "rfq_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_rfq_recipients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_recipients_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_recipients_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_recipients_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_recipients_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfq_recipients_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_rfqs" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "requester_user_id" TEXT,
    "requirements" TEXT,
    "response_deadline" DATETIME,
    "rfq_number" TEXT NOT NULL,
    "rfq_status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_rfqs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfqs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfqs_requester_user_id_fkey" FOREIGN KEY ("requester_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfqs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_rfqs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_service_deliveries" (
    "acceptance_status" TEXT NOT NULL DEFAULT 'pending',
    "accepted_by_user_id" TEXT,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "purchase_order_item_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "started_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_service_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_deliveries_purchase_order_item_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("purchase_order_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_order_items" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_deliveries_service_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_deliveries_accepted_by_user_id_fkey" FOREIGN KEY ("accepted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_deliveries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_deliveries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_service_skus" (
    "base_price" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "sku_code" TEXT NOT NULL,
    "sku_status" TEXT NOT NULL DEFAULT 'active',
    "unit" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_service_skus_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_skus_service_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_skus_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_service_skus_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendor_availability" (
    "availability_status" TEXT NOT NULL DEFAULT 'available',
    "capacity" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_vendor_availability_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_availability_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_availability_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_availability_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendor_capabilities" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_uri" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "verified_at" DATETIME,
    "workspace_id" TEXT NOT NULL,
    "years_experience" INTEGER,
    CONSTRAINT "marketplace_vendor_capabilities_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_capabilities_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_capabilities_service_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_capabilities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_capabilities_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendor_performance" (
    "calculated_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "delivery_on_time_rate" DECIMAL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "period_end" DATETIME NOT NULL,
    "period_start" DATETIME NOT NULL,
    "quality_score" DECIMAL,
    "score" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_vendor_performance_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_performance_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_performance_calculated_by_user_id_fkey" FOREIGN KEY ("calculated_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_performance_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_performance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendor_portfolios" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_uri" TEXT,
    "organisation_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_vendor_portfolios_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_portfolios_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_portfolios_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_portfolios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_portfolios_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendor_profiles" (
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "headline" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "profile_status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "website" TEXT,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_vendor_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_profiles_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendor_ratings" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT,
    "rated_at" DATETIME NOT NULL,
    "rated_by_user_id" TEXT,
    "rating_status" TEXT NOT NULL DEFAULT 'pending',
    "review_text" TEXT,
    "score" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_vendor_ratings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_ratings_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_ratings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_ratings_rated_by_user_id_fkey" FOREIGN KEY ("rated_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_ratings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendor_ratings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "marketplace_vendors" (
    "country_code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "legal_name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "risk_level" TEXT,
    "tax_identifier" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_code" TEXT,
    "vendor_status" TEXT NOT NULL DEFAULT 'pending',
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "marketplace_vendors_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendors_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendors_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "marketplace_vendors_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "organisation_organisation_memberships" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invited_by_user_id" TEXT,
    "joined_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "organisation_organisation_memberships_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "organisation_organisation_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "organisation_organisation_memberships_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "organisation_organisation_settings" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "settings" JSONB NOT NULL DEFAULT {},
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organisation_organisation_settings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organisation_organisations" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "deleted_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organisation_organisations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "organisation_workspace_activity" (
    "actor_membership_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_id" TEXT,
    "entity_type" TEXT,
    "event_type" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT {},
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "organisation_workspace_activity_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_activity_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_activity_actor_membership_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("actor_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organisation_workspace_favourites" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "membership_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "organisation_workspace_favourites_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_favourites_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_favourites_membership_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships" ("id", "workspace_id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organisation_workspace_invites" (
    "accepted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invited_by_membership_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "revoked_at" DATETIME,
    "role_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "token_hash" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "organisation_workspace_invites_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_invites_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_invites_role_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("role_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_roles" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_invites_invited_by_membership_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("invited_by_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships" ("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organisation_workspace_memberships" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "invited_by_user_id" TEXT,
    "joined_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "organisation_workspace_memberships_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "organisation_workspace_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "organisation_workspace_memberships_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "organisation_workspace_roles" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT [],
    "retired_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "organisation_workspace_roles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_roles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organisation_workspace_settings" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "settings" JSONB NOT NULL DEFAULT {},
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "organisation_workspace_settings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organisation_workspace_settings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organisation_workspaces" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "deleted_at" DATETIME,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organisation_workspaces_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "organisation_workspaces_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_attendance_records" (
    "attendance_date" DATETIME NOT NULL,
    "cast_assignment_id" TEXT,
    "check_in_at" DATETIME,
    "check_out_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_assignment_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'expected',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "people_attendance_records_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_attendance_records_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_attendance_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_attendance_records_cast_assignment_id_organisation_id_fkey" FOREIGN KEY ("cast_assignment_id", "organisation_id") REFERENCES "people_cast_assignments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_attendance_records_crew_assignment_id_organisation_id_fkey" FOREIGN KEY ("crew_assignment_id", "organisation_id") REFERENCES "people_crew_assignments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_attendance_records_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_attendance_records_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_audition_media" (
    "audition_submission_id" TEXT NOT NULL,
    "byte_length" INTEGER,
    "captured_at" DATETIME,
    "checksum_sha256" TEXT,
    "content_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "storage_key" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_audition_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_media_audition_submission_id_organisation_id_fkey" FOREIGN KEY ("audition_submission_id", "organisation_id") REFERENCES "people_audition_submissions" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_audition_submissions" (
    "casting_call_id" TEXT NOT NULL,
    "casting_call_role_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "external_reference" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_at" DATETIME,
    "submitted_by_user_id" TEXT,
    "talent_profile_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_audition_submissions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_submissions_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_submissions_casting_call_role_id_organisation_id_fkey" FOREIGN KEY ("casting_call_role_id", "organisation_id") REFERENCES "people_casting_call_roles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_submissions_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_submissions_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_submissions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_audition_submissions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_cast_assignments" (
    "assignment_note" TEXT,
    "casting_call_role_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "talent_contract_id" TEXT,
    "talent_profile_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_cast_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_assignments_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_assignments_casting_call_role_id_organisation_id_fkey" FOREIGN KEY ("casting_call_role_id", "organisation_id") REFERENCES "people_casting_call_roles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_assignments_talent_contract_id_organisation_id_fkey" FOREIGN KEY ("talent_contract_id", "organisation_id") REFERENCES "people_talent_contracts" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_cast_messages" (
    "body" TEXT NOT NULL,
    "communication_thread_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sender_user_id" TEXT NOT NULL,
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "talent_profile_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_cast_messages_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_messages_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_messages_organisation_id_communication_thread_id_fkey" FOREIGN KEY ("organisation_id", "communication_thread_id") REFERENCES "communications_communication_threads" ("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_messages_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_messages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_cast_schedule_entries" (
    "cast_assignment_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "ends_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_label" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "schedule_item_id" TEXT,
    "starts_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_cast_schedule_entries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_schedule_entries_cast_assignment_id_organisation_id_fkey" FOREIGN KEY ("cast_assignment_id", "organisation_id") REFERENCES "people_cast_assignments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_schedule_entries_schedule_item_id_organisation_id_fkey" FOREIGN KEY ("schedule_item_id", "organisation_id") REFERENCES "production_schedule_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_schedule_entries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_cast_schedule_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_casting_approvals" (
    "approval_id" TEXT,
    "approver_user_id" TEXT NOT NULL,
    "audition_submission_id" TEXT,
    "casting_call_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decided_at" DATETIME,
    "decision_note" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_casting_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_approvals_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_approvals_audition_submission_id_organisation_id_fkey" FOREIGN KEY ("audition_submission_id", "organisation_id") REFERENCES "people_audition_submissions" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_approvals_approver_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_approvals_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_casting_call_roles" (
    "age_max" INTEGER,
    "age_min" INTEGER,
    "casting_call_id" TEXT NOT NULL,
    "character_description" TEXT,
    "compensation_max" DECIMAL,
    "compensation_min" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT,
    "description" TEXT,
    "headcount" INTEGER NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_casting_call_roles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_call_roles_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_call_roles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_call_roles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_casting_calls" (
    "brief" TEXT,
    "closes_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "opens_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_casting_calls_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_calls_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_calls_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_casting_calls_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_assignments" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_profile_id" TEXT NOT NULL,
    "currency_code" TEXT,
    "department_id" TEXT,
    "description" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "rate_amount" DECIMAL,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_assignments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_assignments_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_assignments_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_availability" (
    "available_from" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_until" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_profile_id" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_availability_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_availability_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_availability_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_availability_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_contracts" (
    "contract_reference" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_assignment_id" TEXT NOT NULL,
    "crew_profile_id" TEXT NOT NULL,
    "description" TEXT,
    "ends_on" DATETIME,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "signed_at" DATETIME,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "terms" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_contracts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_contracts_crew_assignment_id_organisation_id_fkey" FOREIGN KEY ("crew_assignment_id", "organisation_id") REFERENCES "people_crew_assignments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_contracts_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_contracts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_contracts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_contracts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_hiring_requests" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "department_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "needed_by" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "positions_requested" INTEGER NOT NULL,
    "project_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_hiring_requests_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_hiring_requests_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_hiring_requests_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_hiring_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_hiring_requests_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_hiring_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_messages" (
    "body" TEXT NOT NULL,
    "communication_thread_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_profile_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "sender_user_id" TEXT NOT NULL,
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_messages_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_messages_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_messages_organisation_id_communication_thread_id_fkey" FOREIGN KEY ("organisation_id", "communication_thread_id") REFERENCES "communications_communication_threads" ("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_messages_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_messages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_profiles" (
    "biography" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "union_name" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_shortlist_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_profile_id" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "shortlist_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_shortlist_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlist_items_shortlist_id_organisation_id_fkey" FOREIGN KEY ("shortlist_id", "organisation_id") REFERENCES "people_crew_shortlists" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlist_items_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlist_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlist_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_shortlists" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_hiring_request_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "purpose" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_shortlists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlists_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlists_crew_hiring_request_id_organisation_id_fkey" FOREIGN KEY ("crew_hiring_request_id", "organisation_id") REFERENCES "people_crew_hiring_requests" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_shortlists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_crew_skills" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_profile_id" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "proficiency_level" TEXT,
    "skill_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" DATETIME,
    "workspace_id" TEXT,
    CONSTRAINT "people_crew_skills_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_skills_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_skills_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_crew_skills_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_department_members" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "department_id" TEXT NOT NULL,
    "description" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "people_department_members_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_department_members_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_department_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_department_members_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_department_members_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_departments" (
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_departments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_departments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_departments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_departments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_hod_assignments" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_profile_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "description" TEXT,
    "ends_on" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "starts_on" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_hod_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_hod_assignments_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_hod_assignments_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_hod_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_hod_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_performance_reviews" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "rating" DECIMAL,
    "review_date" DATETIME NOT NULL,
    "reviewee_user_id" TEXT NOT NULL,
    "reviewer_user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_performance_reviews_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_performance_reviews_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_performance_reviews_reviewee_user_id_fkey" FOREIGN KEY ("reviewee_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_performance_reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_performance_reviews_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_performance_reviews_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_availability" (
    "available_from" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_until" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "talent_profile_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_availability_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_availability_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_availability_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_availability_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_comparisons" (
    "comparison_kind" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "left_score" DECIMAL,
    "left_talent_profile_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "rationale" TEXT,
    "right_score" DECIMAL,
    "right_talent_profile_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_comparisons_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_comparisons_left_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("left_talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_comparisons_right_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("right_talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_comparisons_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_comparisons_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_contracts" (
    "compensation_amount" DECIMAL,
    "contract_reference" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT,
    "description" TEXT,
    "ends_on" DATETIME,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "offer_id" TEXT,
    "organisation_id" TEXT NOT NULL,
    "signed_at" DATETIME,
    "starts_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "talent_profile_id" TEXT NOT NULL,
    "terms" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_contracts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_contracts_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_contracts_offer_id_organisation_id_fkey" FOREIGN KEY ("offer_id", "organisation_id") REFERENCES "people_talent_offers" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_contracts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_contracts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_contracts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_media" (
    "byte_length" INTEGER,
    "caption" TEXT,
    "checksum_sha256" TEXT,
    "content_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "media_kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "storage_key" TEXT NOT NULL,
    "talent_profile_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_media_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_offers" (
    "casting_call_role_id" TEXT NOT NULL,
    "compensation_amount" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT,
    "description" TEXT,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "offer_reference" TEXT NOT NULL,
    "offered_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "talent_profile_id" TEXT NOT NULL,
    "terms" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_offers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_offers_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_offers_casting_call_role_id_organisation_id_fkey" FOREIGN KEY ("casting_call_role_id", "organisation_id") REFERENCES "people_casting_call_roles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_offers_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_offers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_offers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_portfolios" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "talent_profile_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_portfolios_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_portfolios_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_portfolios_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_portfolios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_profiles" (
    "biography" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "date_of_birth" DATETIME,
    "description" TEXT,
    "display_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "pronouns" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_shortlist_items" (
    "audition_submission_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "organisation_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "shortlist_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "talent_profile_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_shortlist_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlist_items_shortlist_id_organisation_id_fkey" FOREIGN KEY ("shortlist_id", "organisation_id") REFERENCES "people_talent_shortlists" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlist_items_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlist_items_audition_submission_id_organisation_id_fkey" FOREIGN KEY ("audition_submission_id", "organisation_id") REFERENCES "people_audition_submissions" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlist_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlist_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_talent_shortlists" (
    "casting_call_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "purpose" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "people_talent_shortlists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlists_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlists_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_talent_shortlists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "people_timesheets" (
    "cast_assignment_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "crew_assignment_id" TEXT,
    "description" TEXT,
    "hours_worked" DECIMAL NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "period_end" DATETIME NOT NULL,
    "period_start" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_at" DATETIME,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "people_timesheets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_timesheets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_timesheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_timesheets_crew_assignment_id_organisation_id_fkey" FOREIGN KEY ("crew_assignment_id", "organisation_id") REFERENCES "people_crew_assignments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_timesheets_cast_assignment_id_organisation_id_fkey" FOREIGN KEY ("cast_assignment_id", "organisation_id") REFERENCES "people_cast_assignments" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_timesheets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "people_timesheets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_api_keys" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "key_hash" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "revoked_at" DATETIME,
    "scopes" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_api_keys_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_api_keys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_api_keys_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_backup_jobs" (
    "checksum" TEXT,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "started_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "target_reference" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "platform_data_retention_policies" (
    "approved_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "legal_basis" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "policy_key" TEXT NOT NULL,
    "retention_days" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "subject_kind" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_data_retention_policies_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_data_retention_policies_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_data_retention_policies_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_data_retention_policies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_export_jobs" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "error_code" TEXT,
    "export_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "started_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_export_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_export_jobs_export_id_organisation_id_fkey" FOREIGN KEY ("export_id", "organisation_id") REFERENCES "platform_exports" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_export_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_export_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_exports" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "expires_at" DATETIME,
    "export_kind" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "object_key" TEXT,
    "organisation_id" TEXT NOT NULL,
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_exports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_exports_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_exports_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_exports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_feature_flag_assignments" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL,
    "ends_at" DATETIME,
    "feature_flag_id" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "subject_id" TEXT NOT NULL,
    "subject_kind" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_feature_flag_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_feature_flag_assignments_feature_flag_id_fkey" FOREIGN KEY ("feature_flag_id") REFERENCES "platform_feature_flags" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_feature_flag_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_feature_flag_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_feature_flags" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rollout_percent" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "platform_integration_connections" (
    "connected_at" DATETIME,
    "connected_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "disconnected_at" DATETIME,
    "external_account_ref" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "integration_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_integration_connections_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_connections_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "platform_integrations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_connections_connected_by_user_id_fkey" FOREIGN KEY ("connected_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_connections_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_connections_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_integration_events" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "event_type" TEXT NOT NULL,
    "external_event_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "integration_connection_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed_at" DATETIME,
    "received_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_integration_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_events_integration_connection_id_organisation_id_fkey" FOREIGN KEY ("integration_connection_id", "organisation_id") REFERENCES "platform_integration_connections" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_integration_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_integrations" (
    "capabilities" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "platform_restore_jobs" (
    "backup_job_id" TEXT,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT NOT NULL,
    "source_reference" TEXT NOT NULL,
    "started_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_restore_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_restore_jobs_backup_job_id_fkey" FOREIGN KEY ("backup_job_id") REFERENCES "platform_backup_jobs" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_restore_jobs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_restore_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_restore_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_runtime_observations" (
    "component" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "observation_kind" TEXT NOT NULL,
    "observed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" JSONB
);

-- CreateTable
CREATE TABLE "platform_share_links" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "revoked_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "token_hash" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_share_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_share_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_share_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_status_events" (
    "actor_user_id" TEXT,
    "component" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "details" JSONB,
    "from_status" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "to_status" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_status_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_status_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_status_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_status_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_support_comments" (
    "author_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "support_ticket_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_support_comments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_comments_support_ticket_id_organisation_id_fkey" FOREIGN KEY ("support_ticket_id", "organisation_id") REFERENCES "platform_support_tickets" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_comments_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_comments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_comments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_support_tickets" (
    "assigned_to_user_id" TEXT,
    "closed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "opened_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened_by_user_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subject" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_support_tickets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_tickets_opened_by_user_id_fkey" FOREIGN KEY ("opened_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_tickets_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_tickets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_support_tickets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_sync_conflicts" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "entity_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "local_value" JSONB,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "remote_value" JSONB,
    "resolved_at" DATETIME,
    "resolved_by_user_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sync_job_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_sync_conflicts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_conflicts_sync_job_id_organisation_id_fkey" FOREIGN KEY ("sync_job_id", "organisation_id") REFERENCES "platform_sync_jobs" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_conflicts_resolved_by_user_id_fkey" FOREIGN KEY ("resolved_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_conflicts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_conflicts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_sync_jobs" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "cursor" TEXT,
    "description" TEXT,
    "direction" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "integration_connection_id" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "started_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_sync_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_jobs_integration_connection_id_organisation_id_fkey" FOREIGN KEY ("integration_connection_id", "organisation_id") REFERENCES "platform_integration_connections" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_sync_queue_items" (
    "attempts" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "enqueued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sync_job_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_sync_queue_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_queue_items_sync_job_id_organisation_id_fkey" FOREIGN KEY ("sync_job_id", "organisation_id") REFERENCES "platform_sync_jobs" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_queue_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_sync_queue_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_system_incidents" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "detected_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "resolved_at" DATETIME,
    "severity" TEXT NOT NULL DEFAULT 'normal',
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_system_incidents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_system_incidents_detected_by_user_id_fkey" FOREIGN KEY ("detected_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_system_incidents_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_system_incidents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_system_incidents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_user_preferences" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "preference_key" TEXT NOT NULL,
    "preference_value" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "platform_user_preferences_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_user_preferences_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_user_preferences_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_webhook_deliveries" (
    "attempt_number" INTEGER NOT NULL,
    "attempted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "next_attempt_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "response_code" INTEGER,
    "response_excerpt" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subscription_id" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "webhook_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "platform_webhook_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_deliveries_webhook_id_organisation_id_fkey" FOREIGN KEY ("webhook_id", "organisation_id") REFERENCES "platform_webhooks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_deliveries_subscription_id_organisation_id_fkey" FOREIGN KEY ("subscription_id", "organisation_id") REFERENCES "platform_webhook_subscriptions" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_deliveries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_deliveries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_webhook_subscriptions" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "event_pattern" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "webhook_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "platform_webhook_subscriptions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_subscriptions_webhook_id_organisation_id_fkey" FOREIGN KEY ("webhook_id", "organisation_id") REFERENCES "platform_webhooks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_subscriptions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhook_subscriptions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_webhooks" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "secret_reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "target_url" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_webhooks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhooks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_webhooks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "platform_workspace_preferences" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "preference_key" TEXT NOT NULL,
    "preference_value" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "platform_workspace_preferences_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_workspace_preferences_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "platform_workspace_preferences_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_call_sheet_acknowledgements" (
    "acknowledged_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "call_sheet_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "note" TEXT,
    "organisation_id" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_call_sheet_acknowledgements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_acknowledgements_call_sheet_id_organisation_id_fkey" FOREIGN KEY ("call_sheet_id", "organisation_id") REFERENCES "production_call_sheets" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_acknowledgements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_acknowledgements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_acknowledgements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_call_sheet_recipients" (
    "acknowledged_at" DATETIME,
    "call_sheet_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "delivery_status" TEXT NOT NULL DEFAULT 'draft',
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "sent_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_call_sheet_recipients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_recipients_call_sheet_id_organisation_id_fkey" FOREIGN KEY ("call_sheet_id", "organisation_id") REFERENCES "production_call_sheets" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_recipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_recipients_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_recipients_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_call_sheet_versions" (
    "call_sheet_id" TEXT NOT NULL,
    "content_hash" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "published_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_call_sheet_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_versions_call_sheet_id_organisation_id_fkey" FOREIGN KEY ("call_sheet_id", "organisation_id") REFERENCES "production_call_sheets" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheet_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_call_sheets" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "general_notes" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "published_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_call_sheets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheets_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_call_sheets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_daily_production_reports" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "pages_completed" DECIMAL,
    "production_day_id" TEXT,
    "project_id" TEXT NOT NULL,
    "report_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_at" DATETIME,
    "submitted_by_user_id" TEXT,
    "summary" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_daily_production_reports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_daily_production_reports_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_daily_production_reports_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_daily_production_reports_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_daily_production_reports_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_daily_production_reports_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_daily_production_reports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_delays" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ended_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "impact_minutes" INTEGER,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "reported_by_user_id" TEXT,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_delays_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_delays_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_delays_reported_by_user_id_fkey" FOREIGN KEY ("reported_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_delays_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_delays_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_incidents" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "incident_kind" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT,
    "reported_by_user_id" TEXT,
    "resolved_at" DATETIME,
    "severity" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_incidents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_incidents_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_incidents_reported_by_user_id_fkey" FOREIGN KEY ("reported_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_incidents_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_incidents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_incidents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_live_attendance" (
    "attendance_date" DATETIME NOT NULL,
    "checked_in_at" DATETIME,
    "checked_out_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'expected',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_live_attendance_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_live_attendance_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_live_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_live_attendance_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_live_attendance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_production_calendars" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "timezone" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_production_calendars_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_calendars_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_calendars_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_calendars_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_production_days" (
    "calendar_id" TEXT,
    "call_time" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "day_number" INTEGER NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_date" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    "wrap_time" DATETIME,
    CONSTRAINT "production_production_days_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_days_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_days_calendar_id_organisation_id_fkey" FOREIGN KEY ("calendar_id", "organisation_id") REFERENCES "production_production_calendars" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_days_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_production_days_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_scene_progress" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "scene_reference" TEXT NOT NULL,
    "started_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "strip_id" TEXT,
    "takes_completed" INTEGER,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_scene_progress_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_scene_progress_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_scene_progress_strip_id_organisation_id_fkey" FOREIGN KEY ("strip_id", "organisation_id") REFERENCES "production_strips" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_scene_progress_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_scene_progress_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_schedule_items" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "ends_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_kind" TEXT NOT NULL,
    "location_label" TEXT,
    "organisation_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "project_milestone_id" TEXT,
    "schedule_id" TEXT NOT NULL,
    "schedule_version_id" TEXT,
    "starts_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_schedule_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_items_schedule_id_organisation_id_fkey" FOREIGN KEY ("schedule_id", "organisation_id") REFERENCES "production_schedules" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_items_schedule_version_id_organisation_id_fkey" FOREIGN KEY ("schedule_version_id", "organisation_id") REFERENCES "production_schedule_versions" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_items_project_milestone_id_organisation_id_fkey" FOREIGN KEY ("project_milestone_id", "organisation_id") REFERENCES "project_project_milestones" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_schedule_versions" (
    "change_summary" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "published_at" DATETIME,
    "schedule_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_schedule_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_versions_schedule_id_organisation_id_fkey" FOREIGN KEY ("schedule_id", "organisation_id") REFERENCES "production_schedules" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedule_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_schedules" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "effective_from" DATETIME NOT NULL,
    "effective_until" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "timezone" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_schedules_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedules_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedules_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_schedules_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_shoot_days" (
    "call_time" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "shoot_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weather_notes" TEXT,
    "workspace_id" TEXT,
    "wrap_time" DATETIME,
    CONSTRAINT "production_shoot_days_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shoot_days_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shoot_days_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shoot_days_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_shot_progress" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "scene_progress_id" TEXT,
    "shot_reference" TEXT NOT NULL,
    "started_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "takes_completed" INTEGER,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_shot_progress_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shot_progress_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shot_progress_scene_progress_id_organisation_id_fkey" FOREIGN KEY ("scene_progress_id", "organisation_id") REFERENCES "production_scene_progress" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shot_progress_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_shot_progress_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_stripboards" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "published_at" DATETIME,
    "schedule_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "production_stripboards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_stripboards_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_stripboards_schedule_id_organisation_id_fkey" FOREIGN KEY ("schedule_id", "organisation_id") REFERENCES "production_schedules" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_stripboards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_stripboards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_strips" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "page_eighths" DECIMAL,
    "position" INTEGER NOT NULL,
    "production_day_id" TEXT,
    "scene_number" TEXT NOT NULL,
    "scheduled_minutes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "stripboard_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "production_strips_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_strips_stripboard_id_organisation_id_fkey" FOREIGN KEY ("stripboard_id", "organisation_id") REFERENCES "production_stripboards" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_strips_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_strips_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_strips_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "production_wrap_reports" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "production_day_id" TEXT NOT NULL,
    "report_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_at" DATETIME,
    "submitted_by_user_id" TEXT,
    "summary" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    "wrapped_at" DATETIME,
    CONSTRAINT "production_wrap_reports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_wrap_reports_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_wrap_reports_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_wrap_reports_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "production_wrap_reports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_activity" (
    "actor_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "details" JSONB,
    "event_type" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "summary" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_activity_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_activity_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_activity_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_activity_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_activity_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_blockers" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "details" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "project_id" TEXT NOT NULL,
    "raised_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "task_id" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_blockers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_blockers_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_blockers_task_id_organisation_id_fkey" FOREIGN KEY ("task_id", "organisation_id") REFERENCES "project_project_tasks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_blockers_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_blockers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_blockers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_briefs" (
    "authored_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "objective" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "scope" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_briefs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_briefs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_briefs_authored_by_user_id_fkey" FOREIGN KEY ("authored_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_briefs_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_briefs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_briefs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_closeouts" (
    "approved_by_user_id" TEXT,
    "closed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessons_learned" TEXT,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "summary" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_closeouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_closeouts_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_closeouts_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_closeouts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_closeouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_closeouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_health_snapshots" (
    "captured_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "health_score" DECIMAL NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "risk_level" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_health_snapshots_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_health_snapshots_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_health_snapshots_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_health_snapshots_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_intakes" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "request_summary" TEXT NOT NULL,
    "requested_by_name" TEXT,
    "requested_start_on" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_by_user_id" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_intakes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_intakes_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_intakes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_intakes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_members" (
    "added_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "joined_at" DATETIME,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "project_project_members_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "project_project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_members_added_by_user_id_fkey" FOREIGN KEY ("added_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_milestones" (
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "due_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_milestones_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_milestones_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_milestones_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_milestones_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_milestones_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_notes" (
    "author_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "title" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_notes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_notes_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_notes_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_notes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_notes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_status_history" (
    "changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "from_status" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "to_status" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_status_history_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_status_history_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_status_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_status_history_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_status_history_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_tag_links" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "project_tag_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_tag_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tag_links_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tag_links_project_tag_id_organisation_id_fkey" FOREIGN KEY ("project_tag_id", "organisation_id") REFERENCES "project_project_tags" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tag_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tag_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_tags" (
    "color_token" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "project_type_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_project_tags_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tags_project_type_id_fkey" FOREIGN KEY ("project_type_id") REFERENCES "project_project_types" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tags_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_tasks" (
    "assignee_user_id" TEXT,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "due_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_id" TEXT NOT NULL,
    "parent_task_id" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "project_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_project_tasks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tasks_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tasks_assignee_user_id_fkey" FOREIGN KEY ("assignee_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tasks_parent_task_id_organisation_id_fkey" FOREIGN KEY ("parent_task_id", "organisation_id") REFERENCES "project_project_tasks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tasks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_project_tasks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_project_types" (
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "project_projects" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "deleted_at" DATETIME,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT NOT NULL,
    CONSTRAINT "project_projects_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_projects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_task_checklists" (
    "completed_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "organisation_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "task_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_task_checklists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_checklists_task_id_organisation_id_fkey" FOREIGN KEY ("task_id", "organisation_id") REFERENCES "project_project_tasks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_checklists_completed_by_user_id_fkey" FOREIGN KEY ("completed_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_checklists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_checklists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "project_task_dependencies" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "dependency_kind" TEXT NOT NULL,
    "depends_on_task_id" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "task_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,
    CONSTRAINT "project_task_dependencies_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_dependencies_task_id_organisation_id_fkey" FOREIGN KEY ("task_id", "organisation_id") REFERENCES "project_project_tasks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_dependencies_depends_on_task_id_organisation_id_fkey" FOREIGN KEY ("depends_on_task_id", "organisation_id") REFERENCES "project_project_tasks" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_dependencies_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces" ("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "project_task_dependencies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_case_studies" (
    "body" JSONB NOT NULL,
    "case_status" TEXT NOT NULL DEFAULT 'draft',
    "client_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "evidence_item_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "outcome_metrics" JSONB,
    "project_id" TEXT,
    "published_at" DATETIME,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_case_studies_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_projects" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "public_case_studies_evidence_item_id_fkey" FOREIGN KEY ("evidence_item_id") REFERENCES "evidence_evidence_items" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "public_case_studies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_contact_requests" (
    "assigned_to_user_id" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "organisation_name" TEXT,
    "request_status" TEXT NOT NULL DEFAULT 'new',
    "submitted_at" DATETIME NOT NULL,
    "topic" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_contact_requests_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "public_contact_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_cookie_consents" (
    "consent_choices" JSONB NOT NULL,
    "consent_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "expires_at" DATETIME,
    "id" TEXT NOT NULL PRIMARY KEY,
    "policy_version" TEXT NOT NULL,
    "recorded_at" DATETIME NOT NULL,
    "session_hash" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    CONSTRAINT "public_cookie_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "public_cookie_consents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_demo_requests" (
    "assigned_to_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisation_name" TEXT,
    "preferred_at" DATETIME,
    "product_interest" JSONB,
    "request_status" TEXT NOT NULL DEFAULT 'new',
    "role" TEXT,
    "submitted_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_demo_requests_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "public_demo_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_documentation_pages" (
    "body" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "page_status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "search_keywords" JSONB,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_label" TEXT,
    CONSTRAINT "public_documentation_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_industry_pages" (
    "body" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "page_status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "seo" JSONB,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_industry_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_legal_documents" (
    "body_uri" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "document_kind" TEXT NOT NULL,
    "effective_at" DATETIME NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "retired_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_label" TEXT NOT NULL,
    CONSTRAINT "public_legal_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_marketing_events" (
    "anonymous_id" TEXT,
    "consent_state" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "event_name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL,
    "properties" JSONB,
    "session_hash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_marketing_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_marketing_leads" (
    "assigned_to_user_id" TEXT,
    "captured_at" DATETIME NOT NULL,
    "company_name" TEXT,
    "consent_status" TEXT NOT NULL DEFAULT 'granted',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_marketing_leads_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "public_marketing_leads_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_pricing_plans" (
    "billing_period" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "currency_code" TEXT NOT NULL,
    "description" TEXT,
    "features" JSONB NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "plan_key" TEXT NOT NULL,
    "plan_status" TEXT NOT NULL DEFAULT 'draft',
    "price_amount" DECIMAL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_pricing_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_product_pages" (
    "body" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "page_status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "seo" JSONB,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_product_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "public_solution_pages" (
    "body" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "page_status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "seo" JSONB,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "title" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "public_solution_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateIndex
CREATE INDEX "activation_calendar_items_organisation_status_idx" ON "campaign_activation_calendar_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "activation_calendar_items_workspace_status_idx" ON "campaign_activation_calendar_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "activation_calendar_items_created_idx" ON "campaign_activation_calendar_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "activation_calendar_items_id_organisation_uq" ON "campaign_activation_calendar_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "activation_calendar_items_id_workspace_organisation_uq" ON "campaign_activation_calendar_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "activation_calendar_items_activation_id_sort_order_uq" ON "campaign_activation_calendar_items"("activation_id", "sort_order");

-- CreateIndex
CREATE INDEX "activation_feed_events_organisation_status_idx" ON "campaign_activation_feed_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "activation_feed_events_workspace_status_idx" ON "campaign_activation_feed_events"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "activation_feed_events_created_idx" ON "campaign_activation_feed_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "activation_feed_events_id_organisation_uq" ON "campaign_activation_feed_events"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "activation_feed_events_id_workspace_organisation_uq" ON "campaign_activation_feed_events"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "activations_organisation_status_idx" ON "campaign_activations"("organisation_id", "activation_status");

-- CreateIndex
CREATE INDEX "activations_workspace_status_idx" ON "campaign_activations"("workspace_id", "activation_status");

-- CreateIndex
CREATE INDEX "activations_created_idx" ON "campaign_activations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "activations_id_organisation_uq" ON "campaign_activations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "activations_id_workspace_organisation_uq" ON "campaign_activations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "atl_plans_organisation_status_idx" ON "campaign_atl_plans"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "atl_plans_workspace_status_idx" ON "campaign_atl_plans"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "atl_plans_created_idx" ON "campaign_atl_plans"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "atl_plans_id_organisation_uq" ON "campaign_atl_plans"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "atl_plans_id_workspace_organisation_uq" ON "campaign_atl_plans"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "btl_plans_organisation_status_idx" ON "campaign_btl_plans"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "btl_plans_workspace_status_idx" ON "campaign_btl_plans"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "btl_plans_created_idx" ON "campaign_btl_plans"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "btl_plans_id_organisation_uq" ON "campaign_btl_plans"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "btl_plans_id_workspace_organisation_uq" ON "campaign_btl_plans"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "campaign_briefs_organisation_status_idx" ON "campaign_campaign_briefs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "campaign_briefs_workspace_status_idx" ON "campaign_campaign_briefs"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "campaign_briefs_created_idx" ON "campaign_campaign_briefs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_briefs_id_organisation_uq" ON "campaign_campaign_briefs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_briefs_id_workspace_organisation_uq" ON "campaign_campaign_briefs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "campaign_markets_organisation_status_idx" ON "campaign_campaign_markets"("organisation_id", "market_status");

-- CreateIndex
CREATE INDEX "campaign_markets_workspace_status_idx" ON "campaign_campaign_markets"("workspace_id", "market_status");

-- CreateIndex
CREATE INDEX "campaign_markets_created_idx" ON "campaign_campaign_markets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_markets_id_organisation_uq" ON "campaign_campaign_markets"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_markets_id_workspace_organisation_uq" ON "campaign_campaign_markets"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_markets_campaign_id_market_id_uq" ON "campaign_campaign_markets"("campaign_id", "market_id");

-- CreateIndex
CREATE INDEX "campaign_metrics_organisation_status_idx" ON "campaign_campaign_metrics"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "campaign_metrics_workspace_status_idx" ON "campaign_campaign_metrics"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "campaign_metrics_created_idx" ON "campaign_campaign_metrics"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_metrics_id_organisation_uq" ON "campaign_campaign_metrics"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_metrics_id_workspace_organisation_uq" ON "campaign_campaign_metrics"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_metrics_campaign_id_metric_key_period_start_period_end_uq" ON "campaign_campaign_metrics"("campaign_id", "metric_key", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "campaign_results_organisation_status_idx" ON "campaign_campaign_results"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "campaign_results_workspace_status_idx" ON "campaign_campaign_results"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "campaign_results_created_idx" ON "campaign_campaign_results"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_results_id_organisation_uq" ON "campaign_campaign_results"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_results_id_workspace_organisation_uq" ON "campaign_campaign_results"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "campaign_strategies_organisation_status_idx" ON "campaign_campaign_strategies"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "campaign_strategies_workspace_status_idx" ON "campaign_campaign_strategies"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "campaign_strategies_created_idx" ON "campaign_campaign_strategies"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_strategies_id_organisation_uq" ON "campaign_campaign_strategies"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_strategies_id_workspace_organisation_uq" ON "campaign_campaign_strategies"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "campaigns_organisation_status_idx" ON "campaign_campaigns"("organisation_id", "campaign_status");

-- CreateIndex
CREATE INDEX "campaigns_workspace_status_idx" ON "campaign_campaigns"("workspace_id", "campaign_status");

-- CreateIndex
CREATE INDEX "campaigns_created_idx" ON "campaign_campaigns"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_id_organisation_uq" ON "campaign_campaigns"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_id_workspace_organisation_uq" ON "campaign_campaigns"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "cities_created_idx" ON "campaign_cities"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cities_city_code_uq" ON "campaign_cities"("city_code");

-- CreateIndex
CREATE INDEX "dooh_schedules_organisation_status_idx" ON "campaign_dooh_schedules"("organisation_id", "schedule_status");

-- CreateIndex
CREATE INDEX "dooh_schedules_workspace_status_idx" ON "campaign_dooh_schedules"("workspace_id", "schedule_status");

-- CreateIndex
CREATE INDEX "dooh_schedules_created_idx" ON "campaign_dooh_schedules"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "dooh_schedules_id_organisation_uq" ON "campaign_dooh_schedules"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "dooh_schedules_id_workspace_organisation_uq" ON "campaign_dooh_schedules"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "dooh_screens_organisation_status_idx" ON "campaign_dooh_screens"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "dooh_screens_workspace_status_idx" ON "campaign_dooh_screens"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "dooh_screens_created_idx" ON "campaign_dooh_screens"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "dooh_screens_id_organisation_uq" ON "campaign_dooh_screens"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "dooh_screens_id_workspace_organisation_uq" ON "campaign_dooh_screens"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "lead_events_organisation_status_idx" ON "campaign_lead_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "lead_events_workspace_status_idx" ON "campaign_lead_events"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "lead_events_created_idx" ON "campaign_lead_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "lead_events_id_organisation_uq" ON "campaign_lead_events"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "lead_events_id_workspace_organisation_uq" ON "campaign_lead_events"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "leads_organisation_status_idx" ON "campaign_leads"("organisation_id", "consent_status");

-- CreateIndex
CREATE INDEX "leads_workspace_status_idx" ON "campaign_leads"("workspace_id", "consent_status");

-- CreateIndex
CREATE INDEX "leads_created_idx" ON "campaign_leads"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "leads_id_organisation_uq" ON "campaign_leads"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "leads_id_workspace_organisation_uq" ON "campaign_leads"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "markets_created_idx" ON "campaign_markets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "markets_market_code_uq" ON "campaign_markets"("market_code");

-- CreateIndex
CREATE INDEX "media_plan_items_organisation_status_idx" ON "campaign_media_plan_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "media_plan_items_workspace_status_idx" ON "campaign_media_plan_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "media_plan_items_created_idx" ON "campaign_media_plan_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "media_plan_items_id_organisation_uq" ON "campaign_media_plan_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_plan_items_id_workspace_organisation_uq" ON "campaign_media_plan_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_plan_items_media_plan_id_sort_order_uq" ON "campaign_media_plan_items"("media_plan_id", "sort_order");

-- CreateIndex
CREATE INDEX "media_plans_organisation_status_idx" ON "campaign_media_plans"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "media_plans_workspace_status_idx" ON "campaign_media_plans"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "media_plans_created_idx" ON "campaign_media_plans"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "media_plans_id_organisation_uq" ON "campaign_media_plans"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_plans_id_workspace_organisation_uq" ON "campaign_media_plans"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ooh_site_bookings_organisation_status_idx" ON "campaign_ooh_site_bookings"("organisation_id", "booking_status");

-- CreateIndex
CREATE INDEX "ooh_site_bookings_workspace_status_idx" ON "campaign_ooh_site_bookings"("workspace_id", "booking_status");

-- CreateIndex
CREATE INDEX "ooh_site_bookings_created_idx" ON "campaign_ooh_site_bookings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ooh_site_bookings_id_organisation_uq" ON "campaign_ooh_site_bookings"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ooh_site_bookings_id_workspace_organisation_uq" ON "campaign_ooh_site_bookings"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ooh_sites_organisation_status_idx" ON "campaign_ooh_sites"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ooh_sites_workspace_status_idx" ON "campaign_ooh_sites"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "ooh_sites_created_idx" ON "campaign_ooh_sites"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ooh_sites_id_organisation_uq" ON "campaign_ooh_sites"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ooh_sites_id_workspace_organisation_uq" ON "campaign_ooh_sites"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "site_checkins_organisation_status_idx" ON "campaign_site_checkins"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "site_checkins_workspace_status_idx" ON "campaign_site_checkins"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "site_checkins_created_idx" ON "campaign_site_checkins"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "site_checkins_id_organisation_uq" ON "campaign_site_checkins"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_checkins_id_workspace_organisation_uq" ON "campaign_site_checkins"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_announcements_1_organisation_id_status_published_at" ON "communications_announcements"("organisation_id", "status", "published_at");

-- CreateIndex
CREATE INDEX "ix_announcements_2_organisation_id_workspace_id" ON "communications_announcements"("organisation_id", "workspace_id");

-- CreateIndex
CREATE INDEX "ix_announcements_3_organisation_id_workspace_id_status_published_at" ON "communications_announcements"("organisation_id", "workspace_id", "status", "published_at");

-- CreateIndex
CREATE INDEX "ix_communication_threads_1_organisation_id_updated_at" ON "communications_communication_threads"("organisation_id", "updated_at");

-- CreateIndex
CREATE INDEX "ix_communication_threads_2_organisation_id_kind_closed_at" ON "communications_communication_threads"("organisation_id", "kind", "closed_at");

-- CreateIndex
CREATE INDEX "ix_communication_threads_3_organisation_id_workspace_id" ON "communications_communication_threads"("organisation_id", "workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_communication_threads_organisation_id_id" ON "communications_communication_threads"("organisation_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_communication_threads_organisation_id_id_workspace_id" ON "communications_communication_threads"("organisation_id", "id", "workspace_id");

-- CreateIndex
CREATE INDEX "ix_direct_message_threads_1_organisation_id_workspace_id" ON "communications_direct_message_threads"("organisation_id", "workspace_id");

-- CreateIndex
CREATE INDEX "ix_direct_message_threads_2_organisation_id_workspace_id_participant_low_membership_id_participant_high_membership_id" ON "communications_direct_message_threads"("organisation_id", "workspace_id", "participant_low_membership_id", "participant_high_membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_direct_message_threads_organisation_id_workspace_id_participant_low_membership_id_participant_high_membership_id" ON "communications_direct_message_threads"("organisation_id", "workspace_id", "participant_low_membership_id", "participant_high_membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_direct_message_threads_organisation_id_id" ON "communications_direct_message_threads"("organisation_id", "id");

-- CreateIndex
CREATE INDEX "ix_message_attachments_1_organisation_id_message_id" ON "communications_message_attachments"("organisation_id", "message_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_message_attachments_organisation_id_storage_key" ON "communications_message_attachments"("organisation_id", "storage_key");

-- CreateIndex
CREATE INDEX "ix_messages_1_organisation_id_thread_id_created_at" ON "communications_messages"("organisation_id", "thread_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_messages_organisation_id_id" ON "communications_messages"("organisation_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_messages_organisation_id_thread_id_sequence_number" ON "communications_messages"("organisation_id", "thread_id", "sequence_number");

-- CreateIndex
CREATE INDEX "ix_notification_deliveries_1_organisation_id_status_scheduled_at" ON "communications_notification_deliveries"("organisation_id", "status", "scheduled_at");

-- CreateIndex
CREATE INDEX "ix_notification_deliveries_2_notification_id_created_at" ON "communications_notification_deliveries"("notification_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notification_deliveries_organisation_id_idempotency_key" ON "communications_notification_deliveries"("organisation_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notification_deliveries_notification_id_attempt_number" ON "communications_notification_deliveries"("notification_id", "attempt_number");

-- CreateIndex
CREATE INDEX "ix_notification_preferences_1_organisation_id_user_id" ON "communications_notification_preferences"("organisation_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notification_preferences_organisation_id_user_id_notification_type_channel" ON "communications_notification_preferences"("organisation_id", "user_id", "notification_type", "channel");

-- CreateIndex
CREATE INDEX "ix_notifications_1_organisation_id_recipient_user_id_created_at" ON "communications_notifications"("organisation_id", "recipient_user_id", "created_at");

-- CreateIndex
CREATE INDEX "ix_notifications_2_organisation_id_recipient_user_id_state" ON "communications_notifications"("organisation_id", "recipient_user_id", "state");

-- CreateIndex
CREATE INDEX "ix_notifications_3_organisation_id_workspace_id" ON "communications_notifications"("organisation_id", "workspace_id");

-- CreateIndex
CREATE INDEX "ix_notifications_4_organisation_id_workspace_id_recipient_user_id_created_at" ON "communications_notifications"("organisation_id", "workspace_id", "recipient_user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notifications_organisation_id_id" ON "communications_notifications"("organisation_id", "id");

-- CreateIndex
CREATE INDEX "ix_thread_members_1_organisation_id_workspace_id_thread_id_workspace_membership_id_left_at" ON "communications_thread_members"("organisation_id", "workspace_id", "thread_id", "workspace_membership_id", "left_at");

-- CreateIndex
CREATE INDEX "ix_thread_members_2_workspace_membership_id_joined_at" ON "communications_thread_members"("workspace_membership_id", "joined_at");

-- CreateIndex
CREATE INDEX "asset_versions_organisation_status_idx" ON "creative_asset_versions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "asset_versions_workspace_status_idx" ON "creative_asset_versions"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "asset_versions_created_idx" ON "creative_asset_versions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "asset_versions_id_organisation_uq" ON "creative_asset_versions"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_versions_id_workspace_organisation_uq" ON "creative_asset_versions"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_versions_creative_asset_id_version_number_uq" ON "creative_asset_versions"("creative_asset_id", "version_number");

-- CreateIndex
CREATE INDEX "character_scene_links_organisation_status_idx" ON "creative_character_scene_links"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "character_scene_links_workspace_status_idx" ON "creative_character_scene_links"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "character_scene_links_created_idx" ON "creative_character_scene_links"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "character_scene_links_id_organisation_uq" ON "creative_character_scene_links"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_scene_links_id_workspace_organisation_uq" ON "creative_character_scene_links"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_scene_links_character_id_scene_id_uq" ON "creative_character_scene_links"("character_id", "scene_id");

-- CreateIndex
CREATE INDEX "characters_organisation_status_idx" ON "creative_characters"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "characters_workspace_status_idx" ON "creative_characters"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "characters_created_idx" ON "creative_characters"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "characters_id_organisation_uq" ON "creative_characters"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "characters_id_workspace_organisation_uq" ON "creative_characters"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "creative_approvals_organisation_status_idx" ON "creative_creative_approvals"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "creative_approvals_workspace_status_idx" ON "creative_creative_approvals"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "creative_approvals_created_idx" ON "creative_creative_approvals"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "creative_approvals_id_organisation_uq" ON "creative_creative_approvals"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "creative_approvals_id_workspace_organisation_uq" ON "creative_creative_approvals"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "creative_assets_organisation_status_idx" ON "creative_creative_assets"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "creative_assets_workspace_status_idx" ON "creative_creative_assets"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "creative_assets_created_idx" ON "creative_creative_assets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "creative_assets_id_organisation_uq" ON "creative_creative_assets"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "creative_assets_id_workspace_organisation_uq" ON "creative_creative_assets"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "creative_references_organisation_status_idx" ON "creative_creative_references"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "creative_references_workspace_status_idx" ON "creative_creative_references"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "creative_references_created_idx" ON "creative_creative_references"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "creative_references_id_organisation_uq" ON "creative_creative_references"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "creative_references_id_workspace_organisation_uq" ON "creative_creative_references"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ideas_organisation_status_idx" ON "creative_ideas"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ideas_workspace_status_idx" ON "creative_ideas"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "ideas_created_idx" ON "creative_ideas"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ideas_id_organisation_uq" ON "creative_ideas"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ideas_id_workspace_organisation_uq" ON "creative_ideas"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "production_elements_organisation_status_idx" ON "creative_production_elements"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "production_elements_workspace_status_idx" ON "creative_production_elements"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "production_elements_created_idx" ON "creative_production_elements"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "production_elements_id_organisation_uq" ON "creative_production_elements"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "production_elements_id_workspace_organisation_uq" ON "creative_production_elements"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "research_items_organisation_status_idx" ON "creative_research_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "research_items_workspace_status_idx" ON "creative_research_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "research_items_created_idx" ON "creative_research_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "research_items_id_organisation_uq" ON "creative_research_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "research_items_id_workspace_organisation_uq" ON "creative_research_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "scene_elements_organisation_status_idx" ON "creative_scene_elements"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "scene_elements_workspace_status_idx" ON "creative_scene_elements"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "scene_elements_created_idx" ON "creative_scene_elements"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "scene_elements_id_organisation_uq" ON "creative_scene_elements"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "scene_elements_id_workspace_organisation_uq" ON "creative_scene_elements"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "scene_elements_scene_id_production_element_id_uq" ON "creative_scene_elements"("scene_id", "production_element_id");

-- CreateIndex
CREATE INDEX "scene_versions_organisation_status_idx" ON "creative_scene_versions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "scene_versions_workspace_status_idx" ON "creative_scene_versions"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "scene_versions_created_idx" ON "creative_scene_versions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "scene_versions_id_organisation_uq" ON "creative_scene_versions"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "scene_versions_id_workspace_organisation_uq" ON "creative_scene_versions"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "scene_versions_scene_id_version_number_uq" ON "creative_scene_versions"("scene_id", "version_number");

-- CreateIndex
CREATE INDEX "scenes_organisation_status_idx" ON "creative_scenes"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "scenes_workspace_status_idx" ON "creative_scenes"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "scenes_created_idx" ON "creative_scenes"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "scenes_id_organisation_uq" ON "creative_scenes"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "scenes_id_workspace_organisation_uq" ON "creative_scenes"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "script_breakdowns_organisation_status_idx" ON "creative_script_breakdowns"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "script_breakdowns_workspace_status_idx" ON "creative_script_breakdowns"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "script_breakdowns_created_idx" ON "creative_script_breakdowns"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "script_breakdowns_id_organisation_uq" ON "creative_script_breakdowns"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "script_breakdowns_id_workspace_organisation_uq" ON "creative_script_breakdowns"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "script_versions_organisation_status_idx" ON "creative_script_versions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "script_versions_workspace_status_idx" ON "creative_script_versions"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "script_versions_created_idx" ON "creative_script_versions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "script_versions_id_organisation_uq" ON "creative_script_versions"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "script_versions_id_workspace_organisation_uq" ON "creative_script_versions"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "script_versions_script_id_version_number_uq" ON "creative_script_versions"("script_id", "version_number");

-- CreateIndex
CREATE INDEX "scripts_organisation_status_idx" ON "creative_scripts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "scripts_workspace_status_idx" ON "creative_scripts"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "scripts_created_idx" ON "creative_scripts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "scripts_id_organisation_uq" ON "creative_scripts"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "scripts_id_workspace_organisation_uq" ON "creative_scripts"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "shot_lists_organisation_status_idx" ON "creative_shot_lists"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "shot_lists_workspace_status_idx" ON "creative_shot_lists"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "shot_lists_created_idx" ON "creative_shot_lists"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shot_lists_id_organisation_uq" ON "creative_shot_lists"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "shot_lists_id_workspace_organisation_uq" ON "creative_shot_lists"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "shots_organisation_status_idx" ON "creative_shots"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "shots_workspace_status_idx" ON "creative_shots"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "shots_created_idx" ON "creative_shots"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shots_id_organisation_uq" ON "creative_shots"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "shots_id_workspace_organisation_uq" ON "creative_shots"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "shots_shot_list_id_shot_number_uq" ON "creative_shots"("shot_list_id", "shot_number");

-- CreateIndex
CREATE INDEX "storyboard_frames_organisation_status_idx" ON "creative_storyboard_frames"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "storyboard_frames_workspace_status_idx" ON "creative_storyboard_frames"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "storyboard_frames_created_idx" ON "creative_storyboard_frames"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "storyboard_frames_id_organisation_uq" ON "creative_storyboard_frames"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "storyboard_frames_id_workspace_organisation_uq" ON "creative_storyboard_frames"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "storyboard_frames_storyboard_id_frame_number_uq" ON "creative_storyboard_frames"("storyboard_id", "frame_number");

-- CreateIndex
CREATE INDEX "storyboards_organisation_status_idx" ON "creative_storyboards"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "storyboards_workspace_status_idx" ON "creative_storyboards"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "storyboards_created_idx" ON "creative_storyboards"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "storyboards_id_organisation_uq" ON "creative_storyboards"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "storyboards_id_workspace_organisation_uq" ON "creative_storyboards"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "treatments_organisation_status_idx" ON "creative_treatments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "treatments_workspace_status_idx" ON "creative_treatments"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "treatments_created_idx" ON "creative_treatments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "treatments_id_organisation_uq" ON "creative_treatments"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "treatments_id_workspace_organisation_uq" ON "creative_treatments"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "board_items_organisation_status_idx" ON "eventsSpatial_board_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "board_items_workspace_status_idx" ON "eventsSpatial_board_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "board_items_created_idx" ON "eventsSpatial_board_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "board_items_id_organisation_uq" ON "eventsSpatial_board_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "board_items_id_workspace_organisation_uq" ON "eventsSpatial_board_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "board_items_board_id_sort_order_uq" ON "eventsSpatial_board_items"("board_id", "sort_order");

-- CreateIndex
CREATE INDEX "boards_organisation_status_idx" ON "eventsSpatial_boards"("organisation_id", "board_status");

-- CreateIndex
CREATE INDEX "boards_workspace_status_idx" ON "eventsSpatial_boards"("workspace_id", "board_status");

-- CreateIndex
CREATE INDEX "boards_created_idx" ON "eventsSpatial_boards"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "boards_id_organisation_uq" ON "eventsSpatial_boards"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "boards_id_workspace_organisation_uq" ON "eventsSpatial_boards"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "cad_models_organisation_status_idx" ON "eventsSpatial_cad_models"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "cad_models_workspace_status_idx" ON "eventsSpatial_cad_models"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "cad_models_created_idx" ON "eventsSpatial_cad_models"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cad_models_id_organisation_uq" ON "eventsSpatial_cad_models"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "cad_models_id_workspace_organisation_uq" ON "eventsSpatial_cad_models"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "decision_graph_edges_organisation_status_idx" ON "eventsSpatial_decision_graph_edges"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "decision_graph_edges_workspace_status_idx" ON "eventsSpatial_decision_graph_edges"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "decision_graph_edges_created_idx" ON "eventsSpatial_decision_graph_edges"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graph_edges_id_organisation_uq" ON "eventsSpatial_decision_graph_edges"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graph_edges_id_workspace_organisation_uq" ON "eventsSpatial_decision_graph_edges"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graph_edges_decision_graph_id_from_node_key_to_node_key_uq" ON "eventsSpatial_decision_graph_edges"("decision_graph_id", "from_node_key", "to_node_key");

-- CreateIndex
CREATE INDEX "decision_graph_nodes_organisation_status_idx" ON "eventsSpatial_decision_graph_nodes"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "decision_graph_nodes_workspace_status_idx" ON "eventsSpatial_decision_graph_nodes"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "decision_graph_nodes_created_idx" ON "eventsSpatial_decision_graph_nodes"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graph_nodes_id_organisation_uq" ON "eventsSpatial_decision_graph_nodes"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graph_nodes_id_workspace_organisation_uq" ON "eventsSpatial_decision_graph_nodes"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graph_nodes_decision_graph_id_node_key_uq" ON "eventsSpatial_decision_graph_nodes"("decision_graph_id", "node_key");

-- CreateIndex
CREATE INDEX "decision_graphs_organisation_status_idx" ON "eventsSpatial_decision_graphs"("organisation_id", "graph_status");

-- CreateIndex
CREATE INDEX "decision_graphs_workspace_status_idx" ON "eventsSpatial_decision_graphs"("workspace_id", "graph_status");

-- CreateIndex
CREATE INDEX "decision_graphs_created_idx" ON "eventsSpatial_decision_graphs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graphs_id_organisation_uq" ON "eventsSpatial_decision_graphs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "decision_graphs_id_workspace_organisation_uq" ON "eventsSpatial_decision_graphs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "event_journeys_organisation_status_idx" ON "eventsSpatial_event_journeys"("organisation_id", "journey_status");

-- CreateIndex
CREATE INDEX "event_journeys_workspace_status_idx" ON "eventsSpatial_event_journeys"("workspace_id", "journey_status");

-- CreateIndex
CREATE INDEX "event_journeys_created_idx" ON "eventsSpatial_event_journeys"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "event_journeys_id_organisation_uq" ON "eventsSpatial_event_journeys"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_journeys_id_workspace_organisation_uq" ON "eventsSpatial_event_journeys"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "event_timeline_items_organisation_status_idx" ON "eventsSpatial_event_timeline_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "event_timeline_items_workspace_status_idx" ON "eventsSpatial_event_timeline_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "event_timeline_items_created_idx" ON "eventsSpatial_event_timeline_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "event_timeline_items_id_organisation_uq" ON "eventsSpatial_event_timeline_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_timeline_items_id_workspace_organisation_uq" ON "eventsSpatial_event_timeline_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_timeline_items_event_id_sort_order_uq" ON "eventsSpatial_event_timeline_items"("event_id", "sort_order");

-- CreateIndex
CREATE INDEX "events_organisation_status_idx" ON "eventsSpatial_events"("organisation_id", "event_status");

-- CreateIndex
CREATE INDEX "events_workspace_status_idx" ON "eventsSpatial_events"("workspace_id", "event_status");

-- CreateIndex
CREATE INDEX "events_created_idx" ON "eventsSpatial_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "events_id_organisation_uq" ON "eventsSpatial_events"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_id_workspace_organisation_uq" ON "eventsSpatial_events"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "exhibition_layouts_organisation_status_idx" ON "eventsSpatial_exhibition_layouts"("organisation_id", "layout_status");

-- CreateIndex
CREATE INDEX "exhibition_layouts_workspace_status_idx" ON "eventsSpatial_exhibition_layouts"("workspace_id", "layout_status");

-- CreateIndex
CREATE INDEX "exhibition_layouts_created_idx" ON "eventsSpatial_exhibition_layouts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_layouts_id_organisation_uq" ON "eventsSpatial_exhibition_layouts"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_layouts_id_workspace_organisation_uq" ON "eventsSpatial_exhibition_layouts"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "film_twins_organisation_status_idx" ON "eventsSpatial_film_twins"("organisation_id", "twin_status");

-- CreateIndex
CREATE INDEX "film_twins_workspace_status_idx" ON "eventsSpatial_film_twins"("workspace_id", "twin_status");

-- CreateIndex
CREATE INDEX "film_twins_created_idx" ON "eventsSpatial_film_twins"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "film_twins_id_organisation_uq" ON "eventsSpatial_film_twins"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "film_twins_id_workspace_organisation_uq" ON "eventsSpatial_film_twins"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "presentation_slides_organisation_status_idx" ON "eventsSpatial_presentation_slides"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "presentation_slides_workspace_status_idx" ON "eventsSpatial_presentation_slides"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "presentation_slides_created_idx" ON "eventsSpatial_presentation_slides"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "presentation_slides_id_organisation_uq" ON "eventsSpatial_presentation_slides"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "presentation_slides_id_workspace_organisation_uq" ON "eventsSpatial_presentation_slides"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "presentation_slides_presentation_id_slide_number_uq" ON "eventsSpatial_presentation_slides"("presentation_id", "slide_number");

-- CreateIndex
CREATE INDEX "presentations_organisation_status_idx" ON "eventsSpatial_presentations"("organisation_id", "presentation_status");

-- CreateIndex
CREATE INDEX "presentations_workspace_status_idx" ON "eventsSpatial_presentations"("workspace_id", "presentation_status");

-- CreateIndex
CREATE INDEX "presentations_created_idx" ON "eventsSpatial_presentations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "presentations_id_organisation_uq" ON "eventsSpatial_presentations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "presentations_id_workspace_organisation_uq" ON "eventsSpatial_presentations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "run_of_show_items_organisation_status_idx" ON "eventsSpatial_run_of_show_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "run_of_show_items_workspace_status_idx" ON "eventsSpatial_run_of_show_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "run_of_show_items_created_idx" ON "eventsSpatial_run_of_show_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "run_of_show_items_id_organisation_uq" ON "eventsSpatial_run_of_show_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "run_of_show_items_id_workspace_organisation_uq" ON "eventsSpatial_run_of_show_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "run_of_show_items_event_id_sequence_uq" ON "eventsSpatial_run_of_show_items"("event_id", "sequence");

-- CreateIndex
CREATE INDEX "simulations_organisation_status_idx" ON "eventsSpatial_simulations"("organisation_id", "simulation_status");

-- CreateIndex
CREATE INDEX "simulations_workspace_status_idx" ON "eventsSpatial_simulations"("workspace_id", "simulation_status");

-- CreateIndex
CREATE INDEX "simulations_created_idx" ON "eventsSpatial_simulations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "simulations_id_organisation_uq" ON "eventsSpatial_simulations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulations_id_workspace_organisation_uq" ON "eventsSpatial_simulations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "spatial_layers_organisation_status_idx" ON "eventsSpatial_spatial_layers"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "spatial_layers_workspace_status_idx" ON "eventsSpatial_spatial_layers"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "spatial_layers_created_idx" ON "eventsSpatial_spatial_layers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_layers_id_organisation_uq" ON "eventsSpatial_spatial_layers"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_layers_id_workspace_organisation_uq" ON "eventsSpatial_spatial_layers"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_layers_spatial_project_id_sort_order_uq" ON "eventsSpatial_spatial_layers"("spatial_project_id", "sort_order");

-- CreateIndex
CREATE INDEX "spatial_layouts_organisation_status_idx" ON "eventsSpatial_spatial_layouts"("organisation_id", "layout_status");

-- CreateIndex
CREATE INDEX "spatial_layouts_workspace_status_idx" ON "eventsSpatial_spatial_layouts"("workspace_id", "layout_status");

-- CreateIndex
CREATE INDEX "spatial_layouts_created_idx" ON "eventsSpatial_spatial_layouts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_layouts_id_organisation_uq" ON "eventsSpatial_spatial_layouts"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_layouts_id_workspace_organisation_uq" ON "eventsSpatial_spatial_layouts"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "spatial_objects_organisation_status_idx" ON "eventsSpatial_spatial_objects"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "spatial_objects_workspace_status_idx" ON "eventsSpatial_spatial_objects"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "spatial_objects_created_idx" ON "eventsSpatial_spatial_objects"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_objects_id_organisation_uq" ON "eventsSpatial_spatial_objects"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_objects_id_workspace_organisation_uq" ON "eventsSpatial_spatial_objects"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "spatial_operations_organisation_status_idx" ON "eventsSpatial_spatial_operations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "spatial_operations_workspace_status_idx" ON "eventsSpatial_spatial_operations"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "spatial_operations_created_idx" ON "eventsSpatial_spatial_operations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_operations_id_organisation_uq" ON "eventsSpatial_spatial_operations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_operations_id_workspace_organisation_uq" ON "eventsSpatial_spatial_operations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "spatial_projects_organisation_status_idx" ON "eventsSpatial_spatial_projects"("organisation_id", "project_status");

-- CreateIndex
CREATE INDEX "spatial_projects_workspace_status_idx" ON "eventsSpatial_spatial_projects"("workspace_id", "project_status");

-- CreateIndex
CREATE INDEX "spatial_projects_created_idx" ON "eventsSpatial_spatial_projects"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_projects_id_organisation_uq" ON "eventsSpatial_spatial_projects"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "spatial_projects_id_workspace_organisation_uq" ON "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "venue_bookings_organisation_status_idx" ON "eventsSpatial_venue_bookings"("organisation_id", "booking_status");

-- CreateIndex
CREATE INDEX "venue_bookings_workspace_status_idx" ON "eventsSpatial_venue_bookings"("workspace_id", "booking_status");

-- CreateIndex
CREATE INDEX "venue_bookings_created_idx" ON "eventsSpatial_venue_bookings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "venue_bookings_id_organisation_uq" ON "eventsSpatial_venue_bookings"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "venue_bookings_id_workspace_organisation_uq" ON "eventsSpatial_venue_bookings"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "venues_organisation_status_idx" ON "eventsSpatial_venues"("organisation_id", "venue_status");

-- CreateIndex
CREATE INDEX "venues_workspace_status_idx" ON "eventsSpatial_venues"("workspace_id", "venue_status");

-- CreateIndex
CREATE INDEX "venues_created_idx" ON "eventsSpatial_venues"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "venues_id_organisation_uq" ON "eventsSpatial_venues"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "venues_id_workspace_organisation_uq" ON "eventsSpatial_venues"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "wedding_events_organisation_status_idx" ON "eventsSpatial_wedding_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "wedding_events_workspace_status_idx" ON "eventsSpatial_wedding_events"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "wedding_events_created_idx" ON "eventsSpatial_wedding_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_events_id_organisation_uq" ON "eventsSpatial_wedding_events"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_events_id_workspace_organisation_uq" ON "eventsSpatial_wedding_events"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_events_wedding_id_sort_order_uq" ON "eventsSpatial_wedding_events"("wedding_id", "sort_order");

-- CreateIndex
CREATE INDEX "wedding_journeys_organisation_status_idx" ON "eventsSpatial_wedding_journeys"("organisation_id", "journey_status");

-- CreateIndex
CREATE INDEX "wedding_journeys_workspace_status_idx" ON "eventsSpatial_wedding_journeys"("workspace_id", "journey_status");

-- CreateIndex
CREATE INDEX "wedding_journeys_created_idx" ON "eventsSpatial_wedding_journeys"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_journeys_id_organisation_uq" ON "eventsSpatial_wedding_journeys"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_journeys_id_workspace_organisation_uq" ON "eventsSpatial_wedding_journeys"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "weddings_organisation_status_idx" ON "eventsSpatial_weddings"("organisation_id", "wedding_status");

-- CreateIndex
CREATE INDEX "weddings_workspace_status_idx" ON "eventsSpatial_weddings"("workspace_id", "wedding_status");

-- CreateIndex
CREATE INDEX "weddings_created_idx" ON "eventsSpatial_weddings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_id_organisation_uq" ON "eventsSpatial_weddings"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_id_workspace_organisation_uq" ON "eventsSpatial_weddings"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_comments_organisation_status" ON "evidence_approval_comments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_approval_comments_organisation_id" ON "evidence_approval_comments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_comments_approval_id" ON "evidence_approval_comments"("approval_id");

-- CreateIndex
CREATE INDEX "ix_approval_comments_author_user_id" ON "evidence_approval_comments"("author_user_id");

-- CreateIndex
CREATE INDEX "ix_approval_comments_workspace_id_organisation_id" ON "evidence_approval_comments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_comments_created_by_user_id" ON "evidence_approval_comments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_approval_comments_id_organisation" ON "evidence_approval_comments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_organisation_status" ON "evidence_approval_decisions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_organisation_id" ON "evidence_approval_decisions"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_approval_id" ON "evidence_approval_decisions"("approval_id");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_approval_step_id" ON "evidence_approval_decisions"("approval_step_id");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_decided_by_user_id" ON "evidence_approval_decisions"("decided_by_user_id");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_workspace_id_organisation_id" ON "evidence_approval_decisions"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_decisions_created_by_user_id" ON "evidence_approval_decisions"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_approval_decisions_id_organisation" ON "evidence_approval_decisions"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_steps_organisation_status" ON "evidence_approval_steps"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_approval_steps_organisation_id" ON "evidence_approval_steps"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_steps_approval_id" ON "evidence_approval_steps"("approval_id");

-- CreateIndex
CREATE INDEX "ix_approval_steps_approver_user_id" ON "evidence_approval_steps"("approver_user_id");

-- CreateIndex
CREATE INDEX "ix_approval_steps_workspace_id_organisation_id" ON "evidence_approval_steps"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_approval_steps_created_by_user_id" ON "evidence_approval_steps"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_approval_steps_id_organisation" ON "evidence_approval_steps"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "approvals_evidence_state_idx" ON "evidence_approvals"("organisation_id", "evidence_item_id", "decision");

-- CreateIndex
CREATE INDEX "approvals_reviewer_state_idx" ON "evidence_approvals"("assigned_reviewer_user_id", "decision");

-- CreateIndex
CREATE INDEX "audit_events_tenant_created_idx" ON "evidence_audit_events"("organisation_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_events_tenant_project_created_idx" ON "evidence_audit_events"("organisation_id", "project_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "audit_events_id_organisation_unique" ON "evidence_audit_events"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_before_after_proofs_organisation_status" ON "evidence_before_after_proofs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_before_after_proofs_organisation_id" ON "evidence_before_after_proofs"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_before_after_proofs_evidence_item_id_organisation_id" ON "evidence_before_after_proofs"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_before_after_proofs_change_request_id" ON "evidence_before_after_proofs"("change_request_id");

-- CreateIndex
CREATE INDEX "ix_before_after_proofs_workspace_id_organisation_id" ON "evidence_before_after_proofs"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_before_after_proofs_created_by_user_id" ON "evidence_before_after_proofs"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_before_after_proofs_id_organisation" ON "evidence_before_after_proofs"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_chain_of_custody_events_organisation_status" ON "evidence_chain_of_custody_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_chain_of_custody_events_organisation_id" ON "evidence_chain_of_custody_events"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_chain_of_custody_events_evidence_item_id_organisation_id" ON "evidence_chain_of_custody_events"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_chain_of_custody_events_actor_user_id" ON "evidence_chain_of_custody_events"("actor_user_id");

-- CreateIndex
CREATE INDEX "ix_chain_of_custody_events_workspace_id_organisation_id" ON "evidence_chain_of_custody_events"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_chain_of_custody_events_created_by_user_id" ON "evidence_chain_of_custody_events"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_chain_of_custody_events_id_organisation" ON "evidence_chain_of_custody_events"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_change_requests_organisation_status" ON "evidence_change_requests"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_change_requests_organisation_id" ON "evidence_change_requests"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_change_requests_project_id_organisation_id" ON "evidence_change_requests"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_change_requests_requested_by_user_id" ON "evidence_change_requests"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "ix_change_requests_evidence_item_id_organisation_id" ON "evidence_change_requests"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_change_requests_workspace_id_organisation_id" ON "evidence_change_requests"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_change_requests_created_by_user_id" ON "evidence_change_requests"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_change_requests_id_organisation" ON "evidence_change_requests"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_document_links_organisation_status" ON "evidence_document_links"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_document_links_organisation_id" ON "evidence_document_links"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_document_links_document_id" ON "evidence_document_links"("document_id");

-- CreateIndex
CREATE INDEX "ix_document_links_linked_by_user_id" ON "evidence_document_links"("linked_by_user_id");

-- CreateIndex
CREATE INDEX "ix_document_links_workspace_id_organisation_id" ON "evidence_document_links"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_document_links_created_by_user_id" ON "evidence_document_links"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_document_links_id_organisation" ON "evidence_document_links"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_document_versions_organisation_status" ON "evidence_document_versions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_document_versions_organisation_id" ON "evidence_document_versions"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_document_versions_document_id" ON "evidence_document_versions"("document_id");

-- CreateIndex
CREATE INDEX "ix_document_versions_uploaded_by_user_id" ON "evidence_document_versions"("uploaded_by_user_id");

-- CreateIndex
CREATE INDEX "ix_document_versions_workspace_id_organisation_id" ON "evidence_document_versions"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_document_versions_created_by_user_id" ON "evidence_document_versions"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_document_versions_id_organisation" ON "evidence_document_versions"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_documents_organisation_status" ON "evidence_documents"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_documents_organisation_id" ON "evidence_documents"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_documents_uploaded_by_user_id" ON "evidence_documents"("uploaded_by_user_id");

-- CreateIndex
CREATE INDEX "ix_documents_workspace_id_organisation_id" ON "evidence_documents"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_documents_created_by_user_id" ON "evidence_documents"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_documents_id_organisation" ON "evidence_documents"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_gps_organisation_status" ON "evidence_evidence_gps"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_gps_organisation_id" ON "evidence_evidence_gps"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_gps_evidence_item_id_organisation_id" ON "evidence_evidence_gps"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_gps_workspace_id_organisation_id" ON "evidence_evidence_gps"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_gps_created_by_user_id" ON "evidence_evidence_gps"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_gps_id_organisation" ON "evidence_evidence_gps"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "evidence_items_project_created_idx" ON "evidence_evidence_items"("organisation_id", "project_id", "created_at");

-- CreateIndex
CREATE INDEX "evidence_items_hash_idx" ON "evidence_evidence_items"("organisation_id", "content_sha256");

-- CreateIndex
CREATE INDEX "evidence_items_retention_idx" ON "evidence_evidence_items"("organisation_id", "retention_until");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_items_id_organisation_unique" ON "evidence_evidence_items"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_links_organisation_status" ON "evidence_evidence_links"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_links_organisation_id" ON "evidence_evidence_links"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_links_evidence_item_id_organisation_id" ON "evidence_evidence_links"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_links_created_by_user_id" ON "evidence_evidence_links"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_evidence_links_workspace_id_organisation_id" ON "evidence_evidence_links"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_links_id_organisation" ON "evidence_evidence_links"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_media_organisation_status" ON "evidence_evidence_media"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_media_organisation_id" ON "evidence_evidence_media"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_media_evidence_item_id_organisation_id" ON "evidence_evidence_media"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_media_document_version_id_organisation_id" ON "evidence_evidence_media"("document_version_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_media_workspace_id_organisation_id" ON "evidence_evidence_media"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_media_created_by_user_id" ON "evidence_evidence_media"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_media_id_organisation" ON "evidence_evidence_media"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_metadata_organisation_status" ON "evidence_evidence_metadata"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_metadata_organisation_id" ON "evidence_evidence_metadata"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_metadata_evidence_item_id_organisation_id" ON "evidence_evidence_metadata"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_metadata_workspace_id_organisation_id" ON "evidence_evidence_metadata"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_metadata_created_by_user_id" ON "evidence_evidence_metadata"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_metadata_id_organisation" ON "evidence_evidence_metadata"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timeline_events_organisation_status" ON "evidence_evidence_timeline_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_timeline_events_organisation_id" ON "evidence_evidence_timeline_events"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timeline_events_evidence_item_id_organisation_id" ON "evidence_evidence_timeline_events"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timeline_events_actor_user_id" ON "evidence_evidence_timeline_events"("actor_user_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timeline_events_workspace_id_organisation_id" ON "evidence_evidence_timeline_events"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timeline_events_created_by_user_id" ON "evidence_evidence_timeline_events"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_timeline_events_id_organisation" ON "evidence_evidence_timeline_events"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timestamps_organisation_status" ON "evidence_evidence_timestamps"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_timestamps_organisation_id" ON "evidence_evidence_timestamps"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timestamps_evidence_item_id_organisation_id" ON "evidence_evidence_timestamps"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timestamps_workspace_id_organisation_id" ON "evidence_evidence_timestamps"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_timestamps_created_by_user_id" ON "evidence_evidence_timestamps"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_timestamps_id_organisation" ON "evidence_evidence_timestamps"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_verifications_organisation_status" ON "evidence_evidence_verifications"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_evidence_verifications_organisation_id" ON "evidence_evidence_verifications"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_verifications_evidence_item_id_organisation_id" ON "evidence_evidence_verifications"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_verifications_verified_by_user_id" ON "evidence_evidence_verifications"("verified_by_user_id");

-- CreateIndex
CREATE INDEX "ix_evidence_verifications_workspace_id_organisation_id" ON "evidence_evidence_verifications"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_evidence_verifications_created_by_user_id" ON "evidence_evidence_verifications"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_evidence_verifications_id_organisation" ON "evidence_evidence_verifications"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_legal_holds_organisation_status" ON "evidence_legal_holds"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_legal_holds_organisation_id" ON "evidence_legal_holds"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_legal_holds_document_id_organisation_id" ON "evidence_legal_holds"("document_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_legal_holds_evidence_item_id_organisation_id" ON "evidence_legal_holds"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_legal_holds_authorised_by_user_id" ON "evidence_legal_holds"("authorised_by_user_id");

-- CreateIndex
CREATE INDEX "ix_legal_holds_workspace_id_organisation_id" ON "evidence_legal_holds"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_legal_holds_created_by_user_id" ON "evidence_legal_holds"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_legal_holds_id_organisation" ON "evidence_legal_holds"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_risk_mitigations_organisation_status" ON "evidence_risk_mitigations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_risk_mitigations_organisation_id" ON "evidence_risk_mitigations"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_risk_mitigations_risk_id" ON "evidence_risk_mitigations"("risk_id");

-- CreateIndex
CREATE INDEX "ix_risk_mitigations_owner_user_id" ON "evidence_risk_mitigations"("owner_user_id");

-- CreateIndex
CREATE INDEX "ix_risk_mitigations_workspace_id_organisation_id" ON "evidence_risk_mitigations"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_risk_mitigations_created_by_user_id" ON "evidence_risk_mitigations"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_risk_mitigations_id_organisation" ON "evidence_risk_mitigations"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_risks_organisation_status" ON "evidence_risks"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_risks_organisation_id" ON "evidence_risks"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_risks_project_id_organisation_id" ON "evidence_risks"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_risks_owner_user_id" ON "evidence_risks"("owner_user_id");

-- CreateIndex
CREATE INDEX "ix_risks_workspace_id_organisation_id" ON "evidence_risks"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_risks_created_by_user_id" ON "evidence_risks"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_risks_id_organisation" ON "evidence_risks"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_trusted_timestamps_organisation_status" ON "evidence_trusted_timestamps"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_trusted_timestamps_organisation_id" ON "evidence_trusted_timestamps"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_trusted_timestamps_evidence_item_id_organisation_id" ON "evidence_trusted_timestamps"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_trusted_timestamps_workspace_id_organisation_id" ON "evidence_trusted_timestamps"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_trusted_timestamps_created_by_user_id" ON "evidence_trusted_timestamps"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_trusted_timestamps_id_organisation" ON "evidence_trusted_timestamps"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "budget_categories_organisation_status_idx" ON "finance_budget_categories"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "budget_categories_workspace_status_idx" ON "finance_budget_categories"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "budget_categories_created_idx" ON "finance_budget_categories"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "budget_categories_id_organisation_uq" ON "finance_budget_categories"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_categories_id_workspace_organisation_uq" ON "finance_budget_categories"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "budget_lines_organisation_status_idx" ON "finance_budget_lines"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "budget_lines_workspace_status_idx" ON "finance_budget_lines"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "budget_lines_created_idx" ON "finance_budget_lines"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "budget_lines_id_organisation_uq" ON "finance_budget_lines"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_lines_id_workspace_organisation_uq" ON "finance_budget_lines"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_lines_budget_id_line_number_uq" ON "finance_budget_lines"("budget_id", "line_number");

-- CreateIndex
CREATE INDEX "budgets_organisation_status_idx" ON "finance_budgets"("organisation_id", "budget_status");

-- CreateIndex
CREATE INDEX "budgets_workspace_status_idx" ON "finance_budgets"("workspace_id", "budget_status");

-- CreateIndex
CREATE INDEX "budgets_created_idx" ON "finance_budgets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_id_organisation_uq" ON "finance_budgets"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_id_workspace_organisation_uq" ON "finance_budgets"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_project_id_fiscal_period_name_uq" ON "finance_budgets"("project_id", "fiscal_period", "name");

-- CreateIndex
CREATE INDEX "cashflow_entries_organisation_status_idx" ON "finance_cashflow_entries"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "cashflow_entries_workspace_status_idx" ON "finance_cashflow_entries"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "cashflow_entries_created_idx" ON "finance_cashflow_entries"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cashflow_entries_id_organisation_uq" ON "finance_cashflow_entries"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "cashflow_entries_id_workspace_organisation_uq" ON "finance_cashflow_entries"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "commitments_organisation_status_idx" ON "finance_commitments"("organisation_id", "commitment_status");

-- CreateIndex
CREATE INDEX "commitments_workspace_status_idx" ON "finance_commitments"("workspace_id", "commitment_status");

-- CreateIndex
CREATE INDEX "commitments_created_idx" ON "finance_commitments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "commitments_id_organisation_uq" ON "finance_commitments"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "commitments_id_workspace_organisation_uq" ON "finance_commitments"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "cost_sheet_lines_organisation_status_idx" ON "finance_cost_sheet_lines"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "cost_sheet_lines_workspace_status_idx" ON "finance_cost_sheet_lines"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "cost_sheet_lines_created_idx" ON "finance_cost_sheet_lines"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cost_sheet_lines_id_organisation_uq" ON "finance_cost_sheet_lines"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_sheet_lines_id_workspace_organisation_uq" ON "finance_cost_sheet_lines"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_sheet_lines_cost_sheet_id_line_number_uq" ON "finance_cost_sheet_lines"("cost_sheet_id", "line_number");

-- CreateIndex
CREATE INDEX "cost_sheets_organisation_status_idx" ON "finance_cost_sheets"("organisation_id", "sheet_status");

-- CreateIndex
CREATE INDEX "cost_sheets_workspace_status_idx" ON "finance_cost_sheets"("workspace_id", "sheet_status");

-- CreateIndex
CREATE INDEX "cost_sheets_created_idx" ON "finance_cost_sheets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cost_sheets_id_organisation_uq" ON "finance_cost_sheets"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_sheets_id_workspace_organisation_uq" ON "finance_cost_sheets"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "currencies_created_idx" ON "finance_currencies"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_uq" ON "finance_currencies"("code");

-- CreateIndex
CREATE INDEX "estimate_lines_organisation_status_idx" ON "finance_estimate_lines"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "estimate_lines_workspace_status_idx" ON "finance_estimate_lines"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "estimate_lines_created_idx" ON "finance_estimate_lines"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "estimate_lines_id_organisation_uq" ON "finance_estimate_lines"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimate_lines_id_workspace_organisation_uq" ON "finance_estimate_lines"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimate_lines_estimate_id_line_number_uq" ON "finance_estimate_lines"("estimate_id", "line_number");

-- CreateIndex
CREATE INDEX "estimates_organisation_status_idx" ON "finance_estimates"("organisation_id", "estimate_status");

-- CreateIndex
CREATE INDEX "estimates_workspace_status_idx" ON "finance_estimates"("workspace_id", "estimate_status");

-- CreateIndex
CREATE INDEX "estimates_created_idx" ON "finance_estimates"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "estimates_id_organisation_uq" ON "finance_estimates"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimates_id_workspace_organisation_uq" ON "finance_estimates"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "exchange_rates_created_idx" ON "finance_exchange_rates"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_base_currency_quote_currency_effective_at_uq" ON "finance_exchange_rates"("base_currency", "quote_currency", "effective_at");

-- CreateIndex
CREATE INDEX "expense_approvals_organisation_status_idx" ON "finance_expense_approvals"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "expense_approvals_workspace_status_idx" ON "finance_expense_approvals"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "expense_approvals_created_idx" ON "finance_expense_approvals"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "expense_approvals_id_organisation_uq" ON "finance_expense_approvals"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "expense_approvals_id_workspace_organisation_uq" ON "finance_expense_approvals"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "expense_lines_organisation_status_idx" ON "finance_expense_lines"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "expense_lines_workspace_status_idx" ON "finance_expense_lines"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "expense_lines_created_idx" ON "finance_expense_lines"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "expense_lines_id_organisation_uq" ON "finance_expense_lines"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "expense_lines_id_workspace_organisation_uq" ON "finance_expense_lines"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "expense_lines_expense_id_line_number_uq" ON "finance_expense_lines"("expense_id", "line_number");

-- CreateIndex
CREATE INDEX "expenses_organisation_status_idx" ON "finance_expenses"("organisation_id", "expense_status");

-- CreateIndex
CREATE INDEX "expenses_workspace_status_idx" ON "finance_expenses"("workspace_id", "expense_status");

-- CreateIndex
CREATE INDEX "expenses_created_idx" ON "finance_expenses"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_id_organisation_uq" ON "finance_expenses"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_id_workspace_organisation_uq" ON "finance_expenses"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "invoice_approvals_organisation_status_idx" ON "finance_invoice_approvals"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "invoice_approvals_workspace_status_idx" ON "finance_invoice_approvals"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "invoice_approvals_created_idx" ON "finance_invoice_approvals"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_approvals_id_organisation_uq" ON "finance_invoice_approvals"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_approvals_id_workspace_organisation_uq" ON "finance_invoice_approvals"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "invoice_lines_organisation_status_idx" ON "finance_invoice_lines"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "invoice_lines_workspace_status_idx" ON "finance_invoice_lines"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "invoice_lines_created_idx" ON "finance_invoice_lines"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_lines_id_organisation_uq" ON "finance_invoice_lines"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_lines_id_workspace_organisation_uq" ON "finance_invoice_lines"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_lines_invoice_id_line_number_uq" ON "finance_invoice_lines"("invoice_id", "line_number");

-- CreateIndex
CREATE INDEX "payment_allocations_organisation_status_idx" ON "finance_payment_allocations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "payment_allocations_workspace_status_idx" ON "finance_payment_allocations"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "payment_allocations_created_idx" ON "finance_payment_allocations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payment_allocations_id_organisation_uq" ON "finance_payment_allocations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_allocations_id_workspace_organisation_uq" ON "finance_payment_allocations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "payment_verifications_organisation_status_idx" ON "finance_payment_verifications"("organisation_id", "verification_status");

-- CreateIndex
CREATE INDEX "payment_verifications_workspace_status_idx" ON "finance_payment_verifications"("workspace_id", "verification_status");

-- CreateIndex
CREATE INDEX "payment_verifications_created_idx" ON "finance_payment_verifications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payment_verifications_id_organisation_uq" ON "finance_payment_verifications"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_verifications_id_workspace_organisation_uq" ON "finance_payment_verifications"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "payments_organisation_status_idx" ON "finance_payments"("organisation_id", "payment_status");

-- CreateIndex
CREATE INDEX "payments_workspace_status_idx" ON "finance_payments"("workspace_id", "payment_status");

-- CreateIndex
CREATE INDEX "payments_created_idx" ON "finance_payments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_organisation_uq" ON "finance_payments"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_workspace_organisation_uq" ON "finance_payments"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "profitability_snapshots_organisation_status_idx" ON "finance_profitability_snapshots"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "profitability_snapshots_workspace_status_idx" ON "finance_profitability_snapshots"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "profitability_snapshots_created_idx" ON "finance_profitability_snapshots"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "profitability_snapshots_id_organisation_uq" ON "finance_profitability_snapshots"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "profitability_snapshots_id_workspace_organisation_uq" ON "finance_profitability_snapshots"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "tax_codes_created_idx" ON "finance_tax_codes"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tax_codes_country_code_code_effective_from_uq" ON "finance_tax_codes"("country_code", "code", "effective_from");

-- CreateIndex
CREATE INDEX "vendor_invoices_organisation_status_idx" ON "finance_vendor_invoices"("organisation_id", "invoice_status");

-- CreateIndex
CREATE INDEX "vendor_invoices_workspace_status_idx" ON "finance_vendor_invoices"("workspace_id", "invoice_status");

-- CreateIndex
CREATE INDEX "vendor_invoices_created_idx" ON "finance_vendor_invoices"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_invoices_id_organisation_uq" ON "finance_vendor_invoices"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_invoices_id_workspace_organisation_uq" ON "finance_vendor_invoices"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_access_policies_principal_resource_action" ON "identity_access_policies"("principal_kind", "resource_pattern", "action");

-- CreateIndex
CREATE UNIQUE INDEX "uq_access_policies_policy_key" ON "identity_access_policies"("policy_key");

-- CreateIndex
CREATE INDEX "ix_access_reviews_subject_user_id" ON "identity_access_reviews"("subject_user_id");

-- CreateIndex
CREATE INDEX "ix_access_reviews_reviewer_user_id" ON "identity_access_reviews"("reviewer_user_id");

-- CreateIndex
CREATE INDEX "ix_auth_accounts_user_id" ON "identity_auth_accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_auth_accounts_provider_provider_subject" ON "identity_auth_accounts"("provider", "provider_subject");

-- CreateIndex
CREATE INDEX "ix_auth_challenges_user_id" ON "identity_auth_challenges"("user_id");

-- CreateIndex
CREATE INDEX "ix_auth_challenges_expiry" ON "identity_auth_challenges"("expires_at");

-- CreateIndex
CREATE INDEX "ix_auth_credentials_user_id" ON "identity_auth_credentials"("user_id");

-- CreateIndex
CREATE INDEX "ix_delegations_delegator_user_id" ON "identity_delegations"("delegator_user_id");

-- CreateIndex
CREATE INDEX "ix_delegations_delegate_user_id" ON "identity_delegations"("delegate_user_id");

-- CreateIndex
CREATE INDEX "ix_delegations_approved_by_user_id" ON "identity_delegations"("approved_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_delegations_delegator_user_id_delegate_user_id_starts_at" ON "identity_delegations"("delegator_user_id", "delegate_user_id", "starts_at");

-- CreateIndex
CREATE INDEX "ix_device_verifications_device_id" ON "identity_device_verifications"("device_id");

-- CreateIndex
CREATE INDEX "ix_device_verifications_user_id" ON "identity_device_verifications"("user_id");

-- CreateIndex
CREATE INDEX "ix_devices_user_id" ON "identity_devices"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_devices_user_id_device_fingerprint" ON "identity_devices"("user_id", "device_fingerprint");

-- CreateIndex
CREATE INDEX "ix_invitations_organisation_status" ON "identity_invitations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_invitations_organisation_id" ON "identity_invitations"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_invitations_workspace_id_organisation_id" ON "identity_invitations"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_invitations_invited_by_user_id" ON "identity_invitations"("invited_by_user_id");

-- CreateIndex
CREATE INDEX "ix_invitations_accepted_by_user_id" ON "identity_invitations"("accepted_by_user_id");

-- CreateIndex
CREATE INDEX "ix_invitations_created_by_user_id" ON "identity_invitations"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_invitations_email_status" ON "identity_invitations"("email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_invitations_id_organisation" ON "identity_invitations"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_location_verifications_user_id" ON "identity_location_verifications"("user_id");

-- CreateIndex
CREATE INDEX "ix_location_verifications_verified_by_user_id" ON "identity_location_verifications"("verified_by_user_id");

-- CreateIndex
CREATE INDEX "ix_nda_acceptances_user_id" ON "identity_nda_acceptances"("user_id");

-- CreateIndex
CREATE INDEX "ix_nda_acceptances_nda_version_id" ON "identity_nda_acceptances"("nda_version_id");

-- CreateIndex
CREATE INDEX "ix_nda_acceptances_signature_id" ON "identity_nda_acceptances"("signature_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_nda_acceptances_user_id_nda_version_id" ON "identity_nda_acceptances"("user_id", "nda_version_id");

-- CreateIndex
CREATE INDEX "ix_nda_versions_nda_id" ON "identity_nda_versions"("nda_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_nda_versions_nda_id_version_number" ON "identity_nda_versions"("nda_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ndas_code" ON "identity_ndas"("code");

-- CreateIndex
CREATE INDEX "ix_otp_challenges_user_id" ON "identity_otp_challenges"("user_id");

-- CreateIndex
CREATE INDEX "ix_otp_destination_expiry" ON "identity_otp_challenges"("destination", "expires_at");

-- CreateIndex
CREATE INDEX "ix_password_reset_tokens_user_id" ON "identity_password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "ix_password_reset_expiry" ON "identity_password_reset_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_permissions_code" ON "identity_permissions"("code");

-- CreateIndex
CREATE INDEX "ix_role_permissions_role_id" ON "identity_role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "ix_role_permissions_permission_id" ON "identity_role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "ix_role_permissions_granted_by_user_id" ON "identity_role_permissions"("granted_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_role_permissions_role_id_permission_id" ON "identity_role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_roles_code" ON "identity_roles"("code");

-- CreateIndex
CREATE INDEX "ix_signatures_user_id" ON "identity_signatures"("user_id");

-- CreateIndex
CREATE INDEX "ix_user_emails_user_id" ON "identity_user_emails"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_emails_email" ON "identity_user_emails"("email");

-- CreateIndex
CREATE INDEX "ix_user_phones_user_id" ON "identity_user_phones"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_phones_phone_e164" ON "identity_user_phones"("phone_e164");

-- CreateIndex
CREATE INDEX "user_profiles_display_name_idx" ON "identity_user_profiles"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_unique" ON "identity_user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "ix_user_roles_user_id" ON "identity_user_roles"("user_id");

-- CreateIndex
CREATE INDEX "ix_user_roles_role_id" ON "identity_user_roles"("role_id");

-- CreateIndex
CREATE INDEX "ix_user_roles_assigned_by_user_id" ON "identity_user_roles"("assigned_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_roles_user_id_role_id" ON "identity_user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "user_sessions_user_expiry_idx" ON "identity_user_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "user_sessions_expiry_idx" ON "identity_user_sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_hash_unique" ON "identity_user_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "identity_users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "identity_users"("email");

-- CreateIndex
CREATE INDEX "ai_citations_organisation_status_idx" ON "intelligence_ai_citations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ai_citations_workspace_status_idx" ON "intelligence_ai_citations"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "ai_citations_created_idx" ON "intelligence_ai_citations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_citations_id_organisation_uq" ON "intelligence_ai_citations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_citations_id_workspace_organisation_uq" ON "intelligence_ai_citations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_citations_message_id_citation_index_uq" ON "intelligence_ai_citations"("message_id", "citation_index");

-- CreateIndex
CREATE INDEX "ai_contexts_organisation_status_idx" ON "intelligence_ai_contexts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ai_contexts_workspace_status_idx" ON "intelligence_ai_contexts"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "ai_contexts_created_idx" ON "intelligence_ai_contexts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_contexts_id_organisation_uq" ON "intelligence_ai_contexts"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_contexts_id_workspace_organisation_uq" ON "intelligence_ai_contexts"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ai_conversations_organisation_status_idx" ON "intelligence_ai_conversations"("organisation_id", "conversation_status");

-- CreateIndex
CREATE INDEX "ai_conversations_workspace_status_idx" ON "intelligence_ai_conversations"("workspace_id", "conversation_status");

-- CreateIndex
CREATE INDEX "ai_conversations_created_idx" ON "intelligence_ai_conversations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_conversations_id_organisation_uq" ON "intelligence_ai_conversations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_conversations_id_workspace_organisation_uq" ON "intelligence_ai_conversations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ai_messages_organisation_status_idx" ON "intelligence_ai_messages"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ai_messages_workspace_status_idx" ON "intelligence_ai_messages"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "ai_messages_created_idx" ON "intelligence_ai_messages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_messages_id_organisation_uq" ON "intelligence_ai_messages"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_messages_id_workspace_organisation_uq" ON "intelligence_ai_messages"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_messages_conversation_id_sequence_uq" ON "intelligence_ai_messages"("conversation_id", "sequence");

-- CreateIndex
CREATE INDEX "ai_suggestions_organisation_status_idx" ON "intelligence_ai_suggestions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ai_suggestions_workspace_status_idx" ON "intelligence_ai_suggestions"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "ai_suggestions_created_idx" ON "intelligence_ai_suggestions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_suggestions_id_organisation_uq" ON "intelligence_ai_suggestions"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_suggestions_id_workspace_organisation_uq" ON "intelligence_ai_suggestions"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "analytics_events_organisation_status_idx" ON "intelligence_analytics_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "analytics_events_workspace_status_idx" ON "intelligence_analytics_events"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "analytics_events_created_idx" ON "intelligence_analytics_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_events_id_organisation_uq" ON "intelligence_analytics_events"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_events_id_workspace_organisation_uq" ON "intelligence_analytics_events"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "evidence_aware_answers_organisation_status_idx" ON "intelligence_evidence_aware_answers"("organisation_id", "grounding_status");

-- CreateIndex
CREATE INDEX "evidence_aware_answers_workspace_status_idx" ON "intelligence_evidence_aware_answers"("workspace_id", "grounding_status");

-- CreateIndex
CREATE INDEX "evidence_aware_answers_created_idx" ON "intelligence_evidence_aware_answers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_aware_answers_id_organisation_uq" ON "intelligence_evidence_aware_answers"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_aware_answers_id_workspace_organisation_uq" ON "intelligence_evidence_aware_answers"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "forecast_runs_organisation_status_idx" ON "intelligence_forecast_runs"("organisation_id", "run_status");

-- CreateIndex
CREATE INDEX "forecast_runs_workspace_status_idx" ON "intelligence_forecast_runs"("workspace_id", "run_status");

-- CreateIndex
CREATE INDEX "forecast_runs_created_idx" ON "intelligence_forecast_runs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_runs_id_organisation_uq" ON "intelligence_forecast_runs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_runs_id_workspace_organisation_uq" ON "intelligence_forecast_runs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "forecast_scenarios_organisation_status_idx" ON "intelligence_forecast_scenarios"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "forecast_scenarios_workspace_status_idx" ON "intelligence_forecast_scenarios"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "forecast_scenarios_created_idx" ON "intelligence_forecast_scenarios"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_scenarios_id_organisation_uq" ON "intelligence_forecast_scenarios"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_scenarios_id_workspace_organisation_uq" ON "intelligence_forecast_scenarios"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_scenarios_forecast_run_id_name_uq" ON "intelligence_forecast_scenarios"("forecast_run_id", "name");

-- CreateIndex
CREATE INDEX "generation_jobs_organisation_status_idx" ON "intelligence_generation_jobs"("organisation_id", "job_status");

-- CreateIndex
CREATE INDEX "generation_jobs_workspace_status_idx" ON "intelligence_generation_jobs"("workspace_id", "job_status");

-- CreateIndex
CREATE INDEX "generation_jobs_created_idx" ON "intelligence_generation_jobs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "generation_jobs_id_organisation_uq" ON "intelligence_generation_jobs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "generation_jobs_id_workspace_organisation_uq" ON "intelligence_generation_jobs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "intelligence_runs_organisation_status_idx" ON "intelligence_intelligence_runs"("organisation_id", "run_status");

-- CreateIndex
CREATE INDEX "intelligence_runs_workspace_status_idx" ON "intelligence_intelligence_runs"("workspace_id", "run_status");

-- CreateIndex
CREATE INDEX "intelligence_runs_created_idx" ON "intelligence_intelligence_runs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "intelligence_runs_id_organisation_uq" ON "intelligence_intelligence_runs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "intelligence_runs_id_workspace_organisation_uq" ON "intelligence_intelligence_runs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "intelligence_signals_organisation_status_idx" ON "intelligence_intelligence_signals"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "intelligence_signals_workspace_status_idx" ON "intelligence_intelligence_signals"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "intelligence_signals_created_idx" ON "intelligence_intelligence_signals"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "intelligence_signals_id_organisation_uq" ON "intelligence_intelligence_signals"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "intelligence_signals_id_workspace_organisation_uq" ON "intelligence_intelligence_signals"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "knowledge_chunks_organisation_status_idx" ON "intelligence_knowledge_chunks"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "knowledge_chunks_workspace_status_idx" ON "intelligence_knowledge_chunks"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "knowledge_chunks_created_idx" ON "intelligence_knowledge_chunks"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_chunks_id_organisation_uq" ON "intelligence_knowledge_chunks"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_chunks_id_workspace_organisation_uq" ON "intelligence_knowledge_chunks"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_chunks_document_id_chunk_index_uq" ON "intelligence_knowledge_chunks"("document_id", "chunk_index");

-- CreateIndex
CREATE INDEX "knowledge_documents_organisation_status_idx" ON "intelligence_knowledge_documents"("organisation_id", "document_status");

-- CreateIndex
CREATE INDEX "knowledge_documents_workspace_status_idx" ON "intelligence_knowledge_documents"("workspace_id", "document_status");

-- CreateIndex
CREATE INDEX "knowledge_documents_created_idx" ON "intelligence_knowledge_documents"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_documents_id_organisation_uq" ON "intelligence_knowledge_documents"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_documents_id_workspace_organisation_uq" ON "intelligence_knowledge_documents"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "kpi_definitions_created_idx" ON "intelligence_kpi_definitions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_definitions_metric_key_uq" ON "intelligence_kpi_definitions"("metric_key");

-- CreateIndex
CREATE INDEX "kpi_measurements_organisation_status_idx" ON "intelligence_kpi_measurements"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "kpi_measurements_workspace_status_idx" ON "intelligence_kpi_measurements"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "kpi_measurements_created_idx" ON "intelligence_kpi_measurements"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_measurements_id_organisation_uq" ON "intelligence_kpi_measurements"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_measurements_id_workspace_organisation_uq" ON "intelligence_kpi_measurements"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "model_registry_created_idx" ON "intelligence_model_registry"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "model_registry_provider_model_name_uq" ON "intelligence_model_registry"("provider", "model_name");

-- CreateIndex
CREATE INDEX "model_runs_organisation_status_idx" ON "intelligence_model_runs"("organisation_id", "run_status");

-- CreateIndex
CREATE INDEX "model_runs_workspace_status_idx" ON "intelligence_model_runs"("workspace_id", "run_status");

-- CreateIndex
CREATE INDEX "model_runs_created_idx" ON "intelligence_model_runs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "model_runs_id_organisation_uq" ON "intelligence_model_runs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_runs_id_workspace_organisation_uq" ON "intelligence_model_runs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "prompt_templates_created_idx" ON "intelligence_prompt_templates"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_templates_template_key_version_number_uq" ON "intelligence_prompt_templates"("template_key", "version_number");

-- CreateIndex
CREATE INDEX "research_sessions_organisation_status_idx" ON "intelligence_research_sessions"("organisation_id", "session_status");

-- CreateIndex
CREATE INDEX "research_sessions_workspace_status_idx" ON "intelligence_research_sessions"("workspace_id", "session_status");

-- CreateIndex
CREATE INDEX "research_sessions_created_idx" ON "intelligence_research_sessions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "research_sessions_id_organisation_uq" ON "intelligence_research_sessions"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "research_sessions_id_workspace_organisation_uq" ON "intelligence_research_sessions"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "research_sources_organisation_status_idx" ON "intelligence_research_sources"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "research_sources_workspace_status_idx" ON "intelligence_research_sources"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "research_sources_created_idx" ON "intelligence_research_sources"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "research_sources_id_organisation_uq" ON "intelligence_research_sources"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "research_sources_id_workspace_organisation_uq" ON "intelligence_research_sources"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "saved_insights_organisation_status_idx" ON "intelligence_saved_insights"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "saved_insights_workspace_status_idx" ON "intelligence_saved_insights"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "saved_insights_created_idx" ON "intelligence_saved_insights"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "saved_insights_id_organisation_uq" ON "intelligence_saved_insights"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_insights_id_workspace_organisation_uq" ON "intelligence_saved_insights"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "deal_room_members_organisation_status_idx" ON "investor_deal_room_members"("organisation_id", "access_status");

-- CreateIndex
CREATE INDEX "deal_room_members_workspace_status_idx" ON "investor_deal_room_members"("workspace_id", "access_status");

-- CreateIndex
CREATE INDEX "deal_room_members_created_idx" ON "investor_deal_room_members"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "deal_room_members_id_organisation_uq" ON "investor_deal_room_members"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_room_members_id_workspace_organisation_uq" ON "investor_deal_room_members"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_room_members_deal_room_id_user_id_uq" ON "investor_deal_room_members"("deal_room_id", "user_id");

-- CreateIndex
CREATE INDEX "deal_rooms_organisation_status_idx" ON "investor_deal_rooms"("organisation_id", "room_status");

-- CreateIndex
CREATE INDEX "deal_rooms_workspace_status_idx" ON "investor_deal_rooms"("workspace_id", "room_status");

-- CreateIndex
CREATE INDEX "deal_rooms_created_idx" ON "investor_deal_rooms"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "deal_rooms_id_organisation_uq" ON "investor_deal_rooms"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_rooms_id_workspace_organisation_uq" ON "investor_deal_rooms"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "disclosures_organisation_status_idx" ON "investor_disclosures"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "disclosures_workspace_status_idx" ON "investor_disclosures"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "disclosures_created_idx" ON "investor_disclosures"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "disclosures_id_organisation_uq" ON "investor_disclosures"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "disclosures_id_workspace_organisation_uq" ON "investor_disclosures"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "distribution_channels_organisation_status_idx" ON "investor_distribution_channels"("organisation_id", "channel_status");

-- CreateIndex
CREATE INDEX "distribution_channels_workspace_status_idx" ON "investor_distribution_channels"("workspace_id", "channel_status");

-- CreateIndex
CREATE INDEX "distribution_channels_created_idx" ON "investor_distribution_channels"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_channels_id_organisation_uq" ON "investor_distribution_channels"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_channels_id_workspace_organisation_uq" ON "investor_distribution_channels"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "distribution_deals_organisation_status_idx" ON "investor_distribution_deals"("organisation_id", "deal_status");

-- CreateIndex
CREATE INDEX "distribution_deals_workspace_status_idx" ON "investor_distribution_deals"("workspace_id", "deal_status");

-- CreateIndex
CREATE INDEX "distribution_deals_created_idx" ON "investor_distribution_deals"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_deals_id_organisation_uq" ON "investor_distribution_deals"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_deals_id_workspace_organisation_uq" ON "investor_distribution_deals"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "due_diligence_items_organisation_status_idx" ON "investor_due_diligence_items"("organisation_id", "item_status");

-- CreateIndex
CREATE INDEX "due_diligence_items_workspace_status_idx" ON "investor_due_diligence_items"("workspace_id", "item_status");

-- CreateIndex
CREATE INDEX "due_diligence_items_created_idx" ON "investor_due_diligence_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "due_diligence_items_id_organisation_uq" ON "investor_due_diligence_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "due_diligence_items_id_workspace_organisation_uq" ON "investor_due_diligence_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "funding_requirements_organisation_status_idx" ON "investor_funding_requirements"("organisation_id", "requirement_status");

-- CreateIndex
CREATE INDEX "funding_requirements_workspace_status_idx" ON "investor_funding_requirements"("workspace_id", "requirement_status");

-- CreateIndex
CREATE INDEX "funding_requirements_created_idx" ON "investor_funding_requirements"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "funding_requirements_id_organisation_uq" ON "investor_funding_requirements"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "funding_requirements_id_workspace_organisation_uq" ON "investor_funding_requirements"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investment_opportunities_organisation_status_idx" ON "investor_investment_opportunities"("organisation_id", "opportunity_status");

-- CreateIndex
CREATE INDEX "investment_opportunities_workspace_status_idx" ON "investor_investment_opportunities"("workspace_id", "opportunity_status");

-- CreateIndex
CREATE INDEX "investment_opportunities_created_idx" ON "investor_investment_opportunities"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investment_opportunities_id_organisation_uq" ON "investor_investment_opportunities"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investment_opportunities_id_workspace_organisation_uq" ON "investor_investment_opportunities"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investment_profiles_organisation_status_idx" ON "investor_investment_profiles"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "investment_profiles_workspace_status_idx" ON "investor_investment_profiles"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "investment_profiles_created_idx" ON "investor_investment_profiles"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investment_profiles_id_organisation_uq" ON "investor_investment_profiles"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investment_profiles_id_workspace_organisation_uq" ON "investor_investment_profiles"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investment_tranches_organisation_status_idx" ON "investor_investment_tranches"("organisation_id", "tranche_status");

-- CreateIndex
CREATE INDEX "investment_tranches_workspace_status_idx" ON "investor_investment_tranches"("workspace_id", "tranche_status");

-- CreateIndex
CREATE INDEX "investment_tranches_created_idx" ON "investor_investment_tranches"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investment_tranches_id_organisation_uq" ON "investor_investment_tranches"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investment_tranches_id_workspace_organisation_uq" ON "investor_investment_tranches"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investment_tranches_opportunity_id_tranche_number_uq" ON "investor_investment_tranches"("opportunity_id", "tranche_number");

-- CreateIndex
CREATE INDEX "investor_accounts_organisation_status_idx" ON "investor_investor_accounts"("organisation_id", "account_status");

-- CreateIndex
CREATE INDEX "investor_accounts_workspace_status_idx" ON "investor_investor_accounts"("workspace_id", "account_status");

-- CreateIndex
CREATE INDEX "investor_accounts_created_idx" ON "investor_investor_accounts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investor_accounts_id_organisation_uq" ON "investor_investor_accounts"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_accounts_id_workspace_organisation_uq" ON "investor_investor_accounts"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investor_commitments_organisation_status_idx" ON "investor_investor_commitments"("organisation_id", "commitment_status");

-- CreateIndex
CREATE INDEX "investor_commitments_workspace_status_idx" ON "investor_investor_commitments"("workspace_id", "commitment_status");

-- CreateIndex
CREATE INDEX "investor_commitments_created_idx" ON "investor_investor_commitments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investor_commitments_id_organisation_uq" ON "investor_investor_commitments"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_commitments_id_workspace_organisation_uq" ON "investor_investor_commitments"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investor_evidence_links_organisation_status_idx" ON "investor_investor_evidence_links"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "investor_evidence_links_workspace_status_idx" ON "investor_investor_evidence_links"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "investor_evidence_links_created_idx" ON "investor_investor_evidence_links"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investor_evidence_links_id_organisation_uq" ON "investor_investor_evidence_links"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_evidence_links_id_workspace_organisation_uq" ON "investor_investor_evidence_links"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investor_progress_reports_organisation_status_idx" ON "investor_investor_progress_reports"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "investor_progress_reports_workspace_status_idx" ON "investor_investor_progress_reports"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "investor_progress_reports_created_idx" ON "investor_investor_progress_reports"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investor_progress_reports_id_organisation_uq" ON "investor_investor_progress_reports"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_progress_reports_id_workspace_organisation_uq" ON "investor_investor_progress_reports"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "investor_returns_organisation_status_idx" ON "investor_investor_returns"("organisation_id", "return_status");

-- CreateIndex
CREATE INDEX "investor_returns_workspace_status_idx" ON "investor_investor_returns"("workspace_id", "return_status");

-- CreateIndex
CREATE INDEX "investor_returns_created_idx" ON "investor_investor_returns"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "investor_returns_id_organisation_uq" ON "investor_investor_returns"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_returns_id_workspace_organisation_uq" ON "investor_investor_returns"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "pitch_decks_organisation_status_idx" ON "investor_pitch_decks"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "pitch_decks_workspace_status_idx" ON "investor_pitch_decks"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "pitch_decks_created_idx" ON "investor_pitch_decks"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "pitch_decks_id_organisation_uq" ON "investor_pitch_decks"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "pitch_decks_id_workspace_organisation_uq" ON "investor_pitch_decks"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "recoupment_models_organisation_status_idx" ON "investor_recoupment_models"("organisation_id", "model_status");

-- CreateIndex
CREATE INDEX "recoupment_models_workspace_status_idx" ON "investor_recoupment_models"("workspace_id", "model_status");

-- CreateIndex
CREATE INDEX "recoupment_models_created_idx" ON "investor_recoupment_models"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "recoupment_models_id_organisation_uq" ON "investor_recoupment_models"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "recoupment_models_id_workspace_organisation_uq" ON "investor_recoupment_models"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "recoupment_tiers_organisation_status_idx" ON "investor_recoupment_tiers"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "recoupment_tiers_workspace_status_idx" ON "investor_recoupment_tiers"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "recoupment_tiers_created_idx" ON "investor_recoupment_tiers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "recoupment_tiers_id_organisation_uq" ON "investor_recoupment_tiers"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "recoupment_tiers_id_workspace_organisation_uq" ON "investor_recoupment_tiers"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "recoupment_tiers_recoupment_model_id_tier_number_uq" ON "investor_recoupment_tiers"("recoupment_model_id", "tier_number");

-- CreateIndex
CREATE INDEX "revenue_entries_organisation_status_idx" ON "investor_revenue_entries"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "revenue_entries_workspace_status_idx" ON "investor_revenue_entries"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "revenue_entries_created_idx" ON "investor_revenue_entries"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_entries_id_organisation_uq" ON "investor_revenue_entries"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_entries_id_workspace_organisation_uq" ON "investor_revenue_entries"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "rights_organisation_status_idx" ON "investor_rights"("organisation_id", "rights_status");

-- CreateIndex
CREATE INDEX "rights_workspace_status_idx" ON "investor_rights"("workspace_id", "rights_status");

-- CreateIndex
CREATE INDEX "rights_created_idx" ON "investor_rights"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "rights_id_organisation_uq" ON "investor_rights"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rights_id_workspace_organisation_uq" ON "investor_rights"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "rights_windows_organisation_status_idx" ON "investor_rights_windows"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "rights_windows_workspace_status_idx" ON "investor_rights_windows"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "rights_windows_created_idx" ON "investor_rights_windows"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "rights_windows_id_organisation_uq" ON "investor_rights_windows"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rights_windows_id_workspace_organisation_uq" ON "investor_rights_windows"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rights_windows_right_id_window_kind_starts_on_uq" ON "investor_rights_windows"("right_id", "window_kind", "starts_on");

-- CreateIndex
CREATE INDEX "accommodations_organisation_status_idx" ON "logistics_accommodations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "accommodations_workspace_status_idx" ON "logistics_accommodations"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "accommodations_created_idx" ON "logistics_accommodations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_id_organisation_uq" ON "logistics_accommodations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_id_workspace_organisation_uq" ON "logistics_accommodations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "drivers_organisation_status_idx" ON "logistics_drivers"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "drivers_workspace_status_idx" ON "logistics_drivers"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "drivers_created_idx" ON "logistics_drivers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_id_organisation_uq" ON "logistics_drivers"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_id_workspace_organisation_uq" ON "logistics_drivers"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "equipment_bookings_organisation_status_idx" ON "logistics_equipment_bookings"("organisation_id", "booking_status");

-- CreateIndex
CREATE INDEX "equipment_bookings_workspace_status_idx" ON "logistics_equipment_bookings"("workspace_id", "booking_status");

-- CreateIndex
CREATE INDEX "equipment_bookings_created_idx" ON "logistics_equipment_bookings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_bookings_id_organisation_uq" ON "logistics_equipment_bookings"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_bookings_id_workspace_organisation_uq" ON "logistics_equipment_bookings"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "equipment_categories_organisation_status_idx" ON "logistics_equipment_categories"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "equipment_categories_workspace_status_idx" ON "logistics_equipment_categories"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "equipment_categories_created_idx" ON "logistics_equipment_categories"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_categories_id_organisation_uq" ON "logistics_equipment_categories"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_categories_id_workspace_organisation_uq" ON "logistics_equipment_categories"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_categories_name_uq" ON "logistics_equipment_categories"("name");

-- CreateIndex
CREATE INDEX "equipment_checkouts_organisation_status_idx" ON "logistics_equipment_checkouts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "equipment_checkouts_workspace_status_idx" ON "logistics_equipment_checkouts"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "equipment_checkouts_created_idx" ON "logistics_equipment_checkouts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_checkouts_id_organisation_uq" ON "logistics_equipment_checkouts"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_checkouts_id_workspace_organisation_uq" ON "logistics_equipment_checkouts"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "equipment_inventory_events_organisation_status_idx" ON "logistics_equipment_inventory_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "equipment_inventory_events_workspace_status_idx" ON "logistics_equipment_inventory_events"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "equipment_inventory_events_created_idx" ON "logistics_equipment_inventory_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_inventory_events_id_organisation_uq" ON "logistics_equipment_inventory_events"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_inventory_events_id_workspace_organisation_uq" ON "logistics_equipment_inventory_events"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_inventory_events_equipment_item_id_sequence_uq" ON "logistics_equipment_inventory_events"("equipment_item_id", "sequence");

-- CreateIndex
CREATE INDEX "equipment_items_organisation_status_idx" ON "logistics_equipment_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "equipment_items_workspace_status_idx" ON "logistics_equipment_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "equipment_items_created_idx" ON "logistics_equipment_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_items_id_organisation_uq" ON "logistics_equipment_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_items_id_workspace_organisation_uq" ON "logistics_equipment_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_items_asset_tag_uq" ON "logistics_equipment_items"("asset_tag");

-- CreateIndex
CREATE INDEX "equipment_kits_organisation_status_idx" ON "logistics_equipment_kits"("organisation_id", "kit_status");

-- CreateIndex
CREATE INDEX "equipment_kits_workspace_status_idx" ON "logistics_equipment_kits"("workspace_id", "kit_status");

-- CreateIndex
CREATE INDEX "equipment_kits_created_idx" ON "logistics_equipment_kits"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_kits_id_organisation_uq" ON "logistics_equipment_kits"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_kits_id_workspace_organisation_uq" ON "logistics_equipment_kits"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_kits_kit_code_uq" ON "logistics_equipment_kits"("kit_code");

-- CreateIndex
CREATE INDEX "equipment_maintenance_organisation_status_idx" ON "logistics_equipment_maintenance"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "equipment_maintenance_workspace_status_idx" ON "logistics_equipment_maintenance"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "equipment_maintenance_created_idx" ON "logistics_equipment_maintenance"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_maintenance_id_organisation_uq" ON "logistics_equipment_maintenance"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_maintenance_id_workspace_organisation_uq" ON "logistics_equipment_maintenance"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "equipment_returns_organisation_status_idx" ON "logistics_equipment_returns"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "equipment_returns_workspace_status_idx" ON "logistics_equipment_returns"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "equipment_returns_created_idx" ON "logistics_equipment_returns"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_returns_id_organisation_uq" ON "logistics_equipment_returns"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_returns_id_workspace_organisation_uq" ON "logistics_equipment_returns"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "location_bookings_organisation_status_idx" ON "logistics_location_bookings"("organisation_id", "booking_status");

-- CreateIndex
CREATE INDEX "location_bookings_workspace_status_idx" ON "logistics_location_bookings"("workspace_id", "booking_status");

-- CreateIndex
CREATE INDEX "location_bookings_created_idx" ON "logistics_location_bookings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "location_bookings_id_organisation_uq" ON "logistics_location_bookings"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_bookings_id_workspace_organisation_uq" ON "logistics_location_bookings"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "location_comparisons_organisation_status_idx" ON "logistics_location_comparisons"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "location_comparisons_workspace_status_idx" ON "logistics_location_comparisons"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "location_comparisons_created_idx" ON "logistics_location_comparisons"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "location_comparisons_id_organisation_uq" ON "logistics_location_comparisons"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_comparisons_id_workspace_organisation_uq" ON "logistics_location_comparisons"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "location_media_organisation_status_idx" ON "logistics_location_media"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "location_media_workspace_status_idx" ON "logistics_location_media"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "location_media_created_idx" ON "logistics_location_media"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "location_media_id_organisation_uq" ON "logistics_location_media"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_media_id_workspace_organisation_uq" ON "logistics_location_media"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "locations_organisation_status_idx" ON "logistics_locations"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "locations_workspace_status_idx" ON "logistics_locations"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "locations_created_idx" ON "logistics_locations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_organisation_uq" ON "logistics_locations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_workspace_organisation_uq" ON "logistics_locations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "logistics_tasks_organisation_status_idx" ON "logistics_logistics_tasks"("organisation_id", "task_status");

-- CreateIndex
CREATE INDEX "logistics_tasks_workspace_status_idx" ON "logistics_logistics_tasks"("workspace_id", "task_status");

-- CreateIndex
CREATE INDEX "logistics_tasks_created_idx" ON "logistics_logistics_tasks"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "logistics_tasks_id_organisation_uq" ON "logistics_logistics_tasks"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "logistics_tasks_id_workspace_organisation_uq" ON "logistics_logistics_tasks"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "permit_documents_organisation_status_idx" ON "logistics_permit_documents"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "permit_documents_workspace_status_idx" ON "logistics_permit_documents"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "permit_documents_created_idx" ON "logistics_permit_documents"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "permit_documents_id_organisation_uq" ON "logistics_permit_documents"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "permit_documents_id_workspace_organisation_uq" ON "logistics_permit_documents"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "permits_organisation_status_idx" ON "logistics_permits"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "permits_workspace_status_idx" ON "logistics_permits"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "permits_created_idx" ON "logistics_permits"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "permits_id_organisation_uq" ON "logistics_permits"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "permits_id_workspace_organisation_uq" ON "logistics_permits"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "recce_media_organisation_status_idx" ON "logistics_recce_media"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "recce_media_workspace_status_idx" ON "logistics_recce_media"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "recce_media_created_idx" ON "logistics_recce_media"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "recce_media_id_organisation_uq" ON "logistics_recce_media"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "recce_media_id_workspace_organisation_uq" ON "logistics_recce_media"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "recces_organisation_status_idx" ON "logistics_recces"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "recces_workspace_status_idx" ON "logistics_recces"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "recces_created_idx" ON "logistics_recces"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "recces_id_organisation_uq" ON "logistics_recces"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "recces_id_workspace_organisation_uq" ON "logistics_recces"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "room_allocations_organisation_status_idx" ON "logistics_room_allocations"("organisation_id", "allocation_status");

-- CreateIndex
CREATE INDEX "room_allocations_workspace_status_idx" ON "logistics_room_allocations"("workspace_id", "allocation_status");

-- CreateIndex
CREATE INDEX "room_allocations_created_idx" ON "logistics_room_allocations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "room_allocations_id_organisation_uq" ON "logistics_room_allocations"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_allocations_id_workspace_organisation_uq" ON "logistics_room_allocations"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_allocations_accommodation_id_room_label_check_in_uq" ON "logistics_room_allocations"("accommodation_id", "room_label", "check_in");

-- CreateIndex
CREATE INDEX "shipments_organisation_status_idx" ON "logistics_shipments"("organisation_id", "shipment_status");

-- CreateIndex
CREATE INDEX "shipments_workspace_status_idx" ON "logistics_shipments"("workspace_id", "shipment_status");

-- CreateIndex
CREATE INDEX "shipments_created_idx" ON "logistics_shipments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_id_organisation_uq" ON "logistics_shipments"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_id_workspace_organisation_uq" ON "logistics_shipments"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "transport_plans_organisation_status_idx" ON "logistics_transport_plans"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "transport_plans_workspace_status_idx" ON "logistics_transport_plans"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "transport_plans_created_idx" ON "logistics_transport_plans"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "transport_plans_id_organisation_uq" ON "logistics_transport_plans"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "transport_plans_id_workspace_organisation_uq" ON "logistics_transport_plans"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "travel_legs_organisation_status_idx" ON "logistics_travel_legs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "travel_legs_workspace_status_idx" ON "logistics_travel_legs"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "travel_legs_created_idx" ON "logistics_travel_legs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "travel_legs_id_organisation_uq" ON "logistics_travel_legs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "travel_legs_id_workspace_organisation_uq" ON "logistics_travel_legs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "travel_legs_travel_plan_id_sequence_uq" ON "logistics_travel_legs"("travel_plan_id", "sequence");

-- CreateIndex
CREATE INDEX "travel_plans_organisation_status_idx" ON "logistics_travel_plans"("organisation_id", "travel_status");

-- CreateIndex
CREATE INDEX "travel_plans_workspace_status_idx" ON "logistics_travel_plans"("workspace_id", "travel_status");

-- CreateIndex
CREATE INDEX "travel_plans_created_idx" ON "logistics_travel_plans"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "travel_plans_id_organisation_uq" ON "logistics_travel_plans"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "travel_plans_id_workspace_organisation_uq" ON "logistics_travel_plans"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "vehicle_assignments_organisation_status_idx" ON "logistics_vehicle_assignments"("organisation_id", "assignment_status");

-- CreateIndex
CREATE INDEX "vehicle_assignments_workspace_status_idx" ON "logistics_vehicle_assignments"("workspace_id", "assignment_status");

-- CreateIndex
CREATE INDEX "vehicle_assignments_created_idx" ON "logistics_vehicle_assignments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_assignments_id_organisation_uq" ON "logistics_vehicle_assignments"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_assignments_id_workspace_organisation_uq" ON "logistics_vehicle_assignments"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "vehicles_organisation_status_idx" ON "logistics_vehicles"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "vehicles_workspace_status_idx" ON "logistics_vehicles"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "vehicles_created_idx" ON "logistics_vehicles"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_id_organisation_uq" ON "logistics_vehicles"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_id_workspace_organisation_uq" ON "logistics_vehicles"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_registration_number_uq" ON "logistics_vehicles"("registration_number");

-- CreateIndex
CREATE INDEX "capability_packs_organisation_status_idx" ON "marketplace_capability_packs"("organisation_id", "pack_status");

-- CreateIndex
CREATE INDEX "capability_packs_workspace_status_idx" ON "marketplace_capability_packs"("workspace_id", "pack_status");

-- CreateIndex
CREATE INDEX "capability_packs_created_idx" ON "marketplace_capability_packs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "capability_packs_id_organisation_uq" ON "marketplace_capability_packs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "capability_packs_id_workspace_organisation_uq" ON "marketplace_capability_packs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "capability_packs_code_uq" ON "marketplace_capability_packs"("code");

-- CreateIndex
CREATE INDEX "deliveries_organisation_status_idx" ON "marketplace_deliveries"("organisation_id", "delivery_status");

-- CreateIndex
CREATE INDEX "deliveries_workspace_status_idx" ON "marketplace_deliveries"("workspace_id", "delivery_status");

-- CreateIndex
CREATE INDEX "deliveries_created_idx" ON "marketplace_deliveries"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_id_organisation_uq" ON "marketplace_deliveries"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_id_workspace_organisation_uq" ON "marketplace_deliveries"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "marketplace_categories_organisation_status_idx" ON "marketplace_marketplace_categories"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "marketplace_categories_workspace_status_idx" ON "marketplace_marketplace_categories"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "marketplace_categories_created_idx" ON "marketplace_marketplace_categories"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_categories_id_organisation_uq" ON "marketplace_marketplace_categories"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_categories_id_workspace_organisation_uq" ON "marketplace_marketplace_categories"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_categories_slug_uq" ON "marketplace_marketplace_categories"("slug");

-- CreateIndex
CREATE INDEX "marketplace_services_organisation_status_idx" ON "marketplace_marketplace_services"("organisation_id", "service_status");

-- CreateIndex
CREATE INDEX "marketplace_services_workspace_status_idx" ON "marketplace_marketplace_services"("workspace_id", "service_status");

-- CreateIndex
CREATE INDEX "marketplace_services_created_idx" ON "marketplace_marketplace_services"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_services_id_organisation_uq" ON "marketplace_marketplace_services"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_services_id_workspace_organisation_uq" ON "marketplace_marketplace_services"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_services_slug_uq" ON "marketplace_marketplace_services"("slug");

-- CreateIndex
CREATE INDEX "procurement_awards_organisation_status_idx" ON "marketplace_procurement_awards"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "procurement_awards_workspace_status_idx" ON "marketplace_procurement_awards"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "procurement_awards_created_idx" ON "marketplace_procurement_awards"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_awards_id_organisation_uq" ON "marketplace_procurement_awards"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_awards_id_workspace_organisation_uq" ON "marketplace_procurement_awards"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_organisation_status_idx" ON "marketplace_purchase_order_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "purchase_order_items_workspace_status_idx" ON "marketplace_purchase_order_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "purchase_order_items_created_idx" ON "marketplace_purchase_order_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_items_id_organisation_uq" ON "marketplace_purchase_order_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_items_id_workspace_organisation_uq" ON "marketplace_purchase_order_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_items_purchase_order_id_rfq_item_id_uq" ON "marketplace_purchase_order_items"("purchase_order_id", "rfq_item_id");

-- CreateIndex
CREATE INDEX "purchase_orders_organisation_status_idx" ON "marketplace_purchase_orders"("organisation_id", "order_status");

-- CreateIndex
CREATE INDEX "purchase_orders_workspace_status_idx" ON "marketplace_purchase_orders"("workspace_id", "order_status");

-- CreateIndex
CREATE INDEX "purchase_orders_created_idx" ON "marketplace_purchase_orders"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_id_organisation_uq" ON "marketplace_purchase_orders"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_id_workspace_organisation_uq" ON "marketplace_purchase_orders"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "quote_comparisons_organisation_status_idx" ON "marketplace_quote_comparisons"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "quote_comparisons_workspace_status_idx" ON "marketplace_quote_comparisons"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "quote_comparisons_created_idx" ON "marketplace_quote_comparisons"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "quote_comparisons_id_organisation_uq" ON "marketplace_quote_comparisons"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "quote_comparisons_id_workspace_organisation_uq" ON "marketplace_quote_comparisons"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "quote_items_organisation_status_idx" ON "marketplace_quote_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "quote_items_workspace_status_idx" ON "marketplace_quote_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "quote_items_created_idx" ON "marketplace_quote_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "quote_items_id_organisation_uq" ON "marketplace_quote_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "quote_items_id_workspace_organisation_uq" ON "marketplace_quote_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "quote_items_quote_id_rfq_item_id_uq" ON "marketplace_quote_items"("quote_id", "rfq_item_id");

-- CreateIndex
CREATE INDEX "quotes_organisation_status_idx" ON "marketplace_quotes"("organisation_id", "quote_status");

-- CreateIndex
CREATE INDEX "quotes_workspace_status_idx" ON "marketplace_quotes"("workspace_id", "quote_status");

-- CreateIndex
CREATE INDEX "quotes_created_idx" ON "marketplace_quotes"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_id_organisation_uq" ON "marketplace_quotes"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_id_workspace_organisation_uq" ON "marketplace_quotes"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "rfq_items_organisation_status_idx" ON "marketplace_rfq_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "rfq_items_workspace_status_idx" ON "marketplace_rfq_items"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "rfq_items_created_idx" ON "marketplace_rfq_items"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_items_id_organisation_uq" ON "marketplace_rfq_items"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_items_id_workspace_organisation_uq" ON "marketplace_rfq_items"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_items_rfq_id_sort_order_uq" ON "marketplace_rfq_items"("rfq_id", "sort_order");

-- CreateIndex
CREATE INDEX "rfq_recipients_organisation_status_idx" ON "marketplace_rfq_recipients"("organisation_id", "response_status");

-- CreateIndex
CREATE INDEX "rfq_recipients_workspace_status_idx" ON "marketplace_rfq_recipients"("workspace_id", "response_status");

-- CreateIndex
CREATE INDEX "rfq_recipients_created_idx" ON "marketplace_rfq_recipients"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_recipients_id_organisation_uq" ON "marketplace_rfq_recipients"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_recipients_id_workspace_organisation_uq" ON "marketplace_rfq_recipients"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "rfqs_organisation_status_idx" ON "marketplace_rfqs"("organisation_id", "rfq_status");

-- CreateIndex
CREATE INDEX "rfqs_workspace_status_idx" ON "marketplace_rfqs"("workspace_id", "rfq_status");

-- CreateIndex
CREATE INDEX "rfqs_created_idx" ON "marketplace_rfqs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_id_organisation_uq" ON "marketplace_rfqs"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_id_workspace_organisation_uq" ON "marketplace_rfqs"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "service_deliveries_organisation_status_idx" ON "marketplace_service_deliveries"("organisation_id", "acceptance_status");

-- CreateIndex
CREATE INDEX "service_deliveries_workspace_status_idx" ON "marketplace_service_deliveries"("workspace_id", "acceptance_status");

-- CreateIndex
CREATE INDEX "service_deliveries_created_idx" ON "marketplace_service_deliveries"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_deliveries_id_organisation_uq" ON "marketplace_service_deliveries"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_deliveries_id_workspace_organisation_uq" ON "marketplace_service_deliveries"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "service_skus_organisation_status_idx" ON "marketplace_service_skus"("organisation_id", "sku_status");

-- CreateIndex
CREATE INDEX "service_skus_workspace_status_idx" ON "marketplace_service_skus"("workspace_id", "sku_status");

-- CreateIndex
CREATE INDEX "service_skus_created_idx" ON "marketplace_service_skus"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_skus_id_organisation_uq" ON "marketplace_service_skus"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_skus_id_workspace_organisation_uq" ON "marketplace_service_skus"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_skus_sku_code_uq" ON "marketplace_service_skus"("sku_code");

-- CreateIndex
CREATE INDEX "vendor_availability_organisation_status_idx" ON "marketplace_vendor_availability"("organisation_id", "availability_status");

-- CreateIndex
CREATE INDEX "vendor_availability_workspace_status_idx" ON "marketplace_vendor_availability"("workspace_id", "availability_status");

-- CreateIndex
CREATE INDEX "vendor_availability_created_idx" ON "marketplace_vendor_availability"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_availability_id_organisation_uq" ON "marketplace_vendor_availability"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_availability_id_workspace_organisation_uq" ON "marketplace_vendor_availability"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_availability_vendor_id_starts_at_ends_at_uq" ON "marketplace_vendor_availability"("vendor_id", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "vendor_capabilities_organisation_status_idx" ON "marketplace_vendor_capabilities"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "vendor_capabilities_workspace_status_idx" ON "marketplace_vendor_capabilities"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "vendor_capabilities_created_idx" ON "marketplace_vendor_capabilities"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_capabilities_id_organisation_uq" ON "marketplace_vendor_capabilities"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_capabilities_id_workspace_organisation_uq" ON "marketplace_vendor_capabilities"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_capabilities_vendor_id_service_id_uq" ON "marketplace_vendor_capabilities"("vendor_id", "service_id");

-- CreateIndex
CREATE INDEX "vendor_performance_organisation_status_idx" ON "marketplace_vendor_performance"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "vendor_performance_workspace_status_idx" ON "marketplace_vendor_performance"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "vendor_performance_created_idx" ON "marketplace_vendor_performance"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_performance_id_organisation_uq" ON "marketplace_vendor_performance"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_performance_id_workspace_organisation_uq" ON "marketplace_vendor_performance"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "vendor_portfolios_organisation_status_idx" ON "marketplace_vendor_portfolios"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "vendor_portfolios_workspace_status_idx" ON "marketplace_vendor_portfolios"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "vendor_portfolios_created_idx" ON "marketplace_vendor_portfolios"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_portfolios_id_organisation_uq" ON "marketplace_vendor_portfolios"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_portfolios_id_workspace_organisation_uq" ON "marketplace_vendor_portfolios"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "vendor_profiles_organisation_status_idx" ON "marketplace_vendor_profiles"("organisation_id", "profile_status");

-- CreateIndex
CREATE INDEX "vendor_profiles_workspace_status_idx" ON "marketplace_vendor_profiles"("workspace_id", "profile_status");

-- CreateIndex
CREATE INDEX "vendor_profiles_created_idx" ON "marketplace_vendor_profiles"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_id_organisation_uq" ON "marketplace_vendor_profiles"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_id_workspace_organisation_uq" ON "marketplace_vendor_profiles"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_vendor_id_uq" ON "marketplace_vendor_profiles"("vendor_id");

-- CreateIndex
CREATE INDEX "vendor_ratings_organisation_status_idx" ON "marketplace_vendor_ratings"("organisation_id", "rating_status");

-- CreateIndex
CREATE INDEX "vendor_ratings_workspace_status_idx" ON "marketplace_vendor_ratings"("workspace_id", "rating_status");

-- CreateIndex
CREATE INDEX "vendor_ratings_created_idx" ON "marketplace_vendor_ratings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_ratings_id_organisation_uq" ON "marketplace_vendor_ratings"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_ratings_id_workspace_organisation_uq" ON "marketplace_vendor_ratings"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "vendors_organisation_status_idx" ON "marketplace_vendors"("organisation_id", "vendor_status");

-- CreateIndex
CREATE INDEX "vendors_workspace_status_idx" ON "marketplace_vendors"("workspace_id", "vendor_status");

-- CreateIndex
CREATE INDEX "vendors_created_idx" ON "marketplace_vendors"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_id_organisation_uq" ON "marketplace_vendors"("id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_id_workspace_organisation_uq" ON "marketplace_vendors"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "organisation_memberships_user_idx" ON "organisation_organisation_memberships"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_memberships_pair_unique" ON "organisation_organisation_memberships"("organisation_id", "user_id");

-- CreateIndex
CREATE INDEX "organisation_settings_organisation_idx" ON "organisation_organisation_settings"("organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_settings_organisation_key" ON "organisation_organisation_settings"("organisation_id");

-- CreateIndex
CREATE INDEX "organisations_status_idx" ON "organisation_organisations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "organisations_slug_unique" ON "organisation_organisations"("slug");

-- CreateIndex
CREATE INDEX "workspace_activity_workspace_occurred_idx" ON "organisation_workspace_activity"("workspace_id", "occurred_at");

-- CreateIndex
CREATE INDEX "workspace_activity_actor_idx" ON "organisation_workspace_activity"("actor_membership_id");

-- CreateIndex
CREATE INDEX "workspace_activity_event_type_idx" ON "organisation_workspace_activity"("event_type");

-- CreateIndex
CREATE INDEX "workspace_favourites_workspace_idx" ON "organisation_workspace_favourites"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_favourites_membership_idx" ON "organisation_workspace_favourites"("membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_favourites_membership_target_key" ON "organisation_workspace_favourites"("membership_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "workspace_invites_workspace_status_idx" ON "organisation_workspace_invites"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "workspace_invites_email_idx" ON "organisation_workspace_invites"("email");

-- CreateIndex
CREATE INDEX "workspace_invites_expires_idx" ON "organisation_workspace_invites"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_invites_workspace_email_pending_key" ON "organisation_workspace_invites"("workspace_id", "email", "status");

-- CreateIndex
CREATE INDEX "workspace_memberships_user_status_idx" ON "organisation_workspace_memberships"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_memberships_pair_unique" ON "organisation_workspace_memberships"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_memberships_id_workspace_organisation_unique" ON "organisation_workspace_memberships"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "workspace_roles_workspace_idx" ON "organisation_workspace_roles"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_roles_organisation_idx" ON "organisation_workspace_roles"("organisation_id");

-- CreateIndex
CREATE INDEX "workspace_roles_retired_idx" ON "organisation_workspace_roles"("retired_at");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_roles_workspace_name_key" ON "organisation_workspace_roles"("workspace_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_roles_id_workspace_organisation_unique" ON "organisation_workspace_roles"("id", "workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "workspace_settings_workspace_idx" ON "organisation_workspace_settings"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_settings_organisation_idx" ON "organisation_workspace_settings"("organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_settings_workspace_key" ON "organisation_workspace_settings"("workspace_id");

-- CreateIndex
CREATE INDEX "workspaces_organisation_status_idx" ON "organisation_workspaces"("organisation_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_organisation_slug_unique" ON "organisation_workspaces"("organisation_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_id_organisation_unique" ON "organisation_workspaces"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_organisation_status" ON "people_attendance_records"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_attendance_records_organisation_id" ON "people_attendance_records"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_project_id_organisation_id" ON "people_attendance_records"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_user_id" ON "people_attendance_records"("user_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_cast_assignment_id" ON "people_attendance_records"("cast_assignment_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_crew_assignment_id" ON "people_attendance_records"("crew_assignment_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_workspace_id_organisation_id" ON "people_attendance_records"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_attendance_records_created_by_user_id" ON "people_attendance_records"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_attendance_records_id_organisation" ON "people_attendance_records"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_media_organisation_status" ON "people_audition_media"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_audition_media_organisation_id" ON "people_audition_media"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_media_audition_submission_id" ON "people_audition_media"("audition_submission_id");

-- CreateIndex
CREATE INDEX "ix_audition_media_evidence_item_id_organisation_id" ON "people_audition_media"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_media_workspace_id_organisation_id" ON "people_audition_media"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_media_created_by_user_id" ON "people_audition_media"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_audition_media_id_organisation" ON "people_audition_media"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_organisation_status" ON "people_audition_submissions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_organisation_id" ON "people_audition_submissions"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_casting_call_id" ON "people_audition_submissions"("casting_call_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_casting_call_role_id" ON "people_audition_submissions"("casting_call_role_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_talent_profile_id" ON "people_audition_submissions"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_submitted_by_user_id" ON "people_audition_submissions"("submitted_by_user_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_workspace_id_organisation_id" ON "people_audition_submissions"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_audition_submissions_created_by_user_id" ON "people_audition_submissions"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_audition_submissions_id_organisation" ON "people_audition_submissions"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_organisation_status" ON "people_cast_assignments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_organisation_id" ON "people_cast_assignments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_talent_profile_id" ON "people_cast_assignments"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_casting_call_role_id" ON "people_cast_assignments"("casting_call_role_id");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_talent_contract_id" ON "people_cast_assignments"("talent_contract_id");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_workspace_id_organisation_id" ON "people_cast_assignments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_assignments_created_by_user_id" ON "people_cast_assignments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_cast_assignments_id_organisation" ON "people_cast_assignments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_messages_organisation_status" ON "people_cast_messages"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_cast_messages_organisation_id" ON "people_cast_messages"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_messages_talent_profile_id" ON "people_cast_messages"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_cast_messages_sender_user_id" ON "people_cast_messages"("sender_user_id");

-- CreateIndex
CREATE INDEX "ix_cast_messages_organisation_id_communication_thread_id" ON "people_cast_messages"("organisation_id", "communication_thread_id");

-- CreateIndex
CREATE INDEX "ix_cast_messages_workspace_id_organisation_id" ON "people_cast_messages"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_messages_created_by_user_id" ON "people_cast_messages"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_cast_messages_id_organisation" ON "people_cast_messages"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_schedule_entries_organisation_status" ON "people_cast_schedule_entries"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_cast_schedule_entries_organisation_id" ON "people_cast_schedule_entries"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_schedule_entries_cast_assignment_id_organisation_id" ON "people_cast_schedule_entries"("cast_assignment_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_schedule_entries_schedule_item_id" ON "people_cast_schedule_entries"("schedule_item_id");

-- CreateIndex
CREATE INDEX "ix_cast_schedule_entries_workspace_id_organisation_id" ON "people_cast_schedule_entries"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_cast_schedule_entries_created_by_user_id" ON "people_cast_schedule_entries"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_cast_schedule_entries_id_organisation" ON "people_cast_schedule_entries"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_organisation_status" ON "people_casting_approvals"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_organisation_id" ON "people_casting_approvals"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_casting_call_id" ON "people_casting_approvals"("casting_call_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_audition_submission_id_organisation_id" ON "people_casting_approvals"("audition_submission_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_approver_user_id" ON "people_casting_approvals"("approver_user_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_approval_id" ON "people_casting_approvals"("approval_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_workspace_id_organisation_id" ON "people_casting_approvals"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_approvals_created_by_user_id" ON "people_casting_approvals"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_casting_approvals_id_organisation" ON "people_casting_approvals"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_call_roles_organisation_status" ON "people_casting_call_roles"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_casting_call_roles_organisation_id" ON "people_casting_call_roles"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_call_roles_casting_call_id" ON "people_casting_call_roles"("casting_call_id");

-- CreateIndex
CREATE INDEX "ix_casting_call_roles_workspace_id_organisation_id" ON "people_casting_call_roles"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_call_roles_created_by_user_id" ON "people_casting_call_roles"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_casting_call_roles_id_organisation" ON "people_casting_call_roles"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_calls_organisation_status" ON "people_casting_calls"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_casting_calls_organisation_id" ON "people_casting_calls"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_calls_project_id_organisation_id" ON "people_casting_calls"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_casting_calls_created_by_user_id" ON "people_casting_calls"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_casting_calls_workspace_id_organisation_id" ON "people_casting_calls"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_casting_calls_id_organisation" ON "people_casting_calls"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_organisation_status" ON "people_crew_assignments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_organisation_id" ON "people_crew_assignments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_project_id_organisation_id" ON "people_crew_assignments"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_crew_profile_id" ON "people_crew_assignments"("crew_profile_id");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_department_id" ON "people_crew_assignments"("department_id");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_workspace_id_organisation_id" ON "people_crew_assignments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_assignments_created_by_user_id" ON "people_crew_assignments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_assignments_id_organisation" ON "people_crew_assignments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_availability_organisation_status" ON "people_crew_availability"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_availability_organisation_id" ON "people_crew_availability"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_availability_crew_profile_id" ON "people_crew_availability"("crew_profile_id");

-- CreateIndex
CREATE INDEX "ix_crew_availability_workspace_id_organisation_id" ON "people_crew_availability"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_availability_created_by_user_id" ON "people_crew_availability"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_availability_id_organisation" ON "people_crew_availability"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_organisation_status" ON "people_crew_contracts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_organisation_id" ON "people_crew_contracts"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_crew_assignment_id_organisation_id" ON "people_crew_contracts"("crew_assignment_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_crew_profile_id" ON "people_crew_contracts"("crew_profile_id");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_evidence_item_id_organisation_id" ON "people_crew_contracts"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_workspace_id_organisation_id" ON "people_crew_contracts"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_contracts_created_by_user_id" ON "people_crew_contracts"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_contracts_id_organisation" ON "people_crew_contracts"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_organisation_status" ON "people_crew_hiring_requests"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_organisation_id" ON "people_crew_hiring_requests"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_project_id_organisation_id" ON "people_crew_hiring_requests"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_department_id" ON "people_crew_hiring_requests"("department_id");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_requested_by_user_id" ON "people_crew_hiring_requests"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_workspace_id_organisation_id" ON "people_crew_hiring_requests"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_hiring_requests_created_by_user_id" ON "people_crew_hiring_requests"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_hiring_requests_id_organisation" ON "people_crew_hiring_requests"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_messages_organisation_status" ON "people_crew_messages"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_messages_organisation_id" ON "people_crew_messages"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_messages_crew_profile_id" ON "people_crew_messages"("crew_profile_id");

-- CreateIndex
CREATE INDEX "ix_crew_messages_sender_user_id" ON "people_crew_messages"("sender_user_id");

-- CreateIndex
CREATE INDEX "ix_crew_messages_organisation_id_communication_thread_id" ON "people_crew_messages"("organisation_id", "communication_thread_id");

-- CreateIndex
CREATE INDEX "ix_crew_messages_workspace_id_organisation_id" ON "people_crew_messages"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_messages_created_by_user_id" ON "people_crew_messages"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_messages_id_organisation" ON "people_crew_messages"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_profiles_organisation_status" ON "people_crew_profiles"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_profiles_organisation_id" ON "people_crew_profiles"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_profiles_user_id" ON "people_crew_profiles"("user_id");

-- CreateIndex
CREATE INDEX "ix_crew_profiles_workspace_id_organisation_id" ON "people_crew_profiles"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_profiles_created_by_user_id" ON "people_crew_profiles"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_profiles_id_organisation" ON "people_crew_profiles"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlist_items_organisation_status" ON "people_crew_shortlist_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_shortlist_items_organisation_id" ON "people_crew_shortlist_items"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlist_items_shortlist_id" ON "people_crew_shortlist_items"("shortlist_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlist_items_crew_profile_id_organisation_id" ON "people_crew_shortlist_items"("crew_profile_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlist_items_workspace_id_organisation_id" ON "people_crew_shortlist_items"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlist_items_created_by_user_id" ON "people_crew_shortlist_items"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_shortlist_items_id_organisation" ON "people_crew_shortlist_items"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlists_organisation_status" ON "people_crew_shortlists"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_shortlists_organisation_id" ON "people_crew_shortlists"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlists_project_id_organisation_id" ON "people_crew_shortlists"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlists_crew_hiring_request_id_organisation_id" ON "people_crew_shortlists"("crew_hiring_request_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlists_created_by_user_id" ON "people_crew_shortlists"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_crew_shortlists_workspace_id_organisation_id" ON "people_crew_shortlists"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_shortlists_id_organisation" ON "people_crew_shortlists"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_skills_organisation_status" ON "people_crew_skills"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_crew_skills_organisation_id" ON "people_crew_skills"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_skills_crew_profile_id_organisation_id" ON "people_crew_skills"("crew_profile_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_skills_workspace_id_organisation_id" ON "people_crew_skills"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_crew_skills_created_by_user_id" ON "people_crew_skills"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_crew_skills_id_organisation" ON "people_crew_skills"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_department_members_organisation_status" ON "people_department_members"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_department_members_organisation_id" ON "people_department_members"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_department_members_department_id" ON "people_department_members"("department_id");

-- CreateIndex
CREATE INDEX "ix_department_members_user_id" ON "people_department_members"("user_id");

-- CreateIndex
CREATE INDEX "ix_department_members_workspace_id_organisation_id" ON "people_department_members"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_department_members_created_by_user_id" ON "people_department_members"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_department_members_id_organisation" ON "people_department_members"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_departments_organisation_status" ON "people_departments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_departments_organisation_id" ON "people_departments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_departments_project_id_organisation_id" ON "people_departments"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_departments_workspace_id_organisation_id" ON "people_departments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_departments_created_by_user_id" ON "people_departments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_departments_id_organisation" ON "people_departments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_hod_assignments_organisation_status" ON "people_hod_assignments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_hod_assignments_organisation_id" ON "people_hod_assignments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_hod_assignments_department_id_organisation_id" ON "people_hod_assignments"("department_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_hod_assignments_crew_profile_id_organisation_id" ON "people_hod_assignments"("crew_profile_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_hod_assignments_workspace_id_organisation_id" ON "people_hod_assignments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_hod_assignments_created_by_user_id" ON "people_hod_assignments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hod_assignments_id_organisation" ON "people_hod_assignments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_organisation_status" ON "people_performance_reviews"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_organisation_id" ON "people_performance_reviews"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_project_id_organisation_id" ON "people_performance_reviews"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_reviewee_user_id" ON "people_performance_reviews"("reviewee_user_id");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_reviewer_user_id" ON "people_performance_reviews"("reviewer_user_id");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_workspace_id_organisation_id" ON "people_performance_reviews"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_performance_reviews_created_by_user_id" ON "people_performance_reviews"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_performance_reviews_id_organisation" ON "people_performance_reviews"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_availability_organisation_status" ON "people_talent_availability"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_availability_organisation_id" ON "people_talent_availability"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_availability_talent_profile_id" ON "people_talent_availability"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_availability_workspace_id_organisation_id" ON "people_talent_availability"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_availability_created_by_user_id" ON "people_talent_availability"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_availability_id_organisation" ON "people_talent_availability"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_comparisons_organisation_status" ON "people_talent_comparisons"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_comparisons_organisation_id" ON "people_talent_comparisons"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_comparisons_left_talent_profile_id" ON "people_talent_comparisons"("left_talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_comparisons_right_talent_profile_id" ON "people_talent_comparisons"("right_talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_comparisons_created_by_user_id" ON "people_talent_comparisons"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_talent_comparisons_workspace_id_organisation_id" ON "people_talent_comparisons"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_comparisons_id_organisation" ON "people_talent_comparisons"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_organisation_status" ON "people_talent_contracts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_organisation_id" ON "people_talent_contracts"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_talent_profile_id" ON "people_talent_contracts"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_offer_id" ON "people_talent_contracts"("offer_id");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_evidence_item_id_organisation_id" ON "people_talent_contracts"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_workspace_id_organisation_id" ON "people_talent_contracts"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_contracts_created_by_user_id" ON "people_talent_contracts"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_contracts_id_organisation" ON "people_talent_contracts"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_media_organisation_status" ON "people_talent_media"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_media_organisation_id" ON "people_talent_media"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_media_talent_profile_id" ON "people_talent_media"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_media_evidence_item_id_organisation_id" ON "people_talent_media"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_media_workspace_id_organisation_id" ON "people_talent_media"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_media_created_by_user_id" ON "people_talent_media"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_media_id_organisation" ON "people_talent_media"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_offers_organisation_status" ON "people_talent_offers"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_offers_organisation_id" ON "people_talent_offers"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_offers_talent_profile_id" ON "people_talent_offers"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_offers_casting_call_role_id_organisation_id" ON "people_talent_offers"("casting_call_role_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_offers_project_id_organisation_id" ON "people_talent_offers"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_offers_workspace_id_organisation_id" ON "people_talent_offers"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_offers_created_by_user_id" ON "people_talent_offers"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_offers_id_organisation" ON "people_talent_offers"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_portfolios_organisation_status" ON "people_talent_portfolios"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_portfolios_organisation_id" ON "people_talent_portfolios"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_portfolios_talent_profile_id" ON "people_talent_portfolios"("talent_profile_id");

-- CreateIndex
CREATE INDEX "ix_talent_portfolios_workspace_id_organisation_id" ON "people_talent_portfolios"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_portfolios_created_by_user_id" ON "people_talent_portfolios"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_portfolios_id_organisation" ON "people_talent_portfolios"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_profiles_organisation_status" ON "people_talent_profiles"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_profiles_organisation_id" ON "people_talent_profiles"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_profiles_user_id" ON "people_talent_profiles"("user_id");

-- CreateIndex
CREATE INDEX "ix_talent_profiles_workspace_id_organisation_id" ON "people_talent_profiles"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_profiles_created_by_user_id" ON "people_talent_profiles"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_profiles_id_organisation" ON "people_talent_profiles"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_organisation_status" ON "people_talent_shortlist_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_organisation_id" ON "people_talent_shortlist_items"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_shortlist_id" ON "people_talent_shortlist_items"("shortlist_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_talent_profile_id_organisation_id" ON "people_talent_shortlist_items"("talent_profile_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_audition_submission_id_organisatio" ON "people_talent_shortlist_items"("audition_submission_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_workspace_id_organisation_id" ON "people_talent_shortlist_items"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlist_items_created_by_user_id" ON "people_talent_shortlist_items"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_shortlist_items_id_organisation" ON "people_talent_shortlist_items"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlists_organisation_status" ON "people_talent_shortlists"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_talent_shortlists_organisation_id" ON "people_talent_shortlists"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlists_project_id_organisation_id" ON "people_talent_shortlists"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlists_casting_call_id_organisation_id" ON "people_talent_shortlists"("casting_call_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlists_created_by_user_id" ON "people_talent_shortlists"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_talent_shortlists_workspace_id_organisation_id" ON "people_talent_shortlists"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_talent_shortlists_id_organisation" ON "people_talent_shortlists"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_organisation_status" ON "people_timesheets"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_timesheets_organisation_id" ON "people_timesheets"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_project_id_organisation_id" ON "people_timesheets"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_user_id" ON "people_timesheets"("user_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_crew_assignment_id_organisation_id" ON "people_timesheets"("crew_assignment_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_cast_assignment_id_organisation_id" ON "people_timesheets"("cast_assignment_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_workspace_id_organisation_id" ON "people_timesheets"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_timesheets_created_by_user_id" ON "people_timesheets"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_timesheets_id_organisation" ON "people_timesheets"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_api_keys_organisation_status" ON "platform_api_keys"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_api_keys_organisation_id" ON "platform_api_keys"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_api_keys_created_by_user_id" ON "platform_api_keys"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_api_keys_workspace_id_organisation_id" ON "platform_api_keys"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_api_keys_id_organisation" ON "platform_api_keys"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_data_retention_policies_organisation_status" ON "platform_data_retention_policies"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_data_retention_policies_organisation_id" ON "platform_data_retention_policies"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_data_retention_policies_approved_by_user_id" ON "platform_data_retention_policies"("approved_by_user_id");

-- CreateIndex
CREATE INDEX "ix_data_retention_policies_workspace_id_organisation_id" ON "platform_data_retention_policies"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_data_retention_policies_created_by_user_id" ON "platform_data_retention_policies"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_data_retention_policies_id_organisation" ON "platform_data_retention_policies"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_export_jobs_organisation_status" ON "platform_export_jobs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_export_jobs_organisation_id" ON "platform_export_jobs"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_export_jobs_export_id" ON "platform_export_jobs"("export_id");

-- CreateIndex
CREATE INDEX "ix_export_jobs_workspace_id_organisation_id" ON "platform_export_jobs"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_export_jobs_created_by_user_id" ON "platform_export_jobs"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_export_jobs_id_organisation" ON "platform_export_jobs"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_exports_organisation_status" ON "platform_exports"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_exports_organisation_id" ON "platform_exports"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_exports_requested_by_user_id" ON "platform_exports"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "ix_exports_workspace_id_organisation_id" ON "platform_exports"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_exports_created_by_user_id" ON "platform_exports"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_exports_id_organisation" ON "platform_exports"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_feature_flag_assignments_organisation_status" ON "platform_feature_flag_assignments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_feature_flag_assignments_organisation_id" ON "platform_feature_flag_assignments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_feature_flag_assignments_feature_flag_id" ON "platform_feature_flag_assignments"("feature_flag_id");

-- CreateIndex
CREATE INDEX "ix_feature_flag_assignments_workspace_id_organisation_id" ON "platform_feature_flag_assignments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_feature_flag_assignments_created_by_user_id" ON "platform_feature_flag_assignments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_feature_flag_assignments_id_organisation" ON "platform_feature_flag_assignments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_connections_organisation_status" ON "platform_integration_connections"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_integration_connections_organisation_id" ON "platform_integration_connections"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_connections_integration_id" ON "platform_integration_connections"("integration_id");

-- CreateIndex
CREATE INDEX "ix_integration_connections_connected_by_user_id" ON "platform_integration_connections"("connected_by_user_id");

-- CreateIndex
CREATE INDEX "ix_integration_connections_workspace_id_organisation_id" ON "platform_integration_connections"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_connections_created_by_user_id" ON "platform_integration_connections"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_integration_connections_id_organisation" ON "platform_integration_connections"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_events_organisation_status" ON "platform_integration_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_integration_events_organisation_id" ON "platform_integration_events"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_events_integration_connection_id_organisation" ON "platform_integration_events"("integration_connection_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_events_workspace_id_organisation_id" ON "platform_integration_events"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_integration_events_created_by_user_id" ON "platform_integration_events"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_integration_events_id_organisation" ON "platform_integration_events"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_restore_jobs_organisation_status" ON "platform_restore_jobs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_restore_jobs_organisation_id" ON "platform_restore_jobs"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_restore_jobs_backup_job_id" ON "platform_restore_jobs"("backup_job_id");

-- CreateIndex
CREATE INDEX "ix_restore_jobs_requested_by_user_id" ON "platform_restore_jobs"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "ix_restore_jobs_workspace_id_organisation_id" ON "platform_restore_jobs"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_restore_jobs_created_by_user_id" ON "platform_restore_jobs"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_restore_jobs_id_organisation" ON "platform_restore_jobs"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_share_links_organisation_status" ON "platform_share_links"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_share_links_organisation_id" ON "platform_share_links"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_share_links_created_by_user_id" ON "platform_share_links"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_share_links_workspace_id_organisation_id" ON "platform_share_links"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_share_links_id_organisation" ON "platform_share_links"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_status_events_organisation_status" ON "platform_status_events"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_status_events_organisation_id" ON "platform_status_events"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_status_events_actor_user_id" ON "platform_status_events"("actor_user_id");

-- CreateIndex
CREATE INDEX "ix_status_events_workspace_id_organisation_id" ON "platform_status_events"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_status_events_created_by_user_id" ON "platform_status_events"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_status_events_id_organisation" ON "platform_status_events"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_support_comments_organisation_status" ON "platform_support_comments"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_support_comments_organisation_id" ON "platform_support_comments"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_support_comments_support_ticket_id" ON "platform_support_comments"("support_ticket_id");

-- CreateIndex
CREATE INDEX "ix_support_comments_author_user_id" ON "platform_support_comments"("author_user_id");

-- CreateIndex
CREATE INDEX "ix_support_comments_workspace_id_organisation_id" ON "platform_support_comments"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_support_comments_created_by_user_id" ON "platform_support_comments"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_support_comments_id_organisation" ON "platform_support_comments"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_support_tickets_organisation_status" ON "platform_support_tickets"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_support_tickets_organisation_id" ON "platform_support_tickets"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_support_tickets_opened_by_user_id" ON "platform_support_tickets"("opened_by_user_id");

-- CreateIndex
CREATE INDEX "ix_support_tickets_assigned_to_user_id" ON "platform_support_tickets"("assigned_to_user_id");

-- CreateIndex
CREATE INDEX "ix_support_tickets_workspace_id_organisation_id" ON "platform_support_tickets"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_support_tickets_created_by_user_id" ON "platform_support_tickets"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_support_tickets_id_organisation" ON "platform_support_tickets"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_conflicts_organisation_status" ON "platform_sync_conflicts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_sync_conflicts_organisation_id" ON "platform_sync_conflicts"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_conflicts_sync_job_id" ON "platform_sync_conflicts"("sync_job_id");

-- CreateIndex
CREATE INDEX "ix_sync_conflicts_resolved_by_user_id" ON "platform_sync_conflicts"("resolved_by_user_id");

-- CreateIndex
CREATE INDEX "ix_sync_conflicts_workspace_id_organisation_id" ON "platform_sync_conflicts"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_conflicts_created_by_user_id" ON "platform_sync_conflicts"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_sync_conflicts_id_organisation" ON "platform_sync_conflicts"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_jobs_organisation_status" ON "platform_sync_jobs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_sync_jobs_organisation_id" ON "platform_sync_jobs"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_jobs_integration_connection_id_organisation_id" ON "platform_sync_jobs"("integration_connection_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_jobs_workspace_id_organisation_id" ON "platform_sync_jobs"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_jobs_created_by_user_id" ON "platform_sync_jobs"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_sync_jobs_id_organisation" ON "platform_sync_jobs"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_queue_items_organisation_status" ON "platform_sync_queue_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_sync_queue_items_organisation_id" ON "platform_sync_queue_items"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_queue_items_sync_job_id_organisation_id" ON "platform_sync_queue_items"("sync_job_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_queue_items_workspace_id_organisation_id" ON "platform_sync_queue_items"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_sync_queue_items_created_by_user_id" ON "platform_sync_queue_items"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_sync_queue_items_id_organisation" ON "platform_sync_queue_items"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_system_incidents_organisation_status" ON "platform_system_incidents"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_system_incidents_organisation_id" ON "platform_system_incidents"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_system_incidents_detected_by_user_id" ON "platform_system_incidents"("detected_by_user_id");

-- CreateIndex
CREATE INDEX "ix_system_incidents_evidence_item_id_organisation_id" ON "platform_system_incidents"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_system_incidents_workspace_id_organisation_id" ON "platform_system_incidents"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_system_incidents_created_by_user_id" ON "platform_system_incidents"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_system_incidents_id_organisation" ON "platform_system_incidents"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_user_preferences_organisation_status" ON "platform_user_preferences"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_user_preferences_organisation_id" ON "platform_user_preferences"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_user_preferences_user_id" ON "platform_user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "ix_user_preferences_workspace_id_organisation_id" ON "platform_user_preferences"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_user_preferences_created_by_user_id" ON "platform_user_preferences"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_preferences_id_organisation" ON "platform_user_preferences"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhook_deliveries_organisation_status" ON "platform_webhook_deliveries"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_webhook_deliveries_organisation_id" ON "platform_webhook_deliveries"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhook_deliveries_webhook_id" ON "platform_webhook_deliveries"("webhook_id");

-- CreateIndex
CREATE INDEX "ix_webhook_deliveries_subscription_id" ON "platform_webhook_deliveries"("subscription_id");

-- CreateIndex
CREATE INDEX "ix_webhook_deliveries_workspace_id_organisation_id" ON "platform_webhook_deliveries"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhook_deliveries_created_by_user_id" ON "platform_webhook_deliveries"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_webhook_deliveries_id_organisation" ON "platform_webhook_deliveries"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhook_subscriptions_organisation_status" ON "platform_webhook_subscriptions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_webhook_subscriptions_organisation_id" ON "platform_webhook_subscriptions"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhook_subscriptions_webhook_id" ON "platform_webhook_subscriptions"("webhook_id");

-- CreateIndex
CREATE INDEX "ix_webhook_subscriptions_workspace_id_organisation_id" ON "platform_webhook_subscriptions"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhook_subscriptions_created_by_user_id" ON "platform_webhook_subscriptions"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_webhook_subscriptions_id_organisation" ON "platform_webhook_subscriptions"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhooks_organisation_status" ON "platform_webhooks"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_webhooks_organisation_id" ON "platform_webhooks"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_webhooks_created_by_user_id" ON "platform_webhooks"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_webhooks_workspace_id_organisation_id" ON "platform_webhooks"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_webhooks_id_organisation" ON "platform_webhooks"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_workspace_preferences_organisation_status" ON "platform_workspace_preferences"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_workspace_preferences_organisation_id" ON "platform_workspace_preferences"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_workspace_preferences_workspace_id_organisation_id" ON "platform_workspace_preferences"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_workspace_preferences_created_by_user_id" ON "platform_workspace_preferences"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_workspace_preferences_id_organisation" ON "platform_workspace_preferences"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_acknowledgements_organisation_status" ON "production_call_sheet_acknowledgements"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_call_sheet_acknowledgements_organisation_id" ON "production_call_sheet_acknowledgements"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_acknowledgements_call_sheet_id" ON "production_call_sheet_acknowledgements"("call_sheet_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_acknowledgements_user_id" ON "production_call_sheet_acknowledgements"("user_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_acknowledgements_workspace_id_organisation_id" ON "production_call_sheet_acknowledgements"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_acknowledgements_created_by_user_id" ON "production_call_sheet_acknowledgements"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_call_sheet_acknowledgements_id_organisation" ON "production_call_sheet_acknowledgements"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_recipients_organisation_status" ON "production_call_sheet_recipients"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_call_sheet_recipients_organisation_id" ON "production_call_sheet_recipients"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_recipients_call_sheet_id" ON "production_call_sheet_recipients"("call_sheet_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_recipients_user_id" ON "production_call_sheet_recipients"("user_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_recipients_workspace_id_organisation_id" ON "production_call_sheet_recipients"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_recipients_created_by_user_id" ON "production_call_sheet_recipients"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_call_sheet_recipients_id_organisation" ON "production_call_sheet_recipients"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_versions_organisation_status" ON "production_call_sheet_versions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_call_sheet_versions_organisation_id" ON "production_call_sheet_versions"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_versions_call_sheet_id" ON "production_call_sheet_versions"("call_sheet_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_versions_created_by_user_id" ON "production_call_sheet_versions"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_call_sheet_versions_workspace_id_organisation_id" ON "production_call_sheet_versions"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_call_sheet_versions_id_organisation" ON "production_call_sheet_versions"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheets_organisation_status" ON "production_call_sheets"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_call_sheets_organisation_id" ON "production_call_sheets"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheets_project_id_organisation_id" ON "production_call_sheets"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_call_sheets_production_day_id" ON "production_call_sheets"("production_day_id");

-- CreateIndex
CREATE INDEX "ix_call_sheets_created_by_user_id" ON "production_call_sheets"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_call_sheets_workspace_id_organisation_id" ON "production_call_sheets"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_call_sheets_id_organisation" ON "production_call_sheets"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_organisation_status" ON "production_daily_production_reports"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_organisation_id" ON "production_daily_production_reports"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_project_id_organisation_id" ON "production_daily_production_reports"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_production_day_id" ON "production_daily_production_reports"("production_day_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_submitted_by_user_id" ON "production_daily_production_reports"("submitted_by_user_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_evidence_item_id_organisation_id" ON "production_daily_production_reports"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_workspace_id_organisation_id" ON "production_daily_production_reports"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_daily_production_reports_created_by_user_id" ON "production_daily_production_reports"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_daily_production_reports_id_organisation" ON "production_daily_production_reports"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_delays_organisation_status" ON "production_delays"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_delays_organisation_id" ON "production_delays"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_delays_production_day_id" ON "production_delays"("production_day_id");

-- CreateIndex
CREATE INDEX "ix_delays_reported_by_user_id" ON "production_delays"("reported_by_user_id");

-- CreateIndex
CREATE INDEX "ix_delays_workspace_id_organisation_id" ON "production_delays"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_delays_created_by_user_id" ON "production_delays"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_delays_id_organisation" ON "production_delays"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_incidents_organisation_status" ON "production_incidents"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_incidents_organisation_id" ON "production_incidents"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_incidents_production_day_id" ON "production_incidents"("production_day_id");

-- CreateIndex
CREATE INDEX "ix_incidents_reported_by_user_id" ON "production_incidents"("reported_by_user_id");

-- CreateIndex
CREATE INDEX "ix_incidents_evidence_item_id_organisation_id" ON "production_incidents"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_incidents_workspace_id_organisation_id" ON "production_incidents"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_incidents_created_by_user_id" ON "production_incidents"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_incidents_id_organisation" ON "production_incidents"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_live_attendance_organisation_status" ON "production_live_attendance"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_live_attendance_organisation_id" ON "production_live_attendance"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_live_attendance_production_day_id" ON "production_live_attendance"("production_day_id");

-- CreateIndex
CREATE INDEX "ix_live_attendance_user_id" ON "production_live_attendance"("user_id");

-- CreateIndex
CREATE INDEX "ix_live_attendance_workspace_id_organisation_id" ON "production_live_attendance"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_live_attendance_created_by_user_id" ON "production_live_attendance"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_live_attendance_id_organisation" ON "production_live_attendance"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_calendars_organisation_status" ON "production_production_calendars"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_production_calendars_organisation_id" ON "production_production_calendars"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_calendars_project_id_organisation_id" ON "production_production_calendars"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_calendars_workspace_id_organisation_id" ON "production_production_calendars"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_calendars_created_by_user_id" ON "production_production_calendars"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_production_calendars_id_organisation" ON "production_production_calendars"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_days_organisation_status" ON "production_production_days"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_production_days_organisation_id" ON "production_production_days"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_days_project_id_organisation_id" ON "production_production_days"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_days_calendar_id_organisation_id" ON "production_production_days"("calendar_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_days_workspace_id_organisation_id" ON "production_production_days"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_production_days_created_by_user_id" ON "production_production_days"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_production_days_id_organisation" ON "production_production_days"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_scene_progress_organisation_status" ON "production_scene_progress"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_scene_progress_organisation_id" ON "production_scene_progress"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_scene_progress_production_day_id_organisation_id" ON "production_scene_progress"("production_day_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_scene_progress_strip_id" ON "production_scene_progress"("strip_id");

-- CreateIndex
CREATE INDEX "ix_scene_progress_workspace_id_organisation_id" ON "production_scene_progress"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_scene_progress_created_by_user_id" ON "production_scene_progress"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_scene_progress_id_organisation" ON "production_scene_progress"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedule_items_organisation_status" ON "production_schedule_items"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_schedule_items_organisation_id" ON "production_schedule_items"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedule_items_schedule_id" ON "production_schedule_items"("schedule_id");

-- CreateIndex
CREATE INDEX "ix_schedule_items_schedule_version_id" ON "production_schedule_items"("schedule_version_id");

-- CreateIndex
CREATE INDEX "ix_schedule_items_project_milestone_id_organisation_id" ON "production_schedule_items"("project_milestone_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedule_items_workspace_id_organisation_id" ON "production_schedule_items"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedule_items_created_by_user_id" ON "production_schedule_items"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_schedule_items_id_organisation" ON "production_schedule_items"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedule_versions_organisation_status" ON "production_schedule_versions"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_schedule_versions_organisation_id" ON "production_schedule_versions"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedule_versions_schedule_id" ON "production_schedule_versions"("schedule_id");

-- CreateIndex
CREATE INDEX "ix_schedule_versions_created_by_user_id" ON "production_schedule_versions"("created_by_user_id");

-- CreateIndex
CREATE INDEX "ix_schedule_versions_workspace_id_organisation_id" ON "production_schedule_versions"("workspace_id", "organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_schedule_versions_id_organisation" ON "production_schedule_versions"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedules_organisation_status" ON "production_schedules"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_schedules_organisation_id" ON "production_schedules"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedules_project_id_organisation_id" ON "production_schedules"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedules_workspace_id_organisation_id" ON "production_schedules"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_schedules_created_by_user_id" ON "production_schedules"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_schedules_id_organisation" ON "production_schedules"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shoot_days_organisation_status" ON "production_shoot_days"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_shoot_days_organisation_id" ON "production_shoot_days"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_shoot_days_production_day_id_organisation_id" ON "production_shoot_days"("production_day_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shoot_days_workspace_id_organisation_id" ON "production_shoot_days"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shoot_days_created_by_user_id" ON "production_shoot_days"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_shoot_days_id_organisation" ON "production_shoot_days"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shot_progress_organisation_status" ON "production_shot_progress"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_shot_progress_organisation_id" ON "production_shot_progress"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_shot_progress_production_day_id_organisation_id" ON "production_shot_progress"("production_day_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shot_progress_scene_progress_id_organisation_id" ON "production_shot_progress"("scene_progress_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shot_progress_workspace_id_organisation_id" ON "production_shot_progress"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_shot_progress_created_by_user_id" ON "production_shot_progress"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_shot_progress_id_organisation" ON "production_shot_progress"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_stripboards_organisation_status" ON "production_stripboards"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_stripboards_organisation_id" ON "production_stripboards"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_stripboards_project_id_organisation_id" ON "production_stripboards"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_stripboards_schedule_id_organisation_id" ON "production_stripboards"("schedule_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_stripboards_workspace_id_organisation_id" ON "production_stripboards"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_stripboards_created_by_user_id" ON "production_stripboards"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_stripboards_id_organisation" ON "production_stripboards"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_strips_organisation_status" ON "production_strips"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_strips_organisation_id" ON "production_strips"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_strips_stripboard_id_organisation_id" ON "production_strips"("stripboard_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_strips_production_day_id_organisation_id" ON "production_strips"("production_day_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_strips_workspace_id_organisation_id" ON "production_strips"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_strips_created_by_user_id" ON "production_strips"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_strips_id_organisation" ON "production_strips"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_wrap_reports_organisation_status" ON "production_wrap_reports"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_wrap_reports_organisation_id" ON "production_wrap_reports"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_wrap_reports_production_day_id_organisation_id" ON "production_wrap_reports"("production_day_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_wrap_reports_submitted_by_user_id" ON "production_wrap_reports"("submitted_by_user_id");

-- CreateIndex
CREATE INDEX "ix_wrap_reports_workspace_id_organisation_id" ON "production_wrap_reports"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_wrap_reports_created_by_user_id" ON "production_wrap_reports"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_wrap_reports_id_organisation" ON "production_wrap_reports"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_activity_organisation_status" ON "project_project_activity"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_activity_organisation_id" ON "project_project_activity"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_activity_project_id_organisation_id" ON "project_project_activity"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_activity_actor_user_id" ON "project_project_activity"("actor_user_id");

-- CreateIndex
CREATE INDEX "ix_project_activity_workspace_id_organisation_id" ON "project_project_activity"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_activity_created_by_user_id" ON "project_project_activity"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_activity_id_organisation" ON "project_project_activity"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_blockers_organisation_status" ON "project_project_blockers"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_blockers_organisation_id" ON "project_project_blockers"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_blockers_project_id_organisation_id" ON "project_project_blockers"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_blockers_task_id" ON "project_project_blockers"("task_id");

-- CreateIndex
CREATE INDEX "ix_project_blockers_owner_user_id" ON "project_project_blockers"("owner_user_id");

-- CreateIndex
CREATE INDEX "ix_project_blockers_workspace_id_organisation_id" ON "project_project_blockers"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_blockers_created_by_user_id" ON "project_project_blockers"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_blockers_id_organisation" ON "project_project_blockers"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_briefs_organisation_status" ON "project_project_briefs"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_briefs_organisation_id" ON "project_project_briefs"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_briefs_project_id_organisation_id" ON "project_project_briefs"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_briefs_authored_by_user_id" ON "project_project_briefs"("authored_by_user_id");

-- CreateIndex
CREATE INDEX "ix_project_briefs_evidence_item_id_organisation_id" ON "project_project_briefs"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_briefs_workspace_id_organisation_id" ON "project_project_briefs"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_briefs_created_by_user_id" ON "project_project_briefs"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_briefs_id_organisation" ON "project_project_briefs"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_organisation_status" ON "project_project_closeouts"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_organisation_id" ON "project_project_closeouts"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_project_id_organisation_id" ON "project_project_closeouts"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_approved_by_user_id" ON "project_project_closeouts"("approved_by_user_id");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_evidence_item_id_organisation_id" ON "project_project_closeouts"("evidence_item_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_workspace_id_organisation_id" ON "project_project_closeouts"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_closeouts_created_by_user_id" ON "project_project_closeouts"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_closeouts_id_organisation" ON "project_project_closeouts"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_health_snapshots_organisation_status" ON "project_project_health_snapshots"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_health_snapshots_organisation_id" ON "project_project_health_snapshots"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_health_snapshots_project_id_organisation_id" ON "project_project_health_snapshots"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_health_snapshots_workspace_id_organisation_id" ON "project_project_health_snapshots"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_health_snapshots_created_by_user_id" ON "project_project_health_snapshots"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_health_snapshots_id_organisation" ON "project_project_health_snapshots"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_intakes_organisation_status" ON "project_project_intakes"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_intakes_organisation_id" ON "project_project_intakes"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_intakes_submitted_by_user_id" ON "project_project_intakes"("submitted_by_user_id");

-- CreateIndex
CREATE INDEX "ix_project_intakes_workspace_id_organisation_id" ON "project_project_intakes"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_intakes_created_by_user_id" ON "project_project_intakes"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_intakes_id_organisation" ON "project_project_intakes"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "project_members_user_status_idx" ON "project_project_members"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_pair_unique" ON "project_project_members"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "ix_project_milestones_organisation_status" ON "project_project_milestones"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_milestones_organisation_id" ON "project_project_milestones"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_milestones_project_id_organisation_id" ON "project_project_milestones"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_milestones_owner_user_id" ON "project_project_milestones"("owner_user_id");

-- CreateIndex
CREATE INDEX "ix_project_milestones_workspace_id_organisation_id" ON "project_project_milestones"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_milestones_created_by_user_id" ON "project_project_milestones"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_milestones_id_organisation" ON "project_project_milestones"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_notes_organisation_status" ON "project_project_notes"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_notes_organisation_id" ON "project_project_notes"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_notes_project_id_organisation_id" ON "project_project_notes"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_notes_author_user_id" ON "project_project_notes"("author_user_id");

-- CreateIndex
CREATE INDEX "ix_project_notes_workspace_id_organisation_id" ON "project_project_notes"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_notes_created_by_user_id" ON "project_project_notes"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_notes_id_organisation" ON "project_project_notes"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_status_history_organisation_status" ON "project_project_status_history"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_status_history_organisation_id" ON "project_project_status_history"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_status_history_project_id_organisation_id" ON "project_project_status_history"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_status_history_changed_by_user_id" ON "project_project_status_history"("changed_by_user_id");

-- CreateIndex
CREATE INDEX "ix_project_status_history_workspace_id_organisation_id" ON "project_project_status_history"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_status_history_created_by_user_id" ON "project_project_status_history"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_status_history_id_organisation" ON "project_project_status_history"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tag_links_organisation_status" ON "project_project_tag_links"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_tag_links_organisation_id" ON "project_project_tag_links"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tag_links_project_id_organisation_id" ON "project_project_tag_links"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tag_links_project_tag_id" ON "project_project_tag_links"("project_tag_id");

-- CreateIndex
CREATE INDEX "ix_project_tag_links_workspace_id_organisation_id" ON "project_project_tag_links"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tag_links_created_by_user_id" ON "project_project_tag_links"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_tag_links_id_organisation" ON "project_project_tag_links"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tags_organisation_status" ON "project_project_tags"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_tags_organisation_id" ON "project_project_tags"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tags_project_type_id" ON "project_project_tags"("project_type_id");

-- CreateIndex
CREATE INDEX "ix_project_tags_created_by_user_id" ON "project_project_tags"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_tags_id_organisation" ON "project_project_tags"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tasks_organisation_status" ON "project_project_tasks"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_project_tasks_organisation_id" ON "project_project_tasks"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tasks_project_id_organisation_id" ON "project_project_tasks"("project_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tasks_assignee_user_id" ON "project_project_tasks"("assignee_user_id");

-- CreateIndex
CREATE INDEX "ix_project_tasks_parent_task_id" ON "project_project_tasks"("parent_task_id");

-- CreateIndex
CREATE INDEX "ix_project_tasks_workspace_id_organisation_id" ON "project_project_tasks"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_project_tasks_created_by_user_id" ON "project_project_tasks"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_tasks_id_organisation" ON "project_project_tasks"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "projects_tenant_status_idx" ON "project_projects"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "projects_workspace_status_idx" ON "project_projects"("workspace_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "projects_workspace_slug_unique" ON "project_projects"("workspace_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_organisation_unique" ON "project_projects"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_checklists_organisation_status" ON "project_task_checklists"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_task_checklists_organisation_id" ON "project_task_checklists"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_checklists_task_id_organisation_id" ON "project_task_checklists"("task_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_checklists_completed_by_user_id" ON "project_task_checklists"("completed_by_user_id");

-- CreateIndex
CREATE INDEX "ix_task_checklists_workspace_id_organisation_id" ON "project_task_checklists"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_checklists_created_by_user_id" ON "project_task_checklists"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_task_checklists_id_organisation" ON "project_task_checklists"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_dependencies_organisation_status" ON "project_task_dependencies"("organisation_id", "status");

-- CreateIndex
CREATE INDEX "ix_task_dependencies_organisation_id" ON "project_task_dependencies"("organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_dependencies_task_id_organisation_id" ON "project_task_dependencies"("task_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_dependencies_depends_on_task_id_organisation_id" ON "project_task_dependencies"("depends_on_task_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_dependencies_workspace_id_organisation_id" ON "project_task_dependencies"("workspace_id", "organisation_id");

-- CreateIndex
CREATE INDEX "ix_task_dependencies_created_by_user_id" ON "project_task_dependencies"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_task_dependencies_id_organisation" ON "project_task_dependencies"("id", "organisation_id");

-- CreateIndex
CREATE INDEX "case_studies_created_idx" ON "public_case_studies"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_slug_locale_uq" ON "public_case_studies"("slug", "locale");

-- CreateIndex
CREATE INDEX "contact_requests_created_idx" ON "public_contact_requests"("created_at");

-- CreateIndex
CREATE INDEX "cookie_consents_created_idx" ON "public_cookie_consents"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cookie_consents_consent_id_uq" ON "public_cookie_consents"("consent_id");

-- CreateIndex
CREATE INDEX "demo_requests_created_idx" ON "public_demo_requests"("created_at");

-- CreateIndex
CREATE INDEX "documentation_pages_created_idx" ON "public_documentation_pages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "documentation_pages_slug_locale_uq" ON "public_documentation_pages"("slug", "locale");

-- CreateIndex
CREATE INDEX "industry_pages_created_idx" ON "public_industry_pages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "industry_pages_slug_locale_uq" ON "public_industry_pages"("slug", "locale");

-- CreateIndex
CREATE INDEX "legal_documents_created_idx" ON "public_legal_documents"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "legal_documents_document_kind_version_label_locale_uq" ON "public_legal_documents"("document_kind", "version_label", "locale");

-- CreateIndex
CREATE INDEX "marketing_events_created_idx" ON "public_marketing_events"("created_at");

-- CreateIndex
CREATE INDEX "marketing_leads_created_idx" ON "public_marketing_leads"("created_at");

-- CreateIndex
CREATE INDEX "pricing_plans_created_idx" ON "public_pricing_plans"("created_at");

-- CreateIndex
CREATE INDEX "product_pages_created_idx" ON "public_product_pages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "product_pages_slug_locale_uq" ON "public_product_pages"("slug", "locale");

-- CreateIndex
CREATE INDEX "solution_pages_created_idx" ON "public_solution_pages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "solution_pages_slug_locale_uq" ON "public_solution_pages"("slug", "locale");
