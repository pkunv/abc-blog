import { PostList } from "@/components/post/post-list";
import { TypographyH2 } from "@/components/ui/typography";
import { getLocalizedPathname } from "@/i18n";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  // read route params
  const category = params.category;

  const title = category;
  const description = `Posts in category ${category}`;

  return {
    title,
    description,
    openGraph: {
      title: title,
      description,
    },
  } as Metadata;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const t = await getTranslations("category");
  return (
    <>
      <TypographyH2 className="w-full text-left">{t("posts")}</TypographyH2>
      <PostList
        href={getLocalizedPathname("/posts")}
        category={params.category}
      />
    </>
  );
}
