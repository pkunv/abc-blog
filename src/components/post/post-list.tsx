import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { api } from "@/trpc/server";
import Link from "next/link";

export async function PostList({ href }: { href: "/dashboard" | "/posts" }) {
  const posts = await api.post.getMany({});

  return (
    <div className="flex w-full flex-col gap-2">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`${href}/${post.slug}`}
          className={
            "text-primary hover:bg-accent hover:text-accent-foreground parent-h3-hover p-2 underline-offset-4"
          }
        >
          <TypographyH3>{post.title}</TypographyH3>
          <div className="flex w-full gap-2">
            <TypographyMuted className="w-24 truncate">
              {post.content}
            </TypographyMuted>
            <TypographyMuted>•</TypographyMuted>
            <TypographyMuted>
              {new Date(post.createdAt).toLocaleDateString()}
            </TypographyMuted>
          </div>
        </Link>
      ))}
    </div>
  );
}
