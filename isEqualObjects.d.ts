export interface isEqualObjectsContext {
    comparator?: (obj1: any, obj2: any)=> boolean|undefined
}

export interface isEqualObjects {
    (this: isEqualObjectsContext, ...objects: any): boolean,
    plainObject: Symbol
}

export interface cloneObject {
    (obj: any): any
}
