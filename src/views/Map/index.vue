<template>
    <div>
        <TableListTemplate>
            <template #operate>
                <n-button text @click="onAddEditModal()">
                    <n-icon :size="22">
                        <AppstoreAddOutlined />
                    </n-icon>
                    新增
                </n-button>
            </template>
            <template #search>
                <table-search
                    :columns="search"
                    @get-table-data="onSearch"
                />
            </template>
            <template #table>
                <form-table
                    :columns="columns"
                    :data="tableData"
                    striped
                ></form-table>
            </template>
            <template #page>
                <pagination
                    :current-page="pageOption?.currentPage"
                    :page-size="pageOption?.pageSize"
                    :total-page="pageOption?.totalPage"
                    :total-count="pageOption?.totalCount"
                    @page-change="pageHandle"
                    @page-size-change="pageSizeHandle"
                />
            </template>
            <template #modal>
                <Dialog
                    v-model:showModal="showAddEdit"
                    :option="dialogOption"
                    width="650px"
                    @close="onAddEditClose"
                    @confirm="onAddEditConfirm"
                >
                    <BasicForm
                        @register="addRegister"
                        @submit="onAddEditSubmit"
                    >
                        <template #mapParamList="{ model, field }">
                            <n-dynamic-input
                                v-model:value="model[field]"
                                @create="onMapParamAdd"
                            >
                                <template #default="{ value }">
                                    <n-space>
                                        <n-input
                                            v-model:value="value.name"
                                            placeholder="请输入参数名"
                                        />
                                        <n-input
                                            v-model:value="value.val"
                                            placeholder="请输入参数值"
                                        />
                                    </n-space>
                                </template>
                            </n-dynamic-input>
                        </template>
                    </BasicForm>
                </Dialog>
            </template>
        </TableListTemplate>
    </div>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { NTag, NButton, DataTableColumn } from "naive-ui";
