<template>
  <div>
    <n-data-table
      size="small"
      :columns="columns"
      :data="dataSource"
      :pagination="false"
      :max-height="550"
    >
    </n-data-table>
    <div class="paginationSetting">
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :item-count="total"
        show-size-picker
        :page-sizes="[10, 20, 30, 50]"
        show-quick-jumper
        :on-update:page="pageChange"
        :on-update:page-size="pageSizeChange"
      >
        <template #prefix="{ itemCount }"> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, watch, useSlots } from "vue";
import { PaginationProps } from "naive-ui";
interface BasicTableProps {
  title?: string;
  dataSource: any;
  Total: number;
  columns: any[];
}
const slots = useSlots();
const renderArr = Object.keys(slots);
const props = defineProps<BasicTableProps>();
const state = reactive(props);
const { Total } = toRefs(state);
console.log(props);
const total = ref(Total); //多少条数据
let page = ref(1); //当前第几页
let pageSize = ref(10); //每页多少行
const emit = defineEmits(["changePage", "changePageSize"]); //子传父
// 页码发生改变时的回调函数
const pageChange = (pagecurrent: number) => {
  page.value = pagecurrent;
  emit("changePage", pagecurrent);
};
// 页码尺寸发生改变时的回调函数
const pageSizeChange = (size: number) => {
  pageSize.value = size;
  emit("changePageSize", size);
};
</script>

<style lang="scss" scoped>
.paginationSetting {
  float: right;
  margin-top: 20px;
  margin-right: 10px;
}
</style>
