import { site } from "@/lib/site-config";
import type { AggregateRating, FaqItem, Review } from "@/lib/cms";

/**
 * Structured-data builders (docs/PLAN.md §7).
 * Values come from the CMS / site config so the markup can't drift from the
 * visible page — a Google requirement for ratings and FAQs.
 */

const SITE_URL = "https://pushbundle.com";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalEntity,
    url: SITE_URL,
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  };
}

export function softwareApplicationLd({
  rating,
  reviews,
}: {
  rating: AggregateRating;
  reviews: Review[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Shopify",
    url: SITE_URL,
    installUrl: site.shopifyAppUrl,
    offers: [
      {
        "@type": "Offer",
        name: "Starter",
        price: "0",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "14",
        priceCurrency: "USD",
        // Corrected against the Shopify listing (docs/PLAN.md §9).
        description: "$14/month or $134.40/year",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.score,
      reviewCount: rating.count,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      author: { "@type": "Person", name: r.author },
      reviewBody: r.quote,
    })),
  };
}

export function faqPageLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbLd(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}
