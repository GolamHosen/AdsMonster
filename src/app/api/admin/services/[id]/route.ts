import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services, auditLogs } from "@/db/schema";
import { serviceSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const serviceId = Number(id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const [updated] = await db
    .update(services)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(services.id, serviceId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "service",
    entityId: String(serviceId),
  });

  return NextResponse.json({ service: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const serviceId = Number(id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(services).where(eq(services.id, serviceId));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "delete",
    entity: "service",
    entityId: String(serviceId),
  });

  return NextResponse.json({ ok: true });
}
