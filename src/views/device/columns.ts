import { h } from "vue";
import { NAvatar, NTag, NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
    {
        title: "设备名称",
        key: "name",
        width: 200,
    },
    {
        title: "设备号",
        key: "terminalNo",
        width: 130
    },
    {
        title: "类型名称",
        key: "deviceTypeName",
        width: 120,

    },
    {
        title: "车牌号",
        key: "carNumber",
        width: 150
    },
    {
        title: "业务分组",
        key: "businessGroupName",
        width: 150
    },
    {
        title: "手机号",
        key: "phone",
        width: 130
    },
    {
        title: "电量",
        key: "powerVal",
        width: 80
    },
    {
        title: "是否行驶",
        key: "isDrive",
        width: 80,
        render(row: { isDrive: any }) {
            return h(
                NTag,
                {
                    type: row.isDrive ? "success" : "error",
                    size: "small",
                },
                {
                    default: () => (row.isDrive ? "行驶中" : "未行驶"),
                }
            );
        },
    },
    {
        title: "是否在线",
        key: "isOnline",
        width: 80,
        render(row: { isOnline: any }) {
            return h(
                NTag,
                {
                    type: row.isOnline ? "success" : "error",
                    size: "small",
                },
                {
                    default: () => (row.isOnline ? "在线" : "未在线"),
                }
            );
        },
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
        title: "在线时间",
        key: "onlineDate",
        width: 160,
        render(row: { onlineDate: any }) {
            return formatDateTime(row.onlineDate);
        },
    },
    {
        title: "定位时间",
        key: "locationDate",
        width: 160,
        render(row: { locationDate: any }) {
            return formatDateTime(row.locationDate);
        },
    },
    {
        title: "创建日期",
        key: "createDate",
        width: 160,
        render(row: { createDate: any }) {
            return formatDateTime(row.createDate);
        },
    },
];