/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { type PlateProps } from "@udecode/plate-common";

import type { TText } from "@udecode/slate";
import escapeHtml from "escape-html";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Node, Text } from "slate";

export interface RichText extends TText {
  type: string;
  backgroundColor?: React.CSSProperties["backgroundColor"];
  bold?: boolean;
  code?: boolean;
  color?: React.CSSProperties["color"];
  fontFamily?: React.CSSProperties["fontFamily"];
  fontSize?: React.CSSProperties["fontSize"];
  fontWeight?: React.CSSProperties["fontWeight"];
  italic?: boolean;
  kbd?: boolean;
  strikethrough?: boolean;
  subscript?: boolean;
  underline?: boolean;
  text: string;
  url?: string;
  children: RichText[];
}

interface RichElement {
  type: string;
  backgroundColor?: React.CSSProperties["backgroundColor"];
  bold?: boolean;
  code?: boolean;
  color?: React.CSSProperties["color"];
  fontFamily?: React.CSSProperties["fontFamily"];
  fontSize?: React.CSSProperties["fontSize"];
  fontWeight?: React.CSSProperties["fontWeight"];
  italic?: boolean;
  superscript?: boolean;
  kbd?: boolean;
  strikethrough?: boolean;
  caption?: {
    text: string;
  }[];
  url?: string;
  subscript?: boolean;
  underline?: boolean;
  children: RichText[];
}

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
  node: RichElement;
}): React.ReactNode => {
  if (Text.isText(node)) {
    const string = escapeHtml(node.text)
      .replaceAll("&#39;", "'")
      .replaceAll("&#34;", '"')
      .replaceAll("&#x27;", "'")
      .replaceAll("&#x22;", '"')
      .replaceAll("&quot;", '"');
    // DEFINING STYLES FOR TEXT
    const textClasses = [];
    const textStyles = {} as React.CSSProperties;

    if (node.bold) {
      textClasses.push("font-bold");
    }
    if (node.italic) {
      textClasses.push("italic");
    }
    if (node.superscript) {
      textClasses.push("superscript");
    }
    if (node.underline) {
      textClasses.push("underline");
    }
    if (node.color) {
      textStyles.color = node.color;
    }
    if (node.backgroundColor) {
      textStyles.backgroundColor = node.backgroundColor;
    }

    // DEFINING ELEMENTS FOR TEXT
    let element: JSX.Element = <Fragment>{string}</Fragment>;
    if (node.bold) {
      element = (
        <strong className={cn(textClasses)} style={textStyles}>
          {string}
        </strong>
      );
    }
    if (node.italic) {
      element = (
        <span className={cn(textClasses)} style={textStyles}>
          {string}
        </span>
      );
    }
    if (node.superscript) {
      element = (
        <sup className={cn(textClasses)} style={textStyles}>
          {string}
        </sup>
      );
    }
    if (node.underline) {
      element = (
        <u className={cn(textClasses)} style={textStyles}>
          {string}
        </u>
      );
    }
    if (node.color) {
      element = (
        <span className={cn(textClasses)} style={textStyles}>
          {string}
        </span>
      );
    }
    return element;
  }

  const children = node.children.map((n, index) => (
    <SerializedPlateElement node={n} key={index} />
  ));
  switch (node.type) {
    case "h1":
      return (
        <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
          {children}
        </h2>
      );
    case "h2":
      return (
        <h3 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          {children}
        </h3>
      );
    case "h3":
      return <TypographyH4>{children}</TypographyH4>;
    case "code":
      return <code>{children}</code>;
    case "blockquote":
      return (
        <blockquote className="border-s-4 bg-primary-foreground p-4 italic">
          <TypographyP>{children}</TypographyP>
        </blockquote>
      );
    case "paragraph":
      return <TypographyP className="w-full">{children}</TypographyP>;
    case "a":
      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        <Link href={escapeHtml(node.url)} target="_blank" className="underline">
          {children}
        </Link>
      );
    case "img":
      return (
        <>
          {node.url && (
            <Image
              src={node.url}
              alt={node.caption?.[0]?.text ?? "Post image"}
              width={0}
              height={0}
              sizes="100vw"
              /* @ts-expect-error - not all types are handled */
              style={{ width: node.width, height: "auto" }} // optional
              className="h-auto w-1/3"
            />
          )}
          {node.caption && (
            <span className="text-sm text-muted-foreground">
              {/*  @ts-expect-error - not all types are handled eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
              {node.caption[0].text}
            </span>
          )}
        </>
      );
    case "lic":
      return <ul className="inline w-fit">{children}</ul>;
    case "li":
      return <li className="list-inside list-disc">{children}</li>;
    default:
      if (children[0]?.props.node.text) {
        return <TypographyP>{children}</TypographyP>;
      }
      return <>{children}</>;
  }
};
