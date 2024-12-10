import { Editor, EditorPosition, EditorSuggest } from 'obsidian';
import { EditorSuggestion } from '../types';
import { SNIPPET_TRIGGER, MIN_SEARCH_LENGTH } from '../constants';

export class EditorService {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  getCurrentLine(): string {
    const cursor = this.editor.getCursor();
    return this.editor.getLine(cursor.line);
  }

  getSnippetTriggerPosition(): EditorPosition | null {
    const cursor = this.editor.getCursor();
    const line = this.getCurrentLine();
    const lastTriggerIndex = line.lastIndexOf(SNIPPET_TRIGGER, cursor.ch);
    
    if (lastTriggerIndex === -1) return null;
    
    return {
      line: cursor.line,
      ch: lastTriggerIndex
    };
  }

  insertSnippet(content: string, from: EditorPosition, to: EditorPosition): void {
    this.editor.replaceRange(content, from, to);
  }

  getSearchQuery(): string | null {
    const triggerPos = this.getSnippetTriggerPosition();
    if (!triggerPos) return null;

    const cursor = this.editor.getCursor();
    const currentLine = this.getCurrentLine();
    const query = currentLine.substring(
      triggerPos.ch + SNIPPET_TRIGGER.length,
      cursor.ch
    );

    return query.length >= MIN_SEARCH_LENGTH ? query : null;
  }
}