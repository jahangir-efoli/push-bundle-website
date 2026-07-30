"use client";

import { useEffect, useRef, useState } from "react";
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
/** A free reward that unlocks once the selected tier reaches `unlockAt` units. */
export type VolumeGift = {
  label: string;
  unlockAt: number;
  icon?: "gift" | "shipping" | "sparkles";
};

/** Small inline glyphs for the free-gift tiles. */
function GiftGlyph({ name }: { name: VolumeGift["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-full",
  };
  if (name === "shipping")
    return (
      <svg {...common}>
        <path d="M1.5 5h13v10.5h-13z" />
        <path d="M14.5 8.5h4L22 12v3.5h-7.5z" />
        <circle cx="5.5" cy="17.8" r="2.1" />
        <circle cx="17.8" cy="17.8" r="2.1" />
      </svg>
    );
  if (name === "sparkles")
    return (
      <svg {...common}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

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
  gifts = [],
  giftsHeading = "Free gifts & shipping with your order",
  heading = "Save more on bulk purchases",
  icon,
  /** Embedded in a ProductStage: hide the product header + drop outer padding
      (the stage already shows the product identity and provides spacing). */
  embedded = false,
  className,
}: {
  productName?: string;
  basePrice?: number;
  tiers?: VolumeTier[];
  variants?: string[];
  popularQty?: number;
  /** Free rewards that unlock as the chosen tier grows (empty = none shown). */
  gifts?: VolumeGift[];
  giftsHeading?: string;
  heading?: string;
  /** Product thumbnail — a custom node/image; defaults to a t-shirt icon. */
  icon?: React.ReactNode;
  embedded?: boolean;
  className?: string;
}) {
  const [selected, setSelected] = useState(() => {
    const i = tiers.findIndex((t) => t.qty === popularQty);
    return i >= 0 ? i : 0;
  });
  const [items, setItems] = useState<Array<{ variant: string; qty: number }>>(
    [],
  );
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

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
  };

  const addVariant = (v: string) => {
    if (!v || full) return;
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
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addToCart = () => {
    if (!full) return;
    setNotice(`Added ${target} × ${productName} to cart · ${usd(price(tier))}`);
    setItems([]); // reset so the pack can be built again
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  };

  // Clear the auto-dismiss timer on unmount.
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  return (
    <div
      className={cn(
        "w-full text-foreground",
        !embedded && "p-4 sm:p-5",
        className,
      )}
    >
      {/* Product header */}
      {!embedded && (
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-soft"
        >
          {icon ?? (
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
            </svg>
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{productName}</p>
          <p className="text-sm text-muted">{usd(basePrice)} / item</p>
        </div>
      </div>
      )}

      {/* A widget label, not a document heading — keeps the demo embeddable
          anywhere without disturbing the page's heading outline. Omitted when
          the host (e.g. ProductStage) already supplies a section header. */}
      {heading && (
        <p
          className={cn(
            "font-display text-base font-bold",
            !embedded && "mt-5",
          )}
        >
          {heading}
        </p>
      )}

      {/* Tiers (space-y-4 leaves room for the "Most popular" badge overhang) */}
      <div className="mt-3 space-y-4">
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
                data-tier-qty={t.qty}
                className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left"
              >
                <span className="flex min-w-0 items-center gap-1.5">
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
                  <span className="font-semibold whitespace-nowrap">
                    Buy {t.qty}
                  </span>
                  <span className="rounded bg-primary-subtle px-1 py-0.5 text-[10px] font-semibold whitespace-nowrap text-primary">
                    {t.discount}% off
                  </span>
                </span>
                <span className="whitespace-nowrap text-right text-sm">
                  <span className="font-semibold">{usd(price(t))}</span>{" "}
                  <span className="text-[11px] text-muted line-through">
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
                  <div className="relative">
                    <select
                      id={`vb-select-${t.qty}`}
                      value=""
                      onChange={(e) => addVariant(e.target.value)}
                      disabled={full}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-surface pl-3 pr-10 text-sm text-foreground focus-visible:border-primary disabled:opacity-60"
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
                    {/* Custom chevron — the native one ignores padding-right. */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

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

      {/* Free gifts & shipping — unlock automatically as the chosen tier grows.
          Clicking a locked reward jumps to the tier that unlocks it. */}
      {gifts.length > 0 && (
        <div className="mt-4 rounded-xl border border-success/30 bg-success/10 p-3">
          <p className="mb-2.5 text-xs font-bold text-success-foreground">
            {giftsHeading}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {gifts.map((g) => {
              const unlocked = tier.qty >= g.unlockAt;
              const unlockIdx = tiers.findIndex((t) => t.qty === g.unlockAt);
              return (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => unlockIdx >= 0 && selectTier(unlockIdx)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors",
                    unlocked
                      ? "border-success/50 bg-success/15"
                      : "border-border bg-surface hover:border-success/40",
                  )}
                >
                  {!unlocked && (
                    <span
                      aria-hidden="true"
                      className="absolute right-1.5 top-1.5 text-[10px] opacity-55"
                    >
                      🔒
                    </span>
                  )}
                  <span
                    className={cn(
                      "size-8 transition-colors",
                      unlocked
                        ? "text-success-foreground"
                        : "text-muted opacity-55",
                    )}
                  >
                    <GiftGlyph name={g.icon} />
                  </span>
                  <span
                    className={cn(
                      "text-[10.5px] leading-tight font-semibold",
                      unlocked ? "text-success-foreground" : "text-muted",
                    )}
                  >
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Success notification — auto-dismisses; the pack resets on add. */}
      {notice && (
        <div
          role="status"
          className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 text-sm font-medium text-success-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
          {notice}
        </div>
      )}

      {/* Add to cart — solid (primary) when embedded so it follows the host's
          accent (e.g. the berry bundle card); gradient when standalone. */}
      <button
        type="button"
        onClick={addToCart}
        disabled={!full}
        className={cn(
          buttonStyles({ variant: embedded ? "primary" : "gradient" }),
          "mt-4 w-full",
        )}
      >
        {full
          ? `Add to cart — ${usd(price(tier))}`
          : `Add ${remaining} more item${remaining === 1 ? "" : "s"}`}
      </button>
    </div>
  );
}
