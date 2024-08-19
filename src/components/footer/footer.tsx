import { TypographyMuted } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto w-full bg-primary-foreground text-white">
      <div className="mx-auto p-4">
        <TypographyMuted>
          © {new Date().getFullYear()} {blogProps.name}, made by{" "}
          <Link
            href="https://github.com/pkunv"
            target="_blank"
            className="underline"
          >
            Kunv
          </Link>
        </TypographyMuted>
      </div>
    </footer>
  );
}
