import { contentLayouts } from "./config.mjs";
import { activeApplicationId, managedApplications, normalizeApplicationDraft, resolveApplicationRoute, validateApplicationRegistry, workspaceRoutes } from "./app-registry.mjs";
import { capabilityRegistry as infrastructureCapabilities, infrastructureRegistry, migrateServerAssignments, validateInfrastructureRegistry } from "./infrastructure-registry.mjs";
import { actionButton, avatar, escapeHtml, icon, tag } from "./shared.mjs";

const allScreens = workspaceRoutes;
const infrastructureRegistryCapabilities = new Set(infrastructureCapabilities);
let dataStudioRegistrySearchPromise;
let dataStudioCompositionPromise;

const stored = (() => {
  try { return JSON.parse(localStorage.getItem("maataa-admin-preferences") ?? "{}"); } catch { return {}; }
})();
const state = {
  screen: "overview",
  nav: ["left", "right", "horizontal", "folded"].includes(stored.nav) ? stored.nav : "left",
  toolbar: ["above", "below"].includes(stored.toolbar) ? stored.toolbar : "above",
  footer: ["above", "below"].includes(stored.footer) ? stored.footer : "below",
  contentLayout: contentLayouts.some(([id]) => id === stored.contentLayout) ? stored.contentLayout : "balanced",
  theme: ["light", "dark"].includes(stored.theme) ? stored.theme : "light",
  accent: /^#[\da-f]{6}$/i.test(stored.accent) ? stored.accent : "#8b6f47",
  language: ["en", "hi", "ar"].includes(stored.language) ? stored.language : "en",
  folded: stored.folded ?? false,
  settingsOpen: false,
  search: "",
  toast: null,
  conversation: "maya",
  taskFilter: "all",
  monthOffset: 0,
  selectedNote: "n1",
  session: null,
  tasks: [
    { id: "t1", title: "Review the launch checklist", project: "Product refresh", due: "Today", priority: "High", owner: "Maya Chen", done: false },
    { id: "t2", title: "Share sprint notes with the team", project: "Operations handbook", due: "Today", priority: "Medium", owner: "Leo Park", done: false },
    { id: "t3", title: "Approve updated onboarding copy", project: "Learning launch", due: "Tomorrow", priority: "High", owner: "Ari Bell", done: false },
    { id: "t4", title: "Archive the previous research draft", project: "Product refresh", due: "Oct 8", priority: "Low", owner: "Sam Rivera", done: true },
  ],
  lanes: [
    { label: "To do", items: [{ id: "c1", title: "Confirm launch checklist", description: "Align the final steps with each team lead.", code: "PR-24", due: "Oct 09", owner: "Maya Chen", type: "Planning", tone: "clay" }, { id: "c2", title: "Review course outline", description: "Share comments on the first learning path.", code: "AC-11", due: "Oct 11", owner: "Ari Bell", type: "Content", tone: "sage" }] },
    { label: "In progress", items: [{ id: "c3", title: "Update project handoff", description: "Make ownership clear for the next sprint.", code: "OP-08", due: "Oct 10", owner: "Leo Park", type: "Operations", tone: "blue" }, { id: "c4", title: "Prepare team workshop", description: "Gather examples and a short discussion guide.", code: "PE-05", due: "Oct 12", owner: "Sam Rivera", type: "Workshop", tone: "gold" }] },
    { label: "Review", items: [{ id: "c5", title: "Accessibility review", description: "Check keyboard paths and reading order.", code: "PR-19", due: "Oct 08", owner: "Maya Chen", type: "Quality", tone: "sand" }, { id: "c6", title: "Publish weekly summary", description: "Confirm the notes are ready to share.", code: "OP-12", due: "Oct 09", owner: "Ari Bell", type: "Update", tone: "sage" }] },
  ],
  orders: [
    { id: "#1042", customer: "Northstar Collective", date: "Oct 02, 2026", amount: 248, status: "Paid" }, { id: "#1041", customer: "Fieldwork Studio", date: "Oct 01, 2026", amount: 124, status: "Paid" }, { id: "#1040", customer: "Good Day Press", date: "Sep 30, 2026", amount: 88, status: "Pending" }, { id: "#1039", customer: "The Workshop Co.", date: "Sep 29, 2026", amount: 340, status: "Paid" },
  ],
  products: [
    { id: "p1", name: "Quarterly planning kit", amount: 38, status: "Published" }, { id: "p2", name: "Workshop field guide", amount: 22, status: "Published" }, { id: "p3", name: "Team facilitation cards", amount: 16, status: "Draft" },
  ],
  projects: [["Product refresh", "Design", 72, "clay", "Oct 18", "8 tasks"], ["Operations handbook", "People", 46, "sage", "Oct 25", "14 tasks"], ["Learning launch", "Academy", 31, "blue", "Nov 02", "11 tasks"], ["Partner portal", "Engineering", 88, "gold", "Oct 08", "3 tasks"]],
  contacts: [["Maya Chen", "maya@example.test", "Product", "Online", "clay"], ["Leo Park", "leo@example.test", "Engineering", "Away", "blue"], ["Ari Bell", "ari@example.test", "Design", "Online", "sage"], ["Sam Rivera", "sam@example.test", "Operations", "Offline", "gold"], ["Nia Patel", "nia@example.test", "Finance", "Online", "sand"]],
  files: [
    { name: "Product refresh brief.pdf", owner: "Maya Chen", modified: "Today, 9:40 AM", size: "2.4 MB", kind: "pdf" }, { name: "Sprint 14 notes.docx", owner: "Leo Park", modified: "Yesterday", size: "840 KB", kind: "doc" }, { name: "Workshop assets.zip", owner: "Ari Bell", modified: "Sep 30, 2026", size: "18.2 MB", kind: "zip" }, { name: "Team handbook.pdf", owner: "Sam Rivera", modified: "Sep 28, 2026", size: "4.8 MB", kind: "pdf" },
  ],
  notes: [
    { id: "n1", title: "Monday planning", body: "Bring the team’s open questions into the project review.\n\nOwners: Maya — timing, Leo — dependencies, Ari — content.", updated: "Today" }, { id: "n2", title: "Workshop ideas", body: "Short activities\n• Map the handoff\n• Find the missing context\n• Agree on next steps", updated: "Yesterday" }, { id: "n3", title: "Reading list", body: "Accessibility checklist\nSprint planning guide\nCustomer interview notes", updated: "Sep 29" },
  ],
  notifications: [
    { id: "b1", name: "Leo Park", message: "mentioned you in Project refresh", when: "12 minutes ago", project: "Project Dashboard", read: false, tone: "blue" }, { id: "b2", name: "Ari Bell", message: "shared a new design review", when: "1 hour ago", project: "Product refresh", read: false, tone: "sage" }, { id: "b3", name: "Sam Rivera", message: "completed the onboarding checklist", when: "3 hours ago", project: "Operations handbook", read: false, tone: "gold" }, { id: "b4", name: "Maya Chen", message: "added a note to the sprint plan", when: "Yesterday", project: "Planning", read: true, tone: "clay" },
  ],
  supportTickets: [],
  supportDraft: null,
  dataStudioCatalogView: "domains",
  dataStudioContract: "domain-record.schema.json",
  dataStudioIrDraft: (() => { try { return localStorage.getItem("maataa-data-studio-ir-draft") ?? null; } catch { return null; } })(),
  dataStudioIrSaved: false,
  dataStudioIntent: "Casting pipeline for a film production company",
  dataStudioProductTags: "film",
  dataStudioFlowIds: "TLPS-FLOW-027\nTLPS-FLOW-028\nTLPS-FLOW-029\nTLPS-FLOW-030\nTLPS-FLOW-031",
  dataStudioSharedServices: "",
  dataStudioIncludePublic: false,
  dataStudioAllowPlanned: true,
  dataStudioPreviewView: "schema",
  platformTab: "apps",
  platformForm: null,
  platformEditingId: null,
  applications: managedApplications.map((item) => JSON.parse(JSON.stringify(item))),
  servers: infrastructureRegistry.servers,
};

