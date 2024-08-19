import { HeaderMenu } from "@/components/header/header-menu";

export function CategoriesHeader({
  links,
}: {
  links: { title: string; href: string }[];
}) {
  return (
    <section className="mx-auto flex w-full flex-col items-center justify-center gap-2 p-2 sm:hidden sm:flex-row">
      <HeaderMenu links={links} />
    </section>
  );
}
