"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { GorgeousButton } from "@/components/ui/GorgeousButton";

export type PricingTier = {
  name: string;
  slug: string;
  badge: string;
  price: string;
  amount: number;
  period: string;
  description: string;
  highlight: boolean;
  adNetworks: string;
  monthlyAdSpend: string;
  features: string[];
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Growth Starter",
    slug: "growth-starter",
    badge: "Emerging Brands",
    price: "$1,490",
    amount: 1490,
    period: "/month",
    description: "Ideal for brands launching on 1–2 channels looking for profitable early customer acquisition.",
    highlight: false,
    adNetworks: "Google or Meta Ads",
    monthlyAdSpend: "Up to $10k monthly spend",
    features: [
      "Up to $10k monthly ad spend management",
      "1 Ad Network (Google or Meta)",
      "Weekly bid & keyword optimizations",
      "Bi-weekly creative iteration (4 variations)",
      "Conversion tracking & pixel setup",
      "Standard email & Slack support",
      "Monthly performance review",
    ],
  },
  {
    name: "Scale Accelerator",
    slug: "scale-accelerator",
    badge: "Most Popular",
    price: "$2,950",
    amount: 2950,
    period: "/month",
    description: "Engineered for scaling businesses needing multi-channel omni-presence and aggressive ROAS growth.",
    highlight: true,
    adNetworks: "Google, Meta & TikTok Ads",
    monthlyAdSpend: "Up to $40k monthly spend",
    features: [
      "Up to $40k monthly ad spend management",
      "Up to 3 Ad Networks (Google, Meta, TikTok, etc.)",
      "Advantage+ & Performance Max architecture",
      "Weekly fresh creative production (8 variations)",
      "Server-side Conversions API (CAPI) tracking",
      "Dedicated Senior Ad Strategist",
      "Real-time 24/7 custom dashboard",
      "Weekly strategy sync calls",
    ],
  },
  {
    name: "Enterprise Omnichannel",
    slug: "enterprise-omnichannel",
    badge: "High Volume",
    price: "$4,900",
    amount: 4900,
    period: "/month",
    description: "Full-funnel agency partnership for high-growth enterprises seeking category dominance.",
    highlight: false,
    adNetworks: "All Networks (Google, Meta, TikTok, YT, LinkedIn)",
    monthlyAdSpend: "$50k+ monthly ad spend",
    features: [
      "$50k+ monthly ad spend management",
      "All Ad Networks (Google, Meta, TikTok, YT, LinkedIn)",
      "Custom landing page CRO & A/B testing",
      "Unlimited creative refresh sprint cycles",
      "Offline CRM conversion & lead value attribution",
      "Lead Strategist + Creative Director team",
      "Custom Slack channel with 1-hr response time",
      "Strict performance SLA guarantees",
    ],
  },
];

type ClientUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export function PricingCards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [client, setClient] = useState<ClientUser | null>(null);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    orderNumber: string;
    invoiceNumber: string;
    packageName: string;
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "manual_invoice">("stripe");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    // Check if client is logged in
    fetch("/api/client/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.client) {
          setClient(data.client);
          setPhone(data.client.phone || "");
          setCompany(data.client.company || "");
        }
      })
      .catch(() => {});

    // Auto-select tier if passed via URL query
    const targetSlug = searchParams.get("package");
    if (targetSlug) {
      const found = PRICING_TIERS.find(
        (t) => t.slug === targetSlug || t.name.toLowerCase().includes(targetSlug.toLowerCase()),
      );
      if (found) setSelectedTier(found);
    }
  }, [searchParams]);

  function handleSelectPlan(tier: PricingTier) {
    if (!client) {
      // Prompt user to sign up or log in
      router.push(`/client/signup?package=${encodeURIComponent(tier.slug)}`);
      return;
    }
    setCheckoutError(null);
    setSelectedTier(tier);
  }

  async function handleConfirmPurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTier || !client) return;

    setLoading(true);
    setCheckoutError(null);

    const payload = {
      packageName: selectedTier.name,
      packageSlug: selectedTier.slug,
      price: `${selectedTier.price}${selectedTier.period}`,
      amount: selectedTier.amount,
      billingCycle: "monthly",
      adNetworks: selectedTier.adNetworks,
      monthlyAdSpend: selectedTier.monthlyAdSpend,
      clientNotes: notes,
      phone,
      company,
    };

    try {
      if (paymentMethod === "stripe") {
        // Stripe Hosted Checkout
        const res = await fetch("/api/checkout/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to initialize Stripe checkout");
        }
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } else if (paymentMethod === "paypal") {
        // PayPal Orders v2 Checkout
        const res = await fetch("/api/checkout/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to initialize PayPal order");
        }
        if (data.approveUrl) {
          window.location.href = data.approveUrl;
          return;
        }
      } else {
        // Manual Invoice request
        const res = await fetch("/api/client/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, paymentMethod: "manual_invoice" }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to process package purchase");
        }

        setSuccessOrder({
          orderNumber: data.order.orderNumber,
          invoiceNumber: data.order.invoiceNumber,
          packageName: selectedTier.name,
        });
        setSelectedTier(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing checkout";
      setCheckoutError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Tier Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-3 items-stretch">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all ${
              tier.highlight
                ? "bg-[#104042] text-white shadow-2xl border-2 border-[#AEFF1C]/50 scale-[1.03]"
                : "bg-white text-[#5E5E5E] border border-[#104042]/10 shadow-sm hover:shadow-lg"
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3.5 right-8 rounded-full bg-[#AEFF1C] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#104042] shadow-md">
                {tier.badge}
              </div>
            )}

            <div>
              {!tier.highlight && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-3 py-1 rounded-full border border-[#AEFF1C]/30">
                  {tier.badge}
                </span>
              )}
              <h2
                className={`mt-4 text-2xl font-extrabold font-display ${
                  tier.highlight ? "text-white" : "text-[#104042]"
                }`}
              >
                {tier.name}
              </h2>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  tier.highlight ? "text-white/70" : "text-[#5E5E5E]"
                }`}
              >
                {tier.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-5xl font-extrabold font-display ${
                    tier.highlight ? "text-[#AEFF1C]" : "text-[#104042]"
                  }`}
                >
                  {tier.price}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    tier.highlight ? "text-white/60" : "text-[#5E5E5E]"
                  }`}
                >
                  {tier.period}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-black/5 dark:bg-white/5 p-3 text-xs font-semibold">
                <span className={tier.highlight ? "text-[#AEFF1C]" : "text-[#006402]"}>
                  {tier.adNetworks}
                </span>
                <span className="block text-slate-400 mt-0.5">{tier.monthlyAdSpend}</span>
              </div>

              <ul className="mt-6 space-y-3.5 text-sm">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        tier.highlight ? "text-[#AEFF1C]" : "text-[#006402]"
                      }`}
                    />
                    <span className={tier.highlight ? "text-white/90" : "text-[#104042]"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleSelectPlan(tier)}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 font-bold text-sm transition shadow-lg cursor-pointer ${
                  tier.highlight
                    ? "bg-[#AEFF1C] text-[#104042] hover:bg-[#9de816]"
                    : "bg-[#104042] text-[#AEFF1C] hover:bg-[#0c2f31]"
                }`}
              >
                <span>Select & Get Invoice</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase / Checkout Modal */}
      {selectedTier && client && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl text-[#104042] max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTier(null)}
              className="absolute top-6 right-6 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#AEFF1C]/20 border border-[#AEFF1C]/40 px-3 py-1 text-xs font-bold text-[#006402] uppercase tracking-wider">
                Instant Package Activation
              </span>
            </div>

            <h3 className="text-2xl font-extrabold font-display text-[#104042]">
              Order {selectedTier.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Confirm your package details. An itemized invoice will be instantly generated, saved in your database, and emailed to you and our agency.
            </p>

            {/* Selected Package Summary Box */}
            <div className="mt-6 rounded-2xl bg-[#E8F4F4] p-5 border border-[#104042]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-base text-[#104042]">{selectedTier.name}</p>
                  <p className="text-xs text-slate-600">{selectedTier.adNetworks}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[#006402]">
                    {selectedTier.price}
                    <span className="text-xs font-semibold text-slate-500">{selectedTier.period}</span>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmPurchase} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Client Name
                </label>
                <input
                  type="text"
                  disabled
                  value={client.name}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Account Email (Invoice will be sent here)
                </label>
                <input
                  type="email"
                  disabled
                  value={client.email}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                    Company / Brand
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-[#104042] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                    Direct Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-[#104042] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Specific Campaign Goals or Target URLs (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Scaling Shopify e-commerce store with ROAS target > 3.5x"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-[#104042] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042] mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("stripe");
                      setCheckoutError(null);
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 border text-center transition cursor-pointer ${
                      paymentMethod === "stripe"
                        ? "border-[#104042] bg-[#104042]/5 text-[#104042] font-bold shadow-sm ring-2 ring-[#104042]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mb-1 text-[#104042]" />
                    <span className="text-xs font-bold">Stripe Card</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Cards / Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("paypal");
                      setCheckoutError(null);
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 border text-center transition cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "border-[#003087] bg-blue-50/50 text-[#003087] font-bold shadow-sm ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-extrabold text-sm text-[#003087] italic tracking-tight mb-1">
                      Pay<span className="text-[#0079C1]">Pal</span>
                    </div>
                    <span className="text-xs font-bold">PayPal</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Account / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("manual_invoice");
                      setCheckoutError(null);
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 border text-center transition cursor-pointer ${
                      paymentMethod === "manual_invoice"
                        ? "border-[#104042] bg-[#104042]/5 text-[#104042] font-bold shadow-sm ring-2 ring-[#104042]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <FileText className="h-5 w-5 mb-1 text-slate-700" />
                    <span className="text-xs font-bold">Bank Invoice</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Wire Transfer</span>
                  </button>
                </div>
              </div>

              {checkoutError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="block font-bold">Payment Configuration Notice</strong>
                    <span>{checkoutError}</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#104042] py-3.5 px-6 font-bold text-sm text-[#AEFF1C] shadow-lg hover:bg-[#0c2f31] transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Processing Secure Checkout...</span>
                  ) : paymentMethod === "stripe" ? (
                    <>
                      <span>Pay {selectedTier.price} with Stripe</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : paymentMethod === "paypal" ? (
                    <>
                      <span>Pay {selectedTier.price} with PayPal</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Generate & Send Bank Invoice</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#006402]" />
                  SSL Encrypted
                </span>
                <span>&bull;</span>
                <span>Cancel Anytime</span>
                <span>&bull;</span>
                <span>Instant Confirmation</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center text-[#104042]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-[#006402] mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-extrabold font-display">
              Order Confirmed & Invoice Sent!
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Congratulations! Your order for <strong>{successOrder.packageName}</strong> has been registered.
            </p>

            <div className="my-6 rounded-2xl bg-[#E8F4F4] p-4 text-xs font-medium space-y-1">
              <p>Order Reference: <strong className="text-[#104042]">#{successOrder.orderNumber}</strong></p>
              <p>Invoice Number: <strong className="text-[#006402]">#{successOrder.invoiceNumber}</strong></p>
              <p className="text-slate-500">Status: <strong className="text-amber-700">Pending Review & Onboarding</strong></p>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              An official itemized invoice has been dispatched via Nodemailer to your email and the AdsMonster agency team.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href="/client/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#104042] py-3 px-6 text-sm font-bold text-[#AEFF1C] shadow-md hover:bg-[#0c2f31] transition"
              >
                <span>Go to Client Dashboard &rarr;</span>
              </Link>
              <button
                onClick={() => setSuccessOrder(null)}
                className="rounded-xl border border-slate-200 py-2.5 px-6 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
