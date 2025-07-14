import { ButtonComponent, Notice, Plugin, PluginSettingTab, requestUrl, Setting, TextComponent, ToggleComponent } from 'obsidian';
import * as obsidian from 'obsidian';
import { DisplayAttribute, YTISettings } from './Settings'
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

        // this.addHiddenText(
        //     containerEl,
        //     "Client ID",
        //     'Укажите ваш Client ID',
        //     'clientId',
        //     this.showClientId
        // )

        // this.addHiddenText(
        //     containerEl,
        //     "Client Secret",
        //     'Укажите ваш Client Secret',
        //     'clientSecret',
        //     this.showClientSecret
        // )


        const auth_header = createEl('h1')
        auth_header.innerHTML = "Авторизация."
        containerEl.appendChild(auth_header)

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

        const display_settings_header = createEl('h1')
        display_settings_header.innerHTML = "Настройки отображения."
        containerEl.appendChild(display_settings_header)

        new Setting(containerEl)
            .setName('Атрибуты задач')
            .setDesc('Атрибуты задач через пробел')
            .addText((text) => {
                text
                    .setValue(this.settings.data.issueAttrs.map(item => (item as DisplayAttribute).convertToString()).join(" "))
                    .onChange(async (value: string) => {
                        this.settings.data.issueAttrs = value
                            .split(" ")
                            .map(token => DisplayAttribute.parseFromString(token))
                        await this.settings.save()
                    })
            });


        new Setting(containerEl)
            .setName('Атрибуты досок')
            .setDesc('Атрибуты досок через пробел')
            .addText((text) => {
                text
                    .setValue(this.settings.data.boardAttrs.map(item => item.convertToString()).join(" "))
                    .onChange(async (value: string) => {
                        this.settings.data.boardAttrs = value
                            .split(" ")
                            .map(token => DisplayAttribute.parseFromString(token))
                        await this.settings.save()
                    })
            });


        new Setting(containerEl)
            .setName('Атрибуты проектов')
            .setDesc('Атрибуты проектов через пробел')
            .addText((text) => {
                text
                    .setValue(this.settings.data.projectAttrs.map(item => (item as DisplayAttribute).convertToString()).join(" "))
                    .onChange(async (value: string) => {
                        this.settings.data.projectAttrs = value
                            .split(" ")
                            .map(token => DisplayAttribute.parseFromString(token))
                        await this.settings.save()
                    })
            });


        new Setting(containerEl)
            .setName('Атрибуты очередей')
            .setDesc('Атрибуты очередей через пробел')
            .addText((text) => {
                text
                    .setValue(this.settings.data.queueAttrs.map(item => (item as DisplayAttribute).convertToString()).join(" "))
                    .onChange(async (value: string) => {
                        this.settings.data.queueAttrs = value
                            .split(" ")
                            .map(token => DisplayAttribute.parseFromString(token))
                        await this.settings.save()
                    })
            });


        new Setting(containerEl)
            .setName('Атрибуты спринтов')
            .setDesc('Атрибуты спринтов через пробел')
            .addText((text) => {
                text
                    .setValue(this.settings.data.sprintAttrs.map(item => (item as DisplayAttribute).convertToString()).join(" "))
                    .onChange(async (value: string) => {
                        this.settings.data.sprintAttrs = value
                            .split(" ")
                            .map(token => DisplayAttribute.parseFromString(token))
                        await this.settings.save()
                    })
            });


        new Setting(containerEl)
            .setName('Атрибуты пользователей')
            .setDesc('Атрибуты пользователей через пробел')
            .addText((text) => {
                text
                    .setValue(this.settings.data.userAttrs.map(item => (item as DisplayAttribute).convertToString()).join(" "))
                    .onChange(async (value: string) => {
                        this.settings.data.userAttrs = value
                            .split(" ")
                            .map(token => DisplayAttribute.parseFromString(token))
                        await this.settings.save()
                    })
            });

        new Setting(containerEl)
            .setName('Сбросить настройки до стандартных')
            .setDesc('Настройки отображения таблиц сбросятся до стандартных')
            .addButton((component: ButtonComponent) =>
                component
                    .setButtonText("Сбросить")
                    .onClick(async (evt: MouseEvent) => {
                        new Notice("Настройки были сброшены")
                    })
            )
    }
}
