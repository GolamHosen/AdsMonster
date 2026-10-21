import { NextResponse } from "next/server";
import { desc, eq, count, sql } from "drizzle-orm";
import { db } from "@/db";
import { clients, packageOrders } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const allClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        phone: clients.phone,
        company: clients.company,
        website: clients.website,
        isActive: clients.isActive,
        lastLoginAt: clients.lastLoginAt,
        createdAt: clients.createdAt,
      })
      .from(clients)
      .orderBy(desc(clients.createdAt));

    // Get order counts for each client
    const orderStats = await db
      .select({
        clientId: packageOrders.clientId,
        orderCount: count(packageOrders.id),
      })
      .from(packageOrders)
      .groupBy(packageOrders.clientId);

    const orderMap = new Map<number, number>();
    for (const stat of orderStats) {
      orderMap.set(stat.clientId, stat.orderCount);
    }

    const clientsWithStats = allClients.map((c) => ({
      ...c,
      packagesPurchased: orderMap.get(c.id) || 0,
    }));

    return NextResponse.json({ clients: clientsWithStats });
  } catch (error) {
    console.error("[Admin Clients GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}
