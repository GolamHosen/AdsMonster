import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET() {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.adminId, admin!.id))
    .orderBy(desc(sessions.createdAt));

  return NextResponse.json({ sessions: rows });
}
