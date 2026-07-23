/**
 * About us content (docs/PLAN.md §5.3) — copy verbatim from the extracted
 * old site (§3 Page 3). Team section is new (§9 #3 — real team info pending).
 */

export const aboutCopy = {
  eyebrow: "About us",
  title: "Smarter, more scalable bundling on Shopify",
  subtitle:
    "Get to know PushBundle — why we built it, who we built it for, and how we're helping merchants around the world unlock smarter, more scalable bundling in Shopify.",
} as const;

export const whoWeAre = {
  eyebrow: "Who we are",
  title: "Built for merchants who outgrew simple bundles",
  body: "We kept hearing it: “I want customers to build their own packs, but I can't control pack sizes or variants.” Most apps didn't get the complexity of B2B bundling. So we built PushBundle, a no-code Shopify app with full control over mix-and-match bundles, MOQs, volume discounts, and multi-pack pricing. No workarounds, just smart bundling that scales. Built in Dubai, made for global merchants. If you've ever felt boxed in by bundle apps, we built PushBundle for you.",
} as const;

export const mission = {
  eyebrow: "Our mission",
  title: "Turn bundling into a growth engine",
  body: "At WhenLab, we're on a mission to redefine e-commerce success for merchants who've outgrown 'simple bundles.' PushBundle was built from real Shopify pain points, designed to offer smart, flexible bundling that scales with your store.",
  points: [
    "Turn pack sizes, variant rules, and MOQs into growth tools, not roadblocks.",
    "Help you boost AOV with powerful volume discounts and multi-pack pricing.",
    "Be the go-to bundle discount app for merchants who need control, creativity, and results.",
  ],
} as const;

export const vision = {
  eyebrow: "Our vision",
  title: "A new era of bundling on Shopify",
  body: "We believe bundling should be a growth strategy, not a technical hurdle. Our vision is to lead a new era of bundling on Shopify — one where merchants have the freedom to create exactly what their customers want, without limitations, without code, and without guesswork. We're building the most trusted, powerful bundling app for serious merchants.",
} as const;

export const aboutFeatures = {
  eyebrow: "Why PushBundle",
  title: "The smarter way to bundle on Shopify",
  subtitle:
    "PushBundle helps you build bundles your way. Set your own rules, offer bulk deals, and let shoppers mix and match what they love. More sales, less stress.",
  items: [
    {
      icon: "layers",
      title: "Effortless Bundle Creation",
      description:
        "Easily build, edit, and manage bundles with a dashboard designed for busy merchants.",
    },
    {
      icon: "cart",
      title: "Sell More with Smart Bundles",
      description:
        "Boost your average order value with flexible discounts that match how customers shop.",
    },
    {
      icon: "sparkles",
      title: "Create Bundles They'll Love",
      description:
        "Offer eye-catching, mix-and-match bundles that keep customers engaged and coming back.",
    },
    {
      icon: "globe",
      title: "Built to Grow With You",
      description:
        "Whether you're selling locally or going global, PushBundle scales with your store at every stage.",
    },
    {
      icon: "wand",
      title: "Smart Pricing, Always On",
      description:
        "Set it and forget it. PushBundle adjusts bundle pricing based on stock or customer behavior.",
    },
    {
      icon: "calendar",
      title: "Schedule Sales in Advance",
      description:
        "Plan flash deals or seasonal promos ahead of time. PushBundle takes care of the timing for you.",
    },
  ],
} as const;

/**
 * Company facts (docs/PLAN.md §5.3 §8). The old page's "Meet the Team" title
 * promises team members but shows none — real team info still pending (§9 #3).
 */
export const company = {
  eyebrow: "The company",
  title: "Made by WhenLab, in Dubai",
  body: "PushBundle is built by WhenLab F.Z.C, a Dubai-based team behind a family of Shopify apps used by merchants worldwide. Everything we build is shaped by real merchant feedback.",
  stats: [
    { value: "4.9 / 5", label: "Shopify rating" },
    { value: "Built for Shopify", label: "Verified badge" },
    { value: "2025", label: "Launched" },
    { value: "5+", label: "Shopify apps" },
  ],
} as const;
