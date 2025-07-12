import { Notice } from "obsidian";
import { isFail, YTAPI } from "./API/YTAPI";
import { SettingsData } from "./Settings/Settings";
import { FailResponse } from "./API/APIBase";


// Шлёт много запросов для формирования консистентной модельки

export interface TestableRequestProvider {
    testConnection(): Promise<void>
}

export class YTClient implements TestableRequestProvider {

    private yTAPI

    constructor(settingsData: SettingsData) {
        this.yTAPI = new YTAPI(settingsData)
    }

    public async testReq() {
        this.yTAPI.testReq()

        const responseTest = await this.yTAPI.requestTest()
        console.log(responseTest)

        console.log("\ntesting fail\n--------------------------------------------------")
        const responseFail = await this.yTAPI.testFail()
        console.log(responseFail)
        console.log("--------------------------------------------------")
        
        console.log("\ntesting unauth\n--------------------------------------------------")
        const responseUnauth = await this.yTAPI.testUnauth()
        console.log(responseUnauth)
        console.log("--------------------------------------------------")
        
    }

    public async testConnection(): Promise<void> {
        const responseTest = await this.yTAPI.requestTest()

        if (isFail(responseTest)) {
            console.error("YTI: Ошибка при проверке подключения.\n\nПолученный ответ: ", responseTest.response)
            new Notice("Проблемы с подключением.\n\nДля дополнительной информации смотри логи.")
            return
        }

        new Notice(`Подключение работает.\n\nВы авторизовались как ${responseTest.display}.`)
    }
}