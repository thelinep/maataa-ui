import { defineConfig } from "prisma/config";

// Validation-only URL. `prisma validate` does not connect to this local file.
export default defineConfig({
  schema: "schema-sources/authored/maataa-communications-v1/prisma-preview.sqlite.draft.prisma",
  datasource: {
    url: "file:./maataa-communications-validation-only.db",
  },
});