import { AppstoreAddOutlined } from "@vicons/antd";
import { TableListTemplate, formSearch, tableSearch, formTable, Dialog, pagination, PaginationType } from "@/components/TableListTemplate";
// import page from "@/components/pagination/index.vue";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { getMapList, getMapInfo, addMap, updateMap } from "@/api/map";
import { getEnumType } from "@/api/login";
import Pagination from "@/components/pagination/index.vue";
const searchData = ref<defaultType.requestList>({});
const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 20,
});
const tableData = ref<map.mapList[]>([]);
const showAddEdit = ref(false);
const addEditTitle = ref("新增地图");
const dialogOption = ref({
    ConfirmBtnText: "提交",
    title: addEditTitle,
});
const coordinateTypeList = ref<login.enumType[]>([]);
/**获取表单数据 */
const getTableData = async (jsonData?: defaultType.requestList) => {
    if (jsonData) {
        jsonData.currentPage = pageOption.value?.currentPage;
        jsonData.pageSize = pageOption.value?.pageSize;
        searchData.value = jsonData;
    }
    const Data = (
        await getMapList(jsonData ? jsonData : { ...pageOption.value })
    ).Data;
    tableData.value = Data.data;
    let pageData: PaginationType = {
        currentPage: Data.currentPage,
        pageSize: Data.pageSize,
        totalCount: Data.totalCount,
        totalPage: Data.totalPage,
    };
    pageOption.value = pageData;
    return Data.data;
};
const onSearch = () => {
    pageOption.value.currentPage = 1;
    getTableData();
};
/**获取坐标系枚举 */
const getCoordinateType = async () => {
    coordinateTypeList.value = (await getEnumType("ECoordinateType")).Data;
};
/**分页页数监听 */
const pageHandle = (page: number) => {
    pageOption.value.currentPage = page;
    getTableData();
};
/**每页页数监听 */
const pageSizeHandle = (pageSize: number) => {
    pageOption.value.currentPage = 1;
    pageOption.value.pageSize = pageSize;
    getTableData();
};
onSearch();
getCoordinateType();
/**表格格式 */
const columns: DataTableColumn[] = [
    {
        title: "地图名称",
        key: "name",
    },
    {
        title: "坐标系类型",
        key: "coordinateTypeName",
    },
    {
        title: "是否默认",
        key: "isDefault",
        render(row) {
            return h(
                NTag,
                {
                    style: { margin: "5px" },
                    type: row.isDefault ? "success" : "error",
                },
                {
                    default: () => (row.isDefault ? "已默认" : "未默认"),
                }
            );
        },
    },
    {
        title: "是否启用",
        key: "isEnable",
        render(row) {
            return h(
                NTag,
                {
                    style: { margin: "5px" },
                    type: row.isEnable ? "success" : "error",
                },
                {
                    default: () => (row.isEnable ? "启用" : "禁用"),
                }
            );
        },
    },
    {
        title: '操作',
        key: '',
        render(row) {
            return h(
                NButton,
                {
                    type: "info",
                    dashed: true,
                    size: "small",
                    onClick: () => onAddEditModal(row.id as string)
                },
                {
                    default: () => "编辑"
                }
            );
        },
    }
];
/**搜索 */
const search = ref<formSearch[]>([
    {
        label: "关键字搜索",
        key: "name",
        value: "",
        type: "input",
    },
]);
/**表单列 */
const addEditForm: FormSchema[] = [
    {
        field: "id",
        label: "",
        giProps: {
            span: 0,
        },
    },
    {
        field: "name",
        label: "地图名称",
        component: "NInput",
        componentProps: {
            placeholder: "请输入地图名称",
        },
        giProps: { span: 3 },
        rules: [
            { required: true, message: "请输入地图名称", trigger: ["blur"] },
        ],
    },
    {
        field: "code",
        label: "地图标识",
        component: "NInput",
        componentProps: {
            placeholder: "请输入地图标识",
        },
        giProps: { span: 3 },
        rules: [
            { required: true, message: "请输入地图标识", trigger: ["blur"] },
        ],
    },
    {
        field: "coordinateType",
        label: "坐标系类型",
        defaultValue: 0,
        component: "NSelect",
        componentProps: {
            labelField: "text",
            valueField: "id",
            options: coordinateTypeList,
        },
        giProps: {
            span: 3,
        },
    },
    {
        field: "isEnable",
        label: "是否启用",
        component: "NSwitch",
    },
    {
        field: "isDefault",
        label: "是否默认",
        component: "NSwitch",
    },
    {
        field: "memo",
        label: "备注",
        component: "NInput",
        componentProps: {
            type: "textarea",
            autoSize: true,
        },
        giProps: {
            span: 3,
        },
    },
    {
        field: "paramList",
        label: "地图参数",
        defaultValue: [
            {
                name: "",
                val: "",
            },
        ],
        slot: "mapParamList",
        giProps: {
            span: 3,
        },
    },
];
/**增删改查表单 */
const [addRegister, { setFieldsValue, submit }] = useForm({
    gridProps: { cols: 3 },
    labelWidth: 100,
    layout: "horizontal",
    showActionButtonGroup: false,
    schemas: addEditForm,
});
const onAddEditModal = async (id?: string) => {
    showAddEdit.value = true;
    if(id) {
        let mapInfoData = (await getMapInfo(id)).Data;
        setFieldsValue(mapInfoData);
    }
};
const onAddEditConfirm = () => {
    submit();
};
const onAddEditSubmit = (values: map.mapInfo) => {
    if(values.id) {
        updateMap(values).then(res => {
            if(res.State == 1) {
                window.$message?.success("编辑成功");
                onSearch();
                onAddEditClose();
            }
        })
    } else {
        addMap(values).then(res => {
            if(res.State == 1) {
                window.$message?.success("添加成功");
                onSearch();
                onAddEditClose();
            }
        })
    }
};
const onAddEditClose = () => {
    showAddEdit.value = false;
};
const onMapParamAdd = () => {
    return {
        name: "",
        val: "",
    };
};
</script>
<style lang="scss"></style>
