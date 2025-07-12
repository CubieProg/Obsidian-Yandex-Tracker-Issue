
import { IUtilType } from "./IUtilType";

export class Version implements IUtilType {
    readonly self: string
    readonly id: string
    readonly key: string // Не используется
    readonly display: string
}