import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials, auditLogs } from "@/db/schema";
import { testimonialSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const testimonialId = Number(id);
  if (!Number.isInteger(testimonialId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const [updated] = await db
    .update(testimonials)
    .set(parsed.data)
    .where(eq(testimonials.id, testimonialId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "testimonial",
    entityId: String(testimonialId),
  });

  return NextResponse.json({ testimonial: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const testimonialId = Number(id);
  if (!Number.isInteger(testimonialId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(testimonials).where(eq(testimonials.id, testimonialId));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "delete",
    entity: "testimonial",
    entityId: String(testimonialId),
  });

  return NextResponse.json({ ok: true });
}
