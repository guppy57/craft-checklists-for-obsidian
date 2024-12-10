import { App, PluginSettingTab, Setting } from 'obsidian';
import ObsidianPlugin from './main';

export class SettingsTab extends PluginSettingTab {
  plugin: ObsidianPlugin;

  constructor(app: App, plugin: ObsidianPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Plugin Settings' });

    new Setting(containerEl)
      .setName('Example Setting')
      .setDesc('This is an example setting')
      .addText(text => text
        .setPlaceholder('Enter your setting')
        .setValue(this.plugin.settings.exampleSetting)
        .onChange(async (value) => {
          this.plugin.settings.exampleSetting = value;
          await this.plugin.saveSettings();
        }));
  }
}