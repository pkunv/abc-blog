import { type PlateProps } from "@udecode/plate-common";

import escapeHtml from "escape-html";
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

export const serialize = (node: Node) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    return string;
  }

  const children = node.children.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "h1":
      return `<h1>${children}</h1>`;
    case "h2":
      return `<h2>${children}</h2>`;
    case "h3":
      return `<h3>${children}</h3>`;
    case "code":
      return `<code>${children}</code>`;
    case "quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    default:
      return children;
  }
};
