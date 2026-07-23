import type {
  ChangelogEntry,
  DocArticle,
  FaqItem,
  Partner,
  Review,
} from "../types";

/**
 * Demo data for docs, FAQ, changelog, partners and reviews — seeded from the
 * real content captured in docs/PLAN.md §3 and the Shopify listing (§1).
 * Replaced by the CMS API in Phase 9.
 */

const en = "en" as const;

// ---- Docs (§3 Page 6) -----------------------------------------------------
const docBody = `
<p>Demo documentation body. Real content arrives from the CMS.</p>
<h2>Steps</h2>
<ol><li>Open the PushBundle dashboard.</li><li>Create a bundle.</li><li>Publish and preview.</li></ol>
`;

export const docs: DocArticle[] = [
  {
    slug: "installation",
    title: "Installation",
    category: "getting-started",
    categoryName: "Getting Started",
    order: 1,
  },
  {
    slug: "add-app-block-to-shopify-theme",
    title: "How to Add the PushBundle App Block to Your Shopify Theme?",
    category: "getting-started",
    categoryName: "Getting Started",
    order: 2,
  },
  {
    slug: "mix-and-match-single-product",
    title: "Mix and Match Single Product",
    category: "setup-process",
    categoryName: "Setup Process",
    order: 1,
  },
  {
    slug: "how-to-setup-volume-bundle",
    title: "How to setup volume bundle?",
    category: "setup-process",
    categoryName: "Setup Process",
    order: 2,
  },
  {
    slug: "quantity-restriction-per-variant",
    title: "How to apply quantity restriction on each variants?",
    category: "setup-process",
    categoryName: "Setup Process",
    order: 3,
  },
  {
    slug: "discount-for-mix-and-match-bundle",
    title: "How to offer discount for Mix and Match bundle?",
    category: "setup-process",
    categoryName: "Setup Process",
    order: 4,
  },
  {
    slug: "number-of-variants-and-quantity-limits",
    title: "What is 'Number of Variants' and 'Quantity per Variants' limit?",
    category: "setup-process",
    categoryName: "Setup Process",
    order: 5,
  },
].map((d) => ({ ...d, body: docBody, updatedAt: "2026-06-01", locale: en }));

// ---- FAQ (§3 Page 8) ------------------------------------------------------
// NOTE: the live site's answers are placeholder-duplicated. Items flagged with
// needsRealAnswer still require real copy from the client (§9 #3).
export const faqs: FaqItem[] = [
  {
    slug: "what-types-of-bundles",
    question: "What types of bundles can I create with PushBundle?",
    answer:
      "You can create mix-and-match (build-a-box) bundles, volume/quantity-tier bundles, fixed product bundles, and cross-sell bundles — all without code.",
    category: "bundles-features",
    order: 1,
  },
  {
    slug: "shopper-chosen-variants",
    question: "Can shoppers choose their own product variants for a bundle?",
    answer:
      "Yes. Shoppers build their own pack by picking variants, while you control pack size, per-variant quantity limits, and which variants are eligible.",
    category: "bundles-features",
    order: 2,
    needsRealAnswer: true,
  },
  {
    slug: "bundle-discounts",
    question: "Does PushBundle support discounts for bundles?",
    answer:
      "Yes — percentage or fixed discounts, discounts on a fixed quantity, and custom quantity ranges. You can also apply a flat total discount or a per-variant discount.",
    category: "discounts-pricing",
    order: 1,
    needsRealAnswer: true,
  },
  {
    slug: "easy-to-set-up",
    question: "Is PushBundle easy to set up on my Shopify store?",
    answer:
      "Install from the Shopify App Store, enable the app embed, and add the PushBundle app block to your theme. A guided setup walks you through it.",
    category: "getting-started",
    order: 1,
  },
  {
    slug: "limit-to-collections",
    question: "Can I limit bundle discounts to specific collections or products?",
    answer:
      "Yes. Bundles can be targeted by collection, product, tag, vendor, or product type, and restricted to specific customers or customer tags.",
    category: "discounts-pricing",
    order: 2,
    needsRealAnswer: true,
  },
  {
    slug: "free-plan",
    question: "Is there a free plan?",
    answer:
      "Yes — the Starter plan is free forever and includes volume bundles, discount rules, display styles, and live preview.",
    category: "billing-plans",
    order: 1,
  },
  {
    slug: "free-trial",
    question: "How does the 14-day free trial work?",
    answer:
      "Every new store gets a 14-day free trial with full access to the Growth plan. You are not charged until the trial ends.",
    category: "billing-plans",
    order: 2,
  },
  {
    slug: "shopify-plus-pos",
    question: "Does PushBundle work with Shopify Plus, POS, and Markets?",
    answer:
      "Yes. PushBundle works with Checkout, Shopify POS, Shopify Admin, and Markets (multi-currency), and is Built for Shopify.",
    category: "compatibility-support",
    order: 1,
  },
].map((f) => ({ ...f, locale: en }));

