import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const isTursoCloud = Boolean(
  tursoUrl &&
  (tursoUrl.startsWith("libsql://") || tursoUrl.includes(".turso.io")),
);

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: isTursoCloud ? "turso" : "sqlite",
  dbCredentials: isTursoCloud
    ? {
        url: tursoUrl!,
        authToken: process.env.TURSO_AUTH_TOKEN?.trim() || "",
      }
    : {
        url: "file:local.db",
      },
});
