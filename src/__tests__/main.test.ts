import { describe, it, expect, beforeEach, vi } from 'vitest';
import SquareChecklistPlugin from '../main';
import { Plugin } from 'obsidian';

// Mock the Plugin class
vi.mock('obsidian', () => ({
  Plugin: class {
    loadData() {
      return Promise.resolve({});
    }
    saveData() {
      return Promise.resolve();
    }
  }
}));

describe('SquareChecklistPlugin', () => {
  let plugin: SquareChecklistPlugin;

  beforeEach(() => {
    plugin = new SquareChecklistPlugin(null as any, null as any);
  });

  it('should load with default settings', async () => {
    await plugin.onload();
    expect(plugin.settings.enabled).toBe(true);
  });

  it('should add styles on load', async () => {
    await plugin.onload();
    const styleEl = document.getElementById('square-checklist-styles');
    expect(styleEl).toBeDefined();
    expect(styleEl?.tagName.toLowerCase()).toBe('style');
  });

  it('should remove styles on unload', async () => {
    await plugin.onload();
    plugin.onunload();
    const styleEl = document.getElementById('square-checklist-styles');
    expect(styleEl).toBeNull();
  });
});