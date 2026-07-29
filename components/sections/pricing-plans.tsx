"use client";

import { useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { site } from "@/lib/site-config";
import { plans as defaultPlans, pricingCopy, type Plan } from "@/lib/content/pricing";
import { cn } from "@/lib/utils";

/** Localized billing labels (defaults mirror the English content module). */
export type PricingBilling = {
  monthly: string;
  yearly: string;
  yearlyNote: string;
  perMonth: string;
  perYear: string;
  free: string;
  freeForever: string;
  mostPopular: string;
  billingAriaMonthly: string;
  billingAriaYearly: string;
};

const DEFAULT_BILLING: PricingBilling = {
  monthly: pricingCopy.monthlyLabel,
  yearly: pricingCopy.yearlyLabel,
  yearlyNote: pricingCopy.yearlyNote,
  perMonth: "/month",
  perYear: "/year",
  free: "Free",
  freeForever: "Free forever",
  mostPopular: "Most Popular",
  billingAriaMonthly: "Bill monthly — toggle billing period",
  billingAriaYearly: "Bill yearly — toggle billing period",
};

/**
 * Pricing plan cards + billing toggle (docs/PLAN.md §5.2 §3).
 * Client component only because of the toggle; the cards themselves are static.
 * `plans` (numbers) + `billing` (labels) are passed in localized by the page;
 * they default to the English content module.
 */
export function PricingPlans({
  plans = defaultPlans,
  billing = DEFAULT_BILLING,
}: {
  plans?: Plan[];
  billing?: PricingBilling;
} = {}) {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={cn(
            "text-sm font-semibold",
            !yearly ? "text-foreground" : "text-muted",
          )}
        >
          {billing.monthly}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label={yearly ? billing.billingAriaYearly : billing.billingAriaMonthly}
          onClick={() => setYearly((v) => !v)}
          className={cn(
            "relative h-8 w-16 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            yearly ? "bg-primary" : "bg-surface-subtle ring-1 ring-inset ring-border",
          )}
        >
          {/* 24px knob in a 64px track. Vertically centred via top-1/2 +
              -translate-y-1/2 (border-independent); horizontal is left-1 (4px)
              plus a translate that composes into the same transform. */}
          <span
            className={cn(
              "absolute left-1 top-1/2 size-6 -translate-y-1/2 rounded-full bg-white shadow-soft transition-transform",
              yearly ? "translate-x-8" : "translate-x-0",
            )}
          />
        </button>
        <span
          className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            yearly ? "text-foreground" : "text-muted",
          )}
        >
          {billing.yearly}
          <Badge tone="warm">{billing.yearlyNote}</Badge>
        </span>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const free = plan.monthly === 0;
          const price = yearly && plan.yearly !== null ? plan.yearly : plan.monthly;
          const period = free ? "" : yearly ? billing.perYear : billing.perMonth;
          // Undiscounted yearly total (12× monthly) — struck through to show the
          // yearly saving. Only when a real discount exists.
          const fullYearly = plan.monthly * 12;
          const showStrike = yearly && !free && plan.yearly !== null && fullYearly > price;

          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-surface p-7 shadow-soft",
                // Extra top padding on the featured card so the centered badge
                // has room instead of overlapping the border.
                plan.featured ? "border-2 border-primary pt-9" : "border-border",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
                  {billing.mostPopular}
                </span>
              )}

              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {showStrike && (
                  <span className="font-display text-2xl font-bold text-muted line-through decoration-2">
                    ${fullYearly.toFixed(2)}
                  </span>
                )}
                <span className="font-display text-4xl font-extrabold">
                  {free ? billing.free : `$${price % 1 === 0 ? price : price.toFixed(2)}`}
                </span>
                {period && <span className="text-muted">{period}</span>}
              </p>
              <p className="mt-1 h-5 text-sm text-warm-foreground">
                {free ? billing.freeForever : plan.trial}
              </p>

              <a
                href={site.shopifyAppUrl}
                className={buttonStyles({
                  variant: plan.featured ? "gradient" : "secondary",
                  className: "mt-6 w-full",
                })}
              >
                {plan.cta}
              </a>

              <ul className="mt-7 space-y-3 border-t border-border pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <span aria-hidden="true" className="text-primary">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
