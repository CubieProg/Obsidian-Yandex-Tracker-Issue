import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, MarkdownView } from 'obsidian';
import { YTISettings } from './src/Settings/Settings';
import { YTISettingsTab } from './src/Settings/SettingsTab';
import { YTClient } from './src/YTClient';
import { MarkdownParser } from './src/MarkdownParser/MarkdownParser';

export default class YTIPlugin extends Plugin {

    private settings: YTISettings;
    private YandexTrackerClient: YTClient
    private markdownParser: MarkdownParser

    async onload() {
        this.settings = new YTISettings(this)
        await this.settings.load()

        this.YandexTrackerClient = new YTClient(this.settings.data)

        this.addSettingTab(new YTISettingsTab(this, this.settings, this.YandexTrackerClient))

        this.markdownParser = new MarkdownParser(this.YandexTrackerClient, this, this.settings)
    }

    async onunload() {
        // this.markdownParser.unregisterProcessors()
    }
}

// module.exports = YTIPlugin