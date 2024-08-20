import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH2 } from "@/components/ui/typography";
import { lazy, Suspense } from "react";

export default async function DashboardPage() {
  const PostForm = lazy(() => import("../../components/post/post-form"));
  return (
    <>
      <TypographyH2 className="w-full text-left">
        Create a new post
      </TypographyH2>
      <Suspense fallback={<Spinner />}>
        <PostForm />
      </Suspense>
      <TypographyH2 className="w-full text-left">Posts</TypographyH2>
      <Suspense fallback={<Spinner />}>
        <PostList href="/dashboard" placement={"ALL"} />
      </Suspense>
    </>
  );
}
