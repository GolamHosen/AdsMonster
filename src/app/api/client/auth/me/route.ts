import { NextResponse } from "next/server";
import { getCurrentClient } from "@/lib/client-auth";

export async function GET() {
  const client = await getCurrentClient();
  if (!client) {
    return NextResponse.json({ authenticated: false, client: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, client });
}
