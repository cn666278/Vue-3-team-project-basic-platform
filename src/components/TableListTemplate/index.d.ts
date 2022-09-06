import { DataTableColumn } from "naive-ui";

declare module 'naive' {
    export interface formTableColumns extends DataTableColumn {
        title: string;
        key: string;
        type?: 'default' | 'tag' | 'button';
    }
}
export interface formSearch {
    label: string;
    key: string;
    value: any;
    type: 'input' | 'select' | 'dateTime';
}
export interface formTable<T = any> {
    data: T;
    columns: formTableColumns[];
}
