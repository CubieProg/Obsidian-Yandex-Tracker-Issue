import { User } from "./User"

export class Project {

    public description: string
    public key: string
    public name: string
    public self: string
    public status: string
    public id: number
    public version: number

    public endDate: Date

    public lead: User


    public readonly mainField: string = "name"


    public static complexFiedls: Object = {
        "lead": new User()
    }

    public static alieses: Object = {
        // Base types
        "description": "Описание",
        "key": "Название",
        "name": "Название",
        "self": "Адрес ресурса",
        "status": "Статус",
        "id": "ID проекта",
        "version": "Версия",

        // TypeScript types
        "endDate": "Дата окончания",

        // Model types
        "lead": "Руководитель",
    }
}
