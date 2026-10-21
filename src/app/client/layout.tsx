import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal | AdsMonster",
  description: "Manage your digital marketing packages, ad campaign status, and invoices.",
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0F7F7] text-[#104042]">
      {children}
    </div>
  );
}
