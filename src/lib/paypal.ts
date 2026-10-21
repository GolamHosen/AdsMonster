/**
 * PayPal REST API v2 Integration Helper
 * Supports both Sandbox (testing) and Live production modes.
 */

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

export function getPayPalMode(): "sandbox" | "live" {
  return process.env.PAYPAL_MODE?.toLowerCase() === "live" ? "live" : "sandbox";
}

export function getPayPalBaseUrl(): string {
  return getPayPalMode() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function isPayPalConfigured(): boolean {
  const clientId =
    process.env.PAYPAL_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  return Boolean(
    clientId &&
      secret &&
      !clientId.includes("your_paypal_client_id") &&
      !secret.includes("your_paypal_client_secret"),
  );
}

export function getPayPalClientId(): string | null {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ||
    process.env.PAYPAL_CLIENT_ID?.trim();
  if (
    !clientId ||
    clientId.includes("your_paypal_client_id") ||
    clientId.length < 10
  ) {
    return null;
  }
  return clientId;
}

/**
 * Fetch a PayPal OAuth2 Access Token using client credentials.
 * Automatically caches token until 60 seconds before expiration.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId =
    process.env.PAYPAL_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !secret || !isPayPalConfigured()) {
    throw new Error(
      "PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env",
    );
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const authHeader = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const baseUrl = getPayPalBaseUrl();

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[PayPal OAuth Error]:", res.status, errorText);
    throw new Error(`Failed to authenticate with PayPal: ${res.statusText}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600) * 1000,
  };

  return cachedToken.token;
}

export interface CreatePayPalOrderParams {
  orderId: number;
  orderNumber: string;
  packageName: string;
  amount: number; // e.g. 1490
  currency?: string;
  baseUrl: string;
}

/**
 * Create a PayPal v2 Checkout Order
 */
export async function createPayPalOrder({
  orderId,
  orderNumber,
  packageName,
  amount,
  currency = "USD",
  baseUrl,
}: CreatePayPalOrderParams) {
  const token = await getPayPalAccessToken();
  const apiBase = getPayPalBaseUrl();
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: String(orderId),
        custom_id: orderNumber,
        description: `${packageName} Performance Marketing Package`,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
    application_context: {
      brand_name: "AdsMonster Agency",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${cleanBaseUrl}/checkout/success?method=paypal&order_ref=${orderNumber}`,
      cancel_url: `${cleanBaseUrl}/pricing?canceled=true&order=${orderNumber}`,
    },
  };

  const res = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("[PayPal Create Order Error]:", errorData);
    throw new Error(
      errorData.message ||
        `Failed to create PayPal order (Status ${res.status})`,
    );
  }

  const orderData = await res.json();
  const approveLink = orderData.links?.find(
    (l: { rel: string; href: string }) => l.rel === "approve",
  )?.href;

  return {
    id: orderData.id as string,
    status: orderData.status as string,
    approveUrl: approveLink || null,
    links: orderData.links,
  };
}

/**
 * Capture payment for an approved PayPal order
 */
export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalAccessToken();
  const apiBase = getPayPalBaseUrl();

  const res = await fetch(
    `${apiBase}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    },
  );

  const captureData = await res.json();

  if (!res.ok) {
    console.error("[PayPal Capture Error]:", captureData);
    throw new Error(
      captureData.message ||
        `Failed to capture PayPal order (Status ${res.status})`,
    );
  }

  const capture =
    captureData.purchase_units?.[0]?.payments?.captures?.[0] || null;

  return {
    orderId: captureData.id as string,
    status: captureData.status as string, // "COMPLETED"
    captureId: (capture?.id as string) || null,
    amount: capture?.amount?.value || null,
    payer: captureData.payer,
    raw: captureData,
  };
}

/**
 * Get details of an existing PayPal order
 */
export async function getPayPalOrderDetails(paypalOrderId: string) {
  const token = await getPayPalAccessToken();
  const apiBase = getPayPalBaseUrl();

  const res = await fetch(
    `${apiBase}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get PayPal order: ${errorText}`);
  }

  return res.json();
}

/**
 * Verify incoming webhook signature from PayPal
 */
export async function verifyPayPalWebhookSignature({
  authAlgo,
  certUrl,
  transmissionId,
  transmissionSig,
  transmissionTime,
  webhookId,
  webhookEvent,
}: {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId: string;
  webhookEvent: Record<string, unknown>;
}) {
  const token = await getPayPalAccessToken();
  const apiBase = getPayPalBaseUrl();

  const res = await fetch(
    `${apiBase}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    },
  );

  if (!res.ok) {
    return false;
  }

  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}
