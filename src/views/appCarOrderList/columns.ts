import { h } from "vue";
import { formSearch } from "@/components/TableListTemplate";
import { FormSchema } from "@/components/Form";
import { DataTableColumn, NTag } from "naive-ui";
import { formatDateTime } from "@/utils/common";

// 搜索栏
export const searchColumns: formSearch[] = [
    {
        label: "关键字搜索",
        key: "name", // 订单号、设备号搜索
        value: "",
        type: "input",
    },
    {
        label: "名称搜索",
        key: "memberName", // 名称、手机号、账号搜索 ?? ERROR
        value: "",
        type: "input",
    },
];

// 数据列表
export const tableColumn: DataTableColumn[] = [
    { title: "序号", key: "key", width: 70, align: "center" },
    { title: "订单号", key: "orderNo", width: 150 },
    { title: "名称", key: "name", width: 150 },
    { title: "商品名称", key: "commodityName", width: 150 },
    { 
        title: "头像",
        key: "memberImg",
        width: 70,
        render: (row: any) => {
            return h('img',
              {
                src: row.memberImg,
                style: 'width: 35px; hegiht: 35px; border-radius: 50%'
              },
              { defaut: () => '' } // 默认值
            )
        },
    },
    { title: "用户", key: "memberNick", width: 150 },
    { title: "手机号", key: "memberPhone", width: 120 },
    {
        title: "状态",
        key: "status",
        align: "center",
        width: 80,
        render: (row) => {
            return h(
                NTag,
                {
                    type: row.eStatusName == "待支付" ? "error" : "primary", // 可增加颜色
                    size: "small",
                },
                {
                    default: () => (row.eStatusName), // 缺少：已支付，已退款
                }
            );
        },
    },
    {
        title: "是否启用",
        key: "isEnable",
        align: "center",
        width: 100,
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
        title: "下单时间",
        key: "createDate",
        render: (row: any) => {
            return formatDateTime(row.createDate);
        },
    },
];

// 退款表单
export const addEditForm: FormSchema[] = [
    { 
      field: "id",
      label: "name",
      giProps: { span: 0 },
    }, // id 用于添加逻辑，不可删除
    {
        field: "refund",
        label: "退款金额",
        component: "NInput",
        componentProps: {
          placeholder: "0.00 元",
        },
        giProps: { span: 3 },
    },
    {
        field: "reason", 
        label: "退款原因",
        component: "NInput",
        giProps: { span: 3 },
        componentProps: {
            type: "textarea",
            col: 3,
        },
        rules: [
            {
                required: true,
                message: "请输入退款原因",
                trigger: ["blur"],
            },
        ],
    },
];
