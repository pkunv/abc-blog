import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MenuItem({ item }: { item: { title: string; href: string } }) {
  return (
    <Link href={item.href} className={cn(buttonVariants({ variant: "link" }))}>
      {item.title}
    </Link>
  );
}
