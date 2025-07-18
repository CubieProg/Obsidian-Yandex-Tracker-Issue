import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, MarkdownView } from 'obsidian';
import { YTISettings } from './src/Settings/Settings';
import { YTISettingsTab } from './src/Settings/SettingsTab';
import { YTClient } from './src/YTClient';
import { MarkdownParser } from './src/MarkdownParser/MarkdownParser';

class YTIPlugin extends Plugin {

    private settings: YTISettings;
    private YandexTrackerClient: YTClient
    private markdownParser: MarkdownParser

    async onload() {
        this.settings = new YTISettings(this)
        await this.settings.load()

        this.YandexTrackerClient = new YTClient(this.settings.data)

        this.addSettingTab(new YTISettingsTab(this, this.settings, this.YandexTrackerClient))

        this.markdownParser = new MarkdownParser(this.YandexTrackerClient, this, this.settings)

        this.registerEvents()
    }

    private rerender(full: boolean = false) {
        this.markdownParser.rerender()
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView)
        try { activeView?.previewMode.rerender(full) } catch { }
    }

    private registerEvents() {
        const eventsMap = new Map<string, Function>([
            ["yandex-tracker-issue:rerender", async (data: any) => {
                this.rerender()
            }],
        ])
        eventsMap.forEach((callback, event_name) => {
            this.registerEvent(this.app.vault.on(event_name, async (data: any = null) => {
                await callback(data)
            }));
        })
    }
}

module.exports = YTIPlugin