import { SnippetData } from '../types';

interface SearchResult {
  id: string;
  score: number;
}

export function createSnippetIndex(snippets: SnippetData[]) {
  return {
    search(query: string): SearchResult[] {
      return snippets
        .map(snippet => ({
          id: snippet.id,
          score: calculateRelevance(snippet, query)
        }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);
    }
  };
}

function calculateRelevance(snippet: SnippetData, query: string): number {
  const normalizedQuery = query.toLowerCase();
  const normalizedContent = snippet.content.toLowerCase();
  
  let score = 0;
  
  // Title match
  if (snippet.id.toLowerCase().includes(normalizedQuery)) {
    score += 10;
  }
  
  // Content match
  if (normalizedContent.includes(normalizedQuery)) {
    score += 5;
  }
  
  // Tag matches
  score += snippet.tags.filter(tag => 
    tag.toLowerCase().includes(normalizedQuery)
  ).length * 3;
  
  return score;
}