<template>
  <div>
    <h1>用户管理</h1>
    <div class="search">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
      >
      </BasicForm>
    </div>
    <BasicTable
      :Total="totalCount"
      :columns="columns"
      :dataSource="data.list"
      @change-page="changePage"
      @change-page-size="changePageSize"
    ></BasicTable>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref, toRaw } from "vue";
import { columns } from "./columns";
import BasicTable from "@/components/Table/index.vue";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { getMemberList } from "@/api/member";
import { InitData } from "@/typings/member";
// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "account",
    component: "NInput",
    label: "账号名称",
    componentProps: {
      placeholder: "请输入账号名称",
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
];
// 搜索参数
const [register, {}] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 80,
  schemas,
});
// 搜索查询
function handleSubmit(values: Recordable) {
  data.selectData.account = values.account;
  getTableData();
}
// 搜索重置
function handleReset(values: Recordable) {
  Object.keys(data.selectData).forEach((key) => {
    if (key !== "currentPage" && key !== "pageSize") {
      console.log(key);
      data.selectData[key] = undefined;
    }
  });
  getTableData();
}
// 总页数
const totalCount: Ref<number> = ref(0);
const data = reactive(new InitData());
onMounted(() => {
  getTableData();
});
/**获取列表数据 */
const getTableData = async () => {
  await getMemberList(data.selectData)
    .then((res) => {
      data.list = res.Data.data;
      totalCount.value = res.Data.totalCount;
    })
    .finally(() => {});
};
// 页码变化
const changePage = (val: any) => {
  data.selectData.currentPage = val;
  getTableData();
};
// 页码尺寸变化
const changePageSize = (val: any) => {
  data.selectData.pageSize = val;
  data.selectData.currentPage = 1;
  getTableData();
};
</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
