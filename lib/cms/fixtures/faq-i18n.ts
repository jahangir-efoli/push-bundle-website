import type { Locale } from "../types";
import en from "@/messages/faq-static/en.json";
import de from "@/messages/faq-static/de.json";
import fr from "@/messages/faq-static/fr.json";
import es from "@/messages/faq-static/es.json";
import it from "@/messages/faq-static/it.json";
import ja from "@/messages/faq-static/ja.json";
import zh from "@/messages/faq-static/zh.json";

/**
 * Localized copy for the static/fixture FAQ (served on the homepage teaser and
 * /faq while the CMS has no FAQ entries — the CMS FAQ endpoint is English-only).
 * Keyed by slug so it overlays onto the fixture structure (slug/category/order).
 */
type FaqDict = typeof en;

const DICT: Record<Locale, FaqDict> = { en, de, fr, es, it, ja, zh };

export function faqTextFor(locale: Locale): FaqDict {
  return DICT[locale] ?? en;
}
