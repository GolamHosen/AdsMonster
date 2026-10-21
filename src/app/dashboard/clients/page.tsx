"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  Package,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  packagesPurchased: number;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  async function loadClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Registered Clients</h1>
          <p className="mt-1 text-sm text-slate-500">
            View all client accounts, company credentials, and their digital marketing package history.
          </p>
        </div>

        <button
          onClick={loadClients}
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
          placeholder="Search by client name, email, or company..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none"
        />
      </div>

      {/* Clients Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Packages</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading clients from Turso database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No clients found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/60 transition cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{client.name}</div>
                      <div className="text-xs text-slate-400">ID #{client.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {client.company || <span className="text-slate-400 italic">Not set</span>}
                      </div>
                      {client.website && (
                        <div className="text-xs text-teal-600 hover:underline">
                          {client.website}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700 border border-teal-100">
                        <Package className="h-3 w-3" />
                        <span>{client.packagesPurchased} bought</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {client.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-100">
                          <XCircle className="h-3 w-3" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(client.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Client Profile #{selectedClient.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedClient.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Email Address</p>
                  <p className="mt-1 font-bold text-slate-800">{selectedClient.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Phone</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedClient.phone || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Company</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedClient.company || "Independent"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Packages Bought</p>
                  <p className="mt-1 font-bold text-emerald-600">
                    {selectedClient.packagesPurchased} Total
                  </p>
                </div>
              </div>

              <div className="p-3 text-xs text-slate-500">
                Registered on: {new Date(selectedClient.createdAt).toLocaleString()}
                {selectedClient.lastLoginAt && (
                  <p className="mt-1">
                    Last logged in: {new Date(selectedClient.lastLoginAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
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
