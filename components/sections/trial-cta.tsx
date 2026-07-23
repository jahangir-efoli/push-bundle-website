import { buttonStyles } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import { trialCta } from "@/lib/content/home";

/**
 * Shared trial CTA band (docs/PLAN.md §5.1 §10).
 * Reused by Pricing, About, Contact, FAQ, Partners and Changelog.
 *
 * A contained, layered gradient card: a dark vignette + subtle grid texture
 * give it depth so the white copy stays crisp (a flat bright gradient washed
 * the text out / looked hazy).
 */
export function TrialCta() {
  return (
    <section className="px-gutter py-section">
      <div className="relative mx-auto max-w-site overflow-hidden rounded-3xl bg-brand-gradient px-6 py-16 text-center text-white shadow-lift sm:px-12 sm:py-20">
        {/* Depth: slight overall deepen + bottom vignette + top sheen. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 32rem at 50% -25%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(70rem 44rem at 50% 135%, rgba(6,8,26,0.6), transparent 62%), linear-gradient(180deg, rgba(6,8,26,0.06), rgba(6,8,26,0.22))",
          }}
        />
        {/* Faint grid texture. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-display-md text-balance">
            {trialCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/95">
            {trialCta.subtitle}
          </p>
          <a
            href={site.shopifyAppUrl}
            className={buttonStyles({
              variant: "inverse",
              size: "lg",
              className: "mt-8 shadow-lift",
            })}
          >
            {trialCta.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
