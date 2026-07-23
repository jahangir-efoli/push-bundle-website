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
      cta: "Create BYOB Bundle",
    },
  ] satisfies ShowcaseFeature[],
} as const;
