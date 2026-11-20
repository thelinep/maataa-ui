import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiServerUrl = new URL("../../../maataa-api/src/local-server.mjs", import.meta.url);
const { createLocalServer } = await import(apiServerUrl.href);

const { server, database, host, port, databasePath } = await createLocalServer({
  databasePath: path.join(workspaceRoot, ".local-dev", "tlps-spatial-local.db"),
});

console.log(`Local API listening at http://${host}:${port}`);
console.log(`Local SQLite working copy: ${databasePath}`);
console.log("Local development actor is synthetic. This server must never be exposed to a network.");

const stop = () => server.close(() => {
  database.close();
  process.exit(0);
});

process.once("SIGINT", stop);
process.once("SIGTERM", stop);
