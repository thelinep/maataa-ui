import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSqlContractProposal } from "../src/sql-proposal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [inputFlag, inputPath, sourceFlag, sourceId, fileFlag, sourceFile] = process.argv.slice(2);
if (inputFlag !== "--input" || !inputPath || sourceFlag !== "--source-id" || !sourceId || fileFlag !== "--source-file" || !sourceFile) {
  throw new Error("Usage: node scripts/propose-sql-contracts.mjs --input <local-sql-file> --source-id <registered-source-id> --source-file <repository-relative-path>");
}
const sourceRegistry = JSON.parse(await readFile(path.join(root, "schema-sources/registry.json"), "utf8"));
const records = await Promise.all(sourceRegistry.records.map(async (relative) => JSON.parse(await readFile(path.resolve(root, "schema-sources", relative.replace(/^\.\//, "")), "utf8"))));
const source = records.find((record) => record.id === sourceId);
if (!source) throw new Error(`Schema source ${sourceId} is not registered.`);
const registeredFile = source.files.find((item) => item.path === sourceFile);
if (!registeredFile) throw new Error(`Source file ${sourceFile} is not pinned by ${sourceId}.`);
const bytes = await readFile(path.resolve(inputPath));
const gitBlobSha = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
if (gitBlobSha !== registeredFile.blobSha) throw new Error(`Input file does not match pinned source blob ${registeredFile.blobSha}; got ${gitBlobSha}.`);
const proposal = createSqlContractProposal(bytes.toString("utf8"), { sourceRecord: source, filePath: sourceFile, dialect: "postgresql" });
process.stdout.write(`${JSON.stringify(proposal, null, 2)}\n`);
