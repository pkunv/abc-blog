import { HeaderMenu } from "@/components/header/header-menu";
import { api } from "@/trpc/server";

export async function Categories() {
  const categories = (await api.post.getCategories()).map((category) => ({
    title: category.category,
    href: `/category/${category.category}`,
  }));

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-2 p-2 sm:flex-row">
      <HeaderMenu links={categories} />
    </section>
  );
}
