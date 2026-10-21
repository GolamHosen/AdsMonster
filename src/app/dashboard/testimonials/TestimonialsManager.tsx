"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Star } from "lucide-react";
import type { testimonials } from "@/db/schema";

type Testimonial = typeof testimonials.$inferSelect;

type FormState = {
  id: number | null;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarSeed: string;
  published: boolean;
  order: number;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  role: "",
  company: "",
  content: "",
  rating: 5,
  avatarSeed: "A",
  published: true,
  order: 0,
};

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [list, setList] = useState(initialTestimonials);
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

  function openEdit(t: Testimonial) {
    setForm({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      rating: t.rating,
      avatarSeed: t.avatarSeed,
      published: t.published,
      order: t.order,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");

    const { id, ...payload } = form;
    const url = id ? `/api/admin/testimonials/${id}` : "/api/admin/testimonials";
    const method = id ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to save testimonial.");
        setSaving(false);
        return;
      }

      if (id) {
        setList((prev) => prev.map((t) => (t.id === id ? json.testimonial : t)));
      } else {
        setList((prev) => [...prev, json.testimonial].sort((a, b) => a.order - b.order));
      }

      setShowForm(false);
      setSaving(false);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) setList((prev) => prev.filter((t) => t.id !== id));
    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-600">&ldquo;{t.content}&rdquo;</p>
            <p className="mt-3 text-sm font-bold text-slate-900">{t.name}</p>
            <p className="text-xs text-slate-500">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  t.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {t.published ? "Published" : "Hidden"}
              </span>
              <button
                onClick={() => openEdit(t)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => remove(t.id)}
                disabled={busyId === t.id}
                className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600"
                aria-label="Delete testimonial"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
            No testimonials yet.
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {form.id ? "Edit Testimonial" : "New Testimonial"}
              </h3>
              <button onClick={() => setShowForm(false)} aria-label="Close">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Star{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Role</label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Company</label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Testimonial</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
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
                disabled={saving || !form.name || !form.content}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
