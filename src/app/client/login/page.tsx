"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

function ClientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/client/dashboard";
  const selectedPackage = searchParams.get("package");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/client/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // If user had selected a package from pricing, send them back to pricing with the package query or straight to checkout
      if (selectedPackage) {
        router.push(`/pricing?package=${encodeURIComponent(selectedPackage)}`);
      } else {
        router.push(redirectTarget);
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#E8F4F4]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="rounded-2xl bg-white p-3 shadow-md border border-[#104042]/10">
            <Image
              src="/logo.png"
              alt="AdsMonster"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </Link>
        <span className="inline-block rounded-full bg-[#AEFF1C]/20 border border-[#AEFF1C]/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#006402] mb-3">
          Client Portal
        </span>
        <h1 className="text-3xl font-extrabold text-[#104042] font-display">
          Sign In to Your Account
        </h1>
        <p className="mt-2 text-sm text-[#104042]/70">
          Access your digital marketing packages, campaign status, and billing invoices.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 shadow-xl">
          {error && (
            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-[#104042] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AEFF1C]/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-11 text-sm font-medium text-slate-900 transition focus:border-[#104042] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AEFF1C]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#104042] px-6 py-3.5 text-sm font-bold text-[#AEFF1C] shadow-lg transition hover:bg-[#0c2f31] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have a client account?{" "}
              <Link
                href={`/client/signup${selectedPackage ? `?package=${encodeURIComponent(selectedPackage)}` : ""}`}
                className="font-bold text-[#006402] hover:underline"
              >
                Sign up here &rarr;
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#104042]/60 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#006402]" />
          <span>Encrypted Turso SQLite &bull; JWT Authenticated &bull; High Security</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E8F4F4] grid place-items-center">Loading...</div>}>
      <ClientLoginForm />
    </Suspense>
  );
}
