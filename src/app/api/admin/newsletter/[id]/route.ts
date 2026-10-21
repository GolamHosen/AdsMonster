import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers, auditLogs } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const subscriberId = Number(id);
  if (!Number.isInteger(subscriberId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, subscriberId));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "delete",
    entity: "newsletter_subscriber",
    entityId: String(subscriberId),
  });

  return NextResponse.json({ ok: true });
}
