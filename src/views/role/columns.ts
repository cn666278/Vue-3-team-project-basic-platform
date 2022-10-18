import { h } from "vue";
import { NAvatar, NTag, NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
    {
        title: "角色名称",
        key: "name",
    },
    {
        title: "角色编码",
        key: "siteName",
    },
    {
        title: "是否启用",
        key: "isEnable",
        width: 100,
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
];
