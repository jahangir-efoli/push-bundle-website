import { notFound } from "next/navigation";

/**
 * Catch-all under [lang] (docs/PLAN.md §8). Renders the branded, localized 404
 * for any unmatched path. Needed because the root html layout lives under
 * `[lang]` (for a dynamic `<html lang>`), so there's no root `not-found` to
 * catch unmatched URLs — this catch-all calls `notFound()` to surface
 * `[lang]/not-found.tsx` within the locale layout.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
