<template>
  <div>
    <TableListTemplate>
      <template #operate>
        <n-space justify="end">
          <n-button text>
            <n-icon :size="20">
              <AppstoreAddOutlined />
            </n-icon>
            下载
          </n-button>
        </n-space>
      </template>
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
        <page
          :current-page="pageOption?.currentPage"
          :page-size="pageOption?.pageSize"
          :total-page="pageOption?.totalPage"
          :total-count="pageOption?.totalCount"
          @page-change="pageHandle"
          @page-size-change="pageSizeHandle"
        />
      </template>
    </TableListTemplate>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { columns } from "./columns";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import page from "@/components/pagination/index.vue";
import { getDeviceMsgLogList, getEnumType } from "@/api/interfaceLog";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import moment from "moment";
const searchData = ref<deviceMsgLog.deviceMsgLogdata>({});
const tableData = ref<deviceMsgLog.deviceMsgLogList[]>([]);
const protocolData = ref();
// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "terminalNo",
    component: "NInput",
    label: "设备号",
    componentProps: {
      placeholder: "请输入设备号",
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: "protocol",
    component: "NSelect",
    label: "协议",
    componentProps: {
      labelField: "text",
      valueField: "id",
      placeholder: "请选择协议",
      options: protocolData,
      onUpdateValue: (e: any) => {},
    },
  },
  {
    field: "beginTime",
    component: "NDatePicker",
    label: "开始时间",
    componentProps: {
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
      clearable: true,
      onUpdateFormattedValue: (e: any) => {
        data.selectData.beginTime=e
      },
    },
  },
  {
    field: "endTime",
    component: "NDatePicker",
    label: "结束时间",
    componentProps: {
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
      clearable: true,
      onUpdateFormattedValue: (e: any) => {
        data.selectData.endTime=e
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
  data.selectData.protocol = values.protocol;
  //   data.selectData.beginTime=moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss');
  console.log(values);
  //   data.selectData.endTime=values.endTime;
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
  getTableData();
  getprotocolData();
});

/**获取枚举列表 */
const getprotocolData = async () => {
  const RoteData = (await getEnumType("EProtocol")).Data;
  protocolData.value = RoteData;
};
/**获取列表数据 */
const getTableData = async () => {
  console.log(data.selectData);
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (
    await getDeviceMsgLogList(
      data.selectData ? data.selectData : { ...pageOption.value }
    )
  ).Data;
  data.list = Data;
  let totalPage = Data.length / pageOption.value?.pageSize;
  //   console.log(totalPage)
  let pageData: PaginationType = {
    currentPage: pageOption.value?.currentPage,
    pageSize: pageOption.value?.pageSize,
    // totalCount: Data.length,
    totalPage: totalPage,
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
