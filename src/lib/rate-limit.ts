import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { rateLimits } from "@/db/schema";

/**
 * Simple fixed-window rate limiter backed by Postgres so it works correctly
 * across serverless instances / restarts, protecting login and public forms
 * from brute force and spam abuse.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!isDatabaseConfigured) {
    return { allowed: true, remaining: limit };
  }

  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    const existing = await db
      .select()
      .from(rateLimits)
      .where(and(eq(rateLimits.bucketKey, key), gt(rateLimits.windowStart, windowStart)))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(rateLimits).values({ bucketKey: key, count: 1, windowStart: now });
      // best-effort cleanup of stale rows for this key
      await db
        .delete(rateLimits)
        .where(and(eq(rateLimits.bucketKey, key), sql`${rateLimits.windowStart} <= ${windowStart}`));
      return { allowed: true, remaining: limit - 1 };
    }

    const row = existing[0];
    if (row.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    await db
      .update(rateLimits)
      .set({ count: row.count + 1 })
      .where(eq(rateLimits.id, row.id));

    return { allowed: true, remaining: limit - row.count - 1 };
  } catch (err) {
    console.warn("[RateLimit] Database error, bypassing rate limit check:", err);
    return { allowed: true, remaining: limit };
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
