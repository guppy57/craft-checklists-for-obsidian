import { PluginSettings } from './types';

export const DEFAULT_SETTINGS: PluginSettings = {
  defaultTemplate: '',
  dateFormat: 'YYYY-MM-DD',
  enableAutoComplete: true,
  snippetFolder: 'snippets'
};

export const SNIPPET_TRIGGER = '::';
export const MAX_SUGGESTIONS = 5;
export const MIN_SEARCH_LENGTH = 2;