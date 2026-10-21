import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const rawTursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const rawTursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

// Database is always configured: either via TURSO_DATABASE_URL (cloud) or local file:local.db fallback.
// Set to false only when TURSO_DATABASE_URL contains a placeholder value.
export const isDatabaseConfigured = !(
  rawTursoUrl && rawTursoUrl.includes("your-db-name")
);

// In cloud/production: connect to Turso remote url.
// In local development: connect to Turso URL if set, otherwise fallback to local SQLite file.
const connectionUrl =
  rawTursoUrl && rawTursoUrl.length > 0
    ? rawTursoUrl
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
