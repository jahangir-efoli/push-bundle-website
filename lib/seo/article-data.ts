import { site } from "@/lib/site-config";
import { REVIEW_TEAM_NAME } from "@/lib/blog/review";
import type { Post } from "@/lib/cms";

const SITE_URL = "https://pushbundle.com";

/** BlogPosting JSON-LD (docs/PLAN.md §5.7c) — E-E-A-T via author + reviewer. */
export function blogPostingLd(post: Post) {
  // Every post carries the standing Technical Support Team review (matches the
  // on-page disclosure); a per-post CMS reviewer, when present, is credited too.
  const teamReviewer = {
    "@type": "Organization",
    name: REVIEW_TEAM_NAME,
    url: SITE_URL,
  };
  const reviewedBy = post.reviewedBy
    ? [{ "@type": "Person", name: post.reviewedBy.name }, teamReviewer]
    : teamReviewer;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", name: post.author.name },
    reviewedBy,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: SITE_URL,
    },
    ...(post.coverImage && { image: post.coverImage }),
  };
}
