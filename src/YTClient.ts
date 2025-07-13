import { Notice } from "obsidian";
import { isFail, YTAPI } from "./API/YTAPI";
import { SettingsData } from "./Settings/Settings";
import { FailResponse } from "./API/APIBase";

import { Board } from "./Model/Board";
import { Issue } from "./Model/Issue";
import { Queue } from "./Model/Queue";
import { User } from "./Model/User";
import { Sprint } from "./Model/Sprint";
import { Project } from "./Model/Project";


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
        const issue = (await this.yTAPI.requestIssue(issueID)) as Issue

        if (deep) {
            const updatedByPromise = issue.updatedBy && issue.updatedBy.id ? this.getUser(issue.updatedBy.id.toString()) : issue.updatedBy
            const followersPromise = issue.followers ? issue.followers.filter(value => value.id).map(value => this.getUser(value.id.toString())) : issue.followers
            const createdByPromise = issue.createdBy && issue.createdBy.id ? this.getUser(issue.createdBy.id.toString()) : issue.createdBy
            const assigneePromise = issue.assignee && issue.assignee.id ? this.getUser(issue.assignee.id.toString()) : issue.assignee
            const projectPromise = issue.project && issue.project.id ? this.getProject(issue.project.id.toString()) : issue.project
            const queuePromise = issue.queue && issue.queue.id ? this.getQueue(issue.queue.id.toString()) : issue.queue
            const parentPromise = issue.parent && issue.parent.id ? this.getIssue(issue.parent.id.toString(), false) : issue.parent
            const sprintPromise = issue.sprint && issue.sprint.id ? this.getSprint(issue.sprint.id.toString(), false) : issue.sprint

            issue.updatedBy = await updatedByPromise
            issue.followers = followersPromise ? await Promise.all(followersPromise) : issue.followers
            issue.createdBy = await createdByPromise
            issue.assignee = await assigneePromise
            issue.project = await projectPromise
            issue.queue = await queuePromise
            issue.parent = await parentPromise
            issue.sprint = await sprintPromise
        } else {
            issue.updatedBy = undefined
            issue.followers = undefined
            issue.createdBy = undefined
            issue.assignee = undefined
            issue.project = undefined
            issue.queue = undefined
            issue.parent = undefined
            issue.sprint = undefined
        }

        console.log(issue)

        return issue
    }

    public async getSprint(sprintID: string, deep: boolean = true) {
        const sprint = await this.yTAPI.requestSprint(sprintID)

        return sprint as Sprint
    }


    public async getProject(projectID: string, deep: boolean = true) {
        const project = await this.yTAPI.requestProject(projectID)

        return project as Project
    }

    public async getQueue(queueID: string, deep: boolean = true): Promise<Queue> {
        const queue = await this.yTAPI.requestQueue(queueID)

        return queue as Queue
    }

    public async getUser(userID: string, deep: boolean = true): Promise<User> {
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