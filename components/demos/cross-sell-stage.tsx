"use client";

import { ProductStage } from "@/components/demos/product-stage";
import { CrossSellDemo } from "@/components/demos/cross-sell-demo";
import type { CartBundle } from "@/components/demos/cart-drawer";

/**
 * Cross-Sell Bundle presented as a Shopify product page: the ProductStage shows
 * the product image + default details, and a berry "buy together and save" card
 * pairs complementary items below (matches the shared reference). Uses the same
 * product image as the Volume stage.
 */
export function CrossSellStage({
  onAddToCart,
}: {
  onAddToCart?: (bundle: CartBundle) => void;
} = {}) {
  return (
    <ProductStage
      image="/images/products/cross-sell.png"
      imageAlt="Teal accent dresser — product photo"
      title="Teal accent dresser"
      price={180}
    >
      {/* Bundle card — berry accent + legend header, like the reference. */}
      <div className="pb-berry relative rounded-xl border-2 border-primary/35 bg-white p-4 pt-5">
        <span className="absolute -top-2.5 left-4 bg-white px-1.5 text-sm font-bold text-primary">
          Buy together and save 10%
        </span>
        <p className="text-xs text-muted">
          Enjoy exclusive savings — buy these favourites together in one bundle
          and get 10% off your total.
        </p>
        <div className="mt-3">
          <CrossSellDemo
            embedded
            heading=""
            discount={10}
            bundleTitle="Teal accent dresser · Cross-Sell Bundle"
            bundleImage="/images/products/cross-sell.png"
            onAddToCart={onAddToCart}
            products={[
              {
                name: "Terracotta Bud Vase",
                price: 28,
                qty: 1,
                icon: "🏺",
                image: "/images/demos/cross-sell/terracotta-bud-vase.png",
                variants: ["Small", "Large"],
              },
              {
                name: "Teal Table Lamp",
                price: 45,
                qty: 1,
                icon: "🪔",
                image: "/images/demos/cross-sell/teal-table-lamp.png",
                variants: ["Teal", "Cream"],
              },
              {
                name: "Emerald Ceramic Vase",
                price: 32,
                qty: 1,
                icon: "🏺",
                image: "/images/demos/cross-sell/emerald-ceramic-vase.png",
                variants: ["Emerald", "Sage"],
              },
            ]}
          />
        </div>
      </div>
    </ProductStage>
  );
}
