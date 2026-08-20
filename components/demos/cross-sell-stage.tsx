"use client";

import { ProductStage } from "@/components/demos/product-stage";
import { CrossSellDemo } from "@/components/demos/cross-sell-demo";
import type { CartBundle } from "@/components/demos/cart-drawer";
import { useDemoContent, fmt } from "@/lib/content/demo-content";

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
  const { crossSell } = useDemoContent();
  // Fixed demo data (prices/qty/icon/image); names + variants come from content.
  const meta = [
    { price: 28, qty: 1, icon: "🏺", image: "/images/demos/cross-sell/terracotta-bud-vase.png" },
    { price: 45, qty: 1, icon: "🪔", image: "/images/demos/cross-sell/teal-table-lamp.png" },
    { price: 32, qty: 1, icon: "🏺", image: "/images/demos/cross-sell/emerald-ceramic-vase.png" },
  ];
  return (
    <ProductStage
      image="/images/products/cross-sell.png"
      imageAlt={crossSell.imageAlt}
      title={crossSell.productName}
      price={180}
    >
      {/* Bundle card — berry accent + legend header, like the reference. */}
      <div className="pb-berry relative rounded-xl border-2 border-primary/35 bg-white p-4 pt-5">
        <span className="absolute -top-2.5 left-4 bg-white px-1.5 text-sm font-bold text-primary">
          {crossSell.bundleTitle}
        </span>
        <p className="text-xs text-muted">{crossSell.bundleSubtitle}</p>
        <div className="mt-3">
          <CrossSellDemo
            embedded
            heading=""
            discount={10}
            bundleTitle={fmt(crossSell.cartBundleTitle, {
              product: crossSell.productName,
            })}
            bundleImage="/images/products/cross-sell.png"
            onAddToCart={onAddToCart}
            products={crossSell.products.map((p, i) => ({
              name: p.name,
              variants: p.variants,
              ...meta[i],
            }))}
          />
        </div>
      </div>
    </ProductStage>
  );
}
