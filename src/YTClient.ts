import { Notice } from "obsidian";
import { isFail, YTAPI } from "./API/YTAPI";
import { SettingsData } from "./Settings/Settings";
import { FailResponse } from "./API/APIBase";

import { Board } from "./Model/Board";
import { Issue } from "./Model/Issue";
import { Queue } from "./Model/Queue";
import { User } from "./Model/User";


// Шлёт много запросов для формирования консистентной модельки

export interface TestableRequestProvider {
    testConnection(): Promise<void>
}

export interface YandexTrackerAPIProvider {
    getBoard: Promise<any>;
}

export class YTClient implements TestableRequestProvider {

    private yTAPI

    constructor(settingsData: SettingsData) {
        this.yTAPI = new YTAPI(settingsData)
    }



    public async getBoard(boardID: string): Promise<Board> {
        return new Board()
    }

    public async getIssue(issueID: string, deep: boolean = true): Promise<Issue> {
        const issue = await this.yTAPI.requestIssue(issueID)
        const result: Issue = issue as Issue

        if (deep) {
            const updatedByPromise = result.updatedBy && result.updatedBy.id ? this.getUser(result.updatedBy.id.toString()) : result.updatedBy
            const followersPromise = result.followers ? result.followers.filter(value => value.id).map(value => this.getUser(value.id.toString())) : result.followers
            const createdByPromise = result.createdBy && result.createdBy.id ? this.getUser(result.createdBy.id.toString()) : result.createdBy
            const assigneePromise = result.assignee && result.assignee.id ? this.getUser(result.assignee.id.toString()) : result.assignee
            // const projectPromise = this.getProject(result.project.id.toString())
            const queuePromise = result.queue && result.queue.id ? this.getQueue(result.queue.id) : result.queue
            const parentPromise = result.parent && result.parent.id ? this.getIssue(result.parent.id, false) : result.parent
            // const sprintPromise = this.getSprint(result.sprint.id.toString())

            result.updatedBy = await updatedByPromise
            result.followers = followersPromise ? await Promise.all(followersPromise) : result.followers
            result.createdBy = await createdByPromise
            result.assignee = await assigneePromise
            // result.project = await projectPromise
            result.queue = await queuePromise
            result.parent = await parentPromise
            // result.sprint = await sprintPromise
        } else {
            result.updatedBy = undefined
            result.followers = undefined
            result.createdBy = undefined
            result.assignee = undefined
            result.project = undefined
            result.queue = undefined
            result.parent = undefined
            result.sprint = undefined
        }


        return result
        return new Issue()
    }

    public async getQueue(queueID: string): Promise<Queue> {
        return new Queue()
    }

    public async getUser(userID: string): Promise<User> {
        const user = await this.yTAPI.requestUser(userID)

        return user as User
    }

    public async getTest() {

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