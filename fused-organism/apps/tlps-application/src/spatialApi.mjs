export function createSpatialApiClient({ baseUrl, projectId, getAccessToken, fetchImpl = fetch, allowLocalHttp = false, localSession = false }) {
  if (typeof baseUrl !== "string" || !baseUrl.trim()) throw new TypeError("SPATIAL_API_BASE_URL_REQUIRED");
  if (typeof projectId !== "string" || !projectId.trim()) throw new TypeError("SPATIAL_PROJECT_ID_REQUIRED");
  if (!localSession && typeof getAccessToken !== "function") throw new TypeError("HOST_SESSION_ADAPTER_REQUIRED");
  const root = new URL(baseUrl);
  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(root.hostname);
  if (root.protocol !== "https:" && !(allowLocalHttp && root.protocol === "http:" && isLoopback)) {
    throw new TypeError("SPATIAL_API_REQUIRES_HTTPS");
  }

  async function request(path, init = {}, retriedLocalSession = false) {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    if (init.body !== undefined) headers.set("content-type", "application/json");
    if (localSession) {
      headers.delete("authorization");
    } else {
      const accessToken = await getAccessToken();
      if (typeof accessToken !== "string" || accessToken.trim() === "") throw new Error("HOST_SESSION_UNAVAILABLE");
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    const response = await fetchImpl(new URL(path, root), { ...init, headers, credentials: localSession ? "include" : init.credentials });
    if (localSession && response.status === 401 && !retriedLocalSession) {
      localSessionReady = undefined;
      await ensureLocalSession();
      return request(path, init, true);
    }
    let body = null;
    try { body = await response.json(); } catch { /* Empty response is valid for transport errors. */ }
    if (!response.ok) {
      const error = new Error(body?.error || `SPATIAL_API_HTTP_${response.status}`);
      error.status = response.status;
      throw error;
    }
    return body;
  }

  let localSessionReady;
  async function ensureLocalSession() {
    if (!localSession) return;
    if (!localSessionReady) {
      localSessionReady = fetchImpl(new URL("/v1/local-session", root), {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json" },
        body: "{}",
        credentials: "include",
      }).then(async (response) => {
        if (!response.ok) {
          let body = null;
          try { body = await response.json(); } catch { /* The status code remains the useful failure evidence. */ }
          const error = new Error(body?.error || `SPATIAL_API_HTTP_${response.status}`);
          error.status = response.status;
          throw error;
        }
      }).catch((error) => {
        localSessionReady = undefined;
        throw error;
      });
    }
    await localSessionReady;
  }

  return Object.freeze({
    async listLayouts() {
      await ensureLocalSession();
      const response = await request(`/v1/spatial-projects/${encodeURIComponent(projectId)}/layouts`);
      return response.data;
    },
    async createLayout(layout) {
      await ensureLocalSession();
      const response = await request(`/v1/spatial-projects/${encodeURIComponent(projectId)}/layouts`, {
        method: "POST",
        body: JSON.stringify(layout),
      });
      return response.data;
    },
    async updateLayout(layoutId, version, patch) {
      await ensureLocalSession();
      const response = await request(`/v1/spatial-layouts/${encodeURIComponent(layoutId)}`, {
        method: "PATCH",
        headers: { "if-match": String(version) },
        body: JSON.stringify(patch),
      });
      return response.data;
    },
  });
}
