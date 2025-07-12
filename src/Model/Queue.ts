import { User } from './User'
import { IssueType } from './UtilTypes/IssueType'
import { Priority } from './UtilTypes/Priority'
import { Version } from './UtilTypes/Version'

export class Queue {
    readonly self: string
    readonly id: string
    readonly key: string
    readonly version: number
    readonly name: string
    readonly description: string
    readonly lead: User
    readonly assignAuto: boolean
    readonly defaultType: IssueType
    readonly defaultPriority: Priority
    readonly teamUsers: User[]
    readonly issueTypes: IssueType[]
    readonly versions: Version
    readonly workflows: IssueType[] // ???
    readonly denyVoting: boolean
    readonly issueTypesConfig: any[] // ConfigItem[]?

    public readonly mainField: string = "name"
}