import { escapeHtml, icon, panel, tag } from "../shared.mjs";

let libraryPromise;
let library;
let records = [];
let categories = [];
let roles = [];

async function loadLibrary() {
  if (!libraryPromise) {
    libraryPromise = fetch(`${import.meta.env.BASE_URL}data/tlps-knowledge-library.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Knowledge catalog request failed (${response.status}).`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.useCases) || !Array.isArray(data.flows)) throw new Error("Knowledge catalog format is invalid.");
        library = data;
        records = [
          ...library.useCases.map((record) => ({ ...record, recordType: "usecase" })),
          ...library.flows.map((record) => ({ ...record, recordType: "flow" })),
        ];
        categories = [...new Set(records.map((record) => record.category))].sort();
        roles = [...new Set(records.flatMap((record) => (record.actors ?? []).map((actor) => typeof actor === "string" ? actor : actor.roleId).filter(Boolean)))].sort();
        return data;
      })
      .catch(() => { libraryPromise = null; return null; });
  }
  return libraryPromise;
}

function actorNames(record) {
  return (record.actors ?? []).map((actor) => typeof actor === "string" ? actor : actor.label ?? actor.roleId).filter(Boolean);
}

function routeValues(record) {
  const values = record.recordType === "flow"
    ? (record.steps ?? []).map((step) => step.route).filter(Boolean)
    : (record.workflow ?? []).map((step) => step.route).filter(Boolean);
  const listed = (record.routes ?? []).map((route) => typeof route === "string" ? route : route.route).filter(Boolean);
  return [...new Set([...values, ...listed])];
}

function selectedRoute(record) {
  return routeValues(record)[0] ?? "";
}

function selectedRole(record) {
  const actor = record.actors?.[0];
  return typeof actor === "string" ? actor : actor?.roleId ?? "";
}

function textList(items) {
  return (items ?? []).map((item) => typeof item === "string" ? item : item?.action ?? item?.name ?? JSON.stringify(item));
}

function stepsFor(record) {
  return record.recordType === "flow" ? (record.steps ?? []) : (record.workflow ?? []);
}

function renderSteps(record) {
  const steps = stepsFor(record);
  if (!steps.length) return "";
  const rows = steps.map((step, index) => {
    const title = step.action ?? step.screen ?? `Step ${index + 1}`;
    const route = step.route ? `<code>${escapeHtml(step.route)}</code>` : "";
    const outcome = step.expectedState ? `<p>${escapeHtml(step.expectedState)}</p>` : "";
    return `<li><strong>${escapeHtml(title)}</strong>${route}${outcome}</li>`;
  }).join("");
  return `<section class="knowledge-detail-section"><h4>Steps (${steps.length})</h4><ol class="knowledge-steps">${rows}</ol></section>`;
}

function renderHandoffs(record) {
  const handoffs = record.handoffs ?? [];
  if (!handoffs.length) return "";
  const rows = handoffs.map((handoff) => {
    const from = handoff.from?.screenId ?? handoff.from?.route ?? "Start";
    const to = handoff.to?.screenId ?? handoff.to?.route ?? "Next step";
    return `<li><strong>${escapeHtml(from)} → ${escapeHtml(to)}</strong><p>${escapeHtml(handoff.handoff ?? "Continue with the same active context.")}</p></li>`;
  }).join("");
  return `<section class="knowledge-detail-section"><h4>Workflow handoffs</h4><ul>${rows}</ul></section>`;
}

function renderHelpAndSupport(record) {
  const help = record.help ?? {};
  const support = record.support ?? {};
  const quickStart = textList(help.quickStart);
  const diagnosticChecklist = textList(support.diagnosticChecklist);
  const issues = support.commonIssues ?? [];
  const faqs = help.faq ?? [];
  const parts = [];
  if (quickStart.length) parts.push(`<section class="knowledge-detail-section"><h4>Quick start</h4><ul>${quickStart.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`);
  if (diagnosticChecklist.length) parts.push(`<section class="knowledge-detail-section"><h4>Support checks</h4><ul>${diagnosticChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`);
  if (issues.length) parts.push(`<section class="knowledge-detail-section"><h4>Common issues</h4><ul>${issues.map((item) => `<li><strong>${escapeHtml(item.issue ?? "Issue")}</strong><p>${escapeHtml(item.check ?? "")}</p><p>${escapeHtml(item.resolution ?? "")}</p></li>`).join("")}</ul></section>`);
  if (faqs.length) parts.push(`<section class="knowledge-detail-section"><h4>Questions</h4>${faqs.map((item) => `<details class="knowledge-faq"><summary>${escapeHtml(item.question ?? "Question")}</summary><p>${escapeHtml(item.answer ?? "")}</p></details>`).join("")}</section>`);
  return parts.join("");
}

