import { Plugin, MarkdownView } from "obsidian";
import { CheckboxState } from "./types";

export default class ThreeStateChecklistPlugin extends Plugin {
  async onload() {
    this.loadStyles();
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
