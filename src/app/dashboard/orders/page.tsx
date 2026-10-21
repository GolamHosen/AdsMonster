"use client";

import { useEffect, useState } from "react";
import {
  Package,
  FileText,
  Mail,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Building,
  User,
  ExternalLink,
  X,
} from "lucide-react";

type Order = {
  id: number;
  orderNumber: string;
  clientId: number;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  clientCompany: string | null;
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
  stripePaymentIntentId: string | null;
  paypalOrderId: string | null;
  paypalCaptureId: string | null;
  paidAt: string | null;
  clientNotes: string;
  adminNotes: string;
  createdAt: string;
};

const STATUS_OPTIONS: { value: Order["status"]; label: string; badge: string }[] = [
  { value: "pending_review", label: "Pending Review", badge: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "active", label: "Active & Scaling", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "completed", label: "Completed", badge: "bg-sky-100 text-sky-800 border-sky-200" },
  { value: "cancelled", label: "Cancelled", badge: "bg-rose-100 text-rose-800 border-rose-200" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function showFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  }

  async function handleStatusChange(orderId: number, newStatus: Order["status"]) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      showFeedback(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleResendInvoice(orderId: number) {
    setResendingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/resend-invoice`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invoice");

      showFeedback(data.message || "Invoice email sent successfully!");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, invoiceSentAt: new Date().toISOString() } : o,
        ),
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error sending invoice");
    } finally {
      setResendingId(null);
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.packageName.toLowerCase().includes(search.toLowerCase()) ||
      (o.clientName && o.clientName.toLowerCase().includes(search.toLowerCase())) ||
      (o.clientEmail && o.clientEmail.toLowerCase().includes(search.toLowerCase())) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.invoiceNumber.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#104042] px-5 py-3.5 text-sm font-semibold text-[#AEFF1C] shadow-2xl border border-[#AEFF1C]/30 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Package Orders & Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track which client bought which digital marketing package, update campaign status, and manage email invoices.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client, package, order # or invoice #..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Package & Retainer</th>
                <th className="py-3 px-4">Invoice # & Order #</th>
                <th className="py-3 px-4">Campaign Status</th>
                <th className="py-3 px-4">Invoice Mail</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading package orders from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No package orders found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const currentStatusConfig =
                    STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {order.clientName || "Unknown Client"}
                        </div>
                        <div className="text-xs text-slate-500">{order.clientEmail}</div>
                        {order.clientCompany && (
                          <div className="text-xs font-semibold text-slate-700 mt-0.5">
                            {order.clientCompany}
                          </div>
                        )}
                      </td>

                      {/* Package */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#104042]">{order.packageName}</div>
                        <div className="text-xs font-extrabold text-[#006402]">{order.price}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {order.adNetworks}
                        </div>
                        <div className="mt-1">
                          {order.paymentStatus === "paid" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-[#006402] border border-emerald-300 px-2 py-0.5 text-[11px] font-bold">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>Paid ({order.paymentMethod === "stripe" ? "Stripe" : order.paymentMethod === "paypal" ? "PayPal" : "Invoice"})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[11px] font-bold">
                              <Clock className="h-3 w-3 text-rose-500" />
                              <span>Unpaid ({order.paymentMethod === "stripe" ? "Stripe" : order.paymentMethod === "paypal" ? "PayPal" : "Invoice"})</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Invoice & Order Ref */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-xs font-mono">
                          #{order.invoiceNumber}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Ref: #{order.orderNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order["status"])
                            }
                            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition focus:outline-none cursor-pointer ${currentStatusConfig.badge}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Invoice Mail Indicator */}
                      <td className="py-3.5 px-4 text-xs">
                        {order.invoiceSentAt ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Emailed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Not emailed</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {order.invoiceSentAt
                            ? new Date(order.invoiceSentAt).toLocaleDateString()
                            : "Pending"}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResendInvoice(order.id)}
                            disabled={resendingId === order.id}
                            title="Resend invoice to client and agency inbox"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                          >
                            <Mail className="h-3 w-3 text-teal-600" />
                            <span>
                              {resendingId === order.id ? "Sending..." : "Resend Mail"}
                            </span>
                          </button>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#104042] px-2.5 py-1 text-xs font-bold text-[#AEFF1C] hover:bg-[#0c2f31] cursor-pointer"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Invoice #{selectedOrder.invoiceNumber}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedOrder.packageName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Name:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.clientEmail}</span>
                </div>
                {selectedOrder.clientPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-bold text-slate-800">{selectedOrder.clientPhone}</span>
                  </div>
                )}
                {selectedOrder.clientCompany && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Company:</span>
                    <span className="font-bold text-slate-800">{selectedOrder.clientCompany}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Package Price:</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedOrder.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supported Networks:</span>
                  <span className="font-medium text-slate-800">{selectedOrder.adNetworks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Spend Tier:</span>
                  <span className="font-medium text-slate-800">{selectedOrder.monthlyAdSpend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Placed:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`font-bold uppercase ${selectedOrder.paymentStatus === "paid" ? "text-emerald-700" : "text-rose-600"}`}>
                    {selectedOrder.paymentStatus || "unpaid"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-bold text-slate-800 capitalize">{selectedOrder.paymentMethod || "manual_invoice"}</span>
                </div>
                {selectedOrder.stripeSessionId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stripe Session:</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[200px]" title={selectedOrder.stripeSessionId}>
                      {selectedOrder.stripeSessionId}
                    </span>
                  </div>
                )}
                {selectedOrder.paypalOrderId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">PayPal Order ID:</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[200px]" title={selectedOrder.paypalOrderId}>
                      {selectedOrder.paypalOrderId}
                    </span>
                  </div>
                )}
                {selectedOrder.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid At:</span>
                    <span className="font-semibold text-emerald-800">
                      {new Date(selectedOrder.paidAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {selectedOrder.clientNotes && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900">
                  <p className="font-bold uppercase tracking-wider text-[11px] text-amber-700 mb-1">
                    Client Goals / Instructions:
                  </p>
                  <p>{selectedOrder.clientNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  handleResendInvoice(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Resend Invoice Email</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
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
