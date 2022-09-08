<template>
  <div>
    <TableListTemplate>
      <template #search>
        <BasicForm
          @register="register"
          @submit="handleSubmit"
          @reset="handleReset"
        >
        </BasicForm>
      </template>
      <template #table>
        <BasicTable
          :columns="columns"
          :pagination="false"
          :dataSource="data.list"
          ref="actionRef"
          :scroll-x="1500"
        ></BasicTable>
      </template>
      <template #page>
        <!-- <page
            :current-page="pageOption?.currentPage"
            :page-size="pageOption?.pageSize"
            @page-change="pageHandle"
            @page-size-change="pageSizeHandle"
            simple
          /> -->
        <n-pagination
          :page="pageOption?.currentPage"
          :page-size="pageOption?.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :page-count="100"
          @update-page="pageHandle"
          show-size-picker
          show-quick-jumper
          @update-page-size="pageSizeHandle"
          simple
        />
      </template>
    </TableListTemplate>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { BasicTable } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import { getMapFenceRecordList } from "@/api/mapFence";
import type { PaginationType } from "@/components/pagination/index";
import { formatDateTime } from "@/utils/common";
import moment from "moment";
import { NTag } from "naive-ui";
const searchData = ref<MapFenceRecord.MapFenceRecorddata>({});
const tableData = ref<MapFenceRecord.MapFenceRecordList[]>([]);
const beginDate = ref();
const endDate = ref();
const columns: any[] = [
  {
    title: "设备号",
    key: "terminalNo",
    width: 130,
  },
  {
    title: "车牌号",
    key: "carNumber",
    width: 120,
  },
  {
    title: "围栏编号",
    key: "mapFenceCode",
    width: 120,
  },
  {
    title: "围栏名称",
    key: "mapFenceName",
    width: 120,
  },
  {
    title: "围栏标识",
    key: "ieFlag",
    width: 120,
    render(row: { ieFlag: any }) {
      return h(
        NTag,
        {
          type: row.ieFlag===1 ? "success" : "error",
          size: "small",
        },
        {
          default: () => (row.ieFlag===1 ? "进入" : "离开"),
        }
      );
    },
  },
  {
    title: "经纬度",
    key: "lngLat",
    width: 200,
    render(row: any) {
      return row.lng + "," + row.lat;
    },
  },
  {
    title: "设备时间",
    key: "deviceDate",
    width: 200,
    render(row: { deviceDate: any }) {
      return formatDateTime(row.deviceDate);
    },
  },
  {
    title: "发生时间",
    key: "serverDate",
    width: 200,
    render(row: { serverDate: any }) {
      return formatDateTime(row.serverDate);
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
  {
    field: "beginTime",
    component: "NDatePicker",
    label: "开始时间",
    componentProps: {
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
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
      type: "datetime",
      defaultFormattedValue: endDate,
      format: "yyyy-MM-dd HH:mm:ss",
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
  beginDate.value = moment().format("YYYY-MM-DD 00:00:00");
  endDate.value = moment().format("YYYY-MM-DD 23:59:59");
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
  const Data = (
    await getMapFenceRecordList(
      data.selectData ? data.selectData : { ...pageOption.value }
    )
  ).Data;
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
