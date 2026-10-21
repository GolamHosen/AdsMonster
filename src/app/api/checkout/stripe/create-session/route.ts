import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { getCurrentClient } from "@/lib/client-auth";
import { createStripeCheckoutSession, isStripeConfigured } from "@/lib/stripe";

const stripeCheckoutSchema = z.object({
  orderId: z.number().optional(),
  packageName: z.string().min(1, "Package name is required"),
  packageSlug: z.string().min(1, "Package slug is required"),
  price: z.string().min(1, "Price is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  billingCycle: z.string().optional().default("monthly"),
  adNetworks: z.string().optional().default("Google Ads, Meta Ads"),
  monthlyAdSpend: z.string().optional().default("Up to $10k"),
  clientNotes: z.string().optional().default(""),
  billingAddress: z.string().optional().default(""),
  taxId: z.string().optional().default(""),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json(
        { error: "You must be signed in to purchase a package." },
        { status: 401 },
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Stripe is not yet configured. Please set STRIPE_SECRET_KEY in your .env file to enable instant credit/debit card checkout.",
          notConfigured: true,
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = stripeCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid package data" },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Determine application base URL
    const headerOrigin = req.headers.get("origin");
    const headerHost = req.headers.get("host");
    const baseUrl =
      headerOrigin ||
      (headerHost ? `http://${headerHost}` : "") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    // Update phone/company on client profile if provided
    if (data.phone || data.company) {
      await db
        .update(clients)
        .set({
          phone: data.phone || client.phone,
          company: data.company || client.company,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, client.id));
    }

    let order;

    if (data.orderId) {
      // Paying for an existing order/invoice
      const [existing] = await db
        .select()
        .from(packageOrders)
        .where(eq(packageOrders.id, data.orderId))
        .limit(1);

      if (!existing || existing.clientId !== client.id) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      order = existing;
      await db
        .update(packageOrders)
        .set({
          paymentMethod: "stripe",
          updatedAt: new Date(),
        })
        .where(eq(packageOrders.id, existing.id));
    } else {
      // Create new order
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${Date.now().toString().slice(-5)}${randomSuffix}`;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;

      const [newOrder] = await db
        .insert(packageOrders)
        .values({
          orderNumber,
          clientId: client.id,
          packageName: data.packageName,
          packageSlug: data.packageSlug,
          price: data.price,
          amount: data.amount,
          billingCycle: data.billingCycle,
          adNetworks: data.adNetworks,
          monthlyAdSpend: data.monthlyAdSpend,
          status: "pending_review",
          invoiceNumber,
          invoiceStatus: "sent",
          paymentMethod: "stripe",
          paymentStatus: "unpaid",
          clientNotes: data.clientNotes,
          billingAddress: data.billingAddress,
          taxId: data.taxId,
        })
        .returning();

      order = newOrder;
    }

    // Create Stripe Session
    const session = await createStripeCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientId: client.id,
      clientEmail: client.email,
      clientName: client.name,
      packageName: data.packageName,
      packageSlug: data.packageSlug,
      amount: data.amount,
      billingCycle: data.billingCycle,
      baseUrl,
    });

    // Save stripe session id
    await db
      .update(packageOrders)
      .set({
        stripeSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(packageOrders.id, order.id));

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("[Stripe Create Session Error]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to initiate Stripe checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
