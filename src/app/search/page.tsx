import { PostList } from "@/components/post/post-list";
import { TypographyH2 } from "@/components/ui/typography";
import { getLocalizedPathname } from "@/i18n";
import { getTranslations } from "next-intl/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string | undefined };
}) {
  const t = await getTranslations("search");
  return (
    <>
      <TypographyH2 className="w-full text-left">{t("results")}</TypographyH2>
      <PostList href={getLocalizedPathname("/posts")} q={searchParams.q} />
    </>
  );
}
