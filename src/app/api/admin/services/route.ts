import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { services, auditLogs } from "@/db/schema";
import { serviceSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const rows = await db.select().from(services).orderBy(asc(services.order));
  return NextResponse.json({ services: rows });
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

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  try {
    const [created] = await db.insert(services).values(parsed.data).returning();

    await db.insert(auditLogs).values({
      adminId: admin!.id,
      action: "create",
      entity: "service",
      entityId: String(created.id),
    });

    return NextResponse.json({ service: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("unique")) {
      return NextResponse.json({ error: "A service with that slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create service." }, { status: 500 });
  }
}
