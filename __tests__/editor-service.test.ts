import { describe, it, expect, beforeEach, vi } from "vitest";
import { EditorService } from "../services/editor-service";
import { MarkdownView, Editor } from "obsidian";
import { CheckboxState } from "../types";

describe("EditorService", () => {
  let editorService: EditorService;
  let mockEditor: Editor;
  let mockView: MarkdownView;

  beforeEach(() => {
    // Create mock elements
    document.body.innerHTML = `
      <div class="task-list-item">
        <input type="checkbox" class="task-list-item-checkbox">
        <span>Task 1</span>
      </div>
      <div class="task-list-item">
        <input type="checkbox" class="task-list-item-checkbox">
        <span>Task 2</span>
      </div>
    `;

    // Mock editor
    mockEditor = {
      lineCount: () => 3,
      getLine: (line: number) => {
        const lines = ["- [ ] Task 1", "- [x] Task 2", "Normal text"];
        return lines[line];
      },
      transaction: vi.fn(),
    } as unknown as Editor;

    // Mock view
    mockView = {
      editor: mockEditor,
    } as unknown as MarkdownView;

    editorService = new EditorService(mockView);
  });

  describe("getLineNumberFromElement", () => {
    it("should find correct line number for task item", () => {
      const element = document.querySelector(".task-list-item");
      const lineNumber = editorService.getLineNumberFromElement(element);
      expect(lineNumber).toBe(0);
    });

    it("should return -1 for non-existent element", () => {
      const element = document.createElement("div");
      const lineNumber = editorService.getLineNumberFromElement(element);
      expect(lineNumber).toBe(-1);
    });
  });

  describe("updateCheckboxInLine", () => {
    it("should update line content correctly", () => {
      editorService.updateCheckboxInLine(0, CheckboxState.CHECKED);
      expect(mockEditor.transaction).toHaveBeenCalled();
    });
  });
});
