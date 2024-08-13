import { buttonVariants } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <TypographyH1>ABC Blog</TypographyH1>
      {!session && (
        <Link
          href="/api/auth/signin"
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign in
        </Link>
      )}
      {session && (
        <>
          <span>{session.user.name}</span>
          <Link href="/api/auth/signout">Sign out</Link>
        </>
      )}
    </>
  );
}
