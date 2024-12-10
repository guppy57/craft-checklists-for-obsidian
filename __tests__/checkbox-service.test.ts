import { describe, it, expect, beforeEach } from 'vitest';
import { CheckboxService } from '../services/checkbox-service';
import { CheckboxState } from '../types';

describe('CheckboxService', () => {
  describe('getNextState', () => {
    it('should cycle through states correctly', () => {
      expect(CheckboxService.getNextState(CheckboxState.UNCHECKED)).toBe(CheckboxState.CHECKED);
      expect(CheckboxService.getNextState(CheckboxState.CHECKED)).toBe(CheckboxState.CANCELLED);
      expect(CheckboxService.getNextState(CheckboxState.CANCELLED)).toBe(CheckboxState.UNCHECKED);
    });
  });

  describe('getCheckboxState', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.className = 'task-list-item';
      const checkbox = document.createElement('input');
      checkbox.className = 'task-list-item-checkbox';
      checkbox.type = 'checkbox';
      element.appendChild(checkbox);
    });

    it('should detect unchecked state', () => {
      expect(CheckboxService.getCheckboxState(element)).toBe(CheckboxState.UNCHECKED);
    });

    it('should detect checked state', () => {
      const checkbox = element.querySelector('.task-list-item-checkbox') as HTMLInputElement;
      checkbox.checked = true;
      expect(CheckboxService.getCheckboxState(element)).toBe(CheckboxState.CHECKED);
    });

    it('should detect cancelled state', () => {
      const checkbox = element.querySelector('.task-list-item-checkbox') as HTMLInputElement;
      checkbox.checked = true;
      element.classList.add('is-cancelled');
      expect(CheckboxService.getCheckboxState(element)).toBe(CheckboxState.CANCELLED);
    });
  });
});