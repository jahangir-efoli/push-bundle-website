import type { Category, Post } from "../types";

/**
 * Demo blog data — seeded from the real page-1 posts captured in
 * docs/PLAN.md §3 (Page 7). Replaced by the CMS API in Phase 9.
 */

const AUTHOR = {
  name: "Syeda Rehnoma Tanzom",
  role: "Content Lead",
  bio: "Syeda writes about Shopify bundling, AOV strategy, and ecommerce growth — turning what works for real merchants into practical, actionable guides.",
};
const REVIEWER = { name: "Technical Support Team", role: "Review" };

const body = (intro: string) => `
<p>${intro}</p>
<h2>Why bundling moves AOV</h2>
<p>Bundles raise average order value by making a larger purchase feel like the
obvious choice, rather than an upsell. The merchants who win treat bundle rules
as merchandising decisions, not technical settings.</p>
<h2>What to configure first</h2>
<p>Start with pack size and variant limits, then layer discounts on top. Placeholder
demo body — real content arrives from the CMS.</p>
`;

export const categories: Category[] = [
  { slug: "case-studies", name: "Case Studies" },
  { slug: "holiday-season", name: "Holiday Season" },
  { slug: "product-bundle", name: "Product Bundle" },
  { slug: "shopify-bundle", name: "Shopify Bundle" },
  { slug: "top-shopify-apps", name: "Top Shopify Apps for Merchants" },
  { slug: "updates", name: "Updates" },
  { slug: "use-case", name: "Use Case" },
];

export const posts: Post[] = [
  {
    slug: "fixed-vs-mix-and-match-bundle",
    title:
      "Fixed vs Mix and Match Bundle: What Shopify's Spring 2026 Update Means for Your Store",
    excerpt:
      "Shopify's Spring 2026 update changes how native bundles behave — here is what it means for fixed and mix-and-match setups.",
    category: "shopify-bundle",
    tags: ["bundles", "shopify"],
    publishedAt: "2026-07-09",
    updatedAt: "2026-07-09",
    readingMinutes: 8,
    reviewedBy: REVIEWER,
  },
  {
    slug: "pushbundle-vs-bundler",
    title: "PushBundle vs Bundler: Which Shopify Bundle App Is Worth It in 2026?",
    excerpt:
      "PushBundle vs Bundler looks like a simple comparison until you build a real bundle campaign with complex product variants.",
    category: "top-shopify-apps",
    tags: ["comparison"],
    publishedAt: "2026-06-30",
    updatedAt: "2026-06-30",
    readingMinutes: 11,
  },
  {
    slug: "best-cross-sell-apps-on-shopify",
    title: "Best Cross-Sell Apps on Shopify in 2026 to Boost AOV Without More Ads",
    excerpt:
      "The best cross-sell apps on Shopify help merchants earn more from the traffic they already paid for.",
    category: "top-shopify-apps",
    tags: ["cross-sell", "aov"],
    publishedAt: "2026-06-29",
    updatedAt: "2026-06-29",
    readingMinutes: 9,
  },
  {
    slug: "shopify-bundle-apps-for-jeans-and-bottoms",
    title: "5 Best Shopify Bundle Apps for Jeans and Bottoms: Sell More in 2026",
    excerpt:
      "The best Shopify bundle apps for jeans and bottoms solve a problem most general bundle lists never mention.",
    category: "use-case",
    tags: ["apparel"],
    publishedAt: "2026-06-29",
    updatedAt: "2026-06-29",
    readingMinutes: 7,
  },
  {
    slug: "shopify-native-bundles-limitations",
    title:
      "Shopify Native Bundles Limitations: Mix and Match, BOGO, and Build-a-Box Explained",
    excerpt:
      "Native Shopify bundles cover the basics. Here is exactly where they stop — and what to do about it.",
    category: "shopify-bundle",
    tags: ["bundles"],
    publishedAt: "2026-06-18",
    updatedAt: "2026-06-18",
    readingMinutes: 10,
    reviewedBy: REVIEWER,
  },
  {
    slug: "shopify-volume-bundle-apps",
    title: "Best Shopify Volume Bundle Apps for B2B and Wholesale Stores in 2026",
    excerpt:
      "The best Shopify volume bundle apps matter because B2B buyers do not shop like casual retail customers.",
    category: "product-bundle",
    tags: ["b2b", "volume"],
    publishedAt: "2026-06-16",
    updatedAt: "2026-06-16",
    readingMinutes: 12,
  },
  {
    slug: "best-byob-shopify-apps",
    title:
      "The Best BYOB Shopify Apps for Merchants Who Want a Real Build-Your-Own Bundle Experience",
    excerpt:
      "Build-your-own-bundle should feel effortless for shoppers and controllable for merchants.",
    category: "top-shopify-apps",
    tags: ["byob"],
    publishedAt: "2026-06-04",
    updatedAt: "2026-06-04",
    readingMinutes: 9,
  },
  {
    slug: "increase-shopify-aov-with-bundle-apps",
    title:
      "How to Increase Shopify AOV with Bundle Apps: Top 5 Compared (No-Code Setup)",
    excerpt:
      "Your Shopify store has a traffic problem. Or at least, that's what you think. You spend money on ads.",
    category: "product-bundle",
    tags: ["aov"],
    publishedAt: "2026-05-26",
    updatedAt: "2026-05-26",
    readingMinutes: 10,
  },
  {
    slug: "what-is-mix-and-match-on-shopify",
    title:
      "What is Mix and Match on Shopify? (And Why Shoppers Keep Coming Back for It)",
    excerpt:
      "If you sell products that naturally come in multiples, and you've tried bundling them with limited results…",
    category: "shopify-bundle",
    tags: ["mix-and-match"],
    publishedAt: "2026-05-21",
    updatedAt: "2026-05-21",
    readingMinutes: 8,
  },
  {
    slug: "chameleon-colors-with-pushbundle",
    title:
      "Chameleon Colors Made $21,946 Letting Customers Build Their Own Color Bundle — Here's Exactly How",
    excerpt:
      "A step-by-step breakdown of the build-your-own-bundle campaign behind $21,946 in revenue.",
    category: "case-studies",
    tags: ["case-study", "byob"],
    publishedAt: "2026-05-13",
    updatedAt: "2026-05-13",
    readingMinutes: 14,
    reviewedBy: REVIEWER,
  },
].map((p) => ({
  ...p,
  author: AUTHOR,
  locale: "en" as const,
  body: body(p.excerpt),
}));
