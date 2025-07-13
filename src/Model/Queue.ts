import { User } from './User'
import { IssueType } from './UtilTypes/IssueType'
import { Priority } from './UtilTypes/Priority'
import { Version } from './UtilTypes/Version'
import { IYaTrDTO } from './UtilTypes/IYaTrDTO'

export class Queue implements IYaTrDTO {

    public readonly DTOName: string = "Queue"
    public readonly DTOType: any = Queue

    public self: string
    public id: string
    public key: string
    public name: string
    public description: string

    public version: number
    public assignAuto: boolean
    public denyVoting: boolean

    public defaultType: IssueType
    public issueTypes: IssueType[]
    public workflows: IssueType[] // ???
    public defaultPriority: Priority
    public issueTypesConfig: any[] // ConfigItem[]?

    public lead: User
    public teamUsers: User[]

    public readonly mainField: string = "name"

    public static complexFiedls: Object = {
        "lead": new User(),
    }

    public static aliases: Object = {
        "self": "Адрес ресурса",
        "id": "Hash-ID очереди",
        "key": "ID очереди",
        "name": "Название",
        "description": "Описание",

        "version": "Версия",
        "assignAuto": "Автоназначение исполнителя",
        "denyVoting": "Можно голосовать",

        "defaultType": "Тип задач по умолчанию",
        "issueTypes": "Типы задач",
        "workflows": "Жизненные циклы",
        "defaultPriority": "Приоритет по умолчанию",
        "issueTypesConfig": "Настройки типов задач",

        "lead": "Руководитель",
        "teamUsers": "Команда",
    }
}