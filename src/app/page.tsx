import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <h1>Hello</h1>
      {!session && <Link href="/api/auth/signin">Sign in</Link>}
      {session && (
        <>
          <span>{session.user.name}</span>
          <Link href="/api/auth/signout">Sign out</Link>
        </>
      )}
    </>
  );
}
