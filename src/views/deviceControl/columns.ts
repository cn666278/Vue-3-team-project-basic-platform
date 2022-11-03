import { h } from "vue";
import { formatDateTime } from "@/utils/common";
import {
    formSearch,
} from "@/components/TableListTemplate";
import { DataTableColumn, NTag } from "naive-ui";
export const searchColumns: formSearch[] = [
    {
        label: "设备类型",
        key: "deviceTypeCode",
        value: "lock",
        type: "select",
        props: {
            options: [
                { label: "全部", value: "null" },
                { label: "电子锁", value: "lock" },
                { label: "定位灯", value: "C902" },
            ],
        },
    },
];
export const tableColumn: DataTableColumn[] = [
    { title: "序列", key: "key", width: 90, align: "center" },
    { title: "设备号", key: "terminalNo" },
    { title: "业务分组", key: "businessGroupName" },
    {
        title: "是否在线",
        key: "isOnline",
        align: "center",
        render: (row) => {
            return h(
                NTag,
                {
                    type: row.isDefault ? "success" : "info",
                    size: "small",
                },
                {
                    default: () => (row.isDefault ? "是" : "否"),
                }
            );
        },
    },
    {
        title: "在线时间",
        key: "onlineDate",
        render: (row) => {
            return formatDateTime(row.onlineDate as string);
        },
    },
];