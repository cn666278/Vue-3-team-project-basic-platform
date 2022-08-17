<template>
    <!-- <h1>地图管理页面123123131</h1> -->
    <TableListTemplate :form-search="search" :form-table-columns="columns" :get-table-data="getTableData" />
</template>
<script setup lang="ts">
// import {onMounted, reactive, ref} from 'vue';
import type { formSearch, formTableColumns } from '@/components/TableListTemplate';
import TableListTemplate from '@/components/TableListTemplate/index.vue';
import { getMapList } from '@/api/map';
const getTableData = async (jsonData?: defaultType.requestList) => {
    const Data = (await getMapList(jsonData ? jsonData : {
        currentPage: 1,
        pageSize: 20,
    })).Data;
    return Data
}
const columns: formTableColumns[] = [
    {
        title: '地图名称',
        key: 'name',
    },{
        title: '坐标系类型',
        key: 'coordinateTypeName',
    },{
        title: '操作',
        key: '',
        type: 'button',
        value: '编辑',
    }
];
const search: formSearch[] = [
    {
        label: '关键字搜索',
        key: 'name',
        value: '',
        type: 'input',
    }, {
        label: '地图名称',
        key: 'mapName',
        type: 'input',
        value: '',
    }, {
        label: '地图1',
        key: 'key1',
        value: '',
        type: 'input',
    }, {
        label: '地图2',
        key: 'key2',
        value: '',
        type: 'input',
    }
]
</script>
<style lang="scss"></style>
