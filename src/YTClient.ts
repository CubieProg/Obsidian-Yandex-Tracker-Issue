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
import { Type } from "typescript";


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

    private isComplexField(attr: string, complexFiedls: Array<string> | "none" | "all") {
        if (complexFiedls === "none") { return false }
        if (complexFiedls === "all") { return true }
        return complexFiedls.contains(attr)
    }

    private requestIfNeed(
        baseObject: object,
        attrName: string,
        complexFields: Array<string> | "none" | "all",
        dtoType: any
    ) {
        const condition = this.isComplexField(attrName, complexFields) &&
            baseObject[attrName] &&
            baseObject[attrName]['id']

        if (!condition) { return baseObject[attrName] }

        const fieldName = dtoType['complexFiedls'][attrName].DTOName
        return this[`get${fieldName}`](baseObject[attrName]['id'].toString())
    }



    public async getBoard(
        boardId: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Board> {
        const board = (await this.yTAPI.requestBoard(boardId)) as Board

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in Board.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(board, key, complexFields, Board)
            }

            for (let key in promiseObject) {
                board[key] = await promiseObject[key]
            }
        } else {
            for (let key in Board.complexFiedls) {
                board[key] = undefined
            }
        }

        return board
    }

    public async getIssue(
        issueID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Issue> {
        const issue = (await this.yTAPI.requestIssue(issueID)) as Issue

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in Issue.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(issue, key, complexFields, Issue)
            }

            for (let key in promiseObject) {
                issue[key] = await promiseObject[key]
            }
        } else {
            for (let key in Issue.complexFiedls) {
                issue[key] = undefined
            }
        }

        return issue
    }

    public async getSprint(
        sprintID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Sprint> {
        const sprint = (await this.yTAPI.requestSprint(sprintID)) as Sprint

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in Sprint.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(sprint, key, complexFields, Sprint)
            }

            for (let key in promiseObject) {
                sprint[key] = await promiseObject[key]
            }
        } else {
            for (let key in Sprint.complexFiedls) {
                sprint[key] = undefined
            }
        }

        return sprint
    }


    public async getProject(
        projectID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Project> {
        const project = (await this.yTAPI.requestProject(projectID)) as Project

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in Project.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(project, key, complexFields, Project)
            }

            for (let key in promiseObject) {
                project[key] = await promiseObject[key]
            }
        } else {
            for (let key in Project.complexFiedls) {
                project[key] = undefined
            }
        }

        return project
    }

    public async getQueue(
        queueID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Queue> {
        const queue = (await this.yTAPI.requestQueue(queueID)) as Queue

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in Queue.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(queue, key, complexFields, Queue)
            }

            for (let key in promiseObject) {
                queue[key] = await promiseObject[key]
            }
        } else {
            for (let key in Queue.complexFiedls) {
                queue[key] = undefined
            }
        }

        return queue
    }

    public async getUser(
        userID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<User> {

        const user = (await this.yTAPI.requestUser(userID)) as User

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in User.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(user, key, complexFields, User)
            }

            for (let key in promiseObject) {
                user[key] = await promiseObject[key]
            }
        } else {
            for (let key in User.complexFiedls) {
                user[key] = undefined
            }
        }

        return user
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