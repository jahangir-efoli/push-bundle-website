"use client";

import { ProductStage } from "@/components/demos/product-stage";
import { VolumeBundleDemo } from "@/components/demos/volume-bundle-demo";
import type { CartBundle } from "@/components/demos/cart-drawer";

/**
 * Volume Bundle presented as a Shopify product page: the ProductStage supplies
 * the product image + default details (title / price / qty / Add to Cart), and
 * the volume tier selector sits below inside a berry-accented bundle card that
 * mirrors the live PushBundle widget. Product identity matches the product image.
 */
export function VolumeBundleStage({
  onAddToCart,
}: {
  onAddToCart?: (bundle: CartBundle) => void;
} = {}) {
  return (
    <ProductStage
      image="/images/products/volume.png"
      imageAlt="Walnut finish dresser — product photo"
      title="Walnut finish dresser"
      price={180}
    >
      {/* Bundle card — berry accent + legend-style header, like the reference. */}
      <div className="pb-berry relative rounded-xl border-2 border-primary/35 bg-white p-4 pt-5">
        <span className="absolute -top-2.5 left-4 bg-white px-1.5 text-sm font-bold text-primary">
          Buy more &amp; save up to 15%
        </span>
        <p className="text-xs text-muted">
          Order more units of this product in one go and unlock a bigger discount
          on every piece.
        </p>
        <div className="mt-3">
          <VolumeBundleDemo
            embedded
            heading=""
            productName="Walnut finish dresser"
            basePrice={180}
            tiers={[
              { qty: 2, discount: 5 },
              { qty: 4, discount: 10 },
              { qty: 6, discount: 15 },
            ]}
            popularQty={4}
            productImage="/images/products/volume.png"
            onAddToCart={onAddToCart}
            variants={["Walnut", "Oak", "Espresso", "Natural Ash"]}
            gifts={[
              { label: "Free Coaster Set", unlockAt: 2, icon: "gift" },
              { label: "Free Drawer Liners", unlockAt: 4, icon: "sparkles" },
              { label: "Free Shipping", unlockAt: 6, icon: "shipping" },
            ]}
          />
        </div>
      </div>
    </ProductStage>
  );
}
