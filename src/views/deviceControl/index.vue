<template>
    <TableListTemplate>
        <template #search>
            <tableSearch
                :columns="searchColumns"
                @get-table-data="getTableData"
            />
        </template>
        <template #table>
            <BasicTable
                :columns="tableColumn"
                :dataSource="tableData"
                :pagination="false"
                :pageOption="pageOption"
                :actionColumn="actionColumn"
                :scroll-x="1100"
            />
        </template>
        <template #page>
            <pagination
                :current-page="pageOption?.currentPage"
                :page-size="pageOption?.pageSize"
                :total-count="pageOption?.totalCount"
                :total-page="pageOption?.totalPage"
                @page-change="pageHandle"
                @page-size-change="pageSizeHandle"
            />
        </template>
    </TableListTemplate>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { getDeviceList } from "@/api/device";
import {
    sealCard,
    unSealCard,
    lanternOpen,
    lanternClose,
} from "@/api/deviceControl";
import {
    TableListTemplate,
    tableSearch,
    PaginationType,
    pagination,
    Dialog,
} from "@/components/TableListTemplate";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { DataTableColumn, NTag } from "naive-ui";
import { searchColumns, tableColumn } from "./columns";
const searchData = ref<device.deviceData>();

const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 20,
});

const actionColumn: DataTableColumn = {
    title: "操作",
    key: "action",
    width: 220,
    fixed: "right",
    align: "center",
    render: (row) => {
        return h(TableAction as any, {
            style: "text",
            actions: [
                {
                    label: "施封",
                    onClick: () =>
                        onOperate(row.terminalNo as string, "sealCard"),
                    ifShow: () => searchData.value?.deviceTypeCode == "lock",
                },
                {
                    label: "解封",
                    onClick: () =>
                        onOperate(row.terminalNo as string, "unSealCard"),
                    ifShow: () => searchData.value?.deviceTypeCode == "lock",
                },
                {
                    label: "亮灯",
                    onClick: () =>
                        onOperate(row.terminalNo as string, "lanternOpen"),
                    ifShow: () => searchData.value?.deviceTypeCode == "C902",
                },
                {
                    label: "灭灯",
                    onClick: () =>
                        onOperate(row.terminalNo as string, "lanternClose"),
                    ifShow: () => searchData.value?.deviceTypeCode == "C902",
                },
            ],
        });
    },
};
const tableData = ref<device.deviceList[]>();

/**获取表格数据 */
const getTableData = async (jsonData?: device.deviceData) => {
    if (jsonData) {
        jsonData = Object.assign(jsonData, pageOption.value);
        searchData.value = jsonData;
    }
    const Data = (
        await getDeviceList(jsonData ? jsonData : { ...pageOption.value })
    ).Data;
    let pageData: PaginationType = {
        currentPage: Data.currentPage,
        pageSize: Data.pageSize,
        totalCount: Data.totalCount,
        totalPage: Data.totalPage,
    };
    pageOption.value = pageData;
    tableData.value = Data.data;
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
const onOperate = (
    terminalNo: string,
    type: "sealCard" | "unSealCard" | "lanternOpen" | "lanternClose"
) => {
    let thenCallBack = (res: defaultType.responseDefaultType) => {
        if (res.State == 1) {
            window.$message?.success("操作成功!");
        }
    };
    switch (type) {
        case "sealCard":
            sealCard(terminalNo).then(thenCallBack);
            break;
        case "unSealCard":
            unSealCard(terminalNo).then(thenCallBack);
            break;
        case "lanternOpen":
            lanternOpen(terminalNo).then(thenCallBack);
            break;
        case "lanternClose":
            lanternClose(terminalNo).then(thenCallBack);
            break;
    }
};
</script>
<style lang="scss"></style>
