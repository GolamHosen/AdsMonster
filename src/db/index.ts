import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const rawTursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const rawTursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

const isVercel = Boolean(process.env.VERCEL);

// In cloud/Vercel: database is configured only when a valid TURSO_DATABASE_URL is provided.
// In local development: defaults to configured via file:local.db unless an explicit placeholder is used.
export const isDatabaseConfigured = isVercel
  ? Boolean(
      rawTursoUrl &&
        !rawTursoUrl.includes("your-db-name") &&
        !rawTursoUrl.includes("your-database-name"),
    )
  : !(
      rawTursoUrl &&
      (rawTursoUrl.includes("your-db-name") ||
        rawTursoUrl.includes("your-database-name"))
    );

// In cloud/production: connect to Turso remote url.
// In local development: connect to Turso URL if set, otherwise fallback to local SQLite file.
// On Vercel without Turso URL, use /tmp/local.db to prevent read-only filesystem errors.
const connectionUrl =
  rawTursoUrl && rawTursoUrl.length > 0
    ? rawTursoUrl
    : isVercel
    ? "file:/tmp/local.db"
    : "file:local.db";

const globalForDb = globalThis as typeof globalThis & {
  __tursoClient?: ReturnType<typeof createClient>;
};

export const client =
  globalForDb.__tursoClient ??
  createClient({
    url: connectionUrl,
    authToken: rawTursoToken,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__tursoClient = client;
}

export const db = drizzle(client, { schema });

// Compatibility pool shim for scripts expecting a connection close handle
export const pool = {
  end: async () => {
    client.close();
  },
};
