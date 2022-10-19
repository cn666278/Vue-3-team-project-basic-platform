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
        <BasicTable :columns="columns" :pagination="false" :dataSource="data.list" ref="actionRef" :actionColumn="actionColumn" :scroll-x="1500" @tableReload="getTableData"></BasicTable>
      </template>
      <template #page>
        <page :current-page="pageOption?.currentPage" :page-size="pageOption?.pageSize" :total-page="pageOption?.totalPage" :total-count="pageOption?.totalCount" @page-change="pageHandle" @page-size-change="pageSizeHandle" />
      </template>
    </TableListTemplate>
    <Dialog v-model:showModal="showModal" :option="dialogoption" @close="close" @confirm="confirm">
      <BasicForm @register="addregister" @submit="addSubmit"> </BasicForm>
    </Dialog>
    <!-- 分配菜单弹出层 -->
    <n-modal v-model:show="showMenu" preset="card" :title="menuTitle" style="width: 30%" size="huge" bordered auto-focus @before-leave="onAddEditClose">
      <Menu :role-id="roleId">
        <template #submit="slotProps">
          <n-button type="primary" @click="onAddEditSubmit(slotProps, 'Menu')">确定</n-button>
          <n-button @click="onAddEditClose">取消</n-button>
        </template>
      </Menu>
    </n-modal>
    <!-- 分配接口弹出层 -->
    <n-modal v-model:show="showInterface" preset="card" :title="interfaceTitle" style="width: 60%" size="huge" bordered auto-focus @before-leave="onAddEditClose">
      <Interface :role-id="roleId">
        <template #submit="slotProps">
          <n-button type="primary" @click="onAddEditSubmit(slotProps, 'Interface')">确定</n-button>
          <n-button @click="onAddEditClose">取消</n-button>
        </template>
      </Interface>
    </n-modal>
    <!-- 分配设备弹出层 -->
    <n-modal v-model:show="showDevice" preset="card" :title="deviceTitle" style="width: 30%" size="huge" bordered auto-focus @before-leave="onAddEditClose">
      <Device>
        <template #submit="slotProps">
          <n-button type="primary" @click="onAddEditSubmit(slotProps, 'Device')">确定</n-button>
          <n-button @click="onAddEditClose">取消</n-button>
        </template>
      </Device>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { columns } from "./columns";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import page from "@/components/pagination/index.vue";
import { addRole, updateRole, getRoleInfo, getRoleList, setRoleBindMenu } from "@/api/role";
import { getSysConfig } from "@/api/config";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { UploadFileInfo, useDialog, useMessage } from "naive-ui";
// 引入分配菜单
import Menu from "./menu.vue";
// 引入分配接口
import Interface from "./interface.vue";
// 获取分配接口详情、设置分配接口
import { getRoleBindCompetence, setRoleBindCompetence } from "@/api/role";
// 引入分配设备
import Device from "./device.vue";

const SysConfig = (await getSysConfig()).Data;
const searchData = ref<role.roleData>({});
const tableData = ref<role.roleList[]>([]);
const dialog = useDialog();
const fileidList = ref<any[]>([]);
const message = useMessage();
const roleId = ref("");
// 新增弹窗显示
const showModal = ref(false);
const dialogTitle = ref("");
// 新增弹窗的变量
const dialogoption = reactive({
  ConfirmBtnText: "保存",
  title: dialogTitle,
});
// 分配菜单
const showMenu = ref(false);
const menuTitle = ref("");
let menuInfo = ref<any>([]);
// 分配接口
const showInterface = ref(false);
const interfaceTitle = ref("");
// 分配设备
const showDevice = ref(false);
const deviceTitle = ref("");

// 提交分配菜单或接口或设备数据
const onAddEditSubmit = async (slotProps: any, title: string) => {
  const { formData } = slotProps;
  if (title == "Menu") {
    console.log("提交分配菜单数据", formData);
    let data = (await setRoleBindMenu({ roleId: roleId.value, menuIdList: formData })).State;
    if (data == 1) {
      onAddEditClose();
    }
  } else if (title == "Interface") {
    console.log("提交分配接口数据", formData);
    let data = (await setRoleBindCompetence({ roleId: roleId.value, competenceIdList: formData })).State;
    if (data == 1) {
      onAddEditClose();
    }
  } else {
    console.log("提交分配设备数据", formData);
  }
};

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
  fileidList.value = [];
}
// 保存新增弹窗
function confirm() {
  submit();
}

// 关闭分配弹窗事件
const onAddEditClose = () => {
  showMenu.value = false;
  showInterface.value = false;
  showDevice.value = false;
};

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
    label: "角色名称",
    componentProps: {
      placeholder: "请输入角色名称",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入角色名称", trigger: ["blur"] }],
  },
  {
    field: "roleCode",
    component: "NInput",
    label: "角色编码",
    componentProps: {
      placeholder: "请输入角色编码",
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
    addRole(values).then((res) => {
      close();
      getTableData();
    });
  } else {
    updateRole(values).then((res) => {
      close();
      getTableData();
    });
  }
}
const actionColumn = reactive({
  title: "操作",
  key: "action",
  width: 420,
  fixed: "right",
  align: "center",
  render(record: Recordable<any>) {
    return h(TableAction as any, {
      style: "text",
      actions: [
        {
          label: "编辑",
          //   icon: AppstoreAddOutlined,
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
        {
          label: "分配菜单",
          onClick: handleMenu.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
        {
          label: "分配接口",
          onClick: handleInterface.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
        {
          label: "分配设备",
          onClick: handleDevice.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
      ],
    });
  },
});

// 编辑页
async function handleEdit(record: Recordable) {
  roleId.value = record.id;
  showModal.value = true;
  dialogTitle.value = "编辑";
  let resdata = (await getRoleInfo(record.id)).Data;
  setTimeout(() => {
    setFieldsValue(resdata);
  }, 10);
}
// 分配菜单页
const handleMenu = async (record: Recordable) => {
  roleId.value = record.id;
  showMenu.value = true;
  menuTitle.value = "分配菜单--" + record.name;
};
// 分配接口页
const handleInterface = (record: Recordable) => {
  roleId.value = record.id;
  showInterface.value = true;
  interfaceTitle.value = "分配接口--" + record.name;
};
// 分配设备页
const handleDevice = (record: Recordable) => {
  roleId.value = record.id;
  showDevice.value = true;
  deviceTitle.value = "分配设备--" + record.name;
};

// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "name",
    component: "NInput",
    label: "角色名称",
    componentProps: {
      placeholder: "请输入角色名称",
    },
  },
];
// 搜索参数
const [register, {}] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 100,
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
});
/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (await getRoleList(data.selectData ? data.selectData : { ...pageOption.value })).Data;
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
