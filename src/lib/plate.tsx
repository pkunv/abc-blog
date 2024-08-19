import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { type PlateProps } from "@udecode/plate-common";

import escapeHtml from "escape-html";
import Image from "next/image";
import Link from "next/link";
import { Node, Text } from "slate";

export function fromJSONToPlate(value: string | undefined | null) {
  return value && value.length > 0
    ? (JSON.parse(value) as PlateProps["initialValue"])
    : undefined;
}

export function fromPlateToJSON(value: PlateProps["initialValue"]) {
  return JSON.stringify(value);
}

export function fromJSONToPlainText(value: string | undefined | null) {
  const serialized = fromJSONToPlate(value);

  return serialized && value && value.length > 0
    ? serialized
        .map((node) => {
          return Node.string(node);
        })
        .join("\n")
    : "";
}

export const SerializedPlateElement = ({
  node,
}: {
  node: Node;
}): React.ReactNode => {
  if (Text.isText(node)) {
    const string = escapeHtml(node.text).replaceAll("&#39;", "'");
    //@ts-expect-error - not all types are handled
    if (node.bold) {
      return <strong className="font-bold">{string}</strong>;
    }
    //@ts-expect-error - not all types are handled
    if (node.superscript) {
      return <sup>{string}</sup>;
    }
    return <>{string}</>;
  }

  const children = node.children.map((n, index) => (
    <SerializedPlateElement node={n} key={index} />
  ));
  //@ts-expect-error - not all types are handled
  switch (node.type) {
    case "h1":
      return (
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      );
    case "h3":
      return <TypographyH3>{children}</TypographyH3>;
    case "code":
      return <code>{children}</code>;
    case "quote":
      return (
        <blockquote>
          <TypographyP>{children}</TypographyP>
        </blockquote>
      );
    case "paragraph":
      return <TypographyP className="w-full">{children}</TypographyP>;
    case "link":
      return (
        // @ts-expect-error - not all types are handled
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        <Link href={escapeHtml(node.url)} target="_blank">
          {children}
        </Link>
      );
    case "img":
      return (
        <Image
          // @ts-expect-error - not all types are handled
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
          src={node.url}
          alt="Post image"
          width="0"
          height="0"
          sizes="50vw"
          className="h-auto w-1/2"
        />
      );
    default:
      return children;
  }
};
