"use client";

import { ProductStage } from "@/components/demos/product-stage";
import { MixMatchSingleDemo } from "@/components/demos/mix-match-single-demo";

/**
 * Mix & Match (Single Product) as a Shopify product page: the ProductStage shows
 * the product image + default details, and the pack builder sits below in a
 * berry-accented card — pick a pack size, then fill it with any mix of colours,
 * with the per-shirt price dropping on bigger packs. Matches the shared reference.
 */
export function MixMatchSingleStage() {
  return (
    <ProductStage
      image="/images/products/mix-single.png"
      imageAlt="Full Sleeve T-shirt — product photo"
      title="Full Sleeve T-shirt"
      price={24}
    >
      <div className="pb-berry rounded-xl border-2 border-primary/35 bg-white p-4">
        <MixMatchSingleDemo
          embedded
          productName="Full Sleeve T-shirt"
          basePrice={24}
          unitNoun="shirt"
          packs={[
            { qty: 8, discount: 0, pricePerUnit: 24 },
            { qty: 12, discount: 8, pricePerUnit: 22 },
            { qty: 16, discount: 17, pricePerUnit: 20 },
          ]}
          variants={[
            { name: "Maroon", color: "#7f1d3a", image: "/images/demos/mix-single/maroon.png" },
            { name: "Blue", color: "#2547a3", image: "/images/demos/mix-single/blue.png" },
            { name: "Olive", color: "#556b2f", image: "/images/demos/mix-single/olive.png" },
            { name: "Tan", color: "#cbb393", image: "/images/demos/mix-single/tan.png" },
            { name: "Charcoal", color: "#3f4653", image: "/images/demos/mix-single/charcoal.png" },
            { name: "Forest", color: "#1f6b3b", image: "/images/demos/mix-single/forest.png" },
          ]}
        />
      </div>
    </ProductStage>
  );
}
