declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
};
declare type Indexable<T = any> = {
    [key: string]: T;
};