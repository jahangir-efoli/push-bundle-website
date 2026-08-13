import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Text-heavy UI mockups (hero slider) need sharp output: prefer AVIF, fall
    // back to WebP, then the source. q90 keeps small type legible; Next 16
    // requires every `quality` prop value be allowlisted here.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95, 100],
    remotePatterns: [
      /**
       * CMS media — blog cover images and author avatars.
       *
       * The live push-bundle corpus serves covers from Vercel Blob
       * (`*.public.blob.vercel-storage.com`). `media.efoli.io` (Cloudflare R2) is
       * the CURRENT/target media host; the Blob hostname stays because posts
       * published before the move still carry blob URLs in their `coverImage`
       * field, and dropping it would break every one of them. `cms.efoli.com` is
       * the API host and may also serve some assets directly.
       *
       * ⚠️ This list is only consulted by `next/image`. Images inside post BODIES
       * are plain `<img>` tags (see blog/[slug]/page.tsx) and render from any host
       * regardless — which is why a missing entry here shows up as "cover broken,
       * in-post images fine" rather than as an obviously global failure.
       */
      { protocol: "https", hostname: "mediadev.efoli.io" },
      { protocol: "https", hostname: "media.efoli.io" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "cms.efoli.com" },
    ],
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
