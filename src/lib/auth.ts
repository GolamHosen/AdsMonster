import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { admins, sessions } from "@/db/schema";

export const SESSION_COOKIE = "ao_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

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

export type SessionPayload = {
  sid: number;
  adminId: number;
};

export async function createSession(adminId: number) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
  const userAgent = hdrs.get("user-agent") ?? "unknown";

  const [session] = await db
    .insert(sessions)
    .values({ adminId, tokenHash, expiresAt, ip, userAgent })
    .returning({ id: sessions.id });

  const jwt = await new SignJWT({ sid: session.id, adminId } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { rawToken, ip };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  cookieStore.delete(SESSION_COOKIE);

  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sid = (payload as unknown as SessionPayload).sid;
    if (sid) {
      await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, sid));
    }
  } catch {
    // ignore invalid token on logout
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { sid, adminId } = payload as unknown as SessionPayload;

    const [session] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sid), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (!session) return null;

    const [admin] = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        isActive: admins.isActive,
      })
      .from(admins)
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!admin || !admin.isActive) return null;

    return admin;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}
