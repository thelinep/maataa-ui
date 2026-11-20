import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sha256 } from "../src/hash.mjs";
import { registry as initialRegistry } from "../src/index.mjs";
import { assessDraftCompileTestability, compileDraftLogicalSchema, compileLogicalSchema } from "../src/contracts.mjs";
import { generatePrismaPreview } from "../src/prisma-preview.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "data/table-contracts.json");
const contextPath = path.join(root, "data/context-registry.json");
const factoryRoot = path.join(root, "schema-sources/authored/schema-factory-v1");
const contextOrder = ["creative", "logistics", "campaign", "marketplace", "finance", "investor", "eventsSpatial", "intelligence", "public"];

const columns = Object.fromEntries(`
creative.ideas|title:S200,premise:T?,logline:T?,priority:S24
creative.research_items|title:S200,question:T,method:S80,findings:T?,source_uri:S500?
creative.treatments|title:S200,logline:T,synopsis:T?,tone:S120?,target_minutes:I?
creative.scripts|title:S200,format:S40,language:S16,working_draft:T?
creative.script_versions|version_number:I,change_summary:T?,content_sha256:S64?,content_uri:S500?
creative.script_breakdowns|category:S80,label:S200,quantity:D?,unit:S40?,notes:T?
creative.scenes|scene_number:S40,heading:S240,interior_exterior:S16,location_text:S240?,time_of_day:S40?,summary:T?,sort_order:I
creative.scene_versions|version_number:I,change_summary:T?,content_sha256:S64?
creative.characters|display_name:S160,character_kind:S40,age_range:S80?,description:T?,continuity_notes:T?
creative.character_scene_links|relationship:S80,appearance_note:T?,sort_order:I
creative.production_elements|element_kind:S80,label:S160,description:T?,quantity:D?,unit:S40?
creative.scene_elements|quantity:D?,unit:S40?,notes:T?
creative.storyboards|title:S200,version_number:I,description:T?,status_note:S80?
creative.storyboard_frames|frame_number:I,caption:T?,image_uri:S500?,camera_note:T?
creative.shot_lists|title:S200,objective:T?,version_number:I
creative.shots|shot_number:S40,shot_type:S40?,camera_setup:S160?,lens:S80?,movement:S80?,duration_seconds:D?,description:T?
creative.creative_references|reference_kind:S60,title:S200,uri:S500,credit:S200?,notes:T?
creative.creative_assets|asset_kind:S60,title:S200,source_uri:S500?,license:S120?,rights_note:T?,metadata:J?
creative.asset_versions|version_number:I,content_sha256:S64?,storage_uri:S500?,change_summary:T?
creative.creative_approvals|subject_kind:S40,decision:E(pending,approved,rejected,changes_requested),feedback:T?,decided_at:DT?
logistics.locations|name:S200,location_kind:S60,address_line1:S240?,address_line2:S240?,city:S120?,region:S120?,postal_code:S24?,country_code:S2?,latitude:D?,longitude:D?,capacity:I?,access_notes:T?
logistics.location_media|media_kind:S40,uri:S500,caption:T?,sort_order:I
logistics.recces|title:S200,scheduled_at:DT?,completed_at:DT?,weather:T?,access_notes:T?,decision:E(planned,shortlisted,rejected,approved)
logistics.recce_media|media_kind:S40,uri:S500,caption:T?,captured_at:DT?
logistics.location_comparisons|title:S200,criteria:J,decision:E(open,selected,rejected),notes:T?
logistics.permits|permit_kind:S80,permit_number:S120?,issuing_authority:S200?,valid_from:DATE?,valid_until:DATE?,status_note:S80?
logistics.permit_documents|document_kind:S60,uri:S500,content_sha256:S64?,expires_at:DT?
logistics.location_bookings|starts_at:DT,ends_at:DT,booking_status:E(held,confirmed,cancelled,completed),purpose:S200?,quoted_cost:D?
logistics.travel_plans|title:S200,depart_at:DT?,return_at:DT?,travel_status:E(draft,approved,booked,cancelled),notes:T?
logistics.travel_legs|sequence:I,mode:S40,origin:S200,destination:S200,depart_at:DT?,arrive_at:DT?,reference:S120?
logistics.accommodations|name:S200,property_kind:S60?,address:T?,check_in:DATE?,check_out:DATE?,room_count:I?,contact_phone:S40?
logistics.room_allocations|room_label:S80?,occupant_name:S200?,check_in:DATE,check_out:DATE,allocation_status:E(held,assigned,released)
logistics.transport_plans|title:S200,service_kind:S60,starts_at:DT?,ends_at:DT?,pickup_note:T?,status_note:S40?
logistics.vehicles|registration_number:S40?,vehicle_kind:S60,make:S80?,model:S80?,capacity:I?,accessibility_notes:T?,status_note:S40?
logistics.drivers|display_name:S160,phone:S40?,license_number:S100?,license_expires_on:DATE?,availability_note:T?
logistics.vehicle_assignments|starts_at:DT,ends_at:DT,assignment_status:E(planned,assigned,completed,cancelled),route_note:T?
logistics.logistics_tasks|title:S200,task_kind:S60,due_at:DT?,priority:S24,task_status:E(open,in_progress,blocked,done),details:T?
logistics.shipments|carrier:S120?,tracking_number:S120?,ship_from:T?,ship_to:T?,shipped_at:DT?,expected_at:DT?,shipment_status:E(preparing,in_transit,delivered,returned)
logistics.equipment_categories|name:S160,code:S80?,description:T?,requires_serial:boolean,returnable:boolean
logistics.equipment_items|asset_tag:S100?,name:S200,manufacturer:S120?,model:S120?,serial_number:S120?,condition:S40,acquired_on:DATE?,replacement_value:D?,metadata:J?
logistics.equipment_kits|name:S160,kit_code:S80?,description:T?,kit_status:E(active,retired)
logistics.equipment_inventory_events|event_kind:S40,sequence:I,quantity_delta:I,occurred_at:DT,reference:S120?,notes:T?
logistics.equipment_bookings|starts_at:DT,ends_at:DT,quantity:I,booking_status:E(held,confirmed,cancelled,completed)
logistics.equipment_checkouts|checked_out_at:DT,due_at:DT?,checked_out_quantity:I,condition_out:S40?,notes:T?
logistics.equipment_returns|returned_at:DT,returned_quantity:I,condition_in:S40?,damage_note:T?
logistics.equipment_maintenance|maintenance_kind:S60,scheduled_at:DT?,completed_at:DT?,vendor_name:S160?,cost:D?,notes:T?
campaign.campaigns|name:S200,objective:T?,campaign_kind:S60,starts_on:DATE?,ends_on:DATE?,campaign_status:E(draft,planned,active,paused,completed,cancelled),budget:D?
campaign.campaign_briefs|title:S200,audience:T?,message:T?,deliverables:J?,due_on:DATE?
campaign.campaign_strategies|title:S200,positioning:T?,channels:J?,success_criteria:J?,version_number:I
campaign.markets|name:S160,market_code:S32,region:S120?,country_code:S2,currency_code:S3?,timezone:S80?
campaign.cities|name:S160,city_code:S40?,region:S120?,country_code:S2,latitude:D?,longitude:D?
campaign.campaign_markets|market_status:E(target,excluded,active),budget_share:D?,notes:T?
campaign.media_plans|title:S200,plan_version:I,objective:T?,total_budget:D?,starts_on:DATE?,ends_on:DATE?
campaign.media_plan_items|channel:S80,placement:S120?,planned_spend:D?,impressions_target:I?,starts_on:DATE?,ends_on:DATE?,sort_order:I
campaign.atl_plans|title:S200,medium:S80,reach_target:I?,gross_rating_points:D?,planned_spend:D?,details:T?
campaign.btl_plans|title:S200,activation_type:S80,locations:J?,planned_spend:D?,staffing_count:I?,details:T?
campaign.ooh_sites|site_name:S200,site_code:S80?,address:T?,latitude:D?,longitude:D?,format:S80?,rate_card:D?,availability_note:T?
campaign.ooh_site_bookings|starts_at:DT,ends_at:DT,booking_status:E(held,confirmed,cancelled,live,completed),price:D?,proof_uri:S500?
campaign.dooh_screens|screen_name:S160,screen_code:S80,location_note:T?,resolution:S40?,orientation:S24?,availability:J?
campaign.dooh_schedules|starts_at:DT,ends_at:DT,frequency_per_hour:I?,creative_uri:S500?,schedule_status:E(draft,approved,live,ended)
campaign.activations|name:S200,activation_kind:S60,objective:T?,starts_at:DT?,ends_at:DT?,activation_status:E(planned,ready,live,completed,cancelled),budget:D?
campaign.activation_calendar_items|title:S200,starts_at:DT,ends_at:DT?,item_kind:S60,sort_order:I,notes:T?
campaign.site_checkins|checked_in_at:DT,latitude:D?,longitude:D?,verification_method:S40?,notes:T?
campaign.activation_feed_events|event_kind:S60,payload:J,occurred_at:DT,visibility:S24?
campaign.leads|full_name:S160?,email:S320?,phone:S40?,organisation_name:S200?,source:S80?,consent_status:S40,lead_status:E(new,qualified,disqualified,converted)
campaign.lead_events|event_kind:S60,occurred_at:DT,payload:J?,actor_user_id:U?,notes:T?
campaign.campaign_results|result_kind:S80,measured_value:D,unit:S40,measured_at:DT,source:S120?,notes:T?
campaign.campaign_metrics|metric_key:S100,metric_name:S160,value:D,unit:S40,period_start:DATE?,period_end:DATE?,dimensions:J?
marketplace.marketplace_categories|name:S160,slug:S120,description:T?,parent_category_id:U?
marketplace.marketplace_services|name:S200,slug:S140,description:T?,service_kind:S80,delivery_mode:S40,service_status:E(draft,active,retired)
marketplace.capability_packs|name:S160,code:S80,description:T?,capabilities:J,pack_status:E(active,retired)
marketplace.service_skus|sku_code:S80,name:S160,description:T?,unit:S40,base_price:D?,currency_code:S3?,sku_status:E(active,retired)
marketplace.vendors|legal_name:S200,display_name:S160,vendor_code:S80?,tax_identifier:S80?,country_code:S2?,vendor_status:E(pending,verified,suspended,retired),risk_level:S24?
marketplace.vendor_profiles|headline:S200,description:T?,website:S500?,contact_email:S320?,contact_phone:S40?,profile_status:E(draft,published,hidden)
marketplace.vendor_portfolios|title:S200,summary:T?,media_uri:S500?,sort_order:I,visibility:S24
marketplace.vendor_capabilities|proficiency:S40,years_experience:I?,evidence_uri:S500?,verified_at:DT?
marketplace.vendor_availability|starts_at:DT,ends_at:DT,availability_status:E(available,held,unavailable),capacity:I?,notes:T?
marketplace.vendor_ratings|score:D,review_text:T?,rating_status:E(pending,published,hidden),rated_at:DT
marketplace.rfqs|rfq_number:S80,title:S200,requirements:T?,response_deadline:DT?,rfq_status:E(draft,issued,closed,awarded,cancelled),currency_code:S3?
marketplace.rfq_items|description:T,quantity:D,unit:S40,required_by:DATE?,sort_order:I
marketplace.rfq_recipients|invited_at:DT,response_status:E(invited,viewed,declined,responded),responded_at:DT?
marketplace.quotes|quote_number:S80,valid_until:DATE?,currency_code:S3,subtotal:D,tax_total:D?,total:D,quote_status:E(draft,submitted,accepted,rejected,expired)
marketplace.quote_items|description:T,quantity:D,unit:S40,unit_price:D,line_total:D,delivery_days:I?
marketplace.quote_comparisons|title:S200,criteria:J,selected_quote_id:U?,notes:T?
marketplace.procurement_awards|award_number:S80,decision:E(pending,awarded,not_awarded),awarded_at:DT?,rationale:T?
marketplace.purchase_orders|po_number:S80,issued_at:DT?,expected_at:DT?,currency_code:S3,subtotal:D,tax_total:D?,total:D,order_status:E(draft,issued,acknowledged,fulfilled,cancelled)
marketplace.purchase_order_items|description:T,quantity:D,unit:S40,unit_price:D,line_total:D,delivered_quantity:D?
marketplace.deliveries|delivery_number:S80,scheduled_at:DT?,delivered_at:DT?,delivery_status:E(planned,in_transit,delivered,exception),proof_uri:S500?
marketplace.service_deliveries|started_at:DT?,completed_at:DT?,acceptance_status:E(pending,accepted,rejected),notes:T?
marketplace.vendor_performance|period_start:DATE,period_end:DATE,score:D,delivery_on_time_rate:D?,quality_score:D?,summary:T?
finance.budgets|name:S200,fiscal_period:S40,currency_code:S3,total_amount:D,approved_amount:D?,budget_status:E(draft,submitted,approved,locked,closed)
finance.budget_categories|name:S160,code:S80?,description:T?,sort_order:I
finance.budget_lines|line_number:I,description:T,planned_amount:D,approved_amount:D?,currency_code:S3,notes:T?
finance.estimates|estimate_number:S80,version_number:I,currency_code:S3,subtotal:D,tax_total:D?,total:D,estimate_status:E(draft,submitted,approved,rejected,expired)
finance.estimate_lines|line_number:I,description:T,quantity:D,unit:S40,unit_cost:D,line_total:D?
finance.cost_sheets|name:S200,version_number:I,currency_code:S3,total_estimated:D,total_actual:D?,sheet_status:E(draft,review,approved,locked)
finance.cost_sheet_lines|line_number:I,description:T,quantity:D,unit:S40,estimated_amount:D,actual_amount:D?
finance.commitments|commitment_number:S80,description:T,committed_amount:D,currency_code:S3,committed_on:DATE,commitment_status:E(open,partially_invoiced,closed,cancelled)
finance.expenses|expense_number:S80,expense_date:DATE,merchant:S200?,description:T,amount:D,currency_code:S3,expense_status:E(draft,submitted,approved,rejected,paid)
finance.expense_lines|line_number:I,description:T,quantity:D?,unit:S40?,unit_amount:D,line_amount:D,tax_code_id:U?
finance.expense_approvals|decision:E(pending,approved,rejected,changes_requested),sequence:I,comment:T?,decided_at:DT?
finance.vendor_invoices|invoice_number:S100,issued_on:DATE,due_on:DATE?,currency_code:S3,subtotal:D,tax_total:D?,total:D,invoice_status:E(received,matched,approved,disputed,paid)
finance.invoice_lines|line_number:I,description:T,quantity:D?,unit:S40?,unit_amount:D,line_amount:D,tax_code_id:U?
finance.invoice_approvals|decision:E(pending,approved,rejected,changes_requested),sequence:I,comment:T?,decided_at:DT?
finance.payments|payment_reference:S100,payment_method:S40,payment_date:DATE?,amount:D,currency_code:S3,payment_status:E(pending,authorized,settled,failed,refunded),provider_reference:S160?
finance.payment_allocations|amount:D,allocated_at:DT,allocation_kind:S40,notes:T?
finance.payment_verifications|verification_method:S40,verification_status:E(pending,verified,failed),verified_at:DT?,reference:S160?,evidence_uri:S500?
finance.cashflow_entries|entry_date:DATE,direction:E(inflow,outflow),amount:D,currency_code:S3,category:S80,description:T?
finance.profitability_snapshots|period_start:DATE,period_end:DATE,currency_code:S3,revenue:D,cost:D,profit:D,margin_percent:D?,calculated_at:DT
finance.tax_codes|code:S40,name:S120,country_code:S2,rate_percent:D,effective_from:DATE,effective_until:DATE?,tax_kind:S40
finance.currencies|code:S3,name:S80,symbol:S12,minor_unit_digits:I,active:boolean
finance.exchange_rates|base_currency:S3,quote_currency:S3,rate:D,effective_at:DT,source:S80,rate_status:E(proposed,verified,retired)
investor.investment_opportunities|title:S200,summary:T?,instrument:S60,target_amount:D,currency_code:S3,minimum_investment:D?,closes_on:DATE?,opportunity_status:E(draft,open,closed,filled,cancelled)
investor.investment_profiles|display_name:S160,investor_kind:S60,mandate:T?,risk_profile:S40?,website:S500?
investor.deal_rooms|name:S200,access_policy:S40,room_status:E(draft,open,closed,archived),opened_at:DT?,closed_at:DT?
investor.deal_room_members|member_role:S40,invited_at:DT,accepted_at:DT?,access_status:E(invited,active,revoked),last_viewed_at:DT?
investor.pitch_decks|title:S200,version_number:I,content_uri:S500,content_sha256:S64?,published_at:DT?,visibility:S40
investor.disclosures|title:S200,disclosure_kind:S60,body:T?,document_uri:S500?,effective_at:DT,ack_required:boolean
investor.due_diligence_items|title:S200,category:S80,description:T?,due_on:DATE?,priority:S24,item_status:E(open,in_review,answered,accepted,waived)
investor.funding_requirements|name:S160,amount:D,currency_code:S3,due_on:DATE?,requirement_status:E(proposed,approved,met,waived),notes:T?
investor.investment_tranches|tranche_number:I,name:S120,amount:D,currency_code:S3,scheduled_on:DATE?,released_on:DATE?,tranche_status:E(planned,approved,released,cancelled)
investor.investor_commitments|commitment_number:S80,amount:D,currency_code:S3,committed_at:DT,commitment_status:E(indication,committed,withdrawn,settled),notes:T?
investor.investor_progress_reports|report_period:S40,summary:T,progress_percent:D?,reported_at:DT,visibility:S40
investor.investor_evidence_links|link_kind:S60,description:T?,linked_at:DT,visibility:S40
investor.distribution_channels|name:S160,channel_kind:S60,territories:J?,terms_uri:S500?,channel_status:E(active,paused,retired)
investor.distribution_deals|deal_number:S80,territory:S120,rights_scope:J,starts_on:DATE?,ends_on:DATE?,deal_status:E(draft,offered,active,expired,terminated),minimum_guarantee:D?
investor.rights|right_kind:S80,territory:S120,exclusivity:S40,starts_on:DATE?,ends_on:DATE?,rights_status:E(proposed,granted,expired,revoked),terms:T?
investor.rights_windows|window_kind:S60,starts_on:DATE,ends_on:DATE,territory:S120,platform:S120?,notes:T?
investor.revenue_entries|period_start:DATE,period_end:DATE,gross_amount:D,net_amount:D,currency_code:S3,source:S120?,recognized_at:DT
investor.recoupment_models|name:S160,waterfall:J,priority_order:I,model_status:E(draft,active,retired),effective_on:DATE?
investor.recoupment_tiers|tier_number:I,threshold_amount:D,share_percent:D,participant_kind:S60,notes:T?
investor.investor_returns|period_start:DATE,period_end:DATE,principal_returned:D,profit_share:D,currency_code:S3,return_status:E(estimated,approved,paid,void)
investor.investor_accounts|account_reference:S100,account_kind:S40,provider:S80?,currency_code:S3,account_status:E(pending,verified,blocked,closed),verified_at:DT?
eventsspatial.events|title:S200,event_kind:S60,starts_at:DT,ends_at:DT?,timezone:S80,guest_capacity:I?,event_status:E(draft,planning,confirmed,live,completed,cancelled),description:T?
eventsspatial.event_journeys|name:S160,journey_kind:S60,version_number:I,journey_status:E(draft,active,retired),description:T?
eventsspatial.event_timeline_items|title:S200,starts_at:DT,ends_at:DT?,stage:S80?,sort_order:I,owner_label:S160?,notes:T?
eventsspatial.run_of_show_items|sequence:I,starts_at:DT?,duration_minutes:I?,cue:S200,operator_note:T?,status_note:S40?
eventsspatial.venues|name:S200,venue_kind:S60,address:T?,latitude:D?,longitude:D?,capacity:I?,accessibility:T?,venue_status:E(active,restricted,retired)
eventsspatial.venue_bookings|starts_at:DT,ends_at:DT,booking_status:E(held,confirmed,cancelled,completed),guest_count:I?,quoted_cost:D?
eventsspatial.weddings|display_name:S200,wedding_date:DATE?,guest_count:I?,style_brief:T?,wedding_status:E(inquiry,planning,confirmed,completed,cancelled)
eventsspatial.wedding_journeys|journey_name:S160,journey_stage:S60,sequence:I,journey_status:E(planned,active,completed,skipped)
eventsspatial.wedding_events|title:S200,event_kind:S60,starts_at:DT,ends_at:DT?,guest_count:I?,sort_order:I
eventsspatial.spatial_projects|name:S200,spatial_kind:S60,units:S16,coordinate_reference:S80?,project_status:E(draft,active,archived),description:T?
eventsspatial.spatial_layers|name:S160,layer_kind:S60,sort_order:I,visible:boolean,opacity:D?,metadata:J?
eventsspatial.spatial_objects|object_kind:S60,label:S160,geometry:J,transform:J?,properties:J?,sort_order:I
eventsspatial.spatial_layouts|name:S160,version_number:I,canvas_width:D?,canvas_height:D?,layout_data:J,layout_status:E(draft,published,archived)
eventsspatial.simulations|name:S160,simulation_kind:S60,parameters:J,results:J?,started_at:DT?,completed_at:DT?,simulation_status:E(queued,running,completed,failed)
eventsspatial.decision_graphs|name:S160,description:T?,version_number:I,graph_status:E(draft,active,retired)
eventsspatial.decision_graph_nodes|node_key:S80,node_kind:S40,label:S160,config:J?,sort_order:I
eventsspatial.decision_graph_edges|from_node_key:S80,to_node_key:S80,edge_kind:S40,condition:J?,sort_order:I
eventsspatial.boards|title:S200,board_kind:S60,version_number:I,board_status:E(draft,active,archived),description:T?
eventsspatial.board_items|item_kind:S60,content:J,sort_order:I,position_x:D?,position_y:D?,size_w:D?,size_h:D?
eventsspatial.presentations|title:S200,theme:S80?,version_number:I,published_at:DT?,presentation_status:E(draft,ready,published,archived)
eventsspatial.presentation_slides|slide_number:I,title:S200,content:J,notes:T?,background_uri:S500?
eventsspatial.film_twins|name:S160,source_project_id:U?,twin_status:E(draft,synchronized,stale,archived),last_synced_at:DT?,metadata:J?
eventsspatial.exhibition_layouts|name:S200,venue_area:S160?,layout_data:J,version_number:I,layout_status:E(draft,review,approved,published)
eventsspatial.cad_models|name:S200,file_uri:S500,format:S24,content_sha256:S64?,units:S16,model_version:S40?
eventsspatial.spatial_operations|operation_kind:S60,payload:J,occurred_at:DT,sequence:I,actor_label:S120?
intelligence.ai_conversations|title:S200?,assistant_kind:S80,conversation_status:E(active,archived,closed),started_at:DT,last_activity_at:DT?
intelligence.ai_messages|sequence:I,role:E(system,user,assistant,tool),content:T,content_format:S40?,token_count:I?,model_key:S120?,sent_at:DT
intelligence.ai_contexts|context_kind:S60,source_reference:S500?,content_sha256:S64?,context_data:J?,attached_at:DT,expires_at:DT?
intelligence.ai_suggestions|suggestion_kind:S60,body:T,confidence:D?,status:E(pending,accepted,dismissed,expired),created_at:DT
intelligence.research_sessions|query:T,scope:J?,session_status:E(open,completed,failed,cancelled),started_at:DT,completed_at:DT?
intelligence.research_sources|source_kind:S60,title:S200?,uri:S1000?,content_sha256:S64?,retrieved_at:DT?,source_data:J?
intelligence.knowledge_documents|title:S240,document_kind:S60,source_uri:S1000?,content_sha256:S64?,document_status:E(queued,indexed,failed,retired),indexed_at:DT?
intelligence.knowledge_chunks|chunk_index:I,content:T,token_count:I?,embedding_reference:S500?,metadata:J?
intelligence.evidence_aware_answers|question:T,answer:T,confidence:D?,grounding_status:E(grounded,partial,ungrounded),answered_at:DT,citation_count:I
intelligence.intelligence_runs|run_kind:S60,input_data:J,output_data:J?,run_status:E(queued,running,completed,failed),started_at:DT?,completed_at:DT?,model_key:S120?
intelligence.intelligence_signals|signal_kind:S60,subject_type:S80,subject_id:U?,score:D?,signal_data:J,observed_at:DT
intelligence.forecast_runs|forecast_kind:S60,target_metric:S100,horizon_start:DATE,horizon_end:DATE,run_status:E(queued,running,completed,failed),generated_at:DT?
intelligence.forecast_scenarios|name:S160,assumptions:J,forecast_values:J,confidence_low:D?,confidence_high:D?,sort_order:I
intelligence.saved_insights|title:S200,body:T,insight_kind:S60,source_references:J?,saved_at:DT,visibility:S40
intelligence.analytics_events|event_name:S120,occurred_at:DT,actor_user_id:U?,subject_type:S80?,subject_id:U?,properties:J?
intelligence.kpi_definitions|metric_key:S100,name:S160,description:T?,unit:S40,aggregation:S40,definition:J,active:boolean
intelligence.kpi_measurements|measured_at:DT,value:D,dimensions:J?,source_reference:S500?
intelligence.prompt_templates|template_key:S120,version_number:I,system_prompt:T,user_template:T,variables:J?,template_status:E(draft,active,retired)
intelligence.generation_jobs|job_kind:S60,input_data:J,job_status:E(queued,running,completed,failed,cancelled),requested_at:DT,completed_at:DT?,result_reference:S500?
intelligence.model_registry|model_key:S120,provider:S80,model_name:S160,capabilities:J,context_limit:I?,enabled:boolean,configuration:J?
intelligence.model_runs|provider_request_id:S160?,model_key:S120,input_tokens:I?,output_tokens:I?,latency_ms:I?,run_status:E(requested,completed,failed),started_at:DT,completed_at:DT?
intelligence.ai_citations|citation_index:I,citation_kind:S40,title:S240?,uri:S1000?,source_id:U?,excerpt:T?,page_number:I?
public.product_pages|slug:S160,title:S200,summary:T?,body:J,locale:S16,published_at:DT?,page_status:E(draft,published,retired),seo:J?
public.solution_pages|slug:S160,title:S200,summary:T?,body:J,locale:S16,published_at:DT?,page_status:E(draft,published,retired),seo:J?
public.industry_pages|slug:S160,title:S200,summary:T?,body:J,locale:S16,published_at:DT?,page_status:E(draft,published,retired),seo:J?
public.case_studies|slug:S160,title:S200,client_name:S200?,summary:T?,body:J,locale:S16,published_at:DT?,case_status:E(draft,published,withdrawn),outcome_metrics:J?
public.pricing_plans|plan_key:S100,name:S160,description:T?,currency_code:S3,price_amount:D?,billing_period:S40?,features:J,plan_status:E(draft,published,retired)
public.documentation_pages|slug:S200,title:S240,body:J,locale:S16,version_label:S40?,published_at:DT?,page_status:E(draft,published,retired),search_keywords:J?
public.legal_documents|document_kind:S60,version_label:S40,title:S200,body_uri:S1000,content_sha256:S64,effective_at:DT,retired_at:DT?,locale:S16
public.cookie_consents|consent_id:S120,session_hash:S128?,policy_version:S40,consent_choices:J,recorded_at:DT,expires_at:DT?,source:S60
public.contact_requests|full_name:S160,email:S320,organisation_name:S200?,topic:S80,message:T,consent:boolean,request_status:E(new,assigned,answered,closed,spam),submitted_at:DT
public.demo_requests|full_name:S160,email:S320,organisation_name:S200?,role:S120?,product_interest:J?,preferred_at:DT?,request_status:E(new,qualified,scheduled,completed,closed),submitted_at:DT
public.marketing_leads|full_name:S160?,email:S320,company_name:S200?,source:S80,consent_status:E(granted,withdrawn,unknown),lead_status:E(new,qualified,converted,unsubscribed),captured_at:DT
public.marketing_events|event_name:S120,session_hash:S128?,occurred_at:DT,anonymous_id:S128?,properties:J?,consent_state:S40
`.trim().split("\n").map((line) => {
  const [id, value] = line.split("|");
  return [id.trim(), [...value.matchAll(/([a-z_]+):((?:E\([^)]*\))|[^,]+)/g)].map((match) => [match[1], match[2]])];
}));

