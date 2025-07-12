
import { IUtilType } from "./IUtilType";

export class Column implements IUtilType {
    
    readonly self: string
    readonly id: string
    readonly key: string // Не используется
    readonly display: string

}