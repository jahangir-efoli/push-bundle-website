"use client";

import { useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Volume Bundle interactive demo (models the live PushBundle widget).
 *
 * Reusable + prop-driven so it can be dropped into the homepage showcase, the
 * Features page, or anywhere else. Pick a tier → the price/savings update live;
 * assign variants + quantities to fill the pack (progress bar), then "add to
 * cart" (demo only — no real cart). Styled in the PushBundle brand.
 */
export type VolumeTier = { qty: number; discount: number };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

export function VolumeBundleDemo({
  productName = "Everyday Tee",
  basePrice = 24,
  tiers = [
    { qty: 5, discount: 5 },
    { qty: 10, discount: 10 },
    { qty: 15, discount: 15 },
    { qty: 20, discount: 20 },
  ],
  variants = [
    "Amber",
    "Coral Bloom",
    "Sea Glass",
    "Rose Quartz",
    "Ivory",
    "Dune Pearl",
  ],
  popularQty = 10,
  heading = "Save more on bulk purchases",
  className,
}: {
  productName?: string;
  basePrice?: number;
  tiers?: VolumeTier[];
  variants?: string[];
  popularQty?: number;
  heading?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState(() => {
    const i = tiers.findIndex((t) => t.qty === popularQty);
    return i >= 0 ? i : 0;
  });
  const [items, setItems] = useState<Array<{ variant: string; qty: number }>>(
    [],
  );
  const [added, setAdded] = useState(false);

  const tier = tiers[selected];
  const target = tier.qty;
  const assigned = items.reduce((s, it) => s + it.qty, 0);
  const remaining = target - assigned;
  const full = remaining <= 0;

  const price = (t: VolumeTier) => t.qty * basePrice * (1 - t.discount / 100);
  const original = (t: VolumeTier) => t.qty * basePrice;

  const selectTier = (i: number) => {
    setSelected(i);
    setItems([]);
    setAdded(false);
  };

  const addVariant = (v: string) => {
    if (!v || full) return;
    setAdded(false);
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.variant === v);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { variant: v, qty: 1 }];
    });
  };

  const changeQty = (i: number, delta: number) => {
    setAdded(false);
    setItems((prev) => {
      const next = [...prev];
      const others = next.reduce((s, it, idx) => (idx === i ? s : s + it.qty), 0);
      const q = Math.min(next[i].qty + delta, target - others);
      if (q <= 0) {
        next.splice(i, 1);
        return next;
      }
      next[i] = { ...next[i], qty: q };
      return next;
    });
  };

  const remove = (i: number) => {
    setAdded(false);
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className={cn("w-full text-foreground", className)}>
      {/* Product header */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-12 shrink-0 rounded-lg bg-brand-gradient shadow-soft"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">{productName}</p>
          <p className="text-sm text-muted">{usd(basePrice)} / item</p>
        </div>
      </div>

      <h4 className="mt-5 font-display text-base font-bold">{heading}</h4>

      {/* Tiers */}
      <div className="mt-3 space-y-2.5">
        {tiers.map((t, i) => {
          const isSel = i === selected;
          const popular = t.qty === popularQty;
          return (
            <div
              key={t.qty}
              className={cn(
                "relative rounded-lg border transition-colors",
                isSel
                  ? "border-primary bg-primary-subtle"
                  : "border-border hover:border-primary/40",
              )}
            >
              {popular && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-soft">
                  Most popular
                </span>
              )}

              <button
                type="button"
                onClick={() => selectTier(i)}
                aria-pressed={isSel}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                      isSel ? "border-primary" : "border-border",
                    )}
                  >
                    {isSel && (
                      <span className="size-2.5 rounded-full bg-primary" />
                    )}
                  </span>
                  <span className="font-semibold">
                    Buy {t.qty} get {t.discount}% off
                  </span>
                </span>
                <span className="whitespace-nowrap text-sm">
                  <span className="font-semibold">{usd(price(t))}</span>{" "}
                  <span className="text-muted line-through">
                    {usd(original(t))}
                  </span>
                </span>
              </button>

              {/* Expanded: variant picker + assigned items + progress */}
              {isSel && (
                <div className="border-t border-primary/20 px-3.5 py-4">
                  <label className="sr-only" htmlFor={`vb-select-${t.qty}`}>
                    Select options
                  </label>
                  <select
                    id={`vb-select-${t.qty}`}
                    value=""
                    onChange={(e) => addVariant(e.target.value)}
                    disabled={full}
                    className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary disabled:opacity-60"
                  >
                    <option value="" disabled>
                      {full ? "Pack complete" : "Select options"}
                    </option>
                    {variants.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>

                  {items.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {items.map((it, idx) => (
                        <li
                          key={`${it.variant}-${idx}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="min-w-0 truncate text-sm">
                            <span className="text-muted">#{idx + 1}</span>{" "}
                            <span className="font-medium">{it.variant}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="flex items-center rounded-md border border-border">
                              <button
                                type="button"
                                onClick={() => changeQty(idx, -1)}
                                aria-label={`Decrease ${it.variant}`}
                                className="grid size-8 place-items-center text-muted hover:text-foreground"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums">
                                {it.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => changeQty(idx, 1)}
                                disabled={full}
                                aria-label={`Increase ${it.variant}`}
                                className="grid size-8 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                              >
                                +
                              </button>
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              aria-label={`Remove ${it.variant}`}
                              className="grid size-8 place-items-center rounded-md text-muted hover:text-error-foreground"
                            >
                              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M8 6V4h8v2m-9 0v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" />
                              </svg>
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex gap-1">
                      {Array.from({ length: target }).map((_, s) => (
                        <span
                          key={s}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            s < assigned ? "bg-primary" : "bg-border",
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {full
                        ? "Your pack is complete 🎉"
                        : `Add ${remaining} more to complete your pack`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={() => full && setAdded(true)}
        disabled={!full}
        className={cn(buttonStyles({ variant: "gradient" }), "mt-4 w-full")}
      >
        {added
          ? "Added to cart ✓"
          : full
            ? `Add to cart — ${usd(price(tier))}`
            : `Add ${remaining} more item${remaining === 1 ? "" : "s"}`}
      </button>
    </div>
  );
}
