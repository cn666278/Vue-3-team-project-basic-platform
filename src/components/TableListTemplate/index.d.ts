import { DataTableColumn } from "naive-ui";
import type { SearchColumns } from '@/components/tableSearch';
export type { PaginationType } from "@/components/pagination/index";
declare module 'naive' {
    export interface formTableColumns extends DataTableColumn {
        title: string;
        key: string;
        type?: 'default' | 'tag' | 'button';
    }
}
export interface formSearch extends SearchColumns {}
export interface formTable<T = any> {
    data: T;
    columns: formTableColumns[];
}
