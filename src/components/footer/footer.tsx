import { TypographyMuted } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mx-auto w-full bg-primary-foreground text-white">
      <div className="mx-auto p-4">
        <TypographyMuted>
          © {new Date().getFullYear()} {blogProps.name}, {t("m")}{" "}
          <Link href="https://kunv.dev" target="_blank" className="underline">
            Kunv
          </Link>
        </TypographyMuted>
      </div>
    </footer>
  );
}
