import type { NextConfig } from "next";

/**
 * Host of the headless WordPress that serves blog content — featured images
 * are optimised through next/image, which only allows allowlisted hosts.
 * Follows WORDPRESS_API_URL so a CMS domain change is a single env edit.
 */
const FALLBACK_WORDPRESS_HOST = "lightseagreen-chough-517020.hostingersite.com";
const wordpressHost = (() => {
  try {
    return new URL(process.env.WORDPRESS_API_URL ?? "").hostname;
  } catch {
    return FALLBACK_WORDPRESS_HOST;
  }
})();

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHost,
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
