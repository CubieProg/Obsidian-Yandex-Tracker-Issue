import { Project } from './Project'
import { Queue } from './Queue'
import { Sprint } from './Sprint'
import { User } from './User'
import { Priority } from './UtilTypes/Priority'
import { Status } from './UtilTypes/Status'
import { IssueType } from './UtilTypes/IssueType'
import { Board } from './Board'


export class Issue {

    // Base types
    public self: string
    public id: string
    public key: string
    public version: string
    public summary: string
    public aliases: string
    public description: string
    public votes: string
    public favorite: string
    public tags: string

    // TypeScript types
    public lastCommentUpdatedAt: Date
    public createdAt: Date
    public updatedAt: Date

    // Util types
    public status: Status
    public priority: Priority
    public previousStatus: Status
    public type: IssueType

    // Model types
    public boards: Board[] | undefined
    public updatedBy: User | undefined
    public followers: User[] | undefined
    public createdBy: User | undefined
    public assignee: User | undefined
    public project: Project | undefined
    public queue: Queue | undefined
    public parent: Issue | undefined
    public sprint: Sprint | undefined

    public readonly mainField: string = "summary"

    public static complexFiedls: Object = {
        "status": new Status(),
        "priority": new Priority(),
        "previousStatus": new Status(),
        "type": new IssueType(),
        "updatedBy": new User(),
        "followers": new Array<User>(),
        "createdBy": new User(),
        "assignee": new User(),
        "project": new Project(),
        "queue": new Queue(),
        "parent": new Issue(),
        "sprint": new Sprint()
    }

    public static alieses: Object = {
        // Base types
        "self": "Адрес ресурса",
        "id": "Hash-ID задачи",
        "key": "ID задачи",
        "version": "Версия",
        "summary": "Название",
        "aliases": "Альтернативные ключи",
        "description": "Описание",
        "votes": "Голоса",
        "favorite": "Избрана",
        "tags": "Тэги",

        // TypeScript types
        "lastCommentUpdatedAt": "Дата последнего комментария",
        "createdAt": "Дата создания",
        "updatedAt": "Дата обновления",

        // Util types
        "status": "Статус",
        "priority": "Приоритет",
        "previousStatus": "Предыдущий статус",
        "type": "Тип",

        // Model types
        "updatedBy": "Последний редактор",
        "followers": "Наблюдатели",
        "createdBy": "Созатель",
        "assignee": "Исполнитель",
        "project": "Проект",
        "queue": "Очередь",
        "parent": "Родеительская задача",
        "sprint": "Спринт",
    }
}