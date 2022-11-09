import { h } from "vue";
import { formSearch } from "@/components/TableListTemplate";
import { FormSchema } from "@/components/Form";
import { DataTableColumn, NTag } from "naive-ui";

// 搜索栏
export const searchColumns: formSearch[] = [
    {
        label: "关键字搜索",
        key: "name",
        value: "",
        type: "input",
    },
    // {
    //     label: "是否启用",
    //     key: "isEnable",
    //     value: "null",
    //     type: "select",
    //     props: {
    //         options: [
    //             { label: "全部", value: "null" }, 
    //             { label: "已启用", value: "true" },
    //             { label: "未启用", value: "false" },
    //         ],
    //     },
    // },
];

// 数据列表
export const tableColumn: DataTableColumn[] = [
    { title: "序列", key: "key", width: 120, align: "center" },
    { title: "商品名称", key: "name", width: 150 },
    { title: "追加有效天数", key: "dayVal", width: 150 },
    { title: "价格(元)", key: "price", width: 100 },
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
    { title: "备注", key: "memo" },
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
        giProps: { span: 3 },
        rules: [
            {
                required: true,
                message: "请输入商品名称",
                trigger: ["blur"],
            },
        ],
    },
    {
        field: "dayVal", 
        label: "追加有效天数",
        component: "NInput",
        componentProps: {
          placeholder: "0",
        },
        giProps: { span: 3 },
    },
    {
        field: "price",
        label: "价格",
        component: "NInput",
        componentProps: {
          placeholder: "0.00 元",
        },
        giProps: { span: 3 },
    },
    {
      field: "sort",
      label: "排序",
      component: "NInput",
      componentProps: {
        placeholder: "0",
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
];
