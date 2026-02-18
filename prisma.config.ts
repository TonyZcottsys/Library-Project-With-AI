import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use DATABASE_URL when set; otherwise fall back to a sensible local default
// so `prisma generate` can run during postinstall without env errors.
const datasourceUrl =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: datasourceUrl
  }
});

