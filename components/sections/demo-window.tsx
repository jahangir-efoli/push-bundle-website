"use client";

import { useState } from "react";
import { CartDrawer, type CartBundle } from "@/components/demos/cart-drawer";

/** Props every demo stage accepts (only the cart-wired ones use onAddToCart). */
type DemoProps = { onAddToCart?: (bundle: CartBundle) => void };

/**
 * One live demo inside a faux app-window frame, with its own slide-in cart
 * drawer. Used on the Features page (each bundle type gets its own window) so
 * "Add to cart" opens the cart drawer just like the homepage showcase.
 *
 * Client component: it owns the per-window cart state. The demo component is
 * passed in by the (server) Features page, which keeps the demo↔id mapping.
 */
export function DemoWindow({
  Demo,
  title,
  livePreview,
}: {
  Demo: React.ComponentType<DemoProps>;
  title: string;
  livePreview: string;
}) {
  const [cart, setCart] = useState<CartBundle | null>(null);

  return (
    <div className="rounded-2xl bg-gradient-border p-1.5 shadow-lift">
      {/* relative: anchors the absolutely-positioned cart drawer to this window.
          overflow-hidden: the closed drawer parks off the right edge. */}
      <div className="pb-light relative overflow-hidden rounded-[0.9rem] bg-surface text-foreground">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-warm/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
          </span>
          <span className="ml-2 truncate text-xs text-muted">
            {title} — {livePreview}
          </span>
        </div>

        {/* data-lenis-prevent: native scroll inside the box. */}
        <div
          data-lenis-prevent
          className="scrollbar-brand max-h-128 overflow-y-auto"
        >
          <Demo onAddToCart={setCart} />
        </div>

        {/* Slide-in cart drawer — opens over the storefront on add-to-cart. */}
        <CartDrawer bundle={cart} onClose={() => setCart(null)} />
      </div>
    </div>
  );
}
