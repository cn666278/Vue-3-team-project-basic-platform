import { h } from "vue";
import { formatDateTime, transformTozTreeFormat } from "@/utils/common";
import { getBusinessGroupList } from "@/api/businessGroup";
import { getMapFenceTree } from '@/api/mapFence';
import { formSearch } from "@/components/TableListTemplate";
import { FormSchema } from "@/components/Form";
import { DataTableColumn, NTag } from "naive-ui";

export const searchColumns: formSearch[] = [
    {
        label: "关键字搜索",
        key: "name",
        value: "",
        type: "input",
    },
    {
        label: "是否启用",
        key: "isEnable",
        value: "null",
        type: "select",
        props: {
            options: [
                { label: "全部", value: "null" },
                { label: "已启用", value: "true" },
                { label: "未启用", value: "false" },
            ],
        },
    },
];

export const tableColumn: DataTableColumn[] = [
    { title: "序列", key: "key", width: 90, align: "center" },
    { title: "名称", key: "name" },
    { title: "业务分组数量", key: "businessGroupCount" },
    { title: "电子围栏数量", key: "mapFenceCount" },
    {
        title: "是否启用",
        key: "isEnable",
        align: "center",
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
    {
        title: "更新时间",
        key: "create",
        render: (row) => formatDateTime(row.create as string),
    },
];
const groupTreeData = [{
    id: '',
    name: '无父级',
    children: transformTozTreeFormat((await getBusinessGroupList({
            name: '',
            currentPage: 1,
            pageSize: 9999,
        })).Data.data)
}];
const fenceTreeData = (await getMapFenceTree({isEnable: true})).Data;
export const addEditForm: FormSchema[] = [
    {
        field: "id",
        label: "",
        giProps: {
            span: 0,
        },
    },
    {
        field: "name",
        label: "名称",
        component: "NInput",
        giProps: { span: 3 },
        rules: [
            {
                required: true,
                message: "请输入业务订阅名称",
                trigger: ["blur"],
            },
        ],
    },
    {
        field: "deviceOnLineUrl",
        label: "设备上下线Url",
        component: "NInput",
        giProps: { span: 3 },
    },
    {
        field: "deviceOnLineParam",
        label: "设备上下线参数",
        component: "NInput",
        giProps: { span: 3 },
    },
    {
        field: "mapFenceRecordUrl",
        label: "电子围栏进出",
        component: "NInput",
        giProps: { span: 3 },
    },
    {
        field: "mapFenceRecordParam",
        label: "电子围栏进出参数",
        component: "NInput",
        componentProps: {
            type: "textarea",
            col: 3,
        },
        giProps: { span: 3 },
    },
    {
        field: "businessGroupIdList",
        label: "业务分组",
        component: "NTreeSelect",
        componentProps: {
            keyField: 'id',
            labelField: "name",
            placeholder: '请选择业务分组',
            options: groupTreeData,
            defaultExpandAll: true,
            virtualScroll: false,
            multiple: true,
            cascade: true,
            checkable: true,
        },
        giProps: { span: 3 },
    },
    {
        field: "mapFenceIdList",
        label: "电子围栏",
        component: "NTreeSelect",
        componentProps: {
            keyField: 'id',
            labelField: "name",
            placeholder: '请选择电子围栏',
            options: fenceTreeData,
            defaultExpandAll: true,
            virtualScroll: false,
            multiple: true,
            cascade: true,
            checkable: true,
        },
        giProps: { span: 3 },
    },
    {
        field: "allBusinessGroup",
        label: "全部业务分组",
        component: "NSwitch",
        defaultValue: false,
        giProps: { span: 1 },
    },
    {
        field: "allMapFence",
        label: "全部电子围栏",
        component: "NSwitch",
        defaultValue: false,
        giProps: { span: 1 },
    },
    {
        field: "isEnable",
        label: "是否启用",
        component: "NSwitch",
        defaultValue: false,
        giProps: { span: 1 },
    },
    {
        field: "memo",
        label: "备注",
        component: "NInput",
        componentProps: {
            type: "textarea",
            col: 3,
        },
        giProps: { span: 3 },
    },
];
