import React, { useEffect, useMemo, useState } from "react";
import { AppShell, Button, Card, Sidebar, ThemeProvider, TopNav } from "@maataa/ui";
import { activeApplicationId, applicationRegistry, workspaceRoutes } from "../app-registry.mjs";

const preferenceDefaults = { nav: "left", toolbar: "above", footer: "below", contentLayout: "balanced", theme: "light", accent: "#8b6f47", language: "en" };
const readPreferences = () => {
  try { return { ...preferenceDefaults, ...JSON.parse(localStorage.getItem("maataa-admin-preferences") || "{}") }; }
  catch { return preferenceDefaults; }
};

function routeFromHash() {
  try {
    const routeId = decodeURIComponent(location.hash.slice(1));
    return workspaceRoutes.some((route) => route.id === routeId) ? routeId : "overview";
  } catch { return "overview"; }
}

function routeIcon(route) {
  return <span className="admin-menu-glyph" aria-hidden="true">{route.icon.slice(0, 1).toUpperCase()}</span>;
}

function WorkspaceContents({ route, layout }) {
  return (
    <div className="admin-route-template" data-app-id={activeApplicationId} data-route-id={route.id}>
      <div className={`screen-content layout-${layout}`}>
        <div className="loading-screen" role="status">Loading {route.label}…</div>
      </div>
      <div id="toast" className="toast" role="status" aria-live="polite" />
      <dialog id="action-dialog" className="action-dialog" />
    </div>
  );
}

