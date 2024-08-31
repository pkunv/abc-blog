import { buttonVariants } from "@/components/ui/button";
import { getLocalizedPathname } from "@/i18n";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MenuItem({ item }: { item: { title: string; href: string } }) {
  return (
    <Link
      href={getLocalizedPathname(item.href)}
      className={cn(buttonVariants({ variant: "link" }))}
    >
      {item.title}
    </Link>
  );
}
