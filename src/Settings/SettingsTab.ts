import { ButtonComponent, Notice, Plugin, PluginSettingTab, requestUrl, Setting, TextComponent, ToggleComponent } from 'obsidian';
import * as obsidian from 'obsidian';
import { YTISettings } from './Settings'
import { linkVariable } from '../utils';


export class YTISettingsTab extends PluginSettingTab {
    plugin: Plugin
    settings: YTISettings

    private showClientId = new linkVariable(false)
    private showClientSecret = new linkVariable(false)
    private showOAuth = new linkVariable(false)
    private showOrgId = new linkVariable(false)


    constructor(plugin: Plugin, settings: YTISettings) {
        super(plugin.app, plugin)
        this.plugin = plugin
        this.settings = settings
    }

    private addHiddenText(
        containerEl: HTMLElement,
        name: string,
        desc: string,
        settingsAttrName: string,
        flag: linkVariable
    ) {
        new Setting(containerEl)
            .setName(name)
            .setDesc(desc)
            .addExtraButton((button) =>
                button
                    .setTooltip(`Копировать ${name}`)
                    .setIcon("copy")
                    .onClick(async () => {
                        if (this.settings.data.clientId) {
                            await navigator.clipboard.writeText(this.settings.data.clientId);
                            new Notice(`${name} помещён в буфер обмена`);
                        }
                    })
            )
            .addExtraButton((button) =>
                button
                    .setIcon(flag.value ? "eye-off" : "eye")
                    .onClick(() => {
                        flag.value = !flag.value;
                        this.display();
                    })
                    .setTooltip(flag.value ? `Скрыть ${name}` : `Показать ${name}`)
            )
            .addText((text) => {
                text
                    .setValue(this.settings.data[settingsAttrName].toString())
                    .onChange(async (value: string) => {
                        this.settings.data[settingsAttrName] = value
                        await this.settings.save()
                    })

                text.inputEl.setAttr(
                    "type",
                    flag.value ? "text" : "password"
                );
            });
    }

    display() {
        let { containerEl } = this

        containerEl.empty()

        this.addHiddenText(
            containerEl,
            "Client ID",
            'Укажите ваш Client ID',
            'clientId',
            this.showClientId
        )

        this.addHiddenText(
            containerEl,
            "Client Secret",
            'Укажите ваш Client Secret',
            'clientSecret',
            this.showClientSecret
        )


        this.addHiddenText(
            containerEl,
            "OAuth Token",
            'Укажите ваш OAuth Token',
            'oauth',
            this.showOAuth
        )

        this.addHiddenText(
            containerEl,
            "Org ID",
            'Укажите Org ID вашей организации',
            'orgId',
            this.showOrgId
        )

        new Setting(containerEl)
            .setName('Проверка подключения')
            .setDesc('Проверка подключения к Yandex Tracker')
            .addButton((component: ButtonComponent) =>
                component
                    .setButtonText("Проверить")
                    .onClick(async (evt: MouseEvent) => {
                        new Notice(`Тест подключения`)
                        // const URL = `https://api.tracker.yandex.net/v3/issues/_search?expand=transitions`

                        // const URL = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${this.settings.data.clientId}`
                        const URL = `https://api.tracker.yandex.net/v3/issues/IIFA-8995?expand=attachments`

                        const testData = await requestUrl({
                            url: URL,
                            method: "GET",
                            headers: {
                                // "Host": "api.tracker.yandex.net",
                                "Authorization": "OAuth " + this.settings.data.oauth,
                                "X-Org-ID": this.settings.data.orgId
                            },
                            // body: JSON.stringify(params)
                        })
                            .then(async (response) => {
                                return response
                                // return (await response.json)
                            })
                            .catch(err => {
                                console.log(err)
                            })

                        console.log(testData)
                    })
            )
    }
}
