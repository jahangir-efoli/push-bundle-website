/**
 * Home page copy (docs/PLAN.md §5.1), taken verbatim from the extracted
 * old site (§3 Page 1). Moves to `/messages/{locale}.json` in Phase 8 —
 * keeping it in one module now makes that migration mechanical.
 */

export const hero = {
  title: "Boost Your AOV and Sell More With the Best Shopify Bundle App",
  subtitle:
    "Whether selling to retail shoppers or wholesale buyers, Push Bundle gives you mix & match, volume discounts, upsells, and B2B bundle tools. All designed to convert.",
  primaryCta: "Install Free on Shopify",
  secondaryCta: "View Demo",
  compatibility: ["Checkout", "Shopify POS", "Markets"],
} as const;

export const featureTrio = {
  title: "A complete bundling toolkit",
  subtitle:
    "Everything you need to launch, style, and schedule bundles that lift average order value.",
  items: [
    {
      icon: "layers",
      title: "Multiple Bundling Options",
      description:
        "A complete toolkit to create mix & match bundles, multi-product packs, and volume discount deals that drive higher order values.",
      points: ["Mix & match", "Volume tiers", "Fixed packs"],
    },
    {
      icon: "wand",
      title: "Dynamic Bundle Previews",
      description:
        "Watch bundles come to life in the user's preferred style using flexible bundle previews and advanced customization to match the store's feel.",
      points: ["Live preview", "One-click styling", "Custom CSS"],
    },
    {
      icon: "calendar",
      title: "Powerful Bundle Scheduling",
      description:
        "Launch perfectly timed promotions for holidays, flash sales, or campaigns with automated start/end dates that maximize urgency and conversions.",
      points: ["Start/end dates", "Flash sales", "Seasonal campaigns"],
    },
  ],
} as const;

export const biggerOrders = {
  title: "Bigger Orders with Smart Bundling",
  items: [
    {
      title: "Personalized Bundles That Grow Your AOV & Revenue",
      description:
        "Let customers build custom packs with their favorite variants, unlocking exclusive deals that drive repeat sales and bigger orders.",
      href: "/docs/mix-and-match-single-product",
    },
    {
      title: "Mix and Match Bundles to Boost AOV on Your B2B Shopify Store",
      description:
        "PushBundle's customizable product packs let your customers mix and match across variants or products, unlocking exclusive volume discounts and encouraging larger orders.",
      href: "/docs/discount-for-mix-and-match-bundle",
    },
    {
      title: "Fixed Product Bundles with Bulk Discounts",
      description:
        "Create simple, irresistible deals by setting custom product packs at fixed prices. Ideal for B2B stores looking to boost AOV and conversions with no-code bundle builder ease.",
      href: "/docs/how-to-setup-volume-bundle",
    },
  ],
} as const;

export const storefront = {
  title: "Next-Level Bundling: Dynamic Storefront Personalization",
  subtitle: "Maximize Profits with Smart Bundle Displays",
  columns: [
    {
      icon: "shield",
      title: "Frictionless Checkout Integration",
      points: [
        "Advanced discount logic via Shopify Scripts",
        "No manual adjustments needed",
        "Works seamlessly with Shopify Plus",
      ],
    },
    {
      icon: "sparkles",
      title: "High-Converting Visual Experience",
      points: [
        "Stunning, intuitive bundle displays",
        "Mobile-optimized interface",
        "One-click add-to-cart for bundles",
      ],
    },
    {
      icon: "gauge",
      title: "Proven Sales Impact",
      points: [
        "Lift AOV by 20–30% with smart upsells",
        "Reduce cart abandonment by 15%+",
        "Boost conversions with decision-simplifying bundles",
      ],
    },
  ],
} as const;

export const mobileExperience = {
  title: "Seamless Mobile Bundling Experience",
  cta: "See More",
  items: [
    {
      icon: "globe",
      title: "Flawless Mobile Responsiveness",
      description:
        "Every bundle display auto-adapts to all screen sizes for a pixel-perfect shopping experience on any device.",
    },
    {
      icon: "wand",
      title: "Intuitive Tap-to-Select Design",
      description:
        "Browse bundle options with thumb-friendly navigation, customize packs in 2–3 taps, and check out in seconds.",
    },
    {
      icon: "gauge",
      title: "Lightning-Fast Performance",
      description:
        "Instant bundle loading (under 2s), zero lag when switching variants, and smooth scrolling through options.",
    },
  ],
} as const;

export const comingSoon = {
  title: "Features Coming Soon",
  subtitle: "What we're building next for bundle-driven stores.",
  items: [
    "Mix n match bundle (Same Product)",
    "Customized bundle (step-by-step choice from multiple products)",
    "Mixed product bundle",
    "Fixed bundle",
    "Variant fixed quantity bundle (Same product bundling)",
    "Limited edition bundle (limited available quantity)",
  ],
} as const;

export const reviewsSection = {
  title: "Loved by Shopify merchants",
  subtitle: "Real reviews from stores running PushBundle every day.",
} as const;

export const blogTeaser = {
  title: "Expert Reads",
  subtitle:
    "Discover B2B strategies in our latest articles, where expert knowledge meets real-world results. These aren't just blog posts, they're your roadmap to higher conversions and smarter bundling on Shopify.",
  cta: "View All",
} as const;

export const trialCta = {
  title: "Unlock PushBundle's Full Potential – Risk-Free!",
  subtitle:
    "Get started with one click and discover how smarter bundling can transform your sales.",
  cta: "Start 14 Days Free Trial",
} as const;

export const faqTeaser = {
  title: "Have you got any questions?",
  subtitle:
    "Get expert answers to all your PushBundle questions. From setting up custom bundles to maximizing discounts and seamless integrations, this FAQ section is here to answer all your burning questions.",
  cta: "More FAQ",
  supportPrompt: "Didn't find the answer you are looking for?",
  supportCta: "Contact Our Support",
} as const;
