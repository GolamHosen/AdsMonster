import "server-only";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function requireAdminApi() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      admin: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }
  return { admin, response: null } as const;
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
