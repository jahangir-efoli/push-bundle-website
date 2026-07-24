"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Product-page "stage" — frames an interactive bundle demo like a real Shopify
 * product page: product image on the left, the theme's default product details
 * (title, price, quantity, Add to Cart) on the right, and the PushBundle widget
 * ("our section") below them. Container-query responsive: stacked full-width on
 * narrow panels, image|details side-by-side once there's room. Reusable across
 * demos — pass the product identity + the bundle widget as children.
 */
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

export function ProductStage({
  image,
  imageAlt,
  title,
  price,
  children,
  className,
}: {
  image: string;
  imageAlt: string;
  title: string;
  price: number;
  /** The interactive bundle widget shown below the default product details. */
  children: React.ReactNode;
  className?: string;
}) {
  const [qty, setQty] = useState(1);
  const [imgOk, setImgOk] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const addToCart = () => {
    setNotice(`Added ${qty} × ${title} to cart`);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2600);
  };

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  return (
    <div className={cn("@container w-full text-foreground", className)}>
      <div className="grid gap-5 p-4 @lg:grid-cols-[1.05fr_1fr] @lg:items-start sm:p-5">
        {/* Product image (falls back to a neutral tile until the photo exists) */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-black/5 @lg:sticky @lg:top-0">
          {imgOk ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              quality={90}
              sizes="(min-width: 1024px) 340px, 90vw"
              className="object-cover"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-center text-xs text-muted">
              <span className="flex flex-col items-center gap-2">
                <svg viewBox="0 0 24 24" className="size-8 text-muted/60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" />
                </svg>
                Product image
              </span>
            </div>
          )}
        </div>

        {/* Product details + our bundle section */}
        <div>
          <h3 className="text-base font-bold leading-tight text-balance">{title}</h3>
          <p className="mt-1 text-sm font-semibold">
            {usd(price)} <span className="text-xs font-normal text-muted">USD</span>
          </p>

          {/* Quantity */}
          <div className="mt-3.5">
            <p className="text-xs font-medium text-muted">Quantity</p>
            <div className="mt-1 inline-flex items-center rounded-md border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid size-8 place-items-center text-muted hover:text-foreground"
              >
                −
              </button>
              <span className="w-9 text-center text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid size-8 place-items-center text-muted hover:text-foreground"
              >
                +
              </button>
            </div>
          </div>

          {/* Default Add to Cart — outlined, to contrast the bundle's solid CTA */}
          <button
            type="button"
            onClick={addToCart}
            className="mt-3.5 w-full rounded-lg border border-foreground/75 bg-surface py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-subtle"
          >
            Add to Cart
          </button>

          {notice && (
            <div
              role="status"
              className="mt-2.5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success-foreground"
            >
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
              {notice}
            </div>
          )}

          {/* Our interactive section */}
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
