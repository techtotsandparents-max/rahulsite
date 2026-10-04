import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // ── Image Optimization — Whitelisted Remote Domains ──
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "rahulsitefiles.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
      },
    ],
  },

  // ── Security Headers (applied to all routes) ──
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // ── Standalone output for Azure Web App deployment ──
  output: "standalone",
};

export default nextConfig;
