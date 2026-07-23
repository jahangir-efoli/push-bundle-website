import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { buttonStyles } from "@/components/ui/button";
import { resourcesNav } from "@/lib/site-config";

/** Branded 404 (docs/PLAN.md §4.1, §6 micro-polish). */
export default function NotFound() {
  return (
    <Section className="text-center">
      <p className="text-display-lg font-extrabold text-brand-gradient">404</p>
      <h1 className="mt-4 text-display-md">This page went missing</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        Let&rsquo;s get you back to bundling.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className={buttonStyles({ variant: "primary" })}>
          Back to home
        </Link>
        <Link
          href="/contact-us"
          className={buttonStyles({ variant: "secondary" })}
        >
          Contact support
        </Link>
      </div>

      <nav aria-label="Popular pages" className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Popular pages
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {resourcesNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
