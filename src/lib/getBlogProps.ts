import { env } from "@/env";
import "server-only";

export const blogProps = {
  name: env.BLOG_NAME,
  language: env.BLOG_LANGUAGE,
  author: env.BLOG_AUTHOR,
  theme: env.BLOG_THEME,
};
