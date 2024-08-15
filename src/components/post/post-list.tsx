import { PostEmptyList } from "@/components/post/post-empty-list";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
} from "@/components/ui/typography";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import Link from "next/link";

export async function PostList({ href }: { href: "/dashboard" | "/posts" }) {
  const posts = await api.post.getMany({});

  return (
    <>
      <TypographyH2 className="w-full text-left">Posts</TypographyH2>
      <div className="flex w-full flex-col gap-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`${href}/${post.slug}`}
            className={
              "parent-h3-hover p-2 text-primary underline-offset-4 hover:bg-accent hover:text-accent-foreground"
            }
          >
            <TypographyH3>{post.title}</TypographyH3>
            <div className="flex w-full gap-2">
              <TypographyMuted className="w-24 truncate">
                {post.content}
              </TypographyMuted>
              <TypographyMuted>•</TypographyMuted>
              <TypographyMuted>{format(post.createdAt, "PP")}</TypographyMuted>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <PostEmptyList />}
      </div>
    </>
  );
}
