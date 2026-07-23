"use client";

import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mix & Match (Single Product) interactive demo — models the live PushBundle
 * widget: choose a pack size (with a % discount), then fill it by adding colour
 * variants of one product from the grid. Reusable + prop-driven so it can be
 * dropped into the homepage showcase, the Features page, or anywhere.
 */
export type MixPack = { qty: number; discount: number };
export type MixVariant = { name: string; color: string };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

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
  className,
}: {
  productName?: string;
  basePrice?: number;
  packs?: MixPack[];
  variants?: MixVariant[];
  className?: string;
}) {
  const [packIndex, setPackIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const pack = packs[packIndex];
  const target = pack.qty;
  const unitPrice = basePrice * (1 - pack.discount / 100);
  const selectedCount = Object.values(picks).reduce((s, q) => s + q, 0);
  const remaining = target - selectedCount;
  const full = remaining <= 0;
  const total = selectedCount * unitPrice;
  const originalTotal = selectedCount * basePrice;

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

  const swatch = (color: string, size = "size-3") => (
    <span
      aria-hidden="true"
      className={cn("shrink-0 rounded-full ring-1 ring-black/15", size)}
      style={{ background: color }}
    />
  );

  return (
    <div className={cn("w-full text-foreground", className)}>
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
                Save {pk.discount}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected summary + add to cart */}
      <div className="mt-4 rounded-xl border border-border bg-surface-subtle p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            Selected products {selectedCount}/{target}
          </p>
          <p className="whitespace-nowrap text-sm">
            <span className="font-semibold">{usd(total)}</span>{" "}
            {selectedCount > 0 && (
              <span className="text-muted line-through">
                {usd(originalTotal)}
              </span>
            )}
          </p>
        </div>

        <div className="mt-3 flex gap-1">
          {Array.from({ length: target }).map((_, s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s < selectedCount ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>

        {selectedCount > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.entries(picks).map(([name, qty]) => {
              const v = variants.find((x) => x.name === name);
              return (
                <span
                  key={name}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-1 text-xs"
                >
                  {v && swatch(v.color)}
                  {name} ×{qty}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted">
            Nothing yet — add {target} from the grid below.
          </p>
        )}

        {notice && (
          <div
            role="status"
            className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success-foreground"
          >
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
            {notice}
          </div>
        )}

        <button
          type="button"
          onClick={addToCart}
          disabled={!full}
          className={cn(buttonStyles({ variant: "gradient" }), "mt-3 w-full")}
        >
          {full
            ? `Add to cart — ${usd(total)}`
            : `Add ${remaining} more item${remaining === 1 ? "" : "s"}`}
        </button>
      </div>

      {/* Variant grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {variants.map((v) => {
          const qty = picks[v.name] ?? 0;
          return (
            <div key={v.name} className="rounded-lg border border-border p-3">
              <span
                aria-hidden="true"
                className="block aspect-square w-full rounded-md ring-1 ring-black/10"
                style={{ background: v.color }}
              />
              <p className="mt-2 truncate text-sm font-semibold">
                {v.name} {productName}
              </p>
              <p className="mt-0.5 text-xs">
                <span className="text-muted line-through">{usd(basePrice)}</span>{" "}
                <span className="font-semibold">{usd(unitPrice)}</span>
                <span className="ml-1 rounded bg-primary-subtle px-1 py-0.5 text-[10px] font-semibold text-primary">
                  {pack.discount}% off
                </span>
              </p>

              <div className="mt-2">
                {qty > 0 ? (
                  <div className="flex items-center justify-between rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => changeQty(v.name, -1)}
                      aria-label={`Decrease ${v.name}`}
                      className="grid size-8 place-items-center text-muted hover:text-foreground"
                    >
                      −
                    </button>
                    <span className="text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(v.name, 1)}
                      disabled={full}
                      aria-label={`Increase ${v.name}`}
                      className="grid size-8 place-items-center text-muted hover:text-foreground disabled:opacity-40"
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
    </div>
  );
}
