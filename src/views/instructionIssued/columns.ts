import { h } from "vue";
import { formatDateTime } from "@/utils/common";
import { formSearch } from "@/components/TableListTemplate";
import { DataTableColumn, NTag } from "naive-ui";
export const searchColumns: formSearch[] = [
    { label: "设备号", key: "terminalNo", value: "", type: "input" },
    {
        label: "是否下发",
        key: "isSend",
        value: "null",
        type: "select",
        props: {
            options: [
                { label: "全部", value: "null" },
                { label: "是", value: "true" },
                { label: "否", value: "false" },
            ],
        },
    },
];
// export const tableColumn: DataTableColumn[] = [
//     { title: "序列", key: "key", width: 90, align: "center" },
//     { title: "设备号", key: "terminalNo" },
//     { title: "下发指令内容", key: "commandText" },
//     {
//         title: "是否下发",
//         key: "isSend",
//         align: "center",
//         render: (row) => {
//             return h(
//                 NTag,
//                 {
//                     type: row.isEnable ? "success" : "info",
//                     size: "small",
//                 },
//                 {
//                     default: () => (row.isEnable ? "是" : "否"),
//                 }
//             );
//         },
//     },
//     {
//         title: "下发时间",
//         key: "sendDate",
//         render: (row) => formatDateTime(row.sendDate as string),
//     },
//     {
//         title: "创建日期",
//         key: "createDate",
//         render: (row) => formatDateTime(row.createDate as string),
//     },
//     { title: "操作人", key: "memberName" },
// ];
