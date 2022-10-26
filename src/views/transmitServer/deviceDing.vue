<template>
  <div>
    <TableListTemplate>
      <template #operate>
        <n-space justify="end">
          <n-button text @click="addTable">
            <n-icon :size="20">
              <AppstoreAddOutlined />
            </n-icon>
            新增车辆
          </n-button>
          <n-button text @click="deltable">
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
          ref="actionRef"
          @tableReload="getTableData"
          :row-key="rowKey"
          :default-checked-row-keys="checkedRowKeysRef"
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
    <Dialog
      v-model:showModal="showModal"
      :option="dialogoption"
      @close="close"
      @confirm="confirm"
      width="60vw"
    >
    <device-data :transmitServerId="props.transmitServerId" @closeDialog="close1" ref="devicedataRef"></device-data>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import page from "@/components/pagination/index.vue";
import Dialog from "@/components/dialog/index.vue";
import deviceData from "./deviceData.vue";
import { getDeviceTransmitList, delDeviceTransmit } from "@/api/deviceTransmit";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { formatDateTime } from "@/utils/common";
import {
  DataTableColumns,
  DataTableRowKey,
  useMessage,
  useDialog,
} from "naive-ui";
const props = defineProps({
  transmitServerId: {
    type: String,
    default: "",
  },
});
const devicedataRef = ref<any>();
const message = useMessage();
const dialog = useDialog();
const searchData = ref<deviceTransmit.deviceTransmitdata>({});
const tableData = ref<deviceTransmit.deviceTransmitList[]>([]);
const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const rowKey = (row: any) => row.id;
// 删除id列表
const delIdlist = ref<any[]>([]);
const columns: any[] = [
  {
    type: "selection",
  },
  {
    title: "设备名称",
    key: "transmitServerName",
  },
  {
    title: "设备号",
    key: "terminalNo",
  },
  {
    title: "IP:端口",
    key: "serverAddress",
  },
  {
    title: "创建日期",
    key: "createDate",
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
];
// 新增弹窗显示
const showModal = ref(false);
const dialogTitle = ref("");
// 新增弹窗的变量
const dialogoption = reactive({
  ConfirmBtnText: "保存",
  title: dialogTitle,
});
// 点击新增按钮
function addTable() {
  showModal.value = true;
  dialogTitle.value = "新增";
}
// 关闭新增弹窗
function close() {
  showModal.value = false;

}
function close1() {
  showModal.value = false;
  getTableData();
}
// 保存新增弹窗
function confirm() {
    devicedataRef.value.onSubmit()
}
function deltable() {
  console.log(delIdlist.value);
  if (delIdlist.value.length === 0) {
    message.error("请在表格里选择删除数据！");
  } else {
    dialog.create({
      title: "警告",
      content: "您确定是否删除所选中数据？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        let resdata = {
          idList: delIdlist.value,
        };
        delDeviceTransmit(resdata).then(() => {
          delIdlist.value = [];
          getTableData();
        });
      },
      onNegativeClick: () => {},
    });
  }
}
function handleCheck(rowKeys: DataTableRowKey[], rows: any, meta: any) {
  checkedRowKeysRef.value = rowKeys;
  delIdlist.value = rowKeys;
}
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
];
// 搜索参数
const [register, {}] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 80,
  schemas,
});
// 搜索查询
function handleSubmit(values: Recordable) {
  data.selectData = values;
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
  getTableData();
  // getsubjectTypeData();
});
/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
    data.selectData.transmitServerId = props.transmitServerId;
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
