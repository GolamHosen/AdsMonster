import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { constructStripeWebhookEvent } from "@/lib/stripe";
import { sendPaymentConfirmationEmail } from "@/lib/mail";

// Next.js Route Segment Config: ensure raw body is preserved
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    try {
      event = constructStripeWebhookEvent(rawBody, signature);
    } catch (err) {
      console.error("[Stripe Webhook Verification Failed]:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    // Process event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderIdStr =
        session.metadata?.orderId || session.client_reference_id;
      const orderId = orderIdStr ? parseInt(orderIdStr, 10) : null;

      let order = null;

      if (orderId && !isNaN(orderId)) {
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(eq(packageOrders.id, orderId))
          .limit(1);
        order = found;
      } else if (session.id) {
        const [found] = await db
          .select()
          .from(packageOrders)
          .where(eq(packageOrders.stripeSessionId, session.id))
          .limit(1);
        order = found;
      }

      if (order) {
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null;

        // Update order status to paid & active
        const [updatedOrder] = await db
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

        // Fetch client details for email confirmation
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

        console.log(
          `[Stripe Webhook] Order #${order.orderNumber} successfully marked as PAID.`,
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook Handler Error]:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
