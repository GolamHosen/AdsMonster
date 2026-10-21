"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  Briefcase,
  MessageSquareQuote,
  BarChart3,
  ListOrdered,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  UserCheck,
  Package,
} from "lucide-react";

type Admin = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: UserCheck },
  { href: "/dashboard/orders", label: "Package Orders", icon: Package },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/newsletter", label: "Newsletter", icon: Mail },
  { href: "/dashboard/services", label: "Services", icon: Briefcase },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
  { href: "/dashboard/how-it-works", label: "How It Works", icon: ListOrdered },
  { href: "/dashboard/settings", label: "Site Settings", icon: Settings },
  { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
];

export function DashboardShell({ admin, children }: { admin: Admin; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#E8F4F4]/60">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[#104042]/10 bg-[#104042] text-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-xl bg-white px-2.5 py-1.5 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="AdsMonster"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#AEFF1C] text-[#104042] shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/"
              target="_blank"
              className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-[#AEFF1C] transition"
            >
              <ExternalLink className="h-4 w-4" />
              View Website
            </Link>
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#104042]/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#104042]/10 bg-white/80 px-6 backdrop-blur">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5 text-[#104042]" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-[#104042]">{admin.name}</p>
                <p className="text-xs capitalize text-[#5E5E5E]">{admin.role}</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#104042] text-xs font-extrabold text-[#AEFF1C] shadow-sm">
                {admin.name.slice(0, 1).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-[#104042]/15 px-3 py-2 text-xs font-semibold text-[#104042] transition hover:bg-[#E8F4F4]"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
