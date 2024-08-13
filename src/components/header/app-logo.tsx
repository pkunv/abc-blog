import { TypographyH1 } from "@/components/ui/typography";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link className="flex flex-row gap-2" href={"/"}>
      <TypographyH1>ABCBlog</TypographyH1>
    </Link>
  );
}
