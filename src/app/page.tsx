import { PostList } from "@/components/post/post-list";
import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <PostList href="/posts" />
    </>
  );
}
