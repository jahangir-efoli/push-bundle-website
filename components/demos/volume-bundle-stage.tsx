"use client";

import { ProductStage } from "@/components/demos/product-stage";
import { VolumeBundleDemo } from "@/components/demos/volume-bundle-demo";

/**
 * Volume Bundle presented as a Shopify product page: the ProductStage supplies
 * the product image + default details (title / price / qty / Add to Cart), and
 * the volume tier selector sits below as the PushBundle "buy more, save more"
 * section. Swap the title / price / tiers here if the product image differs.
 */
export function VolumeBundleStage() {
  return (
    <ProductStage
      image="/images/products/volume.png"
      imageAlt="Everyday Tee — product photo"
      title="Everyday Tee"
      price={24}
    >
      <div className="rounded-xl border border-primary/25 bg-primary-subtle/30 p-3.5">
        <VolumeBundleDemo embedded />
      </div>
    </ProductStage>
  );
}
