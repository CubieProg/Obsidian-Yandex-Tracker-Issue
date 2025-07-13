

export class User implements IYaTrDTO {

    public readonly DTOName: string = "User"

    public self: string
    public id: string
    public uid: number
    public login: string
    public trackerUid: number
    public passportUid: number
    public cloudUid: string
    public firstName: string
    public lastName: string
    public display: string
    public email: string
    public external: boolean
    public hasLicense: boolean
    public dismissed: boolean
    public useNewFilters: boolean
    public disableNotifications: boolean
    public firstLoginDate: string
    public lastLoginDate: string
    public welcomeMailSent: boolean

    
    public readonly mainField: string = "display"
}