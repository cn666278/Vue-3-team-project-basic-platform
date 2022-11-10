<template>
  <div>
    <TableListTemplate>
      <template #operate>
        <n-space justify="end">
          <n-button strong secondary type="info">
            <n-button text @click="addTable">
              <n-icon :size="20">
                <AppstoreAddOutlined />
              </n-icon>
              新增
            </n-button>
          </n-button>
        </n-space>
      </template>
      <template #search>
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        </BasicForm>
      </template>
      <template #table>
        <BasicTable :columns="columns" :pagination="false" :dataSource="data.list" :scroll-x="1500"></BasicTable>
      </template>
      <template #page>
        <page :current-page="pageOption?.currentPage" :page-size="pageOption?.pageSize"
          :total-page="pageOption?.totalPage" :total-count="pageOption?.totalCount" @page-change="pageHandle"
          @page-size-change="pageSizeHandle" />
      </template>
    </TableListTemplate>
    <Dialog v-model:showModal="showModal" :option="dialogoption" @close="close" @confirm="confirm">
      <BasicForm @register="addregister" @submit="addSubmit"> </BasicForm>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { BasicTable } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
// page control
import page from "@/components/pagination/index.vue";
import type { PaginationType } from "@/components/pagination/index";
// add button
import Dialog from "@/components/dialog/index.vue";
import { MD5Encrypt } from "@/utils/login";
import {
  addMember,
  updateMember,
} from "@/api/member";
import { AppstoreAddOutlined } from "@vicons/antd";
// MemberDeviceList
import { columns } from "./columns"; // 列表数据
import { InitData } from "@/typings/memberDeviceList"; //初始化数据列表
import { getMemberDeviceList } from "@/api/appManage";

// 新增弹窗显示
const showModal = ref(false);
const dialogTitle = ref("");
// 新增弹窗的变量
const dialogoption = reactive({
  ConfirmBtnText: "保存",
  title: dialogTitle,
});
/**点击新增按钮 */
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
// 新增按扭表单   
const addschemas: FormSchema[] = [
  {
    field: "id",
    component: "NInput",
    label: "ID",
    componentProps: {
      placeholder: "请输入id",
      onInput: (e: any) => { },
    },
    rules: [{ required: true, message: "请输入ID", trigger: ["blur"] }],
  },
  {
    field: "terminalNo",
    component: "NInput",
    label: "设备号",
    componentProps: {
      placeholder: "请输入设备号",
      onInput: (e: any) => { },
    },
    rules: [{ required: true, message: "请输入设备号", trigger: ["blur"] }],
  },
  {
    field: "memberNick",
    component: "NInput",
    label: "用户昵称",
    componentProps: {
      placeholder: "请输入用户昵称",
      onInput: (e: any) => { },
    },
    rules: [{ required: true, message: "请输入用户昵称", trigger: ["blur"] }],
  },
  {
    field: "memberPhone",
    component: "NInput",
    label: "手机号",
    componentProps: {
      placeholder: "请输入手机号码",
      showButton: false,
      onInput: (e: any) => { },
    },
    rules: [{ required: true, message: "请输入手机号", trigger: ["blur"] }],
  },
  {
    field: "createDate",
    component: "NInput",
    label: "绑定日期",
    componentProps: {
      placeholder: "请输入绑定日期",
      showButton: false,
      onInput: (e: any) => { },
    },
    rules: [{ required: true, message: "请输入绑定日期", trigger: ["blur"] }],
  },
  {
    field: "expirationDate",
    component: "NInput",
    label: "有效期",
    componentProps: {
      placeholder: "请输入有效期",
      showButton: false,
      onInput: (e: any) => { },
    },
    rules: [{ required: true, message: "请输入有效期", trigger: ["blur"] }],
  },
];
/**新增表单 */
const [addregister, { submit, updateSchema }] = useForm({
  gridProps: { cols: 1 }, // grid 布局设计为仅一列 cols:columns
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

/**搜索数据 */
const schemas: FormSchema[] = [
  {
    field: "name",
    component: "NInput",
    label: "关键字",
    componentProps: {
      placeholder: "名称",
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: "phone",
    component: "NInput",
    label: "手机号",
    componentProps: {
      placeholder: "手机号搜索",
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: "terminalNo",
    component: "NInput",
    label: "设备号",
    componentProps: {
      placeholder: "设备号搜索",
      onInput: (e: any) => {
        console.log(e);
      },
    },
  }
];
/**搜索参数 */
const [register, { }] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 65,
  schemas,
});
/**搜索查询 */
function handleSubmit(values: Recordable) {
  data.selectData.name = values.name; // ERROR ??? 查询参数 name/memberNick
  data.selectData.phone = values.phone;
  data.selectData.terminalNo = values.terminalNo;
  getTableData();
}
/**搜索重置 */
function handleReset(values: Recordable) {
  Object.keys(data.selectData).forEach((key) => {
    // 把除了 currentPage 和 pageSize 之外的其他参数设为 undefined
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
/**页数改变触发事件 */
const pageHandle = (page: number) => {
  pageOption.value.currentPage = page;
  getTableData();
};
/**每页页数大小改变触发事件 */
const pageSizeHandle = (pageSize: number) => {
  pageOption.value.pageSize = pageSize;
  getTableData();
};
/**加载 */
onMounted(() => {
  getTableData();
});

/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }

  // 列表插入序列(序号)
  let sequence = {
    title: '序号',
    key: 'no',
    width: 20,
    render: (_: any, index: number) => {
      return `${index + 1 + ((pageOption.value.currentPage - 1) * pageOption.value.pageSize)}`
    }
  };
  columns[0] = sequence

  // ? 查找到数据就把 data.selectData 传给函数 getMemberDeviceList，
  // 如果查找不到数据则传递 pageOption 的所有参数
  const Data = (await getMemberDeviceList(
    data.selectData ? data.selectData : { ...pageOption.value }
  )).Data

  data.list = Data.data;
  let pageData: PaginationType = {
    currentPage: Data.currentPage,
    pageSize: Data.pageSize,
    totalCount: Data.totalCount,
    totalPage: Data.totalPage,
  };
  pageOption.value = pageData;
  // console.log(Data.data) // test use only
  return Data.data;
};

</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
  