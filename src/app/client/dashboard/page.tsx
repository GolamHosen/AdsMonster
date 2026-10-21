"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package,
  FileText,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  Printer,
  X,
  CreditCard,
  Building,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

type ClientUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
};

type Order = {
  id: number;
  orderNumber: string;
  packageName: string;
  packageSlug: string;
  price: string;
  amount: number;
  billingCycle: string;
  adNetworks: string;
  monthlyAdSpend: string;
  status: "pending_review" | "active" | "completed" | "cancelled";
  invoiceNumber: string;
  invoiceStatus: string;
  invoiceSentAt: string | null;
  paymentMethod: string;
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  stripeSessionId: string | null;
  paypalOrderId: string | null;
  paidAt: string | null;
  clientNotes: string;
  createdAt: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof Clock }
> = {
  pending_review: {
    label: "Pending Review",
    bg: "bg-amber-100 border-amber-200",
    text: "text-amber-800",
    icon: Clock,
  },
  active: {
    label: "Active & Scaling",
    bg: "bg-emerald-100 border-emerald-200",
    text: "text-emerald-800",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    bg: "bg-sky-100 border-sky-200",
    text: "text-sky-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-100 border-rose-200",
    text: "text-rose-800",
    icon: AlertCircle,
  },
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const [client, setClient] = useState<ClientUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState<Order | null>(null);
  const [sendingInvoiceId, setSendingInvoiceId] = useState<number | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch("/api/client/auth/me");
        if (!authRes.ok) {
          router.push("/client/login");
          return;
        }
        const authData = await authRes.json();
        setClient(authData.client);

        const ordersRes = await fetch("/api/client/orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  async function handlePayWithStripe(order: Order) {
    setPayingOrderId(order.id);
    try {
      const res = await fetch("/api/checkout/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          packageName: order.packageName,
          packageSlug: order.packageSlug,
          price: order.price,
          amount: order.amount,
          billingCycle: order.billingCycle,
          adNetworks: order.adNetworks,
          monthlyAdSpend: order.monthlyAdSpend,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start Stripe checkout");
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error initiating Stripe payment");
    } finally {
      setPayingOrderId(null);
    }
  }

  async function handlePayWithPayPal(order: Order) {
    setPayingOrderId(order.id);
    try {
      const res = await fetch("/api/checkout/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          packageName: order.packageName,
          packageSlug: order.packageSlug,
          price: order.price,
          amount: order.amount,
          billingCycle: order.billingCycle,
          adNetworks: order.adNetworks,
          monthlyAdSpend: order.monthlyAdSpend,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start PayPal checkout");
      if (data.approveUrl) window.location.href = data.approveUrl;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error initiating PayPal payment");
    } finally {
      setPayingOrderId(null);
    }
  }

  async function handleSendInvoice(orderId: number) {
    setSendingInvoiceId(orderId);
    try {
      const res = await fetch(`/api/client/orders/${orderId}/send-invoice`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send invoice");
      }
      showToast(data.message || "Invoice has been sent to your email and the agency!");
      // update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, invoiceSentAt: new Date().toISOString() } : o)),
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error sending invoice");
    } finally {
      setSendingInvoiceId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/client/auth/logout", { method: "POST" });
    router.push("/client/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E8F4F4]">
        <div className="flex items-center gap-3 text-[#104042]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#104042] border-t-transparent" />
          <span className="font-bold">Loading your client portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F7]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#104042] px-5 py-3.5 text-sm font-semibold text-[#AEFF1C] shadow-2xl border border-[#AEFF1C]/30 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[#104042]/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-white px-2 py-1 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="AdsMonster"
                  width={140}
                  height={38}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>
            <span className="hidden sm:inline-block rounded-full bg-[#104042]/10 px-3 py-1 text-xs font-bold text-[#104042]">
              Client Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#104042] px-4 py-2 text-xs font-bold text-[#AEFF1C] shadow-md transition hover:bg-[#0c2f31]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Browse Packages</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-[#104042]/15 bg-gradient-to-r from-[#104042] to-[#0A2627] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/20 border border-[#AEFF1C]/40 px-3 py-1 text-xs font-bold text-[#AEFF1C] mb-3 uppercase tracking-wider">
              Verified Client Portal
            </div>
            <h1 className="text-3xl font-extrabold font-display sm:text-4xl text-white">
              Welcome back, {client?.name || "Client"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
              Track your digital marketing packages, manage your invoices, and request email delivery directly to your inbox and our agency.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-white/70">
              {client?.company && (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  <Building className="h-3.5 w-3.5 text-[#AEFF1C]" />
                  <span>{client.company}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <Mail className="h-3.5 w-3.5 text-[#AEFF1C]" />
                <span>{client?.email}</span>
              </div>
              {client?.phone && (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  <Phone className="h-3.5 w-3.5 text-[#AEFF1C]" />
                  <span>{client.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Purchased Packages
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-[#104042]">
                <Package className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#104042]">{orders.length}</p>
            <p className="mt-1 text-xs text-slate-500">Active campaigns and retainers</p>
          </div>

          <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Campaigns
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-[#006402]">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#006402]">
              {orders.filter((o) => o.status === "active" || o.status === "pending_review").length}
            </p>
            <p className="mt-1 text-xs text-slate-500">In review or scaling across networks</p>
          </div>

          <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Invoices Generated
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <FileText className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#104042]">{orders.length}</p>
            <p className="mt-1 text-xs text-slate-500">Delivered via Nodemailer & stored in Turso</p>
          </div>
        </div>

        {/* Orders & Invoices Section */}
        <div className="mt-10 rounded-3xl border border-[#104042]/10 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#104042] font-display">
                Your Digital Marketing Packages
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review package specifications, campaign status, and email your invoice to yourself and the agency team.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#AEFF1C] px-5 py-2.5 text-xs font-bold text-[#104042] shadow-sm hover:bg-[#9de816] transition"
            >
              <span>+ Add New Package</span>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E8F4F4] text-[#104042]">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#104042]">No packages purchased yet</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Explore our transparent performance tiers (Growth Starter, Scale Accelerator, Enterprise Omnichannel) to launch your ad campaigns.
              </p>
              <div className="mt-6">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#104042] px-6 py-3 text-sm font-bold text-[#AEFF1C] shadow-md transition hover:bg-[#0c2f31]"
                >
                  <span>View Pricing Packages</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {orders.map((order) => {
                const statusMeta = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_review;
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={order.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition hover:border-[#104042]/30 hover:bg-white hover:shadow-md gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xl font-extrabold text-[#104042] font-display">
                          {order.packageName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold ${statusMeta.bg} ${statusMeta.text}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusMeta.label}</span>
                        </span>

                        {order.paymentStatus === "paid" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-[#006402] border border-emerald-300 px-2.5 py-0.5 text-xs font-extrabold">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Paid via {order.paymentMethod === "stripe" ? "Stripe" : order.paymentMethod === "paypal" ? "PayPal" : "Invoice"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-xs font-bold">
                            <AlertCircle className="h-3 w-3 text-rose-500" />
                            <span>Awaiting Payment</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <span className="font-semibold text-[#006402] text-sm">
                          {order.price}
                        </span>
                        <span>&bull;</span>
                        <span>Networks: <strong>{order.adNetworks}</strong></span>
                        <span>&bull;</span>
                        <span>Spend Cap: <strong>{order.monthlyAdSpend}</strong></span>
                        <span>&bull;</span>
                        <span>Order: <strong>#{order.orderNumber}</strong></span>
                        <span>&bull;</span>
                        <span>Invoice: <strong>#{order.invoiceNumber}</strong></span>
                      </div>

                      <p className="text-xs text-slate-400">
                        Purchased on {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {order.invoiceSentAt && (
                          <span className="ml-2 text-emerald-600 font-semibold">
                            &bull; Invoice emailed on {new Date(order.invoiceSentAt).toLocaleDateString()}
                          </span>
                        )}
                        {order.paidAt && (
                          <span className="ml-2 text-emerald-700 font-bold">
                            &bull; Paid on {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
                      {order.paymentStatus !== "paid" && (
                        <>
                          <button
                            onClick={() => handlePayWithStripe(order)}
                            disabled={payingOrderId === order.id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#104042] px-3.5 py-2.5 text-xs font-bold text-[#AEFF1C] shadow-sm hover:bg-[#0c2f31] transition disabled:opacity-50 cursor-pointer"
                            title="Pay instantly with Credit Card, Apple Pay, or Google Pay via Stripe"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>{payingOrderId === order.id ? "Loading..." : "Pay with Card"}</span>
                          </button>

                          <button
                            onClick={() => handlePayWithPayPal(order)}
                            disabled={payingOrderId === order.id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#003087] px-3.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#002568] transition disabled:opacity-50 cursor-pointer"
                            title="Pay with PayPal"
                          >
                            <span className="italic font-extrabold text-[11px]">PP</span>
                            <span>{payingOrderId === order.id ? "Loading..." : "PayPal"}</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleSendInvoice(order.id)}
                        disabled={sendingInvoiceId === order.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
                        title="Resend invoice to your email"
                      >
                        <Mail className="h-3.5 w-3.5 text-teal-600" />
                        <span>
                          {sendingInvoiceId === order.id ? "Sending..." : "Email Invoice"}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveInvoice(order)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-[#104042] shadow-sm hover:bg-slate-50 transition cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-slate-600" />
                        <span>View / Print</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Invoice Modal for Viewing & Printing */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveInvoice(null)}
              className="absolute top-6 right-6 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Printable Invoice Container */}
            <div id="printable-invoice">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <Image
                    src="/logo.png"
                    alt="AdsMonster"
                    width={140}
                    height={40}
                    className="h-9 w-auto object-contain"
                  />
                  <p className="mt-1 text-xs text-slate-500">Performance Digital Advertising Agency</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-[#104042] px-3 py-1 text-xs font-bold text-[#AEFF1C] uppercase tracking-wider">
                    Official Invoice
                  </span>
                  <p className="mt-2 text-sm font-extrabold text-[#104042]">
                    #{activeInvoice.invoiceNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(activeInvoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6 text-xs text-slate-600">
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-400">Billed To:</p>
                  <p className="mt-1 font-bold text-sm text-[#104042]">{client?.name}</p>
                  <p>{client?.company || "Independent Business"}</p>
                  <p>{client?.email}</p>
                  {client?.phone && <p>{client.phone}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold uppercase tracking-wider text-slate-400">Order Ref:</p>
                  <p className="mt-1 font-bold text-sm text-[#104042]">#{activeInvoice.orderNumber}</p>
                  <p>Status: <span className="font-bold text-[#006402] uppercase">{activeInvoice.status.replace("_", " ")}</span></p>
                  <p>Billing: Monthly Retainer</p>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#104042] text-white uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3">Package / Service</th>
                      <th className="p-3">Networks</th>
                      <th className="p-3">Spend Tier</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3.5 font-bold text-[#104042]">
                        {activeInvoice.packageName}
                      </td>
                      <td className="p-3.5 text-slate-600">{activeInvoice.adNetworks}</td>
                      <td className="p-3.5 text-slate-600">{activeInvoice.monthlyAdSpend}</td>
                      <td className="p-3.5 text-right font-extrabold text-[#006402] text-sm">
                        {activeInvoice.price}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-sm">
                      <td colSpan={3} className="p-3.5 text-[#104042]">
                        Total Investment:
                      </td>
                      <td className="p-3.5 text-right text-lg font-extrabold text-[#104042]">
                        {activeInvoice.price}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-2xl bg-teal-50/60 p-4 border border-teal-100 text-xs text-teal-900 leading-relaxed">
                <p className="font-bold text-[#104042]">Campaign Onboarding:</p>
                <p className="mt-1 text-slate-600">
                  Your Senior Strategist will verify pixel/conversion tracking before running ad campaigns. For questions, contact hello@adsmonster.com.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => {
                  handleSendInvoice(activeInvoice.id);
                  setActiveInvoice(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#104042] px-5 py-2.5 text-xs font-bold text-[#AEFF1C] hover:bg-[#0c2f31] cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>Email This Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
