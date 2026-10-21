import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { createClientSession } from "@/lib/client-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional().default(""),
  company: z.string().trim().optional().default(""),
  website: z.string().trim().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = await checkRateLimit(`client_signup:${ip}`, 10, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 400 },
      );
    }

    const { name, email, password, phone, company, website } = parsed.data;

    // Check if client email already exists
    const [existing] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new client
    const [newClient] = await db
      .insert(clients)
      .values({
        name,
        email,
        passwordHash,
        phone,
        company,
        website,
        isActive: true,
      })
      .returning({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        phone: clients.phone,
        company: clients.company,
        website: clients.website,
        createdAt: clients.createdAt,
      });

    // Create session cookie
    await createClientSession(newClient.id);

    return NextResponse.json({
      success: true,
      client: newClient,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("[Client Signup Error]:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 },
    );
  }
}
