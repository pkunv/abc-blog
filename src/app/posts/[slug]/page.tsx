import Post from "@/components/post/post";
import { blogProps } from "@/lib/getBlogProps";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  // read route params
  const slug = params.slug;
  const post = await api.post.get({ slug });
  if (post === null) return null;
  const title =
    post.title.length > 24
      ? post.title.split(" ").slice(0, 5).join(" ")
      : post.title;

  return {
    title,
    description: post.content,
    openGraph: {
      title: title,
      description: post.content,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: blogProps.author,
    },
  } as Metadata;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await api.post.get({ slug: params.slug });
  if (post === null) notFound();

  return <Post post={post} blog={blogProps} />;
}
