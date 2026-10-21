import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { getStripeCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { capturePayPalOrder, getPayPalOrderDetails, isPayPalConfigured } from "@/lib/paypal";
import { sendPaymentConfirmationEmail } from "@/lib/mail";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const method = searchParams.get("method") || "stripe";
    const orderRef = searchParams.get("order_ref");
    const paypalToken = searchParams.get("token"); // PayPal appends ?token=<order_id>

    // 1. Stripe verification
    if (method === "stripe" && sessionId) {
      if (!isStripeConfigured()) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
      }

      const session = await getStripeCheckoutSession(sessionId);
      const isPaid = session.payment_status === "paid";

      const orderIdStr = session.metadata?.orderId || session.client_reference_id;
      const orderId = orderIdStr ? parseInt(orderIdStr, 10) : null;

      let order = null;
      if (orderId && !isNaN(orderId)) {
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(eq(packageOrders.id, orderId))
          .limit(1);
        order = found;
      } else {
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(eq(packageOrders.stripeSessionId, sessionId))
          .limit(1);
        order = found;
      }

      if (order && isPaid && order.paymentStatus !== "paid") {
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent as { id?: string })?.id || null;

        const [updated] = await db
          .update(packageOrders)
          .set({
            paymentStatus: "paid",
            invoiceStatus: "paid",
            status: "active",
            stripePaymentIntentId: paymentIntentId,
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(packageOrders.id, order.id))
          .returning();

        order = updated;

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
            paymentMethod: "stripe",
            transactionId: paymentIntentId || session.id,
            clientName: client.name,
            clientEmail: client.email,
            clientCompany: client.company,
            billingCycle: order.billingCycle,
            paidAt: new Date(),
          });
        }
      }

      return NextResponse.json({
        success: true,
        method: "stripe",
        isPaid,
        order,
      });
    }

    // 2. PayPal verification
    if (method === "paypal") {
      const targetPaypalId = paypalToken;

      let order = null;

      // If user returned from PayPal with approval token, attempt auto-capture
      if (targetPaypalId && isPayPalConfigured()) {
        try {
          const captureResult = await capturePayPalOrder(targetPaypalId);
          if (captureResult.status === "COMPLETED") {
            const [found] = await db
              .select()
              .from(packageOrders)
              .where(
                or(
                  eq(packageOrders.paypalOrderId, targetPaypalId),
                  orderRef ? eq(packageOrders.orderNumber, orderRef) : undefined,
                ),
              )
              .limit(1);

            if (found) {
              const [updated] = await db
                .update(packageOrders)
                .set({
                  paymentStatus: "paid",
                  invoiceStatus: "paid",
                  status: "active",
                  paypalCaptureId: captureResult.captureId,
                  paidAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(packageOrders.id, found.id))
                .returning();

              order = updated;

              const [client] = await db
                .select()
                .from(clients)
                .where(eq(clients.id, found.clientId))
                .limit(1);

              if (client) {
                await sendPaymentConfirmationEmail({
                  orderNumber: found.orderNumber,
                  invoiceNumber: found.invoiceNumber,
                  packageName: found.packageName,
                  amountPaid: found.price,
                  paymentMethod: "paypal",
                  transactionId: captureResult.captureId || targetPaypalId,
                  clientName: client.name,
                  clientEmail: client.email,
                  clientCompany: client.company,
                  billingCycle: found.billingCycle,
                  paidAt: new Date(),
                });
              }
            }
          }
        } catch (captureErr) {
          console.warn("[PayPal Verify capture warning]:", captureErr);
        }
      }

      // If not captured yet or already captured, find by orderRef or token
      if (!order && (orderRef || targetPaypalId)) {
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(
            or(
              orderRef ? eq(packageOrders.orderNumber, orderRef) : undefined,
              targetPaypalId ? eq(packageOrders.paypalOrderId, targetPaypalId) : undefined,
            ),
          )
          .limit(1);
        order = found;
      }

      return NextResponse.json({
        success: true,
        method: "paypal",
        isPaid: order?.paymentStatus === "paid",
        order,
      });
    }

    return NextResponse.json({ error: "Invalid verification query" }, { status: 400 });
  } catch (error) {
    console.error("[Checkout Verify Error]:", error);
    return NextResponse.json({ error: "Failed to verify checkout" }, { status: 500 });
  }
}
