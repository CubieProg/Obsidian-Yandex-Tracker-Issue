import { Board } from "./Board"
import { User } from "./User"

export class Sprint implements IYaTrDTO {

    public readonly DTOName: string = "Sprint"
    public readonly DTOType: any = Sprint

    public name: string
    public self: string
    public status: string
    public version: number
    public id: number
    public archived: boolean

    public endDate: Date
    public endDateTime: Date
    public startDate: Date
    public startDateTime: Date
    public createdAt: Date

    public createdBy: User
    public board: Board

    public readonly mainField: string = "name"


    public static complexFiedls: Object = {
        "createdBy": new User(),
        "board": new Board(),
    }

    public static aliases: Object = {
        // Base types
        "name": "Название",
        "self": "Адрес ресурса",
        "status": "Статус",
        "version": "Версия",
        "id": "ID Спринта",
        "archived": "Архивирован",

        // TypeScript types
        "endDate": "Дата окончания",
        "endDateTime": "Дата окончания",
        "startDate": "Дата начала",
        "startDateTime": "Дата начала",
        "createdAt": "Дата создания",

        // Model types
        "createdBy": "Создатель",
        "board": "Доска"
    }
}