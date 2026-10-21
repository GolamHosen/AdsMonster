import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings, auditLogs } from "@/db/schema";
import { settingsSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";
import { eq } from "drizzle-orm";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const [settings] = await db.select().from(siteSettings).limit(1);
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const [existing] = await db.select().from(siteSettings).limit(1);

  let updated;
  if (existing) {
    [updated] = await db
      .update(siteSettings)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing.id))
      .returning();
  } else {
    [updated] = await db.insert(siteSettings).values(parsed.data).returning();
  }

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "site_settings",
  });

  return NextResponse.json({ settings: updated });
}