const refSpecs = Object.fromEntries(`
creative.ideas|project_id>project.projects,created_by_user_id>identity.users?
creative.research_items|project_id>project.projects,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
creative.treatments|project_id>project.projects,created_by_user_id>identity.users?
creative.scripts|project_id>project.projects,treatment_id>creative.treatments?,created_by_user_id>identity.users?
creative.script_versions|script_id>creative.scripts,created_by_user_id>identity.users?
creative.script_breakdowns|script_version_id>creative.script_versions,scene_id>creative.scenes?,created_by_user_id>identity.users?
creative.scenes|script_id>creative.scripts,created_by_user_id>identity.users?
creative.scene_versions|scene_id>creative.scenes,created_by_user_id>identity.users?
creative.characters|project_id>project.projects,talent_profile_id>people.talent_profiles?,created_by_user_id>identity.users?
creative.character_scene_links|character_id>creative.characters,scene_id>creative.scenes
creative.production_elements|project_id>project.projects,created_by_user_id>identity.users?
creative.scene_elements|scene_id>creative.scenes,production_element_id>creative.production_elements
creative.storyboards|script_id>creative.scripts,created_by_user_id>identity.users?
creative.storyboard_frames|storyboard_id>creative.storyboards,scene_id>creative.scenes?,created_by_user_id>identity.users?
creative.shot_lists|project_id>project.projects,script_id>creative.scripts?,created_by_user_id>identity.users?
creative.shots|shot_list_id>creative.shot_lists,scene_id>creative.scenes,created_by_user_id>identity.users?
creative.creative_references|project_id>project.projects,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
creative.creative_assets|project_id>project.projects,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
creative.asset_versions|creative_asset_id>creative.creative_assets,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
creative.creative_approvals|project_id>project.projects,script_version_id>creative.script_versions?,creative_asset_id>creative.creative_assets?,reviewer_user_id>identity.users?
logistics.locations|created_by_user_id>identity.users?
logistics.location_media|location_id>logistics.locations,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
logistics.recces|project_id>project.projects,location_id>logistics.locations,lead_user_id>identity.users?,created_by_user_id>identity.users?
logistics.recce_media|recce_id>logistics.recces,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
logistics.location_comparisons|project_id>project.projects,recce_id>logistics.recces?,created_by_user_id>identity.users?
logistics.permits|project_id>project.projects,location_id>logistics.locations,created_by_user_id>identity.users?
logistics.permit_documents|permit_id>logistics.permits,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
logistics.location_bookings|project_id>project.projects,location_id>logistics.locations,permit_id>logistics.permits?,booked_by_user_id>identity.users?
logistics.travel_plans|project_id>project.projects,created_by_user_id>identity.users?
logistics.travel_legs|travel_plan_id>logistics.travel_plans,location_id>logistics.locations?,created_by_user_id>identity.users?
logistics.accommodations|location_id>logistics.locations?,created_by_user_id>identity.users?
logistics.room_allocations|accommodation_id>logistics.accommodations,project_id>project.projects,person_user_id>identity.users?,created_by_user_id>identity.users?
logistics.transport_plans|project_id>project.projects,created_by_user_id>identity.users?
logistics.vehicles|created_by_user_id>identity.users?
logistics.drivers|user_id>identity.users?,created_by_user_id>identity.users?
logistics.vehicle_assignments|transport_plan_id>logistics.transport_plans,vehicle_id>logistics.vehicles,driver_id>logistics.drivers?,project_id>project.projects,created_by_user_id>identity.users?
logistics.logistics_tasks|project_id>project.projects,assigned_to_user_id>identity.users?,created_by_user_id>identity.users?
logistics.shipments|project_id>project.projects,logistics_task_id>logistics.logistics_tasks?,created_by_user_id>identity.users?
logistics.equipment_categories|created_by_user_id>identity.users?
logistics.equipment_items|category_id>logistics.equipment_categories,created_by_user_id>identity.users?
logistics.equipment_kits|created_by_user_id>identity.users?
logistics.equipment_inventory_events|equipment_item_id>logistics.equipment_items,equipment_kit_id>logistics.equipment_kits?,actor_user_id>identity.users?
logistics.equipment_bookings|project_id>project.projects,equipment_item_id>logistics.equipment_items?,equipment_kit_id>logistics.equipment_kits?,booked_by_user_id>identity.users?
logistics.equipment_checkouts|equipment_item_id>logistics.equipment_items,equipment_booking_id>logistics.equipment_bookings?,checked_out_to_user_id>identity.users?,issued_by_user_id>identity.users?
logistics.equipment_returns|checkout_id>logistics.equipment_checkouts,received_by_user_id>identity.users?
logistics.equipment_maintenance|equipment_item_id>logistics.equipment_items,created_by_user_id>identity.users?
campaign.campaigns|project_id>project.projects,owner_user_id>identity.users?,created_by_user_id>identity.users?
campaign.campaign_briefs|campaign_id>campaign.campaigns,created_by_user_id>identity.users?
campaign.campaign_strategies|campaign_id>campaign.campaigns,created_by_user_id>identity.users?
campaign.campaign_markets|campaign_id>campaign.campaigns,market_id>campaign.markets
campaign.media_plans|campaign_id>campaign.campaigns,created_by_user_id>identity.users?
campaign.media_plan_items|media_plan_id>campaign.media_plans,created_by_user_id>identity.users?
campaign.atl_plans|campaign_id>campaign.campaigns,media_plan_id>campaign.media_plans?,created_by_user_id>identity.users?
campaign.btl_plans|campaign_id>campaign.campaigns,media_plan_id>campaign.media_plans?,created_by_user_id>identity.users?
campaign.ooh_sites|location_id>logistics.locations?,created_by_user_id>identity.users?
campaign.ooh_site_bookings|campaign_id>campaign.campaigns,ooh_site_id>campaign.ooh_sites,project_id>project.projects,created_by_user_id>identity.users?
campaign.dooh_screens|location_id>logistics.locations?,created_by_user_id>identity.users?
campaign.dooh_schedules|campaign_id>campaign.campaigns,dooh_screen_id>campaign.dooh_screens,created_by_user_id>identity.users?
campaign.activations|campaign_id>campaign.campaigns,project_id>project.projects,location_id>logistics.locations?,created_by_user_id>identity.users?
campaign.activation_calendar_items|activation_id>campaign.activations,created_by_user_id>identity.users?
campaign.site_checkins|activation_id>campaign.activations,location_id>logistics.locations?,checked_in_by_user_id>identity.users?
campaign.activation_feed_events|activation_id>campaign.activations,actor_user_id>identity.users?
campaign.leads|campaign_id>campaign.campaigns?,assigned_to_user_id>identity.users?
campaign.lead_events|lead_id>campaign.leads,actor_user_id>identity.users?
campaign.campaign_results|campaign_id>campaign.campaigns,created_by_user_id>identity.users?
campaign.campaign_metrics|campaign_id>campaign.campaigns,created_by_user_id>identity.users?
marketplace.marketplace_categories|parent_category_id>marketplace.marketplace_categories?
marketplace.marketplace_services|category_id>marketplace.marketplace_categories,created_by_user_id>identity.users?
marketplace.capability_packs|created_by_user_id>identity.users?
marketplace.service_skus|service_id>marketplace.marketplace_services,created_by_user_id>identity.users?
marketplace.vendors|owner_user_id>identity.users?,created_by_user_id>identity.users?
marketplace.vendor_profiles|vendor_id>marketplace.vendors
marketplace.vendor_portfolios|vendor_id>marketplace.vendors,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
marketplace.vendor_capabilities|vendor_id>marketplace.vendors,service_id>marketplace.marketplace_services,created_by_user_id>identity.users?
marketplace.vendor_availability|vendor_id>marketplace.vendors,created_by_user_id>identity.users?
marketplace.vendor_ratings|vendor_id>marketplace.vendors,project_id>project.projects?,rated_by_user_id>identity.users?
marketplace.rfqs|project_id>project.projects?,requester_user_id>identity.users?,created_by_user_id>identity.users?
marketplace.rfq_items|rfq_id>marketplace.rfqs,service_id>marketplace.marketplace_services?,sku_id>marketplace.service_skus?
marketplace.rfq_recipients|rfq_id>marketplace.rfqs,vendor_id>marketplace.vendors,invited_by_user_id>identity.users?
marketplace.quotes|rfq_id>marketplace.rfqs,vendor_id>marketplace.vendors,submitted_by_user_id>identity.users?
marketplace.quote_items|quote_id>marketplace.quotes,rfq_item_id>marketplace.rfq_items?,sku_id>marketplace.service_skus?
marketplace.quote_comparisons|rfq_id>marketplace.rfqs,created_by_user_id>identity.users?
marketplace.procurement_awards|rfq_id>marketplace.rfqs,quote_id>marketplace.quotes?,vendor_id>marketplace.vendors?,decided_by_user_id>identity.users?
marketplace.purchase_orders|vendor_id>marketplace.vendors,award_id>marketplace.procurement_awards?,project_id>project.projects?,issued_by_user_id>identity.users?
marketplace.purchase_order_items|purchase_order_id>marketplace.purchase_orders,sku_id>marketplace.service_skus?,rfq_item_id>marketplace.rfq_items?
marketplace.deliveries|purchase_order_id>marketplace.purchase_orders,shipment_id>logistics.shipments?,created_by_user_id>identity.users?
marketplace.service_deliveries|purchase_order_item_id>marketplace.purchase_order_items,service_id>marketplace.marketplace_services,accepted_by_user_id>identity.users?
marketplace.vendor_performance|vendor_id>marketplace.vendors,calculated_by_user_id>identity.users?
finance.budgets|project_id>project.projects,owner_user_id>identity.users?,created_by_user_id>identity.users?
finance.budget_categories|created_by_user_id>identity.users?
finance.budget_lines|budget_id>finance.budgets,category_id>finance.budget_categories,project_id>project.projects?,created_by_user_id>identity.users?
finance.estimates|project_id>project.projects,requested_by_user_id>identity.users?,created_by_user_id>identity.users?
finance.estimate_lines|estimate_id>finance.estimates,budget_line_id>finance.budget_lines?,created_by_user_id>identity.users?
finance.cost_sheets|project_id>project.projects,budget_id>finance.budgets?,created_by_user_id>identity.users?
finance.cost_sheet_lines|cost_sheet_id>finance.cost_sheets,budget_line_id>finance.budget_lines?,created_by_user_id>identity.users?
finance.commitments|project_id>project.projects,budget_line_id>finance.budget_lines?,purchase_order_id>marketplace.purchase_orders?,vendor_id>marketplace.vendors?,created_by_user_id>identity.users?
finance.expenses|project_id>project.projects,submitted_by_user_id>identity.users?,created_by_user_id>identity.users?
finance.expense_lines|expense_id>finance.expenses,budget_line_id>finance.budget_lines?,tax_code_id>finance.tax_codes?,created_by_user_id>identity.users?
finance.expense_approvals|expense_id>finance.expenses,reviewer_user_id>identity.users?
finance.vendor_invoices|vendor_id>marketplace.vendors,purchase_order_id>marketplace.purchase_orders?,commitment_id>finance.commitments?,created_by_user_id>identity.users?
finance.invoice_lines|invoice_id>finance.vendor_invoices,purchase_order_item_id>marketplace.purchase_order_items?,tax_code_id>finance.tax_codes?
finance.invoice_approvals|invoice_id>finance.vendor_invoices,reviewer_user_id>identity.users?
finance.payments|vendor_id>marketplace.vendors?,invoice_id>finance.vendor_invoices?,created_by_user_id>identity.users?
finance.payment_allocations|payment_id>finance.payments,invoice_id>finance.vendor_invoices?,expense_id>finance.expenses?
finance.payment_verifications|payment_id>finance.payments,verified_by_user_id>identity.users?,evidence_item_id>evidence.evidence_items?
finance.cashflow_entries|project_id>project.projects?,payment_id>finance.payments?,created_by_user_id>identity.users?
finance.profitability_snapshots|project_id>project.projects,calculated_by_user_id>identity.users?
finance.tax_codes|created_by_user_id>identity.users?
finance.currencies|
finance.exchange_rates|verified_by_user_id>identity.users?
investor.investment_opportunities|project_id>project.projects,created_by_user_id>identity.users?
investor.investment_profiles|user_id>identity.users?,created_by_user_id>identity.users?
investor.deal_rooms|opportunity_id>investor.investment_opportunities,created_by_user_id>identity.users?
investor.deal_room_members|deal_room_id>investor.deal_rooms,user_id>identity.users,invited_by_user_id>identity.users?
investor.pitch_decks|opportunity_id>investor.investment_opportunities,evidence_item_id>evidence.evidence_items?,uploaded_by_user_id>identity.users?
investor.disclosures|opportunity_id>investor.investment_opportunities,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
investor.due_diligence_items|opportunity_id>investor.investment_opportunities,assigned_to_user_id>identity.users?,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
investor.funding_requirements|opportunity_id>investor.investment_opportunities,created_by_user_id>identity.users?
investor.investment_tranches|opportunity_id>investor.investment_opportunities,funding_requirement_id>investor.funding_requirements?,created_by_user_id>identity.users?
investor.investor_commitments|opportunity_id>investor.investment_opportunities,investor_profile_id>investor.investment_profiles,deal_room_id>investor.deal_rooms?,created_by_user_id>identity.users?
investor.investor_progress_reports|opportunity_id>investor.investment_opportunities,investor_profile_id>investor.investment_profiles,created_by_user_id>identity.users?
investor.investor_evidence_links|opportunity_id>investor.investment_opportunities,investor_profile_id>investor.investment_profiles?,evidence_item_id>evidence.evidence_items,created_by_user_id>identity.users?
investor.distribution_channels|created_by_user_id>identity.users?
investor.distribution_deals|opportunity_id>investor.investment_opportunities,channel_id>investor.distribution_channels,created_by_user_id>identity.users?
investor.rights|project_id>project.projects,opportunity_id>investor.investment_opportunities?,created_by_user_id>identity.users?
investor.rights_windows|right_id>investor.rights,distribution_deal_id>investor.distribution_deals?,created_by_user_id>identity.users?
investor.revenue_entries|project_id>project.projects,distribution_deal_id>investor.distribution_deals?,created_by_user_id>identity.users?
investor.recoupment_models|opportunity_id>investor.investment_opportunities,created_by_user_id>identity.users?
investor.recoupment_tiers|recoupment_model_id>investor.recoupment_models
investor.investor_returns|commitment_id>investor.investor_commitments,recoupment_model_id>investor.recoupment_models?,payment_id>finance.payments?,created_by_user_id>identity.users?
investor.investor_accounts|investor_profile_id>investor.investment_profiles,verified_by_user_id>identity.users?
eventsspatial.events|project_id>project.projects?,wedding_id>eventsspatial.weddings?,venue_id>eventsspatial.venues?,created_by_user_id>identity.users?
eventsspatial.event_journeys|event_id>eventsspatial.events,created_by_user_id>identity.users?
eventsspatial.event_timeline_items|event_id>eventsspatial.events,created_by_user_id>identity.users?
eventsspatial.run_of_show_items|event_id>eventsspatial.events,created_by_user_id>identity.users?
eventsspatial.venues|location_id>logistics.locations?,created_by_user_id>identity.users?
eventsspatial.venue_bookings|venue_id>eventsspatial.venues,event_id>eventsspatial.events?,project_id>project.projects?,created_by_user_id>identity.users?
eventsspatial.weddings|project_id>project.projects?,client_user_id>identity.users?,created_by_user_id>identity.users?
eventsspatial.wedding_journeys|wedding_id>eventsspatial.weddings,created_by_user_id>identity.users?
eventsspatial.wedding_events|wedding_id>eventsspatial.weddings,venue_id>eventsspatial.venues?,created_by_user_id>identity.users?
eventsspatial.spatial_projects|project_id>project.projects?,event_id>eventsspatial.events?,created_by_user_id>identity.users?
eventsspatial.spatial_layers|spatial_project_id>eventsspatial.spatial_projects,created_by_user_id>identity.users?
eventsspatial.spatial_objects|spatial_layer_id>eventsspatial.spatial_layers,created_by_user_id>identity.users?
eventsspatial.spatial_layouts|spatial_project_id>eventsspatial.spatial_projects,created_by_user_id>identity.users?
eventsspatial.simulations|spatial_project_id>eventsspatial.spatial_projects,layout_id>eventsspatial.spatial_layouts?,requested_by_user_id>identity.users?
eventsspatial.decision_graphs|spatial_project_id>eventsspatial.spatial_projects,created_by_user_id>identity.users?
eventsspatial.decision_graph_nodes|decision_graph_id>eventsspatial.decision_graphs,created_by_user_id>identity.users?
eventsspatial.decision_graph_edges|decision_graph_id>eventsspatial.decision_graphs,created_by_user_id>identity.users?
eventsspatial.boards|spatial_project_id>eventsspatial.spatial_projects?,event_id>eventsspatial.events?,created_by_user_id>identity.users?
eventsspatial.board_items|board_id>eventsspatial.boards,created_by_user_id>identity.users?
eventsspatial.presentations|event_id>eventsspatial.events?,spatial_project_id>eventsspatial.spatial_projects?,created_by_user_id>identity.users?
eventsspatial.presentation_slides|presentation_id>eventsspatial.presentations,created_by_user_id>identity.users?
eventsspatial.film_twins|project_id>project.projects?,spatial_project_id>eventsspatial.spatial_projects?,created_by_user_id>identity.users?
eventsspatial.exhibition_layouts|venue_id>eventsspatial.venues,spatial_project_id>eventsspatial.spatial_projects?,created_by_user_id>identity.users?
eventsspatial.cad_models|spatial_project_id>eventsspatial.spatial_projects,evidence_item_id>evidence.evidence_items?,uploaded_by_user_id>identity.users?
eventsspatial.spatial_operations|spatial_project_id>eventsspatial.spatial_projects,actor_user_id>identity.users?
intelligence.ai_conversations|owner_user_id>identity.users?,created_by_user_id>identity.users?
intelligence.ai_messages|conversation_id>intelligence.ai_conversations,created_by_user_id>identity.users?
intelligence.ai_contexts|conversation_id>intelligence.ai_conversations?,document_id>intelligence.knowledge_documents?,evidence_item_id>evidence.evidence_items?,attached_by_user_id>identity.users?
intelligence.ai_suggestions|conversation_id>intelligence.ai_conversations?,message_id>intelligence.ai_messages?,created_by_user_id>identity.users?
intelligence.research_sessions|requested_by_user_id>identity.users?,project_id>project.projects?,created_by_user_id>identity.users?
intelligence.research_sources|research_session_id>intelligence.research_sessions,document_id>intelligence.knowledge_documents?,created_by_user_id>identity.users?
intelligence.knowledge_documents|uploaded_by_user_id>identity.users?,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
intelligence.knowledge_chunks|document_id>intelligence.knowledge_documents
intelligence.evidence_aware_answers|research_session_id>intelligence.research_sessions?,conversation_id>intelligence.ai_conversations?,created_by_user_id>identity.users?
intelligence.intelligence_runs|requested_by_user_id>identity.users?,project_id>project.projects?,conversation_id>intelligence.ai_conversations?
intelligence.intelligence_signals|project_id>project.projects?,created_by_user_id>identity.users?
intelligence.forecast_runs|project_id>project.projects?,requested_by_user_id>identity.users?
intelligence.forecast_scenarios|forecast_run_id>intelligence.forecast_runs
intelligence.saved_insights|owner_user_id>identity.users?,project_id>project.projects?
intelligence.analytics_events|actor_user_id>identity.users?
intelligence.kpi_definitions|created_by_user_id>identity.users?
intelligence.kpi_measurements|kpi_definition_id>intelligence.kpi_definitions,project_id>project.projects?
intelligence.prompt_templates|created_by_user_id>identity.users?
intelligence.generation_jobs|requested_by_user_id>identity.users?,conversation_id>intelligence.ai_conversations?
intelligence.model_registry|created_by_user_id>identity.users?
intelligence.model_runs|generation_job_id>intelligence.generation_jobs?,conversation_id>intelligence.ai_conversations?,requested_by_user_id>identity.users?
intelligence.ai_citations|message_id>intelligence.ai_messages?,source_id>intelligence.research_sources?,evidence_item_id>evidence.evidence_items?
public.product_pages|created_by_user_id>identity.users?
public.solution_pages|created_by_user_id>identity.users?
public.industry_pages|created_by_user_id>identity.users?
public.case_studies|project_id>project.projects?,evidence_item_id>evidence.evidence_items?,created_by_user_id>identity.users?
public.pricing_plans|created_by_user_id>identity.users?
public.documentation_pages|created_by_user_id>identity.users?
public.legal_documents|created_by_user_id>identity.users?
public.cookie_consents|user_id>identity.users?
public.contact_requests|assigned_to_user_id>identity.users?
public.demo_requests|assigned_to_user_id>identity.users?
public.marketing_leads|assigned_to_user_id>identity.users?
public.marketing_events|
`.trim().split("\n").map((line) => {
  const [id, refs = ""] = line.split("|");
  return [id.trim(), refs ? refs.split(",").filter(Boolean).map((entry) => {
    const [field, targetRaw] = entry.split(">");
    return { field, target: targetRaw.endsWith("?") ? targetRaw.slice(0, -1) : targetRaw, nullable: targetRaw.endsWith("?") };
  }) : []];
}));

