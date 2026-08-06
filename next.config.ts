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

  /**
   * Keep the platform's deploy URL out of Google's index.
   *
   * Vercel serves a byte-identical copy of the production site on
   * `expendesk-v1.vercel.app`, and that host returns no `X-Robots-Tag` by
   * default — so it is fully crawlable and competes with the real domain for
   * the same content. Historically the sitemap even advertised it as the
   * canonical home of the site.
   *
   * The self-referencing canonical tags added alongside this are the primary
   * consolidation signal; this header is the belt-and-braces version, because
   * a `noindex` on the duplicate is unambiguous where a canonical is only a
   * hint Google may override.
   *
   * Matching on host rather than an env var means it stays correct on preview
   * deploys too, each of which gets its own *.vercel.app hostname.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<deployHost>.*\\.vercel\\.app)',
          },
        ],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
