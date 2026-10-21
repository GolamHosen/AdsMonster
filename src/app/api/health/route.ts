import { client } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await client.execute("SELECT 1");
    return Response.json({ ok: true, status: "healthy" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unreachable";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

