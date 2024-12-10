import { describe, it, expect, beforeEach } from 'vitest';
import { SnippetManager } from '../services/snippet-manager';
import { Vault } from 'obsidian';

// Mock Vault
const mockVault = {
  getAbstractFileByPath: () => ({ path: 'snippets' }),
  getMarkdownFiles: () => [],
  read: async () => ''
} as unknown as Vault;

describe('SnippetManager', () => {
  let snippetManager: SnippetManager;

  beforeEach(() => {
    snippetManager = new SnippetManager(mockVault);
  });

  it('should initialize with empty snippets', () => {
    expect(snippetManager.getSnippet('test')).toBeUndefined();
  });

  it('should load snippets from folder', async () => {
    await snippetManager.loadSnippets('snippets');
    // Add more specific tests based on mock data
  });
});