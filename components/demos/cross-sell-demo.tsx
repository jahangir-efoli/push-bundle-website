"use client";

import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Cross-Sell / "frequently bought together" interactive demo — models the live
 * PushBundle widget: an admin-curated set of complementary products, each with
 * an admin-FIXED quantity (varied on purpose, to show it's configurable) and a
 * customer-selectable variant. The bundle total gets a % discount. Add-bundle
 * shows a notice and resets. Reusable + prop-driven.
 */
export type CrossProduct = {
  name: string;
  price: number;
  /** Admin-fixed quantity (not customer-editable). */
  qty: number;
  /** Product icon (emoji). */
  icon: string;
  /** Customer-selectable options. */
  variants: string[];
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const DEFAULT_PRODUCTS: CrossProduct[] = [
  { name: "Coffee Beans", price: 18, qty: 2, icon: "☕", variants: ["250g", "500g", "1kg"] },
  { name: "Ceramic Mug", price: 14, qty: 1, icon: "🍵", variants: ["Cream", "Charcoal", "Sage"] },
  { name: "Milk Frother", price: 29, qty: 1, icon: "🥛", variants: ["Matte Black", "Steel"] },
  { name: "Biscotti Pack", price: 8, qty: 3, icon: "🍪", variants: ["Almond", "Chocolate"] },
];

export function CrossSellDemo({
  products = DEFAULT_PRODUCTS,
  discount = 15,
  heading = "Complete the set",
  /** Embedded in a ProductStage: drop outer padding + heading, and the footer
      sits inline (not sticky) since the host card isn't a scroll container. */
  embedded = false,
  className,
}: {
  products?: CrossProduct[];
  discount?: number;
  heading?: string;
  embedded?: boolean;
  className?: string;
}) {
  const initial = () => products.map((p) => p.variants[0]);
  const [picked, setPicked] = useState<string[]>(initial);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const original = products.reduce((s, p) => s + p.price * p.qty, 0);
  const total = original * (1 - discount / 100);
  const units = products.reduce((s, p) => s + p.qty, 0);

  const setVariant = (i: number, v: string) =>
    setPicked((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  const addToCart = () => {
    setNotice(`Bundle added to cart · ${usd(total)} (saved ${discount}%)`);
    setPicked(initial());
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  };

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  return (
    <div
      className={cn(
        "w-full text-foreground",
        !embedded && "px-4 pt-4 sm:px-5 sm:pt-5",
        className,
      )}
    >
      {heading && <p className="text-sm font-semibold">{heading}</p>}

      <div className={cn(!embedded && "mt-3")}>
        {products.map((p, i) => (
          <div key={p.name}>
            <div className="flex gap-3 rounded-lg border border-border p-3">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-md bg-surface-subtle text-2xl ring-1 ring-black/5"
              >
                {p.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="whitespace-nowrap text-sm font-semibold">
                    {usd(p.price * p.qty)}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {/* Admin-fixed quantity — read-only for the customer. */}
                  <span
                    title="Quantity is set by the store"
                    className="shrink-0 rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-muted"
                  >
                    × {p.qty}
                  </span>

                  <div className="relative min-w-0 flex-1">
                    <label className="sr-only" htmlFor={`cs-${i}`}>
                      {p.name} option
                    </label>
                    <select
                      id={`cs-${i}`}
                      value={picked[i]}
                      onChange={(e) => setVariant(i, e.target.value)}
                      className="h-8 w-full appearance-none rounded-md border border-border bg-surface pl-2.5 pr-8 text-xs text-foreground focus-visible:border-primary"
                    >
                      {p.variants.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {i < products.length - 1 && (
              <div className="flex justify-center py-1.5 text-lg font-bold text-primary/60">
                +
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total + add bundle — flush sticky footer when standalone; inline when
          embedded in a product-page card (which isn't a scroll container). */}
      <div
        className={cn(
          "mt-4",
          embedded
            ? "border-t border-border pt-3"
            : "sticky bottom-0 -mx-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5",
        )}
      >
        {notice && (
          <div
            role="status"
            className="mb-2.5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success-foreground"
          >
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
            {notice}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            Total{" "}
            <span className="font-normal text-muted">({units} items)</span>
          </span>
          <span className="whitespace-nowrap text-sm">
            <span className="mr-1.5 text-muted line-through">{usd(original)}</span>
            <span className="font-semibold">{usd(total)}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className={cn(
            buttonStyles({ variant: embedded ? "primary" : "gradient" }),
            "mt-2.5 w-full",
          )}
        >
          Add bundle &amp; save {discount}%
        </button>
      </div>
    </div>
  );
}
