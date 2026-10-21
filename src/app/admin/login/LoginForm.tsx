"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = { email: data.get("email"), password: data.get("password") };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Unable to sign in.");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next") ?? "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-white/60">
          Email
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-[#AEFF1C]/50 transition">
          <Mail className="h-4 w-4 text-white/40" />
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            placeholder="admin@adsmonster.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-white/60">
          Password
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-[#AEFF1C]/50 transition">
          <Lock className="h-4 w-4 text-white/40" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-white/40 hover:text-white"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 border border-red-500/20">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#006402] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#006402]/30 border-t border-white/20 transition hover:bg-[#047706] hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
      </button>

      <p className="text-center text-xs text-white/40">
        Protected area. All access attempts are monitored and logged.
      </p>
    </form>
  );
}
