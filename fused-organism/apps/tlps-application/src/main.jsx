import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell, Sidebar, TopNav } from "@maataa/ui/navigation";
import { applicationRegistry } from "../../admin-template/app-registry.mjs";
import SpatialWorkspace from "./SpatialWorkspace.jsx";
import data from "./manifest-data.json";
import "./theme.css";

const tlpsApplication = applicationRegistry.find((application) => application.id === "tlps");
const registeredPages = tlpsApplication.routes.map((route) => {
  const page = data.pages.find((item) => item.id === route.id);
  return page ? { ...page, ...route, name: route.label, route: route.path, family: route.group } : null;
}).filter(Boolean);
const protectedPages = registeredPages.filter((page) => page.kind === "app");
const pageByRoute = new Map(registeredPages.map((page) => [page.route, page]));
const pageById = new Map(registeredPages.map((page) => [page.id, page]));
const productStartIds = {
  core: "017", production: "105", film: "049", campaign: "129",
  atl: "134", btl: "140", ooh: "136", marketplace: "145",
  evidence: "161", finance: "177", investor: "193", event: "209",
  wedding: "214", spatial: "222", ai: "226", analytics: "237",
};
const glyphs = { core: "⌘", production: "▣", film: "◉", campaign: "◈", atl: "↗", btl: "◎", ooh: "▤", marketplace: "◇", evidence: "▧", finance: "▥", investor: "◌", event: "✳", wedding: "♡", spatial: "▦", ai: "✳", analytics: "▥" };
const priorityCards = [
  { title: "Production units", value: "12,430", detail: "Across active workspaces", tone: "teal", icon: "▣", pageId: "106" },
  { title: "Live campaigns", value: "18", detail: "4 need a review", tone: "blue", icon: "◈", pageId: "129" },
  { title: "Evidence items", value: "2,847", detail: "Preview records", tone: "violet", icon: "▧", pageId: "161" },
  { title: "Finance signals", value: "482k", detail: "Illustrative only", tone: "amber", icon: "▥", pageId: "177" },
];
const agenda = [
  ["09:00", "Production review", "Operations · 30 min · Preview calendar"],
  ["10:30", "Campaign planning", "Marketing · 60 min · Preview calendar"],
  ["12:00", "Partner sync", "External · 45 min · Preview calendar"],
  ["14:00", "Evidence approvals", "Governance · 60 min · Preview calendar"],
  ["16:00", "Weekly performance review", "Leadership · 60 min · Preview calendar"],
];
const attention = [
  ["Production schedule variance", "A sample workstream is 12% behind its plan."],
  ["Evidence review pending", "Three sample items are awaiting a decision."],
  ["Campaign budget threshold", "A sample campaign is nearing its allocation."],
  ["Partner action required", "A sample partner record needs follow-up."],
];
const activity = [
  ["New evidence item added", "Sustainability report · sample record", "12m"],
  ["Campaign updated", "Autumn range · sample workspace", "1h"],
  ["Production milestone reached", "10,000 units · sample workspace", "3h"],
  ["Partner profile updated", "Greenfield Co. · sample record", "5h"],
];

function getRoute() {
  const route = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return route || "/";
}

