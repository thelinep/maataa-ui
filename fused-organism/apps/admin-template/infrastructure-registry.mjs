export const capabilityRegistry = ["Web hosting", "API", "Database", "Object storage", "Search", "AI inference", "Queue", "Realtime", "Email", "Monitoring", "Backups"];

export const infrastructureRegistry = {
  servers: [],
};

export function migrateServerAssignments(server, applications) {
  const serverCapabilities = Array.isArray(server.capabilities) ? [...new Set(server.capabilities.filter((item) => capabilityRegistry.includes(item)))] : [];
  if (Array.isArray(server.environmentAssignments)) {
    const environmentAssignments = server.environmentAssignments.filter((assignment) => assignment && typeof assignment.appId === "string" && applications.some((application) => application.id === assignment.appId)).map((assignment) => {
      const application = applications.find((item) => item.id === assignment.appId);
      const environmentId = typeof assignment.environmentId === "string" ? assignment.environmentId : "";
      const environmentExists = application.environments.some((environment) => environment.id === environmentId);
      return {
        appId: assignment.appId,
        environmentId: environmentExists ? environmentId : "",
        capabilities: [...new Set((Array.isArray(assignment.capabilities) ? assignment.capabilities : serverCapabilities).filter((item) => serverCapabilities.includes(item)))],
        needsEnvironmentReview: !environmentExists,
      };
    });
    return { ...server, capabilities: serverCapabilities, environmentAssignments };
  }
  const legacyAppIds = Array.isArray(server.appIds) ? server.appIds : [];
  const environmentAssignments = legacyAppIds.map((appId) => {
    const application = applications.find((item) => item.id === appId);
    const environment = application?.environments?.length === 1 ? application.environments[0] : null;
    return {
      appId,
      environmentId: environment?.id ?? "",
      capabilities: [...serverCapabilities],
      needsEnvironmentReview: !environment,
    };
  });
  const { appIds, ...serverRecord } = server;
  return { ...serverRecord, capabilities: serverCapabilities, environmentAssignments };
}

export function validateInfrastructureRegistry(registry, applications) {
  const appById = new Map(applications.map((application) => [application.id, application]));
  const serverIds = new Set();
  for (const server of registry.servers) {
    if (serverIds.has(server.id)) throw new Error(`Duplicate server ${server.id}.`);
    serverIds.add(server.id);
    if (!Array.isArray(server.capabilities) || server.capabilities.some((item) => !capabilityRegistry.includes(item))) {
      throw new Error(`Server ${server.id} has an unknown capability.`);
    }
    for (const assignment of server.environmentAssignments ?? []) {
      const application = appById.get(assignment.appId);
      if (!application) throw new Error(`Server ${server.id} refers to an unknown application.`);
      if (assignment.needsEnvironmentReview && !assignment.environmentId) continue;
      if (!application.environments.some((environment) => environment.id === assignment.environmentId)) {
        throw new Error(`Server ${server.id} refers to an unknown application environment.`);
      }
      if (assignment.capabilities.some((item) => !server.capabilities.includes(item))) {
        throw new Error(`Server ${server.id} assigns a capability it does not provide.`);
      }
    }
  }
  return true;
}