export const faqCategories = [
  { slug: "getting-started", name: "Getting Started" },
  { slug: "bundles-features", name: "Bundles & Features" },
  { slug: "discounts-pricing", name: "Discounts & Pricing" },
  { slug: "billing-plans", name: "Billing & Plans" },
  { slug: "compatibility-support", name: "Compatibility & Support" },
];

// ---- Changelog (§3 Page 10) ----------------------------------------------
// Typed seed so `category` is checked against ChangelogCategory rather than
// being widened to `string` by the trailing .map().
const changelogSeed: Omit<ChangelogEntry, "locale">[] = [
  {
    slug: "images-in-volume-bundle-packs",
    title: "Images Can be Added to Volume Bundle Packs",
    category: "Improved",
    date: "2026-03-26",
    body: "Upload and display images for each quantity pack in Volume Bundles. Visual bundle packs help customers compare options faster.",
  },
  {
    slug: "advanced-offer-options",
    title: "Enhanced Volume Bundles with Advanced Offer Options",
    category: "New Feature",
    date: "2026-03-22",
    body: "Volume Bundles now support Free Shipping, Free Gifts, and price discounts combined.",
  },
  {
    slug: "volume-bundle-selection-methods",
    title: "New Volume Bundle Selection Methods (Conventional & Modern)",
    category: "New Feature",
    date: "2026-03-18",
    body: "The Modern method simplifies variant selection with flexible quantities in a single streamlined interface.",
  },
  {
    slug: "redesigned-volume-bundle-flow",
    title: "Redesigned Volume Bundle Creation Flow",
    category: "Improved",
    date: "2026-03-15",
    body: "A simpler setup process helps merchants create volume bundles faster with fewer errors.",
  },
  {
    slug: "cross-sell-stability",
    title: "Cross-Sell Bundle Stability Improvements",
    category: "Fixed",
    date: "2026-03-05",
    body: "Resolved Cross-Sell Bundle issues, improving display and functionality reliability across stores.",
  },
  {
    slug: "installation-and-trial-experience",
    title: "Improved Installation & Free Trial Experience",
    category: "Improved",
    date: "2026-02-17",
    body: "Every new store automatically receives a 14-day free trial with full access to the app's maximum plan.",
  },
  {
    slug: "built-for-shopify",
    title: "PushBundle is Now Built for Shopify",
    category: "Recognition",
    date: "2026-01-28",
    body: "The Built for Shopify badge highlights apps that provide a trusted, high-quality experience within the Shopify ecosystem.",
  },
  {
    slug: "guided-setup",
    title: "Guided Setup for Faster Onboarding",
    category: "New Feature",
    date: "2026-01-15",
    body: "Added a setup guide with step-by-step instructions and progress checkboxes on the dashboard.",
  },
  {
    slug: "dashboard-app-embed",
    title: "Dashboard Improvements for App Embed & App Blocks",
    category: "Improved",
    date: "2026-01-08",
    body: "View App Embed status, track available and in-use app blocks, and enable App Embed from the dashboard.",
  },
  {
    slug: "performance-optimization",
    title: "Performance Optimization Improvements",
    category: "Improved",
    date: "2025-12-30",
    body: "Quicker loading bundles and a more responsive experience for merchants and customers.",
  },
  {
    slug: "volume-bundle-quantity-one",
    title: "Volume Bundles Now Support Quantity Starting at 1",
    category: "Fixed",
    date: "2025-12-05",
    body: "Resolved an issue preventing a quantity tier of 1; bundles now support flexible pricing from a single unit.",
  },
  {
    slug: "cleaner-price-display",
    title: "Cleaner Price Display on Product Pages",
    category: "Improved",
    date: "2025-12-01",
    body: "Removed unnecessary formatting artifacts from custom HTML pricing settings.",
  },
  {
    slug: "fixed-pricing-calculation",
    title: "Improved Bundle Price Calculation for Fixed Pricing",
    category: "Improved",
    date: "2025-11-10",
    body: "Uses fractional value distribution instead of modulus rounding for more accurate pricing.",
  },
  {
    slug: "cross-sell-bundles",
    title: "Cross-Sell Bundles – Recommend. Pair. Convert.",
    category: "New Feature",
    date: "2025-09-25",
    body: "Create bundles that suggest complementary products — one of the most effective ways to boost average order value.",
  },
  {
    slug: "mix-and-match-multi-product",
    title: "Mix & Match Multi-Product Bundles",
    category: "New Feature",
    date: "2025-07-30",
    body: "Customers select a bundle size then mix and match items, with variant limits, per-variant quantities, and fixed or percentage discounts.",
  },
  {
    slug: "initial-release",
    title: "First version of Push Bundle app for Shopify released",
    category: "Launch",
    // Shopify App Store is the source of truth for the launch date (§9).
    date: "2025-06-23",
    body: "Volume bundles, Mix & Match, multiple box sizes, variant/quantity restrictions, customer tag targeting, scheduling, B2B bundles, and live preview.",
  },
];

