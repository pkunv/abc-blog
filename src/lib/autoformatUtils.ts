import type { AutoformatBlockRule } from "@udecode/plate-autoformat";

import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
} from "@udecode/plate-code-block";
import {
  type PlateEditor,
  getParentNode,
  isElement,
  isType,
} from "@udecode/plate-common";
import { toggleList, unwrapList } from "@udecode/plate-list";

export const preFormat: AutoformatBlockRule["preFormat"] = (editor) =>
  unwrapList(editor);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const format = (editor: PlateEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParentNode(editor, editor.selection);

    if (!parentEntry) return;

    const [node] = parentEntry;

    if (
      isElement(node) &&
      !isType(editor, node, ELEMENT_CODE_BLOCK) &&
      !isType(editor, node, ELEMENT_CODE_LINE)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      customFormatting();
    }
  }
};

export const formatList = (editor: PlateEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    }),
  );
};

export const formatText = (editor: PlateEditor, text: string) => {
  format(editor, () => editor.insertText(text));
};