function go(route) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  if (getRoute() === normalized) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else window.location.hash = normalized;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pageForProduct(product) {
  return pageById.get(productStartIds[product.id]) || protectedPages.find((page) => product.families.includes(page.family));
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [roleId, setRoleId] = useState(() => sessionStorage.getItem("tlps-preview-role") || "");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showLayoutDialog, setShowLayoutDialog] = useState(false);
  const [notice, setNotice] = useState("");
  const [showAllApps, setShowAllApps] = useState(false);
  const [layout, setLayout] = useState({ navigationPosition: "left", toolbarPosition: "above", footerPosition: "below" });
  const searchInputRef = useRef(null);

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const role = data.roles.find((item) => item.id === roleId);
  const allowedFamilies = role ? new Set(data.permissions[role.id]?.families || []) : null;
  const currentPage = pageByRoute.get(route);
  const availableApps = useMemo(() => data.products.filter((product) => {
    const launchPage = pageForProduct(product);
    return !allowedFamilies || Boolean(launchPage && allowedFamilies.has(launchPage.family));
  }), [allowedFamilies]);
  const searchablePages = useMemo(() => registeredPages.filter((page) => {
    const queryMatches = !query || `${page.name} ${page.family} ${page.description} ${page.route}`.toLowerCase().includes(query.toLowerCase());
    const permissionMatches = !allowedFamilies || page.kind !== "app" || allowedFamilies.has(page.family);
    const scopeMatches = scope === "all" || (scope === "public" ? page.kind === "public" : page.kind === "auth" ? page.kind === "auth" : page.kind === "app");
    return queryMatches && permissionMatches && scopeMatches;
  }), [query, scope, allowedFamilies]);
  const isPublicHome = route === "/" || route === "/home";
  const isHome = route === "/mobile/017/home-dashboard";
  const authPage = currentPage?.kind === "auth";
  const routeLocked = currentPage?.kind === "app" && !role;
  const routeAllowed = !currentPage || currentPage.kind !== "app" || !allowedFamilies || allowedFamilies.has(currentPage.family);

  useEffect(() => {
    if (routeLocked && route !== "/mobile/004/sign-in") {
      sessionStorage.setItem("tlps-preview-return", route);
      go("/mobile/004/sign-in");
    }
  }, [routeLocked, route]);

  useEffect(() => {
    if (isPublicHome && roleId) {
      sessionStorage.removeItem("tlps-preview-role");
      setRoleId("");
    }
  }, [isPublicHome, roleId]);

  function selectRole(id) {
    sessionStorage.setItem("tlps-preview-role", id);
    setRoleId(id);
    setShowRolePicker(false);
    const pending = sessionStorage.getItem("tlps-preview-return");
    sessionStorage.removeItem("tlps-preview-return");
    const target = pending && pageByRoute.has(pending) ? pending : "/mobile/017/home-dashboard";
    go(target);
  }

  function previewAction(action) {
    setNotice(`${action} is a preview interaction. Connect the relevant host service to make it operational.`);
    window.setTimeout(() => setNotice(""), 4200);
  }

  const navItems = [
    { label: "Workspace", page: pageById.get("017") },
    { label: "Projects", page: protectedPages.find((page) => page.family === "Projects") },
    { label: "Production", page: protectedPages.find((page) => page.family === "Live Production") },
    { label: "Campaigns", page: protectedPages.find((page) => page.family === "Campaign OS") },
    { label: "Evidence", page: protectedPages.find((page) => page.family === "Evidence & Governance") },
    { label: "Finance", page: protectedPages.find((page) => page.family === "Finance & Commerce") },
  ].filter((item) => item.page && (!allowedFamilies || allowedFamilies.has(item.page.family)));

  const header = <div className="tlps-sidebar-brand"><span className="brand-symbol">T</span><span><b>TLPS</b><small>OPERATIONS PLATFORM</small></span></div>;
  const sidebar = <Sidebar header={header} footer={<div className="sidebar-status"><i /> Preview data · services disconnected</div>}>
    <div className="sidebar-section-label">OPERATIONS</div>
    <button className={`sidebar-link ${isHome ? "active" : ""}`} type="button" onClick={() => role ? go("/mobile/017/home-dashboard") : go("/")}><span>⌂</span><span>Overview</span></button>
    {navItems.map((item) => <button key={item.page.id} className={`sidebar-link ${route === item.page.route ? "active" : ""}`} type="button" onClick={() => go(item.page.route)}><span>{glyphs[item.page.productId] || "◫"}</span><span>{item.label}</span></button>)}
    <div className="sidebar-section-label">APPLICATIONS</div>
    {data.products.slice(0, 8).map((product) => {
      const start = pageForProduct(product);
      if (!start || !availableApps.some((item) => item.id === product.id)) return null;
      return <button key={product.id} className={`sidebar-link ${route === start.route ? "active" : ""}`} type="button" onClick={() => role ? go(start.route) : go("/mobile/004/sign-in")}><span>{glyphs[product.id]}</span><span>{product.name.replace("TLPS ", "")}</span></button>;
    })}
    <div className="sidebar-section-label">YOUR PREVIEW</div>
    <button className="sidebar-link" type="button" onClick={() => setShowRolePicker(true)}><span>◎</span><span>{role?.label || "Choose a role"}</span></button>
  </Sidebar>;

  const topNav = <TopNav brand={<div className="top-breadcrumb"><button type="button" onClick={() => go("/")}>TLPS</button><span className="breadcrumb-chevron">/</span><b>{currentPage?.name || (isHome ? "Welcome" : "Workspace")}</b></div>} actions={<>
    <label className="global-search"><span aria-hidden="true">⌕</span><input ref={searchInputRef} aria-label="Search TLPS routes" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages, products, workflows…" /><kbd>⌘ K</kbd></label>
    <button className="icon-button notification-button" type="button" aria-label="Notifications" onClick={() => go("/mobile/241/notifications-centre")}>♧<i>3</i></button>
    <button className="identity-button" type="button" onClick={() => setShowRolePicker(true)}><span className="avatar">{role?.avatar || "TL"}</span><span>{role?.label || "Preview visitor"}</span><span className="chevron">⌄</span></button>
  </>} />;

  const toolbar = <div className="page-toolbar"><div><span className="preview-label"><i /> PREVIEW ENVIRONMENT</span><span className="toolbar-divider" />{role ? <span>{role.organisation}</span> : <span>Role-neutral public view</span>}</div><div className="toolbar-controls"><label className="scope-picker"><span className="sr-only">Search route scope</span><select value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">All pages</option><option value="public">Public pages</option><option value="auth">Entry and security</option><option value="app">Workspace pages</option></select></label><button className="toolbar-button layout-settings-button" type="button" onClick={() => setShowLayoutDialog(true)}>⚙ <span>Layout</span></button><button className="toolbar-button" type="button" onClick={() => setShowRolePicker(true)}>{role ? "Switch role" : "Choose role"}</button></div></div>;

  return <div className="tlps-theme">
    <AppShell className="tlps-shell" sidebar={sidebar} topNav={topNav} toolbar={toolbar} footer={<div className="shell-footer"><span>TLPS interface preview</span><span>Manifest coverage: {data.counts.routes} routes · {data.counts.products} applications</span></div>} navigationPosition={layout.navigationPosition} navigationCollapsed={layout.navigationPosition === "folded"} toolbarPosition={layout.toolbarPosition} footerPosition={layout.footerPosition} navigationLabel="TLPS workspace navigation">
      <div className="page-content" id="tlps-main">
        {notice && <div className="notice-toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notice">×</button></div>}
        {query ? <SearchResults pages={searchablePages} query={query} /> : isPublicHome ? <PublicHome onSignIn={() => go("/mobile/004/sign-in")} onExplore={(id) => go(pageForProduct(data.products.find((product) => product.id === id))?.route || "/mobile/004/sign-in")} /> : isHome && role ? <WorkspaceHome role={role} availableApps={availableApps} go={go} onAction={previewAction} onAllApps={() => setShowAllApps(true)} /> : isHome ? <SignInPreview roles={data.roles} onSelect={selectRole} /> : authPage && currentPage.route === "/mobile/004/sign-in" ? <SignInPreview roles={data.roles} onSelect={selectRole} /> : authPage && currentPage ? <AuthRouteView page={currentPage} onAction={previewAction} onSignIn={() => go("/mobile/004/sign-in")} /> : currentPage && !routeAllowed ? <AccessNotice page={currentPage} role={role} onSwitch={() => setShowRolePicker(true)} /> : currentPage && (currentPage.id === "222" || currentPage.id === "223") ? <SpatialWorkspace key="tlps-spatial-layout" page={currentPage} role={role} /> : currentPage ? <RouteView page={currentPage} go={go} onAction={previewAction} role={role} /> : <NotFound go={go} />}
      </div>
    </AppShell>
    {showRolePicker && <RoleDialog roles={data.roles} active={roleId} onSelect={selectRole} onClose={() => setShowRolePicker(false)} />}
    {showLayoutDialog && <LayoutDialog layout={layout} onChange={setLayout} onClose={() => setShowLayoutDialog(false)} />}
    {showAllApps && <AppsDialog products={data.products} availableApps={availableApps} onOpen={(product) => { setShowAllApps(false); role ? go(pageForProduct(product)?.route || "/") : go("/mobile/004/sign-in"); }} onClose={() => setShowAllApps(false)} />}
  </div>;
}

