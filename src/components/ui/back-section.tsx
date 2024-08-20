"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

export function BackSection() {
  const capitalize = (s: string) => s && s[0]?.toUpperCase() + s.slice(1);
  const pathname = usePathname();
  const pathNames = pathname.split("/").filter((path) => path);
  const pathItems = pathNames.map((path, i) => ({
    name: !Number.isNaN(parseInt(path[0]!))
      ? capitalize(path.slice(1)).replaceAll("-", " ")
      : capitalize(path).replaceAll("-", " "),
    path: pathNames.slice(0, i + 1).join("/"),
  }));
  const router = useRouter();

  if (pathname === "/") return null;
  return (
    <div className="mx-auto flex w-full flex-row items-center justify-stretch gap-2 py-2">
      <Button onClick={() => router.back()} variant={"ghost"}>
        <ChevronLeft />
      </Button>
      <Breadcrumb>
        <BreadcrumbList>
          {pathItems.slice(0, 2).map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${item.path}`}>{item.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < pathItems.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
