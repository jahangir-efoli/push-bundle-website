import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Text-heavy UI mockups (hero slider) need sharp output: prefer AVIF, fall
    // back to WebP, then the source. q90 keeps small type legible; Next 16
    // requires every `quality` prop value be allowlisted here.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
  },
  // URL scheme is no-trailing-slash (docs/PLAN.md §8). Next auto-301s old
  // trailing-slash URLs, so only non-trivial legacy redirects live here.
  async redirects() {
    return [
      // Old monthly blog archives → the blog index (§8). We don't build these.
      {
        source: "/blog/:year(\\d{4})/:month(\\d{2})",
        destination: "/blog",
        permanent: true,
      },
      // Defensive: plural partners → the canonical singular slug.
      { source: "/partners", destination: "/partner", permanent: true },
      { source: "/partners/:path*", destination: "/partner", permanent: true },
    ];
  },
};

export default nextConfig;
