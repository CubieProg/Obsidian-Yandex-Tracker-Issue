import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, MarkdownView } from 'obsidian';
import { YTISettings } from './src/Settings/Settings';
import { YTISettingsTab } from './src/Settings/SettingsTab';
import { API } from './src/API/APIBase';
import { YTClient } from './src/YTClient';
import { MarkdownParser } from './src/MarkdownParser/MarkdownParser';

class YTIPlugin extends Plugin {

    private settings: YTISettings;
    private api: API;
    private YandexTrackerClient: YTClient
    private markdownParser: MarkdownParser

    async onload() {
        this.settings = new YTISettings(this)
        await this.settings.load()

        this.YandexTrackerClient = new YTClient(this.settings.data)

        this.addSettingTab(new YTISettingsTab(this, this.settings, this.YandexTrackerClient))

        this.markdownParser = new MarkdownParser(this.YandexTrackerClient, this)


        // this.registerMarkdownCodeBlockProcessor('yt-test', async (source, el, ctx) => {
        //     this.YandexTrackerClient.testReq()
        // })

        // this.api = new API(this.settings.data)

        // this.registerMarkdownCodeBlockProcessor('yt-issue', async (source, el, ctx) => {
        //     const content = source.split('\n').map(async line => await this.api.requestIssue(line) + '\n')

        //     const bar = await Promise.all(content);

        //     const header = `
        //         <tr>
        //             <th scope="col">ID задачи</th>
        //             <th scope="col">Название</th>
        //             <th scope="col">Дата начала</th>
        //             <th scope="col">Исполнитель</th>
        //             <th scope="col">Статус</th>
        //         </tr>
        //     `

        //     el.innerHTML = '<table>' + header + bar.join("\n") + '</table>'
        // })

        // this.registerMarkdownCodeBlockProcessor('yt-boards', async (source, el, ctx) => {
        //     // await this.api.requestBoards()


        //     const content = source.split('\n').map(async line => await this.api.requestBoard(line) + '\n')

        //     const bar = await Promise.all(content);

        //     const header = `
        //         <tr>
        //             <th scope="col">Название доски</th>
        //             <th scope="col">Дата начала</th>
        //             <th scope="col">Создатель</th>
        //         </tr>
        //     `

        //     el.innerHTML = '<table>' + header + bar.join("\n") + '</table>'
        // })


        // this.registerMarkdownCodeBlockProcessor('yt-fields', async (source, el, ctx) => {

        //     el.innerHTML = '<div>' + await this.api.requestFields() + '</div>'
        // })

        // this.registerMarkdownCodeBlockProcessor('yt-queues', async (source, el, ctx) => {

        //     el.innerHTML = '<div>' + await this.api.requestQueues() + '</div>'
        // })
    }
}

module.exports = YTIPlugin