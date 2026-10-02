import tlpsManifest from "../tlps-application/src/manifest-data.json" with { type: "json" };

const adminRoutes = [
  ["overview", "Workspace overview", "grid", "Overview", "workspace:read", "overview"],
  ["analytics", "Analytics Dashboard", "chart", "Overview", "analytics:read", "overview"],
  ["projects", "Project Dashboard", "grid", "Overview", "projects:read", "overview"],
  ["academy", "Academy", "book", "Workspace", "academy:read", "business"],
  ["calendar", "Calendar", "calendar", "Workspace", "calendar:read", "work"],
  ["messenger", "Messenger", "chat", "Workspace", "messages:read", "communication"],
  ["contacts", "Contacts", "people", "Workspace", "contacts:read", "communication"],
  ["commerce", "E-Commerce", "bag", "Business", "commerce:read", "business"],
  ["files", "File Manager", "folder", "Business", "files:read", "business"],
  ["help", "Help Center", "help", "Business", "help:read", "business"],
  ["support", "Support", "chat", "Business", "support:read", "business"],
  ["data-studio", "Data Studio", "layers", "Data Studio", "data-studio:read", "data-studio"],
  ["data-studio/catalog", "Architecture catalog", "database", "Data Studio", "data-studio:read", "data-studio"],
  ["data-studio/compose", "Composition workspace", "workflow", "Data Studio", "data-studio:read", "data-studio"],
  ["data-studio/apps", "Generated applications", "grid", "Data Studio", "data-studio:read", "data-studio"],
  ["data-studio/governance", "Governance", "shield", "Data Studio", "data-studio:read", "data-studio"],
  ["data-studio/governance/contracts", "Contract coverage", "database", "Data Studio", "data-studio:read", "data-studio"],
  ["data-studio/system", "System connections", "server", "Data Studio", "data-studio:read", "data-studio"],
  ["mailbox", "Mailbox", "mail", "Communication", "mail:read", "communication"],
  ["notes", "Notes", "note", "Communication", "notes:read", "communication"],
  ["scrumboard", "Scrumboard", "columns", "Planning", "scrum:read", "work"],
  ["tasks", "Tasks", "check", "Planning", "tasks:read", "work"],
  ["profile", "Profile", "user", "Account", "profile:read", "account"],
  ["notifications", "Notification", "bell", "Account", "notifications:read", "communication"],
  ["platform", "Domains & Servers", "server", "Platform", "platform:read", "platform"],
  ["activities", "Activities", "pulse", "Pages", "activities:read", "work"],
  ["auth/sign-in", "Sign in", "lock", "Authentication Pages", "auth:read", "account"],
  ["auth/sign-up", "Sign up", "user-plus", "Authentication Pages", "auth:read", "account"],
  ["auth/sign-out", "Sign out", "logout", "Authentication Pages", "auth:read", "account"],
  ["auth/forgot-password", "Forgot password", "key", "Authentication Pages", "auth:read", "account"],
  ["auth/reset-password", "Reset password", "key", "Authentication Pages", "auth:read", "account"],
  ["auth/unlock-session", "Unlock session", "lock", "Authentication Pages", "auth:read", "account"],
  ["auth/confirmation-required", "Confirmation required", "check", "Authentication Pages", "auth:read", "account"],
  ["coming-soon", "Coming soon", "spark", "System Pages", "pages:read", "account"],
  ["error/404", "404 · Not found", "circle-help", "System Pages", "pages:read", "account"],
  ["error/500", "500 · Server error", "warning", "System Pages", "pages:read", "account"],
  ["invoice/compact", "Invoice · Compact", "receipt", "Billing Pages", "billing:read", "account"],
  ["invoice/modern", "Invoice · Modern", "receipt", "Billing Pages", "billing:read", "account"],
  ["maintenance", "Maintenance", "tool", "System Pages", "pages:read", "account"],
  ["pricing/modern", "Pricing · Modern", "coins", "Billing Pages", "billing:read", "account"],
  ["pricing/simple", "Pricing · Simple", "coins", "Billing Pages", "billing:read", "account"],
  ["pricing/single", "Pricing · Single", "coins", "Billing Pages", "billing:read", "account"],
  ["pricing/table", "Pricing · Table", "table", "Billing Pages", "billing:read", "account"],
  ["starter", "Skeleton Project", "code", "Developer", "developer:read", "account"],
].map(([id, label, icon, group, permission, template]) => ({
  appId: "maataa-workspace",
  id,
  path: `/${id}`,
  label,
  icon,
  group,
  permission,
  template,
  kind: id.includes("/") || ["activities", "coming-soon", "maintenance", "starter", "error/404", "error/500"].includes(id) ? "page" : "module",
}));

