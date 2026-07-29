import { Fragment } from "react";
import { Section } from "@/components/ui/section";
import {
  comparison as defaultComparison,
  pricingCopy,
} from "@/lib/content/pricing";

/** One comparison group with per-plan availability (booleans) + localized labels. */
export type ComparisonGroup = {
  group: string;
  rows: Array<{ label: string; starter: boolean; growth: boolean }>;
};

/** Localized table headers (defaults mirror the English content module). */
export type ComparisonHeaders = {
  title: string;
  feature: string;
  starter: string;
  growth: string;
};

const DEFAULT_HEADERS: ComparisonHeaders = {
  title: pricingCopy.comparisonTitle,
  feature: "Feature",
  starter: "Starter",
  growth: "Growth",
};

/**
 * Feature comparison table (docs/PLAN.md §5.2 §4).
 * Server Component. Horizontal-scroll container on mobile (§6 responsive).
 */
function Check({ on }: { on: boolean }) {
  // sr-only text instead of aria-label on a <span> (prohibited without a role).
  return on ? (
    <span className="text-primary">
      <span aria-hidden="true">✓</span>
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="text-muted">
      <span aria-hidden="true">—</span>
      <span className="sr-only">Not included</span>
    </span>
  );
}

export function PricingComparison({
  comparison = defaultComparison,
  headers = DEFAULT_HEADERS,
}: {
  comparison?: ComparisonGroup[];
  headers?: ComparisonHeaders;
} = {}) {
  return (
    <Section tone="alt">
      <h2 className="text-display-md">{headers.title}</h2>

      {/*
        No min-width / horizontal scroll: a min-width table forces document
        overflow that an overflow-x-auto wrapper doesn't clip (table min-content
        quirk). Instead the table is fully fluid — narrow check columns, the
        feature label wraps — so it fits from 320px up with no page scroll.
      */}
      <div className="mt-8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4 pr-4 font-semibold">{headers.feature}</th>
              <th className="w-16 py-4 text-center font-semibold sm:w-32">
                {headers.starter}
              </th>
              <th className="w-16 py-4 text-center font-semibold text-primary sm:w-32">
                {headers.growth}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((group) => (
              <Fragment key={group.group}>
                <tr className="bg-surface-subtle">
                  <th
                    colSpan={3}
                    className="px-1 py-2 text-sm font-semibold uppercase tracking-wide text-muted"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-b border-border">
                    <td className="py-3 pr-4">{row.label}</td>
                    <td className="py-3 text-center">
                      <Check on={row.starter} />
                    </td>
                    <td className="py-3 text-center">
                      <Check on={row.growth} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
