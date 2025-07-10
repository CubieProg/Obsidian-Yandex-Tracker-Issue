import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, MarkdownView } from 'obsidian';
import { YTISettings } from './src/Settings/Settings';
import { YTISettingsTab } from './src/Settings/SettingsTab';
import { API } from './src/API/apiBase';


class YTIPlugin extends Plugin {

    private settings: YTISettings;
    private api: API;

    async onload() {
        this.settings = new YTISettings(this)
        await this.settings.load()
        this.addSettingTab(new YTISettingsTab(this, this.settings))

        this.api = new API(this.settings.data)

        this.registerMarkdownCodeBlockProcessor('yt-issue', async (source, el, ctx) => {
            const content = source.split('\n').map(async line => await this.api.requestIssue(line) + '\n')

            const bar = await Promise.all(content);

            const header = `
                <tr>
                    <th scope="col">ID задачи</th>
                    <th scope="col">Название</th>
                    <th scope="col">Дата начала</th>
                    <th scope="col">Исполнитель</th>
                    <th scope="col">Статус</th>
                </tr>
            `

            el.innerHTML = '<table>' + header + bar.join("\n") + '</table>'
        })
    }
}

module.exports = YTIPlugin