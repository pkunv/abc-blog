import Post from "@/components/post/post";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function AboutPage() {
  const about = await api.post.get({ placement: "ABOUT" });
  return about ? <Post post={about} blog={blogProps} /> : <FallbackAbout />;
}

function FallbackAbout() {
  return (
    <>
      <TypographyH2 className="w-full text-left">About</TypographyH2>
      <TypographyP>
        Simple blog web app. JSON_LD, Schema.org compatible.
      </TypographyP>
      <TypographyP>
        Find more info on{" "}
        <Link href="https://github.com/pkunv/abc-blog" target="_blank">
          Github page
        </Link>
      </TypographyP>
    </>
  );
}
