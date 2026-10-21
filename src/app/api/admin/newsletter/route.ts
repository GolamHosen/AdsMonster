import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));
  return NextResponse.json({ subscribers: rows });
}
