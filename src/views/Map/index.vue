<template>
    <div>
        <TableListTemplate>
            <template #operate>
                <n-button text @click="onAddEditModal">
                    <n-icon :size="22">
                        <AppstoreAddOutlined />
                    </n-icon>
                    新增
                </n-button>
            </template>
            <template #search>
                <table-search
                    :columns="search"
                    @get-table-data="getTableData"
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
                <page
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
                    @close="onAddEditClose"
                    @confirm="onAddEditConfirm"
                >
                    <BasicForm
                        @register="addRegister"
                        @submit="onAddEditSubmit"
                    ></BasicForm>
                </Dialog>
            </template>
        </TableListTemplate>
    </div>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { NTag, NButton, DataTableColumn } from "naive-ui";
import { AppstoreAddOutlined } from "@vicons/antd";
import type { formSearch } from "@/components/TableListTemplate";
import type { PaginationType } from "@/components/pagination/index";
import tableSearch from "@/components/tableSearch/index.vue";
import formTable from "@/components/FormTable/index.vue";
import page from "@/components/pagination/index.vue";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { getMapList } from "@/api/map";
import { getEnumType } from '@/api/login';
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
  const Data = (await getMapList(jsonData ? jsonData : { ...pageOption.value }))
    .Data;
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
/**获取坐标系枚举 */
const getCoordinateType = async () => {
    coordinateTypeList.value = (await getEnumType('ECoordinateType')).Data;
};
/**分页页数监听 */
const pageHandle = (page: number) => {
  pageOption.value.currentPage = page;
  getTableData();
};
/**每页页数监听 */
const pageSizeHandle = (pageSize: number) => {
  pageOption.value.pageSize = pageSize;
  getTableData();
};
getTableData();
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
        giProps: {span: 3},
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
        giProps: {span: 3},
        rules: [
            { required: true, message: "请输入地图标识", trigger: ["blur"] },
        ],
    },
    {
        field: 'coordinateType',
        label: '坐标系类型',
        component: "NSelect",
        componentProps: {
            // labelFil
        }
    }
];
/**增删改查表单 */
const [addRegister, { setFieldsValue, submit }] = useForm({
    gridProps: { cols: 3 },
    labelWidth: 100,
    layout: "horizontal",
    showActionButtonGroup: false,
    schemas: addEditForm,
});
const onAddEditModal = () => {
    showAddEdit.value = true;
};
const onAddEditConfirm = () => {
    submit();
};
const onAddEditSubmit = (values: Recordable) => {
    console.log(values);
};
const onAddEditClose = () => {
    showAddEdit.value = false;
};
</script>
<style lang="scss"></style>
