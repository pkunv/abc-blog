import Post from "@/components/post/post";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await api.post.get({ slug: params.slug });
  if (post === null) notFound();

  return <Post data={post} />;
}
