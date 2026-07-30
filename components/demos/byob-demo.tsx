"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductThumb } from "@/components/demos/product-thumb";
import type { CartBundle } from "@/components/demos/cart-drawer";
import { cn } from "@/lib/utils";

/**
 * Build Your Own Box (BYOB) interactive demo — models the live PushBundle
 * multi-step gift-box builder: pick a box, choose products (with min/max limits
 * and per-product variants), add a greeting card, then fill in the gift details.
 * A sticky footer tracks the running (discounted) total across every step.
 *
 * Steps are customizable: pass a `steps` subset/reorder to match a merchant's
 * configuration. Reusable + prop-driven for the showcase and Features page.
 */
export type ByobOption = { name: string; values: string[] };
/** `icon` is the emoji fallback; `image` is the real photo (falls back to icon). */
export type ByobBox = { name: string; price: number; icon: string; image?: string };
export type ByobProduct = {
  name: string;
  price: number;
  icon: string;
  image?: string;
  options?: ByobOption[];
};
export type ByobCard = { name: string; price: number; icon: string; image?: string };
export type ByobField = { label: string; type?: "text" | "email" | "textarea" };
export type ByobStep = "box" | "products" | "card" | "form";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const DEFAULT_BOXES: ByobBox[] = [
  { name: "Kraft Gift Box", price: 12, icon: "📦", image: "/images/demos/byob/kraft-gift-box.png" },
  { name: "Signature Gift Box", price: 18, icon: "🎁", image: "/images/demos/byob/signature-gift-box.png" },
];

const DEFAULT_PRODUCTS: ByobProduct[] = [
  { name: "Scented Candle", price: 22, icon: "🕯️", image: "/images/demos/mix-multi/scented-candle.png", options: [{ name: "Scent", values: ["Vanilla", "Cedar", "Citrus"] }] },
  { name: "Artisan Chocolate", price: 16, icon: "🍫", image: "/images/demos/byob/artisan-chocolate.png" },
  { name: "Ceramic Mug", price: 14, icon: "☕", image: "/images/demos/byob/ceramic-mug.png", options: [{ name: "Color", values: ["Cream", "Charcoal"] }] },
  { name: "Bath Bomb Set", price: 18, icon: "🛁", image: "/images/demos/byob/bath-bomb-set.png" },
  { name: "Tea Sampler", price: 15, icon: "🍵", image: "/images/demos/byob/tea-sampler.png", options: [{ name: "Blend", values: ["Green", "Herbal", "Black"] }] },
  { name: "Mini Succulent", price: 10, icon: "🪴", image: "/images/demos/byob/mini-succulent.png" },
];

const DEFAULT_CARDS: ByobCard[] = [
  { name: "Thank You Card", price: 5, icon: "💌", image: "/images/demos/byob/thank-you-card.png" },
  { name: "Birthday Card", price: 5, icon: "🎂", image: "/images/demos/byob/birthday-card.png" },
  { name: "Just Because Card", price: 5, icon: "💐", image: "/images/demos/byob/just-because-card.png" },
];

const DEFAULT_FIELDS: ByobField[] = [
  { label: "Sender", type: "text" },
  { label: "Recipient", type: "text" },
  { label: "Recipient email", type: "email" },
  { label: "Message", type: "textarea" },
];

const STEP_LABEL: Record<ByobStep, string> = {
  box: "Select Box",
  products: "Choose Products",
  card: "Select Card",
  form: "Form Submission",
};

type Line = {
  key: string;
  name: string;
  icon: string;
  image?: string;
  price: number;
  variant: string;
  qty: number;
};

