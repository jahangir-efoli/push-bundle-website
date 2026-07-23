/**
 * Single source of truth for site chrome (docs/PLAN.md §4.2).
 * Labels move to `/messages/{locale}.json` in Phase 8; hrefs stay here.
 */

export const site = {
  name: "PushBundle",
  tagline:
    "Create high-converting Mix & Match bundles and custom product packs that shoppers love while automatically increasing your average order value",
  email: "support@pushbundle.com",
  shopifyAppUrl: "https://apps.shopify.com/push-bundle",
  /**
   * Live demo storefront (docs/PLAN.md §9 #13 — resolved 2026-07-15).
   * Includes a permanent password-bypass token so visitors skip the store
   * password screen. Opens in a new tab so the marketing site isn't lost.
   */
  demoUrl:
    "https://pushbundle.myshopify.com/?_bt=BAh7BkkiC19yYWlscwY6BkVUewhJIglkYXRhBjsAVEkiHXB1c2hidW5kbGUubXlzaG9waWZ5LmNvbQY7AEZJIghleHAGOwBUSSIdMjAyNi0wNy0yMVQxMToyMTo1Ny43NjJaBjsAVEkiCHB1cgY7AFRJIh5wZXJtYW5lbnRfcGFzc3dvcmRfYnlwYXNzBjsARg%3D%3D--ec16fa8d82b8ac659673ef08e754a8e0ae5754c9",
  legalEntity: "WhenLab F.Z.C",
  rating: { score: 4.9, count: 16 },
} as const;

/** Primary nav (docs/PLAN.md §4.2 — Changelog lives under Resources). */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "About us", href: "/about-us" },
  { label: "Contact us", href: "/contact-us" },
] as const;

export const resourcesNav = [
  { label: "Partners", href: "/partner" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
] as const;

export const footerLinks = [
  { label: "Contact us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Changelog", href: "/changelog" },
] as const;

/** Sibling apps by the same company (docs/PLAN.md §3). */
export const whenlabApps = [
  { label: "MultiVariants – Bulk Order", href: "https://apps.shopify.com/multivariants" },
  { label: "DiscountRay – B2B Discounts", href: "https://apps.shopify.com/discountray" },
  { label: "Order Rules", href: "https://apps.shopify.com/order-rules" },
  { label: "Quotway", href: "https://apps.shopify.com/quotway" },
  { label: "Embedup", href: "https://apps.shopify.com/embedup" },
] as const;

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/pushbundle" },
  { label: "LinkedIn", href: "https://linkedin.com/company/pushbundle" },
  { label: "Twitter", href: "https://twitter.com/pushbundle" },
  { label: "YouTube", href: "https://youtube.com/@pushbundle" },
] as const;
