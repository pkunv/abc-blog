import { AppLogo } from "@/components/header/app-logo";
import { HeaderMenu } from "@/components/header/header-menu";
import { SearchBar } from "@/components/header/search-bar";
import { getLocalizedPathname } from "@/i18n";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const session = await getServerAuthSession();
  const specialPages = await api.layout.getEnabledSpecialPages();
  const t = await getTranslations("nav");
  const links = [
    {
      title: t("home"),
      href: "/",
    },
    specialPages.about && {
      title: t("about"),
      href: "/about",
    },
    specialPages.contact && {
      title: t("contact"),
      href: "/contact",
    },
    session && { title: "Dashboard", href: "/dashboard" },
    session && { title: t("logout"), href: "/api/auth/signout?callback=/" },
  ].filter((link) => link) as { title: string; href: string }[];

  return (
    <header className="mx-auto flex w-full flex-col items-center justify-between gap-2 p-2 sm:flex-row">
      <AppLogo />
      <SearchBar
        localizedPathname={getLocalizedPathname("/search")}
        placeholder={t("searchBarPlaceholder")}
      />
      <HeaderMenu links={links} />
    </header>
  );
}