export function ByobDemo({
  title = "Create Your Own Gift Box",
  subtitle = "Create your very own box in just a few simple steps with a personalised message.",
  steps = ["box", "products", "card", "form"],
  boxes = DEFAULT_BOXES,
  products = DEFAULT_PRODUCTS,
  productMin = 2,
  productMax = 6,
  cards = DEFAULT_CARDS,
  cardMin = 1,
  cardMax = 2,
  fields = DEFAULT_FIELDS,
  discount = 10,
  onAddToCart,
  className,
}: {
  title?: string;
  subtitle?: string;
  steps?: ByobStep[];
  boxes?: ByobBox[];
  products?: ByobProduct[];
  productMin?: number;
  productMax?: number;
  cards?: ByobCard[];
  cardMin?: number;
  cardMax?: number;
  fields?: ByobField[];
  discount?: number;
  onAddToCart?: (bundle: CartBundle) => void;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const [box, setBox] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ values: string[]; qty: number }>({ values: [], qty: 1 });
  const [cardPicks, setCardPicks] = useState<number[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const key = steps[step];
  const factor = 1 - discount / 100;

  const productCount = lines.reduce((s, l) => s + l.qty, 0);
  const productsRemaining = productMax - productCount;

  const boxPrice = box !== null ? boxes[box].price : 0;
  const productsTotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const cardsTotal = cardPicks.reduce((s, i) => s + cards[i].price, 0);
  const subtotal = boxPrice + productsTotal + cardsTotal;
  const total = subtotal * factor;

  // Selected product units, flattened for the footer thumbnails.
  const flatUnits = useMemo(
    () => lines.flatMap((l) => Array(l.qty).fill(l)),
    [lines],
  ) as Line[];

  const reset = () => {
    setStep(0);
    setBox(null);
    setLines([]);
    setOpenIdx(null);
    setCardPicks([]);
    setForm({});
  };

  // ---- products (step 2) ----
  const addLine = (
    name: string,
    icon: string,
    price: number,
    variant: string,
    qty: number,
    image?: string,
  ) => {
    setLines((prev) => {
      const k = `${name}|${variant}`;
      const capped = Math.min(qty, productMax - productCount);
      if (capped <= 0) return prev;
      const idx = prev.findIndex((l) => l.key === k);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + capped };
        return next;
      }
      return [...prev, { key: k, name, icon, image, price, variant, qty: capped }];
    });
  };
  const lineQtyForBase = (name: string) =>
    lines.filter((l) => l.name === name).reduce((s, l) => s + l.qty, 0);
  const openOptions = (i: number) => {
    const p = products[i];
    setOpenIdx(i);
    setDraft({ values: (p.options ?? []).map((o) => o.values[0]), qty: 1 });
  };
  const addConfigured = (i: number) => {
    const p = products[i];
    addLine(p.name, p.icon, p.price, draft.values.join(" · "), draft.qty, p.image);
    setOpenIdx(null);
  };
  const changeLineQty = (k: string, delta: number) =>
    setLines((prev) => {
      const others = productCount - (prev.find((l) => l.key === k)?.qty ?? 0);
      return prev.flatMap((l) => {
        if (l.key !== k) return [l];
        const q = Math.min(l.qty + delta, productMax - others);
        return q <= 0 ? [] : [{ ...l, qty: q }];
      });
    });

  // ---- cards (step 3) ----
  const toggleCard = (i: number) =>
    setCardPicks((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= cardMax) return prev;
      return [...prev, i];
    });

  // ---- validation / nav ----
  const canAdvance = (() => {
    switch (key) {
      case "box":
        return box !== null;
      case "products":
        return productCount >= productMin && productCount <= productMax;
      case "card":
        return cardPicks.length >= cardMin && cardPicks.length <= cardMax;
      case "form":
        return fields.every((f) => (form[f.label] ?? "").trim().length > 0);
      default:
        return true;
    }
  })();

  const isLast = step === steps.length - 1;

  const next = () => {
    if (!canAdvance) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    if (onAddToCart) {
      const selectedBox = box !== null ? boxes[box] : null;
      const items = [
        ...(selectedBox
          ? [{ name: selectedBox.name, img: selectedBox.image }]
          : []),
        ...flatUnits.map((l) => ({
          name: l.name,
          variant: l.variant,
          img: l.image,
        })),
        ...cardPicks.map((i) => ({ name: cards[i].name, img: cards[i].image })),
      ];
      onAddToCart({
        title: "Build Your Own Box",
        id: "BYOB",
        img: selectedBox?.image ?? flatUnits[0]?.image,
        price: total,
        subtotal: total,
        items,
      });
      reset();
      return;
    }
    setNotice(`Gift box added to cart · ${usd(total)} (saved ${discount}%)`);
    reset();
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const iconTile = (icon: string, size: string, image?: string, alt = "") => (
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
    <div className={cn("@container w-full px-4 pt-4 text-foreground sm:px-5 sm:pt-5", className)}>
      {/* Header */}
      <div className="text-center">
        <p className="font-display text-lg font-bold">{title}</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted">{subtitle}</p>
        <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          Build your own box and save an additional {discount}% off
        </p>
      </div>

      {/* Stepper */}
      <ol className="mt-5 flex items-center">
        {steps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          const reached = done || current;
          return (
            <li key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-sm font-bold transition-colors",
                    reached
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-subtle text-muted ring-1 ring-border",
                    current && "shadow-glow",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "mt-1.5 max-w-16 text-center text-[10px] font-medium leading-tight @sm:max-w-none @sm:text-[11px]",
                    reached ? "text-foreground" : "text-muted",
                  )}
                >
                  {STEP_LABEL[s]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span className={cn("mx-1.5 h-0.5 flex-1 rounded-full", done ? "bg-primary" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>

      {/* Body */}
      <div className="mt-5">
        {/* STEP: Select box */}
        {key === "box" && (
          <>
            <p className="text-sm font-semibold">Choose your gift box</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {boxes.map((b, i) => {
                const sel = box === i;
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setBox(i)}
                    aria-pressed={sel}
                    className={cn(
                      "flex flex-col rounded-lg border p-2.5 text-left transition-colors",
                      sel ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40",
                    )}
                  >
                    <span className="relative">
                      {iconTile(b.icon, "aspect-square w-full text-4xl", b.image, b.name)}
                      {sel && (
                        <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                        </span>
                      )}
                    </span>
                    <span className="mt-2 truncate text-sm font-semibold">{b.name}</span>
                    <span className="text-xs text-muted">{usd(b.price)}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* STEP: Choose products */}
        {key === "products" && (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">
                Choose products <span className="text-primary">*</span>
              </p>
              <p className={cn("text-xs font-medium", canAdvance ? "text-success-foreground" : "text-muted")}>
                Select {productMin}–{productMax} • {productCount} selected
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 @md:grid-cols-3">
              {products.map((p, i) => {
                const hasOptions = !!p.options?.length;
                const isOpen = openIdx === i;
                const inBox = lineQtyForBase(p.name);
                return (
                  <div
                    key={p.name}
                    className={cn(
                      "flex flex-col rounded-lg border p-2.5 transition-colors",
                      inBox > 0 ? "border-primary ring-1 ring-primary" : "border-border",
                    )}
                  >
                    <span className="relative">
                      {iconTile(p.icon, "aspect-square w-full text-3xl", p.image, p.name)}
                      {inBox > 0 && (
                        <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                        </span>
                      )}
                    </span>
                    <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{usd(p.price)}</p>

                    <div className="mt-2">
                      {inBox > 0 && !hasOptions ? (
                        <div className="flex items-center justify-between rounded-md border border-border">
                          <button type="button" onClick={() => changeLineQty(`${p.name}|`, -1)} aria-label={`Decrease ${p.name}`} className="grid size-7 place-items-center text-muted hover:text-foreground">−</button>
                          <span className="text-sm tabular-nums">{inBox}</span>
                          <button type="button" onClick={() => addLine(p.name, p.icon, p.price, "", 1, p.image)} disabled={productsRemaining <= 0} aria-label={`Increase ${p.name}`} className="grid size-7 place-items-center text-muted hover:text-foreground disabled:opacity-40">+</button>
                        </div>
                      ) : hasOptions ? (
                        <button
                          type="button"
                          onClick={() => (isOpen ? setOpenIdx(null) : openOptions(i))}
                          disabled={productsRemaining <= 0 && inBox === 0}
                          className="w-full rounded-md bg-primary-subtle py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/15 disabled:opacity-40"
                        >
                          {isOpen ? "Close" : inBox > 0 ? "Add another" : "See options"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addLine(p.name, p.icon, p.price, "", 1, p.image)}
                          disabled={productsRemaining <= 0}
                          className="w-full rounded-md bg-primary-subtle py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/15 disabled:opacity-40"
                        >
                          Add to bundle
                        </button>
                      )}
                    </div>

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
                                    onClick={() => setDraft((d) => ({ ...d, values: d.values.map((x, xi) => (xi === oi ? val : x)) }))}
                                    className={cn(
                                      "rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
                                      on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40",
                                    )}
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addConfigured(i)}
                          disabled={productsRemaining <= 0}
                          className="h-8 w-full rounded-md bg-primary text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
                        >
                          Add to box
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* STEP: Add a card */}
        {key === "card" && (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">Add a greeting card</p>
              <p className={cn("text-xs font-medium", canAdvance ? "text-success-foreground" : "text-muted")}>
                Select {cardMin}–{cardMax} • {cardPicks.length} selected
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {cards.map((c, i) => {
                const sel = cardPicks.includes(i);
                const atMax = !sel && cardPicks.length >= cardMax;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleCard(i)}
                    disabled={atMax}
                    aria-pressed={sel}
                    className={cn(
                      "flex flex-col rounded-lg border p-2.5 text-left transition-colors disabled:opacity-40",
                      sel ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40",
                    )}
                  >
                    <span className="relative">
                      {iconTile(c.icon, "aspect-square w-full text-3xl", c.image, c.name)}
                      {sel && (
                        <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                        </span>
                      )}
                    </span>
                    <span className="mt-2 truncate text-sm font-semibold">{c.name}</span>
                    <span className="text-xs text-muted">{usd(c.price)}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* STEP: Details form */}
        {key === "form" && (
          <>
            <p className="text-sm font-semibold">Gift details</p>
            <div className="mt-3 space-y-3">
              {fields.map((f) => {
                const id = `byob-${f.label.replace(/\s+/g, "-").toLowerCase()}`;
                const common = {
                  id,
                  value: form[f.label] ?? "",
                  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    setForm((prev) => ({ ...prev, [f.label]: e.target.value })),
                  className:
                    "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:border-primary focus-visible:outline-none",
                };
                return (
                  <div key={f.label}>
                    <label htmlFor={id} className="text-xs font-semibold">
                      {f.label} <span className="text-primary">*</span>
                    </label>
                    {f.type === "textarea" ? (
                      <textarea rows={2} placeholder={`Your ${f.label.toLowerCase()}…`} {...common} />
                    ) : (
                      <input type={f.type ?? "text"} placeholder={`Your ${f.label.toLowerCase()}…`} {...common} />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-4 mt-5 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
        {notice && (
          <div role="status" className="mb-2.5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success-foreground">
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
            {notice}
          </div>
        )}
        <div className="flex items-center gap-3">
          {/* Selected thumbnails — each removable */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {flatUnits.slice(0, 6).map((l, i) => (
              <span key={i} className="relative shrink-0">
                <span className={cn(
                  "grid size-9 place-items-center overflow-hidden rounded-md text-lg ring-1 ring-border",
                  l.image ? "bg-white" : "bg-surface-subtle",
                )}>
                  <ProductThumb
                    src={l.image}
                    alt={l.name}
                    fallback={<span aria-hidden="true">{l.icon}</span>}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => changeLineQty(l.key, -1)}
                  aria-label={`Remove ${l.name}`}
                  className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-error text-white ring-2 ring-white"
                >
                  <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </span>
            ))}
            {flatUnits.length > 6 && (
              <span className="text-xs font-semibold text-muted">+{flatUnits.length - 6}</span>
            )}
            {flatUnits.length === 0 && (
              <span className="text-xs text-muted">Your box is empty</span>
            )}
          </div>
          <span className="whitespace-nowrap text-sm">
            <span className="mr-1 text-[11px] text-muted">Total:</span>
            {discount > 0 && subtotal > 0 && (
              <span className="mr-1.5 text-muted line-through">{usd(subtotal)}</span>
            )}
            <span className="font-bold">{usd(total)}</span>
            <span className="ml-1 text-[11px] text-muted">USD</span>
          </span>
        </div>

        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="h-11 rounded-lg bg-surface-subtle px-5 text-sm font-semibold text-foreground transition-colors hover:bg-border/60 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            aria-disabled={!canAdvance}
            className={cn(
              "h-11 flex-1 rounded-lg text-sm font-semibold transition-colors",
              canAdvance
                ? "bg-foreground text-background hover:opacity-90"
                : "cursor-not-allowed bg-surface-subtle text-muted",
            )}
          >
            {isLast ? "Finish — Add to cart" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
