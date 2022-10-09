<template>
  <div>
    <TableListTemplate>
      <template #operate>
        <n-space justify="end">
          <n-button text @click="delclick">
            <n-icon :size="20">
              <AppstoreAddOutlined />
            </n-icon>
            删除
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
          :rowKey="rowKey"
          ref="actionRef"
          :scroll-x="1500"
          @update:checked-row-keys="handleCheck"
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
import { h, onMounted, reactive, Ref, ref } from "vue";
import { columns } from "./columns";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import page from "@/components/pagination/index.vue";
import { getDeviceTransmitList, delDeviceTransmit } from "@/api/deviceTransmit";
import { getDeviceList } from "@/api/device";
import { getTransmitServerList } from "@/api/transmitServer";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { DataTableRowKey, useDialog, useMessage } from "naive-ui";
const searchData = ref<deviceTransmit.deviceTransmitdata>({});
const tableData = ref<deviceTransmit.deviceTransmitList[]>([]);
const deviceList = ref();
const rowKey = (row: deviceTransmit.deviceTransmitList) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const handleCheck = (keys: DataTableRowKey[]) => {
  // console.log(keys)
  expendKeys.value = keys;
};
const dialog = useDialog();
const message = useMessage();
function delclick() {
  if (expendKeys.value.length !== 0) {
    dialog.create({
      title: "警告",
      content: "您确定是否删除该数据？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        let resdata={
          idList:expendKeys.value
        }
        delDeviceTransmit(resdata).then(()=>{
          getTableData()
        })
      },
      onNegativeClick: () => {},
    });
  }else{
    message.error('请选择删除的数据！')
  }
}
const transmitServerList = ref();
// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "deviceId",
    component: "NSelect",
    label: "设备名称",
    componentProps: {
      labelField: "name",
      valueField: "id",
      placeholder: "请选择设备名称",
      options: deviceList,
      onUpdateValue: (e: any) => {},
    },
  },
  {
    field: "transmitServerId",
    component: "NSelect",
    label: "转发服务器名称",
    componentProps: {
      labelField: "name",
      valueField: "id",
      placeholder: "请选择转发服务器名称",
      options: transmitServerList,
      onUpdateValue: (e: any) => {},
    },
  },
  {
    field: "terminalNo",
    component: "NInput",
    label: "设备号",
    componentProps: {
      placeholder: "请输入设备号",
    },
  },
  {
    field: "serverAddress",
    component: "NInput",
    label: "转发地址",
    componentProps: {
      placeholder: "请输入转发地址",
    },
  },
];
// 搜索参数
const [register, {}] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 120,
  schemas,
});
// 搜索查询
function handleSubmit(values: Recordable) {
  data.selectData.name = values.name;
  getTableData();
}
// 搜索重置
function handleReset(values: Recordable) {
  Object.keys(data.selectData).forEach((key) => {
    if (key !== "currentPage" && key !== "pageSize") {
      // console.log(key);
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
  getDeviceData();
  getTransmitServerData();
});
/**获取设备列表 */
const getDeviceData = async () => {
  let ddata = {
    name: "",
    deviceTypeName: "",
    deviceGroupName: "",
    currentPage: 1,
    pageSize: 99999,
  };
  const RoteData = (await getDeviceList(ddata)).Data.data;
  deviceList.value = RoteData;
};
/**获取枚举列表 */
const getTransmitServerData = async () => {
  let data = {
    name: "",
    currentPage: 1,
    pageSize: 99999,
  };
  const RoteData = (await getTransmitServerList(data)).Data.data;
  transmitServerList.value = RoteData;
};
/**获取列表数据 */
const getTableData = async () => {
  // console.log(data.selectData);
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (
    await getDeviceTransmitList(
      data.selectData ? data.selectData : { ...pageOption.value }
    )
  ).Data;
  data.list = Data.data;
  let pageData: PaginationType = {
    currentPage: Data.currentPage,
    pageSize: Data.pageSize,
    totalCount: Data.totalCount,
    totalPage: Data.totalPage,
  };
  pageOption.value = pageData;
  return Data.data;
};
</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
