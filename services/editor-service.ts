import { Editor, MarkdownView } from "obsidian";
import { CheckboxState } from "../types";

export class EditorService {
  constructor(public view: MarkdownView) {
    this.view = view;
  }

  getLineNumberFromElement(element: Element): number {
    // Get all task list items in the document
    const taskItems = Array.from(document.querySelectorAll(".task-list-item"));
    const el = element.closest(".task-list-item");

    if (el === null) return -1;

    let index = taskItems.indexOf(el);

    if (index === -1) return -1;

    // Find the corresponding line in the editor
    const editor = this.view.editor;
    const totalLines = editor.lineCount();

    for (let i = 0; i < totalLines; i++) {
      const line = editor.getLine(i);
      if (line.match(/^\s*[-*+]\s*\[[ x]\]/i)) {
        if (index === 0) return i;
        index--;
      }
    }

    return -1;
  }

  updateCheckboxInLine(lineNumber: number, state: CheckboxState): void {
    const editor = this.view.editor;
    const line = editor.getLine(lineNumber);
    const newLine = line.replace(
      /\[[\sx]\]/i,
      state === CheckboxState.UNCHECKED
        ? "[ ]"
        : state === CheckboxState.CHECKED
          ? "[x]"
          : "[x]",
    );

    editor.transaction({
      changes: [
        {
          from: { line: lineNumber, ch: 0 },
          to: { line: lineNumber, ch: line.length },
          text: newLine,
        },
      ],
    });
  }
}
