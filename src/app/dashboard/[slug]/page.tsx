import { PostForm } from "@/components/post/post-form";
import { TypographyH2 } from "@/components/ui/typography";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function DashboardPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await api.post.get({ slug: params.slug });
  if (post === null) notFound();

  return (
    <>
      <TypographyH2 className="w-full text-left">Update your post</TypographyH2>
      <PostForm data={post} />
    </>
  );
}