function AdminWorkspace() {
  const [routeId, setRouteId] = useState(routeFromHash);
  const [filter, setFilter] = useState("");
  const [preferences, setPreferences] = useState(readPreferences);
  const route = workspaceRoutes.find((item) => item.id === routeId) ?? workspaceRoutes[0];
  const app = applicationRegistry.find((item) => item.id === activeApplicationId);
  const navPosition = preferences.nav === "horizontal" ? "top" : preferences.nav;

  const navigationItems = useMemo(() => {
    const visible = workspaceRoutes.filter((item) => item.label.toLowerCase().includes(filter.toLowerCase()));
    return [...new Set(visible.map((item) => item.group))].map((group) => ({
      id: `group-${group}`,
      label: group,
      children: visible.filter((item) => item.group === group).map((item) => ({ id: item.id, label: item.label, icon: routeIcon(item) })),
    }));
  }, [filter]);

  const navigate = (nextRoute) => {
    if (!workspaceRoutes.some((item) => item.id === nextRoute)) return;
    history.pushState(null, "", `#${encodeURIComponent(nextRoute)}`);
    setRouteId(nextRoute);
  };

  useEffect(() => {
    const syncHash = () => setRouteId(routeFromHash());
    const syncLegacyRoute = (event) => {
      const nextRoute = event.detail?.route;
      if (workspaceRoutes.some((item) => item.id === nextRoute)) setRouteId(nextRoute);
    };
    window.addEventListener("popstate", syncHash);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("maataa-admin:navigate", syncLegacyRoute);
    return () => {
      window.removeEventListener("popstate", syncHash);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("maataa-admin:navigate", syncLegacyRoute);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("maataa-admin:route", { detail: { route: routeId } }));
  }, [routeId]);

  const updatePreference = (event) => {
    const { name, value, type, checked } = event.currentTarget;
    const nextValue = type === "checkbox" ? checked : value;
    setPreferences((current) => ({ ...current, [name]: nextValue }));
  };

  useEffect(() => {
    localStorage.setItem("maataa-admin-preferences", JSON.stringify(preferences));
    document.documentElement.lang = preferences.language;
    document.documentElement.dir = preferences.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.style.setProperty("--accent", preferences.accent);
  }, [preferences]);

  const toolbar = (
    <div className="admin-workspace-toolbar">
      <div className="admin-breadcrumb"><span>{app.name}</span><b aria-hidden="true">/</b><strong>{route.label}</strong></div>
      <label className="admin-global-search"><span className="sr-only">Search workspace</span><input type="search" placeholder="Search workspace" aria-label="Search workspace" data-global-search /></label>
      <Button className="admin-create-button" size="sm" variant="primary" data-action="new-task">Create task</Button>
      <Button size="sm" variant="secondary" onClick={() => setPreferences((current) => ({ ...current, theme: current.theme === "dark" ? "light" : "dark" }))} aria-label="Toggle appearance">{preferences.theme === "dark" ? "Light" : "Dark"}</Button>
      <Button size="sm" variant="tertiary" onClick={() => navigate("notifications")}>Notifications</Button>
      <details className="admin-settings-menu">
        <summary>Layout</summary>
        <div className="admin-settings-fields">
          <label>Navigation<select name="nav" data-preference="nav" value={preferences.nav} onChange={updatePreference}><option value="left">Left</option><option value="right">Right</option><option value="horizontal">Horizontal</option><option value="folded">Folded</option></select></label>
          <label>Toolbar<select name="toolbar" data-preference="toolbar" value={preferences.toolbar} onChange={updatePreference}><option value="above">Above</option><option value="below">Below</option></select></label>
          <label>Footer<select name="footer" data-preference="footer" value={preferences.footer} onChange={updatePreference}><option value="below">Below</option><option value="above">Above</option></select></label>
          <label>Content<select name="contentLayout" data-preference="contentLayout" value={preferences.contentLayout} onChange={updatePreference}><option value="balanced">Balanced</option><option value="cards-two">Two-column cards</option><option value="cards-three">Three-column cards</option><option value="list-dense">Dense list</option><option value="table-comfortable">Comfortable table</option><option value="timeline">Timeline</option><option value="kanban">Kanban</option></select></label>
          <label>Language<select name="language" data-preference="language" value={preferences.language} onChange={updatePreference}><option value="en">English</option><option value="hi">हिन्दी</option><option value="ar">العربية</option></select></label>
          <label>Accent<input name="accent" data-preference="accent" type="color" value={preferences.accent} onChange={updatePreference} /></label>
        </div>
      </details>
    </div>
  );

  const sidebar = (
    <Sidebar
      label="Application routes"
      activeId={routeId}
      onSelect={navigate}
      header={<div className="admin-brand"><span className="admin-brand-mark">M</span><span><strong>MAATAA</strong><small>{app.name}</small></span></div>}
      footer={<Card className="admin-preview-card"><strong>Local preview</strong><p>Examples only · no connected services</p></Card>}
      items={navigationItems}
      width="264px"
      collapsedWidth="76px"
    >
      <div className="admin-route-search"><label htmlFor="nav-route-search">Find a route</label><input id="nav-route-search" data-nav-search type="search" value={filter} onChange={(event) => setFilter(event.target.value)} /></div>
      {navigationItems.map((group) => (
        <section className="admin-route-group" key={group.id}>
          <h2>{group.label}</h2>
          {group.children.map((item) => <button type="button" key={item.id} className={`admin-route-link ${routeId === item.id ? "is-active" : ""}`} onClick={() => navigate(item.id)} aria-current={routeId === item.id ? "page" : undefined}>{item.icon}<span className="admin-route-link-label">{item.label}</span></button>)}
        </section>
      ))}
    </Sidebar>
  );

  const topNav = <TopNav brand={<span className="admin-top-brand">Operator workspace</span>} sticky actions={<span className="admin-top-context">{applicationRegistry.length - 1} registered applications</span>} />;
  const footer = <footer className="admin-app-footer"><span>Preview data · no external services connected</span><span>MAATAA Workspace</span></footer>;

  return (
    <ThemeProvider theme={preferences.theme} onThemeChange={(theme) => setPreferences((current) => ({ ...current, theme }))}>
      <div className="maataa-admin-root">
        <AppShell topNav={topNav} sidebar={sidebar} toolbar={toolbar} footer={footer} navigationPosition={navPosition} toolbarPosition={preferences.toolbar} footerPosition={preferences.footer} navigationLabel="MAATAA Workspace">
          <WorkspaceContents route={route} layout={preferences.contentLayout} />
        </AppShell>
      </div>
    </ThemeProvider>
  );
}

export default AdminWorkspace;