const uniqueSpecs = {
  "creative.character_scene_links": [["character_id", "scene_id"]],
  "creative.scene_elements": [["scene_id", "production_element_id"]],
  "creative.script_versions": [["script_id", "version_number"]],
  "creative.scene_versions": [["scene_id", "version_number"]],
  "creative.asset_versions": [["creative_asset_id", "version_number"]],
  "creative.shots": [["shot_list_id", "shot_number"]],
  "creative.storyboard_frames": [["storyboard_id", "frame_number"]],
  "logistics.vehicles": [["registration_number"]],
  "logistics.equipment_items": [["asset_tag"]],
  "logistics.equipment_categories": [["name"]],
  "logistics.equipment_kits": [["kit_code"]],
  "logistics.travel_legs": [["travel_plan_id", "sequence"]],
  "logistics.room_allocations": [["accommodation_id", "room_label", "check_in"]],
  "logistics.equipment_inventory_events": [["equipment_item_id", "sequence"]],
  "campaign.markets": [["market_code"]],
  "campaign.cities": [["city_code"]],
  "campaign.campaign_markets": [["campaign_id", "market_id"]],
  "campaign.media_plan_items": [["media_plan_id", "sort_order"]],
  "campaign.activation_calendar_items": [["activation_id", "sort_order"]],
  "campaign.campaign_metrics": [["campaign_id", "metric_key", "period_start", "period_end"]],
  "marketplace.marketplace_categories": [["slug"]],
  "marketplace.marketplace_services": [["slug"]],
  "marketplace.capability_packs": [["code"]],
  "marketplace.service_skus": [["sku_code"]],
  "marketplace.vendor_profiles": [["vendor_id"]],
  "marketplace.vendor_capabilities": [["vendor_id", "service_id"]],
  "marketplace.vendor_availability": [["vendor_id", "starts_at", "ends_at"]],
  "marketplace.rfq_items": [["rfq_id", "sort_order"]],
  "marketplace.quote_items": [["quote_id", "rfq_item_id"]],
  "marketplace.purchase_order_items": [["purchase_order_id", "rfq_item_id"]],
  "finance.budgets": [["project_id", "fiscal_period", "name"]],
  "finance.budget_lines": [["budget_id", "line_number"]],
  "finance.estimate_lines": [["estimate_id", "line_number"]],
  "finance.cost_sheet_lines": [["cost_sheet_id", "line_number"]],
  "finance.expense_lines": [["expense_id", "line_number"]],
  "finance.invoice_lines": [["invoice_id", "line_number"]],
  "finance.tax_codes": [["country_code", "code", "effective_from"]],
  "finance.currencies": [["code"]],
  "finance.exchange_rates": [["base_currency", "quote_currency", "effective_at"]],
  "investor.deal_room_members": [["deal_room_id", "user_id"]],
  "investor.investment_tranches": [["opportunity_id", "tranche_number"]],
  "investor.recoupment_tiers": [["recoupment_model_id", "tier_number"]],
  "investor.rights_windows": [["right_id", "window_kind", "starts_on"]],
  "eventsspatial.event_timeline_items": [["event_id", "sort_order"]],
  "eventsspatial.run_of_show_items": [["event_id", "sequence"]],
  "eventsspatial.wedding_events": [["wedding_id", "sort_order"]],
  "eventsspatial.spatial_layers": [["spatial_project_id", "sort_order"]],
  "eventsspatial.decision_graph_nodes": [["decision_graph_id", "node_key"]],
  "eventsspatial.decision_graph_edges": [["decision_graph_id", "from_node_key", "to_node_key"]],
  "eventsspatial.board_items": [["board_id", "sort_order"]],
  "eventsspatial.presentation_slides": [["presentation_id", "slide_number"]],
  "intelligence.ai_messages": [["conversation_id", "sequence"]],
  "intelligence.knowledge_chunks": [["document_id", "chunk_index"]],
  "intelligence.kpi_definitions": [["metric_key"]],
  "intelligence.prompt_templates": [["template_key", "version_number"]],
  "intelligence.model_registry": [["provider", "model_name"]],
  "intelligence.forecast_scenarios": [["forecast_run_id", "name"]],
  "intelligence.ai_citations": [["message_id", "citation_index"]],
  "public.product_pages": [["slug", "locale"]],
  "public.solution_pages": [["slug", "locale"]],
  "public.industry_pages": [["slug", "locale"]],
  "public.case_studies": [["slug", "locale"]],
  "public.documentation_pages": [["slug", "locale"]],
  "public.legal_documents": [["document_kind", "version_label", "locale"]],
  "public.cookie_consents": [["consent_id"]],
};

