import Post from "@/components/post/post";
import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH2 } from "@/components/ui/typography";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Home() {
  const post = await api.post.get({ latest: true });
  const blog = {
    name: env.BLOG_NAME,
    language: env.BLOG_LANGUAGE,
  };
  return (
    <>
      {post && (
        <>
          <TypographyH2 className="w-full text-left">Latest post</TypographyH2>
          <Post data={post} blog={blog} />
        </>
      )}
      <Suspense fallback={<Spinner />}>
        <PostList href="/posts" />
      </Suspense>
    </>
  );
}
