import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
