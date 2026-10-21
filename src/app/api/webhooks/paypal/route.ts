import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { sendPaymentConfirmationEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const event = await req.json();

    const eventType = event.event_type;
    console.log(`[PayPal Webhook] Received event: ${eventType}`);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;
      const customId = resource.custom_id; // Contains orderNumber if set
      const captureId = resource.id;

      let order = null;

      if (customId) {
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(eq(packageOrders.orderNumber, customId))
          .limit(1);
        order = found;
      }

      // If not found by custom_id, check by paypalOrderId
      if (!order && resource.supplementary_data?.related_ids?.order_id) {
        const payPalOrderId =
          resource.supplementary_data.related_ids.order_id;
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(eq(packageOrders.paypalOrderId, payPalOrderId))
          .limit(1);
        order = found;
      }

      if (order && order.paymentStatus !== "paid") {
        await db
          .update(packageOrders)
          .set({
            paymentStatus: "paid",
            invoiceStatus: "paid",
            status: "active",
            paypalCaptureId: captureId,
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(packageOrders.id, order.id));

        const [client] = await db
          .select()
          .from(clients)
          .where(eq(clients.id, order.clientId))
          .limit(1);

        if (client) {
          await sendPaymentConfirmationEmail({
            orderNumber: order.orderNumber,
            invoiceNumber: order.invoiceNumber,
            packageName: order.packageName,
            amountPaid: order.price,
            paymentMethod: "paypal",
            transactionId: captureId,
            clientName: client.name,
            clientEmail: client.email,
            clientCompany: client.company,
            billingCycle: order.billingCycle,
            paidAt: new Date(),
          });
        }

        console.log(
          `[PayPal Webhook] Order #${order.orderNumber} updated to PAID via webhook.`,
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PayPal Webhook Error]:", error);
    return NextResponse.json(
      { error: "PayPal webhook processing failed" },
      { status: 500 },
    );
  }
}
