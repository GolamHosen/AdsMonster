"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Clock,
  AlertCircle,
  Package,
} from "lucide-react";

type OrderDetails = {
  id: number;
  orderNumber: string;
  invoiceNumber: string;
  packageName: string;
  price: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  adNetworks: string;
  monthlyAdSpend: string;
  paidAt: string | null;
  createdAt: string;
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const method = searchParams.get("method") || "stripe";
  const orderRef = searchParams.get("order_ref");
  const paypalToken = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        const queryParams = new URLSearchParams();
        if (sessionId) queryParams.set("session_id", sessionId);
        if (method) queryParams.set("method", method);
        if (orderRef) queryParams.set("order_ref", orderRef);
        if (paypalToken) queryParams.set("token", paypalToken);

        const res = await fetch(`/api/checkout/verify?${queryParams.toString()}`);
        const data = await res.json();

        if (res.ok && data.order) {
          setOrder(data.order);
          // Trigger celebratory confetti burst
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#AEFF1C", "#104042", "#006402", "#ffffff", "#0284c7"],
            });
          } catch {
            // Ignore confetti errors if canvas unavailable
          }
        } else {
          setError(data.error || "Payment verification in progress.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Unable to verify payment status automatically.");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId, method, orderRef, paypalToken]);

  return (
    <div className="min-h-screen bg-[#0b2223] text-white flex flex-col justify-between selection:bg-[#AEFF1C] selection:text-[#104042]">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#082021]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-white px-2 py-1">
              <Image
                src="/logo.png"
                alt="AdsMonster"
                width={130}
                height={35}
                className="h-7 w-auto object-contain"
              />
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
            <ShieldCheck className="h-4 w-4 text-[#AEFF1C]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 my-10">
        <div className="w-full max-w-2xl bg-white text-[#104042] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Top Decorative Banner */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#104042] via-[#AEFF1C] to-[#006402]" />

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#104042] border-t-[#AEFF1C]" />
              <h2 className="text-xl font-bold font-display text-[#104042]">
                Verifying Your Payment...
              </h2>
              <p className="text-xs text-slate-500">
                Confirming transaction status with {method === "paypal" ? "PayPal" : "Stripe"}.
              </p>
            </div>
          ) : (
            <div>
              {/* Success Badge */}
              <div className="text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-[#006402] ring-8 ring-emerald-50/50 mb-5">
                  <CheckCircle2 className="h-10 w-10 text-[#006402]" />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#AEFF1C]/30 border border-[#AEFF1C] px-3.5 py-1 text-xs font-extrabold text-[#006402] uppercase tracking-wider mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Payment Confirmed & Retainer Activated</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#104042]">
                  Welcome to AdsMonster!
                </h1>
                <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
                  Your payment has been successfully recorded. An official receipt has been emailed to your account and our campaign management team.
                </p>
              </div>

              {/* Order Details Card */}
              {order ? (
                <div className="mt-8 rounded-2xl bg-[#E8F4F4] p-6 border border-[#104042]/15 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#104042]/10 gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Selected Package
                      </span>
                      <p className="text-xl font-extrabold text-[#104042]">
                        {order.packageName}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Total Investment
                      </span>
                      <p className="text-2xl font-extrabold text-[#006402]">
                        {order.price}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Order Ref:</span>
                      <strong className="text-slate-900 font-mono">#{order.orderNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Invoice Ref:</span>
                      <strong className="text-slate-900 font-mono">#{order.invoiceNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Method:</span>
                      <strong className="text-slate-900 capitalize">
                        {order.paymentMethod === "stripe"
                          ? "Card (Stripe)"
                          : order.paymentMethod === "paypal"
                          ? "PayPal"
                          : "Invoice"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status:</span>
                      <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 font-extrabold text-emerald-800">
                        PAID & ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold">Transaction Recorded</p>
                  <p className="mt-1 text-slate-600">
                    Your payment was received. If your dashboard does not update immediately, webhooks will synchronize it momentarily.
                  </p>
                </div>
              )}

              {/* What Happens Next Steps */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#104042]" />
                  <span>Next Steps for Campaign Launch</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                    <p className="font-bold text-[#104042]">1. Strategist Assignment</p>
                    <p className="text-slate-500 mt-0.5">
                      Your Senior Strategist will review your ad accounts and landing pages within 24 hours.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                    <p className="font-bold text-[#104042]">2. Tracking & Creatives</p>
                    <p className="text-slate-500 mt-0.5">
                      We set up conversion APIs, verify pixels, and formulate initial ad copy iterations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/client/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#104042] px-8 py-3.5 text-sm font-bold text-[#AEFF1C] shadow-lg hover:bg-[#0c2f31] transition"
                >
                  <span>Go to Client Portal &rarr;</span>
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span>Return Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-white/50 border-t border-white/10">
        &copy; {new Date().getFullYear()} AdsMonster Performance Advertising Agency.
      </footer>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b2223] flex items-center justify-center text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#AEFF1C] border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
