import { env } from "@/env";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = env.BLOG_LANGUAGE.split("-")[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const messages =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (await import(`./messages/${locale}.json`)).default ??
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (await import(`./messages/en.json`)).default;

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: messages,
  };
});

export function getLocaleWithFallback(): "en" | "de" | "pl" {
  const language = env.BLOG_LANGUAGE.split("-")[0];
  if (!language) return "en";
  if (!["de", "pl"].includes(language)) {
    return "en";
  }
  return language as "en" | "de" | "pl";
}
/**
 * This function is used to get the localized pathname without the use of params and search queries
 * @param href
 * @returns
 */
export function getLocalizedPathname(href: string) {
  const locale = getLocaleWithFallback();
  // WITHOUT USE OF PARAMS AND SEARCH QUERIES
  const pathnames = {
    en: [
      { source: "/", destination: "/" },
      { source: "/about", destination: "/about" },
      { source: "/contact", destination: "/contact" },
      { source: "/categories", destination: "/categories" },
      { source: "/posts", destination: "/posts" },
      { source: "/dashboard", destination: "/dashboard" },
      { source: "/search", destination: "/search" },
    ],
    de: [
      { source: "/", destination: "/" },
      { source: "/ueber-uns", destination: "/about" },
      { source: "/kontakt", destination: "/contact" },
      { source: "/kategorie", destination: "/categories" },
      { source: "/eintraege", destination: "/posts" },
      { source: "/dashboard", destination: "/dashboard" },
      { source: "/suche", destination: "/search" },
    ],
    pl: [
      { source: "/", destination: "/" },
      { source: "/o-blogu", destination: "/about" },
      { source: "/kontakt", destination: "/contact" },
      { source: "/kategorie", destination: "/categories" },
      { source: "/wpisy", destination: "/posts" },
      { source: "/dashboard", destination: "/dashboard" },
      { source: "/szukaj", destination: "/search" },
    ],
  };

  const pathname =
    pathnames[locale].find((p) => p.destination.includes(href))?.source ?? "/";

  return pathname;
}
