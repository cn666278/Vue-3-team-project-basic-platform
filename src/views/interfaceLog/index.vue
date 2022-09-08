<template>
  <div>
    <TableListTemplate>
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
        <!-- <page
          :current-page="pageOption?.currentPage"
          :page-size="pageOption?.pageSize"
          @page-change="pageHandle"
          @page-size-change="pageSizeHandle"
          simple
        /> -->
        <n-pagination
          :page="pageOption?.currentPage"
          :page-size="pageOption?.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :page-count="100"
          @update-page="pageHandle"
          show-size-picker
          show-quick-jumper
          @update-page-size="pageSizeHandle"
          simple
        />
      </template>
    </TableListTemplate>
    <Dialog
      v-model:showModal="showModal"
      :option="dialogoption"
      @close="close"
      :btn-show="false"
    >
      <div
        
        style="white-space: pre-wrap; line-height: 30px;max-height: 80vh;overflow: auto;"
        v-html="chakan"
      ></div>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import TableListTemplate from "@/components/TableListTemplate/index.vue";
import Dialog from "@/components/dialog/index.vue";
import { getWebLogList, getCompetenceControllerList } from "@/api/interfaceLog";
import type { PaginationType } from "@/components/pagination/index";
import { AppstoreAddOutlined } from "@vicons/antd";
import { formatDateTime } from "@/utils/common";
import moment from "moment";
const searchData = ref<WebLog.WebLogdata>({});
const tableData = ref<WebLog.WebLogList[]>([]);
const controllerList = ref();
const beginDate = ref();
const endDate = ref();
const chakan = ref();
// 关闭新增弹窗
function close() {
  showModal.value = false;
}
// 弹窗显示
const showModal = ref(false);
const dialogTitle = ref("");
// 弹窗的变量
const dialogoption = reactive({
  ConfirmBtnText: "保存",
  title: dialogTitle,
});
function handleSee(row: string) {
  // console.log("点击了", row);
  showModal.value = true;
  dialogTitle.value = "查看";
  if (row.slice(0, 1) === "{") {
    const chakanList = JSON.parse(row);
    chakan.value = syntaxHighlight(chakanList);
  }else{
    chakan.value=row
  }
}
function syntaxHighlight(json: any) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match: any) {
      return match;
    }
  );
}
const columns: any[] = [
  {
    title: "控制器/接口名称",
    key: "controller",
    width: 250,
    render(row: any) {
      return row.controller + "/" + row.actionName;
    },
  },
  {
    title: "用户名称",
    key: "nick",
    width: 130,
  },
  {
    title: "操作详情",
    key: "message",
    width: 120,
  },
  {
    title: "类型",
    key: "type",
    width: 150,
  },
  {
    title: "响应状态",
    key: "resultState",
    width: 100,
  },
  {
    title: "耗时（毫秒）",
    key: "time",
    width: 120,
    render(row: any) {
      return row.time * 1000;
    },
  },
  {
    title: "TOKEN",
    key: "token",
    width: 220,
    ellipsis: true,
    cellProps: (rowData: { token: string }, rowIndex: number) => {
      if (rowData.token !== "") {
        return {
          style: "cursor: pointer;",
          onClick: () => {
            handleSee(rowData.token);
          },
        };
      }
    },
  },
  {
    title: "请求参数",
    key: "param",
    width: 100,
    ellipsis: true,
    cellProps: (rowData: { param: string }, rowIndex: number) => {
      if (rowData.param !== "") {
        return {
          style: "cursor: pointer;",
          onClick: () => {
            handleSee(rowData.param);
          },
        };
      }
    },
  },
  {
    title: "返回参数",
    key: "result",
    width: 220,
    ellipsis: true,
    cellProps: (rowData: { result: string }, rowIndex: number) => {
      if (rowData.result !== "") {
        return {
          style: "cursor: pointer;",
          onClick: () => {
            handleSee(rowData.result);
          },
        };
      }
    },
  },
  {
    title: "访问时间",
    key: "createDate",
    width: 200,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
];
// 搜索数据
const schemas: FormSchema[] = [
  {
    field: "actionName",
    component: "NInput",
    label: "接口名称",
    componentProps: {
      placeholder: "请输入接口名称",
    },
  },
  {
    field: "controller",
    component: "NSelect",
    label: "控制器名称",
    componentProps: {
      labelField: "name",
      valueField: "name",
      placeholder: "请选择控制器名称",
      options: controllerList,
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
      defaultFormattedValue: beginDate,
      clearable: true,
      onUpdateFormattedValue: (e: any) => {
        data.selectData.beginTime = e;
      },
    },
  },
  {
    field: "endTime",
    component: "NDatePicker",
    label: "结束时间",
    componentProps: {
      type: "datetime",
      defaultFormattedValue: endDate,
      format: "yyyy-MM-dd HH:mm:ss",
      clearable: true,
      onUpdateFormattedValue: (e: any) => {
        data.selectData.endTime = e;
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
  data.selectData.actionName = values.actionName;
  data.selectData.controller = values.controller;
  // console.log(values);
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
  getcontrollerData();
  //   设置搜索表单的初始值
  let resdata = {
    protocol: 1,
  };
  beginDate.value = moment().format("YYYY-MM-DD 00:00:00");
  endDate.value = moment().format("YYYY-MM-DD 23:59:59");
  setTimeout(() => {
    setFieldsValue(resdata);
    data.selectData.beginTime = beginDate.value;
    data.selectData.endTime = endDate.value;
    getTableData();
  }, 10);
});

/**获取枚举列表 */
const getcontrollerData = async () => {
  const RoteData: any = (await getCompetenceControllerList()).Data;
  const newArr = reactive([] as any[]);
  RoteData.forEach((e: any) => {
    let name = e;
    newArr.push({
      name,
    });
  });
  controllerList.value = newArr;
};
/**获取列表数据 */
const getTableData = async () => {
  // console.log(data.selectData);
  if (data.selectData) {
    data.selectData.currentPage = pageOption.value?.currentPage;
    data.selectData.pageSize = pageOption.value?.pageSize;
  }
  const Data = (
    await getWebLogList(
      data.selectData ? data.selectData : { ...pageOption.value }
    )
  ).Data;
  data.list = Data;
  let pageData: PaginationType = {
    currentPage: pageOption.value?.currentPage,
    pageSize: pageOption.value?.pageSize,
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
