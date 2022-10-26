<template>
  <div>
    <TableListTemplate>
      <template #operate>
        <n-space justify="end">
          <n-button text @click="addTable">
            <n-icon :size="20">
              <AppstoreAddOutlined />
            </n-icon>
            新增
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
          :actionColumn="actionColumn"
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
    <Dialog
      v-model:showModal="showModal"
      :option="dialogoption"
      @close="close"
      @confirm="confirm"
    >
      <BasicForm @register="addregister" @submit="addSubmit"> </BasicForm>
    </Dialog>
    <Dialog
      v-model:showModal="seeshowModal"
      width="60vw"
      :btn-show="false"
      :option="dialogoption"
      @close="seeclose"
    >
      <device-ding :transmitServerId="transmitServerId" />
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref, toRaw } from "vue";
import { columns } from "./columns";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import page from "@/components/pagination/index.vue";
import { MD5Encrypt } from "@/utils/login";
import {
  getTransmitServerList,
  addTransmitServer,
  deleteTransmitServer,
  setTransmitServerIsEnable,
} from "@/api/TransmitServer";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { useMessage, useDialog } from "naive-ui";
import deviceDing from './deviceDing.vue'
const searchData = ref<transmitServer.transmitServerdata>({});
const tableData = ref<transmitServer.transmitServerList[]>([]);
const message = useMessage();
const dialog = useDialog();
const transmitServerId=ref()
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
  setTimeout(() => {
    updateSchema({
      field: "passWord",
      giProps: {
        span: 1,
      },
    });
  }, 10);
}
// 关闭新增弹窗
function close() {
  showModal.value = false;
}
// 保存新增弹窗
function confirm() {
  // showModal.value = false;
  submit();
}
const addschemas: FormSchema[] = [
  {
    field: "id",
    label: "",
    giProps: {
      span: 0,
    },
  },
  {
    field: "name",
    component: "NInput",
    label: "转发服务器名称",
    componentProps: {
      placeholder: "请输入转发服务器名称",
      onInput: (e: any) => {},
    },
    rules: [
      { required: true, message: "请输入转发服务器名称", trigger: ["blur"] },
    ],
  },
  {
    field: "serverAddress",
    component: "NInput",
    label: "转发地址",
    componentProps: {
      placeholder: "请输入转发地址",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入转发地址", trigger: ["blur"] }],
  },
  {
    field: "isAll",
    component: "NSwitch",
    label: "是否全部转发",
    componentProps: {},
  },
  {
    field: "isEnable",
    component: "NSwitch",
    label: "是否启用",
    componentProps: {},
  },
];
// 新增表单
const [addregister, { setFieldsValue, submit, updateSchema }] = useForm({
  gridProps: { cols: 1 },
  collapsedRows: 3,
  labelWidth: 100,
  layout: "horizontal",
  showActionButtonGroup: false,
  schemas: addschemas,
});
async function addSubmit(values: Recordable) {
  if (values.id === undefined) {
    values.passWord = MD5Encrypt(values.passWord);
    addTransmitServer(values).then((res) => {
      showModal.value = false;
      getTableData();
    });
  } else {
  }
}
// 修改密码弹窗显示
const seeshowModal = ref(false);
// 关闭修改密码弹窗
function seeclose() {
  seeshowModal.value = false;
}
// 保存修改密码弹窗
function seeconfirm() {
  // showModal.value = false;
}

async function seeSubmit(values: Recordable) {
  // console.log(values);
}
const actionColumn = reactive({
  title: "操作",
  key: "action",
  width: 220,
  fixed: "right",
  render(record: Recordable<any>) {
    return h(TableAction as any, {
      style: "text",
      actions: [
        {
          label: "查看转发",
          onClick: handleSee.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
        {
          label: "启用",
          onClick: handleIsenable.bind("open", record),
          ifShow: () => {
            if (record.isEnable === true) {
              return false;
            } else {
              return true;
            }
          },
        },
        {
          label: "禁用",
          onClick: handleIsenable.bind("close", record),
          ifShow: () => {
            if (record.isEnable === false) {
              return false;
            } else {
              return true;
            }
          },
        },
        {
          label: "删除",
          type: "error",
          onClick: handleDel.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
      ],
    });
  },
});
async function handleSee(record: Recordable) {
    seeshowModal.value = true;
    dialogTitle.value = '查看转发';
    transmitServerId.value=record.id
}
// 删除
async function handleDel(record: Recordable) {
    dialog.create({
        title: '警告',
        content: '您确定是否删除该数据？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            let resdata = {
                id: record.id,
            };
            deleteTransmitServer(resdata).then(() => {
                getTableData();
            });
        },
        onNegativeClick: () => {},
    });
}
function handleIsenable(record: Recordable) {
  // console.log("点击了启用/禁用", record);
  if (record.isEnable === false) {
    dialog.create({
      title: "警告",
      content: "您确定启用该数据？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        let opendata = {
          id: record.id,
          isEnable: true,
        };
        setTransmitServerIsEnable(opendata).then(() => {
          getTableData();
        });
      },
      onNegativeClick: () => {},
    });
  } else {
    dialog.create({
      title: "警告",
      content: "您确定禁用该数据？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        let offdata = {
          id: record.id,
          isEnable: false,
        };
        setTransmitServerIsEnable(offdata).then(() => {
          getTableData();
        });
      },
      onNegativeClick: () => {},
    });
  }
}
// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "name",
    component: "NInput",
    label: "转发服务器名称",
    componentProps: {
      placeholder: "请输入转发服务器名称",
      onInput: (e: any) => {
        console.log(e);
      },
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
  data.selectData = values;
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
});
/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (
    await getTransmitServerList(
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
