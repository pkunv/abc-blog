import { PostForm } from "@/components/post/post-form";
import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH2 } from "@/components/ui/typography";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <>
      <TypographyH2 className="w-full text-left">
        Create a new post
      </TypographyH2>
      <PostForm />
      <Suspense fallback={<Spinner />}>
        <PostList href="/dashboard" />
      </Suspense>
    </>
  );
}
