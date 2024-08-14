import { PostList } from "@/components/post/post-list";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<Spinner />}>
      <PostList href="/posts" />
    </Suspense>
  );
}
