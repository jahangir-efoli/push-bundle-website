/**
 * Features page copy (docs/PLAN.md §5 — new page). Static marketing content,
 * kept in one module like the other page content (mechanical to localize later).
 * Feature lists are sourced from the Shopify listing + §5.2 plan/pricing tiers.
 */

export const featuresCopy = {
  eyebrow: "Features",
  title: "Everything you need to build bundles that convert",
  subtitle:
    "From mix & match build-a-box to B2B volume pricing, PushBundle gives Shopify merchants a complete, no-code bundling toolkit — designed to lift average order value without slowing your store down.",
};

/** The main feature catalogue — six categories, each with concrete capabilities. */
export const featureCategories = {
  eyebrow: "The toolkit",
  title: "One app, every kind of bundle",
  subtitle:
    "Mix and match the building blocks below to launch any bundle promotion in minutes — no developer, no theme edits.",
  items: [
    {
      icon: "layers",
      title: "Every bundle type",
      description:
        "Ship any bundle format shoppers expect, from a guided build-a-box to fixed sets and tiered volume packs.",
      points: [
        "Mix & Match — Build a box",
        "Fixed product bundles",
        "Volume bundles",
        "Multipack bundles",
        "Mixed-product bundles",
        "Variant fixed-quantity",
      ],
    },
    {
      icon: "sparkles",
      title: "Flexible discounts",
      description:
        "Reward bigger carts your way with layered discount rules that map to how your catalogue is priced.",
      points: [
        "Percentage discount",
        "Fixed discount on total",
        "Discount on fixed quantity",
        "Custom quantity range",
        "Multipack discount",
      ],
    },
    {
      icon: "shield",
      title: "B2B & targeting",
      description:
        "Serve wholesale buyers and VIPs with bundles and pricing that only the right customers ever see.",
      points: [
        "Customer-tag bundles",
        "Specific-client bundles",
        "Variant restriction",
        "Limit qty per variant",
      ],
    },
    {
      icon: "wand",
      title: "Storefront experience",
      description:
        "A high-converting, on-brand bundle builder that previews live as shoppers pick — right on your product page.",
      points: [
        "Live bundle preview",
        "Dynamic bundle displays",
        "Custom bundle icon",
        "Basic customization",
        "Custom CSS",
      ],
    },
    {
      icon: "cart",
      title: "Seamless checkout",
      description:
        "Bundles flow through Shopify's native checkout — no workarounds, no broken discounts, no theme code.",
      points: [
        "Native Shopify checkout",
        "Works with Shopify Plus",
        "POS & Markets ready",
        "No theme code edits",
      ],
    },
    {
      icon: "calendar",
      title: "Scheduling & control",
      description:
        "Plan promotions ahead and create urgency with scheduled, limited-edition, and limited-quantity drops.",
      points: [
        "Schedule bundles",
        "Limited-edition bundles",
        "Limited-quantity drops",
      ],
    },
  ],
} as const;

/** Marquee capabilities — alternating spotlight sections with a checklist panel. */
export const featureSpotlights = [
  {
    icon: "layers",
    eyebrow: "Mix & Match",
    title: "Let shoppers build their own box",
    body: "Give customers a guided, tap-to-select experience to assemble their own pack from the products you choose. Perfect for skincare sets, supplement stacks, curated gifts, and starter kits — with the discount applied automatically as the box fills.",
    points: [
      "Drag-free, tap-to-select box builder",
      "Sell the same mix in different pack sizes",
      "Live total and savings update as they pick",
      "Set minimums, maximums, and per-variant limits",
    ],
  },
  {
    icon: "shield",
    eyebrow: "B2B & Volume",
    title: "Wholesale pricing that scales with the cart",
    body: "Turn casual shoppers into bulk buyers with volume tiers, and show wholesale-only bundles to tagged B2B accounts. Reward larger orders automatically so your best customers always get your best price.",
    points: [
      "Tiered volume discounts on quantity",
      "Customer-tag & specific-client targeting",
      "Percentage, fixed, or quantity-based rules",
      "Great for wholesale, memberships, and VIPs",
    ],
  },
  {
    icon: "gauge",
    eyebrow: "Built for speed",
    title: "Fast, native, and merchant-friendly",
    body: "PushBundle is built for Shopify — bundles run through the native checkout, load fast on mobile, and install without touching your theme code. Set up your first bundle in minutes and keep full control of the look with basic styling or custom CSS.",
    points: [
      "No-code setup — live in minutes",
      "Native checkout, Plus, POS & Markets",
      "Optimised for mobile responsiveness",
      "On-brand styling with custom CSS",
    ],
  },
] as const;