const globalTables = new Set([
  "campaign.markets", "campaign.cities",
  "finance.tax_codes", "finance.currencies", "finance.exchange_rates",
  "intelligence.model_registry", "intelligence.kpi_definitions", "intelligence.prompt_templates",
  "public.product_pages", "public.solution_pages", "public.industry_pages", "public.case_studies",
  "public.pricing_plans", "public.documentation_pages", "public.legal_documents", "public.cookie_consents",
  "public.contact_requests", "public.demo_requests", "public.marketing_leads", "public.marketing_events",
]);

const defaultStatuses = ["draft", "active", "paused", "completed", "cancelled", "archived"];
const scalar = (code, enumId, context) => {
  const nullable = code.endsWith("?");
  const raw = nullable ? code.slice(0, -1) : code;
  if (raw.startsWith("S")) return { type: "string", nullable, maxLength: Number(raw.slice(1)) };
  if (raw.startsWith("E(")) {
    const values = raw.slice(2, -1).split(",");
    return { type: "enum", nullable, enumId, defaultLiteral: values.includes("draft") ? "draft" : values.includes("pending") ? "pending" : values[0] };
  }
  if (raw === "T") return { type: "text", nullable };
  if (raw === "I") return { type: "int", nullable };
  if (raw === "U") return { type: "uuid", nullable };
  if (raw === "D") return { type: "decimal", nullable, precision: 14, scale: 2 };
  if (raw === "DATE") return { type: "date", nullable };
  if (raw === "DT") return { type: "datetime", nullable, timezone: "UTC instant" };
  if (raw === "J") return { type: "json", nullable };
  if (raw === "boolean") return { type: "boolean", nullable, defaultLiteral: false };
  throw new Error(`UNKNOWN_FIELD_TYPE:${context}:${code}`);
};

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const writeJson = async (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const short = (id) => id.split(".").at(-1);
const safe = (text) => text.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase();
const keyName = (name, fields) => `${name}_${fields.join("_")}_uq`;
const buildPlans = (catalogTables, currentContracts) => {
  for (const table of catalogTables) if (!columns[table.id]) throw new Error(`NO_FIELD_DECISION:${table.id}`);
  const byId = new Map([...currentContracts.map((contract) => [contract.id, contract])]);
  const contracts = [];
  for (const table of catalogTables) {
    const id = table.id;
    const context = table.context;
    const isGlobal = globalTables.has(id);
    const fields = {
      id: { type: "uuid", nullable: false, generated: true, defaultExpression: { kind: "uuid-v4" } },
      ...(!isGlobal ? { organisation_id: { type: "uuid", nullable: false }, workspace_id: { type: "uuid", nullable: false } } : {}),
    };
    const enums = [];
    for (const [name, type] of columns[id]) {
      const enumId = `${id}#${name}`;
      const def = scalar(type, enumId, id);
      fields[name] = def;
      if (def.type === "enum") enums.push({ id: enumId, values: type.slice(type.indexOf("(") + 1, -1).split(",") });
    }
    const statusField = Object.keys(fields).find((name) => name === "status" || name.endsWith("_status"));
    if (!statusField) {
      const enumId = `${id}#status`;
      fields.status = { type: "enum", nullable: false, enumId, defaultLiteral: "draft" };
      enums.push({ id: enumId, values: defaultStatuses });
    }
    if (!Object.hasOwn(fields, "created_at")) fields.created_at = { type: "datetime", nullable: false, timezone: "UTC instant", defaultExpression: { kind: "current-timestamp" } };
    if (!Object.hasOwn(fields, "updated_at")) fields.updated_at = { type: "datetime", nullable: false, timezone: "UTC instant", defaultExpression: { kind: "current-timestamp" } };
    if (!Object.hasOwn(fields, "created_by_user_id")) fields.created_by_user_id = { type: "uuid", nullable: true };
    const refs = [...(refSpecs[id] ?? [])];
    if (!isGlobal) refs.unshift({ field: "organisation_id", target: "organisation.organisations", nullable: false });
    if (!isGlobal) refs.push({ field: "workspace_id", target: "organisation.workspaces", nullable: false });
    if (!refs.some((ref) => ref.field === "created_by_user_id")) refs.push({ field: "created_by_user_id", target: "identity.users", nullable: true });
    const foreignKeys = [];
    const relations = [];
    for (const ref of refs) {
      const target = byId.get(ref.target);
      if (!target && !catalogTables.some((candidate) => candidate.id === ref.target)) throw new Error(`UNRESOLVED_AUTHORED_REFERENCE:${id}:${ref.target}`);
      if (!fields[ref.field]) fields[ref.field] = { type: "uuid", nullable: ref.nullable };
      const candidateContract = target ?? contracts.find((contract) => contract.id === ref.target);
      if (!candidateContract) {
        // This branch is resolved after all context contract shells are built.
        continue;
      }
      const localAndTarget = selectReferenceKey(fields, candidateContract, ref);
      const name = `fk_${safe(short(id))}_${safe(ref.field)}_${safe(ref.target)}`.slice(0, 60);
      const onDelete = ref.field === "created_by_user_id" || ref.field.endsWith("_user_id") ? (ref.nullable ? "set-null" : "restrict") : "restrict";
      foreignKeys.push({ name, fields: localAndTarget.localFields, references: ref.target, referencedFields: localAndTarget.targetFields, onDelete, onUpdate: "no-action" });
      relations.push({ name: `${ref.field}_to_${safe(ref.target)}`, from: localAndTarget.localFields, to: ref.target, toFields: localAndTarget.targetFields, cardinality: "many-to-one" });
    }
    const provenance = { kind: "MAATAA_AUTHORED", evidence: [`domain-catalog:${id}`, `context-registry:${context}`, "product-composition-registry", "schema-reset-policy:author-validate-review-canonicalize"], reviewedBy: null };
    const uniqueConstraints = [];
    if (!isGlobal) uniqueConstraints.push({ name: `${safe(short(id))}_id_organisation_uq`, fields: ["id", "organisation_id"] });
    if (!isGlobal) uniqueConstraints.push({ name: `${safe(short(id))}_id_workspace_organisation_uq`, fields: ["id", "workspace_id", "organisation_id"] });
    for (const fieldsSet of uniqueSpecs[id] ?? []) uniqueConstraints.push({ name: keyName(safe(short(id)), fieldsSet), fields: fieldsSet });
    const indexes = [];
    const indexedStatus = statusField ?? "status";
    if (!isGlobal) indexes.push({ name: `${safe(short(id))}_organisation_status_idx`, fields: ["organisation_id", indexedStatus], unique: false });
    if (!isGlobal) indexes.push({ name: `${safe(short(id))}_workspace_status_idx`, fields: ["workspace_id", indexedStatus], unique: false });
    indexes.push({ name: `${safe(short(id))}_created_idx`, fields: ["created_at"], unique: false });
    const contract = {
      schemaVersion: "1.0.0", schemaLifecycle: "DRAFT", id, context, name: table.name, version: "1.0.0",
      description: `${table.name.replace(/_/g, " ")} in the ${context} context. MAATAA-authored schema contract; see its review artifact for exact hash and decisions.`,
      fields, enums, primaryKey: ["id"], uniqueConstraints, foreignKeys, relations, indexes,
      ownership: { owner: context, steward: context, ...(isGlobal ? { scope: "PLATFORM" } : { tenantKey: "organisation_id", workspaceKey: "workspace_id" }) },
      lifecycle: { createdAt: "created_at", updatedAt: "updated_at", statusField: statusField ?? "status", retentionPolicy: `proposed:${context}-standard-retention-v1` },
      provenance: { kind: "MAATAA_AUTHORED", evidence: [`domain-catalog:${id}`, `context-registry:${context}`, "product-composition-registry"], reviewStatus: "unreviewed", reviewedBy: null },
    };
    for (const item of uniqueConstraints) item.provenance = structuredClone(provenance);
    for (const item of indexes) item.provenance = structuredClone(provenance);
    for (const item of enums) item.provenance = structuredClone(provenance);
    for (const item of foreignKeys) item.provenance = structuredClone(provenance);
    for (const item of relations) item.provenance = structuredClone(provenance);
    contract.ownership.provenance = structuredClone(provenance);
    contract.lifecycle.provenance = structuredClone(provenance);
    // Keep target fields available while building subsequent records in this context.
    contracts.push(contract);
    byId.set(id, contract);
  }
  // Rebuild references now that every same-context key and relation target is known.
  for (const contract of contracts) {
    const refs = [...(refSpecs[contract.id] ?? [])];
    if (!globalTables.has(contract.id)) refs.unshift({ field: "organisation_id", target: "organisation.organisations", nullable: false });
    if (!globalTables.has(contract.id)) refs.push({ field: "workspace_id", target: "organisation.workspaces", nullable: false });
    if (!refs.some((ref) => ref.field === "created_by_user_id")) refs.push({ field: "created_by_user_id", target: "identity.users", nullable: true });
    contract.foreignKeys = [];
    contract.relations = [];
    for (const ref of refs) {
      const target = byId.get(ref.target);
      if (!target) throw new Error(`UNRESOLVED_REFERENCE:${contract.id}:${ref.target}`);
      const { localFields, targetFields } = selectReferenceKey(contract.fields, target, ref);
      const name = `fk_${safe(short(contract.id))}_${safe(ref.field)}_${safe(ref.target)}`.slice(0, 60);
      const action = ref.field === "created_by_user_id" || ref.field.endsWith("_user_id") ? (ref.nullable ? "set-null" : "restrict") : "restrict";
      contract.foreignKeys.push({ name, fields: localFields, references: ref.target, referencedFields: targetFields, onDelete: action, onUpdate: "no-action", provenance: structuredClone(contract.provenance) });
      contract.relations.push({ name: `${ref.field}_to_${safe(ref.target)}`, from: localFields, to: ref.target, toFields: targetFields, cardinality: "many-to-one", provenance: structuredClone(contract.provenance) });
    }
  }
  return contracts;
};

function selectReferenceKey(sourceFields, target, ref) {
  const targetKeys = [target.primaryKey, ...(target.uniqueConstraints ?? []).map((item) => item.fields)].filter(Array.isArray);
  const orgKey = targetKeys.find((key) => JSON.stringify(key) === JSON.stringify(["id", "organisation_id"]));
  const workspaceKey = targetKeys.find((key) => JSON.stringify(key) === JSON.stringify(["id", "workspace_id", "organisation_id"]));
  if (ref.field === "organisation_id") return { localFields: ["organisation_id"], targetFields: ["id"] };
  if (ref.field === "workspace_id") return { localFields: ["workspace_id", "organisation_id"], targetFields: ["id", "organisation_id"] };
  if (workspaceKey && Object.hasOwn(sourceFields, "workspace_id") && Object.hasOwn(sourceFields, "organisation_id") && Object.hasOwn(target.fields, "workspace_id")) {
    return { localFields: [ref.field, "workspace_id", "organisation_id"], targetFields: workspaceKey };
  }
  if (orgKey && Object.hasOwn(sourceFields, "organisation_id") && Object.hasOwn(target.fields, "organisation_id")) {
    return { localFields: [ref.field, "organisation_id"], targetFields: orgKey };
  }
  return { localFields: [ref.field], targetFields: ["id"] };
}

async function validatePreview(logical, context, outputDir, { lifecycle = "DRAFT", suffix = lifecycle.toLowerCase() } = {}) {
  const results = {};
  await mkdir(outputDir, { recursive: true });
  for (const provider of ["postgresql", "sqlite"]) {
    const generated = generatePrismaPreview(logical, { targetProvider: provider });
    if (generated.status !== "GENERATED_UNVALIDATED") throw new Error(`PRISMA_GENERATION_FAILED:${context}:${provider}:${generated.blockers?.join(";")}`);
    const schemaFile = path.join(outputDir, `prisma-preview.${provider}.${suffix}.prisma`);
    const metadataFile = path.join(outputDir, `prisma-preview.${provider}.${suffix}.metadata.json`);
    await writeFile(schemaFile, generated.schema);
    const configFile = provider === "postgresql" ? "prisma.config.postgresql.ts" : "prisma.config.sqlite.ts";
    const cli = path.resolve(root, "../../node_modules/.bin/prisma");
    const run = spawnSync(cli, ["validate", "--config", configFile, "--schema", path.relative(root, schemaFile)], { cwd: root, encoding: "utf8" });
    const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`.trim();
    if (run.status !== 0) throw new Error(`PRISMA_VALIDATE_FAILED:${context}:${provider}:${output}`);
    generated.metadata.validationStatus = "PASS";
    generated.metadata.schemaLifecycle = lifecycle;
    generated.metadata.deployable = false;
    generated.metadata.migrationExecutable = false;
    generated.metadata.migrationApproved = false;
    generated.metadata.deploymentApproved = false;
    generated.metadata.validationTool = "prisma validate";
    generated.metadata.logicalSchemaHash = logical.schemaHash;
    generated.metadata.contractSetHash = logical.contractSetHash;
    generated.metadata.validationOutput = output;
    await writeJson(metadataFile, generated.metadata);
    results[provider] = { status: "PASS", valid: true };
  }
  return results;
}

async function authorAll() {
  const contexts = await readJson(contextPath);
  const catalog = await readJson(path.join(root, "data/domain-catalog.json"));
  const canonical = JSON.parse(await readFile(dataPath, "utf8"));
  const canonicalIds = new Set(canonical.contracts.map((item) => item.id));
  const missingByContext = new Map(contextOrder.map((context) => [context, catalog.tables.filter((table) => table.context === context && !canonicalIds.has(table.id))]));
  const allMissing = [...missingByContext.values()].flat();
  const generatedAll = buildPlans(allMissing, canonical.contracts);
  if (generatedAll.length !== 192) throw new Error(`EXPECTED_192_AUTHORED_CONTRACTS:${generatedAll.length}`);
  const generatedById = new Map(generatedAll.map((contract) => [contract.id, contract]));

  for (const context of contexts.contexts.filter((item) => contextOrder.includes(item.id))) {
    const records = missingByContext.get(context.id);
    const ids = records.map((table) => table.id).sort();
    const contracts = ids.map((id) => generatedById.get(id));
    const draftContractSetHash = sha256(contracts);
    const dir = path.join(factoryRoot, context.id);
    await mkdir(dir, { recursive: true });
    await writeJson(path.join(dir, "contracts.draft.json"), {
      schemaVersion: "1.0.0", schemaLifecycle: "DRAFT", context, sourceBoundary: "MAATAA-authored design decisions using the canonical Domain Catalog, context registry, product composition registry, and existing canonical contracts.",
      contractIds: ids, contractCount: contracts.length, contractSetHash: draftContractSetHash,
      readiness: { compileTestable: false, fkClosure: "NOT_RUN", logicalPreviewValid: false, postgresqlPreviewValid: false, sqlitePreviewValid: false, schemaReady: false, migrationApproved: false, deploymentApproved: false, legalReviewed: false },
      contracts,
    });
  }
  console.log(JSON.stringify({ status: "AUTHORED_DRAFTS", total: generatedAll.length, contexts: contextOrder.map((id) => ({ id, count: missingByContext.get(id).length })) }, null, 2));
}

async function buildRegistrySource(base, canonicalRows, draftRows) {
  return { ...base, tableContracts: { ...base.tableContracts, contracts: canonicalRows }, draftContracts: draftRows };
}

async function compileAll() {
  const canonical = JSON.parse(await readFile(dataPath, "utf8"));
  const catalog = await readJson(path.join(root, "data/domain-catalog.json"));
  const contextRegistry = await readJson(contextPath);
  const runSummary = [];
  const allDraftRows = [];
  const validatedDraftRows = [];
  for (const context of contextOrder) {
    const dir = path.join(factoryRoot, context);
    const draftFile = path.join(dir, "contracts.draft.json");
    const draftPackage = await readJson(draftFile);
    const draftRows = draftPackage.contracts;
    const source = await buildRegistrySource(initialRegistry, [...canonical.contracts, ...validatedDraftRows], draftRows);
    const readiness = assessDraftCompileTestability(draftPackage.contractIds, source);
    if (readiness.status !== "DRAFT_COMPILE_TESTABLE") throw new Error(`STRUCTURE_OR_FK_CLOSURE_FAILED:${context}:${JSON.stringify(readiness.entries.filter((item) => item.errors.length))}`);
    const logical = compileDraftLogicalSchema(draftPackage.contractIds, source);
    if (logical.status !== "DRAFT_LOGICAL_SCHEMA_READY") throw new Error(`LOGICAL_COMPILE_FAILED:${context}:${JSON.stringify(logical.blockers)}`);
    const providers = await validatePreview(logical, context, dir);
    const contractSetHash = sha256(draftRows);
    const review = {
      schemaVersion: "1.0.0", reviewStatus: "PENDING_REVIEW", decision: null, reviewer: null, reviewedAt: null,
      context, contractCount: draftRows.length, contractIds: draftPackage.contractIds,
      contractSetHash,
      logicalSchemaHash: logical.schemaHash,
      closureTableIds: logical.model.tables.map((table) => table.id),
      validations: { structuralContracts: `${readiness.counts.structurallyComplete}/${readiness.counts.total} PASS`, foreignKeyClosure: "PASS", logicalModel: "PASS", postgresqlPrisma: providers.postgresql.status, sqlitePrisma: providers.sqlite.status },
      sourceBoundary: "MAATAA_AUTHORED; no external schema authority claimed.",
      approvalBasis: null,
      retainedBoundaries: { schemaReady: false, migrationApproved: false, deploymentApproved: false, legalReviewed: false },
    };
    await writeJson(path.join(dir, "contracts.review.json"), review);
    await rm(path.join(dir, "contracts.canonicalized.json"), { force: true });
    draftPackage.readiness = { compileTestable: true, fkClosure: "PASS", logicalPreviewValid: true, postgresqlPreviewValid: true, sqlitePreviewValid: true, schemaReady: false, reviewRequired: true, migrationApproved: false, deploymentApproved: false, legalReviewed: false, contractSetHash, closureTableIds: logical.model.tables.map((table) => table.id), logicalSchemaHash: logical.schemaHash };
    await writeJson(draftFile, draftPackage);
    await writeJson(path.join(dir, "logical-schema.draft.json"), logical);
    allDraftRows.push(...draftRows);
    validatedDraftRows.push(...draftRows);
    runSummary.push({ context, contracts: draftRows.length, status: "PENDING_REVIEW", contractSetHash, logicalSchemaHash: logical.schemaHash, closureTables: logical.model.tables.length, providers });
    console.log(JSON.stringify(runSummary.at(-1)));
  }
  if (canonical.contracts.length + allDraftRows.length !== 352) throw new Error(`GLOBAL_CONTRACT_COUNT_MISMATCH:${canonical.contracts.length + allDraftRows.length}`);
  const allIds = catalog.tables.map((table) => table.id).sort();
  const finalSource = { ...initialRegistry, tableContracts: { ...canonical, contracts: canonical.contracts }, draftContracts: allDraftRows };
  const globalCoverage = assessDraftCompileTestability(allIds, finalSource);
  if (globalCoverage.status !== "DRAFT_COMPILE_TESTABLE") throw new Error(`GLOBAL_CLOSURE_FAILED:${JSON.stringify(globalCoverage.entries.filter((item) => item.errors.length))}`);
  const globalLogical = compileDraftLogicalSchema(allIds, finalSource);
  if (globalLogical.status !== "DRAFT_LOGICAL_SCHEMA_READY") throw new Error(`GLOBAL_DRAFT_COMPILE_FAILED:${JSON.stringify(globalLogical.blockers)}`);
  const globalDir = path.join(factoryRoot, "global");
  const globalProviders = await validatePreview(globalLogical, "global-352", globalDir);
  await rm(path.join(globalDir, "logical-schema.canonical.json"), { force: true });
  await writeJson(path.join(globalDir, "logical-schema.draft.json"), globalLogical);
  await writeJson(path.join(globalDir, "readiness.json"), {
    schemaLifecycle: "DRAFT", tableCount: allIds.length, canonicalContractCount: canonical.contracts.length, draftContractCount: allDraftRows.length,
    contractSetHash: sha256([...canonical.contracts, ...allDraftRows]), logicalSchemaHash: globalLogical.schemaHash,
    status: "DRAFT_PREVIEW_VALID_PENDING_REVIEW", fkClosure: "PASS", providers: globalProviders,
    schemaReady: false, reviewRequired: true, migrationApproved: false, deploymentApproved: false, legalReviewed: false,
  });
  console.log(JSON.stringify({ status: "GLOBAL_DRAFT_PREVIEW_VALID_PENDING_REVIEW", tableCount: allIds.length, canonicalContractCount: canonical.contracts.length, draftContractCount: allDraftRows.length, contractSetHash: sha256([...canonical.contracts, ...allDraftRows]), logicalSchemaHash: globalLogical.schemaHash, providers: globalProviders, contexts: runSummary }, null, 2));
}

async function canonicalizeAll() {
  const reviewer = process.argv[3];
  if (!reviewer) throw new Error("REVIEWER_REQUIRED: pass the designated reviewer after canonicalize");
  const canonical = await readJson(dataPath);
  const catalog = await readJson(path.join(root, "data/domain-catalog.json"));
  const allIds = catalog.tables.map((table) => table.id).sort();
  const additions = [];
  const prepared = [];
  const reviewedAt = new Date().toISOString();

  for (const context of contextOrder) {
    const dir = path.join(factoryRoot, context);
    const draftPackage = await readJson(path.join(dir, "contracts.draft.json"));
    const draftRows = draftPackage.contracts;
    const draftHash = sha256(draftRows);
    const review = await readJson(path.join(dir, "contracts.review.json"));
    if (review.reviewStatus !== "PENDING_REVIEW" || review.contractSetHash !== draftHash) throw new Error(`REVIEW_HASH_OR_STATE_MISMATCH:${context}`);

    const approvedRows = structuredClone(draftRows).map((contract) => {
      contract.schemaLifecycle = "CANONICAL";
      const stamp = (value) => {
        if (Array.isArray(value)) return value.forEach(stamp);
        if (!value || typeof value !== "object") return;
        if (value.kind === "MAATAA_AUTHORED") { value.reviewedBy = reviewer; value.reviewedAt = reviewedAt; }
        if (value.reviewStatus === "unreviewed") { value.reviewStatus = "approved"; value.reviewedBy = reviewer; value.reviewedAt = reviewedAt; }
        Object.values(value).forEach(stamp);
      };
      stamp(contract);
      return contract;
    });
    additions.push(...approvedRows);
    prepared.push({ context, dir, draftPackage, draftRows, draftHash, approvedRows, review });
  }

  const finalContracts = [...canonical.contracts, ...additions];
  const ids = finalContracts.map((contract) => contract.id);
  if (finalContracts.length !== 352 || new Set(ids).size !== 352 || JSON.stringify([...ids].sort()) !== JSON.stringify(allIds)) {
    throw new Error(`CANONICAL_ID_INTEGRITY_FAILED:${finalContracts.length}:${new Set(ids).size}`);
  }
  const finalRegistry = { ...canonical, status: "canonical-approved", contracts: finalContracts };
  const finalSource = { ...initialRegistry, tableContracts: finalRegistry };
  const readiness = assessDraftCompileTestability(allIds, finalSource);
  if (readiness.status !== "DRAFT_COMPILE_TESTABLE") throw new Error(`GLOBAL_STRUCTURE_OR_FK_CLOSURE_FAILED:${JSON.stringify(readiness.entries.filter((item) => item.errors.length))}`);
  const globalLogical = compileLogicalSchema(allIds, finalSource);
  if (globalLogical.status !== "LOGICAL_SCHEMA_READY") throw new Error(`GLOBAL_LOGICAL_SCHEMA_FAILED:${JSON.stringify(globalLogical.blockers)}`);

  const globalDir = path.join(factoryRoot, "global");
  const globalProviders = await validatePreview(globalLogical, "global-352", globalDir, { lifecycle: "CANONICAL", suffix: "canonical" });
  if (!globalProviders.postgresql.valid || !globalProviders.sqlite.valid) throw new Error("GLOBAL_PROVIDER_PREVIEW_FAILED");
  const contextOutputs = [];
  for (const item of prepared) {
    const logical = compileLogicalSchema(item.draftPackage.contractIds, finalSource);
    if (logical.status !== "LOGICAL_SCHEMA_READY") throw new Error(`CANONICAL_CONTEXT_LOGICAL_SCHEMA_FAILED:${item.context}`);
    const providers = await validatePreview(logical, item.context, item.dir, { lifecycle: "CANONICAL", suffix: "canonical" });
    if (!providers.postgresql.valid || !providers.sqlite.valid) throw new Error(`CANONICAL_CONTEXT_PROVIDER_PREVIEW_FAILED:${item.context}`);
    contextOutputs.push({ logical, providers });
  }

  for (const [index, item] of prepared.entries()) {
    const { context, dir, draftPackage, draftRows, draftHash, approvedRows, review } = item;
    const contractSetHash = sha256(approvedRows);
    const output = contextOutputs[index];
    const reviewed = {
      ...review, reviewStatus: "REVIEWED", decision: "APPROVE", reviewer, reviewedAt,
      draftContractSetHash: draftHash, contractSetHash,
      logicalSchemaHash: output.logical.schemaHash,
      validations: { ...review.validations, structuralContracts: `${draftRows.length}/${draftRows.length} PASS`, foreignKeyClosure: "PASS", logicalModel: "PASS", postgresqlPrisma: output.providers.postgresql.status, sqlitePrisma: output.providers.sqlite.status },
      approvalBasis: "Explicit user instruction to close the global schema gate, bound to the exact DRAFT contract-set hash; reviewer identity follows the previously designated reviewer.",
      retainedBoundaries: { schemaReady: true, migrationApproved: false, deploymentApproved: false, legalReviewed: false },
    };
    await writeJson(path.join(dir, "contracts.review.json"), reviewed);
    await writeJson(path.join(dir, "contracts.canonicalized.json"), { schemaLifecycle: "CANONICAL", context, draftContractSetHash: draftHash, contractSetHash, contracts: approvedRows });
    draftPackage.readiness = { ...draftPackage.readiness, schemaReady: true, reviewRequired: false, reviewedBy: reviewer, reviewedAt, draftContractSetHash: draftHash, contractSetHash };
    await writeJson(path.join(dir, "contracts.draft.json"), draftPackage);
    await writeJson(path.join(dir, "logical-schema.canonical.json"), output.logical);
    await rm(path.join(dir, "logical-schema.draft.json"), { force: true });
  }

  await writeJson(dataPath, finalRegistry);
  await writeJson(path.join(globalDir, "logical-schema.canonical.json"), globalLogical);
  await rm(path.join(globalDir, "logical-schema.draft.json"), { force: true });
  await writeJson(path.join(globalDir, "readiness.json"), {
    schemaLifecycle: "CANONICAL", status: "SCHEMA_READY", tableCount: 352, canonicalContractCount: 352, draftContractCount: 0,
    contractSetHash: sha256(finalContracts), logicalSchemaHash: globalLogical.schemaHash, duplicateIdCount: 0,
    fkClosure: "PASS", relationClosure: "PASS", providers: globalProviders,
    schemaReady: true, migrationApproved: false, deploymentApproved: false, legalReviewed: false,
  });
  console.log(JSON.stringify({ status: "GLOBAL_SCHEMA_READY", tableCount: 352, canonicalContractCount: 352, duplicateIdCount: 0, contractSetHash: sha256(finalContracts), logicalSchemaHash: globalLogical.schemaHash, fkClosure: "PASS", relationClosure: "PASS", providers: globalProviders }, null, 2));
}

const command = process.argv[2] ?? "author";
if (command === "author") await authorAll();
else if (command === "compile") await compileAll();
else if (command === "canonicalize") await canonicalizeAll();
else if (command === "validate") {
  const context = process.argv[3];
  if (!context || !contextOrder.includes(context)) throw new Error(`UNKNOWN_CONTEXT:${context}`);
  const packageDraft = await readJson(path.join(factoryRoot, context, "contracts.draft.json"));
  const canonical = await readJson(dataPath);
  const source = { ...initialRegistry, tableContracts: { ...initialRegistry.tableContracts, contracts: canonical.contracts }, draftContracts: packageDraft.contracts };
  const result = assessDraftCompileTestability(packageDraft.contractIds, source);
  const logical = compileDraftLogicalSchema(packageDraft.contractIds, source);
  console.log(JSON.stringify({ context, readiness: result.status, logical: logical.status, structurallyComplete: result.counts.structurallyComplete, total: result.counts.total, closure: logical.model?.tables.length, findings: result.entries.filter((entry) => entry.errors.length) }, null, 2));
  if (result.status !== "DRAFT_COMPILE_TESTABLE" || logical.status !== "DRAFT_LOGICAL_SCHEMA_READY") process.exitCode = 1;
} else throw new Error(`UNKNOWN_COMMAND:${command}`);
