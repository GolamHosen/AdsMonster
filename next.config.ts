import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/our-services",
        destination: "/services",
      },
      {
        source: "/google-pay-per-click-ads",
        destination: "/services/google-pay-per-click-ads",
      },
      {
        source: "/google-search-ads",
        destination: "/services/google-search-ads",
      },
      {
        source: "/meta-ads",
        destination: "/services/meta-ads",
      },
      {
        source: "/tiktok-ads",
        destination: "/services/tiktok-ads",
      },
      {
        source: "/youtube-ads",
        destination: "/services/youtube-ads",
      },
      {
        source: "/linkden-ads",
        destination: "/services/linkden-ads",
      },
      {
        source: "/linkedin-ads",
        destination: "/services/linkden-ads",
      },
      {
        source: "/search-engine-optimization",
        destination: "/services/search-engine-optimization",
      },
    ];
  },
};

export default nextConfig;
