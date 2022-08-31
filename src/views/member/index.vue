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
import { getMemberList } from "@/api/member";
import { InitData } from "@/typings/member";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
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
// 保存新增弹窗
function confirm() {
  // showModal.value = false;
  submit();
}
const addschemas: FormSchema[] = [
  {
    field: "account",
    component: "NInput",
    label: "账号名称",
    componentProps: {
      placeholder: "请输入账号名称",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入账号名称", trigger: ["blur"] }],
  },
  {
    field: "nick",
    component: "NInput",
    label: "名称",
    componentProps: {
      placeholder: "请输入名称",
      onInput: (e: any) => {},
    }
  },
  {
    field: "passWord",
    component: "NInput",
    label: "密码",
    componentProps: {
      placeholder: "请输入密码",
      onInput: (e: any) => {},
    }
  },
  {
      field: 'roleName',
      component: 'NSelect',
      label: '角色',
      componentProps: {
        placeholder: '请选择角色',
        options: [
          {
            label: '舒适性',
            value: 1,
          },
          {
            label: '经济性',
            value: 2,
          },
        ],
        onUpdateValue: (e: any) => {
        },
      },
    },
  {
    field: "phone",
    component: "NInputNumber",
    label: "手机",
    componentProps: {
      placeholder: "请输入手机号码",
      showButton: false,
      onInput: (e: any) => {},
    },
  },
  {
    field: "isAdmin",
    component: "NSwitch",
    label: "是否后台用户",
    componentProps: {
    },
  },
  {
    field: "isEnable",
    component: "NSwitch",
    label: "是否启用",
    componentProps: {
    },
  },
];
// 新增表单
const [addregister, { setFieldsValue, submit }] = useForm({
  gridProps: { cols: 1 },
  collapsedRows: 3,
  labelWidth: 100,
  layout: "horizontal",
  showActionButtonGroup: false,
  schemas: addschemas,
});
function addSubmit(values: Recordable) {
  console.log(values);
}
// 编辑弹窗显示
const editshowModal = ref(false);

// 点击编辑按钮
function editTable() {
  editshowModal.value = true;
  dialogTitle.value = "编辑用户";
}
// 关闭编辑弹窗
function editclose() {
  editshowModal.value = false;
}
// 保存编辑弹窗
function editconfirm() {
  // showModal.value = false;
  // submit();
}
function editSubmit(values: Recordable) {
  console.log(values);
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
          label: "修改密码",
          onClick: Editpassword.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
        },
        {
          label: "编辑用户",
          onClick: handleEdit.bind(null, record),
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
      ],
    });
  },
});
function Editpassword(record: Recordable) {
  console.log("点击了修改密码", record);
}

function handleEdit(record: Recordable) {
  // console.log("点击了编辑用户", record);
  showModal.value = true;
  dialogTitle.value = "编辑用户";
  setTimeout(() => {
    setFieldsValue(record);
  }, 0);
}
function handleIsenable(record: Recordable) {
  console.log("点击了启用/禁用", record);
}
// const loadDataTable = async (res: any) => {
//   return await getMemberList({ ...data.selectData, ...res });
// };
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
const data = reactive(new InitData());
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
  console.log(data.selectData);
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (
    await getMemberList(
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
