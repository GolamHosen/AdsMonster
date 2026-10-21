import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

/**
 * Singleton Stripe SDK instance initialized with server-side secret key.
 * If key is not yet set in .env, this will be null and API calls will provide
 * clear error guidance.
 */
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as unknown as Stripe.LatestApiVersion,
      typescript: true,
      appInfo: {
        name: "AdsMonster Agency Platform",
        version: "1.0.0",
      },
    })
  : null;

export function isStripeConfigured(): boolean {
  return Boolean(
    stripeSecretKey &&
      !stripeSecretKey.includes("your_stripe_secret_key_here") &&
      stripeSecretKey.startsWith("sk_"),
  );
}

export function getStripePublishableKey(): string | null {
  const pk =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.STRIPE_PUBLISHABLE_KEY?.trim();
  if (!pk || pk.includes("your_stripe_publishable_key") || !pk.startsWith("pk_")) {
    return null;
  }
  return pk;
}

export interface CreateStripeSessionParams {
  orderId: number;
  orderNumber: string;
  clientId: number;
  clientEmail: string;
  clientName: string;
  packageName: string;
  packageSlug: string;
  amount: number; // in USD dollars (e.g. 1490)
  billingCycle?: string;
  baseUrl: string;
}

/**
 * Creates a hosted Stripe Checkout Session for digital ad agency packages.
 */
export async function createStripeCheckoutSession({
  orderId,
  orderNumber,
  clientId,
  clientEmail,
  clientName,
  packageName,
  packageSlug,
  amount,
  billingCycle = "monthly",
  baseUrl,
}: CreateStripeSessionParams) {
  if (!stripe || !isStripeConfigured()) {
    throw new Error(
      "Stripe is not configured. Please add STRIPE_SECRET_KEY (sk_test_... or sk_live_...) to your .env file.",
    );
  }

  // Stripe amounts are in integer cents (e.g., $1,490 = 149000 cents)
  const unitAmountInCents = Math.round(amount * 100);

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: clientEmail,
    client_reference_id: String(orderId),
    metadata: {
      orderId: String(orderId),
      orderNumber,
      clientId: String(clientId),
      clientName,
      packageName,
      packageSlug,
      billingCycle,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${packageName} Retainer`,
            description: `Full-funnel advertising management on selected ad networks (${billingCycle})`,
            metadata: {
              orderNumber,
              packageSlug,
            },
          },
          unit_amount: unitAmountInCents,
        },
        quantity: 1,
      },
    ],
    billing_address_collection: "auto",
    success_url: `${cleanBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&method=stripe`,
    cancel_url: `${cleanBaseUrl}/pricing?canceled=true&order=${orderNumber}`,
  });

  return session;
}

/**
 * Retrieve a Stripe Checkout Session to verify payment status.
 */
export async function getStripeCheckoutSession(sessionId: string) {
  if (!stripe || !isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "customer"],
  });
}

/**
 * Verifies a Stripe Webhook signature using the webhook secret.
 */
export function constructStripeWebhookEvent(
  rawBody: string | Buffer,
  signature: string,
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured in .env");
  }
  if (!stripe) {
    throw new Error("Stripe SDK is not initialized.");
  }

  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}
