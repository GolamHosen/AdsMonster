import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { sendPackageInvoiceEmail } from "@/lib/mail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const [orderWithClient] = await db
      .select({
        order: packageOrders,
        client: clients,
      })
      .from(packageOrders)
      .innerJoin(clients, eq(packageOrders.clientId, clients.id))
      .where(eq(packageOrders.id, orderId))
      .limit(1);

    if (!orderWithClient) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { order, client } = orderWithClient;

    const emailResult = await sendPackageInvoiceEmail({
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      packageName: order.packageName,
      packagePrice: order.price,
      billingCycle: order.billingCycle,
      adNetworks: order.adNetworks,
      monthlyAdSpend: order.monthlyAdSpend,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientCompany: client.company,
      clientWebsite: client.website,
      billingAddress: order.billingAddress,
      taxId: order.taxId,
      clientNotes: order.clientNotes,
      status: order.status,
      createdAt: order.createdAt,
    });

    await db
      .update(packageOrders)
      .set({ invoiceSentAt: new Date(), updatedAt: new Date() })
      .where(eq(packageOrders.id, order.id));

    return NextResponse.json({
      success: true,
      emailResult,
      message: `Invoice #${order.invoiceNumber} resent successfully to ${client.email} and agency inbox!`,
    });
  } catch (error) {
    console.error("[Admin Resend Invoice Error]:", error);
    return NextResponse.json({ error: "Failed to resend invoice" }, { status: 500 });
  }
}
