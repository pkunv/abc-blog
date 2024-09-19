/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

function getLocaleWithFallback() {
  // @ts-expect-error This is a validated environment variable.
  const language = process.env.BLOG_LANGUAGE.split("-")[0];
  if (!language) return "en";
  if (!["de", "pl", "fr", "es"].includes(language)) {
    return "en";
  }
  return language;
}

const rewrites = {
  en: [
    { source: "/", destination: "/" },
    { source: "/about", destination: "/about" },
    { source: "/contact", destination: "/contact" },
    { source: "/categories/:category", destination: "/categories/:category" },
    { source: "/posts/:slug", destination: "/posts/:slug" },
    { source: "/posts", destination: "/posts" },
    { source: "/search", destination: "/search" },
  ],
  de: [
    { source: "/", destination: "/" },
    { source: "/ueber-uns", destination: "/about" },
    { source: "/kontakt", destination: "/contact" },
    { source: "/kategorie/:category", destination: "/categories/:category" },
    { source: "/eintraege/:slug", destination: "/posts/:slug" },
    { source: "/eintraege", destination: "/posts" },
    { source: "/suche", destination: "/search" },
  ],
  pl: [
    { source: "/", destination: "/" },
    { source: "/o-blogu", destination: "/about" },
    { source: "/kontakt", destination: "/contact" },
    { source: "/kategorie/:category", destination: "/categories/:category" },
    { source: "/wpisy/:slug", destination: "/posts/:slug" },
    { source: "/wpisy", destination: "/posts" },
    { source: "/szukaj", destination: "/search" },
  ],
  fr: [
    { source: "/", destination: "/" },
    { source: "/a-propos", destination: "/about" },
    { source: "/contact", destination: "/contact" },
    { source: "/categories/:category", destination: "/categories/:category" },
    { source: "/articles/:slug", destination: "/posts/:slug" },
    { source: "/dashboard", destination: "/dashboard" },
    { source: "/recherche", destination: "/search" },
  ],
  es: [
    { source: "/", destination: "/" },
    { source: "/acerca-de", destination: "/about" },
    { source: "/contacto", destination: "/contact" },
    { source: "/categorias/:categorias", destination: "/categories/:category" },
    { source: "/entradas/:slug", destination: "/posts/:slug" },
    { source: "/dashboard", destination: "/dashboard" },
    { source: "/buscar", destination: "/search" },
  ],
};

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    // @ts-expect-error This is fine because we are having a default locale "en" fallback
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rewrites[getLocaleWithFallback()];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default withNextIntl(config);
