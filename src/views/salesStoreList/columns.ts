import { h } from "vue";
import { formSearch } from "@/components/TableListTemplate";
import { FormSchema } from "@/components/Form";
import { DataTableColumn, NTag } from "naive-ui";
import { formatDateTime } from "@/utils/common";

// 搜索栏
export const searchColumns: formSearch[] = [
    {
        label: "关键字搜索",
        key: "name",
        value: "",
        type: "input",
    },
    // { 
    //     field: "name",
    //     label: "关键字搜索",
    //     component: "NInput",
    //     giProps: {
    //         span: 1,
    //     },
    // }
];

// 数据列表
export const tableColumn: DataTableColumn[] = [
    { title: "序列", key: "key", width: 120, align: "center" },
    { title: "名称", key: "name", width: 150 },
    { title: "电话", key: "phone", width: 150 },
    { title: "地址", key: "address", width: 150 },
    { title: "库存设备数量", key: "deviceCount", align: "center", width: 120 },
    {
        title: "是否启用",
        key: "isEnable",
        align: "center",
        width: 190,
        render: (row) => {
            return h(
                NTag,
                {
                    type: row.isEnable ? "success" : "info",
                    size: "small",
                },
                {
                    default: () => (row.isEnable ? "启用" : "未启用"),
                }
            );
        },
    },
    {
        title: "创建日期",
        key: "createDate",
        render: (row: any) => {
            return formatDateTime(row.createDate);
        },
    },
];

// 新增按钮表单
export const addEditForm: FormSchema[] = [
    {
        field: "id",
        label: "",
        giProps: {
            span: 0,
        },
    }, // id 用于添加逻辑，不可删除
    {
        field: "name",
        label: "名称",
        component: "NInput",
        giProps: { span: 2 },
        rules: [
            {
                required: true,
                message: "请输入名称",
                trigger: ["blur"],
            },
        ],
    },
    {
        field: "phone",
        label: "联系电话",
        component: "NInput",
        giProps: { span: 3 },
    },
    {
        field: "address",
        label: "地址",
        component: "NInput",
        giProps: { span: 3 },
    },
    {
        field: "memo",
        label: "备注",
        component: "NInput",
        componentProps: {
            type: "textarea", // Textarea 可扩展文本
            col: 3,
        },
        giProps: { span: 3 },
    },
    {
        field: "isEnable",
        label: "是否启用",
        component: "NSwitch", // 摁扭
        defaultValue: false,
        giProps: { span: 1 },
    },
];
