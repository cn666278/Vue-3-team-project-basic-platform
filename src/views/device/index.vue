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
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset"> </BasicForm>
      </template>
      <template #table>
        <BasicTable :columns="columns" :pagination="false" :dataSource="data.list" ref="actionRef" :actionColumn="actionColumn" :scroll-x="2000" @tableReload="getTableData"></BasicTable>
      </template>
      <template #page>
        <page :current-page="pageOption?.currentPage" :page-size="pageOption?.pageSize" :total-page="pageOption?.totalPage" :total-count="pageOption?.totalCount" @page-change="pageHandle" @page-size-change="pageSizeHandle" />
      </template>
    </TableListTemplate>
    <Dialog v-model:showModal="showModal" :option="dialogoption" @close="close" @confirm="confirm">
      <BasicForm @register="addregister" @submit="addSubmit"> </BasicForm>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref, watch } from "vue";
import { columns } from "./columns";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import page from "@/components/pagination/index.vue";
import { getDeviceList, addDevice, getDeviceInfo, UpdateDevice, setDeviceIsEnable } from "@/api/device";
import { getDeviceTypeList } from "@/api/deviceType";
import { getBusinessGroupList } from "@/api/businessGroup";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { transformTozTreeFormat } from "@/utils/common";
const searchData = ref<device.deviceData>({});
const tableData = ref<device.deviceList[]>([]);
// 新增弹窗显示
const showModal = ref(false);
const dialogTitle = ref("");
// 设备类型数据
const deviceTypeData = ref();
// 业务分组数据
let businessGroupData: Ref<any[]> = ref([
  {
    id: "",
    name: "全部",
    children: [],
  },
]);
// 新增弹窗的变量
const dialogoption = reactive({
  ConfirmBtnText: "保存",
  title: dialogTitle,
});
// 点击新增按钮
function addTable() {
  showModal.value = true;
  dialogTitle.value = "新增";
  let resdata = {
    isEnable: true,
  };
  setTimeout(() => {
    setFieldsValue(resdata);
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
    label: "设备名称",
    componentProps: {
      placeholder: "请输入设备名称",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入设备名称", trigger: ["blur"] }],
  },
  {
    field: "terminalNo",
    component: "NInput",
    label: "设备号",
    componentProps: {
      placeholder: "请输入设备号",
      onInput: (e: any) => {},
    },
  },
  {
    field: "deviceTypeId",
    component: "NSelect",
    label: "设备类型",
    componentProps: {
      labelField: "name",
      valueField: "id",
      placeholder: "请选择设备类型",
      options: deviceTypeData,
    },
    rules: [{ required: true, message: "请选择设备类型", trigger: ["blur"] }],
  },
  {
    field: "carNumber",
    component: "NInput",
    label: "车牌号",
    componentProps: {
      placeholder: "请输入车牌号",
      onInput: (e: any) => {},
    },
  },
  {
    field: "businessGroupId",
    component: "NTreeSelect",
    label: "业务分组",
    componentProps: {
      labelField: "name",
      keyField: "id",
      placeholder: "请输入业务分组",
      options: businessGroupData,
      defaultExpandAll: true,
      virtualScroll: false,
      onInput: (e: any) => {},
    },
  },
  {
    field: "phone",
    component: "NInput",
    label: "手机号码",
    componentProps: {
      placeholder: "请输入手机号码",
      onInput: (e: any) => {},
    },
  },
  {
    field: "speedLimit",
    component: "NInput",
    label: "限速",
    componentProps: {
      placeholder: "请输入限速",
      onInput: (e: any) => {},
    },
  },
  {
    field: "memo",
    component: "NInput",
    label: "备注说明",
    componentProps: {
      type: "textarea",
      placeholder: "请输入备注说明",
      onInput: (e: any) => {},
    },
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
    // let res = await addDevice(values);
    addDevice(values).then((res) => {
      showModal.value = false;
      // message.success("新建成功");
      getTableData();
    });
  } else {
    UpdateDevice(values).then((res) => {
      showModal.value = false;
      // message.success("编辑成功");
      getTableData();
    });
  }
}

const actionColumn = reactive({
  title: "操作",
  key: "action",
  width: 200,
  fixed: "right",
  align: "center",
  render(record: Recordable<any>) {
    return h(TableAction as any, {
      style: "text",
      actions: [
        {
          label: "编辑",
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
        {
          label: record.isEnable == false ? "启用" : "禁用",
          onClick: onDisableOrEnable.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
      ],
    });
  },
});

// 禁用或启用
const onDisableOrEnable = (record: Recordable) => {
  setDeviceIsEnable({ id: record.id, isEnable: !record.isEnable });
  getTableData();
};

async function handleEdit(record: Recordable) {
  // console.log("点击了编辑用户", record);
  showModal.value = true;
  dialogTitle.value = "编辑";
  let resdata = (await getDeviceInfo(record.id)).Data;
  setTimeout(() => {
    setFieldsValue(resdata);
  }, 10);
}

// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "name",
    component: "NInput",
    label: "设备",
    componentProps: {
      placeholder: "请输入设备",
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
  getDeviceTypeData();
  getBusinessGroupData();
});
/**获取设备类型 */
const getDeviceTypeData = async () => {
  let formInline = {
    name: "",
    currentPage: 1,
    pageSize: 999999,
  };
  const RoteData = (await getDeviceTypeList(formInline)).Data.data;
  deviceTypeData.value = RoteData;
};
/**获取业务分组 */
const getBusinessGroupData = async () => {
  let formInline = {
    name: "",
    currentPage: 1,
    pageSize: 999999,
  };
  const RoteData = (await getBusinessGroupList(formInline)).Data.data;
  //   businessGroupData.value = RoteData;
  businessGroupData.value[0].children = transformTozTreeFormat(RoteData) as unknown as any[];
};

/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (await getDeviceList(data.selectData ? data.selectData : { ...pageOption.value })).Data;
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
