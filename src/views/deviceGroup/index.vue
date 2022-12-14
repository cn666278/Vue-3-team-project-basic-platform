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
        <BasicTable :columns="columns" :pagination="false" :dataSource="data.list" ref="actionRef" :row-key="rowKey" :expanded-row-keys="expendKeys" @update-expanded-row-keys="expendKeysHandle" :actionColumn="actionColumn" @tableReload="getTableData"></BasicTable>
      </template>
      <template #page>
        <page :current-page="pageOption?.currentPage" :page-size="pageOption?.pageSize" :total-page="pageOption?.totalPage" :total-count="pageOption?.totalCount" @page-change="pageHandle" @page-size-change="pageSizeHandle" />
      </template>
    </TableListTemplate>
    <Dialog v-model:showModal="showModal" :option="dialogoption" @close="close" @confirm="confirm">
      <BasicForm @register="addregister" @submit="addSubmit"> </BasicForm>
    </Dialog>
    <Dialog v-model:showModal="relationRoleType" :option="dialogoption" width="800px" @close="close" @confirm="closeRelationRole">
      <relationRole :id="editId" @submit="setBindRole" />
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref, watch } from "vue";
import { NTag, DataTableColumn, DataTableRowKey, PaginationProps, TreeSelectOption, NButton } from "naive-ui";
import { columns } from "./columns";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import page from "@/components/pagination/index.vue";
import { getBusinessGroupList, addBusinessGroup, getBusinessGroupInfo, UpdateBusinessGroup, setBusinessGroupBindRole } from "@/api/businessGroup";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { transformTozTreeFormat } from "@/utils/common";
import relationRole from "./relationRole.vue";
const searchData = ref<BusinessGroup.BusinessGroupData>({});
const tableData = ref<BusinessGroup.BusinessGroupList[]>([]);
// 新增弹窗显示
const showModal = ref(false);
const relationRoleType = ref(false);
const dialogTitle = ref("");
let editId: Ref<string | undefined> = ref(undefined);
let roleIds = ref<any>([]);
// 业务分组数据
let businessGroupData: Ref<any[]> = ref([
  {
    id: "",
    name: "无父级",
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
  relationRoleType.value = false;
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
    field: "pid",
    component: "NTreeSelect",
    label: "父级名称",
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
    field: "name",
    component: "NInput",
    label: "业务分组名称",
    componentProps: {
      placeholder: "请输入业务分组名称",
      onInput: (e: any) => {},
    },
    rules: [{ required: true, message: "请输入业务分组名称", trigger: ["blur"] }],
  },
  {
    field: "needCheck",
    component: "NSwitch",
    label: "是否需授权",
    componentProps: {},
  },

  {
    field: "paramString",
    component: "NInput",
    label: "预留业务参数(字符)",
    componentProps: {
      placeholder: "请输入预留业务参数",
      onInput: (e: any) => {},
    },
  },
  {
    field: "paramInt",
    component: "NInputNumber",
    label: "预留业务参数(整数)",
    componentProps: {
      placeholder: "请输入预留业务参数",
      onInput: (e: any) => {},
    },
  },
  {
    field: "paramDecimal",
    component: "NInput",
    label: "预留业务参数(decimal)",
    componentProps: {
      placeholder: "请输入预留业务参数",
      onInput: (e: any) => {},
    },
  },
  {
    field: "isEnable",
    component: "NSwitch",
    label: "是否启用",
    componentProps: {},
  },
  {
    field: "speedLimit",
    component: "NInputNumber",
    label: "排序",
    componentProps: {
      placeholder: "请输入排序",
      onInput: (e: any) => {},
    },
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
    // let res = await addBusinessGroup(values);
    addBusinessGroup(values).then((res) => {
      showModal.value = false;
      // message.success("新建成功");
      getTableData();
    });
  } else {
    UpdateBusinessGroup(values).then((res) => {
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
          label: "关联角色",
          onClick: onRelationRole.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
      ],
    });
  },
});
// 关联角色
function onRelationRole(record: Recordable) {
  editId.value = record.id;
  relationRoleType.value = true;
  dialogTitle.value = "关联角色";
}
// 关闭关联角色弹窗
function closeRelationRole() {
  setBusinessGroupBindRole({ businessGroupId: editId.value, roleIdList: roleIds.value }).then((res) => {
    relationRoleType.value = false;
  });
}

async function handleEdit(record: Recordable) {
  // console.log("点击了编辑用户", record);
  showModal.value = true;
  dialogTitle.value = "编辑";
  let resdata = (await getBusinessGroupInfo(record.id)).Data;
  setTimeout(() => {
    setFieldsValue(resdata);
  }, 10);
}

// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "name",
    component: "NInput",
    label: "业务分组名称",
    componentProps: {
      placeholder: "请输入业务分组名称",
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
  pageSize: 100,
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
  getBusinessGroupData();
});
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

// 设置业务分组
const setBindRole = (item: any) => {
  console.log(item);
  roleIds.value = item;
};

/**获取列表数据 */
const getTableData = async () => {
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (await getBusinessGroupList(data.selectData ? data.selectData : { ...pageOption.value })).Data;
  data.list = transformTozTreeFormat(Data.data);
  let pageData: PaginationType = {
    currentPage: Data.currentPage,
    pageSize: Data.pageSize,
    totalCount: Data.totalCount,
    totalPage: Data.totalPage,
  };
  pageOption.value = pageData;
  return Data.data;
};

/**行Key设置 */
const rowKey = (row: admin.menuList) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const expendKeysHandle = (keys: DataTableRowKey[]) => {
  expendKeys.value = keys;
};
</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
