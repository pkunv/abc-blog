import { PostForm } from "@/components/post/post-form";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function DashboardPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await api.post.get({ slug: params.slug });
  if (post === null) notFound();

  return <PostForm data={post} />;
}
