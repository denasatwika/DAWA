import type { NextConfig } from "next";

/**
 * Situs dibangun sebagai static export: `next build` menghasilkan folder `out/`
 * berisi HTML/CSS/JS murni yang disajikan Nginx (lihat Dockerfile).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
