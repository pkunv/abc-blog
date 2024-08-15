import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH2 } from "@/components/ui/typography";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  // read route params
  const category = params.category;

  const title = category;
  const description = `Posts in category ${category}`;

  return {
    title,
    description,
    openGraph: {
      title: title,
      description,
    },
  } as Metadata;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return (
    <>
      <TypographyH2 className="w-full text-left">Posts</TypographyH2>
      <Suspense fallback={<Spinner />}>
        <PostList href="/posts" category={params.category} />
      </Suspense>
    </>
  );
}
