<template>
  <div>
    <n-data-table :columns="columns" :data="dataSource" :pagination="paginationdata">
    </n-data-table>
  </div>
</template>

<script setup lang='ts'>
import { h, reactive, ref } from "vue";
import {PaginationProps} from 'naive-ui'
interface BasicTableProps {
  title?: string;
  dataSource: any;
  columns: any[];
  pagination: PaginationProps;
  showPagination?: boolean;
}
const props = defineProps<BasicTableProps>();
// console.log(props.pagination)
// const emits = defineEmits(["onChange"]);
const paginationdata = reactive({
  page:props.pagination.page,
  pageSize: props.pagination.pageSize,
  showSizePicker: props.pagination.showSizePicker,
  pageSizes: props.pagination.pageSizes,
  onChange: (page: number) => {
    paginationdata.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationdata.pageSize = pageSize;
    paginationdata.page = 1;
  },
});
</script>

<style lang='scss' scoped>

</style>