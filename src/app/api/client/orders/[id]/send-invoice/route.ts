import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { getCurrentClient } from "@/lib/client-auth";
import { sendPackageInvoiceEmail } from "@/lib/mail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const [order] = await db
      .select()
      .from(packageOrders)
      .where(and(eq(packageOrders.id, orderId), eq(packageOrders.clientId, client.id)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send package invoice email
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
      message: `Invoice #${order.invoiceNumber} sent successfully to ${client.email} and agency inbox!`,
    });
  } catch (error) {
    console.error("[Send Invoice Error]:", error);
    return NextResponse.json(
      { error: "Failed to send invoice email. Please try again." },
      { status: 500 },
    );
  }
}
