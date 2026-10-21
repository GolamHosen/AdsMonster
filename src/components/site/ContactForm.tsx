"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { triggerConfetti } from "@/components/animations/confetti";
import { GorgeousButton } from "@/components/ui/GorgeousButton";

const SERVICE_OPTIONS = [
  "Google Ads",
  "Meta Ads (FB & IG)",
  "YouTube Advertising",
  "TikTok Ads",
  "LinkedIn Ads",
  "Landing Page / CRO",
  "Full Funnel Omnichannel",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      company: data.get("company"),
      serviceInterest: data.get("serviceInterest"),
      budget: data.get("budget"),
      message: data.get("message"),
      website: data.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      triggerConfetti();
      form.reset();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-[#AEFF1C]/30 bg-[#104042] p-10 text-center shadow-xl backdrop-blur-md text-white"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <CheckCircle2 className="h-12 w-12 text-[#AEFF1C]" />
        </motion.div>
        <p className="text-xl font-bold text-white font-display">Thanks for reaching out!</p>
        <p className="text-sm text-white/70 max-w-sm">
          Our senior ad strategist will review your brand and get back to you within one business day with your custom scaling roadmap.
        </p>
        <div className="mt-3">
          <GorgeousButton
            type="button"
            onClick={() => setStatus("idle")}
            variant="primary"
            size="sm"
          >
            Send another message
          </GorgeousButton>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-[#104042]/10 bg-white p-7 sm:p-8 shadow-sm">
      {/* Honeypot field - hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
            Full Name *
          </label>
          <input
            name="name"
            required
            minLength={2}
            maxLength={160}
            className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            maxLength={160}
            className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
            Phone
          </label>
          <input
            name="phone"
            maxLength={40}
            className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
            placeholder="+1 555 010 2030"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
            Company
          </label>
          <input
            name="company"
            maxLength={160}
            className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
            Service Interested In
          </label>
          <select
            name="serviceInterest"
            className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
            defaultValue=""
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
            Monthly Budget
          </label>
          <input
            name="budget"
            maxLength={80}
            className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
            placeholder="$2,000 - $10,000+"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#104042]">
          Message
        </label>
        <textarea
          name="message"
          rows={4}
          maxLength={4000}
          className="w-full rounded-xl border border-[#104042]/15 bg-[#E8F4F4]/20 px-4 py-2.5 text-sm text-[#104042] outline-none transition focus:border-[#104042] focus:bg-white focus:ring-2 focus:ring-[#AEFF1C]/30"
          placeholder="Tell us about your current campaigns and scaling goals..."
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-500/20">
          {errorMessage}
        </p>
      )}

      <div className="pt-2">
        <GorgeousButton
          type="submit"
          disabled={status === "loading"}
          variant="primary"
          size="lg"
          icon={status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
        >
          {status === "loading" ? "Sending Request..." : "Request Free Strategy Call"}
        </GorgeousButton>
      </div>
    </form>
  );
}
