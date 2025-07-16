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
import { IYaTrDTO } from "./Model/UtilTypes/IYaTrDTO";


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

    private async GenericRequest<T>(
        entityId: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none",
        entityClass: { new(): T }
    ): Promise<T> {
        const instance: T = new entityClass()
        const iinstance: IYaTrDTO = instance as IYaTrDTO
        const className: string = (instance as IYaTrDTO).DTOName
        const entity = (await this.yTAPI[`request${className}`](entityId)) as T

        if (deep && complexFields !== "none") {
            let promiseObject = new Object()

            for (let key in iinstance.DTOType.complexFiedls) {
                promiseObject[key] = this.requestIfNeed(entity as Object, key, complexFields, iinstance.DTOType)
            }

            for (let key in promiseObject) {
                entity[key] = await promiseObject[key]
            }
        } else {
            for (let key in iinstance.DTOType.complexFiedls) {
                entity[key] = undefined
            }
        }

        return entity
    }



    public async getBoard(
        boardId: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Board> {
        return this.GenericRequest(boardId, deep, complexFields, Board)
    }

    public async getIssue(
        issueID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Issue> {
        return this.GenericRequest(issueID, deep, complexFields, Issue)
    }

    public async getSprint(
        sprintID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Sprint> {
        return this.GenericRequest(sprintID, deep, complexFields, Sprint)
    }


    public async getProject(
        projectID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Project> {
        return this.GenericRequest(projectID, deep, complexFields, Project)
    }

    public async getQueue(
        queueID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<Queue> {
        return this.GenericRequest(queueID, deep, complexFields, Queue)
    }

    public async getUser(
        userID: string,
        deep: boolean = true,
        complexFields: Array<string> | "none" | "all" = "none"
    ): Promise<User> {
        return this.GenericRequest(userID, deep, complexFields, User)
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


    public async getQuery(
        query: string,
    ): Promise<Issue[]> {
        return (await this.yTAPI.requestQuery({ "query": query })) as Issue[]
    }
}