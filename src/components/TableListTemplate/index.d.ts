import { DataTableColumn } from "naive-ui";
import { Ref } from "vue";

declare module 'naive' {
    export interface formTableColumns extends DataTableColumn {
        title: string;
        key: string;
        type?: 'default' | 'tag' | 'button';
    }
}
interface formSearch {
    label: string;
    key: string;
    value: any;
    type: 'input' | 'select' | 'dateTime';
}
interface formTable<T = any> {
    data: T;
    columns: formTableColumns[];
}
interface formTableColumns extends DataTableColumn {
    title: string;
    key: string;
    type?: 'default' | 'tag' | 'button';
    value?: string;
    tagSuccessValue?: string;
    tagErrorValue?: string;
    onClick?: Function;
}