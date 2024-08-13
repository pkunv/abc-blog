import { PostForm } from "@/components/post/post-form";
import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <>
      <PostForm />
      <Suspense fallback={<Spinner />}>
        <PostList href="/dashboard" />
      </Suspense>
    </>
  );
}
