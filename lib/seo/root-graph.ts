import { SITE_NAME, SITE_URL } from "./site";
import { site } from "@/lib/site-config";
import { socialLinks } from "@/lib/site-config";

/**
 * Root JSON-LD @graph (docs/PLAN.md §7) — Organization + WebSite,
 * cross-referenced by @id. Rendered once in the layout, so on EVERY page.
 *
 * The SoftwareApplication (with its AggregateRating) deliberately isn't here:
 * Google requires a marked-up rating to be visible on the page, and most pages
 * don't show it. Pages that do render `softwareApplicationLd()` themselves.
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
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dubai",
          addressCountry: "AE",
        },
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
    ],
  };
}
