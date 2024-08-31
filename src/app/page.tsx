import Post from "@/components/post/post";
import { PostList } from "@/components/post/post-list";
import { TypographyH2 } from "@/components/ui/typography";
import { getLocalizedPathname } from "@/i18n";
import { blogProps } from "@/lib/getBlogProps";
import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  const featuredPost = await api.post.get({ placement: "FEATURED" });
  const post = await api.post.get({});

  return (
    <>
      {featuredPost && (
        <>
          <TypographyH2 className="w-full text-left">
            {t("featuredPosts")}
          </TypographyH2>
          <Post post={featuredPost} blog={blogProps} />
        </>
      )}
      {post && (
        <>
          <TypographyH2 className="w-full text-left">
            {t("latestPost")}
          </TypographyH2>
          <Post post={post} blog={blogProps} />
        </>
      )}
      <TypographyH2 className="w-full text-left">{t("browse")}</TypographyH2>
      <PostList href={getLocalizedPathname("/posts")} take={25} />
    </>
  );
}
