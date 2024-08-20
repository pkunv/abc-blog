import { TypographyH1 } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link className="inline w-max" href={"/"}>
      <TypographyH1 className="inline w-max">{blogProps.name}</TypographyH1>
    </Link>
  );
}