function readPreviewList(key, fallback, isValid) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? value.filter(isValid) : fallback;
  } catch { return fallback; }
}

function persistPreviewList(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { showToast("Browser storage is unavailable; this change lasts for this session.", "error"); }
}

state.tasks = readPreviewList("maataa-admin-tasks", state.tasks, (item) => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.done === "boolean");
state.notes = readPreviewList("maataa-admin-notes", state.notes, (item) => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.body === "string");
state.supportTickets = readPreviewList("maataa-admin-support-requests", state.supportTickets, (item) => item && typeof item.id === "string" && typeof item.recordId === "string" && typeof item.actualState === "string");
const legacyPlatformDraft = (() => { try { return JSON.parse(localStorage.getItem("maataa-admin-platform-config") ?? "null"); } catch { return null; } })();
const readRegistryDraft = (key, legacyKey, fallback) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null");
    if (Array.isArray(saved)) return saved;
  } catch { /* fall back to the prior combined local draft */ }
  return Array.isArray(legacyPlatformDraft?.[legacyKey]) ? legacyPlatformDraft[legacyKey] : fallback;
};
state.applications = readRegistryDraft("maataa-admin-application-registry", "apps", state.applications)
  .filter((item) => item && typeof item.id === "string" && typeof item.name === "string" && Array.isArray(item.domains))
  .map(normalizeApplicationDraft);
state.servers = readRegistryDraft("maataa-admin-infrastructure-registry", "servers", state.servers)
  .filter((item) => item && typeof item.id === "string" && typeof item.name === "string" && typeof item.host === "string" && Array.isArray(item.capabilities))
  .map((item) => migrateServerAssignments(item, state.applications));
const persistApplicationRegistry = () => {
  try { validateApplicationRegistry(state.applications); localStorage.setItem("maataa-admin-application-registry", JSON.stringify(state.applications)); }
  catch (error) { showToast(error instanceof Error ? error.message : "Application registry is invalid.", "error"); }
};
const persistInfrastructureRegistry = () => {
  try { validateInfrastructureRegistry({ servers: state.servers }, state.applications); localStorage.setItem("maataa-admin-infrastructure-registry", JSON.stringify(state.servers)); }
  catch (error) { showToast(error instanceof Error ? error.message : "Infrastructure registry is invalid.", "error"); }
};

const authAdapter = () => window.MAATAA_ADMIN_AUTH ?? null;
const permissionSet = () => {
  const permissions = window.MAATAA_ADMIN?.permissions;
  return Array.isArray(permissions) ? new Set(permissions) : null;
};
const canAccess = (item) => item.appId === activeApplicationId && (!permissionSet() || permissionSet().has(item.permission));
const prefs = () => {
  try { localStorage.setItem("maataa-admin-preferences", JSON.stringify({ nav: state.nav, toolbar: state.toolbar, footer: state.footer, contentLayout: state.contentLayout, theme: state.theme, accent: state.accent, language: state.language, folded: state.folded })); } catch { /* preference storage is optional */ }
};
const app = document.querySelector("#app");
const live = document.querySelector("#live-region");
const screenInfo = () => resolveApplicationRoute(activeApplicationId, state.screen) ?? allScreens[0];

function shell() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.style.setProperty("--accent", state.accent);
  document.documentElement.style.setProperty("--accent-soft", `${state.accent}20`);
  renderScreen();
  applyLayoutToView();
  if (state.toast) showToast(state.toast);
}

