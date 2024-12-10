import { describe, it, expect } from 'vitest';
import { createSnippetIndex } from '../utils/search';
import { SnippetData } from '../types';

describe('Search Utils', () => {
  const testSnippets: SnippetData[] = [
    {
      id: 'test-snippet',
      content: 'This is a test snippet',
      tags: ['test', 'example'],
      lastModified: Date.now()
    },
    {
      id: 'another-snippet',
      content: 'Another example snippet',
      tags: ['example'],
      lastModified: Date.now()
    }
  ];

  it('should create search index', () => {
    const index = createSnippetIndex(testSnippets);
    expect(index).toBeDefined();
  });

  it('should find snippets by content', () => {
    const index = createSnippetIndex(testSnippets);
    const results = index.search('test');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('test-snippet');
  });
});