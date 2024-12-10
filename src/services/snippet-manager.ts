import { TFile, Vault } from 'obsidian';
import { SnippetData } from '../types';
import { createSnippetIndex } from '../utils/search';

export class SnippetManager {
  private snippets: Map<string, SnippetData>;
  private vault: Vault;

  constructor(vault: Vault) {
    this.snippets = new Map();
    this.vault = vault;
  }

  async loadSnippets(folderPath: string): Promise<void> {
    const folder = this.vault.getAbstractFileByPath(folderPath);
    if (!folder) return;

    const files = this.vault.getMarkdownFiles().filter(file => 
      file.path.startsWith(folderPath)
    );

    for (const file of files) {
      await this.loadSnippet(file);
    }
  }

  private async loadSnippet(file: TFile): Promise<void> {
    const content = await this.vault.read(file);
    const snippet: SnippetData = {
      id: file.basename,
      content: content,
      tags: this.extractTags(content),
      lastModified: file.stat.mtime
    };
    this.snippets.set(snippet.id, snippet);
  }

  private extractTags(content: string): string[] {
    const tagRegex = /#[a-zA-Z0-9_-]+/g;
    return Array.from(content.matchAll(tagRegex))
      .map(match => match[0].substring(1));
  }

  getSnippet(id: string): SnippetData | undefined {
    return this.snippets.get(id);
  }

  searchSnippets(query: string): SnippetData[] {
    return createSnippetIndex([...this.snippets.values()])
      .search(query)
      .map(result => this.snippets.get(result.id))
      .filter((snippet): snippet is SnippetData => snippet !== undefined);
  }
}