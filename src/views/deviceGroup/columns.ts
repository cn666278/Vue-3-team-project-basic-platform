import { h } from "vue";
import { NAvatar, NTag, NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
    {
        title: "业务名称",
        key: "name",
    },
    {
        title: "父级名称",
        key: "pName",
    },
    {
        title: "是否需授权",
        key: "needCheck",
        width: 120,
        render(row: { needCheck: any }) {
            return h(
                NTag,
                {
                    type: row.needCheck ? "success" : "error",
                    size: "small",
                },
                {
                    default: () => (row.needCheck ? "是" : "否"),
                }
            );
        },
    },
    {
        title: "排序",
        key: "sort",
        width: 80
    },
    {
        title: "是否启用",
        key: "isEnable",
        width: 80,
        render(row: { isEnable: any }) {
            return h(
                NTag,
                {
                    type: row.isEnable ? "success" : "error",
                    size: "small",
                },
                {
                    default: () => (row.isEnable ? "启用" : "禁用"),
                }
            );
        },
    },
    {
        title: "更新时间",
        key: "updateDate",
        width: 180,
        render(row: { updateDate: any }) {
            return formatDateTime(row.updateDate);
        },
    },
];