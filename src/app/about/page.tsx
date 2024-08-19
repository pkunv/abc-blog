import { TypographyH2, TypographyP } from "@/components/ui/typography";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <TypographyH2 className="w-full text-left">About</TypographyH2>
      <TypographyP>
        Simple blog web app. JSON_LD, Schema.org compatible.
      </TypographyP>
      <TypographyP>
        Find more info on{" "}
        <Link
          href="https://github.com/pkunv/abc-blog"
          target="_blank"
          className="underline"
        >
          Github page
        </Link>
      </TypographyP>
    </>
  );
}
