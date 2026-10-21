import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { getCurrentClient } from "@/lib/client-auth";
import { capturePayPalOrder } from "@/lib/paypal";
import { sendPaymentConfirmationEmail } from "@/lib/mail";

const captureSchema = z.object({
  paypalOrderId: z.string().min(1, "PayPal Order ID is required"),
  orderId: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = captureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid capture data" },
        { status: 400 },
      );
    }

    const { paypalOrderId, orderId } = parsed.data;

    // Capture payment with PayPal REST API
    const captureResult = await capturePayPalOrder(paypalOrderId);

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: `Payment was not completed by PayPal (Status: ${captureResult.status})`,
        },
        { status: 400 },
      );
    }

    // Find the matching package order in our DB
    const [order] = await db
      .select()
      .from(packageOrders)
      .where(
        orderId
          ? eq(packageOrders.id, orderId)
          : eq(packageOrders.paypalOrderId, paypalOrderId),
      )
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 },
      );
    }

    // Mark as paid and active
    const [updatedOrder] = await db
      .update(packageOrders)
      .set({
        paymentStatus: "paid",
        invoiceStatus: "paid",
        status: "active",
        paypalCaptureId: captureResult.captureId,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(packageOrders.id, order.id))
      .returning();

    // Send confirmation email
    await sendPaymentConfirmationEmail({
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      packageName: order.packageName,
      amountPaid: order.price,
      paymentMethod: "paypal",
      transactionId: captureResult.captureId || paypalOrderId,
      clientName: client.name,
      clientEmail: client.email,
      clientCompany: client.company,
      billingCycle: order.billingCycle,
      paidAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "PayPal payment captured successfully!",
      order: updatedOrder,
      captureId: captureResult.captureId,
    });
  } catch (error) {
    console.error("[PayPal Capture Route Error]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to capture PayPal payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
