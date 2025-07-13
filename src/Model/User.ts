
import { IYaTrDTO } from './UtilTypes/IYaTrDTO'

export class User implements IYaTrDTO {

    public readonly DTOName: string = "User"
    public readonly DTOType: any = User

    public self: string
    public id: string
    public login: string
    public cloudUid: string
    public firstName: string
    public lastName: string
    public display: string
    public email: string
    public firstLoginDate: string
    public lastLoginDate: string

    public uid: number
    public trackerUid: number
    public passportUid: number

    public external: boolean
    public hasLicense: boolean
    public dismissed: boolean
    public useNewFilters: boolean
    public disableNotifications: boolean
    public welcomeMailSent: boolean


    public readonly mainField: string = "display"

    public static complexFiedls: Object = {}

    public static aliases: Object = {
        // Base types
        "self": "Адрес ресурса",
        "id": "Hash-ID пользователя",
        "login": "Логин",
        "cloudUid": "Cloud ID",
        "firstName": "Имя",
        "lastName": "Фамилия",
        "display": "Имя",
        "email": "email",
        "firstLoginDate": "Дата первого входа",
        "lastLoginDate": "Дата последнего входа",

        "uid": "uid",
        "trackerUid": "trackerUid",
        "passportUid": "passportUid",

        "external": "external",
        "hasLicense": "hasLicense",
        "dismissed": "dismissed",
        "useNewFilters": "useNewFilters",
        "disableNotifications": "disableNotifications",
        "welcomeMailSent": "welcomeMailSent",
    }
}