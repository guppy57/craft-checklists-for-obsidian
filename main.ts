import { Plugin, MarkdownView } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS, CheckboxState } from "./types";
import { CheckboxService } from "./services/checkbox-service";
import { EditorService } from "./services/editor-service";

export default class ThreeStateChecklistPlugin extends Plugin {
  settings: PluginSettings;
  private editorService: EditorService | null = null;

  async onload() {
    await this.loadSettings();
    this.loadStyles();
    this.registerCheckboxClickHandler();
  }

  private registerCheckboxClickHandler() {
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      const target = evt.target as HTMLElement;

      // Check if clicked element is a checkbox
      if (!target.classList.contains("task-list-item-checkbox")) {
        return;
      }

      // Prevent default checkbox behavior
      evt.preventDefault();
      evt.stopPropagation();

      const listItem = target.closest(".task-list-item");
      if (!listItem) return;

      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) return;

      // Initialize editor service if needed
      if (!this.editorService || view !== this.editorService.view) {
        this.editorService = new EditorService(view);
      }

      // Get current state and calculate next state
      const currentState = CheckboxService.getCheckboxState(listItem);
      const nextState = CheckboxService.getNextState(currentState);

      // Update the checkbox state in DOM
      CheckboxService.updateCheckboxState(listItem, nextState);

      // Update the markdown content
      const lineNumber = this.editorService.getLineNumberFromElement(listItem);
      if (lineNumber !== -1) {
        this.editorService.updateCheckboxInLine(lineNumber, nextState);
      }
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private loadStyles() {
    const styleEl = document.createElement("style");
    styleEl.id = "three-state-checklist-styles";
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
    const styleEl = document.getElementById("three-state-checklist-styles");
    if (styleEl) {
      styleEl.remove();
    }
  }
}
