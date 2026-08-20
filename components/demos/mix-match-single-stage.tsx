"use client";

import { ProductStage } from "@/components/demos/product-stage";
import { MixMatchSingleDemo } from "@/components/demos/mix-match-single-demo";
import type { CartBundle } from "@/components/demos/cart-drawer";
import { useDemoContent } from "@/lib/content/demo-content";

/**
 * Mix & Match (Single Product) as a Shopify product page: the ProductStage shows
 * the product image + default details, and the pack builder sits below in a
 * berry-accented card — pick a pack size, then fill it with any mix of colours,
 * with the per-shirt price dropping on bigger packs. Matches the shared reference.
 */
export function MixMatchSingleStage({
  onAddToCart,
}: {
  onAddToCart?: (bundle: CartBundle) => void;
} = {}) {
  const { mixSingle } = useDemoContent();
  // Fixed swatch colours + images; variant names come from content.
  const swatch = [
    { color: "#7f1d3a", image: "/images/demos/mix-single/maroon.png" },
    { color: "#2547a3", image: "/images/demos/mix-single/blue.png" },
    { color: "#556b2f", image: "/images/demos/mix-single/olive.png" },
    { color: "#cbb393", image: "/images/demos/mix-single/tan.png" },
    { color: "#3f4653", image: "/images/demos/mix-single/charcoal.png" },
    { color: "#1f6b3b", image: "/images/demos/mix-single/forest.png" },
  ];
  return (
    <ProductStage
      image="/images/products/mix-single.png"
      imageAlt={mixSingle.imageAlt}
      title={mixSingle.productName}
      price={24}
    >
      <div className="pb-berry rounded-xl border-2 border-primary/35 bg-white p-4">
        <MixMatchSingleDemo
          embedded
          productName={mixSingle.productName}
          basePrice={24}
          unitNoun={mixSingle.unitNoun}
          bundleImage="/images/products/mix-single.png"
          onAddToCart={onAddToCart}
          packs={[
            { qty: 4, discount: 0, pricePerUnit: 24 },
            { qty: 6, discount: 8, pricePerUnit: 22 },
            { qty: 8, discount: 17, pricePerUnit: 20 },
          ]}
          variants={mixSingle.variants.map((name, i) => ({
            name,
            ...swatch[i],
          }))}
        />
      </div>
    </ProductStage>
  );
}
