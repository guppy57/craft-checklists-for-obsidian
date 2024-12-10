import { Plugin, MarkdownView } from 'obsidian';
import { PluginSettings, DEFAULT_SETTINGS, CheckboxState } from './types';
import { CheckboxService } from './services/checkbox-service';

export default class ThreeStateChecklistPlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    await this.loadSettings();
    this.loadStyles();
    this.registerCheckboxClickHandler();
  }

  private registerCheckboxClickHandler() {
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      const target = evt.target as HTMLElement;
      
      // Check if clicked element is a checkbox
      if (!target.classList.contains('task-list-item-checkbox')) {
        return;
      }

      // Prevent default checkbox behavior
      evt.preventDefault();
      evt.stopPropagation();

      const listItem = target.closest('.task-list-item');
      if (!listItem) return;

      // Get current state and calculate next state
      const currentState = CheckboxService.getCheckboxState(listItem);
      const nextState = CheckboxService.getNextState(currentState);

      // Update the checkbox state
      CheckboxService.updateCheckboxState(listItem, nextState);

      // Update the markdown content
      this.updateMarkdownContent(listItem, nextState);
    });
  }

  private async updateMarkdownContent(listItem: HTMLElement, state: CheckboxState) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;

    const editor = view.editor;
    const lineNumber = this.getLineNumberFromElement(listItem);
    if (lineNumber === -1) return;

    const line = editor.getLine(lineNumber);
    const newLine = line.replace(
      /\[[\sx]\]/i,
      state === CheckboxState.UNCHECKED ? '[ ]' :
      state === CheckboxState.CHECKED ? '[x]' : '[x]'
    );

    editor.transaction({
      changes: [{
        from: { line: lineNumber, ch: 0 },
        to: { line: lineNumber, ch: line.length },
        text: newLine
      }]
    });
  }

  private getLineNumberFromElement(element: HTMLElement): number {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return -1;

    const cmEditor = view.editor;
    const pos = cmEditor.posAtDOM(element);
    return pos ? pos.line : -1;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private loadStyles() {
    const styleEl = document.createElement('style');
    styleEl.id = 'three-state-checklist-styles';
    styleEl.textContent = `
      .task-list-item-checkbox {
        border-radius: 0 !important;
      }

      .task-list-item-checkbox:checked {
        background-color: var(--interactive-accent) !important;
        border-radius: 0 !important;
      }

      .task-list-item.is-cancelled .task-list-item-checkbox {
        background-color: var(--text-muted) !important;
        border-radius: 0 !important;
      }

      .task-list-item.is-cancelled .task-list-item-checkbox::after {
        content: '×' !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: var(--background-primary);
      }

      .task-list-item.is-cancelled {
        text-decoration: line-through;
        color: var(--text-muted);
      }
    `;
    document.head.appendChild(styleEl);
  }

  onunload() {
    const styleEl = document.getElementById('three-state-checklist-styles');
    if (styleEl) {
      styleEl.remove();
    }
  }
}