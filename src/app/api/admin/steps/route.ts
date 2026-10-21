import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { howItWorksSteps, auditLogs } from "@/db/schema";
import { stepSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const rows = await db.select().from(howItWorksSteps).orderBy(asc(howItWorksSteps.order));
  return NextResponse.json({ steps: rows });
}

export async function POST(request: NextRequest) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

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

  const [created] = await db.insert(howItWorksSteps).values(parsed.data).returning();

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "create",
    entity: "step",
    entityId: String(created.id),
  });

  return NextResponse.json({ step: created }, { status: 201 });
}
