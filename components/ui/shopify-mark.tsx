"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shopify logo mark for the "Built for Shopify" pill. Uses the real asset at
 * /images/shopify.png (or .svg) when present; until it's added, falls back to a
 * Shopify-green shopping-bag glyph so the badge never looks broken.
 */
export function ShopifyMark({ className }: { className?: string }) {
  const [ok, setOk] = useState(true);

  if (ok) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/images/shopify.png"
        alt=""
        aria-hidden="true"
        className={cn("object-contain", className)}
        onError={() => setOk(false)}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("text-[#5e8e3e]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
