"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated Build-a-Box demo for the hero (docs/PLAN.md §5.1 §2).
 *
 * Loops the real product flow: choose a pack → add variants → the selection
 * panel fills → Add to Cart → reset.
 *
 * Deliberate constraints:
 *  - `aria-hidden`: this is a decorative product demo. The hero copy carries
 *    the meaning, and looping live-region chatter would be hostile to screen
 *    readers. It contains no interactive controls for the same reason.
 *  - Fixed heights on the panel so stepping never shifts layout (CLS stays 0).
 *  - Only transform/opacity/colour transition — no animation library (§6/§7).
 *  - Pauses when off-screen or the tab is hidden, and renders a settled static
 *    state under `prefers-reduced-motion`.
 *
 * Product names/prices are invented demo data, not a real catalogue.
 */

/**
 * Pack sizes are small so the loop can actually FILL the selected pack before
 * checking out — a "Pack of 10" that adds to cart at 3 items is incoherent.
 */
const PACKS = [
  { size: 3, save: 12 },
  { size: 5, save: 24 },
  { size: 10, save: 60 },
];

const PRODUCTS = [
  { name: "Amber Drop", price: 24, tone: "bg-primary/70" },
  { name: "Coral Bloom", price: 24, tone: "bg-accent/70" },
  { name: "Ivory Knot", price: 24, tone: "bg-foreground/15" },
  { name: "Sea Glass", price: 24, tone: "bg-accent/45" },
  { name: "Rose Quartz", price: 24, tone: "bg-primary/40" },
  { name: "Dune Pearl", price: 24, tone: "bg-foreground/10" },
];

/** Items added by the end of each step; the last step is the "added" state. */
const STEPS = [0, 1, 2, 3, 3] as const;
const STEP_MS = 1150;
const PACK = PACKS[0];

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** The OS motion preference is an external store, not component state. */
function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function BundleDemo({ className }: { className?: string }) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );

  const [tick, setTick] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Reduced motion: render the settled end state instead of looping.
  const step = prefersReducedMotion ? STEPS.length - 1 : tick;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion) return;

    let timer: number | undefined;
    let visible = false;

    const advance = () => {
      setTick((s) => (s + 1) % STEPS.length);
      timer = window.setTimeout(advance, STEP_MS);
    };
    const start = () => {
      if (timer !== undefined || !visible || document.hidden) return;
      timer = window.setTimeout(advance, STEP_MS);
    };
    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };

    // Only animate while on screen — keeps the main thread free otherwise.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [prefersReducedMotion]);

  const selectedCount = STEPS[step];
  const added = step === STEPS.length - 1;
  const complete = selectedCount >= PACK.size;
  const subtotal = selectedCount * PRODUCTS[0].price;
  // The pack discount only applies once the pack is actually full.
  const total = complete ? subtotal - PACK.save : subtotal;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-lift",
        className,
      )}
    >
      {/* Pack chooser */}
      <div className="border-b border-border p-3">
        <p className="text-[11px] font-semibold text-muted">Choose a pack</p>
        <div className="mt-1.5 flex gap-1.5">
          {PACKS.map((pack, i) => (
            <div
              key={pack.size}
              className={cn(
                "flex-1 rounded-lg border px-2.5 py-2 transition-colors duration-300",
                i === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-subtle",
              )}
            >
              <p className="text-[11px] font-semibold leading-tight">
                Pack of {pack.size}
              </p>
              <p
                className={cn(
                  // Full-opacity foreground: /80 on bg-primary measured 4.06:1,
                  // below the AA threshold for this 11px text.
                  "text-[11px] leading-tight",
                  i === 0 ? "text-primary-foreground" : "text-muted",
                )}
              >
                Save ${pack.save}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Product grid — short tiles keep the whole hero inside one viewport */}
      <div className="grid grid-cols-3 gap-1.5 p-3">
        {PRODUCTS.map((product, i) => {
          const isAdded = i < selectedCount;
          return (
            <div
              key={product.name}
              className={cn(
                "rounded-lg border p-1.5 transition-colors duration-300",
                isAdded
                  ? "border-primary bg-primary-subtle"
                  : "border-border bg-surface",
              )}
            >
              <div className="grid h-10 place-items-center rounded-md bg-surface-subtle">
                <span
                  className={cn(
                    "size-5 rounded-full transition-transform duration-300",
                    product.tone,
                    isAdded && "scale-110",
                  )}
                />
              </div>
              <p className="mt-1 truncate text-[10px] font-semibold leading-tight">
                {product.name}
              </p>
              <p className="text-[10px] leading-tight text-muted">
                ${product.price}.00
              </p>
            </div>
          );
        })}
      </div>

      {/* Selection panel — fixed height so rows never shift the layout */}
      <div className="border-t border-border bg-surface-subtle p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold">Selected Products</p>
          <p className="flex items-center gap-2 text-[11px] font-semibold">
            {complete && (
              <span className="rounded bg-warm-subtle px-1.5 text-warm-foreground">
                Save ${PACK.save}
              </span>
            )}
            <span className="text-primary">
              {selectedCount}/{PACK.size}
            </span>
          </p>
        </div>

        {/* Height reserves all three rows so stepping never shifts layout. */}
        <ul className="mt-1.5 h-22 space-y-1 overflow-hidden">
          {PRODUCTS.slice(0, 3).map((product, i) => {
            const shown = i < selectedCount;
            return (
              <li
                key={product.name}
                className={cn(
                  "flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1 transition-all duration-300",
                  shown
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0",
                )}
              >
                <span className={cn("size-4 shrink-0 rounded-full", product.tone)} />
                <span className="truncate text-[11px] font-medium">
                  {product.name}
                </span>
                <span className="ml-auto rounded border border-border px-1.5 text-[11px] text-muted">
                  1
                </span>
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            "mt-3 flex h-10 items-center justify-between rounded-lg px-3 text-sm font-semibold transition-colors duration-300",
            added
              ? "bg-success-solid text-white"
              : complete
                ? "bg-brand-gradient text-white"
                : "border border-border bg-surface text-muted",
          )}
        >
          <span>
            {added
              ? "Added to cart ✓"
              : complete
                ? "Add to Cart"
                : `Add ${PACK.size - selectedCount} more`}
          </span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
