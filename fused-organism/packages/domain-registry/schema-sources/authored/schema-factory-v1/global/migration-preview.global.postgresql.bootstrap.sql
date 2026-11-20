-- STATUS: GENERATED REVIEW-ONLY EMPTY-DATABASE BOOTSTRAP PREVIEW; NOT AN APPROVED MIGRATION.
-- Canonical 352-table schema input; no target baseline, data migration, or provider enforcement overlay is included.
-- Do not execute. Review M4 target compatibility, invariant enforcement, backfill, backup, restore, and rollback evidence first.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "campaign.activation_calendar_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.activation_feed_events#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.activations#activation_status" AS ENUM ('planned', 'ready', 'live', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "campaign.atl_plans#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.btl_plans#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.campaign_briefs#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.campaign_markets#market_status" AS ENUM ('target', 'excluded', 'active');

-- CreateEnum
CREATE TYPE "campaign.campaign_metrics#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.campaign_results#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.campaign_strategies#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.campaigns#campaign_status" AS ENUM ('draft', 'planned', 'active', 'paused', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "campaign.cities#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.dooh_schedules#schedule_status" AS ENUM ('draft', 'approved', 'live', 'ended');

-- CreateEnum
CREATE TYPE "campaign.dooh_screens#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.lead_events#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.leads#lead_status" AS ENUM ('new', 'qualified', 'disqualified', 'converted');

-- CreateEnum
CREATE TYPE "campaign.markets#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.media_plan_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.media_plans#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.ooh_site_bookings#booking_status" AS ENUM ('held', 'confirmed', 'cancelled', 'live', 'completed');

-- CreateEnum
CREATE TYPE "campaign.ooh_sites#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "campaign.site_checkins#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "communications_announcements_audience_kind" AS ENUM ('ORGANISATION', 'WORKSPACE');

-- CreateEnum
CREATE TYPE "communications_announcements_status" AS ENUM ('draft', 'scheduled', 'published', 'expired', 'retired');

-- CreateEnum
CREATE TYPE "communications_communication_threads_kind" AS ENUM ('group', 'direct', 'announcement');

-- CreateEnum
CREATE TYPE "communications_communication_threads_status" AS ENUM ('open', 'closed', 'archived');

-- CreateEnum
CREATE TYPE "communications_messages_state" AS ENUM ('visible', 'redacted');

-- CreateEnum
CREATE TYPE "communications_notification_deliveries_channel" AS ENUM ('in_app', 'email', 'push');

-- CreateEnum
CREATE TYPE "communications_notification_deliveries_status" AS ENUM ('queued', 'sending', 'sent', 'delivered', 'failed', 'suppressed');

-- CreateEnum
CREATE TYPE "communications_notification_preferences_channel" AS ENUM ('in_app', 'email', 'push');

-- CreateEnum
CREATE TYPE "communications_notifications_state" AS ENUM ('unread', 'read', 'dismissed');

-- CreateEnum
CREATE TYPE "communications_thread_members_role" AS ENUM ('member', 'moderator');

-- CreateEnum
CREATE TYPE "creative.asset_versions#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.character_scene_links#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.characters#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.creative_approvals#decision" AS ENUM ('pending', 'approved', 'rejected', 'changes_requested');

-- CreateEnum
CREATE TYPE "creative.creative_approvals#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.creative_assets#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.creative_references#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.ideas#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.production_elements#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.research_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.scene_elements#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.scene_versions#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.scenes#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.script_breakdowns#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.script_versions#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.scripts#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.shot_lists#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.shots#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.storyboard_frames#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.storyboards#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "creative.treatments#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.board_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.boards#board_status" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.cad_models#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.decision_graph_edges#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.decision_graph_nodes#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.decision_graphs#graph_status" AS ENUM ('draft', 'active', 'retired');

-- CreateEnum
CREATE TYPE "eventsspatial.event_journeys#journey_status" AS ENUM ('draft', 'active', 'retired');

-- CreateEnum
CREATE TYPE "eventsspatial.event_timeline_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.events#event_status" AS ENUM ('draft', 'planning', 'confirmed', 'live', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "eventsspatial.exhibition_layouts#layout_status" AS ENUM ('draft', 'review', 'approved', 'published');

-- CreateEnum
CREATE TYPE "eventsspatial.film_twins#twin_status" AS ENUM ('draft', 'synchronized', 'stale', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.presentation_slides#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.presentations#presentation_status" AS ENUM ('draft', 'ready', 'published', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.run_of_show_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.simulations#simulation_status" AS ENUM ('queued', 'running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "eventsspatial.spatial_layers#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.spatial_layouts#layout_status" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.spatial_objects#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.spatial_operations#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.spatial_projects#project_status" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.venue_bookings#booking_status" AS ENUM ('held', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "eventsspatial.venues#venue_status" AS ENUM ('active', 'restricted', 'retired');

-- CreateEnum
CREATE TYPE "eventsspatial.wedding_events#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "eventsspatial.wedding_journeys#journey_status" AS ENUM ('planned', 'active', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "eventsspatial.weddings#wedding_status" AS ENUM ('inquiry', 'planning', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "evidence.approval_comments#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.approval_decisions#decision" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "evidence.approval_decisions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.approval_steps#status" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "evidence.approvals#approval_state" AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "evidence.before_after_proofs#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.chain_of_custody_events#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.change_requests#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "evidence.document_links#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.document_versions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.documents#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_gps#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_items#evidence_kind" AS ENUM ('document', 'image', 'video', 'audio', 'dataset', 'other');

-- CreateEnum
CREATE TYPE "evidence.evidence_items#evidence_status" AS ENUM ('active', 'quarantined', 'withdrawn');

-- CreateEnum
CREATE TYPE "evidence.evidence_links#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_media#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_metadata#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_timeline_events#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_timestamps#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.evidence_verifications#outcome" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "evidence.evidence_verifications#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.legal_holds#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "evidence.risk_mitigations#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "evidence.risks#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "evidence.trusted_timestamps#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "finance.budget_categories#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.budget_lines#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.budgets#budget_status" AS ENUM ('draft', 'submitted', 'approved', 'locked', 'closed');

-- CreateEnum
CREATE TYPE "finance.cashflow_entries#direction" AS ENUM ('inflow', 'outflow');

-- CreateEnum
CREATE TYPE "finance.cashflow_entries#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.commitments#commitment_status" AS ENUM ('open', 'partially_invoiced', 'closed', 'cancelled');

-- CreateEnum
CREATE TYPE "finance.cost_sheet_lines#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.cost_sheets#sheet_status" AS ENUM ('draft', 'review', 'approved', 'locked');

-- CreateEnum
CREATE TYPE "finance.currencies#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.estimate_lines#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.estimates#estimate_status" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "finance.exchange_rates#rate_status" AS ENUM ('proposed', 'verified', 'retired');

-- CreateEnum
CREATE TYPE "finance.expense_approvals#decision" AS ENUM ('pending', 'approved', 'rejected', 'changes_requested');

-- CreateEnum
CREATE TYPE "finance.expense_approvals#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.expense_lines#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.expenses#expense_status" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'paid');

-- CreateEnum
CREATE TYPE "finance.invoice_approvals#decision" AS ENUM ('pending', 'approved', 'rejected', 'changes_requested');

-- CreateEnum
CREATE TYPE "finance.invoice_approvals#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.invoice_lines#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.payment_allocations#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.payment_verifications#verification_status" AS ENUM ('pending', 'verified', 'failed');

-- CreateEnum
CREATE TYPE "finance.payments#payment_status" AS ENUM ('pending', 'authorized', 'settled', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "finance.profitability_snapshots#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.tax_codes#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "finance.vendor_invoices#invoice_status" AS ENUM ('received', 'matched', 'approved', 'disputed', 'paid');

-- CreateEnum
CREATE TYPE "identity.access_policies#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.access_reviews#decision" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "identity.access_reviews#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.auth_accounts#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.auth_challenges#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.auth_credentials#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.delegations#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "identity.device_verifications#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.devices#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.invitations#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.location_verifications#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.nda_acceptances#status" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "identity.nda_versions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.ndas#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.otp_challenges#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.password_reset_tokens#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.permissions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.role_permissions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.roles#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.signatures#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.user_emails#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.user_phones#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.user_roles#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "identity.users#account_status" AS ENUM ('active', 'disabled', 'closed');

-- CreateEnum
CREATE TYPE "intelligence.ai_citations#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.ai_contexts#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.ai_conversations#conversation_status" AS ENUM ('active', 'archived', 'closed');

-- CreateEnum
CREATE TYPE "intelligence.ai_messages#role" AS ENUM ('system', 'user', 'assistant', 'tool');

-- CreateEnum
CREATE TYPE "intelligence.ai_messages#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.ai_suggestions#status" AS ENUM ('pending', 'accepted', 'dismissed', 'expired');

-- CreateEnum
CREATE TYPE "intelligence.analytics_events#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.evidence_aware_answers#grounding_status" AS ENUM ('grounded', 'partial', 'ungrounded');

-- CreateEnum
CREATE TYPE "intelligence.forecast_runs#run_status" AS ENUM ('queued', 'running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "intelligence.forecast_scenarios#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.generation_jobs#job_status" AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "intelligence.intelligence_runs#run_status" AS ENUM ('queued', 'running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "intelligence.intelligence_signals#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.knowledge_chunks#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.knowledge_documents#document_status" AS ENUM ('queued', 'indexed', 'failed', 'retired');

-- CreateEnum
CREATE TYPE "intelligence.kpi_definitions#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.kpi_measurements#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.model_registry#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.model_runs#run_status" AS ENUM ('requested', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "intelligence.prompt_templates#template_status" AS ENUM ('draft', 'active', 'retired');

-- CreateEnum
CREATE TYPE "intelligence.research_sessions#session_status" AS ENUM ('open', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "intelligence.research_sources#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "intelligence.saved_insights#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.deal_room_members#access_status" AS ENUM ('invited', 'active', 'revoked');

-- CreateEnum
CREATE TYPE "investor.deal_rooms#room_status" AS ENUM ('draft', 'open', 'closed', 'archived');

-- CreateEnum
CREATE TYPE "investor.disclosures#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.distribution_channels#channel_status" AS ENUM ('active', 'paused', 'retired');

-- CreateEnum
CREATE TYPE "investor.distribution_deals#deal_status" AS ENUM ('draft', 'offered', 'active', 'expired', 'terminated');

-- CreateEnum
CREATE TYPE "investor.due_diligence_items#item_status" AS ENUM ('open', 'in_review', 'answered', 'accepted', 'waived');

-- CreateEnum
CREATE TYPE "investor.funding_requirements#requirement_status" AS ENUM ('proposed', 'approved', 'met', 'waived');

-- CreateEnum
CREATE TYPE "investor.investment_opportunities#opportunity_status" AS ENUM ('draft', 'open', 'closed', 'filled', 'cancelled');

-- CreateEnum
CREATE TYPE "investor.investment_profiles#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.investment_tranches#tranche_status" AS ENUM ('planned', 'approved', 'released', 'cancelled');

-- CreateEnum
CREATE TYPE "investor.investor_accounts#account_status" AS ENUM ('pending', 'verified', 'blocked', 'closed');

-- CreateEnum
CREATE TYPE "investor.investor_commitments#commitment_status" AS ENUM ('indication', 'committed', 'withdrawn', 'settled');

-- CreateEnum
CREATE TYPE "investor.investor_evidence_links#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.investor_progress_reports#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.investor_returns#return_status" AS ENUM ('estimated', 'approved', 'paid', 'void');

-- CreateEnum
CREATE TYPE "investor.pitch_decks#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.recoupment_models#model_status" AS ENUM ('draft', 'active', 'retired');

-- CreateEnum
CREATE TYPE "investor.recoupment_tiers#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.revenue_entries#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.rights_windows#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "investor.rights#rights_status" AS ENUM ('proposed', 'granted', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "logistics.accommodations#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.drivers#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.equipment_bookings#booking_status" AS ENUM ('held', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "logistics.equipment_categories#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.equipment_checkouts#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.equipment_inventory_events#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.equipment_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.equipment_kits#kit_status" AS ENUM ('active', 'retired');

-- CreateEnum
CREATE TYPE "logistics.equipment_maintenance#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.equipment_returns#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.location_bookings#booking_status" AS ENUM ('held', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "logistics.location_comparisons#decision" AS ENUM ('open', 'selected', 'rejected');

-- CreateEnum
CREATE TYPE "logistics.location_comparisons#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.location_media#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.locations#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.logistics_tasks#task_status" AS ENUM ('open', 'in_progress', 'blocked', 'done');

-- CreateEnum
CREATE TYPE "logistics.permit_documents#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.permits#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.recce_media#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.recces#decision" AS ENUM ('planned', 'shortlisted', 'rejected', 'approved');

-- CreateEnum
CREATE TYPE "logistics.recces#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.room_allocations#allocation_status" AS ENUM ('held', 'assigned', 'released');

-- CreateEnum
CREATE TYPE "logistics.shipments#shipment_status" AS ENUM ('preparing', 'in_transit', 'delivered', 'returned');

-- CreateEnum
CREATE TYPE "logistics.transport_plans#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.travel_legs#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "logistics.travel_plans#travel_status" AS ENUM ('draft', 'approved', 'booked', 'cancelled');

-- CreateEnum
CREATE TYPE "logistics.vehicle_assignments#assignment_status" AS ENUM ('planned', 'assigned', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "logistics.vehicles#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.capability_packs#pack_status" AS ENUM ('active', 'retired');

-- CreateEnum
CREATE TYPE "marketplace.deliveries#delivery_status" AS ENUM ('planned', 'in_transit', 'delivered', 'exception');

-- CreateEnum
CREATE TYPE "marketplace.marketplace_categories#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.marketplace_services#service_status" AS ENUM ('draft', 'active', 'retired');

-- CreateEnum
CREATE TYPE "marketplace.procurement_awards#decision" AS ENUM ('pending', 'awarded', 'not_awarded');

-- CreateEnum
CREATE TYPE "marketplace.procurement_awards#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.purchase_order_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.purchase_orders#order_status" AS ENUM ('draft', 'issued', 'acknowledged', 'fulfilled', 'cancelled');

-- CreateEnum
CREATE TYPE "marketplace.quote_comparisons#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.quote_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.quotes#quote_status" AS ENUM ('draft', 'submitted', 'accepted', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "marketplace.rfq_items#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.rfq_recipients#response_status" AS ENUM ('invited', 'viewed', 'declined', 'responded');

-- CreateEnum
CREATE TYPE "marketplace.rfqs#rfq_status" AS ENUM ('draft', 'issued', 'closed', 'awarded', 'cancelled');

-- CreateEnum
CREATE TYPE "marketplace.service_deliveries#acceptance_status" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "marketplace.service_skus#sku_status" AS ENUM ('active', 'retired');

-- CreateEnum
CREATE TYPE "marketplace.vendor_availability#availability_status" AS ENUM ('available', 'held', 'unavailable');

-- CreateEnum
CREATE TYPE "marketplace.vendor_capabilities#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.vendor_performance#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.vendor_portfolios#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "marketplace.vendor_profiles#profile_status" AS ENUM ('draft', 'published', 'hidden');

-- CreateEnum
CREATE TYPE "marketplace.vendor_ratings#rating_status" AS ENUM ('pending', 'published', 'hidden');

-- CreateEnum
CREATE TYPE "marketplace.vendors#vendor_status" AS ENUM ('pending', 'verified', 'suspended', 'retired');

-- CreateEnum
CREATE TYPE "organisation.organisation_memberships#membership_role" AS ENUM ('owner', 'admin', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "organisation.organisation_memberships#membership_status" AS ENUM ('active', 'invited', 'suspended', 'revoked');

-- CreateEnum
CREATE TYPE "organisation.organisations#organisation_status" AS ENUM ('active', 'suspended', 'closed');

-- CreateEnum
CREATE TYPE "organisation.workspace_memberships#membership_status" AS ENUM ('active', 'invited', 'suspended', 'revoked');

-- CreateEnum
CREATE TYPE "organisation.workspace_memberships#workspace_role" AS ENUM ('admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "organisation.workspaces#workspace_status" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "people.attendance_records#status" AS ENUM ('expected', 'present', 'late', 'absent', 'excused', 'checked_out');

-- CreateEnum
CREATE TYPE "people.audition_media#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.audition_submissions#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.cast_assignments#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.cast_messages#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.cast_schedule_entries#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.casting_approvals#status" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "people.casting_call_roles#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.casting_calls#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.crew_assignments#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.crew_availability#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.crew_contracts#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.crew_hiring_requests#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.crew_messages#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.crew_profiles#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.crew_shortlist_items#decision" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "people.crew_shortlist_items#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.crew_shortlists#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.crew_skills#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.department_members#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.departments#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.hod_assignments#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.performance_reviews#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_availability#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_comparisons#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_contracts#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.talent_media#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_offers#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.talent_portfolios#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_profiles#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_shortlist_items#decision" AS ENUM ('pending', 'approved', 'rejected', 'needs_changes', 'withdrawn');

-- CreateEnum
CREATE TYPE "people.talent_shortlist_items#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "people.talent_shortlists#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "people.timesheets#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.api_keys#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.backup_jobs#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.data_retention_policies#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.export_jobs#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.exports#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.feature_flag_assignments#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.feature_flags#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.integration_connections#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.integration_events#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.integrations#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.restore_jobs#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.runtime_observations#severity" AS ENUM ('low', 'normal', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "platform.runtime_observations#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.share_links#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.status_events#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.support_comments#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.support_tickets#severity" AS ENUM ('low', 'normal', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "platform.support_tickets#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.sync_conflicts#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.sync_jobs#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.sync_queue_items#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.system_incidents#severity" AS ENUM ('low', 'normal', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "platform.system_incidents#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.user_preferences#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.webhook_deliveries#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "platform.webhook_subscriptions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.webhooks#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "platform.workspace_preferences#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "production.call_sheet_acknowledgements#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "production.call_sheet_recipients#delivery_status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.call_sheet_recipients#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "production.call_sheet_versions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "production.call_sheets#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.daily_production_reports#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.delays#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.incidents#severity" AS ENUM ('low', 'normal', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "production.incidents#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.live_attendance#status" AS ENUM ('expected', 'present', 'late', 'absent', 'excused', 'checked_out');

-- CreateEnum
CREATE TYPE "production.production_calendars#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "production.production_days#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.scene_progress#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.schedule_items#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.schedule_versions#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "production.schedules#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.shoot_days#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.shot_progress#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.stripboards#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.strips#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "production.wrap_reports#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_activity#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.project_blockers#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_briefs#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_closeouts#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_health_snapshots#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.project_intakes#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_members#membership_status" AS ENUM ('active', 'invited', 'suspended', 'removed');

-- CreateEnum
CREATE TYPE "project.project_members#project_role" AS ENUM ('owner', 'admin', 'contributor', 'viewer');

-- CreateEnum
CREATE TYPE "project.project_milestones#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_notes#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.project_status_history#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.project_tag_links#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.project_tags#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.project_tasks#priority" AS ENUM ('low', 'normal', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "project.project_tasks#status" AS ENUM ('draft', 'open', 'submitted', 'in_review', 'approved', 'rejected', 'scheduled', 'active', 'completed', 'cancelled', 'closed');

-- CreateEnum
CREATE TYPE "project.project_types#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.projects#project_status" AS ENUM ('draft', 'active', 'on_hold', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "project.task_checklists#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "project.task_dependencies#status" AS ENUM ('active', 'inactive', 'suspended', 'archived', 'revoked');

-- CreateEnum
CREATE TYPE "public.case_studies#case_status" AS ENUM ('draft', 'published', 'withdrawn');

-- CreateEnum
CREATE TYPE "public.contact_requests#request_status" AS ENUM ('new', 'assigned', 'answered', 'closed', 'spam');

-- CreateEnum
CREATE TYPE "public.cookie_consents#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "public.demo_requests#request_status" AS ENUM ('new', 'qualified', 'scheduled', 'completed', 'closed');

-- CreateEnum
CREATE TYPE "public.documentation_pages#page_status" AS ENUM ('draft', 'published', 'retired');

-- CreateEnum
CREATE TYPE "public.industry_pages#page_status" AS ENUM ('draft', 'published', 'retired');

-- CreateEnum
CREATE TYPE "public.legal_documents#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "public.marketing_events#status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "public.marketing_leads#consent_status" AS ENUM ('granted', 'withdrawn', 'unknown');

-- CreateEnum
CREATE TYPE "public.marketing_leads#lead_status" AS ENUM ('new', 'qualified', 'converted', 'unsubscribed');

-- CreateEnum
CREATE TYPE "public.pricing_plans#plan_status" AS ENUM ('draft', 'published', 'retired');

-- CreateEnum
CREATE TYPE "public.product_pages#page_status" AS ENUM ('draft', 'published', 'retired');

-- CreateEnum
CREATE TYPE "public.solution_pages#page_status" AS ENUM ('draft', 'published', 'retired');

-- CreateTable
CREATE TABLE "campaign_activation_calendar_items" (
    "activation_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "item_kind" VARCHAR(60) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "campaign.activation_calendar_items#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_activation_calendar_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_activation_feed_events" (
    "activation_id" UUID NOT NULL,
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "event_kind" VARCHAR(60) NOT NULL,
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "campaign.activation_feed_events#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" VARCHAR(24),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_activation_feed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_activations" (
    "activation_kind" VARCHAR(60) NOT NULL,
    "activation_status" "campaign.activations#activation_status" NOT NULL DEFAULT 'planned',
    "budget" DECIMAL(65,30),
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "location_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "objective" TEXT,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_activations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_atl_plans" (
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "details" TEXT,
    "gross_rating_points" DECIMAL(65,30),
    "id" UUID NOT NULL,
    "media_plan_id" UUID,
    "medium" VARCHAR(80) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "planned_spend" DECIMAL(65,30),
    "reach_target" INTEGER,
    "status" "campaign.atl_plans#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_atl_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_btl_plans" (
    "activation_type" VARCHAR(80) NOT NULL,
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "details" TEXT,
    "id" UUID NOT NULL,
    "locations" JSONB,
    "media_plan_id" UUID,
    "organisation_id" UUID NOT NULL,
    "planned_spend" DECIMAL(65,30),
    "staffing_count" INTEGER,
    "status" "campaign.btl_plans#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_btl_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_campaign_briefs" (
    "audience" TEXT,
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "deliverables" JSONB,
    "due_on" DATE,
    "id" UUID NOT NULL,
    "message" TEXT,
    "organisation_id" UUID NOT NULL,
    "status" "campaign.campaign_briefs#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_campaign_briefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_campaign_markets" (
    "budget_share" DECIMAL(65,30),
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "market_id" UUID NOT NULL,
    "market_status" "campaign.campaign_markets#market_status" NOT NULL DEFAULT 'target',
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_campaign_markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_campaign_metrics" (
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "dimensions" JSONB,
    "id" UUID NOT NULL,
    "metric_key" VARCHAR(100) NOT NULL,
    "metric_name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "period_end" DATE,
    "period_start" DATE,
    "status" "campaign.campaign_metrics#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DECIMAL(65,30) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_campaign_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_campaign_results" (
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "measured_at" TIMESTAMPTZ(6) NOT NULL,
    "measured_value" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "result_kind" VARCHAR(80) NOT NULL,
    "source" VARCHAR(120),
    "status" "campaign.campaign_results#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_campaign_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_campaign_strategies" (
    "campaign_id" UUID NOT NULL,
    "channels" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "positioning" TEXT,
    "status" "campaign.campaign_strategies#status" NOT NULL DEFAULT 'draft',
    "success_criteria" JSONB,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_campaign_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_campaigns" (
    "budget" DECIMAL(65,30),
    "campaign_kind" VARCHAR(60) NOT NULL,
    "campaign_status" "campaign.campaigns#campaign_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "objective" TEXT,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "project_id" UUID NOT NULL,
    "starts_on" DATE,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_cities" (
    "city_code" VARCHAR(40),
    "country_code" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "name" VARCHAR(160) NOT NULL,
    "region" VARCHAR(120),
    "status" "campaign.cities#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_dooh_schedules" (
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "creative_uri" VARCHAR(500),
    "dooh_screen_id" UUID NOT NULL,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "frequency_per_hour" INTEGER,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "schedule_status" "campaign.dooh_schedules#schedule_status" NOT NULL DEFAULT 'draft',
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_dooh_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_dooh_screens" (
    "availability" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "location_id" UUID,
    "location_note" TEXT,
    "organisation_id" UUID NOT NULL,
    "orientation" VARCHAR(24),
    "resolution" VARCHAR(40),
    "screen_code" VARCHAR(80) NOT NULL,
    "screen_name" VARCHAR(160) NOT NULL,
    "status" "campaign.dooh_screens#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_dooh_screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_lead_events" (
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "event_kind" VARCHAR(60) NOT NULL,
    "id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "notes" TEXT,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payload" JSONB,
    "status" "campaign.lead_events#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_lead_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_leads" (
    "assigned_to_user_id" UUID,
    "campaign_id" UUID,
    "consent_status" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "email" VARCHAR(320),
    "full_name" VARCHAR(160),
    "id" UUID NOT NULL,
    "lead_status" "campaign.leads#lead_status" NOT NULL DEFAULT 'new',
    "organisation_id" UUID NOT NULL,
    "organisation_name" VARCHAR(200),
    "phone" VARCHAR(40),
    "source" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_markets" (
    "country_code" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3),
    "id" UUID NOT NULL,
    "market_code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "region" VARCHAR(120),
    "status" "campaign.markets#status" NOT NULL DEFAULT 'draft',
    "timezone" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_media_plan_items" (
    "channel" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "impressions_target" INTEGER,
    "media_plan_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "placement" VARCHAR(120),
    "planned_spend" DECIMAL(65,30),
    "sort_order" INTEGER NOT NULL,
    "starts_on" DATE,
    "status" "campaign.media_plan_items#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_media_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_media_plans" (
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "objective" TEXT,
    "organisation_id" UUID NOT NULL,
    "plan_version" INTEGER NOT NULL,
    "starts_on" DATE,
    "status" "campaign.media_plans#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "total_budget" DECIMAL(65,30),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_media_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_ooh_site_bookings" (
    "booking_status" "campaign.ooh_site_bookings#booking_status" NOT NULL DEFAULT 'held',
    "campaign_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "ooh_site_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "price" DECIMAL(65,30),
    "project_id" UUID NOT NULL,
    "proof_uri" VARCHAR(500),
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_ooh_site_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_ooh_sites" (
    "address" TEXT,
    "availability_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "format" VARCHAR(80),
    "id" UUID NOT NULL,
    "latitude" DECIMAL(65,30),
    "location_id" UUID,
    "longitude" DECIMAL(65,30),
    "organisation_id" UUID NOT NULL,
    "rate_card" DECIMAL(65,30),
    "site_code" VARCHAR(80),
    "site_name" VARCHAR(200) NOT NULL,
    "status" "campaign.ooh_sites#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_ooh_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_site_checkins" (
    "activation_id" UUID NOT NULL,
    "checked_in_at" TIMESTAMPTZ(6) NOT NULL,
    "checked_in_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "latitude" DECIMAL(65,30),
    "location_id" UUID,
    "longitude" DECIMAL(65,30),
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "status" "campaign.site_checkins#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_method" VARCHAR(40),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "campaign_site_checkins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_announcements" (
    "audience_kind" "communications_announcements_audience_kind" NOT NULL,
    "author_user_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "retired_at" TIMESTAMPTZ(6),
    "scheduled_at" TIMESTAMPTZ(6),
    "status" "communications_announcements_status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMPTZ(6),
    "workspace_id" UUID,

    CONSTRAINT "communications_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_communication_threads" (
    "archived_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "kind" "communications_communication_threads_kind" NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "communications_communication_threads_status" NOT NULL DEFAULT 'open',
    "subject" VARCHAR(200),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "communications_communication_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_direct_message_threads" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "participant_high_membership_id" UUID NOT NULL,
    "participant_low_membership_id" UUID NOT NULL,
    "thread_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "communications_direct_message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_message_attachments" (
    "byte_length" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "file_name" VARCHAR(255) NOT NULL,
    "id" UUID NOT NULL,
    "media_type" VARCHAR(200) NOT NULL,
    "message_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sha256" VARCHAR(64) NOT NULL,
    "storage_key" VARCHAR(512) NOT NULL,

    CONSTRAINT "communications_message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_messages" (
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "redacted_at" TIMESTAMPTZ(6),
    "redacted_by_user_id" UUID,
    "redaction_reason" VARCHAR(500),
    "sender_user_id" UUID NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "state" "communications_messages_state" NOT NULL DEFAULT 'visible',
    "thread_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_notification_deliveries" (
    "attempt_number" INTEGER NOT NULL,
    "attempted_at" TIMESTAMPTZ(6),
    "channel" "communications_notification_deliveries_channel" NOT NULL,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMPTZ(6),
    "failed_at" TIMESTAMPTZ(6),
    "failure_code" VARCHAR(100),
    "failure_detail" TEXT,
    "id" UUID NOT NULL,
    "idempotency_key" VARCHAR(200) NOT NULL,
    "notification_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "provider_identifier" VARCHAR(160),
    "provider_reference" VARCHAR(255),
    "response_metadata" JSONB,
    "scheduled_at" TIMESTAMPTZ(6),
    "sent_at" TIMESTAMPTZ(6),
    "status" "communications_notification_deliveries_status" NOT NULL,
    "terminal_at" TIMESTAMPTZ(6),

    CONSTRAINT "communications_notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_notification_preferences" (
    "channel" "communications_notification_preferences_channel" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "id" UUID NOT NULL,
    "notification_type" VARCHAR(80) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "communications_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_notifications" (
    "action_uri" TEXT,
    "actor_user_id" UUID,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissed_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "notification_type" VARCHAR(80) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "read_at" TIMESTAMPTZ(6),
    "recipient_user_id" UUID NOT NULL,
    "resource_id" VARCHAR(255),
    "resource_type" VARCHAR(100),
    "state" "communications_notifications_state" NOT NULL DEFAULT 'unread',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "communications_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications_thread_members" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_read_at" TIMESTAMPTZ(6),
    "left_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "role" "communications_thread_members_role" NOT NULL,
    "thread_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "workspace_membership_id" UUID NOT NULL,

    CONSTRAINT "communications_thread_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_asset_versions" (
    "change_summary" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "creative_asset_id" UUID NOT NULL,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "creative.asset_versions#status" NOT NULL DEFAULT 'draft',
    "storage_uri" VARCHAR(500),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_asset_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_character_scene_links" (
    "appearance_note" TEXT,
    "character_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "relationship" VARCHAR(80) NOT NULL,
    "scene_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "creative.character_scene_links#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_character_scene_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_characters" (
    "age_range" VARCHAR(80),
    "character_kind" VARCHAR(40) NOT NULL,
    "continuity_notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "display_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "creative.characters#status" NOT NULL DEFAULT 'draft',
    "talent_profile_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_creative_approvals" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "creative_asset_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "decision" "creative.creative_approvals#decision" NOT NULL DEFAULT 'pending',
    "feedback" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "reviewer_user_id" UUID,
    "script_version_id" UUID,
    "status" "creative.creative_approvals#status" NOT NULL DEFAULT 'draft',
    "subject_kind" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_creative_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_creative_assets" (
    "asset_kind" VARCHAR(60) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "license" VARCHAR(120),
    "metadata" JSONB,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "rights_note" TEXT,
    "source_uri" VARCHAR(500),
    "status" "creative.creative_assets#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_creative_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_creative_references" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "credit" VARCHAR(200),
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "reference_kind" VARCHAR(60) NOT NULL,
    "status" "creative.creative_references#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" VARCHAR(500) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_creative_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_ideas" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "logline" TEXT,
    "organisation_id" UUID NOT NULL,
    "premise" TEXT,
    "priority" VARCHAR(24) NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "creative.ideas#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_production_elements" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "element_kind" VARCHAR(80) NOT NULL,
    "id" UUID NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30),
    "status" "creative.production_elements#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_production_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_research_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "findings" TEXT,
    "id" UUID NOT NULL,
    "method" VARCHAR(80) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "source_uri" VARCHAR(500),
    "status" "creative.research_items#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_research_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_scene_elements" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "production_element_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30),
    "scene_id" UUID NOT NULL,
    "status" "creative.scene_elements#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_scene_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_scene_versions" (
    "change_summary" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "status" "creative.scene_versions#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_scene_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_scenes" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "heading" VARCHAR(240) NOT NULL,
    "id" UUID NOT NULL,
    "interior_exterior" VARCHAR(16) NOT NULL,
    "location_text" VARCHAR(240),
    "organisation_id" UUID NOT NULL,
    "scene_number" VARCHAR(40) NOT NULL,
    "script_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "creative.scenes#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "time_of_day" VARCHAR(40),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_scenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_script_breakdowns" (
    "category" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30),
    "scene_id" UUID,
    "script_version_id" UUID NOT NULL,
    "status" "creative.script_breakdowns#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_script_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_script_versions" (
    "change_summary" TEXT,
    "content_uri" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "script_id" UUID NOT NULL,
    "status" "creative.script_versions#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_script_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_scripts" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "format" VARCHAR(40) NOT NULL,
    "id" UUID NOT NULL,
    "language" VARCHAR(16) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "creative.scripts#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "treatment_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "working_draft" TEXT,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_shot_lists" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "objective" TEXT,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "script_id" UUID,
    "status" "creative.shot_lists#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_shot_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_shots" (
    "camera_setup" VARCHAR(160),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "duration_seconds" DECIMAL(65,30),
    "id" UUID NOT NULL,
    "lens" VARCHAR(80),
    "movement" VARCHAR(80),
    "organisation_id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "shot_list_id" UUID NOT NULL,
    "shot_number" VARCHAR(40) NOT NULL,
    "shot_type" VARCHAR(40),
    "status" "creative.shots#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_shots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_storyboard_frames" (
    "camera_note" TEXT,
    "caption" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "frame_number" INTEGER NOT NULL,
    "id" UUID NOT NULL,
    "image_uri" VARCHAR(500),
    "organisation_id" UUID NOT NULL,
    "scene_id" UUID,
    "status" "creative.storyboard_frames#status" NOT NULL DEFAULT 'draft',
    "storyboard_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_storyboard_frames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_storyboards" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "script_id" UUID NOT NULL,
    "status" "creative.storyboards#status" NOT NULL DEFAULT 'draft',
    "status_note" VARCHAR(80),
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_storyboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_treatments" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "logline" TEXT NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "creative.treatments#status" NOT NULL DEFAULT 'draft',
    "synopsis" TEXT,
    "target_minutes" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "tone" VARCHAR(120),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "creative_treatments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_board_items" (
    "board_id" UUID NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "item_kind" VARCHAR(60) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "position_x" DECIMAL(65,30),
    "position_y" DECIMAL(65,30),
    "size_h" DECIMAL(65,30),
    "size_w" DECIMAL(65,30),
    "sort_order" INTEGER NOT NULL,
    "status" "eventsspatial.board_items#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_board_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_boards" (
    "board_kind" VARCHAR(60) NOT NULL,
    "board_status" "eventsspatial.boards#board_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "event_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "spatial_project_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_cad_models" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "file_uri" VARCHAR(500) NOT NULL,
    "format" VARCHAR(24) NOT NULL,
    "id" UUID NOT NULL,
    "model_version" VARCHAR(40),
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "spatial_project_id" UUID NOT NULL,
    "status" "eventsspatial.cad_models#status" NOT NULL DEFAULT 'draft',
    "units" VARCHAR(16) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_cad_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_decision_graph_edges" (
    "condition" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decision_graph_id" UUID NOT NULL,
    "edge_kind" VARCHAR(40) NOT NULL,
    "from_node_key" VARCHAR(80) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "eventsspatial.decision_graph_edges#status" NOT NULL DEFAULT 'draft',
    "to_node_key" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_decision_graph_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_decision_graph_nodes" (
    "config" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decision_graph_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "node_key" VARCHAR(80) NOT NULL,
    "node_kind" VARCHAR(40) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "eventsspatial.decision_graph_nodes#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_decision_graph_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_decision_graphs" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "graph_status" "eventsspatial.decision_graphs#graph_status" NOT NULL DEFAULT 'draft',
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "spatial_project_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_decision_graphs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_event_journeys" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "event_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "journey_kind" VARCHAR(60) NOT NULL,
    "journey_status" "eventsspatial.event_journeys#journey_status" NOT NULL DEFAULT 'draft',
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_event_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_event_timeline_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6),
    "event_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "owner_label" VARCHAR(160),
    "sort_order" INTEGER NOT NULL,
    "stage" VARCHAR(80),
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "eventsspatial.event_timeline_items#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_event_timeline_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_events" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "ends_at" TIMESTAMPTZ(6),
    "event_kind" VARCHAR(60) NOT NULL,
    "event_status" "eventsspatial.events#event_status" NOT NULL DEFAULT 'draft',
    "guest_capacity" INTEGER,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "timezone" VARCHAR(80) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_id" UUID,
    "wedding_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_exhibition_layouts" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "layout_data" JSONB NOT NULL,
    "layout_status" "eventsspatial.exhibition_layouts#layout_status" NOT NULL DEFAULT 'draft',
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "spatial_project_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_area" VARCHAR(160),
    "venue_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_exhibition_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_film_twins" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "last_synced_at" TIMESTAMPTZ(6),
    "metadata" JSONB,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "source_project_id" UUID,
    "spatial_project_id" UUID,
    "twin_status" "eventsspatial.film_twins#twin_status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_film_twins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_presentation_slides" (
    "background_uri" VARCHAR(500),
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "presentation_id" UUID NOT NULL,
    "slide_number" INTEGER NOT NULL,
    "status" "eventsspatial.presentation_slides#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_presentation_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_presentations" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "event_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "presentation_status" "eventsspatial.presentations#presentation_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "spatial_project_id" UUID,
    "theme" VARCHAR(80),
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_run_of_show_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "cue" VARCHAR(200) NOT NULL,
    "duration_minutes" INTEGER,
    "event_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "operator_note" TEXT,
    "organisation_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "starts_at" TIMESTAMPTZ(6),
    "status" "eventsspatial.run_of_show_items#status" NOT NULL DEFAULT 'draft',
    "status_note" VARCHAR(40),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_run_of_show_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_simulations" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "layout_id" UUID,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "parameters" JSONB NOT NULL,
    "requested_by_user_id" UUID,
    "results" JSONB,
    "simulation_kind" VARCHAR(60) NOT NULL,
    "simulation_status" "eventsspatial.simulations#simulation_status" NOT NULL DEFAULT 'queued',
    "spatial_project_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_layers" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "layer_kind" VARCHAR(60) NOT NULL,
    "metadata" JSONB,
    "name" VARCHAR(160) NOT NULL,
    "opacity" DECIMAL(65,30),
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "spatial_project_id" UUID NOT NULL,
    "status" "eventsspatial.spatial_layers#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_spatial_layers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_layouts" (
    "canvas_height" DECIMAL(65,30),
    "canvas_width" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "layout_data" JSONB NOT NULL,
    "layout_status" "eventsspatial.spatial_layouts#layout_status" NOT NULL DEFAULT 'draft',
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "spatial_project_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_spatial_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_objects" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "geometry" JSONB NOT NULL,
    "id" UUID NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "object_kind" VARCHAR(60) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "properties" JSONB,
    "sort_order" INTEGER NOT NULL,
    "spatial_layer_id" UUID NOT NULL,
    "status" "eventsspatial.spatial_objects#status" NOT NULL DEFAULT 'draft',
    "transform" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_spatial_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_operations" (
    "actor_label" VARCHAR(120),
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "operation_kind" VARCHAR(60) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "sequence" INTEGER NOT NULL,
    "spatial_project_id" UUID NOT NULL,
    "status" "eventsspatial.spatial_operations#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_spatial_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_spatial_projects" (
    "coordinate_reference" VARCHAR(80),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "event_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "project_status" "eventsspatial.spatial_projects#project_status" NOT NULL DEFAULT 'draft',
    "spatial_kind" VARCHAR(60) NOT NULL,
    "units" VARCHAR(16) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_spatial_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_venue_bookings" (
    "booking_status" "eventsspatial.venue_bookings#booking_status" NOT NULL DEFAULT 'held',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "event_id" UUID,
    "guest_count" INTEGER,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "quoted_cost" DECIMAL(65,30),
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_venue_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_venues" (
    "accessibility" TEXT,
    "address" TEXT,
    "capacity" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "latitude" DECIMAL(65,30),
    "location_id" UUID,
    "longitude" DECIMAL(65,30),
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_kind" VARCHAR(60) NOT NULL,
    "venue_status" "eventsspatial.venues#venue_status" NOT NULL DEFAULT 'active',
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_wedding_events" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6),
    "event_kind" VARCHAR(60) NOT NULL,
    "guest_count" INTEGER,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "eventsspatial.wedding_events#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venue_id" UUID,
    "wedding_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_wedding_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_wedding_journeys" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "journey_name" VARCHAR(160) NOT NULL,
    "journey_stage" VARCHAR(60) NOT NULL,
    "journey_status" "eventsspatial.wedding_journeys#journey_status" NOT NULL DEFAULT 'planned',
    "organisation_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wedding_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_wedding_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpatial_weddings" (
    "client_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "display_name" VARCHAR(200) NOT NULL,
    "guest_count" INTEGER,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "style_brief" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wedding_date" DATE,
    "wedding_status" "eventsspatial.weddings#wedding_status" NOT NULL DEFAULT 'inquiry',
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "eventsSpatial_weddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_approval_comments" (
    "approval_id" UUID NOT NULL,
    "author_user_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.approval_comments#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" VARCHAR(24) NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "evidence_approval_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_approval_decisions" (
    "approval_id" UUID NOT NULL,
    "approval_step_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_by_user_id" UUID NOT NULL,
    "decision" "evidence.approval_decisions#decision" NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "rationale" TEXT,
    "status" "evidence.approval_decisions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_approval_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_approval_steps" (
    "approval_id" UUID NOT NULL,
    "approver_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "description" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.approval_steps#status" NOT NULL DEFAULT 'pending',
    "step_number" INTEGER NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_approval_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_approvals" (
    "assigned_reviewer_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMPTZ(6),
    "decision" "evidence.approvals#approval_state" NOT NULL DEFAULT 'pending',
    "decision_note" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "request_note" TEXT,
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_user_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_audit_events" (
    "action" VARCHAR(120) NOT NULL,
    "actor_user_id" UUID,
    "correlation_id" VARCHAR(128),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "resource_id" VARCHAR(255),
    "resource_type" VARCHAR(120),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_before_after_proofs" (
    "after_value" JSONB,
    "before_value" JSONB,
    "captured_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_request_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.before_after_proofs#status" NOT NULL DEFAULT 'active',
    "subject_id" UUID NOT NULL,
    "subject_type" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_before_after_proofs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_chain_of_custody_events" (
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "destination_party" VARCHAR(160),
    "event_type" VARCHAR(80) NOT NULL,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "integrity_hash" VARCHAR(128),
    "name" VARCHAR(180) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "source_party" VARCHAR(160),
    "status" "evidence.chain_of_custody_events#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_chain_of_custody_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_change_requests" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "rationale" TEXT NOT NULL,
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_user_id" UUID NOT NULL,
    "resolved_at" TIMESTAMPTZ(6),
    "status" "evidence.change_requests#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_document_links" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "document_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "link_purpose" VARCHAR(80) NOT NULL,
    "linked_by_user_id" UUID,
    "linked_record_id" UUID NOT NULL,
    "linked_record_type" VARCHAR(100) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.document_links#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_document_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_document_versions" (
    "byte_length" INTEGER,
    "captured_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checksum_sha256" VARCHAR(64) NOT NULL,
    "content_type" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "document_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.document_versions#status" NOT NULL DEFAULT 'active',
    "storage_key" VARCHAR(512) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "evidence_document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_documents" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "current_version" INTEGER NOT NULL,
    "description" TEXT,
    "document_kind" VARCHAR(80) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.documents#status" NOT NULL DEFAULT 'active',
    "title" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "workspace_id" UUID,

    CONSTRAINT "evidence_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_gps" (
    "accuracy_meters" DECIMAL(65,30),
    "captured_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "source" VARCHAR(40) NOT NULL,
    "status" "evidence.evidence_gps#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_gps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_items" (
    "captured_at" TIMESTAMPTZ(6),
    "content_sha256" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "kind" "evidence.evidence_items#evidence_kind" NOT NULL,
    "media_type" VARCHAR(127) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "retention_until" TIMESTAMPTZ(6),
    "size_bytes" INTEGER,
    "status" "evidence.evidence_items#evidence_status" NOT NULL DEFAULT 'active',
    "storage_uri" TEXT NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "withdrawn_at" TIMESTAMPTZ(6),

    CONSTRAINT "evidence_evidence_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_links" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "relationship" VARCHAR(80) NOT NULL,
    "status" "evidence.evidence_links#status" NOT NULL DEFAULT 'active',
    "target_id" UUID NOT NULL,
    "target_type" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_media" (
    "byte_length" INTEGER,
    "checksum_sha256" VARCHAR(64) NOT NULL,
    "content_type" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "document_version_id" UUID,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "media_kind" VARCHAR(40) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.evidence_media#status" NOT NULL DEFAULT 'active',
    "storage_key" VARCHAR(512) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_metadata" (
    "classification" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "metadata_key" VARCHAR(100) NOT NULL,
    "metadata_value" JSONB NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.evidence_metadata#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_timeline_events" (
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "details" JSONB,
    "event_type" VARCHAR(80) NOT NULL,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.evidence_timeline_events#status" NOT NULL DEFAULT 'active',
    "summary" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_timestamps" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "precision_ms" INTEGER,
    "source" VARCHAR(80),
    "status" "evidence.evidence_timestamps#status" NOT NULL DEFAULT 'active',
    "timestamp_kind" VARCHAR(60) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_timestamps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_evidence_verifications" (
    "checked_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "outcome" "evidence.evidence_verifications#outcome" NOT NULL DEFAULT 'pending',
    "report" JSONB,
    "status" "evidence.evidence_verifications#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_kind" VARCHAR(80) NOT NULL,
    "verified_by_user_id" UUID,
    "workspace_id" UUID,

    CONSTRAINT "evidence_evidence_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_legal_holds" (
    "authorised_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "document_id" UUID,
    "evidence_item_id" UUID,
    "hold_reference" VARCHAR(120) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "released_at" TIMESTAMPTZ(6),
    "starts_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "evidence.legal_holds#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_legal_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_risk_mitigations" (
    "action" TEXT NOT NULL,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "risk_id" UUID NOT NULL,
    "status" "evidence.risk_mitigations#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_risk_mitigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_risks" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "impact" VARCHAR(24) NOT NULL,
    "likelihood" VARCHAR(24) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "project_id" UUID,
    "status" "evidence.risks#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "evidence_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_trusted_timestamps" (
    "authority" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "evidence.trusted_timestamps#status" NOT NULL DEFAULT 'active',
    "token_reference" VARCHAR(512) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_status" VARCHAR(40) NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "evidence_trusted_timestamps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_budget_categories" (
    "code" VARCHAR(80),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "finance.budget_categories#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_budget_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_budget_lines" (
    "approved_amount" DECIMAL(65,30),
    "budget_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "line_number" INTEGER NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "planned_amount" DECIMAL(65,30) NOT NULL,
    "project_id" UUID,
    "status" "finance.budget_lines#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_budget_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_budgets" (
    "approved_amount" DECIMAL(65,30),
    "budget_status" "finance.budgets#budget_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "fiscal_period" VARCHAR(40) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "project_id" UUID NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_cashflow_entries" (
    "amount" DECIMAL(65,30) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "description" TEXT,
    "direction" "finance.cashflow_entries#direction" NOT NULL DEFAULT 'inflow',
    "entry_date" DATE NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payment_id" UUID,
    "project_id" UUID,
    "status" "finance.cashflow_entries#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_cashflow_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_commitments" (
    "budget_line_id" UUID,
    "commitment_number" VARCHAR(80) NOT NULL,
    "commitment_status" "finance.commitments#commitment_status" NOT NULL DEFAULT 'open',
    "committed_amount" DECIMAL(65,30) NOT NULL,
    "committed_on" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "purchase_order_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_commitments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_cost_sheet_lines" (
    "actual_amount" DECIMAL(65,30),
    "budget_line_id" UUID,
    "cost_sheet_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT NOT NULL,
    "estimated_amount" DECIMAL(65,30) NOT NULL,
    "id" UUID NOT NULL,
    "line_number" INTEGER NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "status" "finance.cost_sheet_lines#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_cost_sheet_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_cost_sheets" (
    "budget_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "sheet_status" "finance.cost_sheets#sheet_status" NOT NULL DEFAULT 'draft',
    "total_actual" DECIMAL(65,30),
    "total_estimated" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_cost_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_currencies" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "code" VARCHAR(3) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "minor_unit_digits" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "status" "finance.currencies#status" NOT NULL DEFAULT 'draft',
    "symbol" VARCHAR(12) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_estimate_lines" (
    "budget_line_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT NOT NULL,
    "estimate_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "line_number" INTEGER NOT NULL,
    "line_total" DECIMAL(65,30),
    "organisation_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "status" "finance.estimate_lines#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "unit_cost" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_estimate_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_estimates" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "estimate_number" VARCHAR(80) NOT NULL,
    "estimate_status" "finance.estimates#estimate_status" NOT NULL DEFAULT 'draft',
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "requested_by_user_id" UUID,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax_total" DECIMAL(65,30),
    "total" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_exchange_rates" (
    "base_currency" VARCHAR(3) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "effective_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "quote_currency" VARCHAR(3) NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "rate_status" "finance.exchange_rates#rate_status" NOT NULL DEFAULT 'proposed',
    "source" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_by_user_id" UUID,

    CONSTRAINT "finance_exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expense_approvals" (
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "decision" "finance.expense_approvals#decision" NOT NULL DEFAULT 'pending',
    "expense_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "reviewer_user_id" UUID,
    "sequence" INTEGER NOT NULL,
    "status" "finance.expense_approvals#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_expense_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expense_lines" (
    "budget_line_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT NOT NULL,
    "expense_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "line_amount" DECIMAL(65,30) NOT NULL,
    "line_number" INTEGER NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30),
    "status" "finance.expense_lines#status" NOT NULL DEFAULT 'draft',
    "tax_code_id" UUID,
    "unit" VARCHAR(40),
    "unit_amount" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_expense_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expenses" (
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "description" TEXT NOT NULL,
    "expense_date" DATE NOT NULL,
    "expense_number" VARCHAR(80) NOT NULL,
    "expense_status" "finance.expenses#expense_status" NOT NULL DEFAULT 'draft',
    "id" UUID NOT NULL,
    "merchant" VARCHAR(200),
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "submitted_by_user_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_invoice_approvals" (
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "decision" "finance.invoice_approvals#decision" NOT NULL DEFAULT 'pending',
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "reviewer_user_id" UUID,
    "sequence" INTEGER NOT NULL,
    "status" "finance.invoice_approvals#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_invoice_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_invoice_lines" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "line_amount" DECIMAL(65,30) NOT NULL,
    "line_number" INTEGER NOT NULL,
    "organisation_id" UUID NOT NULL,
    "purchase_order_item_id" UUID,
    "quantity" DECIMAL(65,30),
    "status" "finance.invoice_lines#status" NOT NULL DEFAULT 'draft',
    "tax_code_id" UUID,
    "unit" VARCHAR(40),
    "unit_amount" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_payment_allocations" (
    "allocated_at" TIMESTAMPTZ(6) NOT NULL,
    "allocation_kind" VARCHAR(40) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "expense_id" UUID,
    "id" UUID NOT NULL,
    "invoice_id" UUID,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "status" "finance.payment_allocations#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_payment_verifications" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "evidence_uri" VARCHAR(500),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "reference" VARCHAR(160),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification_method" VARCHAR(40) NOT NULL,
    "verification_status" "finance.payment_verifications#verification_status" NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMPTZ(6),
    "verified_by_user_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_payment_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_payments" (
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "invoice_id" UUID,
    "organisation_id" UUID NOT NULL,
    "payment_date" DATE,
    "payment_method" VARCHAR(40) NOT NULL,
    "payment_reference" VARCHAR(100) NOT NULL,
    "payment_status" "finance.payments#payment_status" NOT NULL DEFAULT 'pending',
    "provider_reference" VARCHAR(160),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_profitability_snapshots" (
    "calculated_at" TIMESTAMPTZ(6) NOT NULL,
    "calculated_by_user_id" UUID,
    "cost" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "margin_percent" DECIMAL(65,30),
    "organisation_id" UUID NOT NULL,
    "period_end" DATE NOT NULL,
    "period_start" DATE NOT NULL,
    "profit" DECIMAL(65,30) NOT NULL,
    "project_id" UUID NOT NULL,
    "revenue" DECIMAL(65,30) NOT NULL,
    "status" "finance.profitability_snapshots#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_profitability_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_tax_codes" (
    "code" VARCHAR(40) NOT NULL,
    "country_code" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "effective_from" DATE NOT NULL,
    "effective_until" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "rate_percent" DECIMAL(65,30) NOT NULL,
    "status" "finance.tax_codes#status" NOT NULL DEFAULT 'draft',
    "tax_kind" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_tax_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_vendor_invoices" (
    "commitment_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "due_on" DATE,
    "id" UUID NOT NULL,
    "invoice_number" VARCHAR(100) NOT NULL,
    "invoice_status" "finance.vendor_invoices#invoice_status" NOT NULL DEFAULT 'received',
    "issued_on" DATE NOT NULL,
    "organisation_id" UUID NOT NULL,
    "purchase_order_id" UUID,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax_total" DECIMAL(65,30),
    "total" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "finance_vendor_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_access_policies" (
    "action" VARCHAR(80) NOT NULL,
    "conditions" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effect" VARCHAR(16) NOT NULL,
    "id" UUID NOT NULL,
    "policy_key" VARCHAR(120) NOT NULL,
    "principal_kind" VARCHAR(40) NOT NULL,
    "priority" INTEGER NOT NULL,
    "resource_pattern" VARCHAR(240) NOT NULL,
    "status" "identity.access_policies#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_from" TIMESTAMPTZ(6),
    "valid_until" TIMESTAMPTZ(6),

    CONSTRAINT "identity_access_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_access_reviews" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decision" "identity.access_reviews#decision" NOT NULL DEFAULT 'pending',
    "due_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "notes" TEXT,
    "review_kind" VARCHAR(60) NOT NULL,
    "reviewed_at" TIMESTAMPTZ(6),
    "reviewer_user_id" UUID,
    "status" "identity.access_reviews#status" NOT NULL DEFAULT 'active',
    "subject_user_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_access_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_auth_accounts" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "issuer" VARCHAR(240),
    "last_authenticated_at" TIMESTAMPTZ(6),
    "linked_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" VARCHAR(80) NOT NULL,
    "provider_subject" VARCHAR(240) NOT NULL,
    "status" "identity.auth_accounts#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_auth_challenges" (
    "attempt_count" INTEGER NOT NULL,
    "challenge_hash" VARCHAR(128) NOT NULL,
    "challenge_kind" VARCHAR(60) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "request_context" JSONB,
    "status" "identity.auth_challenges#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "identity_auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_auth_credentials" (
    "algorithm" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credential_hash" VARCHAR(256) NOT NULL,
    "credential_kind" VARCHAR(60) NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "revoked_at" TIMESTAMPTZ(6),
    "status" "identity.auth_credentials#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_auth_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_delegations" (
    "approved_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delegate_user_id" UUID NOT NULL,
    "delegator_user_id" UUID NOT NULL,
    "ends_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "reason" TEXT,
    "scope" JSONB NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "identity.delegations#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_delegations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_device_verifications" (
    "attempt_count" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "status" "identity.device_verifications#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "verification_hash" VARCHAR(128) NOT NULL,
    "verification_kind" VARCHAR(60) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),

    CONSTRAINT "identity_device_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_devices" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_fingerprint" VARCHAR(256) NOT NULL,
    "device_kind" VARCHAR(60) NOT NULL,
    "display_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "last_seen_at" TIMESTAMPTZ(6),
    "platform" VARCHAR(60),
    "revoked_at" TIMESTAMPTZ(6),
    "status" "identity.devices#status" NOT NULL DEFAULT 'active',
    "trusted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_invitations" (
    "accepted_at" TIMESTAMPTZ(6),
    "accepted_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "email" VARCHAR(320) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "invited_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invited_by_user_id" UUID NOT NULL,
    "message" TEXT,
    "organisation_id" UUID NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "status" "identity.invitations#status" NOT NULL DEFAULT 'active',
    "token_hash" VARCHAR(128) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "identity_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_location_verifications" (
    "country_code" VARCHAR(2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" JSONB,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "location_hash" VARCHAR(128) NOT NULL,
    "region_code" VARCHAR(40),
    "status" "identity.location_verifications#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "verification_kind" VARCHAR(60) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "verified_by_user_id" UUID,

    CONSTRAINT "identity_location_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_nda_acceptances" (
    "acceptance_hash" VARCHAR(128) NOT NULL,
    "accepted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "ip_address" VARCHAR(64),
    "nda_version_id" UUID NOT NULL,
    "signature_id" UUID,
    "status" "identity.nda_acceptances#status" NOT NULL DEFAULT 'pending',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" VARCHAR(512),
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_nda_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_nda_versions" (
    "content_reference" VARCHAR(512),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "document_hash" VARCHAR(128) NOT NULL,
    "effective_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "nda_id" UUID NOT NULL,
    "retired_at" TIMESTAMPTZ(6),
    "status" "identity.nda_versions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,

    CONSTRAINT "identity_nda_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_ndas" (
    "code" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "required_for" JSONB,
    "status" "identity.ndas#status" NOT NULL DEFAULT 'active',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_ndas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_otp_challenges" (
    "attempt_count" INTEGER NOT NULL,
    "channel" VARCHAR(24) NOT NULL,
    "code_hash" VARCHAR(128) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destination" VARCHAR(320) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "identity.otp_challenges#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "identity_otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_password_reset_tokens" (
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_ip" VARCHAR(64),
    "status" "identity.password_reset_tokens#status" NOT NULL DEFAULT 'active',
    "token_hash" VARCHAR(128) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_permissions" (
    "action" VARCHAR(80) NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(160) NOT NULL,
    "resource" VARCHAR(120) NOT NULL,
    "status" "identity.permissions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_role_permissions" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by_user_id" UUID,
    "id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "status" "identity.role_permissions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_roles" (
    "code" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(120) NOT NULL,
    "status" "identity.roles#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_signatures" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "metadata" JSONB,
    "signature_hash" VARCHAR(128) NOT NULL,
    "signature_kind" VARCHAR(60) NOT NULL,
    "signed_at" TIMESTAMPTZ(6),
    "signer_name" VARCHAR(200),
    "status" "identity.signatures#status" NOT NULL DEFAULT 'active',
    "storage_key" VARCHAR(512),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "identity_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_user_emails" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(320) NOT NULL,
    "id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "identity.user_emails#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "verification_method" VARCHAR(60),
    "verified_at" TIMESTAMPTZ(6),

    CONSTRAINT "identity_user_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_user_phones" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_e164" VARCHAR(20) NOT NULL,
    "status" "identity.user_phones#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "verification_method" VARCHAR(60),
    "verified_at" TIMESTAMPTZ(6),

    CONSTRAINT "identity_user_phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_user_profiles" (
    "avatar_uri" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "display_name" VARCHAR(200) NOT NULL,
    "id" UUID NOT NULL,
    "preferred_locale" VARCHAR(35),
    "time_zone" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_user_roles" (
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by_user_id" UUID,
    "assignment_source" VARCHAR(60) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "status" "identity.user_roles#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_user_sessions" (
    "client_label" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "last_used_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),
    "token_hash" VARCHAR(128) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "identity_user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_users" (
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(320) NOT NULL,
    "email_verified_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "status" "identity.users#account_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_ai_citations" (
    "citation_index" INTEGER NOT NULL,
    "citation_kind" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "excerpt" TEXT,
    "id" UUID NOT NULL,
    "message_id" UUID,
    "organisation_id" UUID NOT NULL,
    "page_number" INTEGER,
    "source_id" UUID,
    "status" "intelligence.ai_citations#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(240),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" VARCHAR(1000),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_ai_citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_ai_contexts" (
    "attached_at" TIMESTAMPTZ(6) NOT NULL,
    "attached_by_user_id" UUID,
    "context_data" JSONB,
    "context_kind" VARCHAR(60) NOT NULL,
    "conversation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "document_id" UUID,
    "evidence_item_id" UUID,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "source_reference" VARCHAR(500),
    "status" "intelligence.ai_contexts#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_ai_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_ai_conversations" (
    "assistant_kind" VARCHAR(80) NOT NULL,
    "conversation_status" "intelligence.ai_conversations#conversation_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "last_activity_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "title" VARCHAR(200),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_ai_messages" (
    "content" TEXT NOT NULL,
    "content_format" VARCHAR(40),
    "conversation_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "model_key" VARCHAR(120),
    "organisation_id" UUID NOT NULL,
    "role" "intelligence.ai_messages#role" NOT NULL DEFAULT 'system',
    "sent_at" TIMESTAMPTZ(6) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" "intelligence.ai_messages#status" NOT NULL DEFAULT 'draft',
    "token_count" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_ai_suggestions" (
    "body" TEXT NOT NULL,
    "confidence" DECIMAL(65,30),
    "conversation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "message_id" UUID,
    "organisation_id" UUID NOT NULL,
    "status" "intelligence.ai_suggestions#status" NOT NULL DEFAULT 'pending',
    "suggestion_kind" VARCHAR(60) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_ai_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_analytics_events" (
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "event_name" VARCHAR(120) NOT NULL,
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "properties" JSONB,
    "status" "intelligence.analytics_events#status" NOT NULL DEFAULT 'draft',
    "subject_id" UUID,
    "subject_type" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_evidence_aware_answers" (
    "answer" TEXT NOT NULL,
    "answered_at" TIMESTAMPTZ(6) NOT NULL,
    "citation_count" INTEGER NOT NULL,
    "confidence" DECIMAL(65,30),
    "conversation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "grounding_status" "intelligence.evidence_aware_answers#grounding_status" NOT NULL DEFAULT 'grounded',
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "research_session_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_evidence_aware_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_forecast_runs" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "forecast_kind" VARCHAR(60) NOT NULL,
    "generated_at" TIMESTAMPTZ(6),
    "horizon_end" DATE NOT NULL,
    "horizon_start" DATE NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "requested_by_user_id" UUID,
    "run_status" "intelligence.forecast_runs#run_status" NOT NULL DEFAULT 'queued',
    "target_metric" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_forecast_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_forecast_scenarios" (
    "assumptions" JSONB NOT NULL,
    "confidence_high" DECIMAL(65,30),
    "confidence_low" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "forecast_run_id" UUID NOT NULL,
    "forecast_values" JSONB NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "intelligence.forecast_scenarios#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_forecast_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_generation_jobs" (
    "completed_at" TIMESTAMPTZ(6),
    "conversation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "input_data" JSONB NOT NULL,
    "job_kind" VARCHAR(60) NOT NULL,
    "job_status" "intelligence.generation_jobs#job_status" NOT NULL DEFAULT 'queued',
    "organisation_id" UUID NOT NULL,
    "requested_at" TIMESTAMPTZ(6) NOT NULL,
    "requested_by_user_id" UUID,
    "result_reference" VARCHAR(500),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_intelligence_runs" (
    "completed_at" TIMESTAMPTZ(6),
    "conversation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "input_data" JSONB NOT NULL,
    "model_key" VARCHAR(120),
    "organisation_id" UUID NOT NULL,
    "output_data" JSONB,
    "project_id" UUID,
    "requested_by_user_id" UUID,
    "run_kind" VARCHAR(60) NOT NULL,
    "run_status" "intelligence.intelligence_runs#run_status" NOT NULL DEFAULT 'queued',
    "started_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_intelligence_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_intelligence_signals" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "observed_at" TIMESTAMPTZ(6) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "score" DECIMAL(65,30),
    "signal_data" JSONB NOT NULL,
    "signal_kind" VARCHAR(60) NOT NULL,
    "status" "intelligence.intelligence_signals#status" NOT NULL DEFAULT 'draft',
    "subject_id" UUID,
    "subject_type" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_intelligence_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_knowledge_chunks" (
    "chunk_index" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "document_id" UUID NOT NULL,
    "embedding_reference" VARCHAR(500),
    "id" UUID NOT NULL,
    "metadata" JSONB,
    "organisation_id" UUID NOT NULL,
    "status" "intelligence.knowledge_chunks#status" NOT NULL DEFAULT 'draft',
    "token_count" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_knowledge_documents" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "document_kind" VARCHAR(60) NOT NULL,
    "document_status" "intelligence.knowledge_documents#document_status" NOT NULL DEFAULT 'queued',
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "indexed_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "source_uri" VARCHAR(1000),
    "title" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_kpi_definitions" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "aggregation" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "definition" JSONB NOT NULL,
    "description" TEXT,
    "id" UUID NOT NULL,
    "metric_key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "status" "intelligence.kpi_definitions#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intelligence_kpi_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_kpi_measurements" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "dimensions" JSONB,
    "id" UUID NOT NULL,
    "kpi_definition_id" UUID NOT NULL,
    "measured_at" TIMESTAMPTZ(6) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "source_reference" VARCHAR(500),
    "status" "intelligence.kpi_measurements#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DECIMAL(65,30) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_kpi_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_model_registry" (
    "capabilities" JSONB NOT NULL,
    "configuration" JSONB,
    "context_limit" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "id" UUID NOT NULL,
    "model_key" VARCHAR(120) NOT NULL,
    "model_name" VARCHAR(160) NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "status" "intelligence.model_registry#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intelligence_model_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_model_runs" (
    "completed_at" TIMESTAMPTZ(6),
    "conversation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "generation_job_id" UUID,
    "id" UUID NOT NULL,
    "input_tokens" INTEGER,
    "latency_ms" INTEGER,
    "model_key" VARCHAR(120) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "output_tokens" INTEGER,
    "provider_request_id" VARCHAR(160),
    "requested_by_user_id" UUID,
    "run_status" "intelligence.model_runs#run_status" NOT NULL DEFAULT 'requested',
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_model_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_prompt_templates" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "system_prompt" TEXT NOT NULL,
    "template_key" VARCHAR(120) NOT NULL,
    "template_status" "intelligence.prompt_templates#template_status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_template" TEXT NOT NULL,
    "variables" JSONB,
    "version_number" INTEGER NOT NULL,

    CONSTRAINT "intelligence_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_research_sessions" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "query" TEXT NOT NULL,
    "requested_by_user_id" UUID,
    "scope" JSONB,
    "session_status" "intelligence.research_sessions#session_status" NOT NULL DEFAULT 'open',
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_research_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_research_sources" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "document_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "research_session_id" UUID NOT NULL,
    "retrieved_at" TIMESTAMPTZ(6),
    "source_data" JSONB,
    "source_kind" VARCHAR(60) NOT NULL,
    "status" "intelligence.research_sources#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" VARCHAR(1000),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_research_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_saved_insights" (
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "insight_kind" VARCHAR(60) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "project_id" UUID,
    "saved_at" TIMESTAMPTZ(6) NOT NULL,
    "source_references" JSONB,
    "status" "intelligence.saved_insights#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" VARCHAR(40) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "intelligence_saved_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_deal_room_members" (
    "accepted_at" TIMESTAMPTZ(6),
    "access_status" "investor.deal_room_members#access_status" NOT NULL DEFAULT 'invited',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "deal_room_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "invited_at" TIMESTAMPTZ(6) NOT NULL,
    "invited_by_user_id" UUID,
    "last_viewed_at" TIMESTAMPTZ(6),
    "member_role" VARCHAR(40) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_deal_room_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_deal_rooms" (
    "access_policy" VARCHAR(40) NOT NULL,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "opened_at" TIMESTAMPTZ(6),
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "room_status" "investor.deal_rooms#room_status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_deal_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_disclosures" (
    "ack_required" BOOLEAN NOT NULL DEFAULT false,
    "body" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "disclosure_kind" VARCHAR(60) NOT NULL,
    "document_uri" VARCHAR(500),
    "effective_at" TIMESTAMPTZ(6) NOT NULL,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "investor.disclosures#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_disclosures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_distribution_channels" (
    "channel_kind" VARCHAR(60) NOT NULL,
    "channel_status" "investor.distribution_channels#channel_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "terms_uri" VARCHAR(500),
    "territories" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_distribution_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_distribution_deals" (
    "channel_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "deal_number" VARCHAR(80) NOT NULL,
    "deal_status" "investor.distribution_deals#deal_status" NOT NULL DEFAULT 'draft',
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "minimum_guarantee" DECIMAL(65,30),
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "rights_scope" JSONB NOT NULL,
    "starts_on" DATE,
    "territory" VARCHAR(120) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_distribution_deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_due_diligence_items" (
    "assigned_to_user_id" UUID,
    "category" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "due_on" DATE,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "item_status" "investor.due_diligence_items#item_status" NOT NULL DEFAULT 'open',
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "priority" VARCHAR(24) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_due_diligence_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_funding_requirements" (
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "due_on" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "notes" TEXT,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "requirement_status" "investor.funding_requirements#requirement_status" NOT NULL DEFAULT 'proposed',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_funding_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investment_opportunities" (
    "closes_on" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "instrument" VARCHAR(60) NOT NULL,
    "minimum_investment" DECIMAL(65,30),
    "opportunity_status" "investor.investment_opportunities#opportunity_status" NOT NULL DEFAULT 'draft',
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "summary" TEXT,
    "target_amount" DECIMAL(65,30) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investment_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investment_profiles" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "display_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "investor_kind" VARCHAR(60) NOT NULL,
    "mandate" TEXT,
    "organisation_id" UUID NOT NULL,
    "risk_profile" VARCHAR(40),
    "status" "investor.investment_profiles#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "website" VARCHAR(500),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investment_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investment_tranches" (
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "funding_requirement_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "released_on" DATE,
    "scheduled_on" DATE,
    "tranche_number" INTEGER NOT NULL,
    "tranche_status" "investor.investment_tranches#tranche_status" NOT NULL DEFAULT 'planned',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investment_tranches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investor_accounts" (
    "account_kind" VARCHAR(40) NOT NULL,
    "account_reference" VARCHAR(100) NOT NULL,
    "account_status" "investor.investor_accounts#account_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "investor_profile_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "provider" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMPTZ(6),
    "verified_by_user_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investor_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investor_commitments" (
    "amount" DECIMAL(65,30) NOT NULL,
    "commitment_number" VARCHAR(80) NOT NULL,
    "commitment_status" "investor.investor_commitments#commitment_status" NOT NULL DEFAULT 'indication',
    "committed_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "deal_room_id" UUID,
    "id" UUID NOT NULL,
    "investor_profile_id" UUID NOT NULL,
    "notes" TEXT,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investor_commitments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investor_evidence_links" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "investor_profile_id" UUID,
    "link_kind" VARCHAR(60) NOT NULL,
    "linked_at" TIMESTAMPTZ(6) NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "investor.investor_evidence_links#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" VARCHAR(40) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investor_evidence_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investor_progress_reports" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "investor_profile_id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "progress_percent" DECIMAL(65,30),
    "report_period" VARCHAR(40) NOT NULL,
    "reported_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "investor.investor_progress_reports#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" VARCHAR(40) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investor_progress_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_investor_returns" (
    "commitment_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payment_id" UUID,
    "period_end" DATE NOT NULL,
    "period_start" DATE NOT NULL,
    "principal_returned" DECIMAL(65,30) NOT NULL,
    "profit_share" DECIMAL(65,30) NOT NULL,
    "recoupment_model_id" UUID,
    "return_status" "investor.investor_returns#return_status" NOT NULL DEFAULT 'estimated',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_investor_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_pitch_decks" (
    "content_uri" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "status" "investor.pitch_decks#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "version_number" INTEGER NOT NULL,
    "visibility" VARCHAR(40) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_pitch_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_recoupment_models" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "effective_on" DATE,
    "id" UUID NOT NULL,
    "model_status" "investor.recoupment_models#model_status" NOT NULL DEFAULT 'draft',
    "name" VARCHAR(160) NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "priority_order" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waterfall" JSONB NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_recoupment_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_recoupment_tiers" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "participant_kind" VARCHAR(60) NOT NULL,
    "recoupment_model_id" UUID NOT NULL,
    "share_percent" DECIMAL(65,30) NOT NULL,
    "status" "investor.recoupment_tiers#status" NOT NULL DEFAULT 'draft',
    "threshold_amount" DECIMAL(65,30) NOT NULL,
    "tier_number" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_recoupment_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_revenue_entries" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "distribution_deal_id" UUID,
    "gross_amount" DECIMAL(65,30) NOT NULL,
    "id" UUID NOT NULL,
    "net_amount" DECIMAL(65,30) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "period_end" DATE NOT NULL,
    "period_start" DATE NOT NULL,
    "project_id" UUID NOT NULL,
    "recognized_at" TIMESTAMPTZ(6) NOT NULL,
    "source" VARCHAR(120),
    "status" "investor.revenue_entries#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_revenue_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_rights" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_on" DATE,
    "exclusivity" VARCHAR(40) NOT NULL,
    "id" UUID NOT NULL,
    "opportunity_id" UUID,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "right_kind" VARCHAR(80) NOT NULL,
    "rights_status" "investor.rights#rights_status" NOT NULL DEFAULT 'proposed',
    "starts_on" DATE,
    "terms" TEXT,
    "territory" VARCHAR(120) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_rights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_rights_windows" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "distribution_deal_id" UUID,
    "ends_on" DATE NOT NULL,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "platform" VARCHAR(120),
    "right_id" UUID NOT NULL,
    "starts_on" DATE NOT NULL,
    "status" "investor.rights_windows#status" NOT NULL DEFAULT 'draft',
    "territory" VARCHAR(120) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "window_kind" VARCHAR(60) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "investor_rights_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_accommodations" (
    "address" TEXT,
    "check_in" DATE,
    "check_out" DATE,
    "contact_phone" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "location_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "property_kind" VARCHAR(60),
    "room_count" INTEGER,
    "status" "logistics.accommodations#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_drivers" (
    "availability_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "display_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "license_expires_on" DATE,
    "license_number" VARCHAR(100),
    "organisation_id" UUID NOT NULL,
    "phone" VARCHAR(40),
    "status" "logistics.drivers#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_bookings" (
    "booked_by_user_id" UUID,
    "booking_status" "logistics.equipment_bookings#booking_status" NOT NULL DEFAULT 'held',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "equipment_item_id" UUID,
    "equipment_kit_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_categories" (
    "code" VARCHAR(80),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "requires_serial" BOOLEAN NOT NULL DEFAULT false,
    "returnable" BOOLEAN NOT NULL DEFAULT false,
    "status" "logistics.equipment_categories#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_checkouts" (
    "checked_out_at" TIMESTAMPTZ(6) NOT NULL,
    "checked_out_quantity" INTEGER NOT NULL,
    "checked_out_to_user_id" UUID,
    "condition_out" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "due_at" TIMESTAMPTZ(6),
    "equipment_booking_id" UUID,
    "equipment_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "issued_by_user_id" UUID,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "status" "logistics.equipment_checkouts#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_inventory_events" (
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "equipment_item_id" UUID NOT NULL,
    "equipment_kit_id" UUID,
    "event_kind" VARCHAR(40) NOT NULL,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quantity_delta" INTEGER NOT NULL,
    "reference" VARCHAR(120),
    "sequence" INTEGER NOT NULL,
    "status" "logistics.equipment_inventory_events#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_inventory_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_items" (
    "acquired_on" DATE,
    "asset_tag" VARCHAR(100),
    "category_id" UUID NOT NULL,
    "condition" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "manufacturer" VARCHAR(120),
    "metadata" JSONB,
    "model" VARCHAR(120),
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "replacement_value" DECIMAL(65,30),
    "serial_number" VARCHAR(120),
    "status" "logistics.equipment_items#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_kits" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "kit_code" VARCHAR(80),
    "kit_status" "logistics.equipment_kits#kit_status" NOT NULL DEFAULT 'active',
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_maintenance" (
    "completed_at" TIMESTAMPTZ(6),
    "cost" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "equipment_item_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "maintenance_kind" VARCHAR(60) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6),
    "status" "logistics.equipment_maintenance#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_name" VARCHAR(160),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_equipment_returns" (
    "checkout_id" UUID NOT NULL,
    "condition_in" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "damage_note" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "received_by_user_id" UUID,
    "returned_at" TIMESTAMPTZ(6) NOT NULL,
    "returned_quantity" INTEGER NOT NULL,
    "status" "logistics.equipment_returns#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_equipment_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_location_bookings" (
    "booked_by_user_id" UUID,
    "booking_status" "logistics.location_bookings#booking_status" NOT NULL DEFAULT 'held',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "permit_id" UUID,
    "project_id" UUID NOT NULL,
    "purpose" VARCHAR(200),
    "quoted_cost" DECIMAL(65,30),
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_location_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_location_comparisons" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "criteria" JSONB NOT NULL,
    "decision" "logistics.location_comparisons#decision" NOT NULL DEFAULT 'open',
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "recce_id" UUID,
    "status" "logistics.location_comparisons#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_location_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_location_media" (
    "caption" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "media_kind" VARCHAR(40) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "logistics.location_media#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" VARCHAR(500) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_location_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_locations" (
    "access_notes" TEXT,
    "capacity" INTEGER,
    "city" VARCHAR(120),
    "country_code" VARCHAR(2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "latitude" DECIMAL(65,30),
    "location_kind" VARCHAR(60) NOT NULL,
    "longitude" DECIMAL(65,30),
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "postal_code" VARCHAR(24),
    "region" VARCHAR(120),
    "status" "logistics.locations#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_logistics_tasks" (
    "assigned_to_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "details" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "priority" VARCHAR(24) NOT NULL,
    "project_id" UUID NOT NULL,
    "task_kind" VARCHAR(60) NOT NULL,
    "task_status" "logistics.logistics_tasks#task_status" NOT NULL DEFAULT 'open',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_logistics_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_permit_documents" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "document_kind" VARCHAR(60) NOT NULL,
    "evidence_item_id" UUID,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "permit_id" UUID NOT NULL,
    "status" "logistics.permit_documents#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" VARCHAR(500) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_permit_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_permits" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "issuing_authority" VARCHAR(200),
    "location_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "permit_kind" VARCHAR(80) NOT NULL,
    "permit_number" VARCHAR(120),
    "project_id" UUID NOT NULL,
    "status" "logistics.permits#status" NOT NULL DEFAULT 'draft',
    "status_note" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_from" DATE,
    "valid_until" DATE,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_permits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_recce_media" (
    "caption" TEXT,
    "captured_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "media_kind" VARCHAR(40) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "recce_id" UUID NOT NULL,
    "status" "logistics.recce_media#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" VARCHAR(500) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_recce_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_recces" (
    "access_notes" TEXT,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decision" "logistics.recces#decision" NOT NULL DEFAULT 'planned',
    "id" UUID NOT NULL,
    "lead_user_id" UUID,
    "location_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6),
    "status" "logistics.recces#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weather" TEXT,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_recces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_room_allocations" (
    "accommodation_id" UUID NOT NULL,
    "allocation_status" "logistics.room_allocations#allocation_status" NOT NULL DEFAULT 'held',
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "occupant_name" VARCHAR(200),
    "organisation_id" UUID NOT NULL,
    "person_user_id" UUID,
    "project_id" UUID NOT NULL,
    "room_label" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_room_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_shipments" (
    "carrier" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "expected_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "logistics_task_id" UUID,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "ship_from" TEXT,
    "ship_to" TEXT,
    "shipment_status" "logistics.shipments#shipment_status" NOT NULL DEFAULT 'preparing',
    "shipped_at" TIMESTAMPTZ(6),
    "tracking_number" VARCHAR(120),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_transport_plans" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "pickup_note" TEXT,
    "project_id" UUID NOT NULL,
    "service_kind" VARCHAR(60) NOT NULL,
    "starts_at" TIMESTAMPTZ(6),
    "status" "logistics.transport_plans#status" NOT NULL DEFAULT 'draft',
    "status_note" VARCHAR(40),
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_transport_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_travel_legs" (
    "arrive_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "depart_at" TIMESTAMPTZ(6),
    "destination" VARCHAR(200) NOT NULL,
    "id" UUID NOT NULL,
    "location_id" UUID,
    "mode" VARCHAR(40) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "origin" VARCHAR(200) NOT NULL,
    "reference" VARCHAR(120),
    "sequence" INTEGER NOT NULL,
    "status" "logistics.travel_legs#status" NOT NULL DEFAULT 'draft',
    "travel_plan_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_travel_legs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_travel_plans" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "depart_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "return_at" TIMESTAMPTZ(6),
    "title" VARCHAR(200) NOT NULL,
    "travel_status" "logistics.travel_plans#travel_status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_travel_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_vehicle_assignments" (
    "assignment_status" "logistics.vehicle_assignments#assignment_status" NOT NULL DEFAULT 'planned',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "driver_id" UUID,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "route_note" TEXT,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "transport_plan_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_vehicle_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_vehicles" (
    "accessibility_notes" TEXT,
    "capacity" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "make" VARCHAR(80),
    "model" VARCHAR(80),
    "organisation_id" UUID NOT NULL,
    "registration_number" VARCHAR(40),
    "status" "logistics.vehicles#status" NOT NULL DEFAULT 'draft',
    "status_note" VARCHAR(40),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_kind" VARCHAR(60) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "logistics_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_capability_packs" (
    "capabilities" JSONB NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "pack_status" "marketplace.capability_packs#pack_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_capability_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_deliveries" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "delivered_at" TIMESTAMPTZ(6),
    "delivery_number" VARCHAR(80) NOT NULL,
    "delivery_status" "marketplace.deliveries#delivery_status" NOT NULL DEFAULT 'planned',
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "proof_uri" VARCHAR(500),
    "purchase_order_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6),
    "shipment_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_marketplace_categories" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "parent_category_id" UUID,
    "slug" VARCHAR(120) NOT NULL,
    "status" "marketplace.marketplace_categories#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_marketplace_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_marketplace_services" (
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "delivery_mode" VARCHAR(40) NOT NULL,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "service_kind" VARCHAR(80) NOT NULL,
    "service_status" "marketplace.marketplace_services#service_status" NOT NULL DEFAULT 'draft',
    "slug" VARCHAR(140) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_marketplace_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_procurement_awards" (
    "award_number" VARCHAR(80) NOT NULL,
    "awarded_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decided_by_user_id" UUID,
    "decision" "marketplace.procurement_awards#decision" NOT NULL DEFAULT 'pending',
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quote_id" UUID,
    "rationale" TEXT,
    "rfq_id" UUID NOT NULL,
    "status" "marketplace.procurement_awards#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_procurement_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_purchase_order_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "delivered_quantity" DECIMAL(65,30),
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "line_total" DECIMAL(65,30) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "purchase_order_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "rfq_item_id" UUID,
    "sku_id" UUID,
    "status" "marketplace.purchase_order_items#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_purchase_orders" (
    "award_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "expected_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "issued_at" TIMESTAMPTZ(6),
    "issued_by_user_id" UUID,
    "order_status" "marketplace.purchase_orders#order_status" NOT NULL DEFAULT 'draft',
    "organisation_id" UUID NOT NULL,
    "po_number" VARCHAR(80) NOT NULL,
    "project_id" UUID,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax_total" DECIMAL(65,30),
    "total" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_quote_comparisons" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "criteria" JSONB NOT NULL,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "selected_quote_id" UUID,
    "status" "marketplace.quote_comparisons#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_quote_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_quote_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "delivery_days" INTEGER,
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "line_total" DECIMAL(65,30) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "quote_id" UUID NOT NULL,
    "rfq_item_id" UUID,
    "sku_id" UUID,
    "status" "marketplace.quote_items#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_quotes" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quote_number" VARCHAR(80) NOT NULL,
    "quote_status" "marketplace.quotes#quote_status" NOT NULL DEFAULT 'draft',
    "rfq_id" UUID NOT NULL,
    "submitted_by_user_id" UUID,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax_total" DECIMAL(65,30),
    "total" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" DATE,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_rfq_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "required_by" DATE,
    "rfq_id" UUID NOT NULL,
    "service_id" UUID,
    "sku_id" UUID,
    "sort_order" INTEGER NOT NULL,
    "status" "marketplace.rfq_items#status" NOT NULL DEFAULT 'draft',
    "unit" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_rfq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_rfq_recipients" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "invited_at" TIMESTAMPTZ(6) NOT NULL,
    "invited_by_user_id" UUID,
    "organisation_id" UUID NOT NULL,
    "responded_at" TIMESTAMPTZ(6),
    "response_status" "marketplace.rfq_recipients#response_status" NOT NULL DEFAULT 'invited',
    "rfq_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_rfq_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_rfqs" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "requester_user_id" UUID,
    "requirements" TEXT,
    "response_deadline" TIMESTAMPTZ(6),
    "rfq_number" VARCHAR(80) NOT NULL,
    "rfq_status" "marketplace.rfqs#rfq_status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_rfqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_service_deliveries" (
    "acceptance_status" "marketplace.service_deliveries#acceptance_status" NOT NULL DEFAULT 'pending',
    "accepted_by_user_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "purchase_order_item_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_service_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_service_skus" (
    "base_price" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3),
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "sku_code" VARCHAR(80) NOT NULL,
    "sku_status" "marketplace.service_skus#sku_status" NOT NULL DEFAULT 'active',
    "unit" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_service_skus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendor_availability" (
    "availability_status" "marketplace.vendor_availability#availability_status" NOT NULL DEFAULT 'available',
    "capacity" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_vendor_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendor_capabilities" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_uri" VARCHAR(500),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "proficiency" VARCHAR(40) NOT NULL,
    "service_id" UUID NOT NULL,
    "status" "marketplace.vendor_capabilities#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "workspace_id" UUID NOT NULL,
    "years_experience" INTEGER,

    CONSTRAINT "marketplace_vendor_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendor_performance" (
    "calculated_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "delivery_on_time_rate" DECIMAL(65,30),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "period_end" DATE NOT NULL,
    "period_start" DATE NOT NULL,
    "quality_score" DECIMAL(65,30),
    "score" DECIMAL(65,30) NOT NULL,
    "status" "marketplace.vendor_performance#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_vendor_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendor_portfolios" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "media_uri" VARCHAR(500),
    "organisation_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" "marketplace.vendor_portfolios#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "visibility" VARCHAR(24) NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_vendor_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendor_profiles" (
    "contact_email" VARCHAR(320),
    "contact_phone" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "headline" VARCHAR(200) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "profile_status" "marketplace.vendor_profiles#profile_status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "website" VARCHAR(500),
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_vendor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendor_ratings" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID,
    "rated_at" TIMESTAMPTZ(6) NOT NULL,
    "rated_by_user_id" UUID,
    "rating_status" "marketplace.vendor_ratings#rating_status" NOT NULL DEFAULT 'pending',
    "review_text" TEXT,
    "score" DECIMAL(65,30) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_vendor_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_vendors" (
    "country_code" VARCHAR(2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "display_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "legal_name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "risk_level" VARCHAR(24),
    "tax_identifier" VARCHAR(80),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_code" VARCHAR(80),
    "vendor_status" "marketplace.vendors#vendor_status" NOT NULL DEFAULT 'pending',
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "marketplace_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_organisation_memberships" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "invited_by_user_id" UUID,
    "joined_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "role" "organisation.organisation_memberships#membership_role" NOT NULL,
    "status" "organisation.organisation_memberships#membership_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "organisation_organisation_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_organisation_settings" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisation_organisation_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_organisations" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" "organisation.organisations#organisation_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisation_organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspace_activity" (
    "actor_membership_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_id" VARCHAR(200),
    "entity_type" VARCHAR(120),
    "event_type" VARCHAR(120) NOT NULL,
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "organisation_workspace_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspace_favourites" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "membership_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "target_id" VARCHAR(200) NOT NULL,
    "target_type" VARCHAR(120) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "organisation_workspace_favourites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspace_invites" (
    "accepted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(320) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "invited_by_membership_id" UUID,
    "organisation_id" UUID NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "role_id" UUID,
    "status" VARCHAR(40) NOT NULL DEFAULT 'pending',
    "token_hash" VARCHAR(128) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "organisation_workspace_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspace_memberships" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "invited_by_user_id" UUID,
    "joined_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "role" "organisation.workspace_memberships#workspace_role" NOT NULL,
    "status" "organisation.workspace_memberships#membership_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "organisation_workspace_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspace_roles" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(120) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "retired_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "organisation_workspace_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspace_settings" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "organisation_workspace_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_workspaces" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" "organisation.workspaces#workspace_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisation_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_attendance_records" (
    "attendance_date" DATE NOT NULL,
    "cast_assignment_id" UUID,
    "check_in_at" TIMESTAMPTZ(6),
    "check_out_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_assignment_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "people.attendance_records#status" NOT NULL DEFAULT 'expected',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "people_attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_audition_media" (
    "audition_submission_id" UUID NOT NULL,
    "byte_length" INTEGER,
    "captured_at" TIMESTAMPTZ(6),
    "checksum_sha256" VARCHAR(64),
    "content_type" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "media_kind" VARCHAR(40) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "people.audition_media#status" NOT NULL DEFAULT 'active',
    "storage_key" VARCHAR(512) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_audition_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_audition_submissions" (
    "casting_call_id" UUID NOT NULL,
    "casting_call_role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "external_reference" VARCHAR(180),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "status" "people.audition_submissions#status" NOT NULL DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ(6),
    "submitted_by_user_id" UUID,
    "talent_profile_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_audition_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_cast_assignments" (
    "assignment_note" TEXT,
    "casting_call_role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "starts_on" DATE,
    "status" "people.cast_assignments#status" NOT NULL DEFAULT 'draft',
    "talent_contract_id" UUID,
    "talent_profile_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_cast_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_cast_messages" (
    "body" TEXT NOT NULL,
    "communication_thread_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sender_user_id" UUID NOT NULL,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "people.cast_messages#status" NOT NULL DEFAULT 'active',
    "talent_profile_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_cast_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_cast_schedule_entries" (
    "cast_assignment_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "ends_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "location_label" VARCHAR(200),
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "schedule_item_id" UUID,
    "starts_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "people.cast_schedule_entries#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_cast_schedule_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_casting_approvals" (
    "approval_id" UUID,
    "approver_user_id" UUID NOT NULL,
    "audition_submission_id" UUID,
    "casting_call_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "decision_note" TEXT,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "people.casting_approvals#status" NOT NULL DEFAULT 'pending',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_casting_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_casting_call_roles" (
    "age_max" INTEGER,
    "age_min" INTEGER,
    "casting_call_id" UUID NOT NULL,
    "character_description" TEXT,
    "compensation_max" DECIMAL(65,30),
    "compensation_min" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3),
    "description" TEXT,
    "headcount" INTEGER NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "role_name" VARCHAR(160) NOT NULL,
    "status" "people.casting_call_roles#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_casting_call_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_casting_calls" (
    "brief" TEXT,
    "closes_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "opens_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "people.casting_calls#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_casting_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_assignments" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_profile_id" UUID NOT NULL,
    "currency_code" VARCHAR(3),
    "department_id" UUID,
    "description" TEXT,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "rate_amount" DECIMAL(65,30),
    "starts_on" DATE,
    "status" "people.crew_assignments#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_availability" (
    "available_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_until" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_profile_id" UUID NOT NULL,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "status" "people.crew_availability#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_contracts" (
    "contract_reference" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_assignment_id" UUID NOT NULL,
    "crew_profile_id" UUID NOT NULL,
    "description" TEXT,
    "ends_on" DATE,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "signed_at" TIMESTAMPTZ(6),
    "starts_on" DATE,
    "status" "people.crew_contracts#status" NOT NULL DEFAULT 'draft',
    "terms" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_hiring_requests" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "department_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "needed_by" DATE,
    "organisation_id" UUID NOT NULL,
    "positions_requested" INTEGER NOT NULL,
    "project_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "status" "people.crew_hiring_requests#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_hiring_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_messages" (
    "body" TEXT NOT NULL,
    "communication_thread_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_profile_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sender_user_id" UUID NOT NULL,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "people.crew_messages#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_profiles" (
    "biography" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "display_name" VARCHAR(200) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "people.crew_profiles#status" NOT NULL DEFAULT 'active',
    "union_name" VARCHAR(160),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_shortlist_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_profile_id" UUID NOT NULL,
    "decision" "people.crew_shortlist_items#decision" NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "shortlist_id" UUID NOT NULL,
    "status" "people.crew_shortlist_items#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_shortlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_shortlists" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_hiring_request_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "purpose" TEXT,
    "status" "people.crew_shortlists#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_crew_shortlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_crew_skills" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_profile_id" UUID NOT NULL,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "proficiency_level" VARCHAR(40),
    "skill_name" VARCHAR(120) NOT NULL,
    "status" "people.crew_skills#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMPTZ(6),
    "workspace_id" UUID,

    CONSTRAINT "people_crew_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_department_members" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "department_id" UUID NOT NULL,
    "description" TEXT,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "role_name" VARCHAR(120) NOT NULL,
    "starts_on" DATE,
    "status" "people.department_members#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "people_department_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_departments" (
    "code" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "people.departments#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_hod_assignments" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_profile_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "description" TEXT,
    "ends_on" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "starts_on" DATE NOT NULL,
    "status" "people.hod_assignments#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_hod_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_performance_reviews" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "rating" DECIMAL(65,30),
    "review_date" DATE NOT NULL,
    "reviewee_user_id" UUID NOT NULL,
    "reviewer_user_id" UUID NOT NULL,
    "status" "people.performance_reviews#status" NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_availability" (
    "available_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_until" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "status" "people.talent_availability#status" NOT NULL DEFAULT 'active',
    "talent_profile_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_comparisons" (
    "comparison_kind" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "left_score" DECIMAL(65,30),
    "left_talent_profile_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "rationale" TEXT,
    "right_score" DECIMAL(65,30),
    "right_talent_profile_id" UUID NOT NULL,
    "status" "people.talent_comparisons#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_contracts" (
    "compensation_amount" DECIMAL(65,30),
    "contract_reference" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3),
    "description" TEXT,
    "ends_on" DATE,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "offer_id" UUID,
    "organisation_id" UUID NOT NULL,
    "signed_at" TIMESTAMPTZ(6),
    "starts_on" DATE,
    "status" "people.talent_contracts#status" NOT NULL DEFAULT 'draft',
    "talent_profile_id" UUID NOT NULL,
    "terms" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_media" (
    "byte_length" INTEGER,
    "caption" TEXT,
    "checksum_sha256" VARCHAR(64),
    "content_type" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "media_kind" VARCHAR(40) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "people.talent_media#status" NOT NULL DEFAULT 'active',
    "storage_key" VARCHAR(512) NOT NULL,
    "talent_profile_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_offers" (
    "casting_call_role_id" UUID NOT NULL,
    "compensation_amount" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3),
    "description" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "offer_reference" VARCHAR(100) NOT NULL,
    "offered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "people.talent_offers#status" NOT NULL DEFAULT 'draft',
    "talent_profile_id" UUID NOT NULL,
    "terms" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_portfolios" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "organisation_id" UUID NOT NULL,
    "status" "people.talent_portfolios#status" NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "talent_profile_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_profiles" (
    "biography" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "date_of_birth" DATE,
    "description" TEXT,
    "display_name" VARCHAR(200) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "pronouns" VARCHAR(80),
    "status" "people.talent_profiles#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_shortlist_items" (
    "audition_submission_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "decision" "people.talent_shortlist_items#decision" NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "notes" TEXT,
    "organisation_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "shortlist_id" UUID NOT NULL,
    "status" "people.talent_shortlist_items#status" NOT NULL DEFAULT 'active',
    "talent_profile_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_shortlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_talent_shortlists" (
    "casting_call_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "purpose" TEXT,
    "status" "people.talent_shortlists#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "people_talent_shortlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_timesheets" (
    "cast_assignment_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "crew_assignment_id" UUID,
    "description" TEXT,
    "hours_worked" DECIMAL(65,30) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "period_end" DATE NOT NULL,
    "period_start" DATE NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "people.timesheets#status" NOT NULL DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "people_timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_api_keys" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "key_hash" VARCHAR(128) NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "scopes" JSONB NOT NULL,
    "status" "platform.api_keys#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_backup_jobs" (
    "checksum" VARCHAR(128),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "status" "platform.backup_jobs#status" NOT NULL DEFAULT 'draft',
    "target_reference" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_backup_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_data_retention_policies" (
    "approved_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "legal_basis" VARCHAR(240),
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "policy_key" VARCHAR(100) NOT NULL,
    "retention_days" INTEGER,
    "status" "platform.data_retention_policies#status" NOT NULL DEFAULT 'active',
    "subject_kind" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_data_retention_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_export_jobs" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "error_code" VARCHAR(80),
    "export_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "status" "platform.export_jobs#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_export_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_exports" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "export_kind" VARCHAR(80) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "object_key" VARCHAR(512),
    "organisation_id" UUID NOT NULL,
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_user_id" UUID NOT NULL,
    "status" "platform.exports#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_feature_flag_assignments" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL,
    "ends_at" TIMESTAMPTZ(6),
    "feature_flag_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "platform.feature_flag_assignments#status" NOT NULL DEFAULT 'active',
    "subject_id" UUID NOT NULL,
    "subject_kind" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_feature_flag_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_feature_flags" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "rollout_percent" INTEGER NOT NULL,
    "status" "platform.feature_flags#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_integration_connections" (
    "connected_at" TIMESTAMPTZ(6),
    "connected_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "disconnected_at" TIMESTAMPTZ(6),
    "external_account_ref" VARCHAR(200),
    "id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "platform.integration_connections#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_integration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_integration_events" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "event_type" VARCHAR(120) NOT NULL,
    "external_event_id" VARCHAR(200),
    "id" UUID NOT NULL,
    "integration_connection_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "processed_at" TIMESTAMPTZ(6),
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "platform.integration_events#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_integration_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_integrations" (
    "capabilities" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "status" "platform.integrations#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_restore_jobs" (
    "backup_job_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "source_reference" VARCHAR(240) NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "status" "platform.restore_jobs#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_restore_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_runtime_observations" (
    "component" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "observation_kind" VARCHAR(80) NOT NULL,
    "observed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" "platform.runtime_observations#severity" NOT NULL DEFAULT 'normal',
    "status" "platform.runtime_observations#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" JSONB,

    CONSTRAINT "platform_runtime_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_share_links" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "resource_type" VARCHAR(100) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "status" "platform.share_links#status" NOT NULL DEFAULT 'active',
    "token_hash" VARCHAR(128) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_status_events" (
    "actor_user_id" UUID,
    "component" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "details" JSONB,
    "from_status" VARCHAR(40),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "status" "platform.status_events#status" NOT NULL DEFAULT 'active',
    "to_status" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_status_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_support_comments" (
    "author_user_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "platform.support_comments#status" NOT NULL DEFAULT 'active',
    "support_ticket_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_support_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_support_tickets" (
    "assigned_to_user_id" UUID,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "opened_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened_by_user_id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "severity" "platform.support_tickets#severity" NOT NULL DEFAULT 'normal',
    "status" "platform.support_tickets#status" NOT NULL DEFAULT 'draft',
    "subject" VARCHAR(240) NOT NULL,
    "ticket_number" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_sync_conflicts" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "entity_id" UUID NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "id" UUID NOT NULL,
    "local_value" JSONB,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "remote_value" JSONB,
    "resolved_at" TIMESTAMPTZ(6),
    "resolved_by_user_id" UUID,
    "status" "platform.sync_conflicts#status" NOT NULL DEFAULT 'draft',
    "sync_job_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_sync_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_sync_jobs" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "cursor" VARCHAR(512),
    "description" TEXT,
    "direction" VARCHAR(24) NOT NULL,
    "id" UUID NOT NULL,
    "integration_connection_id" UUID,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "status" "platform.sync_jobs#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_sync_queue_items" (
    "attempts" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "enqueued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "item_key" VARCHAR(200) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "operation" VARCHAR(40) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "platform.sync_queue_items#status" NOT NULL DEFAULT 'draft',
    "sync_job_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_sync_queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_system_incidents" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "detected_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "resolved_at" TIMESTAMPTZ(6),
    "severity" "platform.system_incidents#severity" NOT NULL DEFAULT 'normal',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "platform.system_incidents#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_system_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_user_preferences" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "preference_key" VARCHAR(100) NOT NULL,
    "preference_value" JSONB NOT NULL,
    "status" "platform.user_preferences#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "platform_user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_webhook_deliveries" (
    "attempt_number" INTEGER NOT NULL,
    "attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "next_attempt_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "response_code" INTEGER,
    "response_excerpt" TEXT,
    "status" "platform.webhook_deliveries#status" NOT NULL DEFAULT 'draft',
    "subscription_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "webhook_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "platform_webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_webhook_subscriptions" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "event_pattern" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "platform.webhook_subscriptions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "webhook_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "platform_webhook_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_webhooks" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "secret_reference" VARCHAR(160) NOT NULL,
    "status" "platform.webhooks#status" NOT NULL DEFAULT 'active',
    "target_url" VARCHAR(2048) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_workspace_preferences" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "preference_key" VARCHAR(100) NOT NULL,
    "preference_value" JSONB NOT NULL,
    "status" "platform.workspace_preferences#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "platform_workspace_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_call_sheet_acknowledgements" (
    "acknowledged_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "call_sheet_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "note" TEXT,
    "organisation_id" UUID NOT NULL,
    "response" VARCHAR(40),
    "status" "production.call_sheet_acknowledgements#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_call_sheet_acknowledgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_call_sheet_recipients" (
    "acknowledged_at" TIMESTAMPTZ(6),
    "call_sheet_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "delivery_status" "production.call_sheet_recipients#delivery_status" NOT NULL DEFAULT 'draft',
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "sent_at" TIMESTAMPTZ(6),
    "status" "production.call_sheet_recipients#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_call_sheet_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_call_sheet_versions" (
    "call_sheet_id" UUID NOT NULL,
    "content_hash" VARCHAR(128),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "status" "production.call_sheet_versions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_call_sheet_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_call_sheets" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "general_notes" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "status" "production.call_sheets#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_call_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_daily_production_reports" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "pages_completed" DECIMAL(65,30),
    "production_day_id" UUID,
    "project_id" UUID NOT NULL,
    "report_date" DATE NOT NULL,
    "status" "production.daily_production_reports#status" NOT NULL DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ(6),
    "submitted_by_user_id" UUID,
    "summary" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_daily_production_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_delays" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ended_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "impact_minutes" INTEGER,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "reported_by_user_id" UUID,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "production.delays#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_delays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_incidents" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "incident_kind" VARCHAR(80) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID,
    "reported_by_user_id" UUID,
    "resolved_at" TIMESTAMPTZ(6),
    "severity" "production.incidents#severity" NOT NULL DEFAULT 'normal',
    "status" "production.incidents#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_live_attendance" (
    "attendance_date" DATE NOT NULL,
    "checked_in_at" TIMESTAMPTZ(6),
    "checked_out_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "status" "production.live_attendance#status" NOT NULL DEFAULT 'expected',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_live_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_production_calendars" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "production.production_calendars#status" NOT NULL DEFAULT 'active',
    "timezone" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_production_calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_production_days" (
    "calendar_id" UUID,
    "call_time" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "day_number" INTEGER NOT NULL,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_date" DATE NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "production.production_days#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,
    "wrap_time" TIMESTAMPTZ(6),

    CONSTRAINT "production_production_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_scene_progress" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "scene_reference" VARCHAR(80) NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "status" "production.scene_progress#status" NOT NULL DEFAULT 'draft',
    "strip_id" UUID,
    "takes_completed" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_scene_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_schedule_items" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "ends_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "item_kind" VARCHAR(60) NOT NULL,
    "location_label" VARCHAR(200),
    "organisation_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "project_milestone_id" UUID,
    "schedule_id" UUID NOT NULL,
    "schedule_version_id" UUID,
    "starts_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "production.schedule_items#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_schedule_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_schedule_versions" (
    "change_summary" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "schedule_id" UUID NOT NULL,
    "status" "production.schedule_versions#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_schedule_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_schedules" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "effective_from" DATE NOT NULL,
    "effective_until" DATE,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "production.schedules#status" NOT NULL DEFAULT 'draft',
    "timezone" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_shoot_days" (
    "call_time" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "shoot_date" DATE NOT NULL,
    "status" "production.shoot_days#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weather_notes" TEXT,
    "workspace_id" UUID,
    "wrap_time" TIMESTAMPTZ(6),

    CONSTRAINT "production_shoot_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_shot_progress" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "scene_progress_id" UUID,
    "shot_reference" VARCHAR(100) NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "status" "production.shot_progress#status" NOT NULL DEFAULT 'draft',
    "takes_completed" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_shot_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_stripboards" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "schedule_id" UUID,
    "status" "production.stripboards#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "production_stripboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_strips" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "page_eighths" DECIMAL(65,30),
    "position" INTEGER NOT NULL,
    "production_day_id" UUID,
    "scene_number" VARCHAR(40) NOT NULL,
    "scheduled_minutes" INTEGER,
    "status" "production.strips#status" NOT NULL DEFAULT 'draft',
    "stripboard_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "production_strips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_wrap_reports" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "production_day_id" UUID NOT NULL,
    "report_date" DATE NOT NULL,
    "status" "production.wrap_reports#status" NOT NULL DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ(6),
    "submitted_by_user_id" UUID,
    "summary" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,
    "wrapped_at" TIMESTAMPTZ(6),

    CONSTRAINT "production_wrap_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_activity" (
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "details" JSONB,
    "event_type" VARCHAR(80) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "project.project_activity#status" NOT NULL DEFAULT 'active',
    "summary" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_blockers" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "details" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "project_id" UUID NOT NULL,
    "raised_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),
    "status" "project.project_blockers#status" NOT NULL DEFAULT 'draft',
    "task_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_blockers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_briefs" (
    "authored_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "objective" TEXT NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "scope" TEXT,
    "status" "project.project_briefs#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_number" INTEGER NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "project_project_briefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_closeouts" (
    "approved_by_user_id" UUID,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "lessons_learned" TEXT,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "project.project_closeouts#status" NOT NULL DEFAULT 'draft',
    "summary" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_closeouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_health_snapshots" (
    "captured_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "health_score" DECIMAL(65,30) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "risk_level" VARCHAR(24) NOT NULL,
    "status" "project.project_health_snapshots#status" NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_health_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_intakes" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "request_summary" TEXT NOT NULL,
    "requested_by_name" VARCHAR(160),
    "requested_start_on" DATE,
    "status" "project.project_intakes#status" NOT NULL DEFAULT 'draft',
    "submitted_by_user_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_members" (
    "added_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6),
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "role" "project.project_members#project_role" NOT NULL,
    "status" "project.project_members#membership_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "project_project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_milestones" (
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "project_id" UUID NOT NULL,
    "status" "project.project_milestones#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_notes" (
    "author_user_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "status" "project.project_notes#status" NOT NULL DEFAULT 'active',
    "title" VARCHAR(200),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" VARCHAR(24) NOT NULL,
    "workspace_id" UUID,

    CONSTRAINT "project_project_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_status_history" (
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "from_status" VARCHAR(40),
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "reason" TEXT,
    "status" "project.project_status_history#status" NOT NULL DEFAULT 'active',
    "to_status" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_tag_links" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "project_tag_id" UUID NOT NULL,
    "status" "project.project_tag_links#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_tag_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_tags" (
    "color_token" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "label" VARCHAR(80) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "project_type_id" UUID,
    "status" "project.project_tags#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_tasks" (
    "assignee_user_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "parent_task_id" UUID,
    "priority" "project.project_tasks#priority" NOT NULL DEFAULT 'normal',
    "project_id" UUID NOT NULL,
    "status" "project.project_tasks#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_project_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_project_types" (
    "code" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR(120) NOT NULL,
    "status" "project.project_types#status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_project_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_projects" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" "project.projects#project_status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID NOT NULL,

    CONSTRAINT "project_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_task_checklists" (
    "completed_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "description" TEXT,
    "id" UUID NOT NULL,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "organisation_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "project.task_checklists#status" NOT NULL DEFAULT 'active',
    "task_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_task_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_task_dependencies" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "dependency_kind" VARCHAR(40) NOT NULL,
    "depends_on_task_id" UUID NOT NULL,
    "description" TEXT,
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "organisation_id" UUID NOT NULL,
    "status" "project.task_dependencies#status" NOT NULL DEFAULT 'active',
    "task_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" UUID,

    CONSTRAINT "project_task_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_case_studies" (
    "body" JSONB NOT NULL,
    "case_status" "public.case_studies#case_status" NOT NULL DEFAULT 'draft',
    "client_name" VARCHAR(200),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "evidence_item_id" UUID,
    "id" UUID NOT NULL,
    "locale" VARCHAR(16) NOT NULL,
    "outcome_metrics" JSONB,
    "project_id" UUID,
    "published_at" TIMESTAMPTZ(6),
    "slug" VARCHAR(160) NOT NULL,
    "summary" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_contact_requests" (
    "assigned_to_user_id" UUID,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "email" VARCHAR(320) NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "organisation_name" VARCHAR(200),
    "request_status" "public.contact_requests#request_status" NOT NULL DEFAULT 'new',
    "submitted_at" TIMESTAMPTZ(6) NOT NULL,
    "topic" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_cookie_consents" (
    "consent_choices" JSONB NOT NULL,
    "consent_id" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "expires_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL,
    "policy_version" VARCHAR(40) NOT NULL,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL,
    "session_hash" VARCHAR(128),
    "source" VARCHAR(60) NOT NULL,
    "status" "public.cookie_consents#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "public_cookie_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_demo_requests" (
    "assigned_to_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "email" VARCHAR(320) NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "id" UUID NOT NULL,
    "organisation_name" VARCHAR(200),
    "preferred_at" TIMESTAMPTZ(6),
    "product_interest" JSONB,
    "request_status" "public.demo_requests#request_status" NOT NULL DEFAULT 'new',
    "role" VARCHAR(120),
    "submitted_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_documentation_pages" (
    "body" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "locale" VARCHAR(16) NOT NULL,
    "page_status" "public.documentation_pages#page_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "search_keywords" JSONB,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_label" VARCHAR(40),

    CONSTRAINT "public_documentation_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_industry_pages" (
    "body" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "locale" VARCHAR(16) NOT NULL,
    "page_status" "public.industry_pages#page_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "seo" JSONB,
    "slug" VARCHAR(160) NOT NULL,
    "summary" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_industry_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_legal_documents" (
    "body_uri" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "document_kind" VARCHAR(60) NOT NULL,
    "effective_at" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "locale" VARCHAR(16) NOT NULL,
    "retired_at" TIMESTAMPTZ(6),
    "status" "public.legal_documents#status" NOT NULL DEFAULT 'draft',
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version_label" VARCHAR(40) NOT NULL,

    CONSTRAINT "public_legal_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_marketing_events" (
    "anonymous_id" VARCHAR(128),
    "consent_state" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "event_name" VARCHAR(120) NOT NULL,
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "properties" JSONB,
    "session_hash" VARCHAR(128),
    "status" "public.marketing_events#status" NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_marketing_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_marketing_leads" (
    "assigned_to_user_id" UUID,
    "captured_at" TIMESTAMPTZ(6) NOT NULL,
    "company_name" VARCHAR(200),
    "consent_status" "public.marketing_leads#consent_status" NOT NULL DEFAULT 'granted',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "email" VARCHAR(320) NOT NULL,
    "full_name" VARCHAR(160),
    "id" UUID NOT NULL,
    "lead_status" "public.marketing_leads#lead_status" NOT NULL DEFAULT 'new',
    "source" VARCHAR(80) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_marketing_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_pricing_plans" (
    "billing_period" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "currency_code" VARCHAR(3) NOT NULL,
    "description" TEXT,
    "features" JSONB NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "plan_key" VARCHAR(100) NOT NULL,
    "plan_status" "public.pricing_plans#plan_status" NOT NULL DEFAULT 'draft',
    "price_amount" DECIMAL(65,30),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_product_pages" (
    "body" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "locale" VARCHAR(16) NOT NULL,
    "page_status" "public.product_pages#page_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "seo" JSONB,
    "slug" VARCHAR(160) NOT NULL,
    "summary" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_product_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_solution_pages" (
    "body" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "id" UUID NOT NULL,
    "locale" VARCHAR(16) NOT NULL,
    "page_status" "public.solution_pages#page_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "seo" JSONB,
    "slug" VARCHAR(160) NOT NULL,
    "summary" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_solution_pages_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "campaign_metrics_campaign_id_metric_key_period_start_p_34c16a8b" ON "campaign_campaign_metrics"("campaign_id", "metric_key", "period_start", "period_end");

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
CREATE INDEX "ix_announcements_3_organisation_id_workspace_id_status_6dbbae6c" ON "communications_announcements"("organisation_id", "workspace_id", "status", "published_at");

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
CREATE INDEX "ix_direct_message_threads_2_organisation_id_workspace__2811225d" ON "communications_direct_message_threads"("organisation_id", "workspace_id", "participant_low_membership_id", "participant_high_membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_direct_message_threads_organisation_id_workspace_id_547900c4" ON "communications_direct_message_threads"("organisation_id", "workspace_id", "participant_low_membership_id", "participant_high_membership_id");

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
CREATE INDEX "ix_notification_deliveries_1_organisation_id_status_sc_942c17a3" ON "communications_notification_deliveries"("organisation_id", "status", "scheduled_at");

-- CreateIndex
CREATE INDEX "ix_notification_deliveries_2_notification_id_created_at" ON "communications_notification_deliveries"("notification_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notification_deliveries_organisation_id_idempotency_key" ON "communications_notification_deliveries"("organisation_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notification_deliveries_notification_id_attempt_number" ON "communications_notification_deliveries"("notification_id", "attempt_number");

-- CreateIndex
CREATE INDEX "ix_notification_preferences_1_organisation_id_user_id" ON "communications_notification_preferences"("organisation_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notification_preferences_organisation_id_user_id_no_2bac9274" ON "communications_notification_preferences"("organisation_id", "user_id", "notification_type", "channel");

-- CreateIndex
CREATE INDEX "ix_notifications_1_organisation_id_recipient_user_id_created_at" ON "communications_notifications"("organisation_id", "recipient_user_id", "created_at");

-- CreateIndex
CREATE INDEX "ix_notifications_2_organisation_id_recipient_user_id_state" ON "communications_notifications"("organisation_id", "recipient_user_id", "state");

-- CreateIndex
CREATE INDEX "ix_notifications_3_organisation_id_workspace_id" ON "communications_notifications"("organisation_id", "workspace_id");

-- CreateIndex
CREATE INDEX "ix_notifications_4_organisation_id_workspace_id_recipi_a285634b" ON "communications_notifications"("organisation_id", "workspace_id", "recipient_user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notifications_organisation_id_id" ON "communications_notifications"("organisation_id", "id");

-- CreateIndex
CREATE INDEX "ix_thread_members_1_organisation_id_workspace_id_threa_9c2be101" ON "communications_thread_members"("organisation_id", "workspace_id", "thread_id", "workspace_membership_id", "left_at");

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
CREATE UNIQUE INDEX "decision_graph_edges_decision_graph_id_from_node_key_t_e84a7567" ON "eventsSpatial_decision_graph_edges"("decision_graph_id", "from_node_key", "to_node_key");

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

-- AddForeignKey
ALTER TABLE "campaign_activation_calendar_items" ADD CONSTRAINT "campaign_activation_calendar_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_calendar_items" ADD CONSTRAINT "campaign_activation_calendar_items_activation_id_workspace_fkey" FOREIGN KEY ("activation_id", "workspace_id", "organisation_id") REFERENCES "campaign_activations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_calendar_items" ADD CONSTRAINT "campaign_activation_calendar_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_calendar_items" ADD CONSTRAINT "campaign_activation_calendar_items_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_feed_events" ADD CONSTRAINT "campaign_activation_feed_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_feed_events" ADD CONSTRAINT "campaign_activation_feed_events_activation_id_workspace_id_fkey" FOREIGN KEY ("activation_id", "workspace_id", "organisation_id") REFERENCES "campaign_activations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_feed_events" ADD CONSTRAINT "campaign_activation_feed_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_feed_events" ADD CONSTRAINT "campaign_activation_feed_events_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activation_feed_events" ADD CONSTRAINT "campaign_activation_feed_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activations" ADD CONSTRAINT "campaign_activations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activations" ADD CONSTRAINT "campaign_activations_campaign_id_workspace_id_organisation_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activations" ADD CONSTRAINT "campaign_activations_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activations" ADD CONSTRAINT "campaign_activations_location_id_workspace_id_organisation_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activations" ADD CONSTRAINT "campaign_activations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_activations" ADD CONSTRAINT "campaign_activations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_atl_plans" ADD CONSTRAINT "campaign_atl_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_atl_plans" ADD CONSTRAINT "campaign_atl_plans_campaign_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_atl_plans" ADD CONSTRAINT "campaign_atl_plans_media_plan_id_workspace_id_organisation_fkey" FOREIGN KEY ("media_plan_id", "workspace_id", "organisation_id") REFERENCES "campaign_media_plans"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_atl_plans" ADD CONSTRAINT "campaign_atl_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_atl_plans" ADD CONSTRAINT "campaign_atl_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_btl_plans" ADD CONSTRAINT "campaign_btl_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_btl_plans" ADD CONSTRAINT "campaign_btl_plans_campaign_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_btl_plans" ADD CONSTRAINT "campaign_btl_plans_media_plan_id_workspace_id_organisation_fkey" FOREIGN KEY ("media_plan_id", "workspace_id", "organisation_id") REFERENCES "campaign_media_plans"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_btl_plans" ADD CONSTRAINT "campaign_btl_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_btl_plans" ADD CONSTRAINT "campaign_btl_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_briefs" ADD CONSTRAINT "campaign_campaign_briefs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_briefs" ADD CONSTRAINT "campaign_campaign_briefs_campaign_id_workspace_id_organisa_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_briefs" ADD CONSTRAINT "campaign_campaign_briefs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_briefs" ADD CONSTRAINT "campaign_campaign_briefs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_markets" ADD CONSTRAINT "campaign_campaign_markets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_markets" ADD CONSTRAINT "campaign_campaign_markets_campaign_id_workspace_id_organis_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_markets" ADD CONSTRAINT "campaign_campaign_markets_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "campaign_markets"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_markets" ADD CONSTRAINT "campaign_campaign_markets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_markets" ADD CONSTRAINT "campaign_campaign_markets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_metrics" ADD CONSTRAINT "campaign_campaign_metrics_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_metrics" ADD CONSTRAINT "campaign_campaign_metrics_campaign_id_workspace_id_organis_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_metrics" ADD CONSTRAINT "campaign_campaign_metrics_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_metrics" ADD CONSTRAINT "campaign_campaign_metrics_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_results" ADD CONSTRAINT "campaign_campaign_results_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_results" ADD CONSTRAINT "campaign_campaign_results_campaign_id_workspace_id_organis_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_results" ADD CONSTRAINT "campaign_campaign_results_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_results" ADD CONSTRAINT "campaign_campaign_results_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_strategies" ADD CONSTRAINT "campaign_campaign_strategies_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_strategies" ADD CONSTRAINT "campaign_campaign_strategies_campaign_id_workspace_id_orga_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_strategies" ADD CONSTRAINT "campaign_campaign_strategies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaign_strategies" ADD CONSTRAINT "campaign_campaign_strategies_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaigns" ADD CONSTRAINT "campaign_campaigns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaigns" ADD CONSTRAINT "campaign_campaigns_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaigns" ADD CONSTRAINT "campaign_campaigns_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaigns" ADD CONSTRAINT "campaign_campaigns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_campaigns" ADD CONSTRAINT "campaign_campaigns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_cities" ADD CONSTRAINT "campaign_cities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_schedules" ADD CONSTRAINT "campaign_dooh_schedules_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_schedules" ADD CONSTRAINT "campaign_dooh_schedules_campaign_id_workspace_id_organisat_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_schedules" ADD CONSTRAINT "campaign_dooh_schedules_dooh_screen_id_workspace_id_organi_fkey" FOREIGN KEY ("dooh_screen_id", "workspace_id", "organisation_id") REFERENCES "campaign_dooh_screens"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_schedules" ADD CONSTRAINT "campaign_dooh_schedules_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_schedules" ADD CONSTRAINT "campaign_dooh_schedules_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_screens" ADD CONSTRAINT "campaign_dooh_screens_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_screens" ADD CONSTRAINT "campaign_dooh_screens_location_id_workspace_id_organisatio_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_screens" ADD CONSTRAINT "campaign_dooh_screens_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_dooh_screens" ADD CONSTRAINT "campaign_dooh_screens_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_lead_events" ADD CONSTRAINT "campaign_lead_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_lead_events" ADD CONSTRAINT "campaign_lead_events_lead_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("lead_id", "workspace_id", "organisation_id") REFERENCES "campaign_leads"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_lead_events" ADD CONSTRAINT "campaign_lead_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_lead_events" ADD CONSTRAINT "campaign_lead_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_lead_events" ADD CONSTRAINT "campaign_lead_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_leads" ADD CONSTRAINT "campaign_leads_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_leads" ADD CONSTRAINT "campaign_leads_campaign_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_leads" ADD CONSTRAINT "campaign_leads_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_leads" ADD CONSTRAINT "campaign_leads_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_leads" ADD CONSTRAINT "campaign_leads_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_markets" ADD CONSTRAINT "campaign_markets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plan_items" ADD CONSTRAINT "campaign_media_plan_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plan_items" ADD CONSTRAINT "campaign_media_plan_items_media_plan_id_workspace_id_organ_fkey" FOREIGN KEY ("media_plan_id", "workspace_id", "organisation_id") REFERENCES "campaign_media_plans"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plan_items" ADD CONSTRAINT "campaign_media_plan_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plan_items" ADD CONSTRAINT "campaign_media_plan_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plans" ADD CONSTRAINT "campaign_media_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plans" ADD CONSTRAINT "campaign_media_plans_campaign_id_workspace_id_organisation_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plans" ADD CONSTRAINT "campaign_media_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_media_plans" ADD CONSTRAINT "campaign_media_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_site_bookings" ADD CONSTRAINT "campaign_ooh_site_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_site_bookings" ADD CONSTRAINT "campaign_ooh_site_bookings_campaign_id_workspace_id_organi_fkey" FOREIGN KEY ("campaign_id", "workspace_id", "organisation_id") REFERENCES "campaign_campaigns"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_site_bookings" ADD CONSTRAINT "campaign_ooh_site_bookings_ooh_site_id_workspace_id_organi_fkey" FOREIGN KEY ("ooh_site_id", "workspace_id", "organisation_id") REFERENCES "campaign_ooh_sites"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_site_bookings" ADD CONSTRAINT "campaign_ooh_site_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_site_bookings" ADD CONSTRAINT "campaign_ooh_site_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_site_bookings" ADD CONSTRAINT "campaign_ooh_site_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_sites" ADD CONSTRAINT "campaign_ooh_sites_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_sites" ADD CONSTRAINT "campaign_ooh_sites_location_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_sites" ADD CONSTRAINT "campaign_ooh_sites_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_ooh_sites" ADD CONSTRAINT "campaign_ooh_sites_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_site_checkins" ADD CONSTRAINT "campaign_site_checkins_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_site_checkins" ADD CONSTRAINT "campaign_site_checkins_activation_id_workspace_id_organisa_fkey" FOREIGN KEY ("activation_id", "workspace_id", "organisation_id") REFERENCES "campaign_activations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_site_checkins" ADD CONSTRAINT "campaign_site_checkins_location_id_workspace_id_organisati_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_site_checkins" ADD CONSTRAINT "campaign_site_checkins_checked_in_by_user_id_fkey" FOREIGN KEY ("checked_in_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_site_checkins" ADD CONSTRAINT "campaign_site_checkins_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign_site_checkins" ADD CONSTRAINT "campaign_site_checkins_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_announcements" ADD CONSTRAINT "communications_announcements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_announcements" ADD CONSTRAINT "communications_announcements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_announcements" ADD CONSTRAINT "communications_announcements_organisation_id_author_user_i_fkey" FOREIGN KEY ("organisation_id", "author_user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_announcements" ADD CONSTRAINT "communications_announcements_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_communication_threads" ADD CONSTRAINT "communications_communication_threads_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_communication_threads" ADD CONSTRAINT "communications_communication_threads_workspace_id_organisa_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_communication_threads" ADD CONSTRAINT "communications_communication_threads_organisation_id_creat_fkey" FOREIGN KEY ("organisation_id", "created_by_user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_communication_threads" ADD CONSTRAINT "communications_communication_threads_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_direct_message_threads" ADD CONSTRAINT "communications_direct_message_threads_organisation_id_thre_fkey" FOREIGN KEY ("organisation_id", "thread_id", "workspace_id") REFERENCES "communications_communication_threads"("organisation_id", "id", "workspace_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_direct_message_threads" ADD CONSTRAINT "communications_direct_message_threads_workspace_id_organis_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_direct_message_threads" ADD CONSTRAINT "communications_direct_message_threads_participant_low_memb_fkey" FOREIGN KEY ("participant_low_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_direct_message_threads" ADD CONSTRAINT "communications_direct_message_threads_participant_high_mem_fkey" FOREIGN KEY ("participant_high_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_message_attachments" ADD CONSTRAINT "communications_message_attachments_organisation_id_message_fkey" FOREIGN KEY ("organisation_id", "message_id") REFERENCES "communications_messages"("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_message_attachments" ADD CONSTRAINT "communications_message_attachments_organisation_id_created_fkey" FOREIGN KEY ("organisation_id", "created_by_user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_message_attachments" ADD CONSTRAINT "communications_message_attachments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_messages" ADD CONSTRAINT "communications_messages_organisation_id_thread_id_fkey" FOREIGN KEY ("organisation_id", "thread_id") REFERENCES "communications_communication_threads"("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_messages" ADD CONSTRAINT "communications_messages_organisation_id_sender_user_id_fkey" FOREIGN KEY ("organisation_id", "sender_user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_messages" ADD CONSTRAINT "communications_messages_redacted_by_user_id_fkey" FOREIGN KEY ("redacted_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_messages" ADD CONSTRAINT "communications_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notification_deliveries" ADD CONSTRAINT "communications_notification_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notification_deliveries" ADD CONSTRAINT "communications_notification_deliveries_organisation_id_not_fkey" FOREIGN KEY ("organisation_id", "notification_id") REFERENCES "communications_notifications"("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notification_preferences" ADD CONSTRAINT "communications_notification_preferences_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notification_preferences" ADD CONSTRAINT "communications_notification_preferences_organisation_id_us_fkey" FOREIGN KEY ("organisation_id", "user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notification_preferences" ADD CONSTRAINT "communications_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notifications" ADD CONSTRAINT "communications_notifications_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notifications" ADD CONSTRAINT "communications_notifications_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notifications" ADD CONSTRAINT "communications_notifications_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notifications" ADD CONSTRAINT "communications_notifications_organisation_id_recipient_use_fkey" FOREIGN KEY ("organisation_id", "recipient_user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notifications" ADD CONSTRAINT "communications_notifications_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_notifications" ADD CONSTRAINT "communications_notifications_organisation_id_actor_user_id_fkey" FOREIGN KEY ("organisation_id", "actor_user_id") REFERENCES "organisation_organisation_memberships"("organisation_id", "user_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_thread_members" ADD CONSTRAINT "communications_thread_members_organisation_id_thread_id_wo_fkey" FOREIGN KEY ("organisation_id", "thread_id", "workspace_id") REFERENCES "communications_communication_threads"("organisation_id", "id", "workspace_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications_thread_members" ADD CONSTRAINT "communications_thread_members_workspace_membership_id_work_fkey" FOREIGN KEY ("workspace_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_asset_versions" ADD CONSTRAINT "creative_asset_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_asset_versions" ADD CONSTRAINT "creative_asset_versions_creative_asset_id_workspace_id_org_fkey" FOREIGN KEY ("creative_asset_id", "workspace_id", "organisation_id") REFERENCES "creative_creative_assets"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_asset_versions" ADD CONSTRAINT "creative_asset_versions_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_asset_versions" ADD CONSTRAINT "creative_asset_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_asset_versions" ADD CONSTRAINT "creative_asset_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_character_scene_links" ADD CONSTRAINT "creative_character_scene_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_character_scene_links" ADD CONSTRAINT "creative_character_scene_links_character_id_workspace_id_o_fkey" FOREIGN KEY ("character_id", "workspace_id", "organisation_id") REFERENCES "creative_characters"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_character_scene_links" ADD CONSTRAINT "creative_character_scene_links_scene_id_workspace_id_organ_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_character_scene_links" ADD CONSTRAINT "creative_character_scene_links_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_character_scene_links" ADD CONSTRAINT "creative_character_scene_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_characters" ADD CONSTRAINT "creative_characters_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_characters" ADD CONSTRAINT "creative_characters_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_characters" ADD CONSTRAINT "creative_characters_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_characters" ADD CONSTRAINT "creative_characters_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_characters" ADD CONSTRAINT "creative_characters_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_script_version_id_workspace_id_fkey" FOREIGN KEY ("script_version_id", "workspace_id", "organisation_id") REFERENCES "creative_script_versions"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_creative_asset_id_workspace_id_fkey" FOREIGN KEY ("creative_asset_id", "workspace_id", "organisation_id") REFERENCES "creative_creative_assets"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_approvals" ADD CONSTRAINT "creative_creative_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_assets" ADD CONSTRAINT "creative_creative_assets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_assets" ADD CONSTRAINT "creative_creative_assets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_assets" ADD CONSTRAINT "creative_creative_assets_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_assets" ADD CONSTRAINT "creative_creative_assets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_assets" ADD CONSTRAINT "creative_creative_assets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_references" ADD CONSTRAINT "creative_creative_references_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_references" ADD CONSTRAINT "creative_creative_references_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_references" ADD CONSTRAINT "creative_creative_references_evidence_item_id_organisation_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_references" ADD CONSTRAINT "creative_creative_references_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_creative_references" ADD CONSTRAINT "creative_creative_references_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_ideas" ADD CONSTRAINT "creative_ideas_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_ideas" ADD CONSTRAINT "creative_ideas_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_ideas" ADD CONSTRAINT "creative_ideas_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_ideas" ADD CONSTRAINT "creative_ideas_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_production_elements" ADD CONSTRAINT "creative_production_elements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_production_elements" ADD CONSTRAINT "creative_production_elements_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_production_elements" ADD CONSTRAINT "creative_production_elements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_production_elements" ADD CONSTRAINT "creative_production_elements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_research_items" ADD CONSTRAINT "creative_research_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_research_items" ADD CONSTRAINT "creative_research_items_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_research_items" ADD CONSTRAINT "creative_research_items_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_research_items" ADD CONSTRAINT "creative_research_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_research_items" ADD CONSTRAINT "creative_research_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_elements" ADD CONSTRAINT "creative_scene_elements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_elements" ADD CONSTRAINT "creative_scene_elements_scene_id_workspace_id_organisation_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_elements" ADD CONSTRAINT "creative_scene_elements_production_element_id_workspace_id_fkey" FOREIGN KEY ("production_element_id", "workspace_id", "organisation_id") REFERENCES "creative_production_elements"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_elements" ADD CONSTRAINT "creative_scene_elements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_elements" ADD CONSTRAINT "creative_scene_elements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_versions" ADD CONSTRAINT "creative_scene_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_versions" ADD CONSTRAINT "creative_scene_versions_scene_id_workspace_id_organisation_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_versions" ADD CONSTRAINT "creative_scene_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scene_versions" ADD CONSTRAINT "creative_scene_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scenes" ADD CONSTRAINT "creative_scenes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scenes" ADD CONSTRAINT "creative_scenes_script_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scenes" ADD CONSTRAINT "creative_scenes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scenes" ADD CONSTRAINT "creative_scenes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_breakdowns" ADD CONSTRAINT "creative_script_breakdowns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_breakdowns" ADD CONSTRAINT "creative_script_breakdowns_script_version_id_workspace_id__fkey" FOREIGN KEY ("script_version_id", "workspace_id", "organisation_id") REFERENCES "creative_script_versions"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_breakdowns" ADD CONSTRAINT "creative_script_breakdowns_scene_id_workspace_id_organisat_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_breakdowns" ADD CONSTRAINT "creative_script_breakdowns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_breakdowns" ADD CONSTRAINT "creative_script_breakdowns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_versions" ADD CONSTRAINT "creative_script_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_versions" ADD CONSTRAINT "creative_script_versions_script_id_workspace_id_organisati_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_versions" ADD CONSTRAINT "creative_script_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_script_versions" ADD CONSTRAINT "creative_script_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scripts" ADD CONSTRAINT "creative_scripts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scripts" ADD CONSTRAINT "creative_scripts_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scripts" ADD CONSTRAINT "creative_scripts_treatment_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("treatment_id", "workspace_id", "organisation_id") REFERENCES "creative_treatments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scripts" ADD CONSTRAINT "creative_scripts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_scripts" ADD CONSTRAINT "creative_scripts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shot_lists" ADD CONSTRAINT "creative_shot_lists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shot_lists" ADD CONSTRAINT "creative_shot_lists_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shot_lists" ADD CONSTRAINT "creative_shot_lists_script_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shot_lists" ADD CONSTRAINT "creative_shot_lists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shot_lists" ADD CONSTRAINT "creative_shot_lists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shots" ADD CONSTRAINT "creative_shots_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shots" ADD CONSTRAINT "creative_shots_shot_list_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("shot_list_id", "workspace_id", "organisation_id") REFERENCES "creative_shot_lists"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shots" ADD CONSTRAINT "creative_shots_scene_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shots" ADD CONSTRAINT "creative_shots_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_shots" ADD CONSTRAINT "creative_shots_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboard_frames" ADD CONSTRAINT "creative_storyboard_frames_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboard_frames" ADD CONSTRAINT "creative_storyboard_frames_storyboard_id_workspace_id_orga_fkey" FOREIGN KEY ("storyboard_id", "workspace_id", "organisation_id") REFERENCES "creative_storyboards"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboard_frames" ADD CONSTRAINT "creative_storyboard_frames_scene_id_workspace_id_organisat_fkey" FOREIGN KEY ("scene_id", "workspace_id", "organisation_id") REFERENCES "creative_scenes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboard_frames" ADD CONSTRAINT "creative_storyboard_frames_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboard_frames" ADD CONSTRAINT "creative_storyboard_frames_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboards" ADD CONSTRAINT "creative_storyboards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboards" ADD CONSTRAINT "creative_storyboards_script_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("script_id", "workspace_id", "organisation_id") REFERENCES "creative_scripts"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboards" ADD CONSTRAINT "creative_storyboards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_storyboards" ADD CONSTRAINT "creative_storyboards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_treatments" ADD CONSTRAINT "creative_treatments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_treatments" ADD CONSTRAINT "creative_treatments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_treatments" ADD CONSTRAINT "creative_treatments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creative_treatments" ADD CONSTRAINT "creative_treatments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_board_items" ADD CONSTRAINT "eventsSpatial_board_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_board_items" ADD CONSTRAINT "eventsSpatial_board_items_board_id_workspace_id_organisati_fkey" FOREIGN KEY ("board_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_boards"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_board_items" ADD CONSTRAINT "eventsSpatial_board_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_board_items" ADD CONSTRAINT "eventsSpatial_board_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_boards" ADD CONSTRAINT "eventsSpatial_boards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_boards" ADD CONSTRAINT "eventsSpatial_boards_spatial_project_id_workspace_id_organ_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_boards" ADD CONSTRAINT "eventsSpatial_boards_event_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_boards" ADD CONSTRAINT "eventsSpatial_boards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_boards" ADD CONSTRAINT "eventsSpatial_boards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_cad_models" ADD CONSTRAINT "eventsSpatial_cad_models_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_cad_models" ADD CONSTRAINT "eventsSpatial_cad_models_spatial_project_id_workspace_id_o_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_cad_models" ADD CONSTRAINT "eventsSpatial_cad_models_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_cad_models" ADD CONSTRAINT "eventsSpatial_cad_models_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_cad_models" ADD CONSTRAINT "eventsSpatial_cad_models_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_cad_models" ADD CONSTRAINT "eventsSpatial_cad_models_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_edges" ADD CONSTRAINT "eventsSpatial_decision_graph_edges_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_edges" ADD CONSTRAINT "eventsSpatial_decision_graph_edges_decision_graph_id_works_fkey" FOREIGN KEY ("decision_graph_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_decision_graphs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_edges" ADD CONSTRAINT "eventsSpatial_decision_graph_edges_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_edges" ADD CONSTRAINT "eventsSpatial_decision_graph_edges_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_nodes" ADD CONSTRAINT "eventsSpatial_decision_graph_nodes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_nodes" ADD CONSTRAINT "eventsSpatial_decision_graph_nodes_decision_graph_id_works_fkey" FOREIGN KEY ("decision_graph_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_decision_graphs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_nodes" ADD CONSTRAINT "eventsSpatial_decision_graph_nodes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graph_nodes" ADD CONSTRAINT "eventsSpatial_decision_graph_nodes_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graphs" ADD CONSTRAINT "eventsSpatial_decision_graphs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graphs" ADD CONSTRAINT "eventsSpatial_decision_graphs_spatial_project_id_workspace_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graphs" ADD CONSTRAINT "eventsSpatial_decision_graphs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_decision_graphs" ADD CONSTRAINT "eventsSpatial_decision_graphs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_journeys" ADD CONSTRAINT "eventsSpatial_event_journeys_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_journeys" ADD CONSTRAINT "eventsSpatial_event_journeys_event_id_workspace_id_organis_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_journeys" ADD CONSTRAINT "eventsSpatial_event_journeys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_journeys" ADD CONSTRAINT "eventsSpatial_event_journeys_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_timeline_items" ADD CONSTRAINT "eventsSpatial_event_timeline_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_timeline_items" ADD CONSTRAINT "eventsSpatial_event_timeline_items_event_id_workspace_id_o_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_timeline_items" ADD CONSTRAINT "eventsSpatial_event_timeline_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_event_timeline_items" ADD CONSTRAINT "eventsSpatial_event_timeline_items_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_events" ADD CONSTRAINT "eventsSpatial_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_events" ADD CONSTRAINT "eventsSpatial_events_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_events" ADD CONSTRAINT "eventsSpatial_events_wedding_id_workspace_id_organisation__fkey" FOREIGN KEY ("wedding_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_weddings"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_events" ADD CONSTRAINT "eventsSpatial_events_venue_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_events" ADD CONSTRAINT "eventsSpatial_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_events" ADD CONSTRAINT "eventsSpatial_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_exhibition_layouts" ADD CONSTRAINT "eventsSpatial_exhibition_layouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_exhibition_layouts" ADD CONSTRAINT "eventsSpatial_exhibition_layouts_venue_id_workspace_id_org_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_exhibition_layouts" ADD CONSTRAINT "eventsSpatial_exhibition_layouts_spatial_project_id_worksp_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_exhibition_layouts" ADD CONSTRAINT "eventsSpatial_exhibition_layouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_exhibition_layouts" ADD CONSTRAINT "eventsSpatial_exhibition_layouts_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_film_twins" ADD CONSTRAINT "eventsSpatial_film_twins_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_film_twins" ADD CONSTRAINT "eventsSpatial_film_twins_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_film_twins" ADD CONSTRAINT "eventsSpatial_film_twins_spatial_project_id_workspace_id_o_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_film_twins" ADD CONSTRAINT "eventsSpatial_film_twins_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_film_twins" ADD CONSTRAINT "eventsSpatial_film_twins_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentation_slides" ADD CONSTRAINT "eventsSpatial_presentation_slides_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentation_slides" ADD CONSTRAINT "eventsSpatial_presentation_slides_presentation_id_workspac_fkey" FOREIGN KEY ("presentation_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_presentations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentation_slides" ADD CONSTRAINT "eventsSpatial_presentation_slides_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentation_slides" ADD CONSTRAINT "eventsSpatial_presentation_slides_workspace_id_organisatio_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentations" ADD CONSTRAINT "eventsSpatial_presentations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentations" ADD CONSTRAINT "eventsSpatial_presentations_event_id_workspace_id_organisa_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentations" ADD CONSTRAINT "eventsSpatial_presentations_spatial_project_id_workspace_i_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentations" ADD CONSTRAINT "eventsSpatial_presentations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_presentations" ADD CONSTRAINT "eventsSpatial_presentations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_run_of_show_items" ADD CONSTRAINT "eventsSpatial_run_of_show_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_run_of_show_items" ADD CONSTRAINT "eventsSpatial_run_of_show_items_event_id_workspace_id_orga_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_run_of_show_items" ADD CONSTRAINT "eventsSpatial_run_of_show_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_run_of_show_items" ADD CONSTRAINT "eventsSpatial_run_of_show_items_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_simulations" ADD CONSTRAINT "eventsSpatial_simulations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_simulations" ADD CONSTRAINT "eventsSpatial_simulations_spatial_project_id_workspace_id__fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_simulations" ADD CONSTRAINT "eventsSpatial_simulations_layout_id_workspace_id_organisat_fkey" FOREIGN KEY ("layout_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_layouts"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_simulations" ADD CONSTRAINT "eventsSpatial_simulations_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_simulations" ADD CONSTRAINT "eventsSpatial_simulations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_simulations" ADD CONSTRAINT "eventsSpatial_simulations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layers" ADD CONSTRAINT "eventsSpatial_spatial_layers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layers" ADD CONSTRAINT "eventsSpatial_spatial_layers_spatial_project_id_workspace__fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layers" ADD CONSTRAINT "eventsSpatial_spatial_layers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layers" ADD CONSTRAINT "eventsSpatial_spatial_layers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layouts" ADD CONSTRAINT "eventsSpatial_spatial_layouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layouts" ADD CONSTRAINT "eventsSpatial_spatial_layouts_spatial_project_id_workspace_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layouts" ADD CONSTRAINT "eventsSpatial_spatial_layouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_layouts" ADD CONSTRAINT "eventsSpatial_spatial_layouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_objects" ADD CONSTRAINT "eventsSpatial_spatial_objects_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_objects" ADD CONSTRAINT "eventsSpatial_spatial_objects_spatial_layer_id_workspace_i_fkey" FOREIGN KEY ("spatial_layer_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_layers"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_objects" ADD CONSTRAINT "eventsSpatial_spatial_objects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_objects" ADD CONSTRAINT "eventsSpatial_spatial_objects_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_operations" ADD CONSTRAINT "eventsSpatial_spatial_operations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_operations" ADD CONSTRAINT "eventsSpatial_spatial_operations_spatial_project_id_worksp_fkey" FOREIGN KEY ("spatial_project_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_spatial_projects"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_operations" ADD CONSTRAINT "eventsSpatial_spatial_operations_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_operations" ADD CONSTRAINT "eventsSpatial_spatial_operations_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_operations" ADD CONSTRAINT "eventsSpatial_spatial_operations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_projects" ADD CONSTRAINT "eventsSpatial_spatial_projects_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_projects" ADD CONSTRAINT "eventsSpatial_spatial_projects_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_projects" ADD CONSTRAINT "eventsSpatial_spatial_projects_event_id_workspace_id_organ_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_projects" ADD CONSTRAINT "eventsSpatial_spatial_projects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_spatial_projects" ADD CONSTRAINT "eventsSpatial_spatial_projects_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venue_bookings" ADD CONSTRAINT "eventsSpatial_venue_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venue_bookings" ADD CONSTRAINT "eventsSpatial_venue_bookings_venue_id_workspace_id_organis_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venue_bookings" ADD CONSTRAINT "eventsSpatial_venue_bookings_event_id_workspace_id_organis_fkey" FOREIGN KEY ("event_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_events"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venue_bookings" ADD CONSTRAINT "eventsSpatial_venue_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venue_bookings" ADD CONSTRAINT "eventsSpatial_venue_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venue_bookings" ADD CONSTRAINT "eventsSpatial_venue_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venues" ADD CONSTRAINT "eventsSpatial_venues_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venues" ADD CONSTRAINT "eventsSpatial_venues_location_id_workspace_id_organisation_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venues" ADD CONSTRAINT "eventsSpatial_venues_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_venues" ADD CONSTRAINT "eventsSpatial_venues_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_events" ADD CONSTRAINT "eventsSpatial_wedding_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_events" ADD CONSTRAINT "eventsSpatial_wedding_events_wedding_id_workspace_id_organ_fkey" FOREIGN KEY ("wedding_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_weddings"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_events" ADD CONSTRAINT "eventsSpatial_wedding_events_venue_id_workspace_id_organis_fkey" FOREIGN KEY ("venue_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_venues"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_events" ADD CONSTRAINT "eventsSpatial_wedding_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_events" ADD CONSTRAINT "eventsSpatial_wedding_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_journeys" ADD CONSTRAINT "eventsSpatial_wedding_journeys_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_journeys" ADD CONSTRAINT "eventsSpatial_wedding_journeys_wedding_id_workspace_id_org_fkey" FOREIGN KEY ("wedding_id", "workspace_id", "organisation_id") REFERENCES "eventsSpatial_weddings"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_journeys" ADD CONSTRAINT "eventsSpatial_wedding_journeys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_wedding_journeys" ADD CONSTRAINT "eventsSpatial_wedding_journeys_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_weddings" ADD CONSTRAINT "eventsSpatial_weddings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_weddings" ADD CONSTRAINT "eventsSpatial_weddings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_weddings" ADD CONSTRAINT "eventsSpatial_weddings_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_weddings" ADD CONSTRAINT "eventsSpatial_weddings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsSpatial_weddings" ADD CONSTRAINT "eventsSpatial_weddings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_comments" ADD CONSTRAINT "evidence_approval_comments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_comments" ADD CONSTRAINT "evidence_approval_comments_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_comments" ADD CONSTRAINT "evidence_approval_comments_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_comments" ADD CONSTRAINT "evidence_approval_comments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_comments" ADD CONSTRAINT "evidence_approval_comments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_decisions" ADD CONSTRAINT "evidence_approval_decisions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_decisions" ADD CONSTRAINT "evidence_approval_decisions_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_decisions" ADD CONSTRAINT "evidence_approval_decisions_approval_step_id_organisation__fkey" FOREIGN KEY ("approval_step_id", "organisation_id") REFERENCES "evidence_approval_steps"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_decisions" ADD CONSTRAINT "evidence_approval_decisions_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_decisions" ADD CONSTRAINT "evidence_approval_decisions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_decisions" ADD CONSTRAINT "evidence_approval_decisions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_steps" ADD CONSTRAINT "evidence_approval_steps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_steps" ADD CONSTRAINT "evidence_approval_steps_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_steps" ADD CONSTRAINT "evidence_approval_steps_approver_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_steps" ADD CONSTRAINT "evidence_approval_steps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approval_steps" ADD CONSTRAINT "evidence_approval_steps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approvals" ADD CONSTRAINT "evidence_approvals_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approvals" ADD CONSTRAINT "evidence_approvals_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_approvals" ADD CONSTRAINT "evidence_approvals_assigned_reviewer_user_id_fkey" FOREIGN KEY ("assigned_reviewer_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_audit_events" ADD CONSTRAINT "evidence_audit_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_audit_events" ADD CONSTRAINT "evidence_audit_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_audit_events" ADD CONSTRAINT "evidence_audit_events_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_before_after_proofs" ADD CONSTRAINT "evidence_before_after_proofs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_before_after_proofs" ADD CONSTRAINT "evidence_before_after_proofs_evidence_item_id_organisation_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_before_after_proofs" ADD CONSTRAINT "evidence_before_after_proofs_change_request_id_organisatio_fkey" FOREIGN KEY ("change_request_id", "organisation_id") REFERENCES "evidence_change_requests"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_before_after_proofs" ADD CONSTRAINT "evidence_before_after_proofs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_before_after_proofs" ADD CONSTRAINT "evidence_before_after_proofs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_chain_of_custody_events" ADD CONSTRAINT "evidence_chain_of_custody_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_chain_of_custody_events" ADD CONSTRAINT "evidence_chain_of_custody_events_evidence_item_id_organisa_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_chain_of_custody_events" ADD CONSTRAINT "evidence_chain_of_custody_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_chain_of_custody_events" ADD CONSTRAINT "evidence_chain_of_custody_events_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_chain_of_custody_events" ADD CONSTRAINT "evidence_chain_of_custody_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_change_requests" ADD CONSTRAINT "evidence_change_requests_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_change_requests" ADD CONSTRAINT "evidence_change_requests_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_change_requests" ADD CONSTRAINT "evidence_change_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_change_requests" ADD CONSTRAINT "evidence_change_requests_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_change_requests" ADD CONSTRAINT "evidence_change_requests_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_change_requests" ADD CONSTRAINT "evidence_change_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_links" ADD CONSTRAINT "evidence_document_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_links" ADD CONSTRAINT "evidence_document_links_document_id_organisation_id_fkey" FOREIGN KEY ("document_id", "organisation_id") REFERENCES "evidence_documents"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_links" ADD CONSTRAINT "evidence_document_links_linked_by_user_id_fkey" FOREIGN KEY ("linked_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_links" ADD CONSTRAINT "evidence_document_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_links" ADD CONSTRAINT "evidence_document_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_versions" ADD CONSTRAINT "evidence_document_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_versions" ADD CONSTRAINT "evidence_document_versions_document_id_organisation_id_fkey" FOREIGN KEY ("document_id", "organisation_id") REFERENCES "evidence_documents"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_versions" ADD CONSTRAINT "evidence_document_versions_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_versions" ADD CONSTRAINT "evidence_document_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_document_versions" ADD CONSTRAINT "evidence_document_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_documents" ADD CONSTRAINT "evidence_documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_documents" ADD CONSTRAINT "evidence_documents_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_documents" ADD CONSTRAINT "evidence_documents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_documents" ADD CONSTRAINT "evidence_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_gps" ADD CONSTRAINT "evidence_evidence_gps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_gps" ADD CONSTRAINT "evidence_evidence_gps_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_gps" ADD CONSTRAINT "evidence_evidence_gps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_gps" ADD CONSTRAINT "evidence_evidence_gps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_items" ADD CONSTRAINT "evidence_evidence_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_items" ADD CONSTRAINT "evidence_evidence_items_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_items" ADD CONSTRAINT "evidence_evidence_items_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_links" ADD CONSTRAINT "evidence_evidence_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_links" ADD CONSTRAINT "evidence_evidence_links_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_links" ADD CONSTRAINT "evidence_evidence_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_links" ADD CONSTRAINT "evidence_evidence_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_media" ADD CONSTRAINT "evidence_evidence_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_media" ADD CONSTRAINT "evidence_evidence_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_media" ADD CONSTRAINT "evidence_evidence_media_document_version_id_organisation_i_fkey" FOREIGN KEY ("document_version_id", "organisation_id") REFERENCES "evidence_document_versions"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_media" ADD CONSTRAINT "evidence_evidence_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_media" ADD CONSTRAINT "evidence_evidence_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_metadata" ADD CONSTRAINT "evidence_evidence_metadata_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_metadata" ADD CONSTRAINT "evidence_evidence_metadata_evidence_item_id_organisation_i_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_metadata" ADD CONSTRAINT "evidence_evidence_metadata_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_metadata" ADD CONSTRAINT "evidence_evidence_metadata_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timeline_events" ADD CONSTRAINT "evidence_evidence_timeline_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timeline_events" ADD CONSTRAINT "evidence_evidence_timeline_events_evidence_item_id_organis_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timeline_events" ADD CONSTRAINT "evidence_evidence_timeline_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timeline_events" ADD CONSTRAINT "evidence_evidence_timeline_events_workspace_id_organisatio_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timeline_events" ADD CONSTRAINT "evidence_evidence_timeline_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timestamps" ADD CONSTRAINT "evidence_evidence_timestamps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timestamps" ADD CONSTRAINT "evidence_evidence_timestamps_evidence_item_id_organisation_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timestamps" ADD CONSTRAINT "evidence_evidence_timestamps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_timestamps" ADD CONSTRAINT "evidence_evidence_timestamps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_verifications" ADD CONSTRAINT "evidence_evidence_verifications_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_verifications" ADD CONSTRAINT "evidence_evidence_verifications_evidence_item_id_organisat_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_verifications" ADD CONSTRAINT "evidence_evidence_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_verifications" ADD CONSTRAINT "evidence_evidence_verifications_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_evidence_verifications" ADD CONSTRAINT "evidence_evidence_verifications_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_legal_holds" ADD CONSTRAINT "evidence_legal_holds_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_legal_holds" ADD CONSTRAINT "evidence_legal_holds_document_id_organisation_id_fkey" FOREIGN KEY ("document_id", "organisation_id") REFERENCES "evidence_documents"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_legal_holds" ADD CONSTRAINT "evidence_legal_holds_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_legal_holds" ADD CONSTRAINT "evidence_legal_holds_authorised_by_user_id_fkey" FOREIGN KEY ("authorised_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_legal_holds" ADD CONSTRAINT "evidence_legal_holds_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_legal_holds" ADD CONSTRAINT "evidence_legal_holds_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risk_mitigations" ADD CONSTRAINT "evidence_risk_mitigations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risk_mitigations" ADD CONSTRAINT "evidence_risk_mitigations_risk_id_organisation_id_fkey" FOREIGN KEY ("risk_id", "organisation_id") REFERENCES "evidence_risks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risk_mitigations" ADD CONSTRAINT "evidence_risk_mitigations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risk_mitigations" ADD CONSTRAINT "evidence_risk_mitigations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risk_mitigations" ADD CONSTRAINT "evidence_risk_mitigations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risks" ADD CONSTRAINT "evidence_risks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risks" ADD CONSTRAINT "evidence_risks_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risks" ADD CONSTRAINT "evidence_risks_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risks" ADD CONSTRAINT "evidence_risks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_risks" ADD CONSTRAINT "evidence_risks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_trusted_timestamps" ADD CONSTRAINT "evidence_trusted_timestamps_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_trusted_timestamps" ADD CONSTRAINT "evidence_trusted_timestamps_evidence_item_id_organisation__fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_trusted_timestamps" ADD CONSTRAINT "evidence_trusted_timestamps_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidence_trusted_timestamps" ADD CONSTRAINT "evidence_trusted_timestamps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_categories" ADD CONSTRAINT "finance_budget_categories_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_categories" ADD CONSTRAINT "finance_budget_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_categories" ADD CONSTRAINT "finance_budget_categories_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_lines" ADD CONSTRAINT "finance_budget_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_lines" ADD CONSTRAINT "finance_budget_lines_budget_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("budget_id", "workspace_id", "organisation_id") REFERENCES "finance_budgets"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_lines" ADD CONSTRAINT "finance_budget_lines_category_id_workspace_id_organisation_fkey" FOREIGN KEY ("category_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_categories"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_lines" ADD CONSTRAINT "finance_budget_lines_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_lines" ADD CONSTRAINT "finance_budget_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budget_lines" ADD CONSTRAINT "finance_budget_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budgets" ADD CONSTRAINT "finance_budgets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budgets" ADD CONSTRAINT "finance_budgets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budgets" ADD CONSTRAINT "finance_budgets_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budgets" ADD CONSTRAINT "finance_budgets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_budgets" ADD CONSTRAINT "finance_budgets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cashflow_entries" ADD CONSTRAINT "finance_cashflow_entries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cashflow_entries" ADD CONSTRAINT "finance_cashflow_entries_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cashflow_entries" ADD CONSTRAINT "finance_cashflow_entries_payment_id_workspace_id_organisat_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cashflow_entries" ADD CONSTRAINT "finance_cashflow_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cashflow_entries" ADD CONSTRAINT "finance_cashflow_entries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_budget_line_id_workspace_id_organisati_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_purchase_order_id_workspace_id_organis_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_commitments" ADD CONSTRAINT "finance_commitments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheet_lines" ADD CONSTRAINT "finance_cost_sheet_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheet_lines" ADD CONSTRAINT "finance_cost_sheet_lines_cost_sheet_id_workspace_id_organi_fkey" FOREIGN KEY ("cost_sheet_id", "workspace_id", "organisation_id") REFERENCES "finance_cost_sheets"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheet_lines" ADD CONSTRAINT "finance_cost_sheet_lines_budget_line_id_workspace_id_organ_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheet_lines" ADD CONSTRAINT "finance_cost_sheet_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheet_lines" ADD CONSTRAINT "finance_cost_sheet_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheets" ADD CONSTRAINT "finance_cost_sheets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheets" ADD CONSTRAINT "finance_cost_sheets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheets" ADD CONSTRAINT "finance_cost_sheets_budget_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("budget_id", "workspace_id", "organisation_id") REFERENCES "finance_budgets"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheets" ADD CONSTRAINT "finance_cost_sheets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_cost_sheets" ADD CONSTRAINT "finance_cost_sheets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_currencies" ADD CONSTRAINT "finance_currencies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimate_lines" ADD CONSTRAINT "finance_estimate_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimate_lines" ADD CONSTRAINT "finance_estimate_lines_estimate_id_workspace_id_organisati_fkey" FOREIGN KEY ("estimate_id", "workspace_id", "organisation_id") REFERENCES "finance_estimates"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimate_lines" ADD CONSTRAINT "finance_estimate_lines_budget_line_id_workspace_id_organis_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimate_lines" ADD CONSTRAINT "finance_estimate_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimate_lines" ADD CONSTRAINT "finance_estimate_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimates" ADD CONSTRAINT "finance_estimates_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimates" ADD CONSTRAINT "finance_estimates_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimates" ADD CONSTRAINT "finance_estimates_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimates" ADD CONSTRAINT "finance_estimates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_estimates" ADD CONSTRAINT "finance_estimates_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_exchange_rates" ADD CONSTRAINT "finance_exchange_rates_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_exchange_rates" ADD CONSTRAINT "finance_exchange_rates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_approvals" ADD CONSTRAINT "finance_expense_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_approvals" ADD CONSTRAINT "finance_expense_approvals_expense_id_workspace_id_organisa_fkey" FOREIGN KEY ("expense_id", "workspace_id", "organisation_id") REFERENCES "finance_expenses"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_approvals" ADD CONSTRAINT "finance_expense_approvals_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_approvals" ADD CONSTRAINT "finance_expense_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_approvals" ADD CONSTRAINT "finance_expense_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_lines" ADD CONSTRAINT "finance_expense_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_lines" ADD CONSTRAINT "finance_expense_lines_expense_id_workspace_id_organisation_fkey" FOREIGN KEY ("expense_id", "workspace_id", "organisation_id") REFERENCES "finance_expenses"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_lines" ADD CONSTRAINT "finance_expense_lines_budget_line_id_workspace_id_organisa_fkey" FOREIGN KEY ("budget_line_id", "workspace_id", "organisation_id") REFERENCES "finance_budget_lines"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_lines" ADD CONSTRAINT "finance_expense_lines_tax_code_id_fkey" FOREIGN KEY ("tax_code_id") REFERENCES "finance_tax_codes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_lines" ADD CONSTRAINT "finance_expense_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expense_lines" ADD CONSTRAINT "finance_expense_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_approvals" ADD CONSTRAINT "finance_invoice_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_approvals" ADD CONSTRAINT "finance_invoice_approvals_invoice_id_workspace_id_organisa_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_approvals" ADD CONSTRAINT "finance_invoice_approvals_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_approvals" ADD CONSTRAINT "finance_invoice_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_approvals" ADD CONSTRAINT "finance_invoice_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_lines" ADD CONSTRAINT "finance_invoice_lines_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_lines" ADD CONSTRAINT "finance_invoice_lines_invoice_id_workspace_id_organisation_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_lines" ADD CONSTRAINT "finance_invoice_lines_purchase_order_item_id_workspace_id__fkey" FOREIGN KEY ("purchase_order_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_order_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_lines" ADD CONSTRAINT "finance_invoice_lines_tax_code_id_fkey" FOREIGN KEY ("tax_code_id") REFERENCES "finance_tax_codes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_lines" ADD CONSTRAINT "finance_invoice_lines_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_invoice_lines" ADD CONSTRAINT "finance_invoice_lines_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_allocations" ADD CONSTRAINT "finance_payment_allocations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_allocations" ADD CONSTRAINT "finance_payment_allocations_payment_id_workspace_id_organi_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_allocations" ADD CONSTRAINT "finance_payment_allocations_invoice_id_workspace_id_organi_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_allocations" ADD CONSTRAINT "finance_payment_allocations_expense_id_workspace_id_organi_fkey" FOREIGN KEY ("expense_id", "workspace_id", "organisation_id") REFERENCES "finance_expenses"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_allocations" ADD CONSTRAINT "finance_payment_allocations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_allocations" ADD CONSTRAINT "finance_payment_allocations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_verifications" ADD CONSTRAINT "finance_payment_verifications_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_verifications" ADD CONSTRAINT "finance_payment_verifications_payment_id_workspace_id_orga_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_verifications" ADD CONSTRAINT "finance_payment_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_verifications" ADD CONSTRAINT "finance_payment_verifications_evidence_item_id_organisatio_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_verifications" ADD CONSTRAINT "finance_payment_verifications_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payment_verifications" ADD CONSTRAINT "finance_payment_verifications_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payments" ADD CONSTRAINT "finance_payments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payments" ADD CONSTRAINT "finance_payments_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payments" ADD CONSTRAINT "finance_payments_invoice_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("invoice_id", "workspace_id", "organisation_id") REFERENCES "finance_vendor_invoices"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payments" ADD CONSTRAINT "finance_payments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payments" ADD CONSTRAINT "finance_payments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_profitability_snapshots" ADD CONSTRAINT "finance_profitability_snapshots_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_profitability_snapshots" ADD CONSTRAINT "finance_profitability_snapshots_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_profitability_snapshots" ADD CONSTRAINT "finance_profitability_snapshots_calculated_by_user_id_fkey" FOREIGN KEY ("calculated_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_profitability_snapshots" ADD CONSTRAINT "finance_profitability_snapshots_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_profitability_snapshots" ADD CONSTRAINT "finance_profitability_snapshots_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_tax_codes" ADD CONSTRAINT "finance_tax_codes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_vendor_invoices" ADD CONSTRAINT "finance_vendor_invoices_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_vendor_invoices" ADD CONSTRAINT "finance_vendor_invoices_vendor_id_workspace_id_organisatio_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_vendor_invoices" ADD CONSTRAINT "finance_vendor_invoices_purchase_order_id_workspace_id_org_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_vendor_invoices" ADD CONSTRAINT "finance_vendor_invoices_commitment_id_workspace_id_organis_fkey" FOREIGN KEY ("commitment_id", "workspace_id", "organisation_id") REFERENCES "finance_commitments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_vendor_invoices" ADD CONSTRAINT "finance_vendor_invoices_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_vendor_invoices" ADD CONSTRAINT "finance_vendor_invoices_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_access_reviews" ADD CONSTRAINT "identity_access_reviews_subject_user_id_fkey" FOREIGN KEY ("subject_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_access_reviews" ADD CONSTRAINT "identity_access_reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_auth_accounts" ADD CONSTRAINT "identity_auth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_auth_challenges" ADD CONSTRAINT "identity_auth_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_auth_credentials" ADD CONSTRAINT "identity_auth_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_delegations" ADD CONSTRAINT "identity_delegations_delegator_user_id_fkey" FOREIGN KEY ("delegator_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_delegations" ADD CONSTRAINT "identity_delegations_delegate_user_id_fkey" FOREIGN KEY ("delegate_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_delegations" ADD CONSTRAINT "identity_delegations_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_device_verifications" ADD CONSTRAINT "identity_device_verifications_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "identity_devices"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_device_verifications" ADD CONSTRAINT "identity_device_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_devices" ADD CONSTRAINT "identity_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_invitations" ADD CONSTRAINT "identity_invitations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_invitations" ADD CONSTRAINT "identity_invitations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_invitations" ADD CONSTRAINT "identity_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_invitations" ADD CONSTRAINT "identity_invitations_accepted_by_user_id_fkey" FOREIGN KEY ("accepted_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_invitations" ADD CONSTRAINT "identity_invitations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_location_verifications" ADD CONSTRAINT "identity_location_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_location_verifications" ADD CONSTRAINT "identity_location_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_nda_acceptances" ADD CONSTRAINT "identity_nda_acceptances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_nda_acceptances" ADD CONSTRAINT "identity_nda_acceptances_nda_version_id_fkey" FOREIGN KEY ("nda_version_id") REFERENCES "identity_nda_versions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_nda_acceptances" ADD CONSTRAINT "identity_nda_acceptances_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "identity_signatures"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_nda_versions" ADD CONSTRAINT "identity_nda_versions_nda_id_fkey" FOREIGN KEY ("nda_id") REFERENCES "identity_ndas"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_otp_challenges" ADD CONSTRAINT "identity_otp_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_password_reset_tokens" ADD CONSTRAINT "identity_password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_role_permissions" ADD CONSTRAINT "identity_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity_roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_role_permissions" ADD CONSTRAINT "identity_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "identity_permissions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_role_permissions" ADD CONSTRAINT "identity_role_permissions_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_signatures" ADD CONSTRAINT "identity_signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_emails" ADD CONSTRAINT "identity_user_emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_phones" ADD CONSTRAINT "identity_user_phones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_profiles" ADD CONSTRAINT "identity_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_roles" ADD CONSTRAINT "identity_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_roles" ADD CONSTRAINT "identity_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity_roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_roles" ADD CONSTRAINT "identity_user_roles_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_sessions" ADD CONSTRAINT "identity_user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_citations" ADD CONSTRAINT "intelligence_ai_citations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_citations" ADD CONSTRAINT "intelligence_ai_citations_message_id_workspace_id_organisa_fkey" FOREIGN KEY ("message_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_messages"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_citations" ADD CONSTRAINT "intelligence_ai_citations_source_id_workspace_id_organisat_fkey" FOREIGN KEY ("source_id", "workspace_id", "organisation_id") REFERENCES "intelligence_research_sources"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_citations" ADD CONSTRAINT "intelligence_ai_citations_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_citations" ADD CONSTRAINT "intelligence_ai_citations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_citations" ADD CONSTRAINT "intelligence_ai_citations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_conversation_id_workspace_id_orga_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_document_id_workspace_id_organisa_fkey" FOREIGN KEY ("document_id", "workspace_id", "organisation_id") REFERENCES "intelligence_knowledge_documents"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_attached_by_user_id_fkey" FOREIGN KEY ("attached_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_contexts" ADD CONSTRAINT "intelligence_ai_contexts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_conversations" ADD CONSTRAINT "intelligence_ai_conversations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_conversations" ADD CONSTRAINT "intelligence_ai_conversations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_conversations" ADD CONSTRAINT "intelligence_ai_conversations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_conversations" ADD CONSTRAINT "intelligence_ai_conversations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_messages" ADD CONSTRAINT "intelligence_ai_messages_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_messages" ADD CONSTRAINT "intelligence_ai_messages_conversation_id_workspace_id_orga_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_messages" ADD CONSTRAINT "intelligence_ai_messages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_messages" ADD CONSTRAINT "intelligence_ai_messages_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_suggestions" ADD CONSTRAINT "intelligence_ai_suggestions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_suggestions" ADD CONSTRAINT "intelligence_ai_suggestions_conversation_id_workspace_id_o_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_suggestions" ADD CONSTRAINT "intelligence_ai_suggestions_message_id_workspace_id_organi_fkey" FOREIGN KEY ("message_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_messages"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_suggestions" ADD CONSTRAINT "intelligence_ai_suggestions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_ai_suggestions" ADD CONSTRAINT "intelligence_ai_suggestions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_analytics_events" ADD CONSTRAINT "intelligence_analytics_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_analytics_events" ADD CONSTRAINT "intelligence_analytics_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_analytics_events" ADD CONSTRAINT "intelligence_analytics_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_analytics_events" ADD CONSTRAINT "intelligence_analytics_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_evidence_aware_answers" ADD CONSTRAINT "intelligence_evidence_aware_answers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_evidence_aware_answers" ADD CONSTRAINT "intelligence_evidence_aware_answers_research_session_id_wo_fkey" FOREIGN KEY ("research_session_id", "workspace_id", "organisation_id") REFERENCES "intelligence_research_sessions"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_evidence_aware_answers" ADD CONSTRAINT "intelligence_evidence_aware_answers_conversation_id_worksp_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_evidence_aware_answers" ADD CONSTRAINT "intelligence_evidence_aware_answers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_evidence_aware_answers" ADD CONSTRAINT "intelligence_evidence_aware_answers_workspace_id_organisat_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_runs" ADD CONSTRAINT "intelligence_forecast_runs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_runs" ADD CONSTRAINT "intelligence_forecast_runs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_runs" ADD CONSTRAINT "intelligence_forecast_runs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_runs" ADD CONSTRAINT "intelligence_forecast_runs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_runs" ADD CONSTRAINT "intelligence_forecast_runs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_scenarios" ADD CONSTRAINT "intelligence_forecast_scenarios_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_scenarios" ADD CONSTRAINT "intelligence_forecast_scenarios_forecast_run_id_workspace__fkey" FOREIGN KEY ("forecast_run_id", "workspace_id", "organisation_id") REFERENCES "intelligence_forecast_runs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_scenarios" ADD CONSTRAINT "intelligence_forecast_scenarios_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_forecast_scenarios" ADD CONSTRAINT "intelligence_forecast_scenarios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_generation_jobs" ADD CONSTRAINT "intelligence_generation_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_generation_jobs" ADD CONSTRAINT "intelligence_generation_jobs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_generation_jobs" ADD CONSTRAINT "intelligence_generation_jobs_conversation_id_workspace_id__fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_generation_jobs" ADD CONSTRAINT "intelligence_generation_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_generation_jobs" ADD CONSTRAINT "intelligence_generation_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_runs" ADD CONSTRAINT "intelligence_intelligence_runs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_runs" ADD CONSTRAINT "intelligence_intelligence_runs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_runs" ADD CONSTRAINT "intelligence_intelligence_runs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_runs" ADD CONSTRAINT "intelligence_intelligence_runs_conversation_id_workspace_i_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_runs" ADD CONSTRAINT "intelligence_intelligence_runs_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_runs" ADD CONSTRAINT "intelligence_intelligence_runs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_signals" ADD CONSTRAINT "intelligence_intelligence_signals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_signals" ADD CONSTRAINT "intelligence_intelligence_signals_project_id_organisation__fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_signals" ADD CONSTRAINT "intelligence_intelligence_signals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_intelligence_signals" ADD CONSTRAINT "intelligence_intelligence_signals_workspace_id_organisatio_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_chunks" ADD CONSTRAINT "intelligence_knowledge_chunks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_chunks" ADD CONSTRAINT "intelligence_knowledge_chunks_document_id_workspace_id_org_fkey" FOREIGN KEY ("document_id", "workspace_id", "organisation_id") REFERENCES "intelligence_knowledge_documents"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_chunks" ADD CONSTRAINT "intelligence_knowledge_chunks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_chunks" ADD CONSTRAINT "intelligence_knowledge_chunks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_documents" ADD CONSTRAINT "intelligence_knowledge_documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_documents" ADD CONSTRAINT "intelligence_knowledge_documents_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_documents" ADD CONSTRAINT "intelligence_knowledge_documents_evidence_item_id_organisa_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_documents" ADD CONSTRAINT "intelligence_knowledge_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_knowledge_documents" ADD CONSTRAINT "intelligence_knowledge_documents_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_kpi_definitions" ADD CONSTRAINT "intelligence_kpi_definitions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_kpi_measurements" ADD CONSTRAINT "intelligence_kpi_measurements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_kpi_measurements" ADD CONSTRAINT "intelligence_kpi_measurements_kpi_definition_id_fkey" FOREIGN KEY ("kpi_definition_id") REFERENCES "intelligence_kpi_definitions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_kpi_measurements" ADD CONSTRAINT "intelligence_kpi_measurements_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_kpi_measurements" ADD CONSTRAINT "intelligence_kpi_measurements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_kpi_measurements" ADD CONSTRAINT "intelligence_kpi_measurements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_registry" ADD CONSTRAINT "intelligence_model_registry_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_runs" ADD CONSTRAINT "intelligence_model_runs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_runs" ADD CONSTRAINT "intelligence_model_runs_generation_job_id_workspace_id_org_fkey" FOREIGN KEY ("generation_job_id", "workspace_id", "organisation_id") REFERENCES "intelligence_generation_jobs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_runs" ADD CONSTRAINT "intelligence_model_runs_conversation_id_workspace_id_organ_fkey" FOREIGN KEY ("conversation_id", "workspace_id", "organisation_id") REFERENCES "intelligence_ai_conversations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_runs" ADD CONSTRAINT "intelligence_model_runs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_runs" ADD CONSTRAINT "intelligence_model_runs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_model_runs" ADD CONSTRAINT "intelligence_model_runs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_prompt_templates" ADD CONSTRAINT "intelligence_prompt_templates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sessions" ADD CONSTRAINT "intelligence_research_sessions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sessions" ADD CONSTRAINT "intelligence_research_sessions_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sessions" ADD CONSTRAINT "intelligence_research_sessions_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sessions" ADD CONSTRAINT "intelligence_research_sessions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sessions" ADD CONSTRAINT "intelligence_research_sessions_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sources" ADD CONSTRAINT "intelligence_research_sources_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sources" ADD CONSTRAINT "intelligence_research_sources_research_session_id_workspac_fkey" FOREIGN KEY ("research_session_id", "workspace_id", "organisation_id") REFERENCES "intelligence_research_sessions"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sources" ADD CONSTRAINT "intelligence_research_sources_document_id_workspace_id_org_fkey" FOREIGN KEY ("document_id", "workspace_id", "organisation_id") REFERENCES "intelligence_knowledge_documents"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sources" ADD CONSTRAINT "intelligence_research_sources_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_research_sources" ADD CONSTRAINT "intelligence_research_sources_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_saved_insights" ADD CONSTRAINT "intelligence_saved_insights_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_saved_insights" ADD CONSTRAINT "intelligence_saved_insights_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_saved_insights" ADD CONSTRAINT "intelligence_saved_insights_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_saved_insights" ADD CONSTRAINT "intelligence_saved_insights_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intelligence_saved_insights" ADD CONSTRAINT "intelligence_saved_insights_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_room_members" ADD CONSTRAINT "investor_deal_room_members_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_room_members" ADD CONSTRAINT "investor_deal_room_members_deal_room_id_workspace_id_organ_fkey" FOREIGN KEY ("deal_room_id", "workspace_id", "organisation_id") REFERENCES "investor_deal_rooms"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_room_members" ADD CONSTRAINT "investor_deal_room_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_room_members" ADD CONSTRAINT "investor_deal_room_members_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_room_members" ADD CONSTRAINT "investor_deal_room_members_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_room_members" ADD CONSTRAINT "investor_deal_room_members_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_rooms" ADD CONSTRAINT "investor_deal_rooms_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_rooms" ADD CONSTRAINT "investor_deal_rooms_opportunity_id_workspace_id_organisati_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_rooms" ADD CONSTRAINT "investor_deal_rooms_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_deal_rooms" ADD CONSTRAINT "investor_deal_rooms_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_disclosures" ADD CONSTRAINT "investor_disclosures_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_disclosures" ADD CONSTRAINT "investor_disclosures_opportunity_id_workspace_id_organisat_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_disclosures" ADD CONSTRAINT "investor_disclosures_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_disclosures" ADD CONSTRAINT "investor_disclosures_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_disclosures" ADD CONSTRAINT "investor_disclosures_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_channels" ADD CONSTRAINT "investor_distribution_channels_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_channels" ADD CONSTRAINT "investor_distribution_channels_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_channels" ADD CONSTRAINT "investor_distribution_channels_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_deals" ADD CONSTRAINT "investor_distribution_deals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_deals" ADD CONSTRAINT "investor_distribution_deals_opportunity_id_workspace_id_or_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_deals" ADD CONSTRAINT "investor_distribution_deals_channel_id_workspace_id_organi_fkey" FOREIGN KEY ("channel_id", "workspace_id", "organisation_id") REFERENCES "investor_distribution_channels"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_deals" ADD CONSTRAINT "investor_distribution_deals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_distribution_deals" ADD CONSTRAINT "investor_distribution_deals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_due_diligence_items" ADD CONSTRAINT "investor_due_diligence_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_due_diligence_items" ADD CONSTRAINT "investor_due_diligence_items_opportunity_id_workspace_id_o_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_due_diligence_items" ADD CONSTRAINT "investor_due_diligence_items_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_due_diligence_items" ADD CONSTRAINT "investor_due_diligence_items_evidence_item_id_organisation_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_due_diligence_items" ADD CONSTRAINT "investor_due_diligence_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_due_diligence_items" ADD CONSTRAINT "investor_due_diligence_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_funding_requirements" ADD CONSTRAINT "investor_funding_requirements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_funding_requirements" ADD CONSTRAINT "investor_funding_requirements_opportunity_id_workspace_id__fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_funding_requirements" ADD CONSTRAINT "investor_funding_requirements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_funding_requirements" ADD CONSTRAINT "investor_funding_requirements_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_opportunities" ADD CONSTRAINT "investor_investment_opportunities_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_opportunities" ADD CONSTRAINT "investor_investment_opportunities_project_id_organisation__fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_opportunities" ADD CONSTRAINT "investor_investment_opportunities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_opportunities" ADD CONSTRAINT "investor_investment_opportunities_workspace_id_organisatio_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_profiles" ADD CONSTRAINT "investor_investment_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_profiles" ADD CONSTRAINT "investor_investment_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_profiles" ADD CONSTRAINT "investor_investment_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_profiles" ADD CONSTRAINT "investor_investment_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_tranches" ADD CONSTRAINT "investor_investment_tranches_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_tranches" ADD CONSTRAINT "investor_investment_tranches_opportunity_id_workspace_id_o_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_tranches" ADD CONSTRAINT "investor_investment_tranches_funding_requirement_id_worksp_fkey" FOREIGN KEY ("funding_requirement_id", "workspace_id", "organisation_id") REFERENCES "investor_funding_requirements"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_tranches" ADD CONSTRAINT "investor_investment_tranches_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investment_tranches" ADD CONSTRAINT "investor_investment_tranches_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_accounts" ADD CONSTRAINT "investor_investor_accounts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_accounts" ADD CONSTRAINT "investor_investor_accounts_investor_profile_id_workspace_i_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_accounts" ADD CONSTRAINT "investor_investor_accounts_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_accounts" ADD CONSTRAINT "investor_investor_accounts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_accounts" ADD CONSTRAINT "investor_investor_accounts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_commitments" ADD CONSTRAINT "investor_investor_commitments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_commitments" ADD CONSTRAINT "investor_investor_commitments_opportunity_id_workspace_id__fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_commitments" ADD CONSTRAINT "investor_investor_commitments_investor_profile_id_workspac_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_commitments" ADD CONSTRAINT "investor_investor_commitments_deal_room_id_workspace_id_or_fkey" FOREIGN KEY ("deal_room_id", "workspace_id", "organisation_id") REFERENCES "investor_deal_rooms"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_commitments" ADD CONSTRAINT "investor_investor_commitments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_commitments" ADD CONSTRAINT "investor_investor_commitments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_evidence_links" ADD CONSTRAINT "investor_investor_evidence_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_evidence_links" ADD CONSTRAINT "investor_investor_evidence_links_opportunity_id_workspace__fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_evidence_links" ADD CONSTRAINT "investor_investor_evidence_links_investor_profile_id_works_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_evidence_links" ADD CONSTRAINT "investor_investor_evidence_links_evidence_item_id_organisa_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_evidence_links" ADD CONSTRAINT "investor_investor_evidence_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_evidence_links" ADD CONSTRAINT "investor_investor_evidence_links_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_progress_reports" ADD CONSTRAINT "investor_investor_progress_reports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_progress_reports" ADD CONSTRAINT "investor_investor_progress_reports_opportunity_id_workspac_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_progress_reports" ADD CONSTRAINT "investor_investor_progress_reports_investor_profile_id_wor_fkey" FOREIGN KEY ("investor_profile_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_profiles"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_progress_reports" ADD CONSTRAINT "investor_investor_progress_reports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_progress_reports" ADD CONSTRAINT "investor_investor_progress_reports_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_returns" ADD CONSTRAINT "investor_investor_returns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_returns" ADD CONSTRAINT "investor_investor_returns_commitment_id_workspace_id_organ_fkey" FOREIGN KEY ("commitment_id", "workspace_id", "organisation_id") REFERENCES "investor_investor_commitments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_returns" ADD CONSTRAINT "investor_investor_returns_recoupment_model_id_workspace_id_fkey" FOREIGN KEY ("recoupment_model_id", "workspace_id", "organisation_id") REFERENCES "investor_recoupment_models"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_returns" ADD CONSTRAINT "investor_investor_returns_payment_id_workspace_id_organisa_fkey" FOREIGN KEY ("payment_id", "workspace_id", "organisation_id") REFERENCES "finance_payments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_returns" ADD CONSTRAINT "investor_investor_returns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_investor_returns" ADD CONSTRAINT "investor_investor_returns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_pitch_decks" ADD CONSTRAINT "investor_pitch_decks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_pitch_decks" ADD CONSTRAINT "investor_pitch_decks_opportunity_id_workspace_id_organisat_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_pitch_decks" ADD CONSTRAINT "investor_pitch_decks_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_pitch_decks" ADD CONSTRAINT "investor_pitch_decks_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_pitch_decks" ADD CONSTRAINT "investor_pitch_decks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_pitch_decks" ADD CONSTRAINT "investor_pitch_decks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_models" ADD CONSTRAINT "investor_recoupment_models_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_models" ADD CONSTRAINT "investor_recoupment_models_opportunity_id_workspace_id_org_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_models" ADD CONSTRAINT "investor_recoupment_models_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_models" ADD CONSTRAINT "investor_recoupment_models_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_tiers" ADD CONSTRAINT "investor_recoupment_tiers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_tiers" ADD CONSTRAINT "investor_recoupment_tiers_recoupment_model_id_workspace_id_fkey" FOREIGN KEY ("recoupment_model_id", "workspace_id", "organisation_id") REFERENCES "investor_recoupment_models"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_tiers" ADD CONSTRAINT "investor_recoupment_tiers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_recoupment_tiers" ADD CONSTRAINT "investor_recoupment_tiers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_revenue_entries" ADD CONSTRAINT "investor_revenue_entries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_revenue_entries" ADD CONSTRAINT "investor_revenue_entries_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_revenue_entries" ADD CONSTRAINT "investor_revenue_entries_distribution_deal_id_workspace_id_fkey" FOREIGN KEY ("distribution_deal_id", "workspace_id", "organisation_id") REFERENCES "investor_distribution_deals"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_revenue_entries" ADD CONSTRAINT "investor_revenue_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_revenue_entries" ADD CONSTRAINT "investor_revenue_entries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights" ADD CONSTRAINT "investor_rights_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights" ADD CONSTRAINT "investor_rights_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights" ADD CONSTRAINT "investor_rights_opportunity_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("opportunity_id", "workspace_id", "organisation_id") REFERENCES "investor_investment_opportunities"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights" ADD CONSTRAINT "investor_rights_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights" ADD CONSTRAINT "investor_rights_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights_windows" ADD CONSTRAINT "investor_rights_windows_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights_windows" ADD CONSTRAINT "investor_rights_windows_right_id_workspace_id_organisation_fkey" FOREIGN KEY ("right_id", "workspace_id", "organisation_id") REFERENCES "investor_rights"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights_windows" ADD CONSTRAINT "investor_rights_windows_distribution_deal_id_workspace_id__fkey" FOREIGN KEY ("distribution_deal_id", "workspace_id", "organisation_id") REFERENCES "investor_distribution_deals"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights_windows" ADD CONSTRAINT "investor_rights_windows_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_rights_windows" ADD CONSTRAINT "investor_rights_windows_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_accommodations" ADD CONSTRAINT "logistics_accommodations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_accommodations" ADD CONSTRAINT "logistics_accommodations_location_id_workspace_id_organisa_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_accommodations" ADD CONSTRAINT "logistics_accommodations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_accommodations" ADD CONSTRAINT "logistics_accommodations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_drivers" ADD CONSTRAINT "logistics_drivers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_drivers" ADD CONSTRAINT "logistics_drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_drivers" ADD CONSTRAINT "logistics_drivers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_drivers" ADD CONSTRAINT "logistics_drivers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_equipment_item_id_workspace_i_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_equipment_kit_id_workspace_id_fkey" FOREIGN KEY ("equipment_kit_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_kits"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_booked_by_user_id_fkey" FOREIGN KEY ("booked_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_bookings" ADD CONSTRAINT "logistics_equipment_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_categories" ADD CONSTRAINT "logistics_equipment_categories_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_categories" ADD CONSTRAINT "logistics_equipment_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_categories" ADD CONSTRAINT "logistics_equipment_categories_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_equipment_item_id_workspace__fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_equipment_booking_id_workspa_fkey" FOREIGN KEY ("equipment_booking_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_bookings"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_checked_out_to_user_id_fkey" FOREIGN KEY ("checked_out_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_issued_by_user_id_fkey" FOREIGN KEY ("issued_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_checkouts" ADD CONSTRAINT "logistics_equipment_checkouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_inventory_events" ADD CONSTRAINT "logistics_equipment_inventory_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_inventory_events" ADD CONSTRAINT "logistics_equipment_inventory_events_equipment_item_id_wor_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_inventory_events" ADD CONSTRAINT "logistics_equipment_inventory_events_equipment_kit_id_work_fkey" FOREIGN KEY ("equipment_kit_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_kits"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_inventory_events" ADD CONSTRAINT "logistics_equipment_inventory_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_inventory_events" ADD CONSTRAINT "logistics_equipment_inventory_events_workspace_id_organisa_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_inventory_events" ADD CONSTRAINT "logistics_equipment_inventory_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_items" ADD CONSTRAINT "logistics_equipment_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_items" ADD CONSTRAINT "logistics_equipment_items_category_id_workspace_id_organis_fkey" FOREIGN KEY ("category_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_categories"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_items" ADD CONSTRAINT "logistics_equipment_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_items" ADD CONSTRAINT "logistics_equipment_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_kits" ADD CONSTRAINT "logistics_equipment_kits_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_kits" ADD CONSTRAINT "logistics_equipment_kits_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_kits" ADD CONSTRAINT "logistics_equipment_kits_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_maintenance" ADD CONSTRAINT "logistics_equipment_maintenance_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_maintenance" ADD CONSTRAINT "logistics_equipment_maintenance_equipment_item_id_workspac_fkey" FOREIGN KEY ("equipment_item_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_maintenance" ADD CONSTRAINT "logistics_equipment_maintenance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_maintenance" ADD CONSTRAINT "logistics_equipment_maintenance_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_returns" ADD CONSTRAINT "logistics_equipment_returns_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_returns" ADD CONSTRAINT "logistics_equipment_returns_checkout_id_workspace_id_organ_fkey" FOREIGN KEY ("checkout_id", "workspace_id", "organisation_id") REFERENCES "logistics_equipment_checkouts"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_returns" ADD CONSTRAINT "logistics_equipment_returns_received_by_user_id_fkey" FOREIGN KEY ("received_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_returns" ADD CONSTRAINT "logistics_equipment_returns_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_equipment_returns" ADD CONSTRAINT "logistics_equipment_returns_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_location_id_workspace_id_organ_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_permit_id_workspace_id_organis_fkey" FOREIGN KEY ("permit_id", "workspace_id", "organisation_id") REFERENCES "logistics_permits"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_booked_by_user_id_fkey" FOREIGN KEY ("booked_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_bookings" ADD CONSTRAINT "logistics_location_bookings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_comparisons" ADD CONSTRAINT "logistics_location_comparisons_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_comparisons" ADD CONSTRAINT "logistics_location_comparisons_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_comparisons" ADD CONSTRAINT "logistics_location_comparisons_recce_id_workspace_id_organ_fkey" FOREIGN KEY ("recce_id", "workspace_id", "organisation_id") REFERENCES "logistics_recces"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_comparisons" ADD CONSTRAINT "logistics_location_comparisons_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_comparisons" ADD CONSTRAINT "logistics_location_comparisons_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_media" ADD CONSTRAINT "logistics_location_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_media" ADD CONSTRAINT "logistics_location_media_location_id_workspace_id_organisa_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_media" ADD CONSTRAINT "logistics_location_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_media" ADD CONSTRAINT "logistics_location_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_location_media" ADD CONSTRAINT "logistics_location_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_locations" ADD CONSTRAINT "logistics_locations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_locations" ADD CONSTRAINT "logistics_locations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_locations" ADD CONSTRAINT "logistics_locations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_logistics_tasks" ADD CONSTRAINT "logistics_logistics_tasks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_logistics_tasks" ADD CONSTRAINT "logistics_logistics_tasks_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_logistics_tasks" ADD CONSTRAINT "logistics_logistics_tasks_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_logistics_tasks" ADD CONSTRAINT "logistics_logistics_tasks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_logistics_tasks" ADD CONSTRAINT "logistics_logistics_tasks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permit_documents" ADD CONSTRAINT "logistics_permit_documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permit_documents" ADD CONSTRAINT "logistics_permit_documents_permit_id_workspace_id_organisa_fkey" FOREIGN KEY ("permit_id", "workspace_id", "organisation_id") REFERENCES "logistics_permits"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permit_documents" ADD CONSTRAINT "logistics_permit_documents_evidence_item_id_organisation_i_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permit_documents" ADD CONSTRAINT "logistics_permit_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permit_documents" ADD CONSTRAINT "logistics_permit_documents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permits" ADD CONSTRAINT "logistics_permits_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permits" ADD CONSTRAINT "logistics_permits_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permits" ADD CONSTRAINT "logistics_permits_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permits" ADD CONSTRAINT "logistics_permits_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_permits" ADD CONSTRAINT "logistics_permits_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recce_media" ADD CONSTRAINT "logistics_recce_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recce_media" ADD CONSTRAINT "logistics_recce_media_recce_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("recce_id", "workspace_id", "organisation_id") REFERENCES "logistics_recces"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recce_media" ADD CONSTRAINT "logistics_recce_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recce_media" ADD CONSTRAINT "logistics_recce_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recce_media" ADD CONSTRAINT "logistics_recce_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recces" ADD CONSTRAINT "logistics_recces_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recces" ADD CONSTRAINT "logistics_recces_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recces" ADD CONSTRAINT "logistics_recces_location_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recces" ADD CONSTRAINT "logistics_recces_lead_user_id_fkey" FOREIGN KEY ("lead_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recces" ADD CONSTRAINT "logistics_recces_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_recces" ADD CONSTRAINT "logistics_recces_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_room_allocations" ADD CONSTRAINT "logistics_room_allocations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_room_allocations" ADD CONSTRAINT "logistics_room_allocations_accommodation_id_workspace_id_o_fkey" FOREIGN KEY ("accommodation_id", "workspace_id", "organisation_id") REFERENCES "logistics_accommodations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_room_allocations" ADD CONSTRAINT "logistics_room_allocations_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_room_allocations" ADD CONSTRAINT "logistics_room_allocations_person_user_id_fkey" FOREIGN KEY ("person_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_room_allocations" ADD CONSTRAINT "logistics_room_allocations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_room_allocations" ADD CONSTRAINT "logistics_room_allocations_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_shipments" ADD CONSTRAINT "logistics_shipments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_shipments" ADD CONSTRAINT "logistics_shipments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_shipments" ADD CONSTRAINT "logistics_shipments_logistics_task_id_workspace_id_organis_fkey" FOREIGN KEY ("logistics_task_id", "workspace_id", "organisation_id") REFERENCES "logistics_logistics_tasks"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_shipments" ADD CONSTRAINT "logistics_shipments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_shipments" ADD CONSTRAINT "logistics_shipments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_transport_plans" ADD CONSTRAINT "logistics_transport_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_transport_plans" ADD CONSTRAINT "logistics_transport_plans_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_transport_plans" ADD CONSTRAINT "logistics_transport_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_transport_plans" ADD CONSTRAINT "logistics_transport_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_legs" ADD CONSTRAINT "logistics_travel_legs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_legs" ADD CONSTRAINT "logistics_travel_legs_travel_plan_id_workspace_id_organisa_fkey" FOREIGN KEY ("travel_plan_id", "workspace_id", "organisation_id") REFERENCES "logistics_travel_plans"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_legs" ADD CONSTRAINT "logistics_travel_legs_location_id_workspace_id_organisatio_fkey" FOREIGN KEY ("location_id", "workspace_id", "organisation_id") REFERENCES "logistics_locations"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_legs" ADD CONSTRAINT "logistics_travel_legs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_legs" ADD CONSTRAINT "logistics_travel_legs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_plans" ADD CONSTRAINT "logistics_travel_plans_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_plans" ADD CONSTRAINT "logistics_travel_plans_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_plans" ADD CONSTRAINT "logistics_travel_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_travel_plans" ADD CONSTRAINT "logistics_travel_plans_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_transport_plan_id_workspace__fkey" FOREIGN KEY ("transport_plan_id", "workspace_id", "organisation_id") REFERENCES "logistics_transport_plans"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_vehicle_id_workspace_id_orga_fkey" FOREIGN KEY ("vehicle_id", "workspace_id", "organisation_id") REFERENCES "logistics_vehicles"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_driver_id_workspace_id_organ_fkey" FOREIGN KEY ("driver_id", "workspace_id", "organisation_id") REFERENCES "logistics_drivers"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicle_assignments" ADD CONSTRAINT "logistics_vehicle_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicles" ADD CONSTRAINT "logistics_vehicles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicles" ADD CONSTRAINT "logistics_vehicles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistics_vehicles" ADD CONSTRAINT "logistics_vehicles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_capability_packs" ADD CONSTRAINT "marketplace_capability_packs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_capability_packs" ADD CONSTRAINT "marketplace_capability_packs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_capability_packs" ADD CONSTRAINT "marketplace_capability_packs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_deliveries" ADD CONSTRAINT "marketplace_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_deliveries" ADD CONSTRAINT "marketplace_deliveries_purchase_order_id_workspace_id_orga_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_deliveries" ADD CONSTRAINT "marketplace_deliveries_shipment_id_workspace_id_organisati_fkey" FOREIGN KEY ("shipment_id", "workspace_id", "organisation_id") REFERENCES "logistics_shipments"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_deliveries" ADD CONSTRAINT "marketplace_deliveries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_deliveries" ADD CONSTRAINT "marketplace_deliveries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_categories" ADD CONSTRAINT "marketplace_marketplace_categories_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_categories" ADD CONSTRAINT "marketplace_marketplace_categories_parent_category_id_work_fkey" FOREIGN KEY ("parent_category_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_categories"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_categories" ADD CONSTRAINT "marketplace_marketplace_categories_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_categories" ADD CONSTRAINT "marketplace_marketplace_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_services" ADD CONSTRAINT "marketplace_marketplace_services_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_services" ADD CONSTRAINT "marketplace_marketplace_services_category_id_workspace_id__fkey" FOREIGN KEY ("category_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_categories"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_services" ADD CONSTRAINT "marketplace_marketplace_services_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_marketplace_services" ADD CONSTRAINT "marketplace_marketplace_services_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_rfq_id_workspace_id_organis_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_quote_id_workspace_id_organ_fkey" FOREIGN KEY ("quote_id", "workspace_id", "organisation_id") REFERENCES "marketplace_quotes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_vendor_id_workspace_id_orga_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_procurement_awards" ADD CONSTRAINT "marketplace_procurement_awards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_order_items" ADD CONSTRAINT "marketplace_purchase_order_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_order_items" ADD CONSTRAINT "marketplace_purchase_order_items_purchase_order_id_workspa_fkey" FOREIGN KEY ("purchase_order_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_orders"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_order_items" ADD CONSTRAINT "marketplace_purchase_order_items_sku_id_workspace_id_organ_fkey" FOREIGN KEY ("sku_id", "workspace_id", "organisation_id") REFERENCES "marketplace_service_skus"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_order_items" ADD CONSTRAINT "marketplace_purchase_order_items_rfq_item_id_workspace_id__fkey" FOREIGN KEY ("rfq_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfq_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_order_items" ADD CONSTRAINT "marketplace_purchase_order_items_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_order_items" ADD CONSTRAINT "marketplace_purchase_order_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_vendor_id_workspace_id_organis_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_award_id_workspace_id_organisa_fkey" FOREIGN KEY ("award_id", "workspace_id", "organisation_id") REFERENCES "marketplace_procurement_awards"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_issued_by_user_id_fkey" FOREIGN KEY ("issued_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_purchase_orders" ADD CONSTRAINT "marketplace_purchase_orders_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_comparisons" ADD CONSTRAINT "marketplace_quote_comparisons_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_comparisons" ADD CONSTRAINT "marketplace_quote_comparisons_rfq_id_workspace_id_organisa_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_comparisons" ADD CONSTRAINT "marketplace_quote_comparisons_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_comparisons" ADD CONSTRAINT "marketplace_quote_comparisons_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_items" ADD CONSTRAINT "marketplace_quote_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_items" ADD CONSTRAINT "marketplace_quote_items_quote_id_workspace_id_organisation_fkey" FOREIGN KEY ("quote_id", "workspace_id", "organisation_id") REFERENCES "marketplace_quotes"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_items" ADD CONSTRAINT "marketplace_quote_items_rfq_item_id_workspace_id_organisat_fkey" FOREIGN KEY ("rfq_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfq_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_items" ADD CONSTRAINT "marketplace_quote_items_sku_id_workspace_id_organisation_i_fkey" FOREIGN KEY ("sku_id", "workspace_id", "organisation_id") REFERENCES "marketplace_service_skus"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_items" ADD CONSTRAINT "marketplace_quote_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quote_items" ADD CONSTRAINT "marketplace_quote_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quotes" ADD CONSTRAINT "marketplace_quotes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quotes" ADD CONSTRAINT "marketplace_quotes_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quotes" ADD CONSTRAINT "marketplace_quotes_vendor_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quotes" ADD CONSTRAINT "marketplace_quotes_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quotes" ADD CONSTRAINT "marketplace_quotes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_quotes" ADD CONSTRAINT "marketplace_quotes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_items" ADD CONSTRAINT "marketplace_rfq_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_items" ADD CONSTRAINT "marketplace_rfq_items_rfq_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_items" ADD CONSTRAINT "marketplace_rfq_items_service_id_workspace_id_organisation_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_items" ADD CONSTRAINT "marketplace_rfq_items_sku_id_workspace_id_organisation_id_fkey" FOREIGN KEY ("sku_id", "workspace_id", "organisation_id") REFERENCES "marketplace_service_skus"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_items" ADD CONSTRAINT "marketplace_rfq_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_items" ADD CONSTRAINT "marketplace_rfq_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_recipients" ADD CONSTRAINT "marketplace_rfq_recipients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_recipients" ADD CONSTRAINT "marketplace_rfq_recipients_rfq_id_workspace_id_organisatio_fkey" FOREIGN KEY ("rfq_id", "workspace_id", "organisation_id") REFERENCES "marketplace_rfqs"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_recipients" ADD CONSTRAINT "marketplace_rfq_recipients_vendor_id_workspace_id_organisa_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_recipients" ADD CONSTRAINT "marketplace_rfq_recipients_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_recipients" ADD CONSTRAINT "marketplace_rfq_recipients_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfq_recipients" ADD CONSTRAINT "marketplace_rfq_recipients_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfqs" ADD CONSTRAINT "marketplace_rfqs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfqs" ADD CONSTRAINT "marketplace_rfqs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfqs" ADD CONSTRAINT "marketplace_rfqs_requester_user_id_fkey" FOREIGN KEY ("requester_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfqs" ADD CONSTRAINT "marketplace_rfqs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_rfqs" ADD CONSTRAINT "marketplace_rfqs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_deliveries" ADD CONSTRAINT "marketplace_service_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_deliveries" ADD CONSTRAINT "marketplace_service_deliveries_purchase_order_item_id_work_fkey" FOREIGN KEY ("purchase_order_item_id", "workspace_id", "organisation_id") REFERENCES "marketplace_purchase_order_items"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_deliveries" ADD CONSTRAINT "marketplace_service_deliveries_service_id_workspace_id_org_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_deliveries" ADD CONSTRAINT "marketplace_service_deliveries_accepted_by_user_id_fkey" FOREIGN KEY ("accepted_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_deliveries" ADD CONSTRAINT "marketplace_service_deliveries_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_deliveries" ADD CONSTRAINT "marketplace_service_deliveries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_skus" ADD CONSTRAINT "marketplace_service_skus_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_skus" ADD CONSTRAINT "marketplace_service_skus_service_id_workspace_id_organisat_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_skus" ADD CONSTRAINT "marketplace_service_skus_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_service_skus" ADD CONSTRAINT "marketplace_service_skus_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_availability" ADD CONSTRAINT "marketplace_vendor_availability_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_availability" ADD CONSTRAINT "marketplace_vendor_availability_vendor_id_workspace_id_org_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_availability" ADD CONSTRAINT "marketplace_vendor_availability_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_availability" ADD CONSTRAINT "marketplace_vendor_availability_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_capabilities" ADD CONSTRAINT "marketplace_vendor_capabilities_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_capabilities" ADD CONSTRAINT "marketplace_vendor_capabilities_vendor_id_workspace_id_org_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_capabilities" ADD CONSTRAINT "marketplace_vendor_capabilities_service_id_workspace_id_or_fkey" FOREIGN KEY ("service_id", "workspace_id", "organisation_id") REFERENCES "marketplace_marketplace_services"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_capabilities" ADD CONSTRAINT "marketplace_vendor_capabilities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_capabilities" ADD CONSTRAINT "marketplace_vendor_capabilities_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_performance" ADD CONSTRAINT "marketplace_vendor_performance_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_performance" ADD CONSTRAINT "marketplace_vendor_performance_vendor_id_workspace_id_orga_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_performance" ADD CONSTRAINT "marketplace_vendor_performance_calculated_by_user_id_fkey" FOREIGN KEY ("calculated_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_performance" ADD CONSTRAINT "marketplace_vendor_performance_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_performance" ADD CONSTRAINT "marketplace_vendor_performance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_portfolios" ADD CONSTRAINT "marketplace_vendor_portfolios_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_portfolios" ADD CONSTRAINT "marketplace_vendor_portfolios_vendor_id_workspace_id_organ_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_portfolios" ADD CONSTRAINT "marketplace_vendor_portfolios_evidence_item_id_organisatio_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_portfolios" ADD CONSTRAINT "marketplace_vendor_portfolios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_portfolios" ADD CONSTRAINT "marketplace_vendor_portfolios_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_profiles" ADD CONSTRAINT "marketplace_vendor_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_profiles" ADD CONSTRAINT "marketplace_vendor_profiles_vendor_id_workspace_id_organis_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_profiles" ADD CONSTRAINT "marketplace_vendor_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_profiles" ADD CONSTRAINT "marketplace_vendor_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_ratings" ADD CONSTRAINT "marketplace_vendor_ratings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_ratings" ADD CONSTRAINT "marketplace_vendor_ratings_vendor_id_workspace_id_organisa_fkey" FOREIGN KEY ("vendor_id", "workspace_id", "organisation_id") REFERENCES "marketplace_vendors"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_ratings" ADD CONSTRAINT "marketplace_vendor_ratings_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_ratings" ADD CONSTRAINT "marketplace_vendor_ratings_rated_by_user_id_fkey" FOREIGN KEY ("rated_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_ratings" ADD CONSTRAINT "marketplace_vendor_ratings_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendor_ratings" ADD CONSTRAINT "marketplace_vendor_ratings_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendors" ADD CONSTRAINT "marketplace_vendors_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendors" ADD CONSTRAINT "marketplace_vendors_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendors" ADD CONSTRAINT "marketplace_vendors_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marketplace_vendors" ADD CONSTRAINT "marketplace_vendors_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_organisation_memberships" ADD CONSTRAINT "organisation_organisation_memberships_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_organisation_memberships" ADD CONSTRAINT "organisation_organisation_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_organisation_memberships" ADD CONSTRAINT "organisation_organisation_memberships_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_organisation_settings" ADD CONSTRAINT "organisation_organisation_settings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_organisations" ADD CONSTRAINT "organisation_organisations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_workspace_activity" ADD CONSTRAINT "organisation_workspace_activity_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_activity" ADD CONSTRAINT "organisation_workspace_activity_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_activity" ADD CONSTRAINT "organisation_workspace_activity_actor_membership_id_worksp_fkey" FOREIGN KEY ("actor_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_favourites" ADD CONSTRAINT "organisation_workspace_favourites_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_favourites" ADD CONSTRAINT "organisation_workspace_favourites_workspace_id_organisatio_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_favourites" ADD CONSTRAINT "organisation_workspace_favourites_membership_id_workspace__fkey" FOREIGN KEY ("membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships"("id", "workspace_id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_invites" ADD CONSTRAINT "organisation_workspace_invites_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_invites" ADD CONSTRAINT "organisation_workspace_invites_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_invites" ADD CONSTRAINT "organisation_workspace_invites_role_id_workspace_id_organi_fkey" FOREIGN KEY ("role_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_roles"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_invites" ADD CONSTRAINT "organisation_workspace_invites_invited_by_membership_id_wo_fkey" FOREIGN KEY ("invited_by_membership_id", "workspace_id", "organisation_id") REFERENCES "organisation_workspace_memberships"("id", "workspace_id", "organisation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_memberships" ADD CONSTRAINT "organisation_workspace_memberships_workspace_id_organisati_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_workspace_memberships" ADD CONSTRAINT "organisation_workspace_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_workspace_memberships" ADD CONSTRAINT "organisation_workspace_memberships_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_workspace_roles" ADD CONSTRAINT "organisation_workspace_roles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_roles" ADD CONSTRAINT "organisation_workspace_roles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_settings" ADD CONSTRAINT "organisation_workspace_settings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspace_settings" ADD CONSTRAINT "organisation_workspace_settings_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_workspaces" ADD CONSTRAINT "organisation_workspaces_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organisation_workspaces" ADD CONSTRAINT "organisation_workspaces_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_cast_assignment_id_organisation__fkey" FOREIGN KEY ("cast_assignment_id", "organisation_id") REFERENCES "people_cast_assignments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_crew_assignment_id_organisation__fkey" FOREIGN KEY ("crew_assignment_id", "organisation_id") REFERENCES "people_crew_assignments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_attendance_records" ADD CONSTRAINT "people_attendance_records_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_media" ADD CONSTRAINT "people_audition_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_media" ADD CONSTRAINT "people_audition_media_audition_submission_id_organisation__fkey" FOREIGN KEY ("audition_submission_id", "organisation_id") REFERENCES "people_audition_submissions"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_media" ADD CONSTRAINT "people_audition_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_media" ADD CONSTRAINT "people_audition_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_media" ADD CONSTRAINT "people_audition_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_casting_call_id_organisation_i_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_casting_call_role_id_organisat_fkey" FOREIGN KEY ("casting_call_role_id", "organisation_id") REFERENCES "people_casting_call_roles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_talent_profile_id_organisation_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_audition_submissions" ADD CONSTRAINT "people_audition_submissions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_assignments" ADD CONSTRAINT "people_cast_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_assignments" ADD CONSTRAINT "people_cast_assignments_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_assignments" ADD CONSTRAINT "people_cast_assignments_casting_call_role_id_organisation__fkey" FOREIGN KEY ("casting_call_role_id", "organisation_id") REFERENCES "people_casting_call_roles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_assignments" ADD CONSTRAINT "people_cast_assignments_talent_contract_id_organisation_id_fkey" FOREIGN KEY ("talent_contract_id", "organisation_id") REFERENCES "people_talent_contracts"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_assignments" ADD CONSTRAINT "people_cast_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_assignments" ADD CONSTRAINT "people_cast_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_messages" ADD CONSTRAINT "people_cast_messages_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_messages" ADD CONSTRAINT "people_cast_messages_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_messages" ADD CONSTRAINT "people_cast_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_messages" ADD CONSTRAINT "people_cast_messages_organisation_id_communication_thread__fkey" FOREIGN KEY ("organisation_id", "communication_thread_id") REFERENCES "communications_communication_threads"("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_messages" ADD CONSTRAINT "people_cast_messages_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_messages" ADD CONSTRAINT "people_cast_messages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_schedule_entries" ADD CONSTRAINT "people_cast_schedule_entries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_schedule_entries" ADD CONSTRAINT "people_cast_schedule_entries_cast_assignment_id_organisati_fkey" FOREIGN KEY ("cast_assignment_id", "organisation_id") REFERENCES "people_cast_assignments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_schedule_entries" ADD CONSTRAINT "people_cast_schedule_entries_schedule_item_id_organisation_fkey" FOREIGN KEY ("schedule_item_id", "organisation_id") REFERENCES "production_schedule_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_schedule_entries" ADD CONSTRAINT "people_cast_schedule_entries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_cast_schedule_entries" ADD CONSTRAINT "people_cast_schedule_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_audition_submission_id_organisati_fkey" FOREIGN KEY ("audition_submission_id", "organisation_id") REFERENCES "people_audition_submissions"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_approver_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "evidence_approvals"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_approvals" ADD CONSTRAINT "people_casting_approvals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_call_roles" ADD CONSTRAINT "people_casting_call_roles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_call_roles" ADD CONSTRAINT "people_casting_call_roles_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_call_roles" ADD CONSTRAINT "people_casting_call_roles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_call_roles" ADD CONSTRAINT "people_casting_call_roles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_calls" ADD CONSTRAINT "people_casting_calls_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_calls" ADD CONSTRAINT "people_casting_calls_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_calls" ADD CONSTRAINT "people_casting_calls_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_casting_calls" ADD CONSTRAINT "people_casting_calls_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_assignments" ADD CONSTRAINT "people_crew_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_assignments" ADD CONSTRAINT "people_crew_assignments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_assignments" ADD CONSTRAINT "people_crew_assignments_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_assignments" ADD CONSTRAINT "people_crew_assignments_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_assignments" ADD CONSTRAINT "people_crew_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_assignments" ADD CONSTRAINT "people_crew_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_availability" ADD CONSTRAINT "people_crew_availability_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_availability" ADD CONSTRAINT "people_crew_availability_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_availability" ADD CONSTRAINT "people_crew_availability_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_availability" ADD CONSTRAINT "people_crew_availability_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_contracts" ADD CONSTRAINT "people_crew_contracts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_contracts" ADD CONSTRAINT "people_crew_contracts_crew_assignment_id_organisation_id_fkey" FOREIGN KEY ("crew_assignment_id", "organisation_id") REFERENCES "people_crew_assignments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_contracts" ADD CONSTRAINT "people_crew_contracts_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_contracts" ADD CONSTRAINT "people_crew_contracts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_contracts" ADD CONSTRAINT "people_crew_contracts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_contracts" ADD CONSTRAINT "people_crew_contracts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_hiring_requests" ADD CONSTRAINT "people_crew_hiring_requests_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_hiring_requests" ADD CONSTRAINT "people_crew_hiring_requests_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_hiring_requests" ADD CONSTRAINT "people_crew_hiring_requests_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_hiring_requests" ADD CONSTRAINT "people_crew_hiring_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_hiring_requests" ADD CONSTRAINT "people_crew_hiring_requests_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_hiring_requests" ADD CONSTRAINT "people_crew_hiring_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_messages" ADD CONSTRAINT "people_crew_messages_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_messages" ADD CONSTRAINT "people_crew_messages_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_messages" ADD CONSTRAINT "people_crew_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_messages" ADD CONSTRAINT "people_crew_messages_organisation_id_communication_thread__fkey" FOREIGN KEY ("organisation_id", "communication_thread_id") REFERENCES "communications_communication_threads"("organisation_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_messages" ADD CONSTRAINT "people_crew_messages_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_messages" ADD CONSTRAINT "people_crew_messages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_profiles" ADD CONSTRAINT "people_crew_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_profiles" ADD CONSTRAINT "people_crew_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_profiles" ADD CONSTRAINT "people_crew_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_profiles" ADD CONSTRAINT "people_crew_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlist_items" ADD CONSTRAINT "people_crew_shortlist_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlist_items" ADD CONSTRAINT "people_crew_shortlist_items_shortlist_id_organisation_id_fkey" FOREIGN KEY ("shortlist_id", "organisation_id") REFERENCES "people_crew_shortlists"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlist_items" ADD CONSTRAINT "people_crew_shortlist_items_crew_profile_id_organisation_i_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlist_items" ADD CONSTRAINT "people_crew_shortlist_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlist_items" ADD CONSTRAINT "people_crew_shortlist_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlists" ADD CONSTRAINT "people_crew_shortlists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlists" ADD CONSTRAINT "people_crew_shortlists_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlists" ADD CONSTRAINT "people_crew_shortlists_crew_hiring_request_id_organisation_fkey" FOREIGN KEY ("crew_hiring_request_id", "organisation_id") REFERENCES "people_crew_hiring_requests"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlists" ADD CONSTRAINT "people_crew_shortlists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_shortlists" ADD CONSTRAINT "people_crew_shortlists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_skills" ADD CONSTRAINT "people_crew_skills_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_skills" ADD CONSTRAINT "people_crew_skills_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_skills" ADD CONSTRAINT "people_crew_skills_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_crew_skills" ADD CONSTRAINT "people_crew_skills_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_department_members" ADD CONSTRAINT "people_department_members_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_department_members" ADD CONSTRAINT "people_department_members_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_department_members" ADD CONSTRAINT "people_department_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_department_members" ADD CONSTRAINT "people_department_members_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_department_members" ADD CONSTRAINT "people_department_members_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_departments" ADD CONSTRAINT "people_departments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_departments" ADD CONSTRAINT "people_departments_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_departments" ADD CONSTRAINT "people_departments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_departments" ADD CONSTRAINT "people_departments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_hod_assignments" ADD CONSTRAINT "people_hod_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_hod_assignments" ADD CONSTRAINT "people_hod_assignments_department_id_organisation_id_fkey" FOREIGN KEY ("department_id", "organisation_id") REFERENCES "people_departments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_hod_assignments" ADD CONSTRAINT "people_hod_assignments_crew_profile_id_organisation_id_fkey" FOREIGN KEY ("crew_profile_id", "organisation_id") REFERENCES "people_crew_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_hod_assignments" ADD CONSTRAINT "people_hod_assignments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_hod_assignments" ADD CONSTRAINT "people_hod_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_performance_reviews" ADD CONSTRAINT "people_performance_reviews_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_performance_reviews" ADD CONSTRAINT "people_performance_reviews_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_performance_reviews" ADD CONSTRAINT "people_performance_reviews_reviewee_user_id_fkey" FOREIGN KEY ("reviewee_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_performance_reviews" ADD CONSTRAINT "people_performance_reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_performance_reviews" ADD CONSTRAINT "people_performance_reviews_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_performance_reviews" ADD CONSTRAINT "people_performance_reviews_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_availability" ADD CONSTRAINT "people_talent_availability_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_availability" ADD CONSTRAINT "people_talent_availability_talent_profile_id_organisation__fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_availability" ADD CONSTRAINT "people_talent_availability_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_availability" ADD CONSTRAINT "people_talent_availability_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_comparisons" ADD CONSTRAINT "people_talent_comparisons_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_comparisons" ADD CONSTRAINT "people_talent_comparisons_left_talent_profile_id_organisat_fkey" FOREIGN KEY ("left_talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_comparisons" ADD CONSTRAINT "people_talent_comparisons_right_talent_profile_id_organisa_fkey" FOREIGN KEY ("right_talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_comparisons" ADD CONSTRAINT "people_talent_comparisons_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_comparisons" ADD CONSTRAINT "people_talent_comparisons_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_contracts" ADD CONSTRAINT "people_talent_contracts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_contracts" ADD CONSTRAINT "people_talent_contracts_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_contracts" ADD CONSTRAINT "people_talent_contracts_offer_id_organisation_id_fkey" FOREIGN KEY ("offer_id", "organisation_id") REFERENCES "people_talent_offers"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_contracts" ADD CONSTRAINT "people_talent_contracts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_contracts" ADD CONSTRAINT "people_talent_contracts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_contracts" ADD CONSTRAINT "people_talent_contracts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_media" ADD CONSTRAINT "people_talent_media_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_media" ADD CONSTRAINT "people_talent_media_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_media" ADD CONSTRAINT "people_talent_media_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_media" ADD CONSTRAINT "people_talent_media_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_media" ADD CONSTRAINT "people_talent_media_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_offers" ADD CONSTRAINT "people_talent_offers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_offers" ADD CONSTRAINT "people_talent_offers_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_offers" ADD CONSTRAINT "people_talent_offers_casting_call_role_id_organisation_id_fkey" FOREIGN KEY ("casting_call_role_id", "organisation_id") REFERENCES "people_casting_call_roles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_offers" ADD CONSTRAINT "people_talent_offers_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_offers" ADD CONSTRAINT "people_talent_offers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_offers" ADD CONSTRAINT "people_talent_offers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_portfolios" ADD CONSTRAINT "people_talent_portfolios_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_portfolios" ADD CONSTRAINT "people_talent_portfolios_talent_profile_id_organisation_id_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_portfolios" ADD CONSTRAINT "people_talent_portfolios_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_portfolios" ADD CONSTRAINT "people_talent_portfolios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_profiles" ADD CONSTRAINT "people_talent_profiles_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_profiles" ADD CONSTRAINT "people_talent_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_profiles" ADD CONSTRAINT "people_talent_profiles_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_profiles" ADD CONSTRAINT "people_talent_profiles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlist_items" ADD CONSTRAINT "people_talent_shortlist_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlist_items" ADD CONSTRAINT "people_talent_shortlist_items_shortlist_id_organisation_id_fkey" FOREIGN KEY ("shortlist_id", "organisation_id") REFERENCES "people_talent_shortlists"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlist_items" ADD CONSTRAINT "people_talent_shortlist_items_talent_profile_id_organisati_fkey" FOREIGN KEY ("talent_profile_id", "organisation_id") REFERENCES "people_talent_profiles"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlist_items" ADD CONSTRAINT "people_talent_shortlist_items_audition_submission_id_organ_fkey" FOREIGN KEY ("audition_submission_id", "organisation_id") REFERENCES "people_audition_submissions"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlist_items" ADD CONSTRAINT "people_talent_shortlist_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlist_items" ADD CONSTRAINT "people_talent_shortlist_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlists" ADD CONSTRAINT "people_talent_shortlists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlists" ADD CONSTRAINT "people_talent_shortlists_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlists" ADD CONSTRAINT "people_talent_shortlists_casting_call_id_organisation_id_fkey" FOREIGN KEY ("casting_call_id", "organisation_id") REFERENCES "people_casting_calls"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlists" ADD CONSTRAINT "people_talent_shortlists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_talent_shortlists" ADD CONSTRAINT "people_talent_shortlists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_crew_assignment_id_organisation_id_fkey" FOREIGN KEY ("crew_assignment_id", "organisation_id") REFERENCES "people_crew_assignments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_cast_assignment_id_organisation_id_fkey" FOREIGN KEY ("cast_assignment_id", "organisation_id") REFERENCES "people_cast_assignments"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_timesheets" ADD CONSTRAINT "people_timesheets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_api_keys" ADD CONSTRAINT "platform_api_keys_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_api_keys" ADD CONSTRAINT "platform_api_keys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_api_keys" ADD CONSTRAINT "platform_api_keys_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_data_retention_policies" ADD CONSTRAINT "platform_data_retention_policies_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_data_retention_policies" ADD CONSTRAINT "platform_data_retention_policies_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_data_retention_policies" ADD CONSTRAINT "platform_data_retention_policies_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_data_retention_policies" ADD CONSTRAINT "platform_data_retention_policies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_export_jobs" ADD CONSTRAINT "platform_export_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_export_jobs" ADD CONSTRAINT "platform_export_jobs_export_id_organisation_id_fkey" FOREIGN KEY ("export_id", "organisation_id") REFERENCES "platform_exports"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_export_jobs" ADD CONSTRAINT "platform_export_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_export_jobs" ADD CONSTRAINT "platform_export_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_exports" ADD CONSTRAINT "platform_exports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_exports" ADD CONSTRAINT "platform_exports_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_exports" ADD CONSTRAINT "platform_exports_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_exports" ADD CONSTRAINT "platform_exports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_feature_flag_assignments" ADD CONSTRAINT "platform_feature_flag_assignments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_feature_flag_assignments" ADD CONSTRAINT "platform_feature_flag_assignments_feature_flag_id_fkey" FOREIGN KEY ("feature_flag_id") REFERENCES "platform_feature_flags"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_feature_flag_assignments" ADD CONSTRAINT "platform_feature_flag_assignments_workspace_id_organisatio_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_feature_flag_assignments" ADD CONSTRAINT "platform_feature_flag_assignments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_connections" ADD CONSTRAINT "platform_integration_connections_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_connections" ADD CONSTRAINT "platform_integration_connections_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "platform_integrations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_connections" ADD CONSTRAINT "platform_integration_connections_connected_by_user_id_fkey" FOREIGN KEY ("connected_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_connections" ADD CONSTRAINT "platform_integration_connections_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_connections" ADD CONSTRAINT "platform_integration_connections_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_events" ADD CONSTRAINT "platform_integration_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_events" ADD CONSTRAINT "platform_integration_events_integration_connection_id_orga_fkey" FOREIGN KEY ("integration_connection_id", "organisation_id") REFERENCES "platform_integration_connections"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_events" ADD CONSTRAINT "platform_integration_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_integration_events" ADD CONSTRAINT "platform_integration_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_restore_jobs" ADD CONSTRAINT "platform_restore_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_restore_jobs" ADD CONSTRAINT "platform_restore_jobs_backup_job_id_fkey" FOREIGN KEY ("backup_job_id") REFERENCES "platform_backup_jobs"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_restore_jobs" ADD CONSTRAINT "platform_restore_jobs_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_restore_jobs" ADD CONSTRAINT "platform_restore_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_restore_jobs" ADD CONSTRAINT "platform_restore_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_share_links" ADD CONSTRAINT "platform_share_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_share_links" ADD CONSTRAINT "platform_share_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_share_links" ADD CONSTRAINT "platform_share_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_status_events" ADD CONSTRAINT "platform_status_events_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_status_events" ADD CONSTRAINT "platform_status_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_status_events" ADD CONSTRAINT "platform_status_events_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_status_events" ADD CONSTRAINT "platform_status_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_comments" ADD CONSTRAINT "platform_support_comments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_comments" ADD CONSTRAINT "platform_support_comments_support_ticket_id_organisation_i_fkey" FOREIGN KEY ("support_ticket_id", "organisation_id") REFERENCES "platform_support_tickets"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_comments" ADD CONSTRAINT "platform_support_comments_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_comments" ADD CONSTRAINT "platform_support_comments_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_comments" ADD CONSTRAINT "platform_support_comments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_tickets" ADD CONSTRAINT "platform_support_tickets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_tickets" ADD CONSTRAINT "platform_support_tickets_opened_by_user_id_fkey" FOREIGN KEY ("opened_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_tickets" ADD CONSTRAINT "platform_support_tickets_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_tickets" ADD CONSTRAINT "platform_support_tickets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_support_tickets" ADD CONSTRAINT "platform_support_tickets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_conflicts" ADD CONSTRAINT "platform_sync_conflicts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_conflicts" ADD CONSTRAINT "platform_sync_conflicts_sync_job_id_organisation_id_fkey" FOREIGN KEY ("sync_job_id", "organisation_id") REFERENCES "platform_sync_jobs"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_conflicts" ADD CONSTRAINT "platform_sync_conflicts_resolved_by_user_id_fkey" FOREIGN KEY ("resolved_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_conflicts" ADD CONSTRAINT "platform_sync_conflicts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_conflicts" ADD CONSTRAINT "platform_sync_conflicts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_jobs" ADD CONSTRAINT "platform_sync_jobs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_jobs" ADD CONSTRAINT "platform_sync_jobs_integration_connection_id_organisation__fkey" FOREIGN KEY ("integration_connection_id", "organisation_id") REFERENCES "platform_integration_connections"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_jobs" ADD CONSTRAINT "platform_sync_jobs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_jobs" ADD CONSTRAINT "platform_sync_jobs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_queue_items" ADD CONSTRAINT "platform_sync_queue_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_queue_items" ADD CONSTRAINT "platform_sync_queue_items_sync_job_id_organisation_id_fkey" FOREIGN KEY ("sync_job_id", "organisation_id") REFERENCES "platform_sync_jobs"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_queue_items" ADD CONSTRAINT "platform_sync_queue_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_sync_queue_items" ADD CONSTRAINT "platform_sync_queue_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_system_incidents" ADD CONSTRAINT "platform_system_incidents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_system_incidents" ADD CONSTRAINT "platform_system_incidents_detected_by_user_id_fkey" FOREIGN KEY ("detected_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_system_incidents" ADD CONSTRAINT "platform_system_incidents_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_system_incidents" ADD CONSTRAINT "platform_system_incidents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_system_incidents" ADD CONSTRAINT "platform_system_incidents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_user_preferences" ADD CONSTRAINT "platform_user_preferences_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_user_preferences" ADD CONSTRAINT "platform_user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_user_preferences" ADD CONSTRAINT "platform_user_preferences_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_user_preferences" ADD CONSTRAINT "platform_user_preferences_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_deliveries" ADD CONSTRAINT "platform_webhook_deliveries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_deliveries" ADD CONSTRAINT "platform_webhook_deliveries_webhook_id_organisation_id_fkey" FOREIGN KEY ("webhook_id", "organisation_id") REFERENCES "platform_webhooks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_deliveries" ADD CONSTRAINT "platform_webhook_deliveries_subscription_id_organisation_i_fkey" FOREIGN KEY ("subscription_id", "organisation_id") REFERENCES "platform_webhook_subscriptions"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_deliveries" ADD CONSTRAINT "platform_webhook_deliveries_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_deliveries" ADD CONSTRAINT "platform_webhook_deliveries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_subscriptions" ADD CONSTRAINT "platform_webhook_subscriptions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_subscriptions" ADD CONSTRAINT "platform_webhook_subscriptions_webhook_id_organisation_id_fkey" FOREIGN KEY ("webhook_id", "organisation_id") REFERENCES "platform_webhooks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_subscriptions" ADD CONSTRAINT "platform_webhook_subscriptions_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhook_subscriptions" ADD CONSTRAINT "platform_webhook_subscriptions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhooks" ADD CONSTRAINT "platform_webhooks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhooks" ADD CONSTRAINT "platform_webhooks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_webhooks" ADD CONSTRAINT "platform_webhooks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_workspace_preferences" ADD CONSTRAINT "platform_workspace_preferences_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_workspace_preferences" ADD CONSTRAINT "platform_workspace_preferences_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_workspace_preferences" ADD CONSTRAINT "platform_workspace_preferences_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_acknowledgements" ADD CONSTRAINT "production_call_sheet_acknowledgements_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_acknowledgements" ADD CONSTRAINT "production_call_sheet_acknowledgements_call_sheet_id_organ_fkey" FOREIGN KEY ("call_sheet_id", "organisation_id") REFERENCES "production_call_sheets"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_acknowledgements" ADD CONSTRAINT "production_call_sheet_acknowledgements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_acknowledgements" ADD CONSTRAINT "production_call_sheet_acknowledgements_workspace_id_organi_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_acknowledgements" ADD CONSTRAINT "production_call_sheet_acknowledgements_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_recipients" ADD CONSTRAINT "production_call_sheet_recipients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_recipients" ADD CONSTRAINT "production_call_sheet_recipients_call_sheet_id_organisatio_fkey" FOREIGN KEY ("call_sheet_id", "organisation_id") REFERENCES "production_call_sheets"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_recipients" ADD CONSTRAINT "production_call_sheet_recipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_recipients" ADD CONSTRAINT "production_call_sheet_recipients_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_recipients" ADD CONSTRAINT "production_call_sheet_recipients_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_versions" ADD CONSTRAINT "production_call_sheet_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_versions" ADD CONSTRAINT "production_call_sheet_versions_call_sheet_id_organisation__fkey" FOREIGN KEY ("call_sheet_id", "organisation_id") REFERENCES "production_call_sheets"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_versions" ADD CONSTRAINT "production_call_sheet_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheet_versions" ADD CONSTRAINT "production_call_sheet_versions_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheets" ADD CONSTRAINT "production_call_sheets_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheets" ADD CONSTRAINT "production_call_sheets_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheets" ADD CONSTRAINT "production_call_sheets_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheets" ADD CONSTRAINT "production_call_sheets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_call_sheets" ADD CONSTRAINT "production_call_sheets_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_project_id_organisatio_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_production_day_id_orga_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_evidence_item_id_organ_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_workspace_id_organisat_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_daily_production_reports" ADD CONSTRAINT "production_daily_production_reports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_delays" ADD CONSTRAINT "production_delays_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_delays" ADD CONSTRAINT "production_delays_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_delays" ADD CONSTRAINT "production_delays_reported_by_user_id_fkey" FOREIGN KEY ("reported_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_delays" ADD CONSTRAINT "production_delays_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_delays" ADD CONSTRAINT "production_delays_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_incidents" ADD CONSTRAINT "production_incidents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_incidents" ADD CONSTRAINT "production_incidents_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_incidents" ADD CONSTRAINT "production_incidents_reported_by_user_id_fkey" FOREIGN KEY ("reported_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_incidents" ADD CONSTRAINT "production_incidents_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_incidents" ADD CONSTRAINT "production_incidents_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_incidents" ADD CONSTRAINT "production_incidents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_live_attendance" ADD CONSTRAINT "production_live_attendance_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_live_attendance" ADD CONSTRAINT "production_live_attendance_production_day_id_organisation__fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_live_attendance" ADD CONSTRAINT "production_live_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_live_attendance" ADD CONSTRAINT "production_live_attendance_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_live_attendance" ADD CONSTRAINT "production_live_attendance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_calendars" ADD CONSTRAINT "production_production_calendars_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_calendars" ADD CONSTRAINT "production_production_calendars_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_calendars" ADD CONSTRAINT "production_production_calendars_workspace_id_organisation__fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_calendars" ADD CONSTRAINT "production_production_calendars_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_days" ADD CONSTRAINT "production_production_days_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_days" ADD CONSTRAINT "production_production_days_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_days" ADD CONSTRAINT "production_production_days_calendar_id_organisation_id_fkey" FOREIGN KEY ("calendar_id", "organisation_id") REFERENCES "production_production_calendars"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_days" ADD CONSTRAINT "production_production_days_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_production_days" ADD CONSTRAINT "production_production_days_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_scene_progress" ADD CONSTRAINT "production_scene_progress_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_scene_progress" ADD CONSTRAINT "production_scene_progress_production_day_id_organisation_i_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_scene_progress" ADD CONSTRAINT "production_scene_progress_strip_id_organisation_id_fkey" FOREIGN KEY ("strip_id", "organisation_id") REFERENCES "production_strips"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_scene_progress" ADD CONSTRAINT "production_scene_progress_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_scene_progress" ADD CONSTRAINT "production_scene_progress_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_items" ADD CONSTRAINT "production_schedule_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_items" ADD CONSTRAINT "production_schedule_items_schedule_id_organisation_id_fkey" FOREIGN KEY ("schedule_id", "organisation_id") REFERENCES "production_schedules"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_items" ADD CONSTRAINT "production_schedule_items_schedule_version_id_organisation_fkey" FOREIGN KEY ("schedule_version_id", "organisation_id") REFERENCES "production_schedule_versions"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_items" ADD CONSTRAINT "production_schedule_items_project_milestone_id_organisatio_fkey" FOREIGN KEY ("project_milestone_id", "organisation_id") REFERENCES "project_project_milestones"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_items" ADD CONSTRAINT "production_schedule_items_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_items" ADD CONSTRAINT "production_schedule_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_versions" ADD CONSTRAINT "production_schedule_versions_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_versions" ADD CONSTRAINT "production_schedule_versions_schedule_id_organisation_id_fkey" FOREIGN KEY ("schedule_id", "organisation_id") REFERENCES "production_schedules"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_versions" ADD CONSTRAINT "production_schedule_versions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedule_versions" ADD CONSTRAINT "production_schedule_versions_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedules" ADD CONSTRAINT "production_schedules_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedules" ADD CONSTRAINT "production_schedules_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedules" ADD CONSTRAINT "production_schedules_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_schedules" ADD CONSTRAINT "production_schedules_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shoot_days" ADD CONSTRAINT "production_shoot_days_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shoot_days" ADD CONSTRAINT "production_shoot_days_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shoot_days" ADD CONSTRAINT "production_shoot_days_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shoot_days" ADD CONSTRAINT "production_shoot_days_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shot_progress" ADD CONSTRAINT "production_shot_progress_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shot_progress" ADD CONSTRAINT "production_shot_progress_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shot_progress" ADD CONSTRAINT "production_shot_progress_scene_progress_id_organisation_id_fkey" FOREIGN KEY ("scene_progress_id", "organisation_id") REFERENCES "production_scene_progress"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shot_progress" ADD CONSTRAINT "production_shot_progress_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_shot_progress" ADD CONSTRAINT "production_shot_progress_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_stripboards" ADD CONSTRAINT "production_stripboards_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_stripboards" ADD CONSTRAINT "production_stripboards_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_stripboards" ADD CONSTRAINT "production_stripboards_schedule_id_organisation_id_fkey" FOREIGN KEY ("schedule_id", "organisation_id") REFERENCES "production_schedules"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_stripboards" ADD CONSTRAINT "production_stripboards_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_stripboards" ADD CONSTRAINT "production_stripboards_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_strips" ADD CONSTRAINT "production_strips_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_strips" ADD CONSTRAINT "production_strips_stripboard_id_organisation_id_fkey" FOREIGN KEY ("stripboard_id", "organisation_id") REFERENCES "production_stripboards"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_strips" ADD CONSTRAINT "production_strips_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_strips" ADD CONSTRAINT "production_strips_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_strips" ADD CONSTRAINT "production_strips_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_wrap_reports" ADD CONSTRAINT "production_wrap_reports_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_wrap_reports" ADD CONSTRAINT "production_wrap_reports_production_day_id_organisation_id_fkey" FOREIGN KEY ("production_day_id", "organisation_id") REFERENCES "production_production_days"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_wrap_reports" ADD CONSTRAINT "production_wrap_reports_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_wrap_reports" ADD CONSTRAINT "production_wrap_reports_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_wrap_reports" ADD CONSTRAINT "production_wrap_reports_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_activity" ADD CONSTRAINT "project_project_activity_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_activity" ADD CONSTRAINT "project_project_activity_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_activity" ADD CONSTRAINT "project_project_activity_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_activity" ADD CONSTRAINT "project_project_activity_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_activity" ADD CONSTRAINT "project_project_activity_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_blockers" ADD CONSTRAINT "project_project_blockers_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_blockers" ADD CONSTRAINT "project_project_blockers_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_blockers" ADD CONSTRAINT "project_project_blockers_task_id_organisation_id_fkey" FOREIGN KEY ("task_id", "organisation_id") REFERENCES "project_project_tasks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_blockers" ADD CONSTRAINT "project_project_blockers_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_blockers" ADD CONSTRAINT "project_project_blockers_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_blockers" ADD CONSTRAINT "project_project_blockers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_briefs" ADD CONSTRAINT "project_project_briefs_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_briefs" ADD CONSTRAINT "project_project_briefs_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_briefs" ADD CONSTRAINT "project_project_briefs_authored_by_user_id_fkey" FOREIGN KEY ("authored_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_briefs" ADD CONSTRAINT "project_project_briefs_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_briefs" ADD CONSTRAINT "project_project_briefs_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_briefs" ADD CONSTRAINT "project_project_briefs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_closeouts" ADD CONSTRAINT "project_project_closeouts_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_closeouts" ADD CONSTRAINT "project_project_closeouts_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_closeouts" ADD CONSTRAINT "project_project_closeouts_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_closeouts" ADD CONSTRAINT "project_project_closeouts_evidence_item_id_organisation_id_fkey" FOREIGN KEY ("evidence_item_id", "organisation_id") REFERENCES "evidence_evidence_items"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_closeouts" ADD CONSTRAINT "project_project_closeouts_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_closeouts" ADD CONSTRAINT "project_project_closeouts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_health_snapshots" ADD CONSTRAINT "project_project_health_snapshots_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_health_snapshots" ADD CONSTRAINT "project_project_health_snapshots_project_id_organisation_i_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_health_snapshots" ADD CONSTRAINT "project_project_health_snapshots_workspace_id_organisation_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_health_snapshots" ADD CONSTRAINT "project_project_health_snapshots_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_intakes" ADD CONSTRAINT "project_project_intakes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_intakes" ADD CONSTRAINT "project_project_intakes_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_intakes" ADD CONSTRAINT "project_project_intakes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_intakes" ADD CONSTRAINT "project_project_intakes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_members" ADD CONSTRAINT "project_project_members_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_members" ADD CONSTRAINT "project_project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_members" ADD CONSTRAINT "project_project_members_added_by_user_id_fkey" FOREIGN KEY ("added_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_milestones" ADD CONSTRAINT "project_project_milestones_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_milestones" ADD CONSTRAINT "project_project_milestones_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_milestones" ADD CONSTRAINT "project_project_milestones_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_milestones" ADD CONSTRAINT "project_project_milestones_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_milestones" ADD CONSTRAINT "project_project_milestones_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_notes" ADD CONSTRAINT "project_project_notes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_notes" ADD CONSTRAINT "project_project_notes_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_notes" ADD CONSTRAINT "project_project_notes_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_notes" ADD CONSTRAINT "project_project_notes_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_notes" ADD CONSTRAINT "project_project_notes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_status_history" ADD CONSTRAINT "project_project_status_history_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_status_history" ADD CONSTRAINT "project_project_status_history_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_status_history" ADD CONSTRAINT "project_project_status_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_status_history" ADD CONSTRAINT "project_project_status_history_workspace_id_organisation_i_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_status_history" ADD CONSTRAINT "project_project_status_history_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tag_links" ADD CONSTRAINT "project_project_tag_links_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tag_links" ADD CONSTRAINT "project_project_tag_links_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tag_links" ADD CONSTRAINT "project_project_tag_links_project_tag_id_organisation_id_fkey" FOREIGN KEY ("project_tag_id", "organisation_id") REFERENCES "project_project_tags"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tag_links" ADD CONSTRAINT "project_project_tag_links_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tag_links" ADD CONSTRAINT "project_project_tag_links_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tags" ADD CONSTRAINT "project_project_tags_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tags" ADD CONSTRAINT "project_project_tags_project_type_id_fkey" FOREIGN KEY ("project_type_id") REFERENCES "project_project_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tags" ADD CONSTRAINT "project_project_tags_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tasks" ADD CONSTRAINT "project_project_tasks_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tasks" ADD CONSTRAINT "project_project_tasks_project_id_organisation_id_fkey" FOREIGN KEY ("project_id", "organisation_id") REFERENCES "project_projects"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tasks" ADD CONSTRAINT "project_project_tasks_assignee_user_id_fkey" FOREIGN KEY ("assignee_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tasks" ADD CONSTRAINT "project_project_tasks_parent_task_id_organisation_id_fkey" FOREIGN KEY ("parent_task_id", "organisation_id") REFERENCES "project_project_tasks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tasks" ADD CONSTRAINT "project_project_tasks_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_project_tasks" ADD CONSTRAINT "project_project_tasks_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_projects" ADD CONSTRAINT "project_projects_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_projects" ADD CONSTRAINT "project_projects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_checklists" ADD CONSTRAINT "project_task_checklists_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_checklists" ADD CONSTRAINT "project_task_checklists_task_id_organisation_id_fkey" FOREIGN KEY ("task_id", "organisation_id") REFERENCES "project_project_tasks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_checklists" ADD CONSTRAINT "project_task_checklists_completed_by_user_id_fkey" FOREIGN KEY ("completed_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_checklists" ADD CONSTRAINT "project_task_checklists_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_checklists" ADD CONSTRAINT "project_task_checklists_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_dependencies" ADD CONSTRAINT "project_task_dependencies_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisation_organisations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_dependencies" ADD CONSTRAINT "project_task_dependencies_task_id_organisation_id_fkey" FOREIGN KEY ("task_id", "organisation_id") REFERENCES "project_project_tasks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_dependencies" ADD CONSTRAINT "project_task_dependencies_depends_on_task_id_organisation__fkey" FOREIGN KEY ("depends_on_task_id", "organisation_id") REFERENCES "project_project_tasks"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_dependencies" ADD CONSTRAINT "project_task_dependencies_workspace_id_organisation_id_fkey" FOREIGN KEY ("workspace_id", "organisation_id") REFERENCES "organisation_workspaces"("id", "organisation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_task_dependencies" ADD CONSTRAINT "project_task_dependencies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_case_studies" ADD CONSTRAINT "public_case_studies_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_projects"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_case_studies" ADD CONSTRAINT "public_case_studies_evidence_item_id_fkey" FOREIGN KEY ("evidence_item_id") REFERENCES "evidence_evidence_items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_case_studies" ADD CONSTRAINT "public_case_studies_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_contact_requests" ADD CONSTRAINT "public_contact_requests_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_contact_requests" ADD CONSTRAINT "public_contact_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_cookie_consents" ADD CONSTRAINT "public_cookie_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_cookie_consents" ADD CONSTRAINT "public_cookie_consents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_demo_requests" ADD CONSTRAINT "public_demo_requests_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_demo_requests" ADD CONSTRAINT "public_demo_requests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_documentation_pages" ADD CONSTRAINT "public_documentation_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_industry_pages" ADD CONSTRAINT "public_industry_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_legal_documents" ADD CONSTRAINT "public_legal_documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_marketing_events" ADD CONSTRAINT "public_marketing_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_marketing_leads" ADD CONSTRAINT "public_marketing_leads_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_marketing_leads" ADD CONSTRAINT "public_marketing_leads_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_pricing_plans" ADD CONSTRAINT "public_pricing_plans_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_product_pages" ADD CONSTRAINT "public_product_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public_solution_pages" ADD CONSTRAINT "public_solution_pages_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
