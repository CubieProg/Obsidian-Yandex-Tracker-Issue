import { User } from './User'
import { Column } from './UtilTypes/Column'

export class Board implements IYaTrDTO {

    public readonly DTOName: string = "Board"

    readonly self: string
    readonly id: string
    readonly version: string
    readonly name: string
    readonly columns: Column[]
    readonly filter: string
    readonly orderBy: string
    readonly orderAsc: string
    readonly query: string
    readonly useRanking: string
    readonly estimateBy: string
    readonly country: string
    readonly defaultQueue: string
    readonly calendar: string
}