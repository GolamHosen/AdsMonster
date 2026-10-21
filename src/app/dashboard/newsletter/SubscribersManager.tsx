"use client";

import { useState } from "react";
import { Trash2, Download, Mail } from "lucide-react";
import type { newsletterSubscribers } from "@/db/schema";

type Subscriber = typeof newsletterSubscribers.$inferSelect;

export function SubscribersManager({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [list, setList] = useState(initialSubscribers);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function remove(id: number) {
    if (!confirm("Remove this subscriber?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((s) => s.id !== id));
    }
    setBusyId(null);
  }

  function exportCsv() {
    const header = "email,status,subscribed_at\n";
    const rows = list
      .map((s) => `${s.email},${s.status},${new Date(s.createdAt).toISOString()}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{list.length} total subscribers</p>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Subscribed</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((sub) => (
              <tr key={sub.id} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium text-slate-800">
                  <span className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {sub.email}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      sub.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => remove(sub.id)}
                    disabled={busyId === sub.id}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                    aria-label="Remove subscriber"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
