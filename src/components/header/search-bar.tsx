"use client";

import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar({
  localizedPathname,
  placeholder,
}: {
  localizedPathname: string;
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value === null) params.delete(name);
      params.set("q", value!);
      router.replace(`${localizedPathname}?${params.toString()}`);
    },
    500,
  );

  return (
    <div>
      <InputWithIcon
        startIcon={Search}
        placeholder={placeholder}
        className="mx-auto w-[80dvw] sm:w-full"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearch("q", e.target.value)}
        type="search"
      />
    </div>
  );
}
