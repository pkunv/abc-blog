import { AppLogo } from "@/components/header/app-logo";
import { HeaderMenu } from "@/components/header/header-menu";

export function Header() {
  const links = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "About",
      href: "/about",
    },
  ];

  return (
    <header className="mx-auto flex w-full max-w-2xl flex-col items-center justify-between gap-2 p-2 sm:flex-row">
      <AppLogo />
      <HeaderMenu links={links} />
    </header>
  );
}