const tlpsRoutes = tlpsManifest.pages.map((page) => ({
  appId: "tlps",
  id: page.id,
  path: page.route,
  label: page.name,
  icon: page.icon,
  group: page.family,
  access: page.access,
  template: "manifest-page",
  kind: "page",
}));

export const activeApplicationId = "maataa-workspace";

export const applicationRegistry = [
  {
    id: "maataa-workspace",
    name: "MAATAA Workspace",
    summary: "Central operator workspace and application shell.",
    routes: adminRoutes,
    domains: [],
    repository: { url: "", defaultBranch: "", buildCommand: "npm run build", outputDirectory: "dist/apps/admin-template" },
    environments: [{ id: "local-preview", name: "Local preview", kind: "preview", deployments: [] }],
  },
  {
    id: "tlps",
    name: "TLPS",
    summary: "TLPS Platform",
    routes: tlpsRoutes,
    domains: [{ id: "tlps-in", hostname: "tlps.in", environmentId: "local-preview", verification: "unverified", routeMappings: [{ environmentId: "local-preview", path: "/", routeId: "P001" }] }],
    repository: { url: "", defaultBranch: "", buildCommand: "npm run build --workspace @maataa-app/tlps-application", outputDirectory: "dist/apps/tlps-application" },
    environments: [{ id: "local-preview", name: "Local preview", kind: "preview", deployments: [] }],
  },
  {
    id: "nevoevents",
    name: "NEVO Events",
    summary: "NEVO Events Platform",
    routes: [],
    domains: [{ id: "nevoevents-in", hostname: "nevoevents.in", environmentId: "", verification: "unverified", routeMappings: [] }],
    repository: { url: "", defaultBranch: "", buildCommand: "", outputDirectory: "" },
    environments: [],
  },
];

export const applicationRoutes = applicationRegistry.flatMap((application) => application.routes);
export const workspaceRoutes = applicationRegistry.find((application) => application.id === activeApplicationId).routes;
export const managedApplications = applicationRegistry.filter((application) => application.id !== activeApplicationId);

export function resolveApplicationRoute(appId, routeIdOrPath) {
  const application = applicationRegistry.find((item) => item.id === appId);
  if (!application) return null;
  return application.routes.find((route) => route.id === routeIdOrPath || route.path === routeIdOrPath) ?? null;
}

export function routeKey(route) {
  return `${route.appId}:${route.id}`;
}