function renderRecord(record) {
  const key = [record.id, record.title, record.category, record.objective, record.products, record.families, actorNames(record), routeValues(record), record.knownLimitations].flat().join(" ").toLowerCase();
  const routes = routeValues(record);
  const rolesForRecord = actorNames(record);
  const success = textList(record.successCriteria ?? record.expectedOutputs);
  const limitations = textList(record.knownLimitations);
  const objective = record.objective ?? record.userStory ?? "Source-defined workflow guide.";
  return `<details class="knowledge-record" data-knowledge-record data-kind="${record.recordType}" data-category="${escapeHtml(record.category)}" data-search-index="${escapeHtml(key)}">
    <summary><span class="knowledge-record-heading"><span class="knowledge-record-id">${escapeHtml(record.id)}</span><strong>${escapeHtml(record.title)}</strong><small>${escapeHtml(record.category)} · ${stepsFor(record).length} steps · ${routes.length} routes</small></span><span class="knowledge-record-tags">${tag(record.recordType === "flow" ? "FLOW" : "USE CASE", record.recordType === "flow" ? "blue" : "sage")}</span></summary>
    <div class="knowledge-record-body">
      <p class="knowledge-objective">${escapeHtml(objective)}</p>
      ${record.trigger ? `<p><strong>When it starts:</strong> ${escapeHtml(record.trigger)}</p>` : ""}
      ${rolesForRecord.length ? `<p><strong>Roles:</strong> ${rolesForRecord.map(escapeHtml).join(", ")}</p>` : ""}
      ${record.products?.length ? `<p><strong>Products:</strong> ${record.products.map(escapeHtml).join(", ")}</p>` : ""}
      ${renderSteps(record)}
      ${renderHandoffs(record)}
      ${success.length ? `<section class="knowledge-detail-section"><h4>Expected result</h4><ul>${success.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : ""}
      ${routes.length ? `<section class="knowledge-detail-section"><h4>Referenced routes</h4><div class="knowledge-route-list">${routes.slice(0, 12).map((route) => `<code>${escapeHtml(route)}</code>`).join("")}${routes.length > 12 ? `<span>and ${routes.length - 12} more</span>` : ""}</div></section>` : ""}
      ${renderHelpAndSupport(record)}
      ${limitations.length ? `<section class="knowledge-detail-section"><h4>Known limitations</h4><ul>${limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : ""}
      <button type="button" class="button button-secondary knowledge-support-link" data-action="support-this-record" data-record-id="${escapeHtml(record.id)}" data-record-kind="${record.recordType}" data-initial-route="${escapeHtml(selectedRoute(record))}" data-screen-id="${escapeHtml(stepsFor(record)[0]?.screenId ?? stepsFor(record)[0]?.surfaceId ?? "")}" data-role="${escapeHtml(selectedRole(record))}">Report an issue with this guide</button>
    </div>
  </details>`;
}

export async function renderKnowledgeExplorer(surface) {
  const data = await loadLibrary();
  if (!data) return `<section class="knowledge-load-error" role="alert"><strong>Guide library unavailable</strong><p>The local catalog could not be loaded. Check that the preview serves its data files, then retry.</p><button type="button" class="button button-secondary" data-action="retry-knowledge">Retry</button></section>`;
  const intro = surface === "academy"
    ? "Learn from source-derived TLPS scenarios. Open a guide to review its goal, steps, and expected result."
    : "Search the TLPS use cases and flow guides. Each entry includes its route context and known demo limitations.";
  const coverage = library.coverage;
  return `<section class="knowledge-library" data-knowledge-library aria-labelledby="knowledge-library-title">
    <header class="knowledge-library-header"><div><h2 id="knowledge-library-title">${surface === "academy" ? "TLPS learning library" : "TLPS use cases & flow guides"}</h2><p>${escapeHtml(intro)}</p></div><div class="knowledge-library-counts"><strong>${library.useCases.length + library.flows.length}</strong><span>guides</span><small>${library.useCases.length} use cases · ${library.flows.length} flows</small></div></header>
    <div class="knowledge-source-note" role="note">${icon("circle-help", 16)} <span>Source-derived demo guides. The source marks these flows as demo-shell content; they do not establish production behavior or server-side authorization.</span></div>
    <div class="knowledge-filter-row"><label>Search<input type="search" data-knowledge-search placeholder="Title, route, product, role…" aria-label="Search TLPS guides"/></label><label>Content<select data-knowledge-kind aria-label="Filter by content type"><option value="all">All guides</option><option value="usecase">Use cases</option><option value="flow">Flows</option></select></label><label>Category<select data-knowledge-category aria-label="Filter by category"><option value="all">All categories</option>${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}</select></label><span class="knowledge-result-count" data-knowledge-count aria-live="polite">${records.length} guides</span></div>
    <div class="knowledge-record-list">${records.map(renderRecord).join("")}</div>
    <p class="knowledge-empty" data-knowledge-empty hidden>No guides match these filters. Try a different title, route, role, or category.</p>
    <details class="knowledge-integrity"><summary>Catalog coverage and source limits</summary><p>Manifest routes: ${coverage.manifestRoutes} · Use-case index routes: ${coverage.useCaseIndexedRoutes} · Flow index routes: ${coverage.flowIndexedRoutes}. Route coverage needs reconciliation before this catalog can be treated as a complete route map.</p><p>${coverage.missingProductionSurfaces.length} production surfaces are listed as missing in the source audit.</p></details>
  </section>`;
}

function ticketRows(tickets) {
  if (!tickets.length) return `<p class="support-empty">No local support requests yet. Submitted requests stay in this browser and are not sent to a support team.</p>`;
  return `<div class="support-request-list">${tickets.slice(0, 8).map((ticket) => `<article class="support-request"><div><strong>${escapeHtml(ticket.id)}</strong>${tag(ticket.severity, ticket.severity === "High" ? "clay" : "sand")}</div><p>${escapeHtml(ticket.recordTitle)} · ${escapeHtml(ticket.route || "Route not supplied")}</p><small>${escapeHtml(ticket.createdAt)} · ${escapeHtml(ticket.status)}</small></article>`).join("")}</div>`;
}

export async function renderSupport(state) {
  const data = await loadLibrary();
  if (!data) return `<section class="knowledge-load-error" role="alert"><strong>Support guide catalog unavailable</strong><p>The local guide file could not be loaded, so a request cannot be linked to a verified use case or flow.</p><button type="button" class="button button-secondary" data-action="retry-knowledge">Retry</button></section>`;
  const draft = state.supportDraft;
  const optionsFor = (items, kind) => items.map((record) => {
    const firstStep = (record.steps ?? record.workflow ?? [])[0];
    const screenId = firstStep?.screenId ?? firstStep?.surfaceId ?? "";
    return `<option value="${escapeHtml(record.id)}" data-kind="${kind}" data-route="${escapeHtml(selectedRoute(record))}" data-role="${escapeHtml(selectedRole(record))}" data-screen-id="${escapeHtml(screenId)}" data-title="${escapeHtml(record.title)}"${draft?.recordId === record.id ? " selected" : ""}>${escapeHtml(`${record.id} · ${record.title}`)}</option>`;
  }).join("");
  const roleOptions = roles.map((role) => `<option value="${escapeHtml(role)}"${draft?.roleId === role ? " selected" : ""}>${escapeHtml(role)}</option>`).join("");
  const count = state.supportTickets?.length ?? 0;
  return `<div class="support-page">
    <header class="support-intro"><div><h2>Make a useful support request</h2><p>Link the issue to the TLPS guide, route, and role you were using. Requests are saved to this browser preview only.</p></div><a class="button button-secondary" data-route="help" href="#help">Open Help Center ${icon("arrow", 15)}</a></header>
    <div class="support-layout"><section class="panel support-form-panel"><header class="panel-head"><h2>Issue details</h2><span class="muted">${count} local request${count === 1 ? "" : "s"}</span></header>
      <form class="support-form" data-form="support-ticket">
        <label>Use case or flow<select name="recordId" required data-support-record><option value="">Choose a guide</option><optgroup label="Use cases">${optionsFor(library.useCases, "usecase")}</optgroup><optgroup label="Flows">${optionsFor(library.flows, "flow")}</optgroup></select></label>
        <label>Role<select name="roleId" required><option value="">Choose a role</option>${roleOptions}</select></label>
        <div class="support-form-row"><label>Route<input name="route" type="text" value="${escapeHtml(draft?.route ?? "")}" placeholder="Filled from the selected guide when available" required /></label><label>Screen ID<input name="screenId" type="text" value="${escapeHtml(draft?.screenId ?? "")}" placeholder="Filled from the selected guide" readonly /></label></div>
        <label>Context<input name="context" type="text" placeholder="Project, workspace, organisation, or relevant record"/></label>
        <label>Expected state<textarea name="expectedState" rows="3" required placeholder="What did you expect to happen?"></textarea></label>
        <label>Actual state<textarea name="actualState" rows="3" required placeholder="What happened instead?"></textarea></label>
        <label>Steps to reproduce<textarea name="stepsToReproduce" rows="4" required placeholder="1. Open…  2. Choose…  3. Observe…"></textarea></label>
        <label>Evidence reference<input name="evidenceReference" type="text" placeholder="Optional filename or evidence reference"/></label>
        <div class="support-form-row"><label>Severity<select name="severity"><option>Low</option><option selected>Medium</option><option>High</option></select></label><label>Browser / device<input name="browserDevice" type="text" placeholder="Optional"/></label></div>
        <button class="button button-primary" type="submit">Save request locally ${icon("arrow", 15)}</button>
      </form>
    </section><aside class="support-side">${panel("Recent local requests", ticketRows(state.supportTickets ?? []), `<span class="muted">Not transmitted</span>`)}${panel("Before you send", `<ul class="support-checklist"><li>Include the route and selected role.</li><li>Describe expected and actual states.</li><li>Use numbered reproduction steps.</li><li>Attach evidence through your connected support service when available.</li></ul><p class="muted">This preview has no ticketing service, authentication, or server-side authorization connected.</p>`)}</aside></div>
    <p class="support-guide-hint">Need more context? <a data-route="help" href="#help">Search all use cases and flow steps in Help Center.</a></p>
  </div>`;
}
