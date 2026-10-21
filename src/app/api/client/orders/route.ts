import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, clients } from "@/db/schema";
import { getCurrentClient } from "@/lib/client-auth";
import { sendPackageInvoiceEmail } from "@/lib/mail";

const createOrderSchema = z.object({
  packageName: z.string().min(1, "Package name is required"),
  packageSlug: z.string().min(1, "Package slug is required"),
  price: z.string().min(1, "Price is required"),
  amount: z.number().optional().default(0),
  billingCycle: z.string().optional().default("monthly"),
  adNetworks: z.string().optional().default("Google Ads, Meta Ads"),
  monthlyAdSpend: z.string().optional().default("Up to $10k"),
  clientNotes: z.string().optional().default(""),
  billingAddress: z.string().optional().default(""),
  taxId: z.string().optional().default(""),
  paymentMethod: z.enum(["stripe", "paypal", "manual_invoice"]).optional().default("manual_invoice"),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export async function GET() {
  try {
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db
      .select()
      .from(packageOrders)
      .where(eq(packageOrders.clientId, client.id))
      .orderBy(desc(packageOrders.createdAt));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[Get Client Orders Error]:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json(
        { error: "You must be signed in to purchase a package." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid package data" },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Optionally update client company/phone if they filled it in during checkout
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

    // Generate unique order and invoice numbers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${Date.now().toString().slice(-5)}${randomSuffix}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;

    const [order] = await db
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
        paymentMethod: data.paymentMethod,
        paymentStatus: "unpaid",
        clientNotes: data.clientNotes,
        billingAddress: data.billingAddress,
        taxId: data.taxId,
      })
      .returning();

    // Send Invoice Email to Admin & Client via Nodemailer
    const emailResult = await sendPackageInvoiceEmail({
      orderNumber,
      invoiceNumber,
      packageName: data.packageName,
      packagePrice: data.price,
      billingCycle: data.billingCycle,
      adNetworks: data.adNetworks,
      monthlyAdSpend: data.monthlyAdSpend,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: data.phone || client.phone,
      clientCompany: data.company || client.company,
      clientWebsite: client.website,
      billingAddress: data.billingAddress,
      taxId: data.taxId,
      clientNotes: data.clientNotes,
      status: "pending_review",
      createdAt: new Date(),
    });

    // Update invoiceSentAt if email succeeded or was recorded
    if (emailResult.adminResult.success || emailResult.clientResult.success) {
      await db
        .update(packageOrders)
        .set({ invoiceSentAt: new Date() })
        .where(eq(packageOrders.id, order.id));
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        invoiceSentAt: new Date(),
      },
      emailResult,
      message: "Package purchased successfully! Your invoice has been emailed to you and the agency.",
    });
  } catch (error) {
    console.error("[Create Order Error]:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 },
    );
  }
}
