import Post from "@/components/post/post";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function ContactPage() {
  const post = await api.post.get({ placement: "CONTACT" });
  return post ? <Post post={post} blog={blogProps} /> : <FallbackContact />;
}

function FallbackContact() {
  return (
    <>
      <TypographyH2 className="w-full text-left">Contact</TypographyH2>
      <TypographyP>
        <Link href="https://github.com/pkunv/abc-blog" target="_blank">
          Github
        </Link>
      </TypographyP>
    </>
  );
}
