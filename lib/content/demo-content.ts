"use client";

import { useLocale } from "@/components/providers/locale-provider";
import type { Locale } from "@/i18n/config";
import en from "@/messages/demo/en.json";
import de from "@/messages/demo/de.json";
import fr from "@/messages/demo/fr.json";
import es from "@/messages/demo/es.json";
import it from "@/messages/demo/it.json";
import ja from "@/messages/demo/ja.json";
import zh from "@/messages/demo/zh.json";

/**
 * Localized copy for the interactive demo widgets (components/demos/*). These
 * are shared, parameterless client components used on the homepage showcase and
 * the Features page, so they read their strings from here (keyed by the current
 * locale via `useLocale`) instead of receiving them as props. English is the
 * source of truth and the type; every locale file mirrors its shape.
 */
export type DemoContent = typeof en;

const DICT: Record<Locale, DemoContent> = { en, de, fr, es, it, ja, zh };

export function useDemoContent(): DemoContent {
  return DICT[useLocale()] ?? en;
}

export { fmt } from "@/lib/utils";
