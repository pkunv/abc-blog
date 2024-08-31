import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH2 } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import { getTranslations } from "next-intl/server";
import { lazy, Suspense } from "react";

export default async function DashboardPage() {
  const PostForm = lazy(() => import("../../components/post/post-form"));
  const t = await getTranslations("dashboard");
  const tPostForm = await getTranslations("postForm");
  return (
    <>
      <TypographyH2 className="w-full text-left">{t("create")}</TypographyH2>
      <Suspense fallback={<Spinner />}>
        <PostForm
          carouselEnabled={blogProps.carouselEnabled}
          t={{
            title: tPostForm("title"),
            titlePlaceholder: tPostForm("titlePlaceholder"),
            titleDescription: tPostForm("titleDescription"),
            content: tPostForm("content"),
            contentDescription: tPostForm("contentDescription"),
            keywords: tPostForm("keywords"),
            keywordsPlaceholder: tPostForm("keywordsPlaceholder"),
            keywordsDescription: tPostForm("keywordsDescription"),
            category: tPostForm("category"),
            categoryDescription: tPostForm("categoryDescription"),
            public: tPostForm("public"),
            publicDescription: tPostForm("publicDescription"),
            placement: tPostForm("placement"),
            placementDescription: tPostForm("placementDescription"),
            placementPlaceholder: tPostForm("placementPlaceholder"),
            placementDefault: tPostForm("placementDefault"),
            placementAbout: tPostForm("placementAbout"),
            placementContact: tPostForm("placementContact"),
            placementFeatured: tPostForm("placementFeatured"),
            dialogSure: tPostForm("dialogSure"),
            dialogDescription: tPostForm("dialogDescription"),
            dialogCancel: tPostForm("dialogCancel"),
            dialogDelete: tPostForm("dialogDelete"),
            carousel: tPostForm("carousel"),
            carouselAction: tPostForm("carouselAction"),
            carouselFilename: tPostForm("carouselFilename"),
            carouselSuccess: tPostForm("carouselSuccess"),
            carouselType: tPostForm("carouselType"),
            views: tPostForm("views"),
            reads: tPostForm("reads"),
            submit: tPostForm("submit"),
            created: tPostForm("created"),
            updated: tPostForm("updated"),
            deleted: tPostForm("deleted"),
          }}
        />
      </Suspense>
      <TypographyH2 className="w-full text-left">{t("postList")}</TypographyH2>
      <Suspense fallback={<Spinner />}>
        <PostList href="/dashboard" placement={"ALL"} drafts={true} />
      </Suspense>
    </>
  );
}
