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
      v-model:showModal="editshowModal"
      :option="dialogoption"
      @close="editclose"
      @confirm="editconfirm"
    >
      <BasicForm @register="editregister" @submit="editSubmit"> </BasicForm>
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
  getMemberList,
  addMember,
  getMemberInfo,
  updateMember,
  updateMemberPwd,
  setMemberIsEnable
} from "@/api/member";
import { getRoleList } from "@/api/role";
import { InitData } from "@/typings/member";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { useMessage, useDialog } from "naive-ui";
import { values } from "lodash";
const message = useMessage();
const dialog = useDialog();
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
const rolesList = ref();
const addschemas: FormSchema[] = [
  {
    field: "id",
    label: "",
    giProps: {
      span: 0,
    },
  },
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
    },
  },
  {
    field: "passWord",
    component: "NInput",
    label: "密码",
    componentProps: {
      inputProps: {
        autocomplete: "new-password",
      },
      type: "password",
      showPasswordOn: "click",
      placeholder: "请输入密码",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入密码", trigger: ["blur"] }],
  },
  {
    field: "roleIdList",
    component: "NSelect",
    label: "角色",
    componentProps: {
      labelField: "name",
      valueField: "id",
      placeholder: "请选择角色",
      multiple: true,
      options: rolesList,
      onUpdateValue: (e: any) => {},
    },
    rules: [
      {
        type: "array",
        required: true,
        message: "请选择角色",
        trigger: ["blur", "change"],
      },
    ],
  },
  {
    field: "phone",
    component: "NInput",
    label: "手机号",
    componentProps: {
      placeholder: "请输入手机号码",
      showButton: false,
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入手机号", trigger: ["blur"] }],
  },
  {
    field: "isAdmin",
    component: "NSwitch",
    label: "是否后台用户",
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
    // let res = await addMember(values);
    values.passWord = MD5Encrypt(values.passWord);
    addMember(values).then((res) => {
      showModal.value = false;
      // message.success("新建成功");
      getTableData();
    });
  } else {
    console.log(values);
    updateMember(values).then((res) => {
      showModal.value = false;
      // message.success("编辑成功");
      getTableData();
    });
  }
}
// 修改密码弹窗显示
const editshowModal = ref(false);
// 关闭修改密码弹窗
function editclose() {
  editshowModal.value = false;
}
// 保存修改密码弹窗
function editconfirm() {
  // showModal.value = false;
  editMethods.submit();
}
const editschemas: FormSchema[] = [
  {
    field: "memberId",
    label: "",
    giProps: {
      span: 0,
    },
  },
  {
    field: "newPwd",
    component: "NInput",
    label: "新密码",
    componentProps: {
      inputProps: {
        autocomplete: "new-password",
      },
      type: "password",
      showPasswordOn: "click",
      placeholder: "请输入密码",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入密码", trigger: ["blur"] }],
  },
];
// 修改密码表单
const [editregister, editMethods] = useForm({
  gridProps: { cols: 1 },
  collapsedRows: 3,
  labelWidth: 100,
  layout: "horizontal",
  showActionButtonGroup: false,
  schemas: editschemas,
});
async function editSubmit(values: Recordable) {
  // console.log(values);
  values.newPwd = MD5Encrypt(values.newPwd);
  updateMemberPwd(values).then(() => {
    editshowModal.value = false;
  });
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
  // console.log("点击了修改密码", record);
  let editdata = {
    memberId: record.id,
  };
  editshowModal.value = true;
  dialogTitle.value = "修改密码";
  setTimeout(() => {
    editMethods.setFieldsValue(editdata);
  }, 10);
}

async function handleEdit(record: Recordable) {
  // console.log("点击了编辑用户", record);
  showModal.value = true;
  dialogTitle.value = "编辑用户";
  let resdata = (await getMemberInfo(record.id)).Data;
  setTimeout(() => {
    updateSchema({
      field: "passWord",
      giProps: {
        span: 0,
      },
    });
    setFieldsValue(resdata);
  }, 10);
}
function handleIsenable(record: Recordable) {
  // console.log("点击了启用/禁用", record);
  if (record.isEnable === false) {
    dialog.create({
      title: "警告",
      content: "您确定启用该用户？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        let opendata={
          id:record.id,
          isEnable:true
        }
        setMemberIsEnable(opendata).then(()=>{
          getTableData()
        })
       
      },
      onNegativeClick: () => {},
    });
  }else{
    dialog.create({
      title: "警告",
      content: "您确定禁用该用户？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        let offdata={
          id:record.id,
          isEnable:false
        }
        setMemberIsEnable(offdata).then(()=>{
          getTableData()
        })
      },
      onNegativeClick: () => {},
    });
  }
}
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
  getRoleData();
});
/**获取角色列表 */
const getRoleData = async () => {
  let formInline = {
    name: "",
    currentPage: 1,
    pageSize: 999999,
  };
  const RoteData = (await getRoleList(formInline)).Data.data;
  rolesList.value = RoteData;
};
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
