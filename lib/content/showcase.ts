/**
 * Interactive feature showcase (docs/PLAN.md §5.1) — the tabbed "bundle builder"
 * section below the hero. Each feature will get a live, interactive preview in
 * the left panel later; for now the panel shows a branded placeholder.
 */

export type ShowcaseFeature = {
  id: string;
  /** Short label for the tab pill. */
  tab: string;
  /** Icon name (components/ui/icon). */
  icon: "gauge" | "cart" | "wand" | "layers" | "sparkles";
  title: string;
  description: string;
  /** What the merchant does with it — shown as a short "how it works" line. */
  howItWorks: string;
  /** Why it's worth using — the business upside. */
  benefits: string;
  /** How adaptable it is — layouts, rules, placements. */
  flexibility: string;
  cta: string;
};

export const showcase = {
  eyebrow: "Interactive demo",
  title: "Your all-in-one bundle builder",
  subtitle:
    "Every bundle type shoppers love — in one app. Pick a tab to explore each one, then try it live.",
  features: [
    {
      id: "volume",
      tab: "Volume Bundle",
      icon: "gauge",
      title: "Volume Bundle",
      description:
        "Reward shoppers for buying more. Offer tiered quantity discounts — the bigger the pack, the bigger the % off — and let customers fill the pack with any mix of variants.",
      howItWorks:
        "Set tiers like Buy 5 / 10 / 15, each with its own discount. The shopper picks a tier, chooses variants to fill the pack, and the total + savings update live before adding to cart.",
      benefits:
        "Lift average order value with quantity breaks that reward bigger carts — ideal for wholesale, multipacks, and stock-up staples — while you keep full control over every tier and discount.",
      flexibility:
        "Show tiers as a compact list or cards, on the product page or a dedicated bundle page, in portrait or horizontal layouts — all styled to match your theme.",
      cta: "Create Volume Bundle",
    },
    {
      id: "cross-sell",
      tab: "Cross-Sell",
      icon: "cart",
      title: "Cross-Sell Bundle",
      description:
        "Combine related items into one bundle and offer complementary products for a seamless, higher-value purchase right on the product page.",
      howItWorks:
        "Group products that sell well together and apply a bundle discount — customers add the whole set in a single click.",
      benefits:
        "Increase AOV by pairing complementary products at a bundled price — a proven upsell that turns one purchase into a complete set without extra clicks.",
      flexibility:
        "Curate the exact set, fix or expose quantities, and let shoppers choose variants — shown right on the product page or as a 'frequently bought together' block.",
      cta: "Create Cross-Sell Bundle",
    },
    {
      id: "mix-single",
      tab: "Mix & Match (Single)",
      icon: "wand",
      title: "Mix & Match — Single Product",
      description:
        "Let shoppers build a pack by mixing different variants of one product — colours, sizes, and options to match their taste.",
      howItWorks:
        "Pick a product, choose the pack sizes, and shoppers assemble their own mix with the discount applied as the box fills.",
      benefits:
        "Boost engagement and AOV by letting shoppers build their own pack from one product's variants — perfect for colour packs, sample sets, and subscription-style boxes.",
      flexibility:
        "Set pack sizes and tiered pricing, cap quantities per variant, and display it as a compact grid or a full page — portrait or horizontal to fit any theme.",
      cta: "Create Mix & Match Bundle",
    },
    {
      id: "mix-multi",
      tab: "Mix & Match (Multi)",
      icon: "layers",
      title: "Mix & Match — Multiple Products",
      description:
        "Let shoppers mix variants across multiple products into one custom bundle, with full control over rules, limits, and pricing.",
      howItWorks:
        "Curate the products, set min/max and per-variant limits, and customers build a personalized multi-product bundle.",
      benefits:
        "Grow basket size with fully customizable multi-product sets — great for curated collections and custom kits — while you keep control over rules and limits.",
      flexibility:
        "Curate the catalog, set min/max and per-variant limits, and offer variant options inline — as an embedded widget or a standalone bundle page.",
      cta: "Create Mix & Match Bundle",
    },
    {
      id: "byob",
      tab: "Build Your Own Box",
      icon: "sparkles",
      title: "Build Your Own Box",
      description:
        "A step-by-step builder that lets customers pick a box, add products and gift cards, and personalize with custom forms.",
      howItWorks:
        "Design a guided, multi-step flow — choose a box, add items, and collect custom details before adding to cart.",
      benefits:
        "Turn gifting into a premium experience that lifts AOV — shoppers assemble a personalized box, add a card, and leave a message, all in one guided flow.",
      flexibility:
        "Configure each step — boxes, products, cards, and custom form fields — then reorder or drop steps to fit any gifting or subscription flow.",
      cta: "Create BYOB Bundle",
    },
  ] satisfies ShowcaseFeature[],
} as const;
