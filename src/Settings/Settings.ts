import { Notice, Plugin } from 'obsidian';
// import { YWISessionGlobalProvider } from "../../Model/YWIContext"
import { isTypeOf } from '../utils';


export class SettingsData {
    clientId: string = "";
    clientSecret: string = "";
    orgId: string = "";
    oauth: string = "";
}


export class YTISettings {
    private plugin: Plugin;
    public data: SettingsData;

    constructor(plugin: Plugin) {
        this.plugin = plugin
    }

    private crushedDataNotice(){
        new Notice(`Файл 'data.json' повреждён и будет восстановлен до стандартных значений.`)
    }

    public async load() {
        let data = await this.plugin.loadData()

        if (!isTypeOf(data, SettingsData)){
            if(data !== null){
                this.crushedDataNotice()
            }

            await this.plugin.saveData(new SettingsData())
            data = await this.plugin.loadData()
        }

        this.data = data
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