import { site } from "@/lib/site-config";
import type { Post } from "@/lib/cms";

const SITE_URL = "https://pushbundle.com";

/** BlogPosting JSON-LD (docs/PLAN.md §5.7c) — E-E-A-T via author + reviewer. */
export function blogPostingLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", name: post.author.name },
    ...(post.reviewedBy && {
      reviewedBy: { "@type": "Person", name: post.reviewedBy.name },
    }),
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: SITE_URL,
    },
    ...(post.coverImage && { image: post.coverImage }),
  };
}