async function renderScreen() {
  const target = app.querySelector(".screen-content");
  if (!target) return;
  const info = screenInfo();
  const renderSequence = (renderScreen.sequence ?? 0) + 1;
  renderScreen.sequence = renderSequence;
  if (!canAccess(info)) {
    state.screen = "error/404";
    shell();
    return;
  }
  const group = info.template;
  const module = await import(`./screens/${group}.mjs`);
  if (renderSequence !== renderScreen.sequence || target !== app.querySelector(".screen-content")) return;
  const renderers = {
    overview: () => module.renderLaunchpad(), analytics: () => module.renderAnalytics(), projects: () => module.renderProjects(state),
    calendar: () => module.renderCalendar(state), scrumboard: () => module.renderScrumboard(state), tasks: () => module.renderTasks(state), activities: () => module.renderActivities(),
    messenger: () => module.renderMessenger(state), mailbox: () => module.renderMailbox(state), contacts: () => module.renderContacts(state), notifications: () => module.renderNotifications(state), notes: () => module.renderNotes(state),
    academy: () => module.renderAcademy(), commerce: () => module.renderCommerce(state), files: () => module.renderFiles(state), help: () => module.renderHelp(), support: () => module.renderSupportPage(state),
    profile: () => module.renderProfile(state),
    platform: () => module.renderPlatform(state),
  };
  let content = state.screen.startsWith("data-studio") ? module.renderDataStudio(state.screen, state) : renderers[state.screen]?.();
  if (state.screen.startsWith("auth/")) content = module.renderAuth(state.screen, state);
  if (["coming-soon", "maintenance", "error/404", "error/500", "invoice/compact", "invoice/modern", "pricing/modern", "pricing/simple", "pricing/single", "pricing/table", "starter"].includes(state.screen)) content = module.renderSystemPage(state.screen);
  content = await content;
  if (renderSequence !== renderScreen.sequence || target !== app.querySelector(".screen-content")) return;
  target.innerHTML = content ?? module.renderSystemPage("error/404");
  target.dataset.contentLayout = state.contentLayout;
  if (state.screen === "notes") {
    const editor = target.querySelector(".note-editor");
    if (editor) { editor.dataset.noteId = state.selectedNote; }
  }
  const globalSearch = app.querySelector("[data-global-search]");
  if (globalSearch) globalSearch.addEventListener("keydown", (event) => { if (event.key === "Enter") { state.search = event.currentTarget.value; state.settingsOpen = false; shell(); app.querySelector("[data-nav-search]")?.focus(); } });
  app.querySelectorAll("[data-search-table]").forEach((input) => input.addEventListener("input", () => { const query = input.value.toLowerCase(); target.querySelectorAll("tbody tr").forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(query); }); }));
  app.querySelector("[data-platform-filter]")?.addEventListener("input", (event) => { const query = event.currentTarget.value.toLowerCase(); target.querySelectorAll(".platform-app-row").forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(query); }); });
  app.querySelector("[data-search-help]")?.addEventListener("input", (event) => { const query = event.currentTarget.value.toLowerCase(); target.querySelectorAll(".faq-item").forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(query); }); });
}

function applyLayoutToView() {
  const target = app.querySelector(".screen-content");
  if (!target) return;
  target.classList.remove(...contentLayouts.map(([id]) => `layout-${id}`));
  target.classList.add(`layout-${state.contentLayout}`);
}

function showToast(message, tone = "ok") {
  const toast = app.querySelector("#toast");
  if (!toast) { state.toast = message; return; }
  state.toast = null;
  toast.textContent = message;
  toast.dataset.tone = tone;
  toast.classList.add("visible");
  if (live) live.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

function openDialog(kind) {
  const dialog = app.querySelector("#action-dialog");
  if (!dialog) return;
  const forms = {
    "new-task": ["Add a task", `<label>Task name<input name="title" required autofocus/></label><label>Project<input name="project" value="Product refresh" required/></label><div class="form-inline"><label>Due date<input name="due" type="date" value="2026-10-08"/></label><label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label></div>`],
    "new-card": ["Add a sprint card", `<label>Card title<input name="title" required autofocus/></label><label>Description<textarea name="description" rows="3"></textarea></label><label>Due date<input name="due" type="date"/></label>`],
    "new-project": ["Create a project", `<label>Project name<input name="title" required autofocus/></label><label>Team<input name="team" placeholder="Team name" required/></label><label>Target date<input name="due" type="date"/></label>`],
    "new-product": ["Add a sample product", `<label>Product name<input name="title" required autofocus/></label><label>Price<input name="amount" type="number" min="0" step="0.01" value="24.00" required/></label>`],
    "new-contact": ["Add a contact", `<label>Full name<input name="title" required autofocus/></label><label>Email<input name="email" type="email" required/></label><label>Team<input name="team"/></label>`],
    "new-event": ["Schedule an event", `<label>Event name<input name="title" required autofocus/></label><label>Date<input name="date" type="date" value="2026-10-09"/></label><label>Time<input name="time" type="time" value="10:00"/></label>`],
    "new-note": ["Create a note", `<label>Note title<input name="title" required autofocus/></label><label>Note<textarea name="body" rows="4" placeholder="Write a note…"></textarea></label>`],
    "compose-mail": ["Compose an email", `<label>To<input name="to" type="email" required autofocus/></label><label>Subject<input name="subject" required/></label><label>Message<textarea name="body" rows="5" required></textarea></label>`],
    "new-message": ["Start a conversation", `<label>Team member<input name="title" placeholder="Name or email" required autofocus/></label><label>Message<textarea name="body" rows="3" required></textarea></label>`],
  };
  const [title, fields] = forms[kind] ?? forms["new-task"];
  dialog.innerHTML = `<form method="dialog" data-form="create-item" data-kind="${escapeHtml(kind)}"><header><div><h2>${title}</h2><p>Local preview only. No connected service will receive this.</p></div><button class="icon-button" value="cancel" aria-label="Close">${icon("close")}</button></header><div class="dialog-fields">${fields}</div><footer><button class="button button-quiet" value="cancel">Cancel</button><button class="button button-primary" type="submit" value="create">Create</button></footer></form>`;
  dialog.showModal();
  dialog.querySelector("input,textarea")?.focus();
}

function updateKnowledgeFilters(root) {
  if (!root) return;
  const query = root.querySelector("[data-knowledge-search]")?.value.trim().toLowerCase() ?? "";
  const kind = root.querySelector("[data-knowledge-kind]")?.value ?? "all";
  const category = root.querySelector("[data-knowledge-category]")?.value ?? "all";
  let visible = 0;
  root.querySelectorAll("[data-knowledge-record]").forEach((record) => {
    const matches = (!query || record.dataset.searchIndex.includes(query))
      && (kind === "all" || record.dataset.kind === kind)
      && (category === "all" || record.dataset.category === category);
    record.hidden = !matches;
    if (matches) visible += 1;
  });
  const count = root.querySelector("[data-knowledge-count]");
  if (count) count.textContent = `${visible} guide${visible === 1 ? "" : "s"}`;
  const empty = root.querySelector("[data-knowledge-empty]");
  if (empty) empty.hidden = visible > 0;
}

async function onInput(event) {
  const input = event.target;
  if (input.matches("[data-knowledge-search]")) updateKnowledgeFilters(input.closest("[data-knowledge-library]"));
  if (input.matches("[data-studio-search]")) {
    const query = input.value.trim().toLowerCase();
    app.querySelectorAll(".studio-contract-row").forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(query); });
    const results = app.querySelector("[data-studio-global-results]");
    if (results) {
      const { searchRegistry } = await (dataStudioRegistrySearchPromise ??= import("../../packages/domain-registry/src/index.mjs"));
      if (app.querySelector("[data-studio-search]")?.value.trim().toLowerCase() !== query) return;
      const matches = searchRegistry(query).slice(0, 50);
      results.hidden = !query;
      results.innerHTML = query ? matches.length
        ? `<small>${matches.length === 50 ? "Top 50" : matches.length} registry matches</small>${matches.map((item) => `<button type="button" data-action="studio-search-select" data-kind="${escapeHtml(item.type)}" data-id="${escapeHtml(item.id)}"><span>${escapeHtml(item.type)}</span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.id)} · ${escapeHtml(item.status)}</small></button>`).join("")}`
        : `<small>No registry matches for “${escapeHtml(query)}”.</small>`
        : "";
    }
  }
  if (input.matches("[data-studio-intent]")) state.dataStudioIntent = input.value;
  if (input.matches("[data-studio-product-tags]")) state.dataStudioProductTags = input.value;
  if (input.matches("[data-studio-flow-ids]")) state.dataStudioFlowIds = input.value;
  if (input.matches("[data-studio-shared-services]")) state.dataStudioSharedServices = input.value;
  if (input.matches("[data-studio-public-context]")) state.dataStudioIncludePublic = input.checked;
  if (input.matches("[data-studio-allow-planned]")) state.dataStudioAllowPlanned = input.checked;
}

