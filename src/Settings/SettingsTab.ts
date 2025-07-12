import { ButtonComponent, Notice, Plugin, PluginSettingTab, requestUrl, Setting, TextComponent, ToggleComponent } from 'obsidian';
import * as obsidian from 'obsidian';
import { YTISettings } from './Settings'
import { linkVariable } from '../utils';
import { TestableRequestProvider } from '../YTClient';


export class YTISettingsTab extends PluginSettingTab {
    private plugin: Plugin
    private settings: YTISettings
    private tester: TestableRequestProvider;

    private showClientId = new linkVariable(false)
    private showClientSecret = new linkVariable(false)
    private showOAuth = new linkVariable(false)
    private showOrgId = new linkVariable(false)


    constructor(plugin: Plugin, settings: YTISettings, tester: TestableRequestProvider) {
        super(plugin.app, plugin)
        this.plugin = plugin
        this.settings = settings
        this.tester = tester
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

                        if (!this.tester) {
                            new Notice("Не могу протестировать подключение.\n\nОткройте, пожалуйста, ISSUE на гитхабе в репозитории данного плагина по данной проблеме.")
                        }

                        this.tester.testConnection()
                    })
            )
    }
}
