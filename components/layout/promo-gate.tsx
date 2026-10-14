"use client";

import { useSyncExternalStore } from "react";
import { isPromoLive } from "@/lib/promo";

const subscribe = () => () => {};

/**
 * Hides the promo bar in the browser once the campaign has ended. Pages here
 * are prerendered, so the layout's server-side `isPromoLive()` only runs at
 * build/revalidate time. The server snapshot is "live" so hydration always
 * matches the prerendered HTML; the client snapshot then drops the bar if the
 * deadline has passed — no redeploy needed.
 */
export function PromoGate({ children }: { children: React.ReactNode }) {
  const live = useSyncExternalStore(subscribe, () => isPromoLive(), () => true);
  return live ? children : null;
}
