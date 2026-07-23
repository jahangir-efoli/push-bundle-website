import { Section } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageLd } from "@/lib/seo/structured-data";
import type { FaqItem } from "@/lib/cms";

/**
 * Reusable FAQ block (docs/PLAN.md §5.2/§5.4/§5.5) — CMS-driven accordion +
 * `FAQPage` JSON-LD. Server Component; the accordion is a client island.
 */
export function FaqSection({
  items,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
  tone = "default",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  tone?: "default" | "alt" | "subtle";
}) {
  if (items.length === 0) return null;

  return (
    <Section tone={tone}>
      <JsonLd data={faqPageLd(items)} />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md text-balance">{title}</h2>
        </div>
        <Accordion
          items={items.map((item) => ({
            question: item.question,
            answer: item.answer,
            slug: item.slug,
          }))}
        />
      </div>
    </Section>
  );
}
