import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdsMonster – Power your growth with smart ads",
  description:
    "AdsMonster is a results-driven digital advertising agency specializing in Google, Meta, YouTube, TikTok and LinkedIn Ads to help brands scale faster and smarter.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Radio+Canada+Big:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#E8F4F4] text-[#5E5E5E] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
