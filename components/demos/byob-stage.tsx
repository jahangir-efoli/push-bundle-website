"use client";

import { ByobDemo } from "@/components/demos/byob-demo";

/**
 * Build Your Own Box is a full-page, multi-step builder (not a single product
 * page), so it renders full-width — scoped to the berry accent to match the
 * rest of the PushBundle widgets.
 */
export function ByobStage() {
  return (
    <div className="pb-berry">
      <ByobDemo />
    </div>
  );
}
