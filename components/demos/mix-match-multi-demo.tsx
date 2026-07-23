"use client";

import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mix & Match (Multiple Products) interactive demo — models the live PushBundle
 * widget: choose a pack size (with % off), then fill it from a grid of DIFFERENT
 * products. Products with variants open an inline "See options" panel to pick a
 * variant + quantity; others "Add to box" directly. Reusable + prop-driven.
 */
export type MultiOption = { name: string; values: string[] };
export type MultiProduct = {
  name: string;
  price: number;
  icon: string;
  options?: MultiOption[];
  outOfStock?: boolean;
};
export type MixPack = { qty: number; discount: number };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const DEFAULT_PRODUCTS: MultiProduct[] = [
  {
    name: "Everyday Tee",
    price: 24,
    icon: "👕",
    options: [
      { name: "Color", values: ["White", "Black", "Navy"] },
      { name: "Size", values: ["S", "M", "L"] },
    ],
  },
  { name: "Canvas Tote", price: 18, icon: "👜" },
  { name: "Ceramic Mug", price: 14, icon: "☕", options: [{ name: "Color", values: ["Cream", "Charcoal", "Sage"] }] },
  { name: "Scented Candle", price: 22, icon: "🕯️" },
  { name: "Water Bottle", price: 16, icon: "🍶", options: [{ name: "Size", values: ["500ml", "750ml"] }] },
  { name: "Wireless Earbuds", price: 89, icon: "🎧", outOfStock: true },
];

type Line = {
  key: string;
  name: string;
  icon: string;
  price: number;
  variant: string;
  qty: number;
};

