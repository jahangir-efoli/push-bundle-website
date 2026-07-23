"use client";

import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Cross-Sell / "frequently bought together" interactive demo — models the live
 * PushBundle widget: a curated set of complementary products, each with a
 * variant + quantity, joined by "+", with a bundle discount on the total.
 * Toggle items in/out, change variants/qty, and the total updates live.
 * Reusable + prop-driven for the showcase, Features page, etc.
 */
export type CrossProduct = {
  name: string;
  price: number;
  variants: string[];
  /** Swatch/avatar colour. */
  color: string;
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const DEFAULT_PRODUCTS: CrossProduct[] = [
  { name: "Coffee Beans", price: 18, variants: ["250g", "500g", "1kg"], color: "#7c4a2d" },
  { name: "Ceramic Mug", price: 14, variants: ["Cream", "Charcoal", "Sage"], color: "#0ea5e9" },
  { name: "Milk Frother", price: 29, variants: ["Matte Black", "Steel"], color: "#64748b" },
  { name: "Paper Filters", price: 8, variants: ["Natural", "Bleached"], color: "#f59e0b" },
];

type Row = { on: boolean; variant: string; qty: number };

export function CrossSellDemo({
  products = DEFAULT_PRODUCTS,
  discount = 15,
  heading = "Frequently bought together",
  className,
}: {
  products?: CrossProduct[];
  discount?: number;
  heading?: string;
  className?: string;
}) {
  const initial = (): Row[] =>
    products.map((p) => ({ on: true, variant: p.variants[0], qty: 1 }));
  const [rows, setRows] = useState<Row[]>(initial);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const original = products.reduce(
    (s, p, i) => (rows[i].on ? s + p.price * rows[i].qty : s),
    0,
  );
  const total = original * (1 - discount / 100);
  const count = rows.filter((r) => r.on).length;

  const addToCart = () => {
    if (count === 0) return;
    setNotice(`Bundle added to cart · ${usd(total)} (saved ${discount}%)`);
    setRows(initial());
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  };

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  return (
    <div className={cn("w-full px-4 pt-4 text-foreground sm:px-5 sm:pt-5", className)}>
      <p className="text-sm font-semibold">{heading}</p>

      <div className="mt-3">
        {products.map((p, i) => {
          const row = rows[i];
          return (
            <div key={p.name}>
              <div
                className={cn(
                  "flex gap-3 rounded-lg border p-3 transition-colors",
                  row.on ? "border-border" : "border-border/60 opacity-55",
                )}
              >
                <input
                  type="checkbox"
                  checked={row.on}
                  onChange={(e) => setRow(i, { on: e.target.checked })}
                  aria-label={`Include ${p.name}`}
                  className="mt-1 size-4 shrink-0 accent-[var(--color-primary)]"
                />
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-md text-sm font-bold text-white"
                  style={{ background: p.color }}
                >
                  {p.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="whitespace-nowrap text-sm font-semibold">
                      {usd(p.price * row.qty)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center rounded-md border border-border">
                      <button
                        type="button"
                        onClick={() => setRow(i, { qty: Math.max(1, row.qty - 1) })}
                        disabled={!row.on}
                        aria-label={`Decrease ${p.name}`}
                        className="grid size-7 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">
                        {row.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRow(i, { qty: row.qty + 1 })}
                        disabled={!row.on}
                        aria-label={`Increase ${p.name}`}
                        className="grid size-7 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                      >
                        +
                      </button>
                    </span>

                    <div className="relative min-w-0 flex-1">
                      <label className="sr-only" htmlFor={`cs-${i}`}>
                        {p.name} option
                      </label>
                      <select
                        id={`cs-${i}`}
                        value={row.variant}
                        onChange={(e) => setRow(i, { variant: e.target.value })}
                        disabled={!row.on}
                        className="h-8 w-full appearance-none rounded-md border border-border bg-surface pl-2.5 pr-8 text-xs text-foreground focus-visible:border-primary disabled:opacity-50"
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
          );
        })}
      </div>

      {/* Total + add bundle (flush bottom) */}
      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
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
            <span className="font-normal text-muted">
              ({count} item{count === 1 ? "" : "s"})
            </span>
          </span>
          <span className="whitespace-nowrap text-sm">
            {count > 0 && (
              <span className="mr-1.5 text-muted line-through">
                {usd(original)}
              </span>
            )}
            <span className="font-semibold">{usd(total)}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={count === 0}
          className={cn(buttonStyles({ variant: "gradient" }), "mt-2.5 w-full")}
        >
          {count === 0
            ? "Select at least one item"
            : `Add bundle & save ${discount}%`}
        </button>
      </div>
    </div>
  );
}
