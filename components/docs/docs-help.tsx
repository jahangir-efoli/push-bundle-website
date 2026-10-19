import { LocaleLink as Link } from "@/components/ui/locale-link";
import { CalendlyLink } from "@/components/integrations/calendly-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import type { DocsContent } from "@/i18n/content";

/** "Still stuck?" support band closing every help-centre page. */
export function DocsHelp({ content }: { content: DocsContent["help"] }) {
  return (
    <div className="section-wash relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border p-8 sm:p-10">
      <div className="max-w-xl">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-sm">{content.title}</h2>
        <p className="mt-2 text-muted">{content.body}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/contact-us" className={buttonStyles({ variant: "gradient" })}>
          <Icon name="chat" className="size-5" />
          {content.contact}
        </Link>
        <CalendlyLink
          url={site.calendlyUrl}
          className={buttonStyles({ variant: "secondary" })}
        >
          {content.setup}
        </CalendlyLink>
      </div>
    </div>
  );
}