export const changelog: ChangelogEntry[] = changelogSeed.map((c) => ({
  ...c,
  locale: en,
}));

// ---- Partners (§3 Page 5) -------------------------------------------------
export const partners: Partner[] = [
  {
    slug: "multivariants",
    name: "MultiVariants – Bulk Order",
    description:
      "MultiVariants lets customers easily select multiple product variants, order in bulk, and speed up checkout with a single click.",
    url: "https://apps.shopify.com/multivariants",
  },
  {
    slug: "discountray",
    name: "DiscountRay – Custom Price",
    description:
      "Maximize your store's sales and AOV with powerful, flexible, and automatic discount features.",
    url: "https://apps.shopify.com/discountray",
  },
  {
    slug: "embedup",
    name: "EmbedUp – Affiliate Buy Button",
    description:
      "Turn any website, landing page, or blog into a powerful headless sales channel.",
    url: "https://apps.shopify.com/embedup",
  },
  {
    slug: "transtore",
    name: "Transtore: Language & Currency Solution",
    description:
      "Auto-translate in 20+ languages, 163+ currency switcher, geolocation redirects, multilingual SEO, glossary consistency and image localization — no coding needed.",
    url: "https://apps.shopify.com/transtore",
  },
].map((p) => ({ ...p, locale: en }));

// ---- Reviews (§1 — real quotes from the Shopify listing) ------------------
const reviewSeed: Omit<Review, "locale">[] = [
  {
    slug: "biogaia-yogurt",
    author: "バイオガイアヨーグルト工房",
    country: "Japan",
    rating: 5,
    quote:
      "Support is quick. It covers basic bundle functions at a relatively low price.",
    source: "Shopify App Store",
  },
  {
    slug: "oatme",
    author: "oatme",
    country: "Bulgaria",
    rating: 5,
    quote: "Great support team. Answers fast and always correct.",
    source: "Shopify App Store",
  },
  {
    slug: "pawsitively-organic",
    author: "PAWsitively Organic Dog Bakery",
    country: "United States",
    rating: 5,
    quote: "Wonderful experience with excellent customer service.",
    source: "Shopify App Store",
  },
];

export const reviews: Review[] = reviewSeed.map((r) => ({ ...r, locale: en }));

/** From the Shopify App Store listing (§1) — source of truth. */
export const aggregateRating = { score: 4.9, count: 16 };