function PublicHome({ onSignIn, onExplore }) {
  return <div className="public-home">
    <section className="hero-panel"><div className="hero-copy"><span className="eyebrow"><i /> ONE OPERATING LAYER · MANY DISCIPLINES</span><h1>Make complex work<br /><em>move as one.</em></h1><p>Plan, deliver and evidence physical and media production with a shared view of the people, places, budgets and decisions that move work forward.</p><div className="hero-actions"><button className="button-primary" onClick={onSignIn}>Enter workspace preview <span>→</span></button><a href="#products" onClick={(event) => { event.preventDefault(); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the platform <span>↓</span></a></div><div className="hero-trust"><span><b>16</b> connected applications</span><span><b>18</b> workflow families</span><span><b>284</b> navigable page routes</span></div></div><div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="center-node"><span>TLPS</span><small>SHARED CONTEXT</small></div><div className="orbit-node node-production">▣<span>Production</span></div><div className="orbit-node node-evidence">▧<span>Evidence</span></div><div className="orbit-node node-finance">▥<span>Finance</span></div><div className="orbit-node node-campaign">◈<span>Campaigns</span></div><div className="hero-caption"><i /> Preview environment · illustrative values</div></div></section>
    <section className="public-intro"><div><span className="eyebrow">BUILT AROUND REAL OPERATIONS</span><h2>One connected workspace.<br /><span>Every role in context.</span></h2></div><p>Explore the product areas below, then enter the role-based workspace preview. The routes and screens are a user-interface preview; authentication, records, and services are not connected.</p></section>
    <ProductGrid products={data.products.slice(0, 6)} onOpen={onExplore} compact={false} id="products" />
    <div className="public-endcap"><div><span className="eyebrow">START WITH THE WORK IN FRONT OF YOU</span><h2>See the operating layer<br />from your point of view.</h2></div><button className="button-secondary" onClick={onSignIn}>Choose a workspace role <span>→</span></button></div>
    <div className="public-disclosure">This preview uses illustrative content. It does not connect to customer systems, authenticate users or execute operational actions.</div>
  </div>;
}

function WorkspaceHome({ role, availableApps, go: navigate, onAction, onAllApps }) {
  const today = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return <div className="workspace-home">
    <div className="page-heading"><div><div className="date-line">{today.toUpperCase()} <span className="dot-separator">·</span> ROLE PREVIEW: {role.label.toUpperCase()}</div><h1>Workspace overview</h1><p>A clear view of work moving across your TLPS workspace today.</p></div><button className="button-secondary" onClick={() => onAction("Create project")}>＋ <span>New project</span></button></div>
    <div className="metric-grid">{priorityCards.map((card) => <button className={`metric-card metric-${card.tone}`} key={card.title} onClick={() => navigate(pageById.get(card.pageId)?.route || "/")}><span className="metric-icon">{card.icon}</span><span className="metric-copy"><small>{card.title}</small><strong>{card.value}</strong><span>{card.detail}</span></span><span className="metric-arrow">↗</span><span className="sparkline"><i /><i /><i /><i /><i /><i /><i /></span></button>)}</div>
    <div className="dashboard-grid"><section className="panel agenda-panel"><PanelTitle icon="▦" title="Today's agenda" action="Open calendar" onClick={() => navigate("/mobile/209/event-dashboard")} /><div className="agenda-list">{agenda.map(([time, title, detail], index) => <button className="agenda-item" key={time} onClick={() => onAction(title)}><time>{time}</time><span className={`agenda-dot ${index === 2 ? "muted" : ""}`} /><span className="agenda-copy"><b>{title}</b><small>{detail}</small></span><span className="row-chevron">›</span></button>)}</div><div className="panel-footnote">Sample agenda · no calendar connection</div></section>
      <section className="panel attention-panel"><PanelTitle icon="△" title="Needs attention" action="See governance" onClick={() => navigate("/mobile/161/evidence-dashboard")} /><div className="attention-list">{attention.map(([title, detail]) => <button className="attention-item" key={title} onClick={() => onAction(title)}><span className="attention-icon">△</span><span><b>{title}</b><small>{detail}</small></span><span className="row-chevron">›</span></button>)}</div><div className="panel-footnote">Illustrative priority signals</div></section>
    </div>
    <section className="panel apps-panel"><PanelTitle icon="▦" title="Launch applications" action={`View all ${availableApps.length}`} onClick={onAllApps} /><ProductGrid products={availableApps.slice(0, 8)} onOpen={(id) => navigate(pageForProduct(data.products.find((product) => product.id === id))?.route || "/")} compact /></section>
      <section className="panel recent-panel"><PanelTitle icon="◷" title="Recent activity" action="View activity" onClick={() => navigate("/mobile/032/activity-feed")} /><div className="activity-list">{activity.map(([title, detail, when], index) => <button className="activity-item" key={title} onClick={() => onAction(title)}><span className={`activity-bullet bullet-${index}`} /><span><b>{title}</b><small>{detail}</small></span><time>{when}</time><span className="row-chevron">›</span></button>)}</div><div className="panel-footnote">Sample activity · no connected source</div></section>
  </div>;
}

function ProductGrid({ products, onOpen, compact, id }) {
  return <div className={`product-grid ${compact ? "compact" : ""}`} id={id}>{products.map((product, index) => <button className={`product-card card-color-${index % 6}`} key={product.id} onClick={() => onOpen(product.id)}><span className="product-card-icon">{glyphs[product.id] || "◫"}</span><span className="product-card-copy"><b>{product.name.replace("TLPS ", "")}</b><small>{product.description}</small></span><span className="product-card-arrow">↗</span></button>)}</div>;
}

function PanelTitle({ icon, title, action, onClick }) {
  return <div className="panel-title"><div><span className="panel-icon">{icon}</span><h2>{title}</h2></div>{action && <button onClick={onClick}>{action}<span>→</span></button>}</div>;
}

function SearchResults({ pages, query }) {
  const shown = pages.slice(0, 36);
  return <section className="results-view"><div className="page-heading"><div><span className="eyebrow">ROUTE CATALOG</span><h1>Search results</h1><p>{pages.length} matching routes for “{query}”.</p></div></div>{pages.length ? <div className="results-grid">{shown.map((page) => <button className="result-card" key={page.id} onClick={() => go(page.route)}><span className="result-tag">{page.kind === "app" ? page.family : page.kind === "auth" ? "Entry & security" : "Public"}</span><b>{page.name}</b><small>{page.description}</small><code>{page.route}</code><span className="result-arrow">→</span></button>)}</div> : <div className="empty-state"><span>⌕</span><h2>No matching routes</h2><p>Try a product, page title, workflow family or route segment.</p></div>}{pages.length > shown.length && <p className="result-count">Showing {shown.length} of {pages.length} matches.</p>}</section>;
}

function SignInPreview({ roles, onSelect }) {
  return <div className="auth-layout"><div className="auth-art"><span className="eyebrow">TLPS · WORKSPACE PREVIEW</span><h1>Put your role<br /><em>in the picture.</em></h1><p>Choose a preview role to see the workspace routes and navigation associated with it.</p><div className="auth-art-note"><span>18</span><span>available role views</span></div></div><div className="auth-form-panel"><span className="eyebrow">ROLE SELECTION</span><h2>Enter the workspace</h2><p>This is a local interface preview. It does not authenticate an account or secure any backend service.</p><div className="role-list">{roles.map((role) => <button key={role.id} className="role-option" onClick={() => onSelect(role.id)}><span className="avatar">{role.avatar}</span><span><b>{role.label}</b><small>{role.organisation}</small></span><span>→</span></button>)}</div><div className="auth-privacy-note"><span>◇</span> No password, email or external identity provider is used in this preview.</div></div></div>;
}

function AuthRouteView({ page, onAction, onSignIn }) {
  const isExit = /sign out|unlock|confirmation/i.test(page.name);
  return <div className="auth-route-wrap"><div className="auth-route-card"><span className="eyebrow">ENTRY & SECURITY · PREVIEW ONLY</span><div className="auth-route-icon">{isExit ? "◇" : "⌑"}</div><h1>{page.name}</h1><p>{page.description || "This entry and security route is represented as a product preview."}</p><div className="auth-route-detail"><span><b>Route</b><code>{page.route}</code></span><span><b>Service state</b>Not connected</span></div><button className="button-primary" onClick={isExit ? () => onAction(page.primaryActions[0] || page.name) : onSignIn}>{actionName(page.primaryActions[0] || "Return to sign in")} <span>→</span></button><small>This page does not authenticate accounts, send email or change security state.</small></div></div>;
}

function RouteView({ page, go: navigate, onAction, role }) {
  const familyPages = protectedPages.filter((item) => item.family === page.family);
  const siblingPages = familyPages.filter((item) => item.id !== page.id).slice(0, 5);
  const products = data.products.filter((product) => product.families.includes(page.family));
  const pageOrdinal = Number.parseInt(page.id.replace(/\D/g, ""), 10) || 0;
  return <div className="route-view"><div className="route-breadcrumb"><button onClick={() => navigate("/mobile/017/home-dashboard")}>Workspace</button><span>/</span><button onClick={() => navigate(pageForProduct(products[0] || data.products[0])?.route || "/mobile/017/home-dashboard")}>{page.family}</button><span>/</span><b>{page.name}</b></div>
    <div className="page-heading route-heading"><div><div className="eyebrow">{page.family.toUpperCase()} <span className="dot-separator">·</span> {(role?.label || "PUBLIC").toUpperCase()} VIEW</div><h1>{page.name}</h1><p>{page.description}</p></div><div className="route-heading-actions"><span className="sample-badge"><i /> SAMPLE VIEW</span><button className="button-primary" onClick={() => onAction(page.primaryActions[0] || "Page action")}>{actionName(page.primaryActions[0])} <span>→</span></button></div></div>
    <div className="route-info-row"><span><b>Route</b><code>{page.route}</code></span><span><b>Application</b>{products.map((product) => product.name.replace("TLPS ", "")).join(" · ") || "TLPS Core"}</span><span><b>Data status</b>Illustrative preview</span></div>
    <div className="route-metrics">{(page.metrics.length ? page.metrics : ["Work items", "Reviews", "Updates"]).slice(0, 3).map((metric, index) => <div className="route-metric-card" key={metric}><span>{metric}</span><b>{["24", "08", "96%"][(index + pageOrdinal) % 3]}</b><small>{index === 0 ? "Sample records" : "Preview indicator"}</small></div>)}</div>
    <div className="route-content-grid"><section className="panel route-data-panel"><PanelTitle icon={glyphs[products[0]?.id] || "◫"} title={`${page.name} workspace`} action="Adjust view" onClick={() => onAction("Adjust view")} /><div className="table-controls"><span>Preview records <b>01–05</b></span><button onClick={() => onAction("Filter records")}>☷ Filters</button></div><div className="preview-table"><div className="table-head"><span>RECORD</span><span>STATUS</span><span>OWNER</span><span>UPDATED</span></div>{Array.from({ length: 5 }, (_, index) => <div className="table-row" key={`${page.id}-${index}`}><span><i className={`record-mark mark-${index}`} /><b>{tableLabel(page, index)}</b><small>TLPS sample · {String(index + 1).padStart(2, "0")}</small></span><span><em className={`status-pill status-${index % 3}`}>{["On track", "In review", "Planned"][index % 3]}</em></span><span className="owner-chip"><i>{["JD", "AS", "ML", "RK", "NP"][index]}</i>{["Jordan D.", "Amira S.", "Morgan L.", "Ravi K.", "Nia P."][index]}</span><span className="updated-cell">{["Today, 09:42", "Yesterday", "30 Sep", "29 Sep", "28 Sep"][index]}</span></div>)}</div><div className="table-disclaimer">All rows and statuses on this screen are illustrative sample content.</div></section>
      <aside className="route-side-column"><section className="panel quick-actions-panel"><PanelTitle icon="↗" title="Available actions" />{page.primaryActions.slice(0, 4).map((action) => <button className="quick-action" key={action} onClick={() => onAction(action)}><span>{actionName(action)}</span><b>→</b></button>)}<small className="action-disclaimer">Actions are visual only; host services are not connected.</small></section><section className="panel related-panel"><PanelTitle icon="◇" title="Related routes" />{siblingPages.length ? siblingPages.map((item) => <button className="related-link" key={item.id} onClick={() => navigate(item.route)}><span><b>{item.name}</b><small>{item.family}</small></span><i>→</i></button>) : <p className="muted-copy">No other routes in this family.</p>}</section></aside></div>
    <div className="route-source-note"><span>i</span><p><b>Preview boundary</b> This route was generated from manifest metadata. It does not read or write production data, invoke external providers, or perform authenticated authorization.</p></div>
  </div>;
}

function AccessNotice({ page, role, onSwitch }) {
  return <div className="empty-state access-state"><span>◇</span><div className="eyebrow">ROLE PREVIEW BOUNDARY</div><h1>This page is outside the selected role view.</h1><p>{role?.label} does not have the <b>{page.family}</b> family in the supplied preview permissions.</p><button className="button-primary" onClick={onSwitch}>Choose another role <span>→</span></button><small>These navigation filters are client-side previews and do not represent server authorization.</small></div>;
}

function NotFound({ go: navigate }) {
  return <div className="empty-state"><span>404</span><div className="eyebrow">ROUTE NOT FOUND</div><h1>This route is not in the manifest.</h1><p>The supplied manifest contains {data.counts.routes} known routes.</p><button className="button-primary" onClick={() => navigate("/")}>Return to TLPS home <span>→</span></button></div>;
}

function RoleDialog({ roles, active, onSelect, onClose }) {
  return <Dialog onClose={onClose} title="Choose a preview role"><p className="dialog-intro">Role choice filters the navigation and sample routes on this device.</p><div className="dialog-role-grid">{roles.map((role) => <button key={role.id} className={`dialog-role ${active === role.id ? "selected" : ""}`} onClick={() => onSelect(role.id)}><span className="avatar">{role.avatar}</span><span><b>{role.label}</b><small>{role.organisation}</small></span></button>)}</div><p className="dialog-disclaimer">This role selector is not an authentication or access-control system.</p></Dialog>;
}

function LayoutDialog({ layout, onChange, onClose }) {
  const navigationOptions = [
    ["left", "Left vertical", "Full-height rail at the left"],
    ["right", "Right vertical", "Full-height rail at the right"],
    ["top", "Horizontal", "Compact navigation above content"],
    ["folded", "Folded", "Start with icon-only navigation"],
  ];
  return <Dialog onClose={onClose} title="Workspace layout"><p className="dialog-intro">Reconfigure the MAATAA UI shell for this browser session.</p><div className="layout-setting-group"><h3>Navigation</h3><div className="layout-choice-grid">{navigationOptions.map(([value, label, detail]) => <button key={value} className={`layout-choice ${layout.navigationPosition === value ? "selected" : ""}`} aria-pressed={layout.navigationPosition === value} onClick={() => onChange({ ...layout, navigationPosition: value })}><span className={`layout-glyph glyph-${value}`}><i /><i /><i /></span><span><b>{label}</b><small>{detail}</small></span></button>)}</div></div><div className="layout-setting-group"><h3>Toolbar position</h3><div className="layout-segmented">{["above", "below"].map((value) => <button key={value} aria-pressed={layout.toolbarPosition === value} className={layout.toolbarPosition === value ? "selected" : ""} onClick={() => onChange({ ...layout, toolbarPosition: value })}>{value === "above" ? "Above content" : "Below content"}</button>)}</div></div><div className="layout-setting-group"><h3>Footer position</h3><div className="layout-segmented">{["below", "above"].map((value) => <button key={value} aria-pressed={layout.footerPosition === value} className={layout.footerPosition === value ? "selected" : ""} onClick={() => onChange({ ...layout, footerPosition: value })}>{value === "below" ? "Below content" : "Above content"}</button>)}</div></div><p className="dialog-disclaimer">Layout changes are local and reset when this page session ends.</p></Dialog>;
}

function AppsDialog({ products, availableApps, onOpen, onClose }) {
  return <Dialog onClose={onClose} title="All TLPS applications"><p className="dialog-intro">{availableApps.length} applications are available to this preview role ({products.length} in the manifest).</p><div className="dialog-app-list">{products.map((product, index) => <button key={product.id} disabled={!availableApps.some((item) => item.id === product.id)} className="dialog-app" onClick={() => onOpen(product)}><span className={`app-index index-${index % 6}`}>{glyphs[product.id]}</span><span><b>{product.name}</b><small>{product.description}</small></span><span>→</span></button>)}</div></Dialog>;
}

function Dialog({ onClose, title, children }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.querySelector("button:not(:disabled)")?.focus();
    const handler = (event) => { if (event.key === "Escape") closeRef.current(); };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); if (previousFocus instanceof HTMLElement) previousFocus.focus(); };
  }, []);
  function keepFocusInside(event) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]") || []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section ref={dialogRef} className="dialog" role="dialog" aria-modal="true" aria-label={title} onKeyDown={keepFocusInside}><header><div><span className="eyebrow">TLPS PREVIEW</span><h2>{title}</h2></div><button className="dialog-close" onClick={onClose} aria-label="Close dialog">×</button></header>{children}</section></div>;
}

function actionName(action = "Open workspace") {
  return action.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function tableLabel(page, index) {
  const nouns = page.name.replace(/(dashboard|workspace|manager|management|center|overview|list|board|planner|hub)/gi, "").trim() || page.family;
  return [`${nouns} · North region`, `${nouns} · Q3 workstream`, `${nouns} · Field unit ${index + 1}`, `${nouns} · Planning cycle`, `${nouns} · Shared record`][index];
}

function AppRoot() {
  return <App />;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><AppRoot /></React.StrictMode>);
