"use client";

import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mix & Match (Single Product) interactive demo — models the live PushBundle
 * widget: choose a pack size (with a % discount), then fill it by adding colour
 * variants of one product from the grid. The cart summary sticks to the bottom
 * of the box. Reusable + prop-driven for the showcase, Features page, etc.
 */
export type MixPack = {
  qty: number;
  discount: number;
  /** Optional explicit per-unit price; overrides `discount` for pricing. */
  pricePerUnit?: number;
};
export type MixVariant = { name: string; color: string };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

/** A t-shirt silhouette filled with the variant colour. */
function ColorTee({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-11", className)}
      fill={color}
      stroke="rgba(0,0,0,0.16)"
      strokeWidth="0.75"
      strokeLinejoin="round"
    >
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
    </svg>
  );
}

export function MixMatchSingleDemo({
  productName = "Everyday Tee",
  basePrice = 24,
  packs = [
    { qty: 5, discount: 5 },
    { qty: 8, discount: 8 },
    { qty: 10, discount: 10 },
    { qty: 15, discount: 15 },
  ],
  variants = [
    { name: "Amber", color: "#f59e0b" },
    { name: "Coral", color: "#fb7185" },
    { name: "Sea Glass", color: "#2dd4bf" },
    { name: "Rose", color: "#f9a8d4" },
    { name: "Sky", color: "#60a5fa" },
    { name: "Olive", color: "#84cc16" },
    { name: "Slate", color: "#64748b" },
    { name: "Plum", color: "#a855f7" },
  ],
  /** Noun shown in the per-pack unit price, e.g. "$22.00 / shirt". */
  unitNoun = "item",
  /** Embedded in a ProductStage: drop outer padding + inline (non-sticky) cart. */
  embedded = false,
  className,
}: {
  productName?: string;
  basePrice?: number;
  packs?: MixPack[];
  variants?: MixVariant[];
  unitNoun?: string;
  embedded?: boolean;
  className?: string;
}) {
  const [packIndex, setPackIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const unitOf = (pk: MixPack) =>
    pk.pricePerUnit ?? basePrice * (1 - pk.discount / 100);
  const pack = packs[packIndex];
  const target = pack.qty;
  const unitPrice = unitOf(pack);
  const discountPct = Math.round((1 - unitPrice / basePrice) * 100);
  const selectedCount = Object.values(picks).reduce((s, q) => s + q, 0);
  const remaining = target - selectedCount;
  const full = remaining <= 0;
  const total = selectedCount * unitPrice;
  const originalTotal = selectedCount * basePrice;
  // Selected units flattened in add-order, for the footer slots.
  const flatUnits = Object.entries(picks).flatMap(([name, qty]) =>
    Array<string>(qty).fill(name),
  );

  const selectPack = (i: number) => {
    setPackIndex(i);
    setPicks({}); // fresh pack (new size/discount)
  };

  const add = (name: string) => {
    if (full) return;
    setPicks((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
  };

  const changeQty = (name: string, delta: number) => {
    setPicks((prev) => {
      const others = selectedCount - (prev[name] ?? 0);
      const q = Math.min((prev[name] ?? 0) + delta, target - others);
      const next = { ...prev };
      if (q <= 0) delete next[name];
      else next[name] = q;
      return next;
    });
  };

  const addToCart = () => {
    if (!full) return;
    setNotice(`Added ${target} × ${productName} to cart · ${usd(total)}`);
    setPicks({});
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
              <span className="text-sm font-bold">Pack of {pk.qty}</span>
              <span
                className={cn(
                  "text-xs",
                  sel ? "text-primary-foreground/80" : "text-muted",
                )}
              >
                {usd(unitOf(pk))} / {unitNoun}
              </span>
            </button>
          );
        })}
      </div>

      {/* Variant grid — compact colour-tee cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {variants.map((v) => {
          const qty = picks[v.name] ?? 0;
          return (
            <div key={v.name} className="rounded-lg border border-border p-2.5">
              <span className="grid h-20 w-full place-items-center rounded-md bg-surface-subtle ring-1 ring-black/5">
                <ColorTee color={v.color} className="size-12" />
              </span>
              <p className="mt-2 truncate text-sm font-semibold">
                {v.name} {productName}
              </p>
              <p className="mt-0.5 text-xs">
                {unitPrice < basePrice && (
                  <span className="text-muted line-through">{usd(basePrice)}</span>
                )}{" "}
                <span className="font-semibold">{usd(unitPrice)}</span>
                {discountPct > 0 && (
                  <span className="ml-1 rounded bg-primary-subtle px-1 py-0.5 text-[10px] font-semibold text-primary">
                    {discountPct}% off
                  </span>
                )}
              </p>
              <div className="mt-2">
                {qty > 0 ? (
                  <div className="flex items-center justify-between rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => changeQty(v.name, -1)}
                      aria-label={`Decrease ${v.name}`}
                      className="grid size-7 place-items-center text-muted hover:text-foreground"
                    >
                      −
                    </button>
                    <span className="text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(v.name, 1)}
                      disabled={full}
                      aria-label={`Increase ${v.name}`}
                      className="grid size-7 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => add(v.name)}
                    disabled={full}
                    className="w-full rounded-md border border-primary py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-subtle disabled:opacity-40"
                  >
                    Add to bundle
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart summary — sticks to the bottom of the scroll box in both modes.
          Embedded, it breaks out of the host card's padding to span its width. */}
      <div
        className={cn(
          "sticky bottom-0 mt-4 border-t",
          embedded
            ? "-mx-4 -mb-4 rounded-b-[10px] border-primary/20 bg-white px-4 py-3"
            : "-mx-4 border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5",
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
            Selected products {selectedCount}/{target}
          </span>
          {selectedCount > 0 && (
            <span className="whitespace-nowrap text-xs text-muted line-through">
              {usd(originalTotal)}
            </span>
          )}
        </div>

        {/* Slots — one per unit; filled show the picked tee, empty are placeholders */}
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: target }).map((_, s) => {
            const name = flatUnits[s];
            const v = name ? variants.find((x) => x.name === name) : undefined;
            return v ? (
              <span
                key={s}
                className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-subtle ring-1 ring-border"
              >
                <ColorTee color={v.color} className="size-6" />
              </span>
            ) : (
              <span
                key={s}
                className="size-10 shrink-0 rounded-md border border-dashed border-border bg-surface-subtle/40"
              />
            );
          })}
        </div>

        {/* Clearly disabled (grey) until the pack is full, then a solid, tappable
            accent button. */}
        <button
          type="button"
          onClick={addToCart}
          disabled={!full}
          aria-disabled={!full}
          className={cn(
            "mt-2.5 w-full",
            embedded
              ? cn(
                  "rounded-lg py-3 text-sm font-semibold transition-colors",
                  full
                    ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary-hover"
                    : "cursor-not-allowed bg-surface-subtle text-muted",
                )
              : buttonStyles({ variant: "gradient" }),
          )}
        >
          <span className="flex w-full items-center justify-between px-1">
            <span>{full ? "Add to cart" : `Add ${remaining} more`}</span>
            <span>{usd(total)}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
