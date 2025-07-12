import { Project } from './Project'
import { Queue } from './Queue'
import { Sprint } from './Sprint'
import { User } from './User'
import { Priority } from './UtilTypes/Priority'
import { Status } from './UtilTypes/Status'
import { IssueType } from './UtilTypes/IssueType'


export class Issue {

    // private issueId: string;
    // private name: string;
    // private startDate: string;
    // private endDate: string;
    // private assighnee: User;
    // private status: string; // class status { name: string; image: IMG }


    private self: string
    private id: string
    private key: string
    private version: string
    private lastCommentUpdatedAt: Date
    private summary: string
    private parent: Issue
    private aliases: string
    private updatedBy: User
    private description: string
    private sprint: Sprint
    private type: IssueType
    private priority: Priority
    private createdAt: Date
    private followers: User[]
    private createdBy: User
    private votes: string
    private assignee: User
    private project: Project
    private queue: Queue
    private updatedAt: Date
    private status: Status
    private previousStatus: Status
    private favorite: string
    private tags: string


    public static table_columns: string[] = [
        "ID задачи",
        "Название",
        "Дата начала",
        "Дата окончания",
        "Исполнитель",
        "Статус"
    ]

    constructor() {

    }



}