import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { howItWorksSteps, auditLogs } from "@/db/schema";
import { stepSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const stepId = Number(id);
  if (!Number.isInteger(stepId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = stepSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const [updated] = await db
    .update(howItWorksSteps)
    .set(parsed.data)
    .where(eq(howItWorksSteps.id, stepId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Step not found" }, { status: 404 });
  }

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "step",
    entityId: String(stepId),
  });

  return NextResponse.json({ step: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const stepId = Number(id);
  if (!Number.isInteger(stepId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(howItWorksSteps).where(eq(howItWorksSteps.id, stepId));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "delete",
    entity: "step",
    entityId: String(stepId),
  });

  return NextResponse.json({ ok: true });
}
