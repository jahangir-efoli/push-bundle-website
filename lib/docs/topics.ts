import type { IconName } from "@/components/ui/icon";
import type { DocArticle } from "@/lib/cms";

/**
 * Help-centre structure (docs/PLAN.md §5.8) — how CMS doc categories are
 * grouped and presented. Categories, their order and their docs come from the
 * CMS; the icon (and a fallback description, in messages/docs) is keyed by the
 * category slug. Slugs cover today's CMS categories plus the planned 14-topic
 * structure, so new categories get their icon the moment they're published.
 */

export type DocTopic = {
  slug: string;
  name: string;
  /** CMS description; the page falls back to messages/docs `topics.descriptions`. */
  description?: string;
  docs: DocArticle[];
};

/** Groups docs by category, preserving the CMS order of both. */
export function groupDocs(docs: DocArticle[]): DocTopic[] {
  const topics = new Map<string, DocTopic>();
  for (const doc of docs) {
    const topic = topics.get(doc.category) ?? {
      slug: doc.category,
      name: doc.categoryName,
      description: doc.categoryDescription,
      docs: [],
    };
    topic.docs.push(doc);
    topics.set(doc.category, topic);
  }
  return [...topics.values()];
}

const TOPIC_ICONS: Record<string, IconName> = {
  "getting-started": "rocket",
  "setup-process": "wand",
  "volume-bundle": "layers",
  "cross-sell-bundle": "link",
  "mix-match-single": "grid",
  "mix-match-multi": "grid",
  "build-your-own-box": "box",
  discounts: "percent",
  "visibility-scheduling": "eye",
  "text-languages": "globe",
  "managing-bundles": "list",
  "cart-orders": "cart",
  analytics: "chart",
  "plans-billing": "credit-card",
  troubleshooting: "wrench",
};

export function topicIcon(slug: string): IconName {
  return TOPIC_ICONS[slug] ?? "file-text";
}

/**
 * "Start here" steps, in order. Each step lists candidate slugs — the planned
 * article first, then today's CMS slug — and shows the first one that exists,
 * so the section upgrades itself as the new guides are published. A step with
 * no published candidate is skipped. Descriptions: `quickStart.steps[i]`.
 */
const QUICK_START: string[][] = [
  ["how-to-install-pushbundle-on-shopify", "installation"],
  [
    "how-to-enable-the-pushbundle-app-embed",
    "how-to-add-the-pushbundle-app-block-to-your-theme",
    "how-to-add-the-pushbundle-app-block-to-your-shopify-theme",
    "add-app-block-to-shopify-theme",
  ],
  [
    "how-to-build-your-first-bundle-with-the-setup-wizard",
    "how-to-build-a-volume-bundle-in-your-store",
    "how-to-setup-volume-bundle",
  ],
  ["how-to-check-your-bundle-is-live-on-your-store"],
];

/** Hand-picked guides for the "Popular guides" list; unpublished ones are skipped. */
const POPULAR = [
  "how-to-build-a-volume-bundle-in-your-store",
  "how-to-setup-volume-bundle",
  "how-to-enable-the-pushbundle-app-embed",
  "how-to-offer-a-free-gift-in-a-volume-bundle",
  "why-isnt-my-bundle-showing-on-the-product-page",
  "how-to-create-a-build-your-own-box-bundle",
  "how-to-customize-your-mix-match-template",
  "mix-and-match-single-product",
  "setup-cross-sell-bundle-in-your-store",
  "how-to-apply-multi-pack-discounts",
  "discount-for-mix-and-match-bundle",
];

/** Published quick-start steps, each with its step index (for its description). */
export function quickStart(docs: DocArticle[]) {
  const bySlug = new Map(docs.map((d) => [d.slug, d]));
  return QUICK_START.flatMap((candidates, step) => {
    const doc = candidates.map((s) => bySlug.get(s)).find(Boolean);
    return doc ? [{ doc, step }] : [];
  });
}

export function popularDocs(docs: DocArticle[], exclude: string[], limit = 6) {
  const bySlug = new Map(docs.map((d) => [d.slug, d]));
  return POPULAR.filter((s) => !exclude.includes(s))
    .map((s) => bySlug.get(s))
    .filter((d): d is DocArticle => Boolean(d))
    .slice(0, limit);
}
