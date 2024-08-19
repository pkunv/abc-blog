import { AppLogo } from "@/components/header/app-logo";
import { HeaderMenu } from "@/components/header/header-menu";
import { SearchBar } from "@/components/header/search-bar";
import { getServerAuthSession } from "@/server/auth";

export async function Header() {
  const session = await getServerAuthSession();
  const links = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    session && { title: "Dashboard", href: "/dashboard" },
    session && { title: "Logout", href: "/api/auth/signout?callback=/" },
  ].filter((link) => link) as { title: string; href: string }[];

  return (
    <header className="mx-auto flex w-full flex-col items-center justify-between gap-2 p-2 sm:flex-row">
      <AppLogo />
      <SearchBar />
      <HeaderMenu links={links} />
    </header>
  );
}
