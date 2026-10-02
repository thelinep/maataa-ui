import { defineConfig } from "prisma/config";

// Validation-only URL. This reserved host cannot point at a production database.
export default defineConfig({
  schema: "schema-sources/authored/maataa-communications-v1/prisma-preview.postgresql.draft.prisma",
  datasource: {
    url: "postgresql://draft-preview:placeholder@invalid.invalid:5432/maataa_preview?schema=public",
  },
});