export function normalizeApplicationDraft(record) {
  const seed = managedApplications.find((application) => application.id === record.id);
  const environments = (Array.isArray(record.environments) ? record.environments : seed?.environments ?? []).filter((environment) => environment && typeof environment.id === "string").map((environment) => ({
    id: environment.id,
    name: String(environment.name ?? environment.id),
    kind: String(environment.kind ?? "preview"),
    deployments: Array.isArray(environment.deployments) ? environment.deployments : [],
  }));
  const environmentIds = new Set(environments.map((environment) => environment.id));
  const routes = (Array.isArray(record.routes) ? record.routes : seed?.routes ?? []).filter((route) => route && typeof route.id === "string" && typeof route.path === "string" && typeof route.label === "string").map((route) => ({ ...route, appId: record.id }));
  const routeIds = new Set(routes.map((route) => route.id));
  const rawDomains = Array.isArray(record.domains) ? record.domains : [];
  const domains = rawDomains.map((domain, index) => {
    if (typeof domain === "string") {
      return {
        id: `${record.id}-domain-${index + 1}`,
        hostname: domain.toLowerCase(),
        environmentId: seed?.environments?.length === 1 ? seed.environments[0].id : "",
        verification: "unverified",
        routeMappings: [],
      };
    }
    return {
      id: String(domain.id ?? `${record.id}-domain-${index + 1}`),
      hostname: String(domain.hostname ?? "").toLowerCase(),
      environmentId: environmentIds.has(String(domain.environmentId ?? "")) ? String(domain.environmentId) : "",
      verification: domain.verification === "verified" ? "verified" : "unverified",
      routeMappings: Array.isArray(domain.routeMappings) ? domain.routeMappings.filter((mapping) => mapping && typeof mapping.path === "string" && typeof mapping.routeId === "string" && routeIds.has(mapping.routeId) && environmentIds.has(String(mapping.environmentId ?? domain.environmentId ?? ""))).map((mapping) => ({ environmentId: String(mapping.environmentId ?? domain.environmentId ?? ""), path: mapping.path, routeId: mapping.routeId })) : [],
    };
  });
  const repository = typeof record.repository === "string"
    ? { ...(seed?.repository ?? {}), url: record.repository }
    : { ...(seed?.repository ?? {}), ...(record.repository ?? {}) };
  return {
    ...(seed ?? {}),
    ...record,
    routes,
    domains,
    repository: {
      url: String(repository.url ?? ""),
      defaultBranch: String(repository.defaultBranch ?? ""),
      buildCommand: String(repository.buildCommand ?? ""),
      outputDirectory: String(repository.outputDirectory ?? ""),
    },
    environments,
  };
}

export function validateApplicationRegistry(registry = applicationRegistry) {
  const appIds = new Set();
  const hostnames = new Set();
  for (const application of registry) {
    if (!application.id || appIds.has(application.id)) throw new Error(`Duplicate or missing application ID ${application.id || "(empty)"}.`);
    appIds.add(application.id);
    const routeIds = new Set();
    const routePaths = new Set();
    const environmentIds = new Set(application.environments.map((environment) => environment.id));
    for (const route of application.routes) {
      if (route.appId !== application.id) throw new Error(`Route ${route.id} has the wrong application owner.`);
      if (routeIds.has(route.id)) throw new Error(`Duplicate route ${route.id} in ${application.id}.`);
      if (!route.path?.startsWith("/")) throw new Error(`Route ${route.id} must use an absolute path.`);
      if (routePaths.has(route.path)) throw new Error(`Duplicate route path ${route.path} in ${application.id}.`);
      routeIds.add(route.id);
      routePaths.add(route.path);
    }
    for (const domain of application.domains) {
      if (hostnames.has(domain.hostname)) throw new Error(`Domain ${domain.hostname} is assigned more than once.`);
      hostnames.add(domain.hostname);
      if (domain.environmentId && !environmentIds.has(domain.environmentId)) throw new Error(`Domain ${domain.hostname} refers to an unknown environment.`);
      for (const mapping of domain.routeMappings) {
        if (!routeIds.has(mapping.routeId)) throw new Error(`Domain ${domain.hostname} maps to an unknown route.`);
        if (!(mapping.environmentId || domain.environmentId) || !environmentIds.has(mapping.environmentId || domain.environmentId)) throw new Error(`Domain ${domain.hostname} maps to an unknown environment.`);
        if (!mapping.path?.startsWith("/")) throw new Error(`Domain ${domain.hostname} route mappings must use absolute paths.`);
      }
    }
  }
  return appIds.size === registry.length;
}
