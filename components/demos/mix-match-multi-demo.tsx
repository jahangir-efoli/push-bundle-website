"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductThumb } from "@/components/demos/product-thumb";
import type { CartBundle } from "@/components/demos/cart-drawer";
import { cn } from "@/lib/utils";
import { useDemoContent, fmt } from "@/lib/content/demo-content";

/**
 * Mix & Match (Multiple Products) interactive demo — models the live PushBundle
 * "build a box from a catalog" widget: choose a box size (with a % discount),
 * browse products by category, and fill the box from any mix of products. A
 * "My Pack" tray tracks progress + the discounted total. Reusable + prop-driven.
 */
export type MultiBox = { qty: number; discount: number };
export type CatalogProduct = {
  name: string;
  price: number;
  /** Emoji fallback until a real image is uploaded. */
  icon: string;
  /** Real product photo; falls back to `icon` when missing. */
  image?: string;
  category: string;
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const DEFAULT_BOXES: MultiBox[] = [
  { qty: 4, discount: 0 },
  { qty: 6, discount: 10 },
  { qty: 8, discount: 12 },
  { qty: 10, discount: 15 },
];

const DEFAULT_PRODUCTS: CatalogProduct[] = [
  { name: "Accent Chair — Blush", price: 75, icon: "🪑", image: "/images/demos/mix-multi/accent-chair-blush.png", category: "Furniture" },
  { name: "Accent Chair — Grey", price: 80, icon: "🪑", image: "/images/demos/mix-multi/accent-chair-grey.png", category: "Furniture" },
  { name: "Accent Chair — Check", price: 78, icon: "🪑", image: "/images/demos/mix-multi/accent-chair-check.png", category: "Furniture" },
  { name: "Texture Table Lamp", price: 42, icon: "🪔", image: "/images/demos/mix-multi/texture-table-lamp.png", category: "Home Decor" },
  { name: "Wave Table Lamp", price: 45, icon: "🪔", image: "/images/demos/mix-multi/wave-table-lamp.png", category: "Home Decor" },
  { name: "Ceramic Flower Vase", price: 35, icon: "🏺", image: "/images/demos/mix-multi/ceramic-flower-vase.png", category: "Home Decor" },
  { name: "Woven Basket", price: 28, icon: "🧺", image: "/images/demos/mix-multi/woven-basket.png", category: "Accessories" },
  { name: "Scented Candle", price: 22, icon: "🕯️", image: "/images/demos/mix-multi/scented-candle.png", category: "Accessories" },
  { name: "Photo Frame", price: 18, icon: "🖼️", image: "/images/demos/mix-multi/photo-frame.png", category: "Accessories" },
];

export function MixMatchMultiDemo({
  boxes = DEFAULT_BOXES,
  products: productsProp,
  onAddToCart,
  className,
}: {
  boxes?: MultiBox[];
  products?: CatalogProduct[];
  onAddToCart?: (bundle: CartBundle) => void;
  className?: string;
}) {
  const content = useDemoContent();
  // Names + categories are localized; prices/icons/images stay fixed.
  const products =
    productsProp ??
    DEFAULT_PRODUCTS.map((p, i) => ({
      ...p,
      name: content.mixMulti.products[i].name,
      category: content.mixMulti.products[i].category,
    }));
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products],
  );
  const [boxIndex, setBoxIndex] = useState(() =>
    Math.min(1, boxes.length - 1),
  );
  const [activeCat, setActiveCat] = useState(categories[0]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const box = boxes[boxIndex];
  const target = box.qty;
  const discount = box.discount;
  const factor = 1 - discount / 100;
  const selectedCount = Object.values(qty).reduce((s, q) => s + q, 0);
  const remaining = target - selectedCount;
  const full = remaining <= 0;

  const find = (name: string) => products.find((p) => p.name === name);
  const original = Object.entries(qty).reduce(
    (s, [n, q]) => s + (find(n)?.price ?? 0) * q,
    0,
  );
  const total = original * factor;
  const selectedItems = Object.entries(qty).filter(([, q]) => q > 0);
  const shown = products.filter((p) => p.category === activeCat);

  const selectBox = (i: number) => {
    setBoxIndex(i);
    setQty({}); // fresh box
  };

  const changeQty = (name: string, delta: number) =>
    setQty((prev) => {
      const others = selectedCount - (prev[name] ?? 0);
      const q = Math.max(0, Math.min((prev[name] ?? 0) + delta, target - others));
      const next = { ...prev };
      if (q <= 0) delete next[name];
      else next[name] = q;
      return next;
    });

  const addToCart = () => {
    if (!full) return;
    if (onAddToCart) {
      const items = selectedItems.flatMap(([name, q]) =>
        Array.from({ length: q }, () => ({
          name,
          img: find(name)?.image,
        })),
      );
      onAddToCart({
        title: fmt(content.mixMulti.cartBoxTitle, { n: target }),
        id: `MIX-${target}BOX`,
        img: items[0]?.img,
        price: total,
        subtotal: total,
        items,
      });
      setQty({});
      return;
    }
    setNotice(fmt(content.ui.boxAddedToCart, { n: target, price: usd(total) }));
    setQty({});
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  };

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const tile = (icon: string, size: string, image?: string, alt = "") => (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-md ring-1 ring-black/5",
        image ? "bg-white" : "bg-surface-subtle",
        size,
      )}
    >
      <ProductThumb
        src={image}
        alt={alt}
        fallback={<span aria-hidden="true">{icon}</span>}
      />
    </span>
  );

  return (
    <div className={cn("@container w-full p-4 text-foreground sm:p-5", className)}>
      {/* Box tiers */}
      <div className="grid grid-cols-2 gap-2 @sm:grid-cols-4">
        {boxes.map((bx, i) => {
          const sel = i === boxIndex;
          return (
            <button
              key={bx.qty}
              type="button"
              aria-pressed={sel}
              onClick={() => selectBox(i)}
              className={cn(
                "rounded-lg border px-2 py-2 text-center transition-colors",
                sel
                  ? "border-transparent bg-foreground text-background shadow-soft"
                  : "border-border hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "block text-[10px] font-semibold uppercase tracking-wide",
                  sel ? "text-background/70" : "text-muted",
                )}
              >
                {fmt(content.ui.boxOfItems, { n: bx.qty })}
              </span>
              {bx.discount > 0 ? (
                <span className="mt-1 inline-block rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {fmt(content.ui.percentOffCaps, { d: bx.discount })}
                </span>
              ) : (
                <span className="mt-1 block text-sm font-bold">{content.ui.regular}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category tabs */}
      <div className="mt-4 flex gap-4 overflow-x-auto border-b border-border">
        {categories.map((cat) => {
          const on = cat === activeCat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={cn(
                "-mb-px whitespace-nowrap border-b-2 pb-2 text-sm font-semibold transition-colors",
                on
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products + My Pack */}
      <div className="mt-4 grid gap-4 @md:grid-cols-[1.5fr_1fr]">
        {/* Product grid (filtered by category) */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {shown.map((p) => {
              const q = qty[p.name] ?? 0;
              return (
                <div key={p.name} className="rounded-lg border border-border p-2.5">
                  {tile(p.icon, "aspect-square w-full text-3xl", p.image, p.name)}
                  <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted">{usd(p.price)}</p>
                  <div className="mt-2 flex items-center justify-between rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => changeQty(p.name, -1)}
                      disabled={q <= 0}
                      aria-label={fmt(content.ui.decrease, { name: p.name })}
                      className="grid size-7 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="text-sm tabular-nums">{q}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(p.name, 1)}
                      disabled={full}
                      aria-label={fmt(content.ui.increase, { name: p.name })}
                      className="grid size-7 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Pack tray */}
        <div className="rounded-xl border border-border bg-surface-subtle/50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              {content.ui.myPack}
              <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground tabular-nums">
                {selectedCount}/{target}
              </span>
            </p>
            {selectedCount > 0 && (
              <span className="whitespace-nowrap text-sm">
                {discount > 0 && (
                  <span className="mr-1 text-xs text-muted line-through">
                    {usd(original)}
                  </span>
                )}
                <span className="font-bold">{usd(total)}</span>
              </span>
            )}
          </div>

          <ul className="mt-2.5 space-y-2">
            {selectedItems.map(([name, q]) => (
              <li key={name} className="flex items-center gap-2">
                {tile(find(name)?.icon ?? "", "size-8 text-base", find(name)?.image, name)}
                <span className="min-w-0 flex-1 truncate text-xs font-medium">
                  {name}
                </span>
                <span className="flex items-center rounded-md border border-border">
                  <button type="button" onClick={() => changeQty(name, -1)} aria-label={fmt(content.ui.decrease, { name })} className="grid size-6 place-items-center text-muted hover:text-foreground">−</button>
                  <span className="w-5 text-center text-xs tabular-nums">{q}</span>
                  <button type="button" onClick={() => changeQty(name, 1)} disabled={full} aria-label={fmt(content.ui.increase, { name })} className="grid size-6 place-items-center text-muted hover:text-foreground disabled:opacity-40">+</button>
                </span>
              </li>
            ))}
            {!full && (
              <li className="flex items-center gap-2 rounded-md border border-dashed border-border px-2 py-2 text-xs text-muted">
                <span className="grid size-8 shrink-0 place-items-center rounded-md text-lg text-muted">
                  +
                </span>
                {fmt(content.ui.addMoreToBox, { n: remaining })}
              </li>
            )}
          </ul>

          {notice && (
            <div role="status" className="mt-2.5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-2.5 py-2 text-xs font-medium text-success-foreground">
              <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
              {notice}
            </div>
          )}

          <button
            type="button"
            onClick={addToCart}
            disabled={!full}
            aria-disabled={!full}
            className={cn(
              "mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
              full
                ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary-hover"
                : "cursor-not-allowed bg-surface-subtle text-muted",
            )}
          >
            <span className="flex w-full items-center justify-between">
              <span>{content.ui.addToCart}</span>
              <span>{usd(total)}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
