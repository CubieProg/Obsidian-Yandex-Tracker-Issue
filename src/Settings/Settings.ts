import { Notice, Plugin } from 'obsidian';
// import { YWISessionGlobalProvider } from "../../Model/YWIContext"
import { isTypeOf } from '../utils';
import { defaultSettings } from './defaultSettings';



export class DisplayAttribute {
    public firstLayer: string;
    public secondLayer: string | undefined;
    public modifyers: string[];

    constructor(data: any | undefined = undefined) {
        if (data === undefined) { return }
        this.firstLayer = data.firstLayer
        this.modifyers = data.modifyers
        this.secondLayer = data.secondLayer
    }

    public static parseFromString(data: string): DisplayAttribute {
        const result = new DisplayAttribute()
        const tokens: string[] = data.split(":")

        if (tokens.length <= 0) { return result }

        const layers = (tokens.shift() as string).split('.')

        if (layers.length >= 1) { result.firstLayer = layers[0] }
        if (layers.length >= 2) { result.secondLayer = layers[1] }

        result.modifyers = tokens

        return result
    }

    public convertToString(): string {
        let res: string = this.firstLayer
        if (this.secondLayer) { res += `.${this.secondLayer}` }
        if (this.modifyers.length > 0) { res += ":" + this.modifyers.join(":") }

        return res
    }
}

export class SettingsData {
    orgId: string = "";
    oauth: string = "";

    issueAttrs: DisplayAttribute[] = []
    boardAttrs: DisplayAttribute[] = []
    projectAttrs: DisplayAttribute[] = []
    queueAttrs: DisplayAttribute[] = []
    sprintAttrs: DisplayAttribute[] = []
    userAttrs: DisplayAttribute[] = []

    ganttTerminationStatuses: string[] = []
}


export class YTISettings {
    private plugin: Plugin;
    public data: SettingsData;

    constructor(plugin: Plugin) {
        this.plugin = plugin
    }

    private crushedDataNotice() {
        new Notice(`Файл 'data.json' повреждён и будет восстановлен до стандартных значений.`)
    }

    private firstLaunchNotice() {
        new Notice(
            `Видимо, вы запустили 'Yandex Tracker Issue' в первый раз.\n\nСпасибо за установку плагина!!!\n\nДля детальной информации, ознакомтесь с инструкцией.\n\nЕсли вы нашли ошибку - откройте, пожалуйста, Issue в github-е.`,
            15000
        )
    }

    public async load() {
        let data = await this.plugin.loadData()

        if (!isTypeOf(data, SettingsData)) {
            if (data !== null) {
                this.crushedDataNotice()
            } else {
                this.firstLaunchNotice()
            }

            await this.plugin.saveData(defaultSettings)
            data = await this.plugin.loadData()
        }


        data.issueAttrs = data.issueAttrs.map(item => new DisplayAttribute(item))
        data.boardAttrs = data.boardAttrs.map(item => new DisplayAttribute(item))
        data.projectAttrs = data.projectAttrs.map(item => new DisplayAttribute(item))
        data.queueAttrs = data.queueAttrs.map(item => new DisplayAttribute(item))
        data.sprintAttrs = data.sprintAttrs.map(item => new DisplayAttribute(item))
        data.userAttrs = data.userAttrs.map(item => new DisplayAttribute(item))

        data.ganttTerminationStatuses = data.ganttTerminationStatuses

        this.data = data

    }

    public async dropToDefault() {
        let newSettings = structuredClone(defaultSettings)
        newSettings.oauth = this.data.oauth
        newSettings.orgId = this.data.orgId

        await this.plugin.saveData(newSettings)
        await this.load()
    }

    public async save() {
        await this.plugin.saveData(this.data)
        this.plugin.app.vault.trigger("YTI:save-settings")
    }

    public async setOrgId(orgId: string) {
        this.data.orgId = orgId
        await this.save()
    }
}