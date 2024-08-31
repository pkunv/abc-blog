import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    ADMIN_USERNAME: z.string(),
    ADMIN_PASSWORD: z.string(),
    BLOG_LANGUAGE: z.string().default("en-US"),
    BLOG_NAME: z.string().default("ABC Blog"),
    BLOG_THEME: z.string().default("dark"),
    BLOG_DESCRIPTION: z
      .string()
      .default("Simple markdown blog with admin panel."),
    BLOG_AUTHOR: z.string().default("Kunv"),
    BLOG_KEYWORDS: z.string().default("blog, markdown, admin, panel"),
    LOCALIZE_MONTHS_BY_LANG: z.preprocess(
      (val) => val === "1" || val === "true",
      z.boolean(),
    ),
    UMAMI_URL: z.string().optional(),
    UMAMI_WEBSITE_ID: z.string().optional(),
    UPLOADTHING_SECRET: z.string().optional(),
    UPLOADTHING_APP_ID: z.string().optional(),
    ALT_FONT: z
      .preprocess((val) => val === "1" || val === "true", z.boolean())
      .optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    BLOG_LANGUAGE: process.env.BLOG_LANGUAGE,
    BLOG_NAME: process.env.BLOG_NAME,
    BLOG_THEME: process.env.BLOG_THEME,
    BLOG_DESCRIPTION: process.env.BLOG_DESCRIPTION,
    BLOG_AUTHOR: process.env.BLOG_AUTHOR,
    BLOG_KEYWORDS: process.env.BLOG_KEYWORDS,
    LOCALIZE_MONTHS_BY_LANG: process.env.LOCALIZE_MONTHS_BY_LANG,
    UMAMI_URL: process.env.UMAMI_URL,
    UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    ALT_FONT: process.env.ALT_FONT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
