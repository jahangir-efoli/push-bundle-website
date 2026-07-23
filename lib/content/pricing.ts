/**
 * Pricing content (docs/PLAN.md §5.2). Prices are the Shopify App Store's —
 * the source of truth (§9): Growth is $14/mo or $134.40/yr (~20% off).
 */

export type Plan = {
  name: string;
  tagline: string;
  monthly: number;
  /** Yearly total; null for the free plan. */
  yearly: number | null;
  featured?: boolean;
  cta: string;
  trial?: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    name: "Starter",
    tagline: "Basic features for new businesses",
    monthly: 0,
    yearly: 0,
    cta: "Get it on Shopify",
    features: [
      "Volume Bundle",
      "Percentage discount",
      "Fixed discount on total",
      "Discount on Fixed Quantity",
      "Discount on custom quantity range",
      "Customer tag based discount",
      "Discount on specific customers",
      "Different display styles",
      "Live preview",
      "24/7 support",
    ],
  },
  {
    name: "Growth",
    tagline: "Advanced tools to boost sales and AOV",
    monthly: 14,
    yearly: 134.4,
    featured: true,
    cta: "Get it on Shopify",
    trial: "14-day free trial",
    features: [
      "Everything in Starter",
      "Mix and Match – Build a box",
      "Sell mix and match in different pack sizes",
      "Multipack discount",
      "Variant restriction",
      "Limit quantity per variant",
      "Customer tag-based bundle",
      "Specific client based bundle",
      "Custom bundle icon upload",
      "Cross-sell bundles",
      "Basic customization",
      "Custom CSS",
    ],
  },
];

/** Feature comparison table (docs/PLAN.md §5.2 §4) — grouped rows. */
export const comparison: Array<{
  group: string;
  rows: Array<{ label: string; starter: boolean; growth: boolean }>;
}> = [
  {
    group: "Bundle types",
    rows: [
      { label: "Volume bundles", starter: true, growth: true },
      { label: "Mix & Match / Build-a-Box", starter: false, growth: true },
      { label: "Multi-pack sizes", starter: false, growth: true },
      { label: "Cross-sell bundles", starter: false, growth: true },
    ],
  },
  {
    group: "Discounts",
    rows: [
      { label: "Percentage & fixed discounts", starter: true, growth: true },
      { label: "Custom quantity ranges", starter: true, growth: true },
      { label: "Multipack discounts", starter: false, growth: true },
    ],
  },
  {
    group: "Targeting",
    rows: [
      { label: "Customer-tag targeting", starter: true, growth: true },
      { label: "Specific-customer targeting", starter: true, growth: true },
      { label: "Variant restrictions & limits", starter: false, growth: true },
    ],
  },
  {
    group: "Customization",
    rows: [
      { label: "Display styles & live preview", starter: true, growth: true },
      { label: "Custom bundle icons", starter: false, growth: true },
      { label: "Custom CSS", starter: false, growth: true },
    ],
  },
  {
    group: "Support",
    rows: [{ label: "24/7 support", starter: true, growth: true }],
  },
];

export const pricingCopy = {
  eyebrow: "Pricing",
  title: "Simple, flexible pricing that scales with your store",
  subtitle:
    "At PushBundle, we offer flexible pricing plans to fit your unique business needs.",
  monthlyLabel: "Monthly",
  yearlyLabel: "Yearly",
  yearlyNote: "Save 20%",
  comparisonTitle: "Compare plans",
  faqEyebrow: "Billing",
  faqTitle: "Pricing questions",
} as const;