export function MixMatchMultiDemo({
  products = DEFAULT_PRODUCTS,
  packs = [
    { qty: 4, discount: 5 },
    { qty: 8, discount: 10 },
    { qty: 12, discount: 15 },
  ],
  className,
}: {
  products?: MultiProduct[];
  packs?: MixPack[];
  className?: string;
}) {
  const [packIndex, setPackIndex] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ values: string[]; qty: number }>({
    values: [],
    qty: 1,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const pack = packs[packIndex];
  const target = pack.qty;
  const factor = 1 - pack.discount / 100;
  const selectedCount = lines.reduce((s, l) => s + l.qty, 0);
  const remaining = target - selectedCount;
  const full = remaining <= 0;
  const original = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const total = original * factor;

  const reset = () => {
    setLines([]);
    setOpenIdx(null);
  };

  const selectPack = (i: number) => {
    setPackIndex(i);
    reset();
  };

  const addLine = (name: string, icon: string, price: number, variant: string, qty: number) => {
    const key = `${name}|${variant}`;
    setLines((prev) => {
      const capped = Math.min(qty, remaining);
      if (capped <= 0) return prev;
      const idx = prev.findIndex((l) => l.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + capped };
        return next;
      }
      return [...prev, { key, name, icon, price, variant, qty: capped }];
    });
  };

  const openOptions = (i: number) => {
    const p = products[i];
    setOpenIdx(i);
    setDraft({ values: (p.options ?? []).map((o) => o.values[0]), qty: 1 });
  };

  const addConfigured = (i: number) => {
    const p = products[i];
    const variant = draft.values.join(" · ");
    addLine(p.name, p.icon, p.price, variant, draft.qty);
    setOpenIdx(null);
  };

  const changeLineQty = (key: string, delta: number) =>
    setLines((prev) => {
      const others = selectedCount - (prev.find((l) => l.key === key)?.qty ?? 0);
      return prev.flatMap((l) => {
        if (l.key !== key) return [l];
        const q = Math.min(l.qty + delta, target - others);
        return q <= 0 ? [] : [{ ...l, qty: q }];
      });
    });

  const addToCart = () => {
    if (!full) return;
    setNotice(`Bundle of ${target} added to cart · ${usd(total)}`);
    reset();
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  };

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const iconTile = (icon: string, size = "size-10 text-xl") => (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-md bg-surface-subtle ring-1 ring-black/5",
        size,
      )}
    >
      {icon}
    </span>
  );

  return (
    <div className={cn("w-full px-4 pt-4 text-foreground sm:px-5 sm:pt-5", className)}>
      {/* Choose a pack */}
      <p className="text-sm font-semibold">Choose a pack</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {packs.map((pk, i) => {
          const sel = i === packIndex;
          return (
            <button
              key={pk.qty}
              type="button"
              aria-pressed={sel}
              onClick={() => selectPack(i)}
              className={cn(
                "flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors",
                sel
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border hover:border-primary/40",
              )}
            >
              <span className="text-sm font-bold">Pack {pk.qty}</span>
              <span className={cn("text-xs", sel ? "text-primary-foreground/80" : "text-muted")}>
                Save {pk.discount}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected items tray */}
      <div className="mt-4 rounded-xl border border-border bg-surface-subtle p-3">
        <p className="text-sm font-semibold">
          Selected products {selectedCount}/{target}
        </p>
        {lines.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-2.5">
                {iconTile(l.icon, "size-8 text-base")}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">{l.name}</span>
                  {l.variant && (
                    <span className="block truncate text-[11px] text-muted">{l.variant}</span>
                  )}
                </span>
                <span className="flex items-center rounded-md border border-border">
                  <button type="button" onClick={() => changeLineQty(l.key, -1)} aria-label={`Decrease ${l.name}`} className="grid size-6 place-items-center text-muted hover:text-foreground">−</button>
                  <span className="w-5 text-center text-xs tabular-nums">{l.qty}</span>
                  <button type="button" onClick={() => changeLineQty(l.key, 1)} disabled={full} aria-label={`Increase ${l.name}`} className="grid size-6 place-items-center text-muted hover:text-foreground disabled:opacity-40">+</button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted">
            Nothing yet — add {target} items from the products below.
          </p>
        )}
      </div>

      {/* Product grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {products.map((p, i) => {
          const hasOptions = !!p.options?.length;
          const isOpen = openIdx === i;
          return (
            <div key={p.name} className="flex flex-col rounded-lg border border-border p-2.5">
              {iconTile(p.icon, "h-16 w-full text-3xl")}
              <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
              <p className="mt-0.5 text-xs">
                <span className="text-muted line-through">{usd(p.price)}</span>{" "}
                <span className="font-semibold">{usd(p.price * factor)}</span>
                <span className="ml-1 rounded bg-primary-subtle px-1 py-0.5 text-[10px] font-semibold text-primary">
                  {pack.discount}% off
                </span>
              </p>

              <div className="mt-2">
                {p.outOfStock ? (
                  <button type="button" disabled className="w-full cursor-not-allowed rounded-md border border-border py-1.5 text-xs font-semibold text-muted opacity-70">
                    Out of stock
                  </button>
                ) : hasOptions ? (
                  <button
                    type="button"
                    onClick={() => (isOpen ? setOpenIdx(null) : openOptions(i))}
                    disabled={full}
                    className="w-full rounded-md border border-primary py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-subtle disabled:opacity-40"
                  >
                    {isOpen ? "Close" : "See options"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addLine(p.name, p.icon, p.price, "", 1)}
                    disabled={full}
                    className="w-full rounded-md border border-primary py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-subtle disabled:opacity-40"
                  >
                    Add to box
                  </button>
                )}
              </div>

              {/* Inline options panel */}
              {isOpen && hasOptions && (
                <div className="mt-2 space-y-2 rounded-md bg-surface-subtle p-2.5">
                  {p.options!.map((opt, oi) => (
                    <div key={opt.name}>
                      <p className="text-[11px] font-semibold text-muted">{opt.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {opt.values.map((val) => {
                          const on = draft.values[oi] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setDraft((d) => ({
                                  ...d,
                                  values: d.values.map((x, xi) => (xi === oi ? val : x)),
                                }))
                              }
                              className={cn(
                                "rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
                                on
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:border-primary/40",
                              )}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="flex items-center rounded-md border border-border bg-surface">
                      <button type="button" onClick={() => setDraft((d) => ({ ...d, qty: Math.max(1, d.qty - 1) }))} aria-label="Decrease quantity" className="grid size-6 place-items-center text-muted hover:text-foreground">−</button>
                      <span className="w-5 text-center text-xs tabular-nums">{draft.qty}</span>
                      <button type="button" onClick={() => setDraft((d) => ({ ...d, qty: d.qty + 1 }))} aria-label="Increase quantity" className="grid size-6 place-items-center text-muted hover:text-foreground">+</button>
                    </span>
                    <button
                      type="button"
                      onClick={() => addConfigured(i)}
                      className="h-8 flex-1 rounded-md bg-button-gradient px-2 text-xs font-semibold text-white shadow-glow"
                    >
                      Add to box
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total + add to cart (flush bottom) */}
      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
        {notice && (
          <div role="status" className="mb-2.5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success-foreground">
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
              ({selectedCount}/{target})
            </span>
          </span>
          <span className="whitespace-nowrap text-sm">
            {selectedCount > 0 && (
              <span className="mr-1.5 text-muted line-through">{usd(original)}</span>
            )}
            <span className="font-semibold">{usd(total)}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={!full}
          className={cn(buttonStyles({ variant: "gradient" }), "mt-2.5 w-full")}
        >
          {full
            ? "Add to cart"
            : `Add ${remaining} more item${remaining === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}
