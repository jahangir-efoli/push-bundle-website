import { Header } from "./header";
import { PromoBanner } from "./promo-banner";
import { formatPromoEnd, isPromoLive } from "@/lib/promo";
import { localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Top-of-page site chrome: the promo bar + the header. Shared by the (site)
 * layout and CMS landing pages (which drop it when `showHeader` is false), so
 * both always render the exact same thing.
 */
export function SiteTop({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      {/* Server check drops the bar from any render after the deadline;
          PromoGate also hides it in the browser on prerendered pages. */}
      {isPromoLive() && (
        <PromoBanner
          copy={dict.promo}
          endsLabel={dict.promo.endsOn.replace(
            "{date}",
            formatPromoEnd(localeMeta[locale].hreflang),
          )}
        />
      )}
      <Header locale={locale} dict={dict} />
    </>
  );
}
