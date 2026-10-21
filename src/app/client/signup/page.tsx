"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";

function ClientSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPackage = searchParams.get("package");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/client/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      if (selectedPackage) {
        router.push(`/pricing?package=${encodeURIComponent(selectedPackage)}`);
      } else {
        router.push("/client/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#E8F4F4]">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
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
          Get Started
        </span>
        <h1 className="text-3xl font-extrabold text-[#104042] font-display">
          Create Your Client Account
        </h1>
        <p className="mt-2 text-sm text-[#104042]/70">
          Sign up to purchase performance advertising packages and receive itemized email invoices.
        </p>

        {selectedPackage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#104042] text-white px-4 py-2 text-xs font-semibold shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-[#AEFF1C]" />
            <span>Target Package: <strong className="text-[#AEFF1C]">{selectedPackage}</strong></span>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 shadow-xl">
          {error && (
            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-[#104042] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AEFF1C]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Scaling Co."
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-[#104042] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AEFF1C]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-[#104042] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AEFF1C]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-[#104042] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AEFF1C]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#104042]">
                Create Password *
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#104042] px-6 py-3.5 text-sm font-bold text-[#AEFF1C] shadow-lg transition hover:bg-[#0c2f31] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href={`/client/login${selectedPackage ? `?package=${encodeURIComponent(selectedPackage)}` : ""}`}
                className="font-bold text-[#006402] hover:underline"
              >
                Sign in here &rarr;
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#104042]/60 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#006402]" />
          <span>All client credentials securely stored in Turso database.</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E8F4F4] grid place-items-center">Loading...</div>}>
      <ClientSignupForm />
    </Suspense>
  );
}
