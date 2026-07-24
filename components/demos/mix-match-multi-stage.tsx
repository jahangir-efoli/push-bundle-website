"use client";

import { MixMatchMultiDemo } from "@/components/demos/mix-match-multi-demo";

/**
 * Mix & Match (Multiple Products) is a full-page bundle builder (not a single
 * product page), so it renders full-width — just scoped to the berry accent to
 * match the rest of the PushBundle widgets.
 */
export function MixMatchMultiStage() {
  return (
    <div className="pb-berry">
      <MixMatchMultiDemo />
    </div>
  );
}
