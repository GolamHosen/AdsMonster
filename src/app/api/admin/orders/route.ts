import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const orders = await db
      .select({
        id: packageOrders.id,
        orderNumber: packageOrders.orderNumber,
        clientId: packageOrders.clientId,
        packageName: packageOrders.packageName,
        packageSlug: packageOrders.packageSlug,
        price: packageOrders.price,
        amount: packageOrders.amount,
        billingCycle: packageOrders.billingCycle,
        adNetworks: packageOrders.adNetworks,
        monthlyAdSpend: packageOrders.monthlyAdSpend,
        status: packageOrders.status,
        invoiceNumber: packageOrders.invoiceNumber,
        invoiceStatus: packageOrders.invoiceStatus,
        invoiceSentAt: packageOrders.invoiceSentAt,
        paymentMethod: packageOrders.paymentMethod,
        paymentStatus: packageOrders.paymentStatus,
        stripeSessionId: packageOrders.stripeSessionId,
        stripePaymentIntentId: packageOrders.stripePaymentIntentId,
        paypalOrderId: packageOrders.paypalOrderId,
        paypalCaptureId: packageOrders.paypalCaptureId,
        paidAt: packageOrders.paidAt,
        clientNotes: packageOrders.clientNotes,
        adminNotes: packageOrders.adminNotes,
        billingAddress: packageOrders.billingAddress,
        taxId: packageOrders.taxId,
        createdAt: packageOrders.createdAt,
        updatedAt: packageOrders.updatedAt,
        clientName: clients.name,
        clientEmail: clients.email,
        clientPhone: clients.phone,
        clientCompany: clients.company,
      })
      .from(packageOrders)
      .leftJoin(clients, eq(packageOrders.clientId, clients.id))
      .orderBy(desc(packageOrders.createdAt));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[Admin Orders GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
