<template>
    <TableListTemplate>
        <template #search>
            <table-search :columns="search" @get-table-data="getTableData" />
        </template>
        <template #table>
            <form-table :columns="columns" :data="tableData" size="small" striped></form-table>
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
    </TableListTemplate>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { NTag, NButton, DataTableColumn } from 'naive-ui';
import type { formSearch } from "@/components/TableListTemplate";
import type { PaginationType } from "@/components/pagination/index";
import tableSearch from "@/components/tableSearch/index.vue";
import formTable from "@/components/FormTable/index.vue";
import page from "@/components/pagination/index.vue";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import { getMapList } from "@/api/map";
const searchData = ref<defaultType.requestList>({});
const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 20,
});
const tableData = ref<map.mapList[]>([]);
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
const pageHandle = (page: number) => {
    pageOption.value.currentPage = page;
    getTableData();
};
const pageSizeHandle = (pageSize: number) => {
    pageOption.value.pageSize = pageSize;
    getTableData();
};
getTableData();
// const columns: formTableColumns[] = [
//     {
//         title: '地图名称',
//         key: 'name',
//     },{
//         title: '坐标系类型',
//         key: 'coordinateTypeName',
//     },{
//         title: '操作',
//         key: '',
//         type: 'button',
//         value: '编辑',
//     }
// ];
const columns:DataTableColumn[] = [
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
                    style: { margin: '5px', },
                    type: row.isDefault ? "success" : "error",
                }, {
                    default: () => row.isDefault ? '已默认' : '未默认',
                }
            )
        }
    },
    {
        title: "是否启用",
        key: "isEnable",
        render(row) {
            return h(
                NTag,
                {
                    style: { margin: '5px', },
                    type: row.isEnable ? "success" : "error",
                }, {
                    default: () => row.isEnable ? '启用' : '禁用',
                }
            )
        }
    },
];
const search = ref<formSearch[]>([
    {
        label: "关键字搜索",
        key: "name",
        value: "",
        type: "input",
    },
]);
</script>
<style lang="scss"></style>
