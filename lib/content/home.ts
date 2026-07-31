/**
 * Home page copy (docs/PLAN.md §5.1), taken verbatim from the extracted
 * old site (§3 Page 1). Moves to `/messages/{locale}.json` in Phase 8 —
 * keeping it in one module now makes that migration mechanical.
 */

export const hero = {
  title: "Turn More Products Into Bigger Shopify Orders",
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

/**
 * "Why choose PushBundle" — an interactive section: a vertical list of reasons
 * on the right (each expands to a feature list), synced to a rotating image on
 * the left. Drop per-item images at the `image` paths (see WhyPushbundle).
 */
export const whyPushbundle = {
  eyebrow: "Why PushBundle",
  title: "Why merchants choose PushBundle",
  subtitle:
    "Create flexible bundle experiences for retail, DTC, and wholesale customers — all from one app.",
  items: [
    {
      title: "Customer targeting",
      image: "/images/why/why-1.png",
      features: [
        "Deliver the right offer to the right shopper",
        "Segment by tags, groups, or individual customers",
        "Personalize bundles without extra apps",
      ],
    },
    {
      title: "Tiered Discounts",
      image: "/images/why/why-2.png",
      features: [
        "Offer bigger savings as customers add more products",
        "Create multiple discount levels based on bundle quantity",
        "Encourage shoppers to unlock the next savings tier",
      ],
    },
    {
      title: "Free Gift, Free shipping with all bundles",
      image: "/images/why/why-3.png",
      features: [
        "Add free gifts or free shipping to any bundle offer",
        "Set clear purchase conditions for each reward",
        "Give customers more reasons to complete larger orders",
      ],
    },
    {
      title: "Fixed Price or Preset Bundle price",
      image: "/images/why/why-4.png",
      features: [
        "Set one fixed price for the complete bundle",
        "Create preset prices for different bundle sizes",
        "Make bundle savings clear before customers add to cart",
      ],
    },
    {
      title: "Insight-Driven Analytics",
      image: "/images/why/why-5.png",
      features: [
        "Track bundle views, sales, and customer engagement",
        "Identify which bundle offers perform best",
        "Use real data to improve future promotions",
      ],
    }
  ],
} as const;

/** Second "why" section — reversed layout (image on the right). */
export const whyBeyond = {
  eyebrow: "Beyond the basics",
  title: "Everything you need to grow with bundles",
  subtitle:
    "Build smarter bundle campaigns with flexible rules, customer targeting, and storefront controls.",
  items: [
    {
      title: "Multi Language and currency",
      image: "/images/why/why-6.png",
      features: [
        "Present bundle offers in different languages",
        "Display prices in customers’ local currencies",
        "Create a smoother experience for international shoppers",
      ],
    },
    {
      title: "Template Library",
      image: "/images/why/why-7.png",
      features: [
        "Choose from ready-made templates for different bundle types",
        "Launch professional bundle offers more quickly",
        "Select layouts that match your products and store style",
      ],
    },
    {
      title: "Easy Customisation",
      image: "/images/why/why-8.png",
      features: [
        "Adjust colours, text, buttons, and layouts",
        "Match every bundle widget with your store branding",
        "Preview changes before publishing them to your store",
      ],
    },
    {
      title: "No Code Required",
      image: "/images/why/why-9.png",
      features: [
        "Create and publish bundles without writing code",
        "Manage every offer from a simple dashboard",
        "Update bundle settings without developer assistance",
      ],
    },
    {
      title: "24/7 Human Support and Guided Setup",
      image: "/images/why/why-10.png",
      features: [
        "Get help from a real support team whenever needed",
        "Receive guidance while creating your first bundle",
        "Solve setup and display issues with expert assistance",
      ],
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
        "Advanced discount logic via Shopify Functions",
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
