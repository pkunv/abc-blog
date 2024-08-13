import { MenuItem } from "@/components/header/menu-item";

export function HeaderMenu({
  links,
}: {
  links: { title: string; href: string }[];
}) {
  return (
    <nav className="flex flex-row items-center gap-2">
      {links.map((item) => (
        <MenuItem key={item.href} item={item} />
      ))}
    </nav>
  );
}