async function onClick(event) {
  const route = event.target.closest("[data-route]");
  if (route) {
    event.preventDefault();
    const next = route.dataset.route;
    const item = allScreens.find((entry) => entry.id === next);
    if (item && !canAccess(item)) { showToast("Your host account does not have access to that page.", "error"); return; }
    state.screen = next;
    history.pushState(null, "", `#${encodeURIComponent(next)}`);
    state.settingsOpen = false;
    state.search = "";
    shell();
    window.dispatchEvent(new CustomEvent("maataa-admin:navigate", { detail: { route: next } }));
    app.querySelector("#main")?.focus({ preventScroll: true });
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, value, id } = button.dataset;
  if (action === "studio-go") {
    if (allScreens.some((entry) => entry.id === value)) {
      state.screen = value;
      history.pushState(null, "", `#${encodeURIComponent(value)}`);
      shell();
    }
    return;
  }
  if (action === "studio-catalog-tab") { state.dataStudioCatalogView = value; renderScreen(); return; }
  if (action === "studio-registry-select" || action === "studio-search-select") {
    const searchKinds = { domain: "domains", table: "tables", context: "contexts", product: "products", flow: "flows", route: "routes", actor: "actors" };
    const kind = searchKinds[button.dataset.kind] ?? button.dataset.kind;
    state.dataStudioCatalogView = kind;
    state.dataStudioSelection = { type: kind, id: button.dataset.id };
    state.screen = "data-studio/catalog";
    history.pushState(null, "", "#data-studio/catalog");
    renderScreen();
    return;
  }
  if (action === "studio-preview-tab") { state.dataStudioPreviewView = value; renderScreen(); return; }
  if (action === "studio-compose-tab") { state.dataStudioComposeTab = value; renderScreen(); return; }
  if (action === "studio-contract-select") { state.dataStudioContract = value; renderScreen(); return; }
  if (action === "studio-resolve") {
    state.dataStudioIntent = app.querySelector("[data-studio-intent]")?.value ?? state.dataStudioIntent;
    state.dataStudioProductTags = app.querySelector("[data-studio-product-tags]")?.value ?? state.dataStudioProductTags;
    state.dataStudioFlowIds = app.querySelector("[data-studio-flow-ids]")?.value ?? state.dataStudioFlowIds;
    state.dataStudioSharedServices = app.querySelector("[data-studio-shared-services]")?.value ?? state.dataStudioSharedServices;
    state.dataStudioIncludePublic = app.querySelector("[data-studio-public-context]")?.checked ?? false;
    state.dataStudioAllowPlanned = app.querySelector("[data-studio-allow-planned]")?.checked ?? false;
    try {
      const { resolveComposition } = await (dataStudioCompositionPromise ??= import("../../packages/domain-registry/src/composition.mjs"));
      const productTags = state.dataStudioProductTags.split(",").map((item) => item.trim()).filter(Boolean);
      const flowIds = state.dataStudioFlowIds.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean);
      const sharedServices = state.dataStudioSharedServices.split(",").map((item) => item.trim()).filter(Boolean);
      state.dataStudioResolution = resolveComposition({ appId: "casting-pipeline-demo", name: "Casting Pipeline", description: state.dataStudioIntent, productTags, ...(flowIds.length ? { flowIds } : {}), sharedServices, includePublicContext: state.dataStudioIncludePublic, overrides: { allowPlanned: state.dataStudioAllowPlanned }, seedProfile: "demo-casting" });
      state.dataStudioResolveError = null;
      state.dataStudioIrDraft = JSON.stringify(state.dataStudioResolution, null, 2);
      state.dataStudioIrSaved = false;
      renderScreen();
      showToast(`Resolved ${state.dataStudioResolution.flowIds.length} flows · ${state.dataStudioResolution.contextVersions.length} contexts · ${state.dataStudioResolution.routeReadiness.status.toLowerCase()} routes.`);
    } catch (error) {
      state.dataStudioResolveError = error?.message ?? "Composition could not be resolved.";
      renderScreen();
      showToast(state.dataStudioResolveError, "error");
    }
    return;
  }
  if (action === "studio-explain") {
    const query = app.querySelector("[data-studio-explain-query]")?.value ?? "Why was Evidence added?";
    try {
      const { explainComposition, resolveComposition } = await (dataStudioCompositionPromise ??= import("../../packages/domain-registry/src/composition.mjs"));
      const current = state.dataStudioResolution ?? resolveComposition({ productTags: ["film"], flowIds: ["TLPS-FLOW-027", "TLPS-FLOW-028", "TLPS-FLOW-029", "TLPS-FLOW-030", "TLPS-FLOW-031"] });
      state.dataStudioResolution = current;
      state.dataStudioExplanation = explainComposition(current, query);
      renderScreen();
    } catch (error) { showToast(error?.message ?? "Could not explain this composition.", "error"); }
    return;
  }
  if (action === "studio-reset-ir") {
    state.dataStudioIrDraft = null;
    state.dataStudioIrSaved = false;
    state.dataStudioResolution = null;
    state.dataStudioExplanation = null;
    state.dataStudioResolveError = null;
    state.dataStudioIntent = "Casting pipeline for a film production company";
    state.dataStudioProductTags = "film";
    state.dataStudioFlowIds = "TLPS-FLOW-027\nTLPS-FLOW-028\nTLPS-FLOW-029\nTLPS-FLOW-030\nTLPS-FLOW-031";
    state.dataStudioSharedServices = "";
    state.dataStudioIncludePublic = false;
    state.dataStudioAllowPlanned = true;
    try { localStorage.removeItem("maataa-data-studio-ir-draft"); } catch { /* local draft is optional */ }
    renderScreen();
    return;
  }
  if (action === "studio-save-ir") {
    const editor = app.querySelector("[data-studio-ir]");
    try {
      const { sealApplicationIR, validateApplicationIR } = await (dataStudioCompositionPromise ??= import("../../packages/domain-registry/src/composition.mjs"));
      const parsed = sealApplicationIR(JSON.parse(editor?.value ?? ""));
      const result = validateApplicationIR(parsed);
      if (!result.valid) throw new Error(result.errors.join(" "));
      state.dataStudioIrDraft = JSON.stringify(parsed, null, 2);
      state.dataStudioResolution = parsed;
      state.dataStudioIrSaved = true;
      localStorage.setItem("maataa-data-studio-ir-draft", state.dataStudioIrDraft);
      renderScreen();
      showToast("Application IR draft saved in this browser. Registry data was not changed.");
    } catch (error) { showToast(error?.message || "IR JSON is invalid.", "error"); }
    return;
  }
  if (action === "studio-prepare") { showToast("Compilation is unavailable until the registry resolver and compiler services are connected.", "error"); return; }
  if (action === "retry-knowledge") { renderScreen(); return; }
  if (action === "browse-courses") { app.querySelector("#knowledge-library-title")?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (action === "knowledge-category") {
    const root = app.querySelector("[data-knowledge-library]");
    const category = root?.querySelector("[data-knowledge-category]");
    if (category) { category.value = value; updateKnowledgeFilters(root); root.scrollIntoView({ behavior: "smooth", block: "start" }); }
    return;
  }
  if (action === "support-this-record") {
    state.supportDraft = { recordId: button.dataset.recordId, recordType: button.dataset.recordKind, route: button.dataset.initialRoute, screenId: button.dataset.screenId, roleId: button.dataset.role };
    state.screen = "support";
    history.pushState(null, "", "#support");
    shell();
    app.querySelector("[data-support-record]")?.focus();
    return;
  }
  if (action === "open-settings") { state.settingsOpen = true; shell(); return; }
  if (action === "close-settings") { state.settingsOpen = false; shell(); return; }
  if (action === "toggle-theme") { state.theme = state.theme === "light" ? "dark" : "light"; prefs(); shell(); return; }
  if (action === "toggle-mobile-nav") { app.querySelector("#sidebar")?.classList.toggle("mobile-open"); return; }
  if (action === "accent") { state.accent = value; prefs(); shell(); return; }
  if (action === "new-task" || action === "new-card" || action === "new-project" || action === "new-product" || action === "new-contact" || action === "new-event" || action === "new-note" || action === "compose-mail" || action === "new-message") { openDialog(action); return; }
  if (action === "open-upload") { app.querySelector("#file-upload")?.click(); return; }
  if (action === "toggle-task") { return; }
  if (action === "move-card") {
    for (let i = 0; i < state.lanes.length; i += 1) {
      const index = state.lanes[i].items.findIndex((item) => item.id === id);
      if (index < 0) continue;
      const [card] = state.lanes[i].items.splice(index, 1);
      if (i < state.lanes.length - 1) state.lanes[i + 1].items.push(card);
      else showToast("Example card completed.");
      break;
    }
    shell(); return;
  }
  if (action === "select-conversation") { state.conversation = value; shell(); return; }
  if (action === "calendar-prev") { state.monthOffset -= 1; shell(); return; }
  if (action === "calendar-next") { state.monthOffset += 1; shell(); return; }
  if (action === "select-note") { state.selectedNote = id; shell(); return; }
  if (action === "platform-tab" && ["apps", "servers", "capabilities"].includes(value)) { state.platformTab = value; state.platformForm = null; state.platformEditingId = null; shell(); return; }
  if (action === "platform-add-app" || action === "platform-add-server") { state.platformForm = action === "platform-add-app" ? "application" : "server"; state.platformEditingId = null; shell(); app.querySelector(".platform-form input")?.focus(); return; }
  if (action === "platform-edit-app" || action === "platform-edit-server") { state.platformForm = action === "platform-edit-app" ? "application" : "server"; state.platformEditingId = id; shell(); app.querySelector(".platform-form input")?.focus(); return; }
  if (action === "platform-cancel") { state.platformForm = null; state.platformEditingId = null; shell(); return; }
  if (action === "platform-remove-app") {
    if (!window.confirm("Remove this application from the local browser draft? Server assignments to it will also be removed.")) return;
    state.applications = state.applications.filter((item) => item.id !== id);
    state.servers = state.servers.map((server) => ({ ...server, environmentAssignments: (server.environmentAssignments ?? []).filter((assignment) => assignment.appId !== id) }));
    persistApplicationRegistry(); persistInfrastructureRegistry(); shell(); showToast("Application removed from this browser registry draft."); return;
  }
  if (action === "platform-remove-server") {
    if (!window.confirm("Remove this server from the local browser draft?")) return;
    state.servers = state.servers.filter((item) => item.id !== id);
    persistInfrastructureRegistry(); shell(); showToast("Server removed from this browser registry draft."); return;
  }
  if (action === "mark-all-read") { state.notifications = state.notifications.map((item) => ({ ...item, read: true })); shell(); showToast("All preview notifications marked as read."); return; }
  if (action === "mark-read") { state.notifications = state.notifications.map((item) => item.id === id ? { ...item, read: true } : item); shell(); showToast("Preview notification marked as read."); return; }
  if (action === "sign-out") { await signOut(); return; }
  if (action === "print-invoice") { window.print(); return; }
  if (action === "retry-page") { showToast("No live status service is connected.", "error"); return; }
  if (action === "download-skeleton") { downloadSkeleton(); return; }
  if (action === "export-report") { downloadText("workspace-report.txt", "MAATAA Workspace\nIllustrative local preview data.\nConnect an API to export authoritative reports.\n"); return; }
  if (action === "toast") { showToast(button.dataset.message ?? "Preview action selected."); return; }
  if (action === "choose-plan") { showToast(`“${value}” is an example plan. Connect billing before accepting subscriptions.`); return; }
  if (action === "task-filter") { state.taskFilter = value; shell(); app.querySelectorAll("[data-action=task-filter]").forEach((item) => item.classList.toggle("is-selected", item.dataset.value === value)); return; }
  if (action === "notification-filter" || action === "commerce-filter" || action === "project-view") { button.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("is-active", "is-selected")); button.classList.add("is-active", "is-selected"); return; }
  if (["activity-filter", "chart-options", "item-menu", "lane-menu", "sort-tasks", "browse-courses", "contact-support", "help-category"].includes(action)) { showToast("This example control is ready for a host service connection."); }
}

