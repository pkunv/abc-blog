import { env } from "@/env";
import { getLocalizedPathname } from "@/i18n";
import { db } from "@/server/db";
import { type MetadataRoute } from "next";

export async function generateSitemaps() {
  const posts = await db.post.findMany({
    select: {
      id: true,
    },
  });
  // Fetch the total number of products and calculate the number of sitemaps needed
  return posts;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const posts = await db.post.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    where: {
      id: {
        gte: id * 50000,
        lt: (id + 1) * 50000,
      },
    },
  });
  const postLocalizedPathname = getLocalizedPathname("/posts");

  return posts.map((post) => ({
    url: `${env.NEXTAUTH_URL}${postLocalizedPathname}/${post.slug}`,
    lastModified: post.updatedAt,
  }));
}
