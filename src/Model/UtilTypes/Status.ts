
import { IUtilType } from "./IUtilType";

export class Status implements IUtilType {
    
    readonly self: string
    readonly id: string
    readonly key: string
    readonly display: string

    public readonly mainField: string = "display"
}