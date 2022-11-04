<template>
  <div>
    <TableListTemplate>
      <template #search>
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset"> </BasicForm>
      </template>
      <template #table>
        <BasicTable :columns="columns" :pagination="false" :dataSource="data.list" ref="actionRef" :scroll-x="1500"></BasicTable>
      </template>
      <template #page>
        <!-- <page
            :current-page="pageOption?.currentPage"
            :page-size="pageOption?.pageSize"
            @page-change="pageHandle"
            @page-size-change="pageSizeHandle"
            simple
          /> -->
        <n-pagination :page="pageOption?.currentPage" :page-size="pageOption?.pageSize" :page-sizes="[10, 20, 50, 100]" :page-count="100" @update-page="pageHandle" show-size-picker show-quick-jumper @update-page-size="pageSizeHandle" simple />
      </template>
    </TableListTemplate>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { BasicTable } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import { getDeviceMileageeList } from "@/api/deviceMileagee";
import type { PaginationType } from "@/components/pagination/index";
import { formatDateTime, someDaysAgoZero, someDaysAgoEnd } from "@/utils/common";
import moment from "moment";
import { NTag } from "naive-ui";
const searchData = ref<deviceMileagee.deviceMileageeData>({});
const tableData = ref<deviceMileagee.deviceMileageeList[]>([]);
const beginDate = ref();
const endDate = ref();
const columns: any[] = [
  {
    title: "设备号",
    key: "terminalNo",
    width: 130,
  },
  {
    title: "业务名称",
    key: "businessParam",
    width: 120,
  },
  {
    title: "里程数（km）",
    key: "mileage",
    width: 120,
  },
  {
    title: "轨迹点数量",
    key: "trailCount",
    width: 120,
  },
  {
    title: "记录时间",
    key: "recordDate",
    width: 200,
    render(row: { recordDate: any }) {
      return formatDateTime(row.recordDate);
    },
  },
];
// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "terminalNo",
    component: "NInput",
    label: "设备号",
    componentProps: {
      placeholder: "请输入设备号",
    },
  },
  //   {
  //     field: "businessParam",
  //     component: "NInput",
  //     label: "车牌号",
  //     componentProps: {
  //       placeholder: "请输入车牌号",
  //     },
  //   },
  {
    field: "beginTime",
    component: "NDatePicker",
    label: "开始时间",
    componentProps: {
      type: "Date",
      format: "yyyy-MM-dd",
      defaultFormattedValue: beginDate,
      clearable: true,
      onUpdateFormattedValue: (e: any) => {
        data.selectData.beginTime = e;
      },
    },
  },
  {
    field: "endTime",
    component: "NDatePicker",
    label: "结束时间",
    componentProps: {
      type: "Date",
      defaultFormattedValue: endDate,
      format: "yyyy-MM-dd",
      clearable: true,
      onUpdateFormattedValue: (e: any) => {
        data.selectData.endTime = e;
      },
    },
  },
];

// 搜索参数
const [register, { setFieldsValue }] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 90,
  schemas,
});
// 搜索查询
function handleSubmit(values: Recordable) {
  data.selectData.terminalNo = values.terminalNo;
  getTableData();
}
// 搜索重置
function handleReset(values: Recordable) {
  Object.keys(data.selectData).forEach((key) => {
    if (key !== "currentPage" && key !== "pageSize") {
      data.selectData[key] = undefined;
    }
  });
  getTableData();
}
// 总页数
const data = reactive({
  selectData: searchData,
  list: tableData,
});
const pageOption = ref<PaginationType>({
  currentPage: 1,
  pageSize: 20,
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
  beginDate.value = moment(someDaysAgoZero()).format("YYYY-MM-DD");
  endDate.value = moment(someDaysAgoEnd()).format("YYYY-MM-DD");
  setTimeout(() => {
    data.selectData.beginTime = beginDate.value;
    data.selectData.endTime = endDate.value;
    getTableData();
  }, 10);
});
/**获取列表数据 */
const getTableData = async () => {
  //   console.log(data.selectData);
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (await getDeviceMileageeList(data.selectData ? data.selectData : { ...pageOption.value })).Data;
  data.list = Data;
  let pageData: PaginationType = {
    currentPage: pageOption.value?.currentPage,
    pageSize: pageOption.value?.pageSize,
  };
  pageOption.value = pageData;
  return Data;
};
</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
