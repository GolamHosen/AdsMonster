import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { clients, clientSessions, type Client } from "@/db/schema";

export const CLIENT_SESSION_COOKIE = "ao_client_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days for clients

function getSecret() {
  const secret =
    process.env.JWT_SECRET ||
    process.env.SESSION_SECRET ||
    "adsmonster-dev-session-secret-change-in-production-32chars";
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error(
      "JWT_SECRET or SESSION_SECRET must be at least 32 characters long in production.",
    );
  }
  return new TextEncoder().encode(secret);
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export type ClientSessionPayload = {
  sid: number;
  clientId: number;
};

export async function createClientSession(clientId: number) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  const userAgent = hdrs.get("user-agent") ?? "unknown";

  const [session] = await db
    .insert(clientSessions)
    .values({ clientId, tokenHash, expiresAt, ip, userAgent })
    .returning({ id: clientSessions.id });

  const jwt = await new SignJWT({
    sid: session.id,
    clientId,
  } satisfies ClientSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(CLIENT_SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  // Update lastLoginAt
  await db
    .update(clients)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(clients.id, clientId));

  return { rawToken, ip };
}

export async function destroyClientSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
  cookieStore.delete(CLIENT_SESSION_COOKIE);

  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sid = (payload as unknown as ClientSessionPayload).sid;
    if (sid) {
      await db
        .update(clientSessions)
        .set({ revokedAt: new Date() })
        .where(eq(clientSessions.id, sid));
    }
  } catch {
    // ignore invalid token on logout
  }
}

export async function getCurrentClient(): Promise<Omit<Client, "passwordHash"> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { sid, clientId } = payload as unknown as ClientSessionPayload;

    const [session] = await db
      .select()
      .from(clientSessions)
      .where(
        and(
          eq(clientSessions.id, sid),
          isNull(clientSessions.revokedAt),
          gt(clientSessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!session) return null;

    const [client] = await db
      .select({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        phone: clients.phone,
        company: clients.company,
        website: clients.website,
        isActive: clients.isActive,
        lastLoginAt: clients.lastLoginAt,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
      })
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (!client || !client.isActive) return null;

    return client;
  } catch {
    return null;
  }
}

export async function requireClient() {
  const client = await getCurrentClient();
  if (!client) {
    throw new Error("UNAUTHORIZED");
  }
  return client;
}
