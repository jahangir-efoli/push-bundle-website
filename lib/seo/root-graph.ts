import { SITE_NAME, SITE_URL } from "./site";
import { site } from "@/lib/site-config";
import { socialLinks } from "@/lib/site-config";

/**
 * Root JSON-LD @graph (docs/PLAN.md §7) — Organization + WebSite +
 * SoftwareApplication, cross-referenced by @id. Rendered once in the layout.
 */
export function rootGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: site.legalEntity,
        url: SITE_URL,
        // Points at the generated share card until a real square brand logo
        // asset is supplied (§9 #10) — resolvable + ≥112px, valid for Google.
        logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image` },
        email: site.email,
        sameAs: socialLinks.map((s) => s.href),
        contactPoint: {
          "@type": "ContactPoint",
          email: site.email,
          contactType: "customer support",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: `${SITE_NAME} — Shopify Bundle App`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Shopify",
        url: SITE_URL,
        installUrl: site.shopifyAppUrl,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "14",
          offerCount: "2",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: site.rating.score,
          reviewCount: site.rating.count,
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
