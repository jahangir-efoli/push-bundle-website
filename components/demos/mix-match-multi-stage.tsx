"use client";

import { MixMatchMultiDemo } from "@/components/demos/mix-match-multi-demo";
import type { CartBundle } from "@/components/demos/cart-drawer";

/**
 * Mix & Match (Multiple Products) is a full-page bundle builder (not a single
 * product page), so it renders full-width — just scoped to the berry accent to
 * match the rest of the PushBundle widgets.
 */
export function MixMatchMultiStage({
  onAddToCart,
}: {
  onAddToCart?: (bundle: CartBundle) => void;
} = {}) {
  return (
    <div className="pb-berry">
      <MixMatchMultiDemo onAddToCart={onAddToCart} />
    </div>
  );
}
