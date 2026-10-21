"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import type { services } from "@/db/schema";
import { availableIconNames, getIcon } from "@/lib/icon-map";

type Service = typeof services.$inferSelect;

type FormState = {
  id: number | null;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  slug: "",
  description: "",
  icon: "Megaphone",
  order: 0,
  published: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [list, setList] = useState(initialServices);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  function openCreate() {
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEdit(service: Service) {
    setForm({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      order: service.order,
      published: service.published,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      icon: form.icon,
      order: form.order,
      published: form.published,
    };

    const url = form.id ? `/api/admin/services/${form.id}` : "/api/admin/services";
    const method = form.id ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to save service.");
        setSaving(false);
        return;
      }

      if (form.id) {
        setList((prev) => prev.map((s) => (s.id === form.id ? json.service : s)));
      } else {
        setList((prev) => [...prev, json.service].sort((a, b) => a.order - b.order));
      }

      setShowForm(false);
      setSaving(false);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this service?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((s) => s.id !== id));
    }
    setBusyId(null);
  }

  async function togglePublished(service: Service) {
    setBusyId(service.id);
    const res = await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, published: !service.published }),
    });
    if (res.ok) {
      const json = await res.json();
      setList((prev) => prev.map((s) => (s.id === service.id ? json.service : s)));
    }
    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{service.title}</p>
                    <p className="text-xs text-slate-400">/{service.slug}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    service.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {service.published ? "Published" : "Hidden"}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{service.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => openEdit(service)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => togglePublished(service)}
                  disabled={busyId === service.id}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {service.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(service.id)}
                  disabled={busyId === service.id}
                  className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600"
                  aria-label="Delete service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
            No services yet. Add your first one.
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {form.id ? "Edit Service" : "New Service"}
              </h3>
              <button onClick={() => setShowForm(false)} aria-label="Close">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="auto-generated from title if left blank"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  >
                    {availableIconNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                Published (visible on website)
              </label>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={saving || !form.title || !form.description}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
