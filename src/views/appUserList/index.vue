<template>
  <div>
    <TableListTemplate>
      <template #search>
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        </BasicForm>
      </template>

      <template #table>
        <BasicTable :columns="columns" :pagination="false" :dataSource="data.list" :scroll-x="1500"></BasicTable>
      </template>
      <template #page>
        <page :current-page="pageOption?.currentPage" :page-size="pageOption?.pageSize"
          :total-page="pageOption?.totalPage" :total-count="pageOption?.totalCount" @page-change="pageHandle"
          @page-size-change="pageSizeHandle" />
      </template>
    </TableListTemplate>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { BasicTable } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
// page control
import page from "@/components/pagination/index.vue";
import type { PaginationType } from "@/components/pagination/index";

// MemberDeviceList
import { columns } from "./columns"; // 列表数据
import { InitData } from "@/typings/appUserList"; //初始化数据列表
import { getAppUserList, userList } from "@/api/appManage";


/**搜索数据 */
const schemas: FormSchema[] = [
  {
    field: "name",
    component: "NInput",
    label: "关键字",
    componentProps: {
      placeholder: "名称 | 手机号",
      onInput: (e: any) => {
        console.log(e);
      },
    },
  }
];
/**搜索参数 */
const [register, { }] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 65,
  schemas,
});
/**搜索查询 */
function handleSubmit(values: Recordable) {
  data.selectData.name = values.name; 
  getTableData();
}
/**搜索重置 */
function handleReset(values: Recordable) {
  Object.keys(data.selectData).forEach((key) => {
    // 把除了 currentPage 和 pageSize 之外的其他参数设为 undefined
    if (key !== "currentPage" && key !== "pageSize") {
      console.log(key);
      data.selectData[key] = undefined;
    }
  });
  getTableData();
}
// 总页数
const data = reactive(new InitData());
const pageOption = ref<PaginationType>({
  currentPage: 1,
  pageSize: 10,
});
/**页数改变触发事件 */
const pageHandle = (page: number) => {
  pageOption.value.currentPage = page;
  getTableData();
};
/**每页页数大小改变触发事件 */
const pageSizeHandle = (pageSize: number) => {
  pageOption.value.pageSize = pageSize;
  getTableData();
};
/**加载 */
onMounted(() => {
  getTableData();
});

/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }

  // 列表插入序列(序号)
  let sequence = {
    title: '序号',
    key: 'no',
    width: 50,
    render: (_: any, index: number) => {
      return `${index + 1 + ((pageOption.value.currentPage - 1) * pageOption.value.pageSize)}`
    }
  };
  columns[0] = sequence

  // ? 查找到数据就把 data.selectData 传给函数 getMemberDeviceList，
  // 如果查找不到数据则传递 pageOption 的所有参数
  const Data = (await getAppUserList(
    data.selectData ? data.selectData : { ...pageOption.value }
  )).Data

  data.list = Data.data;
  let pageData: PaginationType = {
    currentPage: Data.currentPage,
    pageSize: Data.pageSize,
    totalCount: Data.totalCount,
    totalPage: Data.totalPage,
  };
  pageOption.value = pageData;
  // console.log(Data.data) // test use only
  return Data.data;
};

</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
  