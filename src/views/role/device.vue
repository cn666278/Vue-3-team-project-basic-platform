<template>
  <div>
    <!-- 搜索 -->
    <div class="search">
      <n-form inline size="medium" label-placement="left">
        <n-form-item label="类型名称">
          <n-input v-model:value="searchMenuName" />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="getTableData">查询</n-button>
            <slot name="submit" :formData="checkedRowKeysRef"></slot>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
    <!-- 列表 -->
    <div>
      <n-data-table v-model:checked-row-keys="checkedRowKeysRef" :columns="columns" :data="tableData" :row-key="rowKey" :expanded-row-keys="expendKeys" @update-expanded-row-keys="expendKeysHandle" @update:checked-row-keys="checkedRowKeys" />
      <!-- <div>{{ checkedRowKeysRef }}</div> -->
    </div>
    <!-- 分页 -->
    <div class="page">
      <page :current-page="pageOption?.currentPage" :page-size="pageOption?.pageSize" :total-page="pageOption?.totalPage" :total-count="pageOption?.totalCount" @page-change="pageHandle" @page-size-change="pageSizeHandle" />
    </div>
    <!-- 选中的类型 -->
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref } from "vue";
import { DataTableColumn, DataTableRowKey } from "naive-ui";
import page from "@/components/pagination/index.vue";
import type { PaginationType } from "@/components/pagination/index";

import { getDeviceTypeList, getRoleBindDeviceType } from "@/api/deviceType";

interface form {
  roleId?: string;
}
const props = defineProps<form>();

// 列表勾选的数据
const checkedRowKeysRef = ref<any[]>([]);
/**列表格式 */
const columns: DataTableColumn[] = [
  {
    type: "selection",
    align: "center",
  },
  {
    title: "类型名称",
    key: "name",
  },
  {
    title: "设备编码",
    key: "deviceModel",
  },
  {
    title: "版本号",
    key: "version",
  },
];

/**行Key设置 */
const rowKey = (row: deviceType.roleDeviceList) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const expendKeysHandle = (keys: DataTableRowKey[]) => {
  expendKeys.value = keys;
};
const checkedRowKeys = (keys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = keys;
};

// 列表搜索参数
let tableData: Ref<object[]> = ref([]);
let searchMenuName: Ref<string> = ref("");

const pageOption = ref<PaginationType>({
  currentPage: 1,
  pageSize: 10,
});
const pageHandle = (page: number) => {
  pageOption.value.currentPage = page;
  getTableData();
};
const pageSizeHandle = (pageSize: number) => {
  pageOption.value.pageSize = pageSize;
  getTableData();
};

onMounted(() => {
  getTableData();
  getRoleBindDeviceTypeInfo();
});
// 获取详情数据
const getRoleBindDeviceTypeInfo = async () => {
  getRoleBindDeviceType(props.roleId).then((res: any) => {
    checkedRowKeysRef.value = res.Data.map((item: any) => item.id);
  });
};
// 获取列表数据
const getTableData = () => {
  getDeviceTypeList({
    name: searchMenuName.value,
    currentPage: pageOption.value.currentPage,
    pageSize: pageOption.value.pageSize,
  }).then((res) => {
    let pageData: PaginationType = {
      currentPage: res.Data.currentPage,
      pageSize: res.Data.pageSize,
      totalCount: res.Data.totalCount,
      totalPage: res.Data.totalPage,
    };
    pageOption.value = pageData;
    tableData.value = res.Data.data;
  });
};
</script>
<style lang="scss">
.search {
  margin: 10px 0;
}
.page {
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
