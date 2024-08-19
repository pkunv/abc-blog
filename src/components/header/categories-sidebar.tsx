import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type RouterOutputs } from "@/trpc/react";
import Link from "next/link";

export function CategoriesSidebar({
  categories,
}: {
  categories: RouterOutputs["post"]["getCategories"];
}) {
  return (
    <aside className="hidden sm:block">
      <nav className="px-2">
        <Accordion
          type="multiple"
          defaultValue={categories.map((category) => category.category)}
        >
          {categories.map((category) => (
            <AccordionItem key={category.category} value={category.category}>
              <AccordionTrigger className="text-bold">
                <Link
                  href={category.href}
                  className="hover:underline"
                  target="_blank"
                >
                  {category.category}
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="w-full space-y-3">
                  {category.posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}`}
                        scroll={false}
                        prefetch={false}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </aside>
  );
}
