"use client";

import { useState, type FormEvent } from "react";
import { Mail, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { siteSettings } from "@/db/schema";
import { triggerConfetti } from "@/components/animations/confetti";
import { GorgeousButton } from "@/components/ui/GorgeousButton";

type Settings = typeof siteSettings.$inferSelect;

export function Newsletter({ settings }: { settings: Settings }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const data = new FormData(e.currentTarget);
    const payload = { email: data.get("email"), website: data.get("website") };

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setMessage(json.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setMessage(json.message ?? "You're subscribed! Check your inbox soon.");
      setStatus("success");
      triggerConfetti();
      e.currentTarget.reset();
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#104042] py-20 text-white">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#AEFF1C]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#006402]/15 blur-3xl" />

      <motion.div
        className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-[#AEFF1C]/15 backdrop-blur-md text-[#AEFF1C] shadow-xl">
          <Mail className="h-8 w-8" />
        </span>

        <h2 className="text-3xl font-extrabold text-white sm:text-4xl font-display max-w-2xl">
          {settings.newsletterTitle}
        </h2>

        <p className="max-w-lg text-white/60 text-sm sm:text-base">
          Get weekly paid ads playbooks, creative teardowns, and actionable scaling frameworks straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row mt-2">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <input
            type="email"
            name="email"
            required
            maxLength={160}
            placeholder="Enter your work email..."
            className="w-full rounded-[10px] border border-white/15 bg-white/95 px-5 py-3.5 text-sm text-[#104042] shadow-inner outline-none transition focus:bg-white focus:ring-4 focus:ring-[#AEFF1C]/30"
          />
          <GorgeousButton
            type="submit"
            disabled={status === "loading"}
            variant="primary"
            size="md"
            icon={status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </GorgeousButton>
        </form>

        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-full bg-[#AEFF1C]/20 px-4 py-2 text-sm font-semibold text-[#AEFF1C] backdrop-blur-md"
          >
            <CheckCircle2 className="h-4 w-4" /> {message}
          </motion.p>
        )}

        {status === "error" && (
          <p className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
            {message}
          </p>
        )}
      </motion.div>
    </section>
  );
}
