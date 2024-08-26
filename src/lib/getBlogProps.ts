import { env } from "@/env";
import "server-only";

export const blogProps = {
  name: env.BLOG_NAME,
  description: env.BLOG_DESCRIPTION,
  language: env.BLOG_LANGUAGE,
  author: env.BLOG_AUTHOR,
  theme: env.BLOG_THEME,
  localizeMonths: env.LOCALIZE_MONTHS_BY_LANG,
  carouselEnabled:
    env.UPLOADTHING_APP_ID !== undefined &&
    env.UPLOADTHING_SECRET !== undefined,
};
