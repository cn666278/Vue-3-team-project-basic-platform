<template>
  <div class="form_table">
    <n-data-table :loading="loading" remote striped :columns="createColumns" :data="tableData" :row-key="rowKey" :expanded-row-keys="expendKeys" :default-checked-row-keys="expendKeys" @update:checked-row-keys="expendKeysHandle" />
  </div>
</template>
<script setup lang="ts">
import { reactive, Ref, ref, h, onMounted, watch } from "vue";
import type { DataTableColumns, DataTableRowKey } from "naive-ui";
import { NTag } from "naive-ui";
import { getRoleList } from "@/api/role";
import { getBusinessGroupBindRole } from "@/api/businessGroup";

// 引入分页类型
import { pagination, PaginationType } from "@/components/TableListTemplate";
interface form {
  id?: string;
}
// 详情参数
let props = defineProps<form>();
const emits = defineEmits(["submit"]);
// 分页
const pageOption = ref<PaginationType>({
  currentPage: 1,
  pageSize: 9999,
});

// 列表loading状态
let loading: Ref<boolean> = ref(false);
let tableData: Ref<any> = ref([]);

onMounted(() => {
  getTableData();
});

// 列表查询点击事件
const getTableData = async () => {
  loading.value = true;
  getRoleList(Object.assign(pageOption.value))
    .then((res) => {
      tableData.value = res.Data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 初始化列表数据类型
type RowData = {
  id: string;
  name: string;
  roleCode: string;
  isEnable: string;
  createDate: string;
};
// 设置列表表头
const createColumns: DataTableColumns<RowData> = [
  {
    type: "selection",
  },
  {
    title: "角色名称",
    key: "name",
  },
  {
    title: "角色编码",
    key: "roleCode",
  },
  {
    title: "是否启用",
    key: "isEnable",
    width: 80,
    render(row: { isEnable: any }) {
      return h(
        NTag,
        {
          type: row.isEnable ? "success" : "error",
          size: "small",
        },
        {
          default: () => (row.isEnable ? "启用" : "禁用"),
        }
      );
    },
  },
];

// 行Key设置
const rowKey = (row: RowData) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const expendKeysHandle = (keys: DataTableRowKey[]) => {
  expendKeys.value = keys;
  emits("submit", expendKeys.value);
};

if (props) {
  getBusinessGroupBindRole(props.id).then((res) => {
    for (let i in res.Data) expendKeys.value.push(res.Data[i].roleId);
    emits("submit", expendKeys.value);
  });
}
watch(
  () => props,
  (nowProps) => {
    console.log(nowProps);
  },
  { deep: true }
);
</script>
<style lang="scss" scoped></style>
