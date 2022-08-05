<template>
  <div>
    <h1>用户</h1>
    <BasicTable
      :columns="columns"
      :dataSource="loadDataTable"
      :pagination="pagination"
    ></BasicTable>
  </div>
</template>
<script setup lang="ts">
import { h, reactive, ref } from "vue";
import { columns } from "./columns";
import BasicTable from "@/components/Table/index.vue";
import { getMemberList } from "@/api/member";
let data = {
  currentPage: 1,
  pageSize: 10,
};
console.log(getMemberList(data))
const loadDataTable = (await getMemberList(data)).Data;
let pagination = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
};
</script>
<style lang="scss"></style>
