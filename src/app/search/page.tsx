import { PostList } from "@/components/post/post-list";
import { TypographyH2 } from "@/components/ui/typography";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string | undefined };
}) {
  return (
    <>
      <TypographyH2 className="w-full text-left">Search results</TypographyH2>
      <PostList href="/posts" q={searchParams.q} />
    </>
  );
}
