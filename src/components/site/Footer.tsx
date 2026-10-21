"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { siteSettings } from "@/db/schema";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

type Settings = typeof siteSettings.$inferSelect;

const FOOTER_SERVICES = [
  { slug: "google-pay-per-click-ads", label: "Google Pay Per Click Ads" },
  { slug: "google-search-ads", label: "Google Search Ads" },
  { slug: "meta-ads", label: "Meta Ads" },
  { slug: "tiktok-ads", label: "TikTok Ads" },
  { slug: "youtube-ads", label: "YouTube Ads" },
  { slug: "linkden-ads", label: "LinkedIn Ads" },
  { slug: "search-engine-optimization", label: "Search Engine Optimization" },
];

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c3234] py-16 text-white/70 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-block group">
              <div className="flex items-center justify-center rounded-2xl bg-white px-3.5 py-2 shadow-md transition-all group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt={settings.siteName}
                  width={260}
                  height={80}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {settings.heroSubtext}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {[FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon].map((Icon, i) => (
                <motion.a
                  key={i}
                  href={
                    [settings.facebookUrl, settings.instagramUrl, settings.linkedinUrl, settings.twitterUrl][i]
                  }
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-[#AEFF1C]/50 hover:bg-[#AEFF1C]/15 hover:text-[#AEFF1C]"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white font-display">Navigation</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-[#AEFF1C] transition">Home</Link></li>
              <li><Link href="/services" className="hover:text-[#AEFF1C] transition">All Services</Link></li>
              <li><Link href="/pricing" className="hover:text-[#AEFF1C] transition">Our Pricing</Link></li>
              <li><Link href="/about" className="hover:text-[#AEFF1C] transition">About Us</Link></li>
              <li><Link href="/#why-us" className="hover:text-[#AEFF1C] transition">Why Choose Us</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[#AEFF1C] transition">How It Works</Link></li>
              <li><Link href="/testimonials" className="hover:text-[#AEFF1C] transition">Testimonials</Link></li>
              <li><Link href="/contact" className="hover:text-[#AEFF1C] transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Paid Media Services */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white font-display">Ad Services</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FOOTER_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center gap-1 hover:text-[#AEFF1C] transition"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white font-display">Direct Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="text-white/80 hover:text-[#AEFF1C] transition">
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.contactPhone}`} className="text-white/80 hover:text-[#AEFF1C] transition">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="text-white/60 leading-relaxed">{settings.contactAddress}</li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#AEFF1C]/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#AEFF1C] border border-[#AEFF1C]/30 hover:bg-[#AEFF1C] hover:text-[#104042] transition"
                >
                  Request Audit &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {year} {settings.siteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-[#AEFF1C] transition cursor-pointer"
            >
              Back to Top ↑
            </button>
            <Link href="/admin/login" className="transition hover:text-[#AEFF1C]">
              Admin Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

