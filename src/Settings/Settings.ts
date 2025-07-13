import { Notice, Plugin } from 'obsidian';
// import { YWISessionGlobalProvider } from "../../Model/YWIContext"
import { isTypeOf } from '../utils';



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
    clientId: string = "";
    clientSecret: string = "";
    orgId: string = "";
    oauth: string = "";


    issueAttrs: DisplayAttribute[] = []
    boardAttrs: DisplayAttribute[] = []
    projectAttrs: DisplayAttribute[] = []
    queueAttrs: DisplayAttribute[] = []
    sprintAttrs: DisplayAttribute[] = []
    userAttrs: DisplayAttribute[] = []
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

    public async load() {
        let data = await this.plugin.loadData()

        if (!isTypeOf(data, SettingsData)) {
            if (data !== null) {
                this.crushedDataNotice()
            }

            await this.plugin.saveData(new SettingsData())
            data = await this.plugin.loadData()
        }

        
        data.issueAttrs = data.issueAttrs.map(item => new DisplayAttribute(item))
        data.boardAttrs = data.boardAttrs.map(item => new DisplayAttribute(item))
        data.projectAttrs = data.projectAttrs.map(item => new DisplayAttribute(item))
        data.queueAttrs = data.queueAttrs.map(item => new DisplayAttribute(item))
        data.sprintAttrs = data.sprintAttrs.map(item => new DisplayAttribute(item))
        data.userAttrs = data.userAttrs.map(item => new DisplayAttribute(item))
        this.data = data

        // console.log(DisplayAttribute.parseFromString("lay1.lay2:initials:trim20:link"))
        // console.log(DisplayAttribute.parseFromString("lay1:initials:trim20:link"))
        // console.log(DisplayAttribute.parseFromString("lay1"))
        // console.log(DisplayAttribute.parseFromString("lay1.lay2"))
    }

    public async save() {
        await this.plugin.saveData(this.data)
        this.plugin.app.vault.trigger("YTI:save-settings")
    }

    public async setClientId(clientId: string) {
        this.data.clientId = clientId
        await this.save()
    }

    public async setClientSecret(clientSecret: string) {
        this.data.clientSecret = clientSecret
        await this.save()
    }

    public async setOrgId(orgId: string) {
        this.data.orgId = orgId
        await this.save()
    }
}