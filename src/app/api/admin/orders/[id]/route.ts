import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packageOrders, packageOrderStatuses } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

const updateOrderSchema = z.object({
  status: z.enum(packageOrderStatuses).optional(),
  adminNotes: z.string().optional(),
  invoiceStatus: z.enum(["sent", "pending", "paid"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid", "failed", "refunded"]).optional(),
  paymentMethod: z.enum(["stripe", "paypal", "manual_invoice"]).optional(),
});

export async function PATCH(
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

    const body = await req.json();
    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 400 },
      );
    }

    const updates = {
      ...parsed.data,
      updatedAt: new Date(),
    };

    const [updatedOrder] = await db
      .update(packageOrders)
      .set(updates)
      .where(eq(packageOrders.id, orderId))
      .returning();

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("[Admin Order PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
