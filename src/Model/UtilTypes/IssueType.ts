import { IUtilType } from "./IUtilType";

export class IssueType implements IUtilType {
    
    readonly self: string
    readonly id: string
    readonly key: string
    readonly display: string

    public readonly mainField: string = "display"
}