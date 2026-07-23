import type { CmsAdapter } from "./adapter";
import { fixtureAdapter } from "./fixture-adapter";
import { httpAdapter } from "./http-adapter";
import { CMS_ENABLED } from "./http/client";

/**
 * The CMS entry point (docs/PLAN.md §7).
 *
 * Pages import `cms` from here and nothing else. Phase 9 wired the real API:
 * the HTTP adapter is used when a CMS base is configured (it falls back to the
 * fixtures on error/empty), otherwise the fixtures serve directly.
 */
export const cms: CmsAdapter = CMS_ENABLED ? httpAdapter : fixtureAdapter;

export type { CmsAdapter, ListPostsParams } from "./adapter";
export * from "./types";
export { DEFAULT_PER_PAGE } from "./fixture-adapter";
export { faqCategories } from "./fixtures/content";

/** Default locale (the route's `lang` param overrides this per page). */
export const DEFAULT_LOCALE = "en" as const;