async function signOut() {
  const adapter = authAdapter();
  if (!adapter?.signOut) { showToast("No JWT authentication adapter is connected.", "error"); return; }
  try { await adapter.signOut(); state.session = null; state.screen = "auth/sign-in"; shell(); showToast("You have signed out."); }
  catch { showToast("The host sign-out request failed. Try again.", "error"); }
}

function onChange(event) {
  const input = event.target;
  if (input.matches("[data-knowledge-kind], [data-knowledge-category]")) { updateKnowledgeFilters(input.closest("[data-knowledge-library]")); return; }
  if (input.matches("[data-support-record]")) {
    const option = input.selectedOptions[0];
    const form = input.closest("form");
    const route = form?.elements.namedItem("route");
    const screenId = form?.elements.namedItem("screenId");
    const role = form?.elements.namedItem("roleId");
    if (route && option?.dataset.route) route.value = option.dataset.route;
    if (screenId) screenId.value = option?.dataset.screenId ?? "";
    if (role && option?.dataset.role) role.value = option.dataset.role;
    return;
  }
  if (input.matches("[data-route-select]") && input.value) {
    const item = allScreens.find((entry) => entry.id === input.value);
    if (item && canAccess(item)) { state.screen = item.id; history.pushState(null, "", `#${encodeURIComponent(item.id)}`); shell(); }
    return;
  }
  if (input.matches("[data-preference]")) {
    const name = input.dataset.preference;
    if (name === "dark") state.theme = input.checked ? "dark" : "light";
    else if (name === "nav" && ["left", "right", "horizontal", "folded"].includes(input.value)) state.nav = input.value;
    else if (name === "toolbar" && ["above", "below"].includes(input.value)) state.toolbar = input.value;
    else if (name === "footer" && ["above", "below"].includes(input.value)) state.footer = input.value;
    else if (name === "contentLayout" && contentLayouts.some(([id]) => id === input.value)) state.contentLayout = input.value;
    else if (name === "language" && ["en", "hi", "ar"].includes(input.value)) state.language = input.value;
    else if (name === "accent" && /^#[\da-f]{6}$/i.test(input.value)) state.accent = input.value;
    else return;
    if (name === "nav") state.folded = input.value === "folded";
    prefs(); shell(); return;
  }
  if (input.matches("[data-action=toggle-task]")) {
    state.tasks = state.tasks.map((task) => task.id === input.dataset.id ? { ...task, done: input.checked } : task);
    persistPreviewList("maataa-admin-tasks", state.tasks);
    shell(); showToast(input.checked ? "Task marked complete." : "Task reopened."); return;
  }
  if (input.matches("#file-upload")) {
    for (const file of input.files ?? []) state.files.unshift({ name: file.name, owner: state.session?.user?.name ?? "Preview user", modified: "Just now", size: file.size > 1e6 ? `${(file.size / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1000))} KB`, kind: file.name.split(".").pop().slice(0, 4).toLowerCase() });
    shell(); showToast(`${input.files.length} file${input.files.length === 1 ? "" : "s"} added to the preview list.`); return;
  }
  if (input.matches("[data-nav-search]")) {
    const cursor = input.selectionStart;
    state.search = input.value;
    shell();
    const next = app.querySelector("[data-nav-search]"); next?.focus(); next?.setSelectionRange(cursor, cursor);
  }
}

async function onSubmit(event) {
  const form = event.target;
  if (!form.matches("form[data-form]")) return;
  event.preventDefault();
  const data = new FormData(form);
  const fields = Object.fromEntries(data.entries());
  if (form.dataset.form === "support-ticket") {
    const selected = form.elements.namedItem("recordId")?.selectedOptions[0];
    const ticket = {
      id: `SUP-${Date.now()}`,
      recordId: String(fields.recordId ?? ""),
      recordType: selected?.dataset.kind ?? "",
      recordTitle: selected?.dataset.title ?? String(fields.recordId ?? "TLPS guide"),
      screenId: String(fields.screenId ?? ""),
      roleId: String(fields.roleId ?? ""),
      route: String(fields.route ?? "").trim(),
      context: String(fields.context ?? "").trim(),
      expectedState: String(fields.expectedState ?? "").trim(),
      actualState: String(fields.actualState ?? "").trim(),
      stepsToReproduce: String(fields.stepsToReproduce ?? "").trim(),
      severity: String(fields.severity ?? "Medium"),
      browserDevice: String(fields.browserDevice ?? "").trim(),
      evidenceReference: String(fields.evidenceReference ?? "").trim(),
      onlineOfflineState: navigator.onLine ? "online" : "offline",
      createdAt: new Date().toLocaleString(),
      status: "Saved locally · not sent",
    };
    state.supportTickets.unshift(ticket);
    state.supportDraft = null;
    try { localStorage.setItem("maataa-admin-support-requests", JSON.stringify(state.supportTickets)); }
    catch { showToast("The request is kept for this page session; browser storage was unavailable.", "error"); }
    shell();
    showToast("Support request saved in this browser. It was not sent to a service.");
    return;
  }
  if (form.dataset.form === "platform-config") {
    const editingId = form.dataset.editingId;
    const id = editingId || `platform-${Date.now()}`;
    if (form.dataset.kind === "application") {
      const domainNames = String(fields.domains ?? "").split(/[\s,;]+/).map((domain) => domain.trim().toLowerCase()).filter(Boolean);
      const domainPattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
      if (domainNames.some((domain) => !domainPattern.test(domain))) { showToast("Enter valid domain names without a protocol or path.", "error"); return; }
      const normalizedDomains = [...new Set(domainNames)];
      const environments = String(fields.environments ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
        const [idValue, ...nameParts] = line.split("|").map((part) => part.trim());
        return { id: idValue, name: nameParts.join(" | ") || idValue, kind: "preview", deployments: [] };
      });
      if (environments.some((environment) => !/^[a-z0-9][a-z0-9-_]{0,39}$/.test(environment.id)) || new Set(environments.map((environment) => environment.id)).size !== environments.length) { showToast("Environment IDs must be unique and use lowercase letters, numbers, hyphens, or underscores.", "error"); return; }
      const repositoryUrl = String(fields.repositoryUrl ?? "").trim();
      if (repositoryUrl) {
        try {
          const parsed = new URL(repositoryUrl);
          if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error("invalid");
        } catch { showToast("Repository must be a valid HTTP or HTTPS URL without embedded credentials.", "error"); return; }
      }
      const duplicate = state.applications.some((item) => item.id !== editingId && normalizedDomains.some((hostname) => item.domains.some((domain) => domain.hostname === hostname)));
      if (duplicate) { showToast("That domain is already assigned to another application in this draft.", "error"); return; }
      const current = state.applications.find((item) => item.id === editingId) ?? {};
      const previousRoutes = new Map((current.routes ?? []).map((route) => [route.id, route]));
      const routes = String(fields.routes ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
        const [routeId, pathValue, label, ...groupParts] = line.split("|").map((part) => part.trim());
        const previous = previousRoutes.get(routeId) ?? {};
        return { ...previous, appId: id, id: routeId, path: pathValue, label, group: groupParts.join(" | ") || previous.group || "Pages", icon: previous.icon || "file", permission: previous.permission || `${id}:read`, template: previous.template || "manifest-page", kind: previous.kind || "page" };
      });
      if (routes.some((route) => !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(route.id) || !route.path?.startsWith("/") || !route.label)) { showToast("Routes need a unique ID, an absolute path, and a page title.", "error"); return; }
      if (new Set(routes.map((route) => route.id)).size !== routes.length || new Set(routes.map((route) => route.path)).size !== routes.length) { showToast("Route IDs and paths must be unique within the application.", "error"); return; }
      const routeMappings = String(fields.routeMappings ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
        const [hostname, environmentId, pathValue, routeId] = line.split("|").map((part) => part.trim());
        return { hostname: hostname?.toLowerCase(), environmentId, path: pathValue, routeId };
      });
      const ownedRouteIds = new Set(routes.map((route) => route.id));
      const invalidMapping = routeMappings.some((mapping) => !normalizedDomains.includes(mapping.hostname) || !environments.some((environment) => environment.id === mapping.environmentId) || !mapping.path?.startsWith("/") || !ownedRouteIds.has(mapping.routeId));
      if (invalidMapping) { showToast("Each route mapping must reference this app's domain, environment, path, and route ID.", "error"); return; }
      const duplicateMapping = routeMappings.some((mapping, index) => routeMappings.findIndex((candidate) => candidate.hostname === mapping.hostname && candidate.environmentId === mapping.environmentId && candidate.path === mapping.path) !== index);
      if (duplicateMapping) { showToast("A domain path can only map to one route per application.", "error"); return; }
      const domains = normalizedDomains.map((hostname) => ({
        id: `${id}-domain-${hostname.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        hostname,
        environmentId: [...new Set(routeMappings.filter((mapping) => mapping.hostname === hostname).map((mapping) => mapping.environmentId))].length === 1 ? routeMappings.find((mapping) => mapping.hostname === hostname)?.environmentId ?? "" : "",
        verification: "unverified",
        routeMappings: routeMappings.filter((mapping) => mapping.hostname === hostname).map(({ environmentId, path: pathValue, routeId }) => ({ environmentId, path: pathValue, routeId })),
      }));
      const record = {
        ...current,
        id,
        name: String(fields.name ?? "").trim(),
        summary: String(fields.description ?? "").trim(),
        routes,
        domains,
        repository: { url: repositoryUrl, defaultBranch: String(fields.defaultBranch ?? "").trim(), buildCommand: String(fields.buildCommand ?? "").trim(), outputDirectory: String(fields.outputDirectory ?? "").trim() },
        environments: environments.map((environment) => ({ ...environment, kind: current.environments?.find((item) => item.id === environment.id)?.kind ?? environment.kind, deployments: current.environments?.find((item) => item.id === environment.id)?.deployments ?? [] })),
      };
      if (editingId) state.applications = state.applications.map((item) => item.id === editingId ? record : item);
      else state.applications.push(record);
    } else {
      const capabilities = data.getAll("capabilities").map(String).filter(Boolean);
      const environmentAssignments = [...new Set(data.getAll("environmentAssignments").map(String))].map((key) => {
        const [appId, environmentId] = key.split("|");
        const application = state.applications.find((item) => item.id === appId);
        if (!application?.environments.some((environment) => environment.id === environmentId)) return null;
        return { appId, environmentId, capabilities: [...capabilities] };
      }).filter(Boolean);
      const host = String(fields.host ?? "").trim();
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,252}$/.test(host)) { showToast("Enter a hostname or IP address without a protocol, path, or credentials.", "error"); return; }
      if (!capabilities.length || capabilities.some((item) => !infrastructureRegistryCapabilities.has(item))) { showToast("Choose at least one registered server capability.", "error"); return; }
      const record = { id, name: String(fields.name ?? "").trim(), host, provider: String(fields.provider ?? "").trim(), region: String(fields.region ?? "").trim(), pool: String(fields.pool ?? "").trim(), capabilities, environmentAssignments };
      if (editingId) state.servers = state.servers.map((item) => item.id === editingId ? record : item);
      else state.servers.push(record);
    }
    state.platformForm = null;
    state.platformEditingId = null;
    if (form.dataset.kind === "application") persistApplicationRegistry();
    else persistInfrastructureRegistry();
    shell(); showToast("Saved in this browser registry draft. No infrastructure was changed."); return;
  }
  if (form.dataset.form === "create-item") {
    const kind = form.dataset.kind;
    if (kind === "new-task") { state.tasks.unshift({ id: `t${Date.now()}`, title: fields.title, project: fields.project, due: fields.due || "Unscheduled", priority: fields.priority, owner: "Preview user", done: false }); persistPreviewList("maataa-admin-tasks", state.tasks); }
    if (kind === "new-card") state.lanes[0].items.unshift({ id: `c${Date.now()}`, title: fields.title, description: fields.description || "Added in the local sprint preview.", code: "PR-NEW", due: fields.due || "Unscheduled", owner: "Preview user", type: "Planning", tone: "clay" });
    if (kind === "new-note") { const note = { id: `n${Date.now()}`, title: fields.title, body: fields.body || "", updated: "Just now" }; state.notes.unshift(note); persistPreviewList("maataa-admin-notes", state.notes); state.selectedNote = note.id; state.screen = "notes"; }
    if (kind === "new-product") state.products.unshift({ id: `p${Date.now()}`, name: fields.title, amount: Number(fields.amount), status: "Draft" });
    if (kind === "new-contact") state.contacts.unshift([fields.title, fields.email, fields.team || "Unassigned", "New", "blue"]);
    if (kind === "new-event") showToast("Event draft created in the preview. No calendar service received it.");
    if (kind === "compose-mail" || kind === "new-message") showToast("Draft created in the preview. No message was sent.");
    if (kind === "new-project") state.projects.unshift([fields.title, fields.team, 0, "clay", fields.due || "Unscheduled", "0 tasks"]);
    form.closest("dialog")?.close();
    shell();
    showToast(kind === "new-task" ? "Task added to your local list." : kind === "new-note" ? "Note saved in this browser." : "Added to the local preview.");
    return;
  }
  if (form.dataset.form === "message") {
    if (!String(fields.message ?? "").trim()) return;
    showToast("Message draft created in the preview. It was not sent.");
    form.reset();
    return;
  }
  if (form.dataset.form === "save-note") {
    state.notes = state.notes.map((note) => note.id === form.dataset.noteId ? { ...note, title: fields.title, body: fields.body, updated: "Just now" } : note);
    persistPreviewList("maataa-admin-notes", state.notes);
    shell(); showToast("Note saved in this browser."); return;
  }
  if (form.dataset.form === "profile") { showToast("Profile saved in the local preview. Connect a profile API to persist it."); return; }
  if (form.dataset.form === "auth") {
    const adapter = authAdapter();
    const method = form.dataset.authMethod;
    if (method === "Sign in" && !adapter?.signIn) { showToast("JWT sign-in is not connected. Supply window.MAATAA_ADMIN_AUTH.signIn.", "error"); return; }
    const methodMap = { "Sign in": "signIn", "Create account": "signUp", "Request reset link": "requestPasswordReset", "Reset password": "resetPassword", "Unlock session": "unlockSession", "Resend confirmation": "resendConfirmation" };
    const handler = adapter?.[methodMap[method]];
    if (typeof handler !== "function") { showToast(`The host authentication adapter does not provide ${methodMap[method]}.`, "error"); return; }
    try {
      const result = await handler(Object.fromEntries(data.entries()));
      if (method === "Sign in") {
        if (!result?.session?.user) throw new Error("The host returned no authenticated user session.");
        state.session = result.session;
        state.screen = "overview";
        shell();
        showToast("Signed in through the host authentication service.");
      } else showToast("Request sent to the host authentication service.");
    } catch (error) { showToast(error?.message || "Authentication request failed. Try again.", "error"); }
  }
}

function downloadText(filename, content) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  link.download = filename; link.click(); URL.revokeObjectURL(link.href);
}

function downloadSkeleton() {
  downloadText("maataa-admin-skeleton.md", `# MAATAA Admin Template skeleton\n\nRun the repository server and open /apps/admin-template/.\n\n## Host integrations\n- Attach window.MAATAA_ADMIN_AUTH with signIn/signOut and any supported auth operations.\n- Attach window.MAATAA_ADMIN.permissions with server-provided screen permissions.\n- Replace local examples with an authenticated data service.\n- Enforce access on the server for every protected request.\n`);
}

document.addEventListener("click", onClick);
document.addEventListener("input", onInput);
document.addEventListener("change", onChange);
document.addEventListener("submit", onSubmit);
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); app.querySelector("[data-global-search]")?.focus(); }
  if (event.key === "Escape") app.querySelector("#sidebar.mobile-open")?.classList.remove("mobile-open");
});
window.addEventListener("popstate", () => { let route = ""; try { route = decodeURIComponent(location.hash.slice(1)); } catch { route = ""; } if (allScreens.some((item) => item.id === route)) { state.screen = route; shell(); } });
window.addEventListener("maataa-admin:route", (event) => {
  const route = event.detail?.route;
  if (allScreens.some((item) => item.id === route)) {
    const changed = state.screen !== route;
    state.screen = route;
    if (changed) shell();
    else { renderScreen(); applyLayoutToView(); }
  }
});

async function init() {
  const adapter = authAdapter();
  if (adapter?.getSession) {
    try { const result = await adapter.getSession(); if (result?.user) state.session = result; }
    catch { state.session = null; }
  }
  let path = "";
  try { path = decodeURIComponent(location.hash.slice(1)); } catch { path = ""; }
  if (allScreens.some((item) => item.id === path)) state.screen = path;
  shell();
}
init();
