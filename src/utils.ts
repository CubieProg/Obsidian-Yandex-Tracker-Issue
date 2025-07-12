

// export class DateTime

export class linkVariable {
    public value: any
    constructor(value: any) {
        this.value = value
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}


export function isTypeOf<T>(jsonObject: Object, instanceType: { new(): T; }): boolean {
    try {
        // Check that all the properties of the JSON Object are also available in the Class.
        const instanceObject = new instanceType();
        for (let propertyName in instanceObject) {
            if (!jsonObject.hasOwnProperty(propertyName)) {
                // If any property in instance object is missing then we have a mismatch.
                return false;
            }
        }
        // All the properties are matching between object and the instance type.
        return true;
    } catch {
        return false;
    }
};



export function isTypeOfObj<T>(jsonObject: Object, instanceType: Object): boolean {
    try {
        for (let propertyName in instanceType) {
            if (!jsonObject.hasOwnProperty(propertyName)) {
                return false;
            }
        }
        return true;
    } catch {
        return false;
    }
};