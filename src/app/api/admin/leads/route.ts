import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET(_request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return NextResponse.json({ leads: rows });
}
