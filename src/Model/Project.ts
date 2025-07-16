import { User } from "./User"
import { IYaTrDTO } from './UtilTypes/IYaTrDTO'

export class Project implements IYaTrDTO {

    public readonly DTOName: string = "Project"
    public readonly DTOType: any = Project

    public description: string
    public key: string
    public name: string
    public self: string
    public status: string
    public id: number
    public version: number

    public startDate: Date
    public endDate: Date

    public lead: User


    public readonly mainField: string = "name"


    public static complexFiedls: Object = {
        "lead": new User()
    }

    public static aliases: Object = {
        // Base types
        "description": "Описание",
        "key": "Название",
        "name": "Название",
        "self": "Адрес ресурса",
        "status": "Статус",
        "id": "ID проекта",
        "version": "Версия",

        // TypeScript types
        "startDate": "Дата начала",
        "endDate": "Дата окончания",

        // Model types
        "lead": "Руководитель",
    }
}
