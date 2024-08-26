import { Spinner } from "@/components/ui/spinner";
import { TypographyH2 } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";

export default async function DashboardPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const PostForm = lazy(() => import("../../../components/post/post-form"));
  const post = await api.post.get({ slug: params.slug, placement: "ALL" });
  if (post === null) notFound();
  console.log(blogProps);
  return (
    <>
      <TypographyH2 className="w-full text-left">Update your post</TypographyH2>
      <Suspense fallback={<Spinner />}>
        <PostForm data={post} carouselEnabled={blogProps.carouselEnabled} />
      </Suspense>
    </>
  );
}
