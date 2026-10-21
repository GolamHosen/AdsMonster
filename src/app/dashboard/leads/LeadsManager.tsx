"use client";

import { useMemo, useState } from "react";
import { Trash2, Mail, Phone, Search } from "lucide-react";
import type { leads } from "@/db/schema";

type Lead = typeof leads.$inferSelect;
type LeadStatus = Lead["status"];

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-sky-100 text-sky-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-violet-100 text-violet-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

export function LeadsManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [leadsList, setLeadsList] = useState(initialLeads);
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return leadsList.filter((lead) => {
      const matchesStatus = filter === "all" || lead.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.company.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [leadsList, filter, query]);

  async function updateStatus(id: number, status: LeadStatus) {
    setBusyId(id);
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLeadsList((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
    setBusyId(null);
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead permanently?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLeadsList((prev) => prev.filter((l) => l.id !== id));
    }
    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            All ({leadsList.length})
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
                filter === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {status} ({leadsList.filter((l) => l.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-slate-900">{lead.name}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      STATUS_STYLES[lead.status] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {lead.email}
                  </span>
                  {lead.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {lead.phone}
                    </span>
                  )}
                  {lead.company && <span>{lead.company}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  disabled={busyId === lead.id}
                  onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold capitalize outline-none focus:border-emerald-400"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => deleteLead(lead.id)}
                  disabled={busyId === lead.id}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                  aria-label="Delete lead"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {(lead.serviceInterest || lead.budget) && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                {lead.serviceInterest && (
                  <span>
                    <strong className="font-semibold text-slate-700">Service:</strong> {lead.serviceInterest}
                  </span>
                )}
                {lead.budget && (
                  <span>
                    <strong className="font-semibold text-slate-700">Budget:</strong> {lead.budget}
                  </span>
                )}
              </div>
            )}

            {lead.message && (
              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{lead.message}</p>
            )}

            <p className="mt-3 text-xs text-slate-400">
              Received {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
            No leads match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
