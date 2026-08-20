"use client";

import { createContext, useContext } from "react";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Client-side current-locale context. The app translates by passing
 * server-loaded copy as props, but the interactive demo widgets
 * (components/demos/*) are shared, parameterless client components rendered on
 * both the homepage and the Features page — threading locale through every one
 * would be noisy. They read the locale here instead (see `useDemoContent`).
 */
const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
