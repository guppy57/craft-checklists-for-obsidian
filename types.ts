export enum CheckboxState {
  UNCHECKED = 'unchecked',
  CHECKED = 'checked',
  CANCELLED = 'cancelled'
}

export interface PluginSettings {
  enabled: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  enabled: true
};