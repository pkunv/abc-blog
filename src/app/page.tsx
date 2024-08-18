import Post from "@/components/post/post";
import { PostList } from "@/components/post/post-list";
import { TypographyH2 } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import { api } from "@/trpc/server";

export default async function Home() {
  const post = await api.post.get({});

  return (
    <>
      {post && (
        <>
          <TypographyH2 className="w-full text-left">Latest post</TypographyH2>
          <Post post={post} blog={blogProps} />
        </>
      )}
      <TypographyH2 className="w-full text-left">Posts</TypographyH2>
      <PostList href="/posts" />
    </>
  );
}
