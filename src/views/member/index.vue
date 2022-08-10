<template>
  <div>
    <h1>用户管理</h1>
    <div class="search">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
      >
      </BasicForm>
    </div>
    <!-- <BasicTable
      :Total="totalCount"
      :columns="columns"
      :dataSource="data.list"
      @change-page="changePage"
      @change-page-size="changePageSize"
    >
    </BasicTable> -->
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="990"
    >
    </BasicTable>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref, toRaw } from "vue";
import { columns } from "./columns";
// import BasicTable from "@/components/Table/index.vue";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { getMemberList } from "@/api/member";
import { InitData } from "@/typings/member";
import { NAvatar, NTag, NButton } from "naive-ui";
const actionColumn = reactive({
  width: 220,
  title: "操作",
  key: "action",
  fixed: "right",
  render(record: Recordable<any>) {
    return h(TableAction as any, {
      style: "text",
      actions: [
        {
          label: "删除",
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
        },
        {
          label: "编辑",
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          },
        },
      ],
      dropDownActions: [
        {
          label: "启用",
          key: "enabled",
          // 根据业务控制是否显示: 非enable状态的不显示启用按钮
          ifShow: () => {
            return true;
          },
        },
        {
          label: "禁用",
          key: "disabled",
          ifShow: () => {
            return true;
          },
        },
      ],
    });
  },
});
function handleEdit(record: Recordable) {
  console.log("点击了编辑", record);
}

function handleDelete(record: Recordable) {
  console.log("点击了删除", record);
}
const loadDataTable = async (res: any) => {
    return await getMemberList({ ...data.selectData, ...res });
};
const deltableData = (row: any) => {
  console.log(row);
};
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
const totalCount: Ref<number> = ref(0);
const data = reactive(new InitData());
onMounted(() => {
  // getTableData();
  // columns.push(actionColumn);
});
/**获取列表数据 */
const getTableData = async () => {
  await getMemberList(data.selectData)
    .then((res) => {
      data.list = res.Data.data;
      totalCount.value = res.Data.totalCount;
    })
    .finally(() => {});
};
// 页码变化
const changePage = (val: any) => {
  data.selectData.currentPage = val;
  getTableData();
};
// 页码尺寸变化
const changePageSize = (val: any) => {
  data.selectData.pageSize = val;
  data.selectData.currentPage = 1;
  getTableData();
};
</script>
<style lang="scss">
.search {
  margin-bottom: 10px;
}
</style>
