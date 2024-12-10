import { CheckboxState } from "../types";

export class CheckboxService {
  static getNextState(currentState: CheckboxState): CheckboxState {
    switch (currentState) {
      case CheckboxState.UNCHECKED:
        return CheckboxState.CHECKED;
      case CheckboxState.CHECKED:
        return CheckboxState.CANCELLED;
      case CheckboxState.CANCELLED:
        return CheckboxState.UNCHECKED;
      default:
        return CheckboxState.UNCHECKED;
    }
  }

  static getCheckboxState(element: Element): CheckboxState {
    const checkbox = element.querySelector(
      ".task-list-item-checkbox",
    ) as HTMLInputElement;
    if (!checkbox) return CheckboxState.UNCHECKED;

    if (element.classList.contains("is-cancelled")) {
      return CheckboxState.CANCELLED;
    }

    return checkbox.checked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED;
  }

  static updateCheckboxState(element: Element, state: CheckboxState): void {
    const checkbox = element.querySelector(
      ".task-list-item-checkbox",
    ) as HTMLInputElement;
    if (!checkbox) return;

    switch (state) {
      case CheckboxState.CHECKED:
        checkbox.checked = true;
        element.classList.remove("is-cancelled");
        break;
      case CheckboxState.CANCELLED:
        checkbox.checked = true;
        element.classList.add("is-cancelled");
        break;
      case CheckboxState.UNCHECKED:
        checkbox.checked = false;
        element.classList.remove("is-cancelled");
        break;
    }
  }
}
